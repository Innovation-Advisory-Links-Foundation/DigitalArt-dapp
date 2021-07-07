import {
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
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import Identicon from "react-identicons"
import { Link } from "react-router-dom"
import ProviderContext, {
  ProviderContextType
} from "../context/ProviderContextType"

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
      justifyContent: "space-around",
      alignItems: "center",
      padding: theme.spacing(2)
    },
    link: {
      color: "inherit",
      textDecoration: "none"
    }
  })
)

export default function Sidebar({ open, onClose }: Props) {
  const classes = useStyles()

  const providerContext = React.useContext(
    ProviderContext
  ) as ProviderContextType
  const { _signerAddress } = providerContext

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className={classes.list} role="presentation">
        <div className={classes.currentUser}>
          <Identicon string={_signerAddress} size={32} />
          <Typography variant="body1">
            {_signerAddress.substr(0, 12)}...
            {_signerAddress.substr(38)}
          </Typography>
        </div>
        <Divider />
        <List>
          {/* TODO -> onClick() to go to collection page. */}
          <Link to="/artworks" className={classes.link}>
            <ListItem onClick={onClose} button>
              <ListItemIcon>
                <PhotoLibraryIcon />
              </ListItemIcon>
              <ListItemText primary="Your artworks" />
            </ListItem>
          </Link>
          <ListItem button>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  )
}
