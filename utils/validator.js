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

/**
 * 检查域名是否可解析
 * @param {string} url - 待检查的URL
 * @returns {Promise<boolean>} 域名是否有效
 */
const checkDomainValidity = async (url) => {
  try {
    const parsed = new URL(url);
    await dns.lookup(parsed.hostname);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { validateUrlFormat, checkDomainValidity };
  