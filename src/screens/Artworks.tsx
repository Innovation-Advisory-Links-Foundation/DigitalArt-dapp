import React from "react"
import {
  Theme,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
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
import NFTCardsContainer from "../components/NFTCardsContainer"
import cardStyles from "../styles/cards"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

// Shows the NFT where the signer is the artist.
export default function ArtworksPage() {
  // Material UI Theming.
  const classes = useStyles()
  const cardsStyles = cardStyles()

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

  // Get token and licenses purchase from smart contract events.
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
    <NFTCardsContainer
      pageTitle={"ARTWORKS"}
      errorMessage={
        "Make your craft and mint your unique NFT to see it shown on this page!"
      }
      filteredNFTs={
        _nfts.length > 0
          ? _nfts.filter((a: NFT) => a.artist === _signerAddress)
          : []
      }
    >
      {_nfts.length > 0 &&
        _nfts
          .sort((a: NFT, b: NFT) => a.id - b.id)
          .filter((a: NFT) => a.artist === _signerAddress)
          .map((nft: NFT, i: number) => (
            <Box key={i} className={cardsStyles.cardsBox}>
              <Card className={cardsStyles.card}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt={nft.metadata.title}
                    image={nft.metadata.image}
                    title={nft.metadata.title}
                    className={cardsStyles.cardImage}
                  />
                  <CardContent className={cardsStyles.cardContent}>
                    <Box>
                      <Typography
                        variant="h5"
                        component="h2"
                        className={cardsStyles.cardText}
                      >
                        {nft.metadata.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        component="h3"
                        className={cardsStyles.cardText}
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
                                      if (event) acc += Number(event.price)
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
                                      if (event) acc += Number(event.price)
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
                      className={cardsStyles.cardText}
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
                                (a: any, b: any) => b.timestamp - a.timestamp
                              )
                              .map((purchasedEvent: any, i: number) => (
                                <ListItem
                                  alignItems="center"
                                  key={purchasedEvent.tokenId}
                                >
                                  <ListItemAvatar>
                                    <a
                                      href={`https://ropsten.etherscan.io/address/${
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
                                      <Box
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between"
                                        }}
                                      >
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
                                        <a
                                          href={`https://ropsten.etherscan.io/tx/${purchasedEvent.txHash}`}
                                          target="blank"
                                          style={{
                                            alignItems: "center",
                                            display: "flex"
                                          }}
                                        >
                                          <VerifiedUserIcon
                                            style={{
                                              color: "green",
                                              fontSize: "1.2rem"
                                            }}
                                          />
                                        </a>
                                      </Box>
                                    }
                                    secondary={
                                      <Box className={classes.expandedContent}>
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
                                            Number(purchasedEvent.timestamp)
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
    </NFTCardsContainer>
  )
}
