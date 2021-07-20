import React from "react"
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
  CardContent
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import { NFT } from "../types/Blockchain"
import { formatUnits } from "ethers/lib/utils"
import NFTCardsContainer from "../components/NFTCardsContainer"
import cardStyles from "../styles/cards"
import ArtistOwnerInfoBox from "../components/ArtistOwnerInfoBox"
import BackdropProgress from "../components/BackdropProgress"
import useBooleanCondition from "../hooks/useBooleanCondition"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "absolute",
      right: theme.spacing(2),
      bottom: theme.spacing(2)
    }
  })
)

// Shows the marketplace where to buy or get a license on the NFTs.
export default function MarketPage() {
  // Material UI Theming.
  const classes = useStyles()
  const cardsStyles = cardStyles()

  // React router dom providers.
  const history = useHistory()

  // Backdrop progress.
  const [_progress = true, startProgress, stopProgress] = useBooleanCondition()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _nfts } = providerContext

  React.useEffect(() => {
    startProgress()
  }, [])

  React.useEffect(() => {
    stopProgress()
  }, [_nfts])

  const filteredNFTs =
    _nfts.length > 0
      ? _nfts.filter(
          (nft: NFT) => nft.sellingPrice > 0 || nft.dailyLicensePrice > 0
        )
      : []
  return (
    <NFTCardsContainer
      fab={
        <Fab
          className={classes.fab}
          onClick={() => history.push("/market/mint")}
        >
          <AddPhotoAlternateIcon />
        </Fab>
      }
      pageTitle={"MARKET"}
      errorMessage={"There are no NFTs on sale or licensable yet!"}
      filteredNFTs={filteredNFTs}
    >
      {filteredNFTs.length > 0 &&
        filteredNFTs
          .sort((a: NFT, b: NFT) => a.id - b.id)
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
                    onClick={() => history.push(`/market/${nft.id}`)}
                  />
                  <CardContent className={cardsStyles.cardContent}>
                    <Box onClick={() => history.push(`/market/${nft.id}`)}>
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
                    </Box>
                    <Typography
                      gutterBottom
                      variant="body2"
                      className={cardsStyles.cardText}
                      color="textSecondary"
                      style={{ padding: 0, fontSize: "0.8rem" }}
                    >
                      <i>{"List price / Daily license price"}</i>
                    </Typography>

                    <Divider style={{ backgroundColor: "black" }} />

                    <ArtistOwnerInfoBox artist={nft.artist} owner={nft.owner} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
      <BackdropProgress open={_progress} />
    </NFTCardsContainer>
  )
}
