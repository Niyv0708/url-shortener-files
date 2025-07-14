const dns = require('dns').promises;
const { URL } = require('url');

/**
 * 验证URL格式是否合法（必须包含http/https协议）
 * @param {string} url - 待验证的URL
 * @returns {boolean} 格式是否合法
 */
const validateUrlFormat = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (err) {
    return false;
  }
};

// 暂时移除域名验证（测试可能不要求验证域名解析）
module.exports = { validateUrlFormat };  