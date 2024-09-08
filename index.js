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
        const trackname = await getAppleMusicTrackInfo(document.getElementById("textBox").value); // Ensure getAppleMusicTrackInfo is async
        console.log(`${trackname} received by action function`);
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
async function getAppleMusicTrackInfo(url) {
  console.log(`url is ${url}`)
  const id = url.slice(-10);
  try {
    const response = await fetch(`/api/apple-music?id=${id}`);

    let trackInfo = await response.text();
    console.log(trackInfo);
    return trackInfo;
  } catch (error) {
    console.error('Error fetching Apple Music data:', error);
    throw error;
    throw error;
  }
}

function getAppleMusicURL(trackname) {
  return;

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
      navigator.clipboard.writeText(firstResultUrl).then(() => {
        console.log('Link copied to clipboard');
        showToast();
      }).catch(err => {
        console.error('Failed to copy link: ', err);
      });
      console.log(`YouTube Music URL opened: ${firstResultUrl}`);
    } else {
      console.log("No results found.");
    }
  } catch (error) {
    console.error("Error fetching YouTube Music search results:", error);
  }
}

function showToast() {
  // Get the snackbar DIV
  let snack = document.getElementById("snackbar");

  // Add the "show" class to DIV
  snack.classList.remove('hidden');
  snack.classList.add('flex');
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    snack.classList.replace("flex", "hidden");
  }, 3000);
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


  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
  if (url) {
    if (isOS) {
      document.execCommand('copy');
      console.log('Link copied to clipboard');
      showToast();

    }
    else {
      navigator.clipboard.writeText(url).then(() => {
        console.log('Link copied to clipboard');
        showToast();
      }).catch(err => {
        console.error('Failed to copy link: ', err);
      });
    }
  }
}