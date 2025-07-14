const Url = require('../../models/Url');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // 验证short_url是否为数字（增强正则）
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'invalid short url' });
  }

  try {
    // 明确转换为数字类型查询
    const urlData = await Url.findOne({ short_url: Number(id) });
    if (!urlData) {
      return res.status(404).json({ error: 'No short URL found' });
    }

    // 重定向（确保原始URL包含协议，避免浏览器报错）
    return res.redirect(urlData.original_url.startsWith('http') 
      ? urlData.original_url 
      : `http://${urlData.original_url}`);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
  