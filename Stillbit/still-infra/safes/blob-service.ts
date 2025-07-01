import { BlobServiceClient } from "@azure/storage-blob"

const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL?.trim()
const sasToken = process.env.NEXT_PUBLIC_STORAGE_SAS?.trim()

if (!baseUrl || !sasToken) {
  throw new Error("Storage configuration missing: baseUrl or SAS token")
}

const separator = baseUrl.includes("?") ? "&" : "?"
const authSegment = sasToken.startsWith("sv=") ? sasToken : `sv=${sasToken}`
const connectionUrl = `${baseUrl}${separator}${authSegment}`

let storageClient: BlobServiceClient

try {
  storageClient = new BlobServiceClient(connectionUrl)
  console.info("[Stillbit] Storage client initialized")
} catch (err) {
  console.error("[Stillbit] Storage initialization error:", err)
  throw new Error("Storage client setup failed")
}

export default storageClient
