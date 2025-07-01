import storageClient from "./storageClient"

export async function initImageContainer() {
  const containerName = "images"
  const container = storageClient.getContainerClient(containerName)

  try {
    const { succeeded } = await container.createIfNotExists({ access: "blob" })
    console.info(
      succeeded
        ? `[Stillbit] Created container: ${containerName}`
        : `[Stillbit] Container exists: ${containerName}`
    )
  } catch (err) {
    console.error(`[Stillbit] Failed to initialize container '${containerName}':`, err)
    throw new Error("Container init failed")
  }

  return container
}
