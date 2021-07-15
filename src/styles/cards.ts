import { createStyles, makeStyles, Theme } from "@material-ui/core"

export default makeStyles((theme: Theme) =>
  createStyles({
    cardsBox: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      flexWrap: "wrap",
      flexShrink: 1
    },
    card: {
      margin: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      border: "1px solid black",
      width: "33vw",
      [theme.breakpoints.down("sm")]: {
        width: "86vw"
      }
    },
    cardContent: {
      padding: theme.spacing(1)
    },
    cardImage: {
      width: "100%",
      height: "50vh",
      [theme.breakpoints.down("sm")]: {
        height: "55vh"
      }
    },
    cardText: {
      textAlign: "left"
    }
  })
)
