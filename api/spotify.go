package api

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type Response struct {
	AccessToken string `json:"access_token"`
}

var (
	ClientID     = os.Getenv("SPOTIFY_CLIENT")
	ClientSecret = os.Getenv("SPOTIFY_SECRET")
)

type SpotifyResult struct {
	Tracks struct {
		Items []struct {
			Name    string `json:"name"`
			Artists []struct {
				Name string `json:"name"`
			} `json:"artists"`
			ExternalURLs struct {
				Spotify string `json:"spotify"`
			} `json:"external_urls"`
		} `json:"items"`
	} `json:"tracks"`
}

const searchURL = "https://api.spotify.com/v1/search"
const tokenURL = "https://accounts.spotify.com/api/token"

// For testing as an individual file (disabled)
// func main() {
// 	token, err := GetAccessToken(ClientID, ClientSecret)
// 	if err != nil {
// 		fmt.Println("Error: ", err)
// 		return
// 	}

// 	query := strings.Join(os.Args[1:], " ")
// 	Search(query, token)

// }

func GetAccessToken(clientID, clientSecret string) (string, error) {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")

	auth := base64.StdEncoding.EncodeToString([]byte(clientID + ":" + clientSecret))
	reqBody := strings.NewReader(data.Encode())

	req, _ := http.NewRequest("POST", tokenURL, reqBody)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Authorization", "Basic "+auth)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var res Response

	err = json.NewDecoder(resp.Body).Decode(&res)
	return res.AccessToken, err

}

func Search(query, accessToken string) (SpotifyResult, error) {
	// query = strings.ReplaceAll(query, " ", "%20")
	params := url.Values{}
	params.Set("q", query)
	params.Set("type", "track")
	params.Set("limit", "5")

	req, _ := http.NewRequest("GET", searchURL+"?"+params.Encode(), nil)

	req.Header.Set("Authorization", "Bearer "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return SpotifyResult{}, err
	}

	defer resp.Body.Close()

	var result SpotifyResult
	body, _ := io.ReadAll(resp.Body)
	if err := json.Unmarshal(body, &result); err != nil {
		return SpotifyResult{}, err
	}

	// for i, item := range result.Tracks.Items {
	// 	fmt.Printf("%d. %s by %s\n", i+1, item.Name, item.Artists[0].Name)
	// 	fmt.Println("   Link: ", item.ExternalURLs.Spotify)
	// }

	return result, nil
}
