// api/spotify.js
export default async function handler(req, res) {
  const { trackName } = req.query;
  const token = process.env.SPOTIFY_ACCESS_TOKEN; // Store your token in environment variables

  if (!token) {
    res.status(500).json({ error: "Token not found" });
    return;
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
