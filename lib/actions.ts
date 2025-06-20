'use server'

import { pinata } from "@/utils/config"

export async function getTemporaryURL() {
  try {
    const url = await pinata.upload.public.createSignedURL({
      expires: 30, // in seconds
    })
    console.log("Generated signed URL:", url)
    return { url }
  } catch (error) {
    console.error("Error creating signed URL:", error)
    throw new Error("Failed to generate upload URL")
  }
}

let cache: {
  timestamp: number
  data: any
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in ms

export async function getPinataFiles() {
  const now = Date.now()

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    console.log("Using cached Pinata files")
    return { files: cache.data }
  }

  try {
    const files = await pinata.files.public.list()
    cache = {
      timestamp: now,
      data: files,
    }
    console.log("Fetched new Pinata files")
    return { files }
  } catch (error) {
    console.error("Error fetching files:", error)
    throw new Error("Failed to fetch files")
  }
}
