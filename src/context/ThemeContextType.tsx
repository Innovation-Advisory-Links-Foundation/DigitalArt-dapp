import { Theme } from "@material-ui/core"
import React from "react"

// Type for the Theme Context object.
export type ThemeContextType = {
  _theme: Theme
  toggleTheme: () => void
}

export default React.createContext<ThemeContextType | null>(null)
