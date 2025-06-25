package main

import (
	"fmt"
	"os"
	. "spotitunes/model"

	"github.com/charmbracelet/bubbles/table"
	"github.com/charmbracelet/bubbles/textinput"
	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	// TextBox (empty rn)
	ti := textinput.New()
	ti.Placeholder = "Enter trackname..."
	ti.Focus()
	ti.CharLimit = 256
	ti.Width = 40

	// Table (empty rows rn, idk why even needed )
	cols := []table.Column{
		{Title: "Title", Width: 20},
		{Title: "Artist", Width: 10},
		{Title: "URL", Width: 100},
	}

	t := table.New(
		table.WithColumns(cols),
		table.WithRows(nil),
		table.WithFocused(true),
		table.WithHeight(7),
	)

	// Instantiating the Model struct with those weird empty values
	m := Model{
		Choices: []string{
			"Get  Music link",
			"Get Spotify link",
			"Exit",
		},
		Table:     t,
		TextInput: ti,
		State:     Menu,
	}
	// Creating the program
	p := tea.NewProgram(m, tea.WithAltScreen())

	// Running the program
	if _, err := p.Run(); err != nil {
		fmt.Println("Error: ", err)
		os.Exit(1)
	}

}
