console.log(`index.js is ok.`);

// Search for music
async function searchFromMusicPlatform(platform) {
  const linkOrTerm = document.getElementById("searchTerm").value;

  // Open the link directly if it matches the selected platform
  if (linkOrTerm.includes("open.spotify.com") && platform === "spotify") {
    window.open(linkOrTerm, "_blank");
    return;
  }

  if (linkOrTerm.includes("music.youtube.com") && platform === "ytm") {
    window.open(linkOrTerm, "_blank");
    return;
  }

  let searchTerm = linkOrTerm;

  // Fetch track information if a Spotify or YouTube Music link is provided
  if (linkOrTerm.includes("open.spotify.com")) {
    const trackInfo = await getSpotifyTrackInfo(linkOrTerm);
    if (trackInfo) {
      searchTerm = trackInfo.name;
      console.log(`Song name: ${searchTerm}`);
    }
  } else if (linkOrTerm.includes("music.youtube.com")) {
    const trackInfo = await getYouTubeMusicTrackInfo(linkOrTerm);
    if (trackInfo) {
      searchTerm = trackInfo.name;
      console.log(`Song name: ${searchTerm}`);
    }
  }

  // Perform the search based on the platform and search term
  search(platform, searchTerm);
}

// Spotify info fetch
async function getSpotifyTrackInfo(url) {
  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();
    const parts = data.title.split(" by ");
    return { name: parts[0] };
  } catch (error) {
    console.error("Error fetching Spotify track info:", error);
    return null;
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
    return data.name ? { name: data.name } : null;
  } catch (error) {
    console.error("Error fetching YouTube Music track info:", error);
    return null;
  }
}

// Extract YouTube video ID
function extractVideoId(url) {
  const match = url.match(/v=([^&]*)/);
  return match ? match[1] : null;
}

// Fetch the first Spotify track URL based on a search term
async function getSpotifyTrackUrl(searchTerm) {
  const query = encodeURIComponent(searchTerm);
  const searchUrl = `https://open.spotify.com/search/${query}`;

  try {
    const response = await fetch(searchUrl);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Look for the first track link in the parsed HTML
    const trackLink = doc.querySelector('a[href*="/track/"]');

    if (trackLink) {
      const trackUrl = `https://open.spotify.com${trackLink.getAttribute("href")}`;
      console.log(`Found track URL: ${trackUrl}`);
      return trackUrl;
    } else {
      console.log("No track found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Spotify search results:", error);
    return null;
  }
}

// Update YouTube Music search URL and open it
async function searchAndOpenYouTubeMusicTrack(searchTerm) {
  try {
    const response = await fetch(
      `/api/searchyoutube?q=${encodeURIComponent(searchTerm)}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const firstResultUrl = data.url;

    if (firstResultUrl) {
      window.open(firstResultUrl, "_blank");
      console.log(`YouTube Music URL opened: ${firstResultUrl}`);
    } else {
      console.log("No results found.");
    }
  } catch (error) {
    console.error("Error fetching YouTube Music search results:", error);
  }
}

// Perform the search
async function search(platform, searchTerm) {
  let url = "";

  if (platform === "spotify") {
    url = await getSpotifyTrackUrl(searchTerm);
  } else if (platform === "apple music") {
    url = `https://music.apple.com/search?term=${encodeURIComponent(searchTerm)}`;
  } else if (platform === "ytm") {
    await searchAndOpenYouTubeMusicTrack(searchTerm); // Search and open YouTube Music
    return; // Exit the function since searchAndOpenYouTubeMusicTrack handles opening the URL
  }

  if (url) {
    window.open(url, "_blank");
  }
}
