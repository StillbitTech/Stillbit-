import { initImageContainer } from "./initContainer"

export async function uploadImage(file: File): Promise<string> {
  const container = await initImageContainer()
  const blobClient = container.getBlockBlobClient(file.name)

  try {
    if (await blobClient.exists()) {
      await blobClient.delete()
      console.warn(`[Stillbit] Existing blob replaced: ${file.name}`)
    }

    const buffer = await file.arrayBuffer()
    await blobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.type || "application/octet-stream"
      }
    })

    const publicUrl = blobClient.url.split("?")[0]
    console.info(`[Stillbit] Upload complete: ${publicUrl}`)
    return publicUrl
  } catch (err) {
    console.error(`[Stillbit] Upload error: ${file.name}`, err)
    throw new Error("Image upload failed")
  }
}

export async function deleteImage(fileName: string): Promise<void> {
  const container = await initImageContainer()
  const blobClient = container.getBlockBlobClient(fileName)

  try {
    if (await blobClient.exists()) {
      await blobClient.delete()
      console.info(`[Stillbit] Deleted: ${fileName}`)
    } else {
      console.warn(`[Stillbit] Blob not found: ${fileName}`)
    }
  } catch (err) {
    console.error(`[Stillbit] Delete error: ${fileName}`, err)
    throw new Error("Image deletion failed")
  }
}
