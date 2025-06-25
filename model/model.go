package model

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"runtime"
	. "spotitunes/api"
	. "spotitunes/style"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

type ScreenState int

type ErrMsg error

const (
	Menu ScreenState = iota
	Input
	result
	fail
)

type Model struct {
	Cursor    int
	Choices   []string
	Table     table.Model
	Message   string
	Chosen    string
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
				m.Chosen = "AM"
				m.Message = "Enter Apple Music link:"
				return m, textinput.Blink
			case 1:
				m.State = Input
				m.Chosen = "Spotify"
				m.Message = "Enter Spotify link:"
				return m, textinput.Blink
			case 2:
				m.State = fail
				return m, nil
			case 3:
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

		switch m.Cursor {
		case 0:
			return m, FetchItunes(link)
		case 1:
			return m, FetchSpotify(link)
		default:
			os.Exit(1)
		}
	}

	return m, cmd
}

func (m Model) updateResult(msg tea.Msg) (tea.Model, tea.Cmd) {
	var length = 5
	switch msg := msg.(type) {
	case SpotifyResult:
		rows := make([]table.Row, 0, length)
		for _, result := range msg.Tracks.Items {
			rows = append(rows, table.Row{result.Name, result.Artists[0].Name, result.ExternalURLs.Spotify})
		}
		m.Table.SetRows(rows)
		return m, nil
	case ItunesResponse:
		rows := make([]table.Row, 0, length)
		for _, result := range msg.Results {
			rows = append(rows, table.Row{result.TrackName, result.ArtistName, result.TrackViewURL})
		}

		m.Table.SetRows(rows)

		return m, nil

	case ErrMsg:
		m.Message = fmt.Sprintf("Error: %v", msg)
		return m, nil
	case tea.KeyMsg:
		switch msg.String() {
		case "down", "j":
			if m.Cursor != length-1 {
				m.Cursor++
			}

		case "up", "k":
			if m.Cursor != 0 {
				m.Cursor--
			}
		case "q", "ctrl+c":
			return m, tea.Quit
		case "enter":
			link := m.Table.Rows()[m.Cursor][2]
			openLink(link)
		}

		m.Table.SetCursor(m.Cursor)
	}

	return m, nil
}

func (m Model) updateFail(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl-c":
			return m, tea.Quit
		}
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
	case fail:
		return m.updateFail(msg)
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
		s := m.Table.View()

		s += "\n\n" + HintStyle.Render("Use ↑/↓ to navigate, ⏎ to open, q to quit (your career)")

		return s
	case fail:
		m.Message = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("205")).Render("\n\nNobody uses YT Music")
		m.Message += "\n\n" + HintStyle.Render("Use q to quit (and rethink your choices)")

		s := m.Message
		return s
	}

	return ContainerStyle.Render("Unknown state")
}

func FetchSpotify(query string) tea.Cmd {
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
		return result

	}
}

func FetchItunes(query string) tea.Cmd {
	return func() tea.Msg {
		query = url.QueryEscape(query)
		url := fmt.Sprintf("https://itunes.apple.com/search?term=%s&entity=musicTrack&limit=5", query)

		resp, err := http.Get(url)
		if err != nil {
			println("Error: ", err)
			os.Exit(1)
		}

		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		// fmt.Println("Raw body:\n", string(body)) // ← add this

		if err != nil {
			println("Error: ", err)
			os.Exit(1)
		}
		var result ItunesResponse
		err = json.Unmarshal(body, &result)

		if err != nil {
			fmt.Println("Error unmarshalling itunes: ", err)
			os.Exit(1)
		}
		return result
	}
}

func openLink(url string) {
	switch runtime.GOOS {
	case "windows":
		exec.Command("cmd", "/c", "start", "", url)
	case "darwin":
		exec.Command("open", url).Start()

	default:
		exec.Command("xdg-open", url).Start()
	}
}
