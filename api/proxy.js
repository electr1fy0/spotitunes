// api/proxy.js
export default async function handler(req, res) {
    const id = req.query.id; // Extract ID from query params
    const url = `https://itunes.apple.com/lookup?id=${id}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}