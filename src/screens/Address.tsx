import React from "react"
import ProviderContext, {
  ProviderContextType
} from "../context/ProviderContextType"
import { Typography } from "@material-ui/core"
import { useEffect } from "react"

// Example of custom Context Provider usage.
function Address() {
  const [dummyRead, setDummyRead] = React.useState<any>()

  const providerContext = React.useContext(
    ProviderContext
  ) as ProviderContextType
  const { _ethersSigner, _smartContract } = providerContext

  useEffect(() => {
    const init = async () => {
      setDummyRead(await _smartContract.name())
    }
    init()
  }, [])

  return (
    <>
      <Typography>ETH Account: {_ethersSigner._address}</Typography>
      <Typography>
        ETH Smart Contract Address: {_smartContract.address}
      </Typography>
      <Typography>ETH Smart Contract Name: {dummyRead} </Typography>
    </>
  )
}

export default Address
