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
    // 通过模型静态方法调用 connectDB
    await Url.connectDB(); 
    
    let existingUrl = await Url.findOne({ original_url: url });
    if (existingUrl) {
      return res.json({ original_url: existingUrl.original_url, short_url: existingUrl.short_url });
    }

    const shortUrl = await Url.getNextShortUrl();
    const newUrl = new Url({ original_url: url, short_url: shortUrl });
    await newUrl.save();

    return res.status(201).json({ original_url: newUrl.original_url, short_url: newUrl.short_url });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
  