import React, { useEffect } from "react"
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
  Grid
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import useProviderContext from "../hooks/useProviderContext"
import BackdropProgress from "../components/BackdropProgress"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down("xs")]: {
        padding: 0
      }
    },
    fab: {
      position: "absolute",
      right: theme.spacing(2),
      bottom: theme.spacing(2)
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
    text: {
      wordWrap: "break-word",
      padding: theme.spacing(1),
      textDecorationColor: "default",
      textAlign: "center"
    },
    cardsContainer: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      flex: 1,
      flexShrink: 1,
      justifyContent: "center"
    },
    card: {
      margin: theme.spacing(1),
      border: "1px solid black",
      width: "500px",
      [theme.breakpoints.down("xs")]: {
        width: "300px"
      }
    },
    cardContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between"
    },
    cardContent: {
      display: "flex",
      flexDirection: "column"
    }
  })
)

export default function MarketPage() {
  const classes = useStyles()
  const history = useHistory()
  const providerContext = useProviderContext()
  const { _ethersProvider, retrieveNfts } = providerContext

  const [_nfts, setNfts] = React.useState<any[]>([])
  const [_nftsMetadata, setNftsMetadata] = React.useState<any[]>([])

  // Backdrop progress.
  const [_progress, setProgress] = React.useState<boolean>(true)
  const openProgress = () => {
    setProgress(true)
  }
  const closeProgress = () => {
    setProgress(false)
  }

  useEffect(() => {
    ;(async function () {
      openProgress()
      if (_ethersProvider !== undefined) {
        const _nfts = await retrieveNfts()
        setNfts(_nfts)

        if (_nfts.length > 0) {
          let _nftsMetadata: Array<any> = []

          for (const nft of _nfts) {
            const response = await fetch(nft.uri)
            _nftsMetadata.push(await response.json())
          }

          setNftsMetadata(_nftsMetadata)
        }
        closeProgress()
      }
    })()
  }, [_ethersProvider])

  return (
    <ScrollableContainer className={classes.container} maxWidth="xl">
      <Typography variant="h6" className={classes.text}>
        {"MARKET"}
      </Typography>
      {_nfts.length > 0 && _nftsMetadata.length > 0 && !_progress ? (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          {_nfts
            .sort((a: any, b: any) => a.id - b.id)
            .filter(
              (nft: any) => nft.sellingPrice > 0 || nft.dailyLicensePrice > 0
            )
            .map((nft: any, i: number) => (
              <Box key={i} className={classes.cardsContainer}>
                <Card
                  className={classes.card}
                  onClick={() => history.push(`/market/${nft.id}`)}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      alt={_nftsMetadata[nft.id - 1].title}
                      image={_nftsMetadata[nft.id - 1].image}
                      title={_nftsMetadata[nft.id - 1].title}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        className={classes.text}
                      >
                        {_nftsMetadata[nft.id - 1].title}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="body1"
                        component="p"
                        color="textSecondary"
                        className={classes.text}
                      >
                        {_nftsMetadata[nft.id - 1].description.substr(0, 47)}
                        {"..."}
                      </Typography>
                      <Divider />
                      <Box className={classes.cardContainer}>
                        <Box className={classes.cardContent}>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            component="p"
                            className={classes.text}
                            style={{ color: "green" }}
                          >
                            {"Sale Price"}
                          </Typography>

                          <Typography
                            variant="body2"
                            component="p"
                            className={classes.text}
                            style={{ color: "green" }}
                          >
                            {Number(nft.sellingPrice)}
                            {" wei"}
                          </Typography>
                        </Box>
                        <Box className={classes.cardContent}>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            component="p"
                            className={classes.text}
                            style={{ color: "green" }}
                          >
                            {"License Price"}
                          </Typography>

                          <Typography
                            variant="body2"
                            component="p"
                            className={classes.text}
                            style={{ color: "green" }}
                          >
                            {Number(nft.dailyLicensePrice)}
                            {" wei"}
                          </Typography>
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
            Mint your own NFT!
          </Typography>
        </Box>
      )}
      <Fab className={classes.fab} onClick={() => history.push("/market/mint")}>
        <AddPhotoAlternateIcon />
      </Fab>

      <BackdropProgress open={_progress} />
    </ScrollableContainer>
  )
}
