const Url = require('../../models/Url');

module.exports = async (req, res) => {
  // 只允许GET方法
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // 验证short_url是否为数字
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'invalid short url' });
  }

  try {
    // 查询原始URL
    const urlData = await Url.findOne({ short_url: Number(id) });
    if (!urlData) {
      return res.status(404).json({ error: 'No short URL found for the given input' });
    }

    // 重定向到原始URL
    return res.redirect(urlData.original_url);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
  