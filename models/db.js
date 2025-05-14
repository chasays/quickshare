/**
 * @file MySQL 数据库连接与操作封装
 * @description 适用于 Vercel Serverless 环境
 */

const mysql = require("mysql2/promise");

/**
 * 创建 MySQL 连接池
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * 初始化数据库（如建表）
 * @returns {Promise<void>}
 */
async function initDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS pages (
      id VARCHAR(255) PRIMARY KEY,
      html_content TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      password VARCHAR(255),
      is_protected TINYINT DEFAULT 0,
      code_type VARCHAR(32) DEFAULT 'html'
    )
  `;
  const conn = await pool.getConnection();
  try {
    await conn.query(createTableSQL);
    console.log("数据库初始化成功");
  } finally {
    conn.release();
  }
}

/**
 * 通用查询
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Array>}
 */
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/**
 * 查询单行
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Object>}
 */
async function get(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows[0] || null;
}

/**
 * 执行写操作
 * @param {string} sql
 * @param {Array} params
 * @returns {Promise<Object>}
 */
async function run(sql, params = []) {
  const [result] = await pool.query(sql, params);
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

module.exports = {
  pool,
  initDatabase,
  query,
  get,
  run,
};
