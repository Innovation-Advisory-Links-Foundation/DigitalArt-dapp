import React from "react"
import ScrollableContainer from "../components/ScrollableContainer"
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate"
import {
  createStyles,
  makeStyles,
  Theme,
  Fab,
  Box,
  Typography,
  Divider,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  Grid,
  Avatar
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { NFT } from "../types/Blockchain"
import Identicon from "react-identicons"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: "center"
    },
    text: {
      wordWrap: "break-word",
      textDecorationColor: "default",
      textAlign: "center"
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
    },
    fab: {
      position: "absolute",
      right: theme.spacing(2),
      bottom: theme.spacing(2)
    },
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
      border: "1px solid lightgrey",
      width: "33vw",
      height: "70vh",
      [theme.breakpoints.down("md")]: {
        width: "86vw"
      }
    },
    cardContent: {
      padding: theme.spacing(1)
    },
    cardImage: {
      height: "48vh",
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "42vh"
      }
    },
    cardText: {
      textAlign: "left"
    },
    ownershipBox: {
      margin: theme.spacing(1),
      display: "flex"
    },
    cardContainer: {
      display: "flex",
      flexDirection: "row"
    },
    ownerArtistBox: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    avatar: {
      backgroundColor: "transparent",
      width: theme.spacing(6),
      height: theme.spacing(6)
    }
  })
)

export default function MarketPage() {
  // Material UI Theming.
  const classes = useStyles()

  // React router dom providers.
  const history = useHistory()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _nfts } = providerContext

  return (
    <ScrollableContainer maxWidth="xl">
      <Typography variant="h5" component="h1" className={classes.title}>
        {"MARKET"}
      </Typography>
      {_nfts.length > 0 ? (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          {_nfts
            .sort((a: NFT, b: NFT) => a.id - b.id)
            .filter(
              (nft: NFT) => nft.sellingPrice > 0 || nft.dailyLicensePrice > 0
            )
            .map((nft: NFT, i: number) => (
              <Box key={i} className={classes.cardsBox}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={nft.metadata.title}
                      image={nft.metadata.image}
                      title={nft.metadata.title}
                      className={classes.cardImage}
                      onClick={() => history.push(`/market/${nft.id}`)}
                    />
                    <CardContent className={classes.cardContent}>
                      <Box onClick={() => history.push(`/market/${nft.id}`)}>
                        <Typography
                          variant="h5"
                          component="h2"
                          className={classes.cardText}
                        >
                          {nft.metadata.title}
                        </Typography>

                        <Typography
                          gutterBottom
                          variant="body1"
                          component="p"
                          className={classes.cardText}
                        >
                          © {nft.metadata.creator}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className={classes.cardText}
                          style={{ padding: 0, margin: 0, fontSize: "0.6rem" }}
                        >
                          {"List price / Daily license price"}
                        </Typography>

                        <Typography
                          gutterBottom
                          variant="h6"
                          component="h3"
                          className={classes.cardText}
                          style={{ color: "green" }}
                        >
                          {Number(nft.sellingPrice)} {"Ξ"} /{" "}
                          {Number(nft.dailyLicensePrice) / 1000} {"Ξ"}
                        </Typography>
                      </Box>
                      <Divider />

                      <Box className={classes.ownershipBox}>
                        <Box className={classes.ownerArtistBox}>
                          <Typography
                            gutterBottom
                            variant="body1"
                            className={classes.cardText}
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: "0.8rem"
                            }}
                          >
                            {"Artist"}
                          </Typography>

                          <Avatar variant="square" className={classes.avatar}>
                            <a
                              href={`https://rinkeby.etherscan.io/address/${nft.artist}`}
                              target="blank"
                            >
                              <Identicon string={nft.artist} size={32} />
                            </a>
                          </Avatar>
                        </Box>
                        <Box className={classes.ownerArtistBox}>
                          <Typography
                            gutterBottom
                            variant="body1"
                            className={classes.cardText}
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: "0.8rem"
                            }}
                          >
                            {"Owner"}
                          </Typography>

                          <Avatar className={classes.avatar}>
                            <a
                              href={`https://rinkeby.etherscan.io/address/${nft.owner}`}
                              target="blank"
                            >
                              <Identicon string={nft.owner} size={32} />
                            </a>
                          </Avatar>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
        </Grid>
      ) : (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            No NFTs!
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            Mint your own NFT by clicking the button below!
          </Typography>
        </Box>
      )}
      <Fab className={classes.fab} onClick={() => history.push("/market/mint")}>
        <AddPhotoAlternateIcon />
      </Fab>
    </ScrollableContainer>
  )
}
