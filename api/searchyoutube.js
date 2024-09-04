export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = req.query.q;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1`,
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const videoUrl = `https://music.youtube.com/watch?v=${videoId}`;
      res
        .status(200)
        .json({ url: videoUrl, name: data.items[0].snippet.title });
    } else {
      res.status(404).json({ error: "No results found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
