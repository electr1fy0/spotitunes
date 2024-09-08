// api/proxy.js
export default async function handler(req, res) {
    const url = req.query.id;
    // Extract the ID from the URL
    const idMatch = url.match(/id=(\d+)/);
    if (!idMatch) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    const id = idMatch[1];
    const apiUrl = `https://itunes.apple.com/lookup?id=${id}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}