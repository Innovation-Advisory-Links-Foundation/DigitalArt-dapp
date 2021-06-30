import React from "react"
import ScrollableContainer from "../components/ScrollableContainer"
import {
  createStyles,
  makeStyles,
  Theme,
  Typography,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import useProviderContext from "../hooks/useProviderContext"
import BackdropProgress from "../components/BackdropProgress"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      textAlign: "center",
      justifyContent: "center",
      paddingBottom: theme.spacing(8)
    },
    button: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    },
    uploadButton: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: "80%",
      height: "50vh"
    },
    input: {
      display: "none"
    },
    imagePreviewContainer: {
      width: "100%"
    },
    image: {
      width: "80%",
      pointerEvents: "none",
      marginBottom: theme.spacing(2)
    },
    text: {
      wordWrap: "break-word",
      padding: theme.spacing(1),
      textDecorationColor: "default"
    },
    authContent: {
      textAlign: "center",
      padding: theme.spacing(4)
    },
    checkboxes: {
      display: "flex",
      flexDirection: "column"
    }
  })
)

export default function MintNFTPage() {
  const classes = useStyles()
  const history = useHistory()
  const providerContext = useProviderContext()
  const { _smartContract, _ethersSigner, _ipfs } = providerContext

  // Form input data.
  const [_title, setTitle] = React.useState<string>("")
  const [_description, setDescription] = React.useState<string>("")
  const [_creator, setCreator] = React.useState<string>("")
  const [_year, setYear] = React.useState<string>("")
  const [_sellingPrice, setSellingPrice] = React.useState<string>("")
  const [_dailyLicensePrice, setDailyLicensePrice] = React.useState<string>("")

  // Backdrop progress.
  const [_progress, setProgress] = React.useState<boolean>(false)
  const openProgress = () => {
    setProgress(true)
  }
  const closeProgress = () => {
    setProgress(false)
  }

  // Uploaded image.
  const [_uploadedImage, setUploadedImage] = React.useState<any>()
  const uploadImage = (e: any) => {
    e.preventDefault()

    // Get the uploaded file.
    const file = e.target.files[0]
    setUploadedImage(URL.createObjectURL(file))
  }

  // Checkboxes.
  const [_checked, setChecked] = React.useState({
    first: false,
    second: false,
    third: false
  })

  const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({ ..._checked, [event.target.name]: event.target.checked })
  }

  const issueToken = async () => {
    openProgress()

    // Upload image to IPFS.
    const imageCID = await _ipfs.add(Buffer.from(_uploadedImage))

    // Upload NFT metadata to IPFS.
    const doc = JSON.stringify({
      title: _title,
      description: _description,
      creator: _creator,
      year: _year,
      image: `https://ipfs.io/ipfs/${imageCID[0].hash}`
    })
    const metadataCID = await _ipfs.add(Buffer.from(doc))

    // Send tx.
    const tx = await _smartContract
      .connect(_ethersSigner)
      .safeMint(
        `https://ipfs.io/ipfs/${metadataCID[0].hash}`,
        _sellingPrice,
        _dailyLicensePrice
      )

    await tx.wait()

    closeProgress()
    history.replace("/market")
  }

  // Clear image upload and form inputs.
  const onCancel = () => {
    setTitle("")
    setDescription("")
    setYear("")
    setCreator("")
    setSellingPrice("")
    setDailyLicensePrice("")
    setUploadedImage(null)
    setChecked({ first: false, second: false, third: false })
  }

  return (
    <ScrollableContainer className={classes.container} maxWidth="md">
      <Typography variant="h6" className={classes.text}>
        {"MINT YOUR NFT"}
      </Typography>

      <Box className={classes.imagePreviewContainer}>
        {_uploadedImage ? (
          <img src={_uploadedImage} className={classes.image} alt=""></img>
        ) : (
          <Button
            variant="outlined"
            color="inherit"
            className={classes.uploadButton}
            startIcon={<CloudUploadIcon />}
            component="label"
          >
            Upload File
            <input
              accept="image/*"
              className={classes.input}
              id="upload-button"
              type="file"
              onChange={uploadImage}
              hidden
            />
          </Button>
        )}
        {_title ? (
          <Typography variant="body1" className={classes.text}>
            <b>
              {_title} ({_year})
            </b>
          </Typography>
        ) : null}
        <Typography variant="body2" className={classes.text}>
          <i>{_description}</i>
        </Typography>
        {_creator ? (
          <Typography variant="body2">© {_creator}</Typography>
        ) : null}
      </Box>

      <TextField
        value={_title}
        onChange={(event) => setTitle(event.target.value)}
        margin="dense"
        label="Title"
        disabled={_uploadedImage ? false : true}
      />

      <TextField
        value={_description}
        onChange={(event) => setDescription(event.target.value)}
        margin="dense"
        label="Description"
        disabled={_uploadedImage ? false : true}
      />

      <TextField
        value={_creator}
        onChange={(event) => setCreator(event.target.value)}
        margin="dense"
        label="Original Creator"
        disabled={_uploadedImage ? false : true}
      />

      <TextField
        value={_year}
        onChange={(event) => setYear(event.target.value)}
        margin="dense"
        label="Year"
        disabled={_uploadedImage ? false : true}
      />

      <TextField
        value={_sellingPrice}
        onChange={(event) => setSellingPrice(event.target.value)}
        margin="dense"
        label="Selling Price (Wei)"
        disabled={_uploadedImage ? false : true}
      />

      <TextField
        value={_dailyLicensePrice}
        onChange={(event) => setDailyLicensePrice(event.target.value)}
        margin="dense"
        label="Daily License Price (Wei)"
        disabled={_uploadedImage ? false : true}
      />

      <Box className={classes.authContent}>
        <Box className={classes.checkboxes}>
          <FormControlLabel
            control={
              <Checkbox
                checked={_checked.first}
                onChange={onCheck}
                name="first"
                color="default"
              />
            }
            label={
              <Typography variant="body1" className={classes.text}>
                {
                  "This artwork is original and does not contain any copyrighted or restricted imagery or audio"
                }
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={_checked.second}
                onChange={onCheck}
                name="second"
                color="default"
              />
            }
            label={
              <Typography variant="body1" className={classes.text}>
                {
                  "This artwork is not and will not be tokenized or available for digital purchase elsewhere"
                }
              </Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={_checked.third}
                onChange={onCheck}
                name="third"
                color="default"
              />
            }
            label={
              <Typography variant="body1" className={classes.text}>
                I agree to the{" "}
                <Button variant="text" color="primary">
                  <u>Terms of Service</u>
                </Button>
              </Typography>
            }
          />
          <Button
            className={classes.button}
            onClick={issueToken}
            variant="outlined"
            color="inherit"
            disabled={
              _sellingPrice &&
              _dailyLicensePrice &&
              _checked.first &&
              _checked.second &&
              _checked.third
                ? false
                : true
            }
          >
            Tokenize
          </Button>
          <Button
            className={classes.button}
            onClick={onCancel}
            variant="outlined"
            disabled={_uploadedImage ? false : true}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      <BackdropProgress open={_progress} />
    </ScrollableContainer>
  )
}
