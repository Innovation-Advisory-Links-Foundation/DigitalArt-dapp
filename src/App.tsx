import React from "react"
import {
  AppBar,
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  ThemeProvider,
  Toolbar
} from "@material-ui/core"
import EntryPage from "./screens/Entry"
import MarketPage from "./screens/Market"
import ThemeContextType from "./context/ThemeContextType"
import ProviderContextType from "./context/ProviderContextType"
import useThemeContext from "./hooks/useThemeContext"
import useProviderContext from "./hooks/useProviderContext"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import BackdropProgress from "./components/BackdropProgress"
import {
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory
} from "react-router-dom"
import MenuIcon from "@material-ui/icons/Menu"
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded"
import Sidebar from "./components/SidebarMenu"
import Artworks from "./screens/Artworks"
import MintNFTPage from "./screens/MintNFT"
import NFTPage from "./screens/NFTPage"

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
    placeholder: {
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

  // React router dom providers.
  const location = useLocation()
  const history = useHistory()

  const { _theme, toggleTheme } = themeContext
  const { _ethersProvider, _ethersSigner } = providerContext

  // Sidebar menu.
  const [_sidebar, setSidebar] = React.useState<boolean>(false)

  const openSidebar = () => {
    setSidebar(true)
  }

  const closeSidebar = () => {
    setSidebar(false)
  }

  return (
    <ProviderContextType.Provider value={providerContext}>
      <ThemeContextType.Provider value={themeContext}>
        <ThemeProvider theme={_theme}>
          <Paper className={classes.container} elevation={0} square={true}>
            {_ethersProvider !== undefined && (
              <Box className={classes.container}>
                <AppBar color="inherit" elevation={0} position="static">
                  <Toolbar>
                    {location.pathname === "/market" ? (
                      <>
                        <IconButton
                          edge="start"
                          className={classes.leftAppBarButton}
                          onClick={openSidebar}
                        >
                          <MenuIcon />
                        </IconButton>

                        <Sidebar open={_sidebar} onClose={closeSidebar} />
                      </>
                    ) : location.pathname !== "/" ? (
                      <>
                        <IconButton
                          edge="start"
                          className={classes.leftAppBarButton}
                          onClick={() =>
                            history.replace(
                              _ethersSigner._address ? "/market" : "/"
                            )
                          }
                        >
                          <ArrowBackRoundedIcon />
                        </IconButton>
                      </>
                    ) : null}

                    <div className={classes.placeholder} />

                    <IconButton edge="end" onClick={toggleTheme}>
                      {_theme.palette.type !== "dark" ? (
                        <Brightness4Icon />
                      ) : (
                        <Brightness7Icon />
                      )}
                    </IconButton>
                  </Toolbar>
                </AppBar>
                <Switch>
                  <Redirect exact from="/DigitalArt-dapp" to="/" />
                  <Route path="/market/mint">
                    {_ethersSigner._address ? (
                      <MintNFTPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/market/:id">
                    {_ethersSigner._address ? (
                      <NFTPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>

                  <Route path="/artworks">
                    {_ethersSigner._address ? (
                      <Artworks />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/market">
                    {_ethersSigner._address ? (
                      <MarketPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/">
                    {_ethersSigner._address ? (
                      <Redirect to={{ pathname: "/market" }} />
                    ) : (
                      <EntryPage />
                    )}
                  </Route>
                </Switch>
              </Box>
            )}
          </Paper>

          <BackdropProgress open={_ethersProvider === undefined} />
        </ThemeProvider>
      </ThemeContextType.Provider>
    </ProviderContextType.Provider>
  )
}

export default App
