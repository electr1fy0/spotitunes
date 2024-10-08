export default async function handler(req, res) {
    const { id } = req.query;  // Extract the ID from the query parameters
    
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Apple Music API');
      }
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const trackName = data.results[0].trackName || 'Track not found';
        res.status(200).send(trackName);  // Send only the track name as plain text
      } else {
        res.status(404).send('Track not found');  // Send a plain text message
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Failed to fetch data');  // Send a plain text message
    }
  }