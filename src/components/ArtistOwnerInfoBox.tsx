import {
  createStyles,
  makeStyles,
  Theme,
  Avatar,
  Box,
  Typography
} from "@material-ui/core"
import Identicon from "react-identicons"

export interface BackdropProgressProps {
  artist: string
  owner: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ownershipBox: {
      marginTop: theme.spacing(2),
      display: "flex",
      width: "100%"
    },
    ownerArtistBox: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    },
    ownershipText: {
      textAlign: "left",
      padding: 0,
      margin: 0,
      fontSize: "0.8rem"
    },
    avatar: {
      backgroundColor: "transparent"
    }
  })
)

// Custom box container where the artist and owner clickable avatars are shown.
export default function ArtistOwnerInfoBox({
  artist,
  owner
}: BackdropProgressProps) {
  const classes = useStyles()

  return (
    <Box className={classes.ownershipBox}>
      <Box className={classes.ownerArtistBox}>
        <Typography
          gutterBottom
          variant="body1"
          className={classes.ownershipText}
          color="textSecondary"
        >
          {"ARTIST"}
        </Typography>

        <Avatar className={classes.avatar}>
          <a
            href={`https://ropsten.etherscan.io/address/${artist}`}
            target="blank"
          >
            <Identicon string={artist} size={32} />
          </a>
        </Avatar>
      </Box>
      <Box className={classes.ownerArtistBox}>
        <Typography
          gutterBottom
          variant="body1"
          className={classes.ownershipText}
          color="textSecondary"
        >
          {"OWNER"}
        </Typography>

        <Avatar className={classes.avatar}>
          <a
            href={`https://ropsten.etherscan.io/address/${owner}`}
            target="blank"
          >
            <Identicon string={owner} size={32} />
          </a>
        </Avatar>
      </Box>
    </Box>
  )
}
