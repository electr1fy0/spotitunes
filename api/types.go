package api

type APIResponse struct {
	ResultCount int     `json:"resultCount"`
	Results     []Track `json:"results"`
}

type Track struct {
	WrapperType            string  `json:"wrapperType"`
	Kind                   string  `json:"kind"`
	ArtistID               int     `json:"artistId"`
	CollectionID           int     `json:"collectionId"`
	TrackID                int     `json:"trackId"`
	ArtistName             string  `json:"artistName"`
	CollectionName         string  `json:"collectionName"`
	TrackName              string  `json:"trackName"`
	CollectionCensoredName string  `json:"collectionCensoredName"`
	TrackCensoredName      string  `json:"trackCensoredName"`
	ArtistViewURL          string  `json:"artistViewUrl"`
	CollectionViewURL      string  `json:"collectionViewUrl"`
	TrackViewURL           string  `json:"trackViewUrl"`
	PreviewURL             string  `json:"previewUrl"`
	ArtworkUrl30           string  `json:"artworkUrl30"`
	ArtworkUrl60           string  `json:"artworkUrl60"`
	ArtworkUrl100          string  `json:"artworkUrl100"`
	CollectionPrice        float64 `json:"collectionPrice"`
	TrackPrice             float64 `json:"trackPrice"`
	ReleaseDate            string  `json:"releaseDate"`
	CollectionExplicitness string  `json:"collectionExplicitness"`
	TrackExplicitness      string  `json:"trackExplicitness"`
	DiscCount              int     `json:"discCount"`
	DiscNumber             int     `json:"discNumber"`
	TrackCount             int     `json:"trackCount"`
	TrackNumber            int     `json:"trackNumber"`
	TrackTimeMillis        int     `json:"trackTimeMillis"`
	Country                string  `json:"country"`
	Currency               string  `json:"currency"`
	PrimaryGenreName       string  `json:"primaryGenreName"`
	IsStreamable           bool    `json:"isStreamable"`
}
