import React from "react"
import ScrollableContainer from "../components/ScrollableContainer"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import { createStyles, makeStyles, Theme, Fab } from "@material-ui/core"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down("xs")]: {
        padding: 0
      }
    },
    fab: {
      position: "absolute",
      right: theme.spacing(2),
      bottom: theme.spacing(2)
    },
    emptyListBox: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      paddingBottom: theme.spacing(8)
    },
    emptyListText: {
      color: theme.palette.text.hint
    }
  })
)

// Example of custom Context Provider usage.
export default function MarketPage() {
  const classes = useStyles()
  const history = useHistory()

  return (
    <ScrollableContainer className={classes.container} maxWidth="xl">
      <Fab className={classes.fab} onClick={() => history.push("/market/mint")}>
        <AddPhotoAlternateIcon />
      </Fab>
    </ScrollableContainer>
  )
}
