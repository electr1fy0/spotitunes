package model

import (
	"fmt"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"

	"spotitunes/api"
	. "spotitunes/style"
)

type screenState int

type searchResultMsg api.APIResponse
type errMsg error

const (
	menu screenState = iota
	input
	result
)

type model struct {
	cursor    int
	choices   []string
	table     table.Model
	message   string
	textInput textinput.Model
	state     screenState
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch m.state {
	case menu:
		switch msg := msg.(type) {
		case tea.KeyMsg:
			switch msg.String() {
			case "ctrl+c", "q":
				return m, tea.Quit
			case "up", "k":
				if m.cursor > 0 {
					m.cursor--
				}
			case "down", "j":
				if m.cursor < len(m.choices)-1 {
					m.cursor++
				}
			case "enter":
				m.textInput.SetValue("")
				m.textInput.Focus()

				switch m.cursor {
				case 0:
					m.state = input
					m.message = "Enter Spotify link:"
					return m, textinput.Blink
				case 1:
					m.state = input
					m.message = "Enter Apple Music link:"
					return m, textinput.Blink
				case 2:
					return m, tea.Quit
				}
			}
		}

	case input:
		var cmd tea.Cmd
		m.textInput, cmd = m.textInput.Update(msg)

		if key, ok := msg.(tea.KeyMsg); ok && key.Type == tea.KeyEnter {
			link := m.textInput.Value()
			m.message = fmt.Sprintf("Received input: %s", link)
			m.state = result
			return m, nil
		}
		return m, cmd
	case result:
		var cmd tea.Cmd
		m.table, cmd = m.table.Update(msg)
		return m, cmd

	}

	return m, nil
}

func (m model) View() string {
	switch m.state {

	case menu:
		var s string
		s += TitleStyle.Render("Spotitunes 🎧") + "\n\n"

		for i, choice := range m.choices {
			cursor := " "
			styled := UnselectedStyle.Render(choice)
			if m.cursor == i {
				cursor = CursorStyle.Render("> ")
				styled = SelectedStyle.Render(choice)
			}
			row := lipgloss.JoinHorizontal(1, cursor, styled)
			s += row + "\n"
		}

		if m.message != "" {
			s += "\n" + MessageStyle.Render(m.message)
		}

		s += "\n\n" + HintStyle.Render("Use ↑/↓ to navigate, q to quit (your life).")
		return ContainerStyle.Render(s)

	case input:
		s := MessageStyle.Render(m.message) + "\n\n"
		s += m.textInput.View()
		s += "\n\n" + HintStyle.Render("Press Enter to submit.")
		return ContainerStyle.Render(s)
	case result:
		return m.table.View() + "\n"
	}

	return ContainerStyle.Render("Unknown state")
}
