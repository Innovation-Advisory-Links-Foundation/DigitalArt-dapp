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
import useProviderContext from "../hooks/useProviderContext"
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import Identicon from "react-identicons"
import { Link } from "react-router-dom"

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

  const providerContext = useProviderContext()
  const { _ethersSigner } = providerContext

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className={classes.list} role="presentation">
        <div className={classes.currentUser}>
          <Identicon string={_ethersSigner?._address} size={32} />
          <Typography variant="body1">
            {_ethersSigner?._address.substr(0, 12)}...
            {_ethersSigner?._address.substr(38)}
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
