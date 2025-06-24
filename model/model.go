package model

import (
	"fmt"
	"net/http"
	"os"
	. "spotitunes/api"
	. "spotitunes/style"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type ScreenState int

type SearchresultMsg Result
type ErrMsg error

const (
	Menu ScreenState = iota
	Input
	result
)

type Model struct {
	Cursor    int
	Choices   []string
	Table     table.Model
	Message   string
	TextInput textinput.Model
	State     ScreenState
}

func (m Model) Init() tea.Cmd {
	return nil
}

func (m Model) updateMenu(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			return m, tea.Quit
		case "up", "k":
			if m.Cursor > 0 {
				m.Cursor--
			}
		case "down", "j":
			if m.Cursor < len(m.Choices)-1 {
				m.Cursor++
			}
		case "enter":
			m.TextInput.SetValue("")
			m.TextInput.Focus()

			switch m.Cursor {
			case 0:
				m.State = Input
				m.Message = "Enter Spotify link:"
				return m, textinput.Blink
			case 1:
				m.State = Input
				m.Message = "Enter Spotify link:"
				return m, textinput.Blink
			case 2:
				return m, tea.Quit
			}
		}
	}
	return m, nil
}

func (m Model) updateInput(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	m.TextInput, cmd = m.TextInput.Update(msg)

	if key, ok := msg.(tea.KeyMsg); ok && key.Type == tea.KeyEnter {
		link := m.TextInput.Value()
		m.Message = "Searching..."
		m.State = result
		return m, FetchTracks(link)
	}
	return m, cmd
}

func (m Model) updateResult(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case SearchresultMsg:
		rows := make([]table.Row, 0, len(msg.Tracks.Items))
		for _, result := range msg.Tracks.Items {
			rows = append(rows, table.Row{result.Name, result.Artists[0].Name, result.ExternalURLs.Spotify})
		}
		m.Table.SetRows(rows)
		return m, nil

	case ErrMsg:
		m.Message = fmt.Sprintf("Error: %v", msg)
		return m, nil
	}
	return m, nil
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch m.State {
	case Menu:
		return m.updateMenu(msg)

	case Input:
		return m.updateInput(msg)

	case result:
		return m.updateResult(msg)

	default:
		var cmd tea.Cmd
		return m, cmd
	}
}

func (m Model) View() string {
	switch m.State {

	case Menu:
		var s string
		s += TitleStyle.Render("Spotitunes 🎧") + "\n\n"

		for i, choice := range m.Choices {
			Cursor := " "
			styled := UnselectedStyle.Render(choice)
			if m.Cursor == i {
				Cursor = CursorStyle.Render("> ")
				styled = SelectedStyle.Render(choice)
			}
			row := lipgloss.JoinHorizontal(1, Cursor, styled)
			s += row + "\n"
		}

		if m.Message != "" {
			s += "\n" + MessageStyle.Render(m.Message)
		}

		s += "\n\n" + HintStyle.Render("Use ↑/↓ to navigate, q to quit (your life).")
		return ContainerStyle.Render(s)

	case Input:
		s := MessageStyle.Render(m.Message) + "\n\n"
		s += m.TextInput.View()
		s += "\n\n" + HintStyle.Render("Press Enter to submit.")
		return ContainerStyle.Render(s)
	case result:
		return m.Table.View() + "\n"
	}

	return ContainerStyle.Render("Unknown state")
}

// iTunes API (disabled for now)
// func FetchTracks(query string) tea.Cmd {
// 	return func() tea.Msg {
// 		res, err := request(query)
// 		if err != nil {
// 			panic(err)
// 		}
// 		defer res.Body.Close()
// 		body, err := io.ReadAll(res.Body)

// 		var ApiResp APIResponse
// 		err = json.Unmarshal(body, &ApiResp)
// 		if err != nil {
// 			println("Error")
// 			os.Exit(1)
// 		}
// 		return SearchresultMsg(ApiResp)
// 	}
// }

func FetchTracks(query string) tea.Cmd {
	return func() tea.Msg {
		token, err := GetAccessToken(ClientID, ClientSecret)
		if err != nil {
			fmt.Println("Error: ", err)
			os.Exit(1)
		}

		result, err := Search(query, token)
		if err != nil {
			fmt.Println("Error: ", err)
			os.Exit(1)
		}
		return SearchresultMsg(result)

	}
}

func request(trackName string) (*http.Response, error) {
	url := fmt.Sprintf("https://itunes.apple.com/search?term=%s&entity=musicTrack&limit=5", trackName)
	// itunes only for testing, wanna use spotify api
	return http.Get(url)
}
