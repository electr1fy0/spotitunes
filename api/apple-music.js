export default async function handler(req, res) {
    const { id } = req.query;  // Extract the ID from the query parameters
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
      const data = await response.json();
      const trackName = data.results[0]?.trackName || 'Track not found';
      res.status(200).json({ trackName });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  }