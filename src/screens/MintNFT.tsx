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
import ProviderContext, {
  ProviderContextType
} from "../context/ProviderContextType"
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
  // Material UI Theming.
  const classes = useStyles()

  // Form input data.
  const [_title, setTitle] = React.useState<string>("")
  const [_description, setDescription] = React.useState<string>("")
  const [_creator, setCreator] = React.useState<string>("")
  const [_year, setYear] = React.useState<string>("")
  const [_sellingPrice, setSellingPrice] = React.useState<string>("")
  const [_dailyLicensePrice, setDailyLicensePrice] = React.useState<string>("")
  // Backdrop progress.
  const [_progress, setProgress] = React.useState<boolean>(false)
  // Uploaded image.
  const [_uploadedImagePreview, setUploadedImagePreview] = React.useState<any>()
  const [_uploadedImageIpfs, setUploadedImageIpfs] = React.useState<any>()
  // Checkboxes.
  const [_checked, setChecked] = React.useState({
    first: false,
    second: false,
    third: false
  })

  // React router dom providers.
  const history = useHistory()

  // Custom providers.
  const providerContext = React.useContext(
    ProviderContext
  ) as ProviderContextType
  const { mintNFT } = providerContext

  const openProgress = () => {
    setProgress(true)
  }
  const closeProgress = () => {
    setProgress(false)
  }

  const uploadImage = (e: any) => {
    e.preventDefault()

    // Get the uploaded file.
    const file = e.target.files[0]
    setUploadedImagePreview(URL.createObjectURL(file))

    // Prepare image for IPFS upload.
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setUploadedImageIpfs(reader.result)
    }
  }

  const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked({ ..._checked, [event.target.name]: event.target.checked })
  }

  const issueToken = async () => {
    openProgress()

    // Send tx.
    await mintNFT({
      title: _title,
      description: _description,
      creator: _creator,
      year: _year,
      image: _uploadedImageIpfs,
      sellingPrice: _sellingPrice,
      dailyLicensePrice: _dailyLicensePrice
    })
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
    setUploadedImagePreview(null)
    setUploadedImageIpfs(null)
    setChecked({ first: false, second: false, third: false })
  }

  return (
    <ScrollableContainer className={classes.container} maxWidth="md">
      <Typography variant="h6" className={classes.text}>
        {"MINT YOUR NFT"}
      </Typography>

      <Box className={classes.imagePreviewContainer}>
        {_uploadedImagePreview ? (
          <img
            src={_uploadedImagePreview}
            className={classes.image}
            alt=""
          ></img>
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
        disabled={_uploadedImagePreview ? false : true}
      />

      <TextField
        value={_description}
        onChange={(event) => setDescription(event.target.value)}
        margin="dense"
        label="Description"
        disabled={_uploadedImagePreview ? false : true}
      />

      <TextField
        value={_creator}
        onChange={(event) => setCreator(event.target.value)}
        margin="dense"
        label="Original Creator"
        disabled={_uploadedImagePreview ? false : true}
      />

      <TextField
        type="number"
        value={_year}
        onChange={(event) => setYear(event.target.value)}
        margin="dense"
        label="Year"
        disabled={_uploadedImagePreview ? false : true}
      />

      <TextField
        value={_sellingPrice}
        onChange={(event) => setSellingPrice(event.target.value)}
        margin="dense"
        label="Selling Price (Wei)"
        disabled={_uploadedImagePreview ? false : true}
      />

      <TextField
        value={_dailyLicensePrice}
        onChange={(event) => setDailyLicensePrice(event.target.value)}
        margin="dense"
        label="Daily License Price (Wei)"
        disabled={_uploadedImagePreview ? false : true}
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
            disabled={_uploadedImagePreview ? false : true}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      <BackdropProgress open={_progress} />
    </ScrollableContainer>
  )
}
