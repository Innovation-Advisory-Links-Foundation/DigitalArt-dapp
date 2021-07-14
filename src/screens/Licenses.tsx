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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ScrollableContainer from "../components/ScrollableContainer"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { useHistory } from "react-router-dom"
import { LicensePurchasedEvent, NFT } from "../types/Blockchain"
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
  const { _nfts, _signerAddress, getLicensePurchasedEventsForNFT } =
    providerContext

  // TODO FILTER FOR USER.
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

        licensePurchases.set(
          Number(_nfts[i].id),
          licensesForNFT.filter(
            (licenseEvent: LicensePurchasedEvent) =>
              licenseEvent.sender === _signerAddress
          )
        )
      }

      setLicensePurchases(licensePurchases)
    }

    getLicensePurchases()
  }, [_nfts])

  return (
    <ScrollableContainer maxWidth="xl">
      <Typography variant="h5" component="h1" className={classes.title}>
        {"YOUR LICENSES"}
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
            .map((nft: NFT, i: number) => (
              <>
                {_licensePurchases.get(Number(nft.id)) &&
                _licensePurchases.get(Number(nft.id))?.length! >= 1 ? (
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
                                      <ListItem
                                        alignItems="center"
                                        key={purchasedEvent.tokenId}
                                      >
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
                                              ? Number(
                                                  purchasedEvent.endDateInMillis
                                                ) -
                                                Number(purchasedEvent.timestamp)
                                              : 0}
                                          </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                          style={{
                                            minWidth: "100%",
                                            marginLeft: "16px"
                                          }}
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="h6"
                                              className={classes.inline}
                                              color="textPrimary"
                                            >
                                              {purchasedEvent.sender &&
                                              purchasedEvent.sender.length > 0
                                                ? `License #${i + 1}`
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
                                                {`Price`}{" "}
                                                <b style={{ color: "green" }}>
                                                  {" "}
                                                  {`${formatUnits(
                                                    purchasedEvent.price
                                                  )}`}{" "}
                                                  Ξ
                                                </b>
                                              </Typography>
                                              <Typography
                                                component="span"
                                                variant="body2"
                                                className={classes.inline}
                                                color="textPrimary"
                                              >
                                                {`Expiration ${new Date(
                                                  Number(
                                                    purchasedEvent.endDateInMillis
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
                ) : (
                  <Box
                    className={classes.emptyListBox}
                    style={{ height: "75vh" }}
                  >
                    <Typography className={classes.emptyListText} variant="h4">
                      No Licenses!
                    </Typography>
                    <Typography
                      className={classes.emptyListText}
                      variant="subtitle1"
                    >
                      Buy your licenses from the market!
                    </Typography>
                  </Box>
                )}
              </>
            ))}
        </Grid>
      ) : (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            No NFTs!
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            Mint your own NFT from the market!
          </Typography>
        </Box>
      )}
    </ScrollableContainer>
  )
}
