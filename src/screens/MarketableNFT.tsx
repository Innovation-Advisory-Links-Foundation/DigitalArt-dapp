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
import { LicensePurchasedEvent, NFT } from "../types/Blockchain"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import Identicon from "react-identicons"
import BackdropProgress from "../components/BackdropProgress"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ScrollableContainer from "../components/ScrollableContainer"
import { formatUnits } from "ethers/lib/utils"
import { BigNumber } from "ethers"

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
    purchaseTitle: {
      marginTop: theme.spacing(1)
    },
    ownershipContainerBox: {
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
    },
    cardText: {
      textAlign: "left"
    },
    ownershipBox: {
      width: "100%",
      margin: theme.spacing(1),
      display: "flex"
    },
    cardContainer: {
      display: "flex",
      flexDirection: "row"
    },
    ownerArtistBox: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  })
)

export default function MarketableNFTPage() {
  // Material UI Theming.
  const classes = useStyles()

  // State.
  const [_nft, setNft] = React.useState<NFT>()
  // Licenses.
  const [_licenses, setLicenses] = React.useState<Array<LicensePurchasedEvent>>(
    []
  )
  // Backdrop progress.
  const [_progress = true, startProgress, stopProgress] = useBooleanCondition()
  // Radio buttons.
  const [_buyRadio, checkBuyRadio, uncheckBuyRadio] = useBooleanCondition()
  const [_licenseRadio, checkLicenseRadio, uncheckLicenseRadio] =
    useBooleanCondition()
  // Slider value.
  const [_days, setDays] = React.useState<number>(1)
  // User License Validity.
  const [_hasValidLicense, setHasValidLicense] = React.useState<boolean>(false)

  // Retrieve the id from the url.
  const { id } = useParams<any>()

  // React router dom providers.
  const history = useHistory()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const {
    _signerAddress,
    buyNFT,
    buyLicense,
    getLicensePurchasedEventsForNFT
  } = providerContext

  // TODO -> try to check if a user already has a valid license on the nft.

  React.useEffect(() => {
    startProgress()

    setNft(providerContext._nfts.find((nft) => Number(nft.id) === Number(id)))
  }, [providerContext._nfts.length > 0])

  React.useEffect(() => {
    const getLicenses = async () => {
      if (_nft) {
        const licensesForNFT = await getLicensePurchasedEventsForNFT(
          Number(_nft.id)
        )

        const filteredLicenses = licensesForNFT.filter(
          (licenseEvent: LicensePurchasedEvent) =>
            licenseEvent.sender === _signerAddress
        )

        if (filteredLicenses.length > 0) {
          setHasValidLicense(
            filteredLicenses.filter(
              (license: LicensePurchasedEvent) =>
                Number(license.endDateInMillis) - new Date().getTime()
            ).length > 0
          )
        } else {
          setHasValidLicense(false)
        }
      }
    }

    getLicenses()
    stopProgress()
  }, [providerContext._signerAddress])

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
        txValue: BigNumber.from(_nft.sellingPrice)
      })

      stopProgress()

      // Redirect.
      history.replace(`/collection/${_nft.id}`)
    } else {
      if (_nft && _licenseRadio) {
        const bgDays = BigNumber.from(_days)
        const bgDailyLicensePrice = BigNumber.from(_nft.dailyLicensePrice)

        // Send tx.
        await buyLicense({
          id,
          days: _days,
          txValue: bgDailyLicensePrice.mul(bgDays)
        })

        stopProgress()

        // Redirect.
        history.replace(`/licenses`)
      }
    }
  }

  return (
    <ScrollableContainer className={classes.container} maxWidth="md">
      {_nft && (
        <>
          <img src={_nft.metadata.image} className={classes.image} alt=""></img>
          <Typography variant="h4" component="h1">
            {_nft.metadata.title}
          </Typography>

          <Typography variant="body1" component="p" gutterBottom>
            {_nft.metadata.description}
          </Typography>

          <Divider className={classes.divider} />
          <Box className={classes.ownershipBox}>
            <Box className={classes.ownerArtistBox}>
              <Typography
                gutterBottom
                variant="body1"
                className={classes.cardText}
                color="textSecondary"
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "0.8rem"
                }}
              >
                {"ARTIST"}
              </Typography>

              <Avatar className={classes.avatar}>
                <a
                  href={`https://rinkeby.etherscan.io/address/${_nft.artist}`}
                  target="blank"
                >
                  <Identicon string={_nft.artist} size={32} />
                </a>
              </Avatar>
            </Box>
            <Box className={classes.ownerArtistBox}>
              <Typography
                gutterBottom
                variant="body1"
                className={classes.cardText}
                color="textSecondary"
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: "0.8rem"
                }}
              >
                {"OWNER"}
              </Typography>

              <Avatar className={classes.avatar}>
                <a
                  href={`https://rinkeby.etherscan.io/address/${_nft.owner}`}
                  target="blank"
                >
                  <Identicon string={_nft.owner} size={32} />
                </a>
              </Avatar>
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
                        <Typography
                          variant="body1"
                          component="h6"
                          className={classes.purchaseTitle}
                        >
                          <b>{"BUY NFT "}</b>
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
                {Number(_nft.dailyLicensePrice) > 0 && _hasValidLicense && (
                  <FormControlLabel
                    value="value2"
                    control={
                      <Radio color="primary" onClick={handleLicenseRadio} />
                    }
                    className={classes.formControlLabel}
                    label={
                      <Box className={classes.labelBox}>
                        <Typography
                          variant="body1"
                          component="h6"
                          className={classes.purchaseTitle}
                        >
                          <b>{"GET A LICENSE"}</b>
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
              {(Number(_nft.sellingPrice) !== 0 ||
                (Number(_nft.dailyLicensePrice) !== 0 && _hasValidLicense)) && (
                <Button
                  variant="outlined"
                  color="inherit"
                  className={classes.button}
                  disabled={!_buyRadio && !_licenseRadio}
                  onClick={handleBuy}
                >
                  {_buyRadio && "BUY NFT"}
                  {_licenseRadio &&
                    `BUY LICENSE FOR ${(
                      Number(formatUnits(_nft.dailyLicensePrice.toString())) *
                      _days
                    )
                      .toString()
                      .substr(0, 6)} Ξ`}
                  {!_buyRadio && !_licenseRadio ? "..." : ""}
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
