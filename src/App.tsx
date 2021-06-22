import React from "react"
import "./App.css"
import {
  AppBar,
  Box,
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography
} from "@material-ui/core"
import ThemeContextType from "./context/ThemeContextType"
import ProviderContextType from "./context/ProviderContextType"
import useThemeContext from "./hooks/useThemeContext"
import useProviderContext from "./hooks/useProviderContext"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import Address from "./screens/Address"

// Custom styles.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      flex: 1
    },
    leftAppBarButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
)

function App() {
  // Material UI Theming.
  const classes = useStyles()

  // Custom providers.
  const themeContext = useThemeContext()
  const providerContext = useProviderContext()
  const { _theme, toggleTheme } = themeContext
  const { _ethersSigner, handleOnConnect } = providerContext

  return (
    <ProviderContextType.Provider value={providerContext}>
      <ThemeContextType.Provider value={themeContext}>
        <ThemeProvider theme={_theme}>
          <Paper className={classes.container} elevation={0} square={true}>
            <Box className={classes.container}>
              <AppBar color="inherit" elevation={0} position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                    {"DIGITAL ART LOGO"}
                  </Typography>

                  {!_ethersSigner ? (
                    <Button
                      onClick={handleOnConnect}
                      color="primary"
                      variant="outlined"
                    >
                      {" "}
                      CONNECT{" "}
                    </Button>
                  ) : (
                    <Address />
                  )}

                  <IconButton edge="end" onClick={toggleTheme}>
                    {_theme.palette.type !== "dark" ? (
                      <Brightness4Icon />
                    ) : (
                      <Brightness7Icon />
                    )}
                  </IconButton>
                </Toolbar>
              </AppBar>
            </Box>
          </Paper>
        </ThemeProvider>
      </ThemeContextType.Provider>
    </ProviderContextType.Provider>
  )
}

export default App
