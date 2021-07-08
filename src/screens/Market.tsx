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
import { formatUnits } from "ethers/lib/utils"

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
      paddingBottom: theme.spacing(4),
      border: "1px solid black",
      width: "33vw",
      height: "68vh",
      [theme.breakpoints.down("sm")]: {
        height: "68vh",
        width: "86vw"
      }
    },
    cardContent: {
      padding: theme.spacing(1)
    },
    cardImage: {
      height: "50vh",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "48vh"
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
      backgroundColor: "transparent"
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
                          variant="h6"
                          component="h3"
                          className={classes.cardText}
                          style={{ color: "green" }}
                        >
                          {Number(formatUnits(nft.sellingPrice.toString()))}{" "}
                          {"Ξ"} /{" "}
                          {Number(
                            formatUnits(nft.dailyLicensePrice.toString())
                          )}{" "}
                          {"Ξ"}
                        </Typography>
                      </Box>
                      <Typography
                        gutterBottom
                        variant="body2"
                        className={classes.cardText}
                        color="textSecondary"
                        style={{ padding: 0, fontSize: "0.8rem" }}
                      >
                        <i>{"List price / Daily license price"}</i>
                      </Typography>

                      <Divider style={{ backgroundColor: "black" }} />

                      <Box className={classes.ownershipBox}>
                        <Box className={classes.ownerArtistBox}>
                          <Typography
                            gutterBottom
                            variant="body1"
                            className={classes.cardText}
                            color="textSecondary"
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: "0.8rem"
                            }}
                          >
                            {"ARTIST"}
                          </Typography>

                          <Avatar className={classes.avatar}>
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
                            color="textSecondary"
                            style={{
                              padding: 0,
                              margin: 0,
                              fontSize: "0.8rem"
                            }}
                          >
                            {"OWNER"}
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
