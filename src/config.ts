import { abi } from "./contracts/DigitalArt.json"

const config = {
  contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  abi
}

export default {
  development: {
    ...config,
    ipfsProvider: "YOUR-CUSTOM-PROVIDER"
  },
  test: config,
  production: {
    ...config,
    ethereumProvider: "YOUR-CUSTOM-PROVIDER",
    ipfsProvider: "YOUR-CUSTOM-PROVIDER",
    contractAddress: "YOUR-PROD-ADDRESS-HERE"
  }
}[process.env.NODE_ENV]
