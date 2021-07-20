import React from "react"
import {
  createStyles,
  makeStyles,
  Theme,
  Box,
  Typography,
  Divider,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { InfringmentAttemptsRecordedEvent, NFT } from "../types/Blockchain"
import { formatUnits } from "ethers/lib/utils"
import WarningIcon from "@material-ui/icons/Warning"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"
import NFTCardsContainer from "../components/NFTCardsContainer"
import cardStyles from "../styles/cards"
import ImageSearchIcon from "@material-ui/icons/ImageSearch"
import webDetect from "../utils/webDetection"
import { IPRInfringmentAttempt } from "../types/WebDetection"
import crypto from "crypto"
import BackdropProgress from "../components/BackdropProgress"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iprBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
      marginTop: theme.spacing(1)
    },
    iprReportText: {
      display: "flex",
      alignItems: "center"
    },
    icon: {
      padding: theme.spacing(1)
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
    imageLinkIcon: {
      color: theme.palette.primary.main
    },
    sourceLocation: {
      color: theme.palette.secondary.main
    }
  })
)

// Shows the NFTs where the user is the owner.
export default function CollectionPage() {
  // Material UI Theming.
  const classes = useStyles()
  const cardsStyles = cardStyles()

  // React router dom providers.
  const history = useHistory()

  // Expandable card.
  const [_expanded, setExpanded, unsetExpanded] = useBooleanCondition()

  // IPR infringment attempts for each NFT.
  const [_infringmentAttempts, setInfringmentAttempts] = React.useState<
    Map<number, Array<IPRInfringmentAttempt>>
  >(new Map<number, Array<IPRInfringmentAttempt>>())
  // Last detection timestamp.
  const [_lastDetectionTimestamps, setLastDetectionTimestamps] = React.useState<
    Map<number, number>
  >(new Map<number, number>())
  // Backdrop progress.
  const [_progress = true, startProgress, stopProgress] = useBooleanCondition()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const {
    _nfts,
    _signerAddress,
    getInfringmentAttemptsRecordedEventForNFT,
    recordIPRInfringementAttempts
  } = providerContext

  React.useEffect(() => {
    const detectIPRInfringmentAttempts = async () => {
      if (_nfts.length > 0) {
        let attempts = new Map<number, Array<IPRInfringmentAttempt>>()
        let timestamps = new Map<number, number>()

        // For each NFT that belongs to the current signer.
        for (let i = 0; i < _nfts.length; i++) {
          if (_nfts[i].owner === _signerAddress) {
            // Get data from Google Web Detection APIs.
            const response = await webDetect(_nfts[i].metadata.image)

            // Interact with the Blockchain.
            if (response && response.pagesWithMatchingImages) {
              // Set attempts.
              attempts.set(
                Number(_nfts[i].id),
                response.pagesWithMatchingImages
              )

              // Calculate the hash.
              const infringmentAttemptsHash =
                "0x" +
                crypto
                  .createHash("sha256")
                  .update(JSON.stringify(response.pagesWithMatchingImages))
                  .digest("hex")

              // Get the last recorded hash from the blockchain.
              const infringmentAttemptsForNFT =
                await getInfringmentAttemptsRecordedEventForNFT(
                  Number(_nfts[i].id)
                )

              if (infringmentAttemptsForNFT.length > 0) {
                const lastAttempts: InfringmentAttemptsRecordedEvent =
                  infringmentAttemptsForNFT[
                    infringmentAttemptsForNFT.length - 1
                  ]

                // Update blockchain state.
                if (
                  lastAttempts.infringmentAttemptsHash !==
                  infringmentAttemptsHash
                ) {
                  const timestamp = Date.now()
                  // Send tx.
                  await recordIPRInfringementAttempts({
                    tokenId: Number(_nfts[i].id),
                    timestamp: timestamp,
                    infringmentAttemptsHash: infringmentAttemptsHash
                  })

                  timestamps.set(Number(_nfts[i].id), timestamp)
                } else {
                  timestamps.set(
                    Number(_nfts[i].id),
                    Number(lastAttempts.timestamp)
                  )
                }
              } else {
                // First detection.
                if (response.pagesWithMatchingImages) {
                  const timestamp = Date.now()
                  // Send tx.
                  await recordIPRInfringementAttempts({
                    tokenId: Number(_nfts[i].id),
                    timestamp: timestamp,
                    infringmentAttemptsHash: infringmentAttemptsHash
                  })

                  timestamps.set(Number(_nfts[i].id), timestamp)
                }
              }
            }
          }
        }
        setInfringmentAttempts(attempts)
        setLastDetectionTimestamps(timestamps)
        stopProgress()
      }
    }
    startProgress()
    detectIPRInfringmentAttempts()
  }, [_nfts])

  return (
    <NFTCardsContainer
      pageTitle={"YOUR COLLECTION"}
      errorMessage={"There are no NFTs you own yet!"}
      filteredNFTs={
        _nfts.length > 0
          ? _nfts.filter((nft: NFT) => nft.owner === _signerAddress)
          : []
      }
    >
      {_nfts.length > 0 &&
        _nfts
          .sort((a: NFT, b: NFT) => a.id - b.id)
          .filter((nft: NFT) => nft.owner === _signerAddress)
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
                    onClick={() => history.push(`/collection/${nft.id}`)}
                  />
                  <CardContent className={cardsStyles.cardContent}>
                    <Box onClick={() => history.push(`/collection/${nft.id}`)}>
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
                        {Number(formatUnits(nft.sellingPrice.toString()))} {"Ξ"}{" "}
                        /{" "}
                        {Number(formatUnits(nft.dailyLicensePrice.toString()))}{" "}
                        {"Ξ"}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body2"
                        className={cardsStyles.cardText}
                        color="textSecondary"
                        style={{ padding: 0, fontSize: "0.8rem" }}
                      >
                        <i>{"List price / Daily license price"}</i>
                      </Typography>
                    </Box>

                    {_infringmentAttempts.get(Number(nft.id)) && (
                      <>
                        <Divider style={{ backgroundColor: "black" }} />
                        <Box className={classes.iprBox}>
                          <Box>
                            <Typography
                              variant="h6"
                              component="h3"
                              className={classes.iprReportText}
                              style={{
                                color:
                                  _infringmentAttempts.get(Number(nft.id))!
                                    .length > 0
                                    ? "darkred"
                                    : "darkgreen"
                              }}
                            >
                              <WarningIcon className={classes.icon} />{" "}
                              {_infringmentAttempts.get(Number(nft.id))!.length}{" "}
                              {"IPR Infringement Attempts!"}
                            </Typography>

                            <Typography
                              gutterBottom
                              variant="body2"
                              className={cardsStyles.cardText}
                              color="textSecondary"
                              style={{
                                marginLeft: "8px",
                                fontSize: "0.8rem"
                              }}
                            >
                              <i>
                                {_lastDetectionTimestamps.get(Number(nft.id))
                                  ? new Date(
                                      _lastDetectionTimestamps.get(
                                        Number(nft.id)
                                      )!
                                    ).toLocaleString()
                                  : ""}
                              </i>
                            </Typography>
                          </Box>
                        </Box>

                        <IconButton
                          className={clsx(classes.expand, {
                            [classes.expandOpen]: _expanded
                          })}
                          onClick={_expanded ? unsetExpanded : setExpanded}
                          aria-expanded={_expanded}
                          aria-label="show more"
                          disabled={
                            _infringmentAttempts.get(Number(nft.id))!.length ===
                            0
                          }
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </>
                    )}
                    <Collapse in={_expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <List className={classes.list}>
                          {_infringmentAttempts.get(Number(nft.id)) &&
                            [..._infringmentAttempts.get(Number(nft.id))!].map(
                              (
                                infringmentAttempt: IPRInfringmentAttempt,
                                i: number
                              ) => (
                                <Box key={i}>
                                  <ListItem
                                    alignItems="center"
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    <ListItemText
                                      style={{
                                        minWidth: "100%",
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
                                            {`Attempt #${i + 1}`}
                                          </Typography>
                                          <a
                                            href={`${
                                              infringmentAttempt
                                                .fullMatchingImages.length > 0
                                                ? infringmentAttempt
                                                    .fullMatchingImages[0].url
                                                : infringmentAttempt
                                                    .partialMatchingImages[0]
                                                    .url
                                            }`}
                                            target="blank"
                                            style={{
                                              alignItems: "center",
                                              display: "flex"
                                            }}
                                          >
                                            <ImageSearchIcon
                                              className={classes.imageLinkIcon}
                                            />
                                          </a>
                                        </Box>
                                      }
                                      secondary={
                                        <>
                                          <Box style={{ width: "90%" }}>
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.inline}
                                              color="textSecondary"
                                            >
                                              {"Source: "}
                                              <b>
                                                <a
                                                  className={
                                                    classes.sourceLocation
                                                  }
                                                  href={infringmentAttempt.url}
                                                  target="blank"
                                                >
                                                  {
                                                    infringmentAttempt.url.split(
                                                      "/"
                                                    )[2]
                                                  }
                                                </a>
                                              </b>
                                            </Typography>
                                          </Box>
                                          <Divider
                                            style={{
                                              backgroundColor: "black",
                                              marginTop: "8px"
                                            }}
                                          />
                                        </>
                                      }
                                    />
                                  </ListItem>
                                </Box>
                              )
                            )}
                        </List>
                      </CardContent>
                    </Collapse>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
      <BackdropProgress open={_progress} />
    </NFTCardsContainer>
  )
}
