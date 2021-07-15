import React, { ReactNode } from "react"
import ScrollableContainer from "../components/ScrollableContainer"
import {
  createStyles,
  makeStyles,
  Theme,
  Box,
  Typography,
  Grid
} from "@material-ui/core"
import { NFT } from "../types/Blockchain"

export interface NFTCardsContainerProps {
  children?: ReactNode
  fab?: ReactNode
  pageTitle: string
  errorMessage: string
  filteredNFTs: Array<NFT>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
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
      paddingBottom: theme.spacing(1),
      border: "1px solid black",
      width: "33vw",
      [theme.breakpoints.down("sm")]: {
        width: "86vw"
      }
    }
  })
)

export default function NFTCardsContainer({
  children,
  fab,
  pageTitle,
  errorMessage,
  filteredNFTs
}: NFTCardsContainerProps) {
  // Material UI Theming.
  const classes = useStyles()
  return (
    <ScrollableContainer maxWidth="xl">
      <Typography variant="h5" component="h1" className={classes.title}>
        {pageTitle}
      </Typography>
      {filteredNFTs.length > 0 ? (
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          {children}
        </Grid>
      ) : (
        <Box className={classes.emptyListBox}>
          <Typography className={classes.emptyListText} variant="h4">
            No NFTs!
          </Typography>
          <Typography className={classes.emptyListText} variant="subtitle1">
            {errorMessage}
          </Typography>
        </Box>
      )}
      {fab}
    </ScrollableContainer>
  )
}
