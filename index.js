console.log(`js file works`);

// Search for music
async function searchFromMusicPlatform(platform) {
  const linkOrTerm = document.getElementById("searchTerm").value;

  let trackInfo = null;

  if (linkOrTerm.includes("open.spotify.com")) {
    trackInfo = await getSpotifyTrackInfo(linkOrTerm);
  } else if (linkOrTerm.includes("music.youtube.com")) {
    trackInfo = await getYouTubeMusicTrackInfo(linkOrTerm);
  } else {
    trackInfo = { name: linkOrTerm }; // Use the search term directly as the track name
  }

  const searchTerm = trackInfo.name;
  console.log(`Song name: ${searchTerm}`);

  if (platform === "ytm") {
    openYouTubeMusicTrack(searchTerm);
  } else {
    search(platform, searchTerm);
  }
}

// Spotify info fetch
async function getSpotifyTrackInfo(url) {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
  );
  const data = await response.json();
  const parts = data.title.split(" by ");
  return { name: parts[0] };
}

// YouTube Music search and open URL
async function openYouTubeMusicTrack(trackName) {
  const apiKey = "YOUR_API_KEY"; // Replace with your YouTube Data API v3 key
  const searchTerm = encodeURIComponent(trackName);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=video&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      const videoUrl = `https://music.youtube.com/watch?v=${videoId}`;
      window.open(videoUrl, "_blank");
    } else {
      console.error("No results found");
    }
  } catch (error) {
    console.error("Error fetching YouTube Music data:", error);
  }
}

// YouTube Music info fetch
async function getYouTubeMusicTrackInfo(url) {
  try {
    const videoId = extractVideoId(url);
    const response = await fetch(`/api/youtube?id=${videoId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.name) {
      return { name: data.name };
    } else {
      console.error("Track information not found");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Extract YouTube video ID
function extractVideoId(url) {
  const match = url.match(/v=([^&]*)/);
  return match ? match[1] : url;
}

// Perform the search
function search(platform, searchTerm) {
  let url = "";
  if (platform === "spotify") {
    url = "https://open.spotify.com/search/" + encodeURIComponent(searchTerm);
  } else if (platform === "apple music") {
    url =
      "https://music.apple.com/search?term=" + encodeURIComponent(searchTerm);
  } else if (platform === "ytm") {
    // URL construction is now handled in openYouTubeMusicTrack
  }
  if (url) {
    window.open(url, "_blank");
  }
}

// Event listener for YouTube Music button
document.getElementById("ytm").addEventListener("click", function () {
  searchFromMusicPlatform("ytm");
});
