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
  search(platform, searchTerm);
}

// Spotify info fetch
async function getSpotifyTrackInfo(url) {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
  );
  const data = await response.json();
  const parts = data.title.split(" by ");
  return {
    name: parts[0],
  };
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

// Update YouTube Music search URL
async function searchAndUpdateYouTubeMusicTrack(linkOrTerm) {
  try {
    const response = await fetch(
      `/api/searchyoutube?q=${encodeURIComponent(linkOrTerm)}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const firstResultUrl = data.url;

    if (firstResultUrl) {
      // Update a specific element with the new URL, for example:
      document.getElementById("youtubeMusicLink").href = firstResultUrl;
      console.log(`YouTube Music URL updated: ${firstResultUrl}`);
    } else {
      console.log("No results found.");
    }
  } catch (error) {
    console.error("Error fetching YouTube Music search results:", error);
  }
}

// Example usage

// Perform the search
function search(platform, searchTerm) {
  let url = "";
  if (platform === "spotify") {
    url = "https://open.spotify.com/search/" + encodeURIComponent(searchTerm);
  } else if (platform === "apple music") {
    url =
      "https://music.apple.com/search?term=" + encodeURIComponent(searchTerm);
  } else if (platform === "ytm") {
    url = url;
  }
  window.open(url, "_blank");
}
