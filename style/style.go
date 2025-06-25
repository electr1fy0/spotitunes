package style

import "github.com/charmbracelet/lipgloss"

var (
	TitleStyle = lipgloss.NewStyle().
			Bold(true).Align(lipgloss.Center).Width(50).BorderBottom(true)
	SelectedStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("229")).Background(lipgloss.Color("57")).Width(50)

	UnselectedStyle = lipgloss.NewStyle().Width(50)

	CursorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("99")).
			Bold(true)

	HintStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150")).Italic(true).Width(50)

	MessageStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("150"))

	ContainerStyle = lipgloss.NewStyle().
		// Border(lipgloss.NormalBorder()).
		Padding(1, 1).
		Margin(0, 2).
		BorderForeground(lipgloss.Color("63")).
		Width(60).AlignHorizontal(lipgloss.Center)
)
