console.log(`index.js is ok.`);


// Search for music
async function searchForMusic(platform) {
  let trackInfo = null;
  const linkOrTerm = document.getElementById("textBox").value;

  // spotify
  if (linkOrTerm.includes("open.spotify.com")) {
    if (platform === "spotify") {
      window.open(linkOrTerm, "_blank");
      return;
    }
    else {
      trackInfo = await getSpotifyTrackInfo(linkOrTerm);
      if (trackInfo) {
        const trackname = trackInfo.name;
        console.log(`Song name: ${trackname}`);
        search(platform, trackname);
      }
    }

    // ytm
  } else if (linkOrTerm.includes("music.youtube.com")) {
    if (platform === "ytm") { 
      window.open(linkOrTerm, "_blank");
      return;
    }
    else {
      trackInfo = await getYouTubeMusicTrackInfo(linkOrTerm);
      if (trackInfo) {
        const trackname = trackInfo.name;
        console.log(`Song name: ${trackname}`);
        search(platform, trackname); // Call the search function for YouTube Music
      }
    }
  }

// apple music
else if (linkOrTerm.includes("music.apple.com") || linkOrTerm.includes("itunes.apple.com")) {
  if (platform === "apple music") {
      window.open(linkOrTerm, "_blank");
      return;
  } else {
      try {
          let trackname = await getAppleMusicTrackInfo(linkOrTerm); // Ensure getAppleMusicTrackInfo is async
          console.log(trackname);
          search(platform, trackname);
      } catch (error) {
          console.error('Error fetching track info:', error);
      }
  }
}
// if no link in text box
  else {
    search(platform, linkOrTerm); // Use the search term directly
  }
}



// Spotify info (trackname) fetch
async function getSpotifyTrackInfo(url) {
  console.log('spty fn works')

  const response = await fetch(
    `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
  );
  const data = await response.json();
  const parts = data.title.split(" by ");
  return {
    name: parts[0], //returning the trackname
  };
}


// YouTube Music info (trackname) fetch
async function getYouTubeMusicTrackInfo(url) {
  console.log('ytm fn works')

  try {
    const videoId = extractVideoId(url);
    const response = await fetch(`/api/youtube?id=${videoId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.name) {
      return { name: data.name }; //returning the trackname
    } else {
      console.error("Track information not found");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Apple Music info fetch
async function test(url) {
  try {
    console.log('am fn works');
    const id = url.slice(-10);
    console.log(id);

    // Use a CORS proxy service
    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    const iTunesUrl = `https://itunes.apple.com/lookup?id=${id}`;
    const proxyUrl = corsProxy + iTunesUrl;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'  // Required by some CORS proxies
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);

    const trackname = data.results[0]?.trackName;
    console.log(trackname);
    return trackname;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // or handle the error as needed
  }
}




// Extract YouTube video ID
function extractVideoId(url) {
  const match = url.match(/v=([^&]*)/);
  return match ? match[1] : url;
}

// Update YouTube Music search URL and open it
async function searchAndOpenYouTubeMusicTrack(trackname) {
  try {
    const response = await fetch(
      `/api/searchyoutube?q=${encodeURIComponent(trackname)}`,
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
async function search(platform, trackname) {
  let url = "";

  if (platform === "spotify") {
    url = "https://open.spotify.com/search/" + encodeURIComponent(trackname);
  } else if (platform === "apple music") {
    url =
      "https://music.apple.com/search?term=" + encodeURIComponent(trackname);
  } else if (platform === "ytm") {
    await searchAndOpenYouTubeMusicTrack(trackname); // Search and open YouTube Music
    return; // Exit the function since searchAndOpenYouTubeMusicTrack handles opening the URL
  }

  if (url) {
    window.open(url, "_blank");
  }
}