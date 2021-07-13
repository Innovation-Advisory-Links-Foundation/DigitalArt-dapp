import React from "react"
import ScrollableContainer from "../components/ScrollableContainer"
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
  Grid,
  IconButton
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { NFT } from "../types/Blockchain"
import { formatUnits } from "ethers/lib/utils"
import WarningIcon from "@material-ui/icons/Warning"
import SyncIcon from "@material-ui/icons/Sync"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import clsx from "clsx"

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
    iprBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      textAlign: "center",
      marginTop: theme.spacing(1)
    },
    iprReportText: {
      color: "darkorange",
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
    }
  })
)
export default function CollectionPage() {
  // Material UI Theming.
  const classes = useStyles()

  // React router dom providers.
  const history = useHistory()

  // Expandable card.
  const [_expanded, setExpanded, unsetExpanded] = useBooleanCondition()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _nfts, _signerAddress } = providerContext

  return (
    <ScrollableContainer maxWidth="xl">
      <Typography variant="h5" component="h1" className={classes.title}>
        {"YOUR COLLECTION"}
      </Typography>
      {_nfts.length > 0 ? (
        <>
          {_nfts.filter((nft: NFT) => nft.owner === _signerAddress).length >
          0 ? (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {_nfts
                .sort((a: NFT, b: NFT) => a.id - b.id)
                .filter((nft: NFT) => nft.owner === _signerAddress)
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
                          onClick={() => history.push(`/collection/${nft.id}`)}
                        />
                        <CardContent className={classes.cardContent}>
                          <Box
                            onClick={() =>
                              history.push(`/collection/${nft.id}`)
                            }
                          >
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
                            <Typography
                              gutterBottom
                              variant="body2"
                              className={classes.cardText}
                              color="textSecondary"
                              style={{ padding: 0, fontSize: "0.8rem" }}
                            >
                              <i>{"List price / Daily license price"}</i>
                            </Typography>
                          </Box>

                          <Divider style={{ backgroundColor: "black" }} />

                          {/* TODO -> implement Google Reverse Image APIs */}
                          <Box className={classes.iprBox}>
                            <Box>
                              <Typography
                                variant="h6"
                                component="h3"
                                className={classes.iprReportText}
                              >
                                <WarningIcon className={classes.icon} /> {"10"}{" "}
                                {"IP Infringements Found!"}
                              </Typography>

                              <Typography
                                gutterBottom
                                variant="body2"
                                className={classes.cardText}
                                color="textSecondary"
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "0.8rem"
                                }}
                              >
                                <i>{"gg/mm/aaaa - 00:00:00"}</i>
                              </Typography>
                            </Box>
                            <IconButton style={{ padding: 0 }}>
                              <SyncIcon className={classes.icon} />
                            </IconButton>
                          </Box>
                          <IconButton
                            className={clsx(classes.expand, {
                              [classes.expandOpen]: _expanded
                            })}
                            onClick={_expanded ? unsetExpanded : setExpanded}
                            aria-expanded={_expanded}
                            aria-label="show more"
                            disabled={true}
                          >
                            <ExpandMoreIcon />
                          </IconButton>
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
                There are no NFTs you own yet!
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
            There are no NFTs you own yet!
          </Typography>
        </Box>
      )}
    </ScrollableContainer>
  )
}
