import React from "react"
import {
  Theme,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Collapse,
  IconButton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ScrollableContainer from "../components/ScrollableContainer"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { useHistory } from "react-router-dom"
import {
  LicensePurchasedEvent,
  NFT,
  TokenPurchasedEvent
} from "../types/Blockchain"
import { formatUnits } from "ethers/lib/utils"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"
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
      height: "50vh",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "48vh"
      }
    },
    cardText: {
      textAlign: "left"
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    list: {
      width: "100%",
      maxWidth: "90%",
      backgroundColor: theme.palette.background.paper,
      padding: 0
    },
    inline: {
      display: "inline"
    },
    expandedContent: {
      display: "flex",
      flex: 1,
      flexDirection: "column"
    }
  })
)

export default function ArtworksPage() {
  // Material UI Theming.
  const classes = useStyles()

  // Token purchases events.
  const [_tokenPurchases, setTokenPurchases] = React.useState<
    Map<number, Array<TokenPurchasedEvent>>
  >(new Map<number, Array<TokenPurchasedEvent>>())
  // License purchases events.
  const [_licensePurchases, setLicensePurchases] = React.useState<
    Map<number, Array<LicensePurchasedEvent>>
  >(new Map<number, Array<LicensePurchasedEvent>>())
  // Expandable card.
  const [_expanded, setExpanded, unsetExpanded] = useBooleanCondition()

  // React router dom providers.
  const history = useHistory()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const {
    _nfts,
    _signerAddress,
    getTokenPurchasedEventsForNFT,
    getLicensePurchasedEventsForNFT
  } = providerContext

  React.useEffect(() => {
    const getPurchases = async () => {
      let tokenPurchases: Map<number, Array<TokenPurchasedEvent>> = new Map<
        number,
        Array<TokenPurchasedEvent>
      >()
      let licensePurchases: Map<number, Array<LicensePurchasedEvent>> = new Map<
        number,
        Array<LicensePurchasedEvent>
      >()

      for (let i = 0; i < _nfts.length; i++) {
        tokenPurchases.set(
          Number(_nfts[i].id),
          await getTokenPurchasedEventsForNFT(Number(_nfts[i].id))
        )
        licensePurchases.set(
          Number(_nfts[i].id),
          await getLicensePurchasedEventsForNFT(Number(_nfts[i].id))
        )
      }

      setTokenPurchases(tokenPurchases)
      setLicensePurchases(licensePurchases)
    }

    getPurchases()
  }, [_nfts])

  return (
    <ScrollableContainer maxWidth="xl">
      <Typography variant="h5" component="h1" className={classes.title}>
        {"YOUR ARTWORKS"}
      </Typography>
      {_nfts.length > 0 ? (
        <>
          {_nfts.filter((a: NFT) => a.artist === _signerAddress).length > 0 ? (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {_nfts
                .sort((a: NFT, b: NFT) => a.id - b.id)
                .filter((a: NFT) => a.artist === _signerAddress)
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
                        />
                        <CardContent className={classes.cardContent}>
                          <Box>
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
                              {_tokenPurchases.get(Number(nft.id))
                                ? Number(
                                    formatUnits(
                                      _tokenPurchases
                                        .get(Number(nft.id))!
                                        .reduce(
                                          (
                                            acc: number,
                                            event: TokenPurchasedEvent
                                          ) => {
                                            if (event) acc += event.price
                                            return acc
                                          },
                                          0
                                        )
                                        .toString()
                                    )
                                  )
                                : "0"}{" "}
                              {"Ξ"} /{" "}
                              {_licensePurchases.get(Number(nft.id))
                                ? Number(
                                    formatUnits(
                                      _licensePurchases
                                        .get(Number(nft.id))!
                                        .reduce(
                                          (
                                            acc: number,
                                            event: LicensePurchasedEvent
                                          ) => {
                                            if (event) acc += event.price
                                            return acc
                                          },
                                          0
                                        )
                                        .toString()
                                    )
                                  )
                                : "0"}{" "}
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
                            <i>{"Reselling / Licensing total earnings"}</i>
                          </Typography>
                          <IconButton
                            className={clsx(classes.expand, {
                              [classes.expandOpen]: _expanded
                            })}
                            onClick={_expanded ? unsetExpanded : setExpanded}
                            aria-expanded={_expanded}
                            aria-label="show more"
                            disabled={
                              !_tokenPurchases.get(Number(nft.id))?.length &&
                              !_licensePurchases.get(Number(nft.id))?.length
                            }
                          >
                            <ExpandMoreIcon />
                          </IconButton>

                          <Collapse in={_expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                              <List className={classes.list}>
                                {_tokenPurchases.get(Number(nft.id)) &&
                                  _licensePurchases.get(Number(nft.id)) &&
                                  [
                                    ..._tokenPurchases.get(Number(nft.id))!,
                                    ..._licensePurchases.get(Number(nft.id))!
                                  ]
                                    .sort(
                                      (a: any, b: any) =>
                                        b.timestamp - a.timestamp
                                    )
                                    .map((purchasedEvent: any, i: number) => (
                                      <ListItem
                                        alignItems="center"
                                        key={purchasedEvent.tokenId}
                                      >
                                        <ListItemAvatar>
                                          <a
                                            href={`https://rinkeby.etherscan.io/address/${
                                              purchasedEvent.sender &&
                                              purchasedEvent.sender.length > 0
                                                ? purchasedEvent.sender
                                                : purchasedEvent.newOwner
                                            }`}
                                            target="blank"
                                          >
                                            <Identicon
                                              string={
                                                purchasedEvent.sender &&
                                                purchasedEvent.sender.length > 0
                                                  ? purchasedEvent.sender
                                                  : purchasedEvent.newOwner
                                              }
                                              size={32}
                                            />
                                          </a>
                                        </ListItemAvatar>
                                        <ListItemText
                                          style={{ minWidth: "100%" }}
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="h6"
                                              className={classes.inline}
                                              color="textPrimary"
                                            >
                                              {purchasedEvent.sender &&
                                              purchasedEvent.sender.length > 0
                                                ? `Bought a License!`
                                                : `Bought the NFT!`}
                                            </Typography>
                                          }
                                          secondary={
                                            <Box
                                              className={
                                                classes.expandedContent
                                              }
                                            >
                                              <Typography
                                                component="span"
                                                variant="body1"
                                                className={classes.inline}
                                                color="textPrimary"
                                              >
                                                {`For`}{" "}
                                                <b style={{ color: "green" }}>
                                                  {" "}
                                                  {`${formatUnits(
                                                    purchasedEvent.price
                                                  )}`}{" "}
                                                  Ξ
                                                </b>
                                                {purchasedEvent.sender &&
                                                purchasedEvent.sender.length > 0
                                                  ? ` x ${purchasedEvent.durationInDays} days`
                                                  : ""}
                                              </Typography>
                                              <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                              >
                                                {` At ${new Date(
                                                  Number(
                                                    purchasedEvent.timestamp
                                                  )
                                                ).toLocaleString()}`}
                                              </Typography>
                                            </Box>
                                          }
                                        />
                                        <Divider
                                          variant="inset"
                                          style={{ backgroundColor: "black" }}
                                        />
                                      </ListItem>
                                    ))}
                              </List>
                            </CardContent>
                          </Collapse>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Box>
                ))}
            </Grid>
          ) : (
            <Box className={classes.emptyListBox}>
              <Typography className={classes.emptyListText} variant="h4">
                No Artworks!
              </Typography>
              <Typography className={classes.emptyListText} variant="subtitle1">
                Make your craft and mint your unique NFT to see it shown on this
                page!
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            No NFTs!
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            Mint your own NFT to see it shown on this page!
          </Typography>
        </Box>
      )}
    </ScrollableContainer>
  )
}
