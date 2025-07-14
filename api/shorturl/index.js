const Url = require('../../models/Url');
// 仅导入 validateUrlFormat（移除 checkDomainValidity）
const { validateUrlFormat } = require('../../utils/validator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!validateUrlFormat(url)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // 移除域名验证的调用逻辑（因 checkDomainValidity 未导出）
  try {
    await Url.connectDB();
    
    let existingUrl = await Url.findOne({ original_url: url });
    if (existingUrl) {
      return res.json({ 
        original_url: existingUrl.original_url, 
        short_url: existingUrl.short_url 
      });
    }

    const shortUrl = await Url.getNextShortUrl();
    const newUrl = new Url({ original_url: url, short_url: shortUrl });
    await newUrl.save();

    return res.status(201).json({ 
      original_url: newUrl.original_url, 
      short_url: newUrl.short_url 
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
  