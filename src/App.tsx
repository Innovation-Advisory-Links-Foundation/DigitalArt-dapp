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
import useThemeContext from "./hooks/useThemeContext"
import useProviderContext from "./hooks/useDigitalArt"
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
import ArtworksPage from "./screens/Artworks"
import MintNFTPage from "./screens/MintNFT"
import { Contract, ethers } from "ethers"
import config from "./config"
import IPFS from "ipfs-api"
import { DigitalArt } from "./types/DigitalArt"
import DigitalArtContextType from "./context/DigitalArtContext"
import useBooleanCondition from "./hooks/useBooleanCondition"
import MarketableNFTPage from "./screens/MarketableNFT"
import CollectionPage from "./screens/Collection"
import PurchasedNFTPage from "./screens/PurchasedNFT"
import LicensesPage from "./screens/Licenses"

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

  // Handle the provider, smart contract, signer and ipfs endpoint istances.
  const [_digitalArt, setDigitalArt] = React.useState<DigitalArt | undefined>(
    undefined
  )
  // Sidebar menu.
  const [_sidebar, openSidebar, closeSidebar] = useBooleanCondition()

  // React router dom providers.
  const location = useLocation()
  const history = useHistory()

  // Custom providers.
  const themeContext = useThemeContext()
  const { _theme, toggleTheme } = themeContext

  const providerContext = useProviderContext(_digitalArt)
  const signer = _digitalArt ? _digitalArt.signer : undefined

  // Handles the main logic for backward navigation through different pages.
  const navigateBack = () => {
    const numberRegex = /\d/

    if (
      numberRegex.test(location.pathname) &&
      location.pathname.includes("/collection/")
    ) {
      history.replace(signer && signer._address ? "/collection" : "/")
    }

    if (
      numberRegex.test(location.pathname) &&
      location.pathname.includes("/licenses/")
    ) {
      history.replace(signer && signer._address ? "/licenses" : "/")
    }

    if (
      numberRegex.test(location.pathname) &&
      location.pathname.includes("/market/")
    ) {
      history.replace(signer && signer._address ? "/market" : "/")
    }

    if (location.pathname === "/collection") {
      history.replace(signer && signer._address ? "/market" : "/")
    }

    if (location.pathname === "/artworks") {
      history.replace(signer && signer._address ? "/market" : "/")
    }
    if (location.pathname === "/licenses") {
      history.replace(signer && signer._address ? "/market" : "/")
    }
  }

  // Explicit connect request from user w/ MetaMask.
  const connectYourWallet = async () => {
    if (_digitalArt) {
      const { injectedProvider, provider } = _digitalArt

      await injectedProvider.request({ method: "eth_requestAccounts" })

      setDigitalArt({
        ..._digitalArt,
        signer: provider.getSigner((await provider.listAccounts())[0])
      })
    }
  }

  // Bootstrap the application w/ blockchain connection and related objects istantiation.
  React.useEffect(() => {
    const connectToBlockchain = async () => {
      try {
        // Let's check for the injected window.ethereum global object.
        const ethereumInjectedProvider = window.ethereum

        // Check for MetaMask provider.
        if (!ethereumInjectedProvider?.isMetaMask) {
          throw Error("Do you have multiple wallets installed?")
        } else configureConnection(ethereumInjectedProvider)
      } catch (error) {
        throw error
      }

      /**
       * Configure the connection to the blockchain using the Ethereum MetaMask injected provider.
       * @param injectedProvider <any> - MetaMask Ethereum injected provider.
       */
      async function configureConnection(injectedProvider: any) {
        // Request MetaMask account permission for DApp connection.
        await injectedProvider.request({ method: "eth_accounts" })

        // Wrapper for ethers provider.
        const provider = new ethers.providers.Web3Provider(injectedProvider)

        // Set current Signer.
        const signer = provider.getSigner((await provider.listAccounts())[0])

        // State update.
        setDigitalArt({
          injectedProvider,
          provider,
          signer,
          contract: new Contract(config.contractAddress, config.abi, signer),
          ipfs: new IPFS({
            host: config.ipfs.host,
            port: config.ipfs.port,
            protocol: config.ipfs.protocol
          })
        })
      }
    }

    connectToBlockchain()
  }, [])

  // Listener for account change.
  _digitalArt?.injectedProvider.on(
    "accountsChanged",
    async (accounts: Array<string>) => {
      // Current MetaMask account is located to 0 index.
      if (_digitalArt && accounts[0] !== _digitalArt.signer._address) {
        // Update current signer.
        setDigitalArt({
          ..._digitalArt,
          signer: _digitalArt.provider.getSigner(accounts[0])
        })
      }
    }
  )

  // Listener for network change.
  _digitalArt?.injectedProvider.on("chainChanged", (id: string) => {
    // TODO -> check chain id for smart contract switch.
    window.location.reload()
  })

  return (
    <ThemeContextType.Provider value={themeContext}>
      <ThemeProvider theme={_theme}>
        <Paper className={classes.container} elevation={0} square={true}>
          {signer !== undefined && (
            <DigitalArtContextType.Provider value={providerContext}>
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
                          onClick={navigateBack}
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
                    {signer._address ? (
                      <MintNFTPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/collection/:id">
                    {signer._address ? (
                      <PurchasedNFTPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/market/:id">
                    {signer._address ? (
                      <MarketableNFTPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/licenses">
                    {signer._address ? (
                      <LicensesPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/collection">
                    {signer._address ? (
                      <CollectionPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/artworks">
                    {signer._address ? (
                      <ArtworksPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/market">
                    {signer._address ? (
                      <MarketPage />
                    ) : (
                      <Redirect to={{ pathname: "/" }} />
                    )}
                  </Route>
                  <Route path="/">
                    {signer._address ? (
                      <Redirect to={{ pathname: "/market" }} />
                    ) : (
                      <EntryPage connect={connectYourWallet} />
                    )}
                  </Route>
                </Switch>
              </Box>
            </DigitalArtContextType.Provider>
          )}
          <EntryPage />
        </Paper>

        <BackdropProgress open={!signer} />
      </ThemeProvider>
    </ThemeContextType.Provider>
  )
}

export default App
