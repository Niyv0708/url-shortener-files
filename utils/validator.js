const dns = require('dns').promises;
const { URL } = require('url');

const validateUrlFormat = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (err) {
    return false;
  }
};

module.exports = { validateUrlFormat };  