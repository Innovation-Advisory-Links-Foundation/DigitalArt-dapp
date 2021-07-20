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
  ListItemText,
  Avatar
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { LicensePurchasedEvent, NFT } from "../types/Blockchain"
import { formatUnits } from "ethers/lib/utils"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"
import NFTCardsContainer from "../components/NFTCardsContainer"
import cardStyles from "../styles/cards"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    emptyListBox: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      paddingBottom: theme.spacing(8),
      height: "80vh"
    },
    emptyListText: {
      color: theme.palette.text.hint
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
    },
    valid: {
      backgroundColor: "green"
    },

    invalid: {
      backgroundColor: "red"
    }
  })
)

export default function LicensesPage() {
  // Material UI Theming.
  const classes = useStyles()
  const cardsStyles = cardStyles()

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
  const { _nfts, _signerAddress, getLicensePurchasedEventsForNFT } =
    providerContext

  // Get all licenses for the nfts for smart contract events.
  React.useEffect(() => {
    const getLicensePurchases = async () => {
      let licensePurchases: Map<number, Array<LicensePurchasedEvent>> = new Map<
        number,
        Array<LicensePurchasedEvent>
      >()

      for (let i = 0; i < _nfts.length; i++) {
        const licensesForNFT = await getLicensePurchasedEventsForNFT(
          Number(_nfts[i].id)
        )

        const filteredLicenses = licensesForNFT.filter(
          (licenseEvent: LicensePurchasedEvent) =>
            licenseEvent.sender === _signerAddress
        )

        if (filteredLicenses.length > 0)
          licensePurchases.set(Number(_nfts[i].id), filteredLicenses)
      }

      setLicensePurchases(licensePurchases)
    }

    getLicensePurchases()
  }, [_nfts])

  return (
    <NFTCardsContainer
      pageTitle={"LICENSES"}
      errorMessage={"There are no NFTs where to buy licenses from!"}
      filteredNFTs={_nfts.length > 0 ? _nfts : []}
    >
      {_nfts &&
      _nfts.filter((nft: NFT) => !!_licensePurchases.get(Number(nft.id)))
        .length > 0 ? (
        _nfts
          .sort((a: NFT, b: NFT) => a.id - b.id)
          .filter((nft: NFT) => !!_licensePurchases.get(Number(nft.id)))
          .map((nft: NFT, i: number) => (
            <>
              {_licensePurchases.get(Number(nft.id)) ? (
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
                          <Typography variant="h5" component="h2">
                            {nft.metadata.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="p"
                            gutterBottom
                          >
                            {nft.metadata.description}
                          </Typography>
                        </Box>
                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: _expanded
                          })}
                          onClick={_expanded ? unsetExpanded : setExpanded}
                          aria-expanded={_expanded}
                          aria-label="show more"
                          disabled={
                            !_licensePurchases.get(Number(nft.id))?.length
                          }
                        >
                          <ExpandMoreIcon />
                        </IconButton>

                        <Collapse in={_expanded} timeout="auto" unmountOnExit>
                          <CardContent>
                            <List className={classes.list}>
                              {_licensePurchases.get(Number(nft.id)) &&
                                [..._licensePurchases.get(Number(nft.id))!]
                                  .sort(
                                    (a: any, b: any) =>
                                      b.timestamp - a.timestamp
                                  )
                                  .map((purchasedEvent: any, i: number) => (
                                    <Box key={i}>
                                      <ListItem alignItems="center">
                                        <ListItemAvatar>
                                          <Avatar
                                            className={
                                              Number(
                                                purchasedEvent.endDateInMillis
                                              ) -
                                                Number(
                                                  purchasedEvent.timestamp
                                                ) >
                                              0
                                                ? classes.valid
                                                : classes.invalid
                                            }
                                          >
                                            {Number(
                                              purchasedEvent.endDateInMillis
                                            ) -
                                              Number(purchasedEvent.timestamp) >
                                            0
                                              ? (Number(
                                                  purchasedEvent.endDateInMillis
                                                ) -
                                                  Number(
                                                    purchasedEvent.timestamp
                                                  )) /
                                                86400000
                                              : 0}
                                          </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                          style={{
                                            minWidth: "90%",
                                            marginLeft: "16px"
                                          }}
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
                                                {`License #${i + 1}`}
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
                                            <>
                                              <Typography
                                                component="span"
                                                variant="body1"
                                                className={classes.inline}
                                                color="textPrimary"
                                              >
                                                {`Price`}{" "}
                                                <b style={{ color: "green" }}>
                                                  {" "}
                                                  {`${formatUnits(
                                                    purchasedEvent.price
                                                  )}`}{" "}
                                                  Ξ
                                                </b>
                                                <br></br>
                                              </Typography>
                                              <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                                gutterBottom
                                              >
                                                {`Expiry ${new Date(
                                                  Number(
                                                    purchasedEvent.endDateInMillis
                                                  )
                                                ).toLocaleString()}`}
                                                <br></br>
                                              </Typography>
                                              <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                              ></Typography>
                                            </>
                                          }
                                        />
                                        <Divider
                                          variant="inset"
                                          style={{ backgroundColor: "black" }}
                                        />
                                      </ListItem>
                                    </Box>
                                  ))}
                            </List>
                          </CardContent>
                        </Collapse>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              ) : (
                <Box className={classes.emptyListBox}>
                  <Typography className={classes.emptyListText} variant="h4">
                    No Licenses!
                  </Typography>
                  <Typography
                    className={classes.emptyListText}
                    variant="subtitle1"
                  >
                    Buy your license from the market!
                  </Typography>
                </Box>
              )}
            </>
          ))
      ) : (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            No Licenses!
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            There are no NFTs where to purchase a license from!
          </Typography>
        </Box>
      )}
    </NFTCardsContainer>
  )
}
