package style

import "github.com/charmbracelet/lipgloss"

var (
	TitleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#FFD700")).Align(lipgloss.Center).Width(52)
	SelectedStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("205"))

	UnselectedStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))

	CursorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("99")).
			Bold(true)

	HintStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))

	MessageStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))
	ContainerStyle = lipgloss.NewStyle().
			Border(lipgloss.NormalBorder()).
			Padding(1, 4).
			Margin(1, 2).
			BorderForeground(lipgloss.Color("63")).
			Width(60)
)
