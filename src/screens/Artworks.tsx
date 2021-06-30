import React from "react"
import { Theme, Container, Typography } from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import useProviderContext from "../hooks/useProviderContext"

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

export default function Artworks() {
  const classes = useStyles()
  const providerContext = useProviderContext()

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography>Artworks!</Typography>
    </Container>
  )
}
