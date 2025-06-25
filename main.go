package main

import (
	"fmt"
	"os"
	. "spotitunes/model"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

func main() {
	ti := textinput.New()
	ti.Placeholder = "Enter trackname..."
	ti.Focus()
	ti.CharLimit = 256
	ti.Width = 40
	cols := []table.Column{
		{Title: "Title", Width: 20},
		{Title: "Artist", Width: 15},
		{Title: "URL", Width: 100},
	}

	s := table.DefaultStyles()
	s.Header = s.Header.
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("240")).
		BorderBottom(true).
		Bold(false)
	s.Selected = s.Selected.
		Foreground(lipgloss.Color("229")).
		Background(lipgloss.Color("57")).
		Bold(false)

	t := table.New(
		table.WithColumns(cols),
		table.WithRows(nil),
		table.WithFocused(true),
		table.WithHeight(7),
		table.WithStyles(s),
	)
	m := Model{
		Choices: []string{
			"Get Apple Music link",
			"Get Spotify link",
			"Get YT Music link",
			"Exit",
		},
		Table:     t,
		TextInput: ti,
		State:     Menu,
	}
	p := tea.NewProgram(m, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}
}
