const { supabase } = require("./db");
const CryptoJS = require("crypto-js");

/**
 * 生成随机密码
 * @returns {string}
 */
function generateRandomPassword() {
  return Math.random().toString(36).slice(-6);
}

/**
 * 创建新页面
 * @param {string} htmlContent
 * @param {boolean} isProtected
 * @param {string} codeType
 * @returns {Promise<{urlId: string, password: string}>}
 */
async function createPage(htmlContent, isProtected = false, codeType = "html") {
  try {
    // 生成时间戳
    const timestamp = new Date().getTime().toString();

    // 生成短ID (7位)
    const hash = CryptoJS.MD5(htmlContent + timestamp).toString();
    const urlId = hash.substring(0, 7);

    // 无论是否启用保护，都生成密码
    const password = generateRandomPassword();
    console.log("生成密码:", password);

    // 保存到数据库
    const { error } = await supabase
      .from('pages')
      .insert({
        id: urlId,
        html_content: htmlContent,
        created_at: Date.now(),
        password: password,
        is_protected: isProtected,
        code_type: codeType
      });

    if (error) {
      console.error("创建页面错误1:", error);
      throw error;
    }

    return { urlId, password };
  } catch (error) {
    console.error("创建页面错误2:", error);
    throw error;
  }
}

/**
 * 根据ID获取页面
 * @param {string} id
 * @returns {Promise<Object>}
 */
async function getPageById(id) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("获取页面错误:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("获取页面错误:", error);
    throw error;
  }
}

/**
 * 获取最近的页面列表
 * @param {number} limit
 * @returns {Promise<Array>}
 */
async function getRecentPages(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("获取最近页面错误:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("获取最近页面错误:", error);
    throw error;
  }
}

module.exports = {
  createPage,
  getPageById,
  getRecentPages,
};
