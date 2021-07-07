import React from "react"
import { ProviderContextType } from "../context/ProviderContextType"
import { DigitalArt } from "../types/DigitalArt"
import { NFT } from "../types/NFT"
import { retrieveNfts } from "../utils/nft"
import { onNFTMinted } from "../utils/listeners"
import { MintNFTInputData } from "../types/TXInputData"

// Hook for handling the custom Metamask provider.
export default function useProviderContext(
  digitalArt: DigitalArt | undefined
): ProviderContextType {
  const [_nfts, setNfts] = React.useState<Array<NFT>>([])
  const [_signerAddress, setSignerAddress] = React.useState<string>("")

  React.useEffect(() => {
    ;(async function () {
      // Check if MetaMask is properly connected, so we get a Signer object for the current account.
      if (digitalArt?.signer._address) {
        // Update signer. // TODO -> refactoring? can be used for checks?
        setSignerAddress(digitalArt.signer._address)

        // Read data from smart contracts.
        const nfts = await retrieveNfts(digitalArt.contract)

        if (nfts.length > 0) {
          setNfts(nfts)
        }
      }
    })()
  }, [digitalArt?.signer._address])

  // Listen to mint token events (Transfer) to stay up-to-date.
  React.useEffect(() => {
    if (digitalArt) {
      return onNFTMinted(digitalArt.contract, (nft) => {
        // TODO -> Refactoring, but for now it works (duplicate last id fixed).
        if (_nfts.length === 0) setNfts([..._nfts, nft])
        else {
          if (Number(nft.id) !== Number(_nfts[_nfts.length - 1].id))
            setNfts([..._nfts, nft])
        }
      })
    }
  }, [digitalArt, _nfts])

  async function mintNFT(data: MintNFTInputData) {
    if (digitalArt) {
      // Upload image to IPFS.
      const imageCID = await digitalArt.ipfs.add(Buffer.from(data.image))

      // Upload NFT metadata to IPFS.
      const doc = JSON.stringify({
        title: data.title,
        description: data.description,
        creator: data.creator,
        year: data.year,
        image: `https://ipfs.io/ipfs/${imageCID[0].hash}`
      })
      const metadataCID = await digitalArt.ipfs.add(Buffer.from(doc))

      const tx = await digitalArt.contract
        .connect(digitalArt.signer)
        .safeMint(
          `https://ipfs.io/ipfs/${metadataCID[0].hash}`,
          data.sellingPrice,
          data.dailyLicensePrice
        )

      await tx.wait()
    }
  }

  return {
    _nfts,
    mintNFT,
    _signerAddress
  }
}
