import React from "react"
import {
  Theme,
  Typography,
  Divider,
  Box,
  Avatar,
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Slider
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useHistory, useParams } from "react-router-dom"
import { NFT } from "../types/Blockchain"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import Identicon from "react-identicons"
import BackdropProgress from "../components/BackdropProgress"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ScrollableContainer from "../components/ScrollableContainer"
import { formatUnits } from "ethers/lib/utils"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      alignItems: "center",
      width: "100%"
    },
    image: {
      width: "100%",
      pointerEvents: "none",
      marginBottom: theme.spacing(1)
    },
    divider: {
      backgroundColor: "black",
      width: "95%"
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
    ownershipContainerBox: {
      width: "95%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: theme.spacing(1)
    },
    ownershipContentBox: {
      display: "flex",
      flexDirection: "row",
      padding: theme.spacing(1)
    },
    ownershipText: {
      display: "flex",
      flexDirection: "column"
    },
    avatar: {
      backgroundColor: "transparent",
      padding: theme.spacing(1)
    },
    formGroup: {
      width: "100%"
    },
    formControl: {
      alignItems: "center",
      width: "100%"
    },
    formControlLabel: {
      border: "1px solid black",
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2)
    },
    labelBox: {
      textAlign: "center",
      width: "100%",
      marginLeft: theme.spacing(3)
    },
    button: {
      width: "95%",
      padding: theme.spacing(2)
    }
  })
)

