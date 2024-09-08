console.log(`index.js is ok.`);

// Search for music
async function searchFromMusicPlatform(platform) {
  const linkOrTerm = document.getElementById("searchTerm").value;

  if (linkOrTerm.includes("open.spotify.com") && platform === "spotify") {
    window.open(linkOrTerm, "_blank");
    return;
  }

  if (linkOrTerm.includes("music.youtube.com") && platform === "ytm") {
    window.open(linkOrTerm, "_blank");
    return;
  }

  let trackInfo = null;

  if (linkOrTerm.includes("open.spotify.com")) {
    trackInfo = await getSpotifyTrackInfo(linkOrTerm);
    if (trackInfo) {
      const searchTerm = trackInfo.name;
      console.log(`Song name: ${searchTerm}`);
      search(platform, searchTerm); // Call the search function for Spotify
    }
  } else if (linkOrTerm.includes("music.youtube.com")) {
    trackInfo = await getYouTubeMusicTrackInfo(linkOrTerm);
    if (trackInfo) {
      const searchTerm = trackInfo.name;
      console.log(`Song name: ${searchTerm}`);
      search(platform, searchTerm); // Call the search function for YouTube Music
    }
    else if (linkOrTerm.includes("music.apple.com") || linkOrTerm.includes("itunes.apple.com")) {
      trackname = getAppleMusicTrack();
      console.log(trackname);
      const searchTerm = trackname;
      search(platform,searchTerm);
    }
    
  } else {
    search(platform, linkOrTerm); // Use the search term directly
  }
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


function getAppleMusicTrack() {
  console.log('am fn works')
  fetch('https://itunes.apple.com/lookup?id=1766137051', {
    method: 'GET', // or 'POST', 'PUT', etc.
    headers: {
        'Content-Type': 'application/json',
        // Add more headers as needed
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json(); // or response.text() for non-JSON response
})
.then(data => {
    console.log(data); // Process the response data
    const trackName = data.results[0].trackName;

})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});
return trackname

}

// Perform the search
async function search(platform, searchTerm) {
  let url = "";

  if (platform === "spotify") {
    url = "https://open.spotify.com/search/" + encodeURIComponent(searchTerm);
  } else if (platform === "apple music") {
    url =
      "https://music.apple.com/search?term=" + encodeURIComponent(searchTerm);
  } else if (platform === "ytm") {
    await searchAndOpenYouTubeMusicTrack(searchTerm); // Search and open YouTube Music
    return; // Exit the function since searchAndOpenYouTubeMusicTrack handles opening the URL
  }

  if (url) {
    window.open(url, "_blank");
  }
}