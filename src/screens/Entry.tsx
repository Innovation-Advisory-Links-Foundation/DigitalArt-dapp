import React from "react"
import { Theme, Container, Button, Typography } from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import logo from "../logo/logo.svg"

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
    },
    logo: {
      height: "200px",
      pointerEvents: "none",
      marginBottom: theme.spacing(2)
    },
    appName: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      textAlign: "center"
    },
    button: {
      marginTop: theme.spacing(1),
      width: "300px",
      border: "1.5px solid"
    }
  })
)

// Asks and handles the request for the connection of the MetaMask wallet.
export default function EntryPage(props: any) {
  const classes = useStyles()

  return (
    <Container className={classes.container} maxWidth="md">
      <img className={classes.logo} src={logo} alt="logo" />
      <Typography className={classes.appName} variant="h6">
        <b>NFT Marketplace with Royalty Redistribution & IPR Management </b>
      </Typography>
      <Button
        className={classes.button}
        onClick={props.connect}
        variant="outlined"
      >
        Connect Your Wallet
      </Button>
    </Container>
  )
}