export default function NFTPage() {
  // Material UI Theming.
  const classes = useStyles()

  // State.
  const [_nft, setNft] = React.useState<NFT>()
  // Backdrop progress.
  const [_progress = true, startProgress, stopProgress] = useBooleanCondition()
  // Radio buttons.
  const [_buyRadio, checkBuyRadio, uncheckBuyRadio] = useBooleanCondition()
  const [_licenseRadio, checkLicenseRadio, uncheckLicenseRadio] =
    useBooleanCondition()
  // Slider value.
  const [_days, setDays] = React.useState<number>(1)

  // Retrieve the id from the url.
  const { id } = useParams<any>()

  // React router dom providers.
  const history = useHistory()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _signerAddress, buyNFT } = providerContext

  React.useEffect(() => {
    startProgress()

    setNft(providerContext._nfts.find((nft) => Number(nft.id) === Number(id)))

    stopProgress()
  }, [providerContext._nfts.length > 0])

  const handleBuyRadio = () => {
    checkBuyRadio()
    uncheckLicenseRadio()
    setDays(1)
  }

  const handleLicenseRadio = () => {
    checkLicenseRadio()
    uncheckBuyRadio()
  }

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setDays(typeof newValue === "number" ? newValue : 1)
  }

  const handleBuy = async () => {
    startProgress()
    if (_nft && _buyRadio) {
      // Send tx.
      await buyNFT({
        id,
        txValue: _nft.sellingPrice
      })

      stopProgress()

      // Redirect. TODO -> redirect to personal nft owner page where he/she can resell or make licensable the nft.
      history.replace("/market")
    }
  }

  return (
    <ScrollableContainer className={classes.container} maxWidth="md">
      {_nft && (
        <>
          <img src={_nft.metadata.image} className={classes.image} alt=""></img>

          <Typography variant="h3" component="h1">
            {_nft.metadata.title}
          </Typography>

          <Typography variant="body1" component="p" gutterBottom>
            {_nft.metadata.description}
          </Typography>

          <Divider className={classes.divider} />
          <Box className={classes.ownershipContainerBox}>
            <Box className={classes.ownershipContentBox}>
              <Avatar className={classes.avatar}>
                <a
                  href={`https://rinkeby.etherscan.io/address/${_nft.artist}`}
                  target="blank"
                >
                  <Identicon string={_nft.artist} size={32} />
                </a>
              </Avatar>

              <Box className={classes.ownershipText}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {"ARTIST"}
                </Typography>

                <Typography variant="body1" component="p">
                  {_nft.artist.substr(0, 4)} {"..."}{" "}
                  {_nft.artist.substr(38, 42)}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.ownershipContentBox}>
              <Avatar className={classes.avatar}>
                <a
                  href={`https://rinkeby.etherscan.io/address/${_nft.owner}`}
                  target="blank"
                >
                  <Identicon string={_nft.owner} size={32} />
                </a>
              </Avatar>

              <Box className={classes.ownershipText}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {"OWNER"}
                </Typography>

                <Typography variant="body1" component="p">
                  {_nft.owner.substr(0, 4)} {"..."} {_nft.owner.substr(38, 42)}
                </Typography>
              </Box>
            </Box>
          </Box>
          {_nft.owner !== _signerAddress && (
            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                aria-label="position"
                name="position"
                defaultValue="top"
                className={classes.formGroup}
              >
                {Number(_nft.sellingPrice) > 0 && (
                  <FormControlLabel
                    value="value1"
                    control={<Radio color="primary" onClick={handleBuyRadio} />}
                    className={classes.formControlLabel}
                    label={
                      <Box className={classes.labelBox}>
                        <Typography variant="h6" component="h6">
                          {"BUY NFT "}
                        </Typography>

                        <Typography variant="body1" component="p">
                          {"Price "}{" "}
                          <b>
                            {Number(formatUnits(_nft.sellingPrice.toString()))}{" "}
                            {"Ξ"}
                          </b>
                        </Typography>

                        <Typography
                          variant="body1"
                          component="p"
                          color="textSecondary"
                        >
                          {"7% resale fee for the artist"}
                        </Typography>
                      </Box>
                    }
                  />
                )}
                {Number(_nft.dailyLicensePrice) > 0 && (
                  <FormControlLabel
                    value="value2"
                    control={
                      <Radio color="primary" onClick={handleLicenseRadio} />
                    }
                    className={classes.formControlLabel}
                    label={
                      <Box className={classes.labelBox}>
                        <Typography variant="h6" component="h6">
                          {"GET A LICENSE"}
                        </Typography>
                        <Typography variant="body1" component="p">
                          {"Price (daily) "}{" "}
                          <b>
                            {Number(
                              formatUnits(_nft.dailyLicensePrice.toString())
                            )}{" "}
                            {"Ξ"}
                          </b>
                        </Typography>

                        <Typography
                          variant="body1"
                          component="p"
                          color="textSecondary"
                          gutterBottom
                        >
                          {"3% resale fee for the artist"}
                        </Typography>

                        <Slider
                          defaultValue={1}
                          step={1}
                          min={1}
                          max={90}
                          value={_days}
                          onChange={handleSliderChange}
                          disabled={!_licenseRadio}
                          valueLabelDisplay="auto"
                          aria-labelledby="discrete-slider-custom"
                        />
                        <Typography
                          variant="body2"
                          component="p"
                          color="textSecondary"
                          gutterBottom
                        >
                          {"License expiration in "} {_days} {" days"}
                        </Typography>
                      </Box>
                    }
                  />
                )}
              </RadioGroup>
              {Number(_nft.sellingPrice) !== 0 &&
                Number(_nft.dailyLicensePrice) !== 0 && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    className={classes.button}
                    disabled={!_buyRadio && !_licenseRadio}
                    onClick={handleBuy}
                  >
                    {_buyRadio
                      ? "BUY NFT"
                      : `BUY LICENSE FOR ${(
                          Number(
                            formatUnits(_nft.dailyLicensePrice.toString())
                          ) * _days
                        )
                          .toString()
                          .substr(0, 6)} Ξ`}
                  </Button>
                )}
            </FormControl>
          )}
        </>
      )}
      {!_nft && (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            {"No NFT!"}
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            {`Wrong identifier (${id})`}
          </Typography>
        </Box>
      )}
      <BackdropProgress open={providerContext._nfts.length < 0} />
    </ScrollableContainer>
  )
}
