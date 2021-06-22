import React from "react"
import ProviderContext, {
  ProviderContextType
} from "../context/ProviderContextType"
import { Typography } from "@material-ui/core"

// Example of custom Context Provider usage.
function Address() {
  const providerContext = React.useContext(
    ProviderContext
  ) as ProviderContextType
  const { _ethersSigner } = providerContext

  return <Typography>{_ethersSigner._address}</Typography>
}

export default Address
