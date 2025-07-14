const Url = require('../../models/Url');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const { id } = req.query;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'invalid short url' });

  try {
    const urlData = await Url.findOne({ short_url: Number(id) });
    if (!urlData) return res.status(404).json({ error: 'No short URL found' });
    
    return res.redirect(
      urlData.original_url.startsWith('http') 
        ? urlData.original_url 
        : `https://${urlData.original_url}`
    );
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
  