const Url = require('../../models/Url');
const { validateUrlFormat, checkDomainValidity } = require('../../utils/validator');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!validateUrlFormat(url)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  const isDomainValid = await checkDomainValidity(url);
  if (!isDomainValid) {
    return res.status(400).json({ error: 'invalid url' });
  }

  try {
    await Url.db.readyState || await Url.connectDB(); // 新增：确保数据库已连接
    let existingUrl = await Url.findOne({ original_url: url });
    if (existingUrl) {
      return res.json({ original_url: existingUrl.original_url, short_url: existingUrl.short_url });
    }

    const shortUrl = await Url.getNextShortUrl();
    const newUrl = new Url({ original_url: url, short_url: shortUrl });
    await newUrl.save();

    return res.status(201).json({ original_url: newUrl.original_url, short_url: newUrl.short_url });
  } catch (err) {
    console.error('Server error:', err); // 关键：查看控制台输出具体错误信息（如数据库认证失败、唯一索引冲突等）
    return res.status(500).json({ error: 'Server error: ' + err.message }); // 向前端返回具体错误信息（仅调试时使用，生产环境需隐藏敏感信息）
  }
};
  