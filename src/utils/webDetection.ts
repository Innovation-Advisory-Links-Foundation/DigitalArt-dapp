import axios from "axios"

/**
 * Execute the web detection for a specified image stored on IPFS.
 * @param {string} ipfsCID The unique resource locator where the image is stored on IPFS.
 * @returns {Promise<any>} An object containing the detected pages json object.
 */
export default async function webDetect(ipfsCID: string): Promise<any> {
  try {
    const response = await axios.post(`http://localhost:8080/detect`, {
      ipfsCID: ipfsCID
    })

    if (response.status === 200 && response.data) {
      return response.data
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
