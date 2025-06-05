/**
 * @file Supabase 数据库连接与操作封装
 * @description 使用 Supabase 作为数据库服务
 */

const { createClient } = require('@supabase/supabase-js');

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * 初始化数据库（如建表）
 * @returns {Promise<void>}
 */
async function initDatabase() {
  try {
    // 创建 pages 表
    const { error } = await supabase.rpc('create_pages_table_if_not_exists');
    if (error) {
      console.error('创建表失败:', error);
      throw error;
    }
    console.log("数据库初始化成功");
  } catch (error) {
    console.error("数据库初始化失败:", error);
    throw error;
  }
}

/**
 * 通用查询
 * @param {string} table
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function query(table, options = {}) {
  const { data, error } = await supabase
    .from(table)
    .select(options.select || '*')
    .match(options.match || {})
    .order(options.order || 'created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * 查询单行
 * @param {string} table
 * @param {Object} match
 * @returns {Promise<Object>}
 */
async function get(table, match = {}) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .match(match)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // 记录不存在
    throw error;
  }
  return data;
}

/**
 * 执行写操作
 * @param {string} table
 * @param {Object} data
 * @param {string} operation - 'insert' | 'update' | 'delete'
 * @param {Object} match - 用于 update 和 delete 操作
 * @returns {Promise<Object>}
 */
async function run(table, data, operation = 'insert', match = {}) {
  let result;
  
  switch (operation) {
    case 'insert':
      result = await supabase
        .from(table)
        .insert(data)
        .select();
      break;
    case 'update':
      result = await supabase
        .from(table)
        .update(data)
        .match(match)
        .select();
      break;
    case 'delete':
      result = await supabase
        .from(table)
        .delete()
        .match(match);
      break;
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }

  if (result.error) throw result.error;
  
  return {
    insertId: result.data?.[0]?.id,
    affectedRows: result.data?.length || 0
  };
}

module.exports = {
  supabase,
  initDatabase,
  query,
  get,
  run,
};
