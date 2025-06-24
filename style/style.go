package style

import "github.com/charmbracelet/lipgloss"

var (
	TitleStyle = lipgloss.NewStyle().
			Bold(true).Align(lipgloss.Center).Width(52)
	SelectedStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("205"))

	UnselectedStyle = lipgloss.NewStyle()
	// Foreground(lipgloss.Color("150"))

	CursorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("99")).
			Bold(true)

	HintStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))

	MessageStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))

	ContainerStyle = lipgloss.NewStyle().
		// Border(lipgloss.NormalBorder()).
		Padding(1, 1).
		Margin(0, 2).
		BorderForeground(lipgloss.Color("63")).
		Width(60)
)
