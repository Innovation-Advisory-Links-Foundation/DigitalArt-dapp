import { createMuiTheme, PaletteType } from "@material-ui/core"
import React from "react"
import { ThemeContextType } from "../context/ThemeContextType"

// Hook for handling the custom Material-UI Theme status.
export default function useThemeContext(): ThemeContextType {
  const themeType = localStorage.getItem("theme-type") as PaletteType
  const [_themeType, setThemeType] = React.useState<PaletteType>(
    themeType || "light"
  )

  const _theme = React.useMemo(() => {
    return createMuiTheme({
      palette: {
        type: _themeType,
        primary: {
          main: "#1A34F2"
        }
      }
    })
  }, [_themeType])

  // Switches the type types and store the value.
  function toggleTheme() {
    const newThemeType = _themeType === "dark" ? "light" : "dark"

    localStorage.setItem("theme-type", newThemeType)
    setThemeType(newThemeType)
  }

  return {
    _theme,
    toggleTheme
  }
}
