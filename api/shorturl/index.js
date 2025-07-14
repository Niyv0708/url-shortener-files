const Url = require('../../models/Url');
const { validateUrlFormat, checkDomainValidity } = require('../../utils/validator');

module.exports = async (req, res) => {
  // 只允许POST方法
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 解析请求体（Vercel自动处理JSON/表单数据）
  const { url } = req.body;

  // 验证URL格式
  if (!validateUrlFormat(url)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  // 验证域名有效性
  const isDomainValid = await checkDomainValidity(url);
  if (!isDomainValid) {
    return res.status(400).json({ error: 'invalid url' });
  }

  try {
    // 检查URL是否已存在
    let existingUrl = await Url.findOne({ original_url: url });
    if (existingUrl) {
      return res.json({
        original_url: existingUrl.original_url,
        short_url: existingUrl.short_url
      });
    }

    // 生成新的short_url并保存
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
  