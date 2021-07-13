import React from "react"
import {
  Theme,
  Typography,
  Divider,
  Box,
  Button,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  TextField
} from "@material-ui/core"
import createStyles from "@material-ui/core/styles/createStyles"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useHistory, useParams } from "react-router-dom"
import { NFT } from "../types/Blockchain"
import ProviderContext, {
  DigitalArtContextType
} from "../context/DigitalArtContext"
import BackdropProgress from "../components/BackdropProgress"
import useBooleanCondition from "../hooks/useBooleanCondition"
import ScrollableContainer from "../components/ScrollableContainer"
import { formatUnits, parseUnits } from "ethers/lib/utils"

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
    priceContainerBox: {
      width: "95%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: theme.spacing(1)
    },
    priceTitle: {
      marginTop: theme.spacing(1)
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

export default function PurchasedNFTPage() {
  // Material UI Theming.
  const classes = useStyles()

  // State.
  const [_nft, setNft] = React.useState<NFT>()
  // New prices.
  const [_newSellingPrice, setNewSellingPrice] = React.useState<string>("")
  const [_newDailyLicensePrice, setNewDailyLicensePrice] =
    React.useState<string>("")
  // Backdrop progress.
  const [_progress = true, startProgress, stopProgress] = useBooleanCondition()
  // Radio buttons.
  const [_buyPriceRadio, checkBuyPriceRadio, uncheckBuyPriceRadio] =
    useBooleanCondition()
  const [_licensePriceRadio, checkLicensePriceRadio, uncheckLicensePriceRadio] =
    useBooleanCondition()

  // Retrieve the id from the url.
  const { id } = useParams<any>()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as DigitalArtContextType
  const { _signerAddress, updateSellingPrice, updateDailyLicensePrice } =
    providerContext

  // TODO -> try to check if a user already has a valid license on the nft.
  React.useEffect(() => {
    startProgress()

    setNft(providerContext._nfts.find((nft) => Number(nft.id) === Number(id)))

    stopProgress()
  }, [providerContext._nfts])

  const handleBuyPriceRadio = () => {
    checkBuyPriceRadio()
    uncheckLicensePriceRadio()
    setNewDailyLicensePrice("")
  }

  const handleLicensePriceRadio = () => {
    checkLicensePriceRadio()
    uncheckBuyPriceRadio()
    setNewSellingPrice("")
  }

  const handlePriceUpdate = async () => {
    startProgress()

    if (_nft && _buyPriceRadio && Number(_nft.sellingPrice) >= 0) {
      const sellingPriceInWei = Number(
        parseUnits(_newSellingPrice, 18)
      ).toString()

      // Send tx.
      await updateSellingPrice({
        tokenId: _nft.id,
        newSellingPrice: sellingPriceInWei
      })

      stopProgress()

      // Redirect? Maybe he/she can check the updated price on the same page.
      // history.replace("/collection")
    } else {
      if (_nft && _licensePriceRadio && Number(_nft.dailyLicensePrice) >= 0) {
        const dailyLicensePriceInWei = Number(
          parseUnits(_newDailyLicensePrice, 18)
        ).toString()

        // Send tx.
        await updateDailyLicensePrice({
          tokenId: _nft.id,
          newDailyLicensePrice: dailyLicensePriceInWei
        })

        stopProgress()
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
          <Box className={classes.priceContainerBox}>
            <Box className={classes.ownershipText}>
              <Typography variant="body1" component="p" color="textSecondary">
                {"SELLING PRICE"}
              </Typography>

              <Typography
                variant="h6"
                component="p"
                style={{
                  textAlign: "center",
                  color: _nft.sellingPrice > 0 ? "green" : "red"
                }}
              >
                <b>
                  {Number(formatUnits(_nft.sellingPrice.toString()))} {"Ξ"}
                </b>
              </Typography>
            </Box>
            <Box className={classes.ownershipText}>
              <Typography variant="body1" component="p" color="textSecondary">
                {"DAILY LICENSE PRICE"}
              </Typography>

              <Typography
                variant="h6"
                component="p"
                style={{
                  textAlign: "center",
                  color: _nft.dailyLicensePrice > 0 ? "green" : "red"
                }}
              >
                <b>
                  {Number(formatUnits(_nft.dailyLicensePrice.toString()))}
                  {" Ξ "}
                </b>
              </Typography>
            </Box>
          </Box>
          {/* DOING REFACTORING */}
          {_nft.owner === _signerAddress && (
            <FormControl component="fieldset" className={classes.formControl}>
              <RadioGroup
                aria-label="position"
                name="position"
                defaultValue="top"
                className={classes.formGroup}
              >
                <FormControlLabel
                  value="value1"
                  control={
                    <Radio color="primary" onClick={handleBuyPriceRadio} />
                  }
                  className={classes.formControlLabel}
                  label={
                    <Box className={classes.labelBox}>
                      <Typography
                        variant="body1"
                        component="h6"
                        className={classes.priceTitle}
                      >
                        <b>
                          {Number(_nft.sellingPrice) > 0
                            ? "CHANGE PRICE"
                            : "SELL"}
                        </b>
                      </Typography>

                      <TextField
                        type="number"
                        value={_newSellingPrice}
                        onChange={(event) =>
                          setNewSellingPrice(event.target.value)
                        }
                        margin="dense"
                        label="Price (Ξ)"
                        placeholder="0.1"
                        disabled={_buyPriceRadio ? false : true}
                      />

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

                <FormControlLabel
                  value="value2"
                  control={
                    <Radio color="primary" onClick={handleLicensePriceRadio} />
                  }
                  className={classes.formControlLabel}
                  label={
                    <Box className={classes.labelBox}>
                      <Typography
                        variant="body1"
                        component="h6"
                        className={classes.priceTitle}
                      >
                        <b>
                          {Number(_nft.dailyLicensePrice) > 0
                            ? "UPDATE LICENSE FEE"
                            : "MAKE LICENSABLE"}
                        </b>
                      </Typography>

                      <TextField
                        type="number"
                        value={_newDailyLicensePrice}
                        onChange={(event) =>
                          setNewDailyLicensePrice(event.target.value)
                        }
                        margin="dense"
                        label="Daily Fee (Ξ)"
                        placeholder="0.1"
                        disabled={_licensePriceRadio ? false : true}
                      />

                      <Typography
                        variant="body1"
                        component="p"
                        color="textSecondary"
                        gutterBottom
                      >
                        {"3% resale fee for the artist"}
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
              <Button
                variant="outlined"
                color="inherit"
                className={classes.button}
                disabled={
                  (!_buyPriceRadio && !_licensePriceRadio) ||
                  (!_newSellingPrice && !_newDailyLicensePrice) ||
                  (_buyPriceRadio &&
                    Number(_newSellingPrice) <= 0 &&
                    Number(_nft.sellingPrice) === 0) ||
                  (Number(_nft.sellingPrice) > 0 &&
                    Number(_newSellingPrice) < 0) ||
                  (_buyPriceRadio &&
                    Number(_newDailyLicensePrice) <= 0 &&
                    Number(_nft.dailyLicensePrice) === 0) ||
                  (Number(_nft.dailyLicensePrice) > 0 &&
                    Number(_newDailyLicensePrice) < 0)
                }
                onClick={handlePriceUpdate}
              >
                {_buyPriceRadio &&
                  Number(_nft.sellingPrice) > 0 &&
                  Number(_newSellingPrice) === 0 &&
                  "REMOVE FROM SALE"}
                {_licensePriceRadio &&
                  Number(_nft.dailyLicensePrice) > 0 &&
                  Number(_newDailyLicensePrice) === 0 &&
                  "REMOVE FROM LICENSING"}
                {_buyPriceRadio &&
                  Number(_nft.sellingPrice) === 0 &&
                  Number(_newSellingPrice) > 0 &&
                  "PUT ON SALE"}
                {_licensePriceRadio &&
                  Number(_nft.dailyLicensePrice) === 0 &&
                  Number(_newDailyLicensePrice) > 0 &&
                  "PUT ON LICENSE"}
                {_buyPriceRadio &&
                  Number(_nft.sellingPrice) > 0 &&
                  Number(_newSellingPrice) > 0 &&
                  "CHANGE SALE PRICE"}
                {_licensePriceRadio &&
                  Number(_nft.dailyLicensePrice) > 0 &&
                  Number(_newDailyLicensePrice) > 0 &&
                  "CHANGE LICENSE PRICE"}
                {(!_buyPriceRadio && !_licensePriceRadio) ||
                (_buyPriceRadio && Number(_newSellingPrice) <= 0) ||
                (_licensePriceRadio && Number(_newDailyLicensePrice) <= 0)
                  ? "..."
                  : ""}
              </Button>
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
