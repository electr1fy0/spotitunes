package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	. "spotitines/model"
	. "spotitunes/api"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
)

func main() {

	// reader := bufio.NewReader(os.Stdin)
	// fmt.Print("Enter input: ")
	// input, _ := reader.ReadString('\n')
	// input = strings.TrimSpace(input)

	// input = strings.ReplaceAll(input, " ", "+")
	// input := model.textInput.value

	ti := textinput.New()
	ti.Placeholder = "Paste the link..."
	ti.Focus()
	ti.CharLimit = 256
	ti.Width = 40

	cols := []table.Column{
		{Title: "Title", Width: 20},
		{Title: "Artist", Width: 10},
		{Title: "Kind", Width: 10},
	}
	rows := make([]table.Row, 0, len(apiResp.Results))

	for _, result := range apiResp.Results {
		rows = append(rows, table.Row{result.TrackName, result.ArtistName, result.Kind})
	}

	t := table.New(
		table.WithColumns(cols),
		table.WithRows(rows),
		table.WithFocused(true),
		table.WithHeight(7),
	)

	m := model{
		choices: []string{
			"Spotify ->  Music",
			" Music -> Spotify",
			"Exit",
		},
		table:     t,
		textInput: ti,
	}

	p := tea.NewProgram(m, tea.WithAltScreen())

	if err := p.Start(); err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

}

func request(trackName string) (*http.Response, error) {
	url := fmt.Sprintf("https://itunes.apple.com/search?term=%s&entity=musicTrack&limit=5", trackName)

	return http.Get(url)
}

func fetchTracks(query string) tea.Cmd {
	return func() tea.Msg {
		res, err := request(query)
		if err != nil {
			panic(err)
		}
		defer res.Body.Close()
		body, err := io.ReadAll(res.Body)

		var apiResp APIResponse
		err = json.Unmarshal(body, &apiResp)
		if err != nil {
			return errMsg(err)
		}
	}
}
