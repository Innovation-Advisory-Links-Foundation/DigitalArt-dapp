import {
  Avatar,
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core"
import React from "react"
import StoreIcon from "@material-ui/icons/Store"
import CollectionsIcon from "@material-ui/icons/Collections"
import CropOriginalIcon from "@material-ui/icons/CropOriginal"
import DescriptionIcon from "@material-ui/icons/Description"
import Identicon from "react-identicons"
import { Link } from "react-router-dom"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"

export interface Props {
  open: boolean
  onClose?: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250
    },
    currentUser: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(2)
    },
    link: {
      color: "inherit",
      textDecoration: "none"
    },
    divider: {
      marginLeft: "5%",
      width: "90%"
    }
  })
)

// Custom sidebar menu which displays the current signer and the page shortcuts to navigate the dApp.
export default function Sidebar({ open, onClose }: Props) {
  // Material UI Theming.
  const classes = useStyles()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _signerAddress } = providerContext

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className={classes.list} role="presentation">
        <div className={classes.currentUser}>
          <Avatar style={{ backgroundColor: "transparent" }}>
            <a
              href={`https://ropsten.etherscan.io/address/${_signerAddress}`}
              target="blank"
            >
              <Identicon string={_signerAddress} size={32} />
            </a>
          </Avatar>
          <Typography variant="body1">
            {_signerAddress.substr(0, 12)}...
            {_signerAddress.substr(38)}
          </Typography>
        </div>
        <Divider />
        <List>
          <Link to="/market" className={classes.link}>
            <ListItem onClick={onClose} button>
              <ListItemIcon>
                <StoreIcon />
              </ListItemIcon>
              <ListItemText primary="Marketplace" />
            </ListItem>
          </Link>

          <Link to="/artworks" className={classes.link}>
            <ListItem onClick={onClose} button>
              <ListItemIcon>
                <CropOriginalIcon />
              </ListItemIcon>
              <ListItemText primary="Your artworks" />
            </ListItem>
          </Link>

          <Link to="/collection" className={classes.link}>
            <ListItem onClick={onClose} button>
              <ListItemIcon>
                <CollectionsIcon />
              </ListItemIcon>
              <ListItemText primary="Your collection" />
            </ListItem>
          </Link>

          <Link to="/licenses" className={classes.link}>
            <ListItem onClick={onClose} button>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Your licenses" />
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  )
}
