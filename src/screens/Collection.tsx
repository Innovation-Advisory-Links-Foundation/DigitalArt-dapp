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
import NFTCardsContainer from "../components/NFTCardsContainer"
import cardStyles from "../styles/cards"

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
  const cardsStyles = cardStyles()

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
                          className={cardsStyles.cardText}
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
    </NFTCardsContainer>
  )
}
