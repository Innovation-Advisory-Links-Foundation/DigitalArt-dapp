import React from "react"
import { Theme, Container, Typography } from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      paddingBottom: theme.spacing(8),
      flex: 1,
      height: "100vh"
    }
  })
)

export default function NFTPage() {
  const classes = useStyles()

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography>NFT PAGE!</Typography>
    </Container>
  )
}
