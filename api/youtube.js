// API route to handle YouTube API requests
export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videoId = req.query.id;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`,
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      res.status(200).json({ name: data.items[0].snippet.title });
    } else {
      res.status(404).json({ error: "Track information not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
