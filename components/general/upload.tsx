'use client'

import { useRef, useState } from "react"
import { Button } from "../ui/button"
import { getTemporaryURL } from "@/lib/actions"
import { pinata } from "@/utils/config"

export default function Upload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setUploading] = useState(false)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const preview = URL.createObjectURL(file)
      setPreviewURL(preview)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    try {
      setUploading(true)
      const { url } = await getTemporaryURL()
      const uploadResponse = await pinata.upload.public.file(selectedFile).url(url)
      const fileUrl = await pinata.gateways.public.convert(uploadResponse.cid)
      console.log("File uploaded:", fileUrl)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center capitalize text-muted-foreground mb-8">
        Create your own gallery
      </h1>

      <div className="flex flex-wrap justify-center gap-4 p-5 bg-accent-background max-w-screen min-h-[300px] border rounded-2xl mb-4">
        {previewURL ? (
          <img
            src={previewURL}
            alt="Selected preview"
            className="h-[300px] w-auto object-cover rounded-lg border shadow"
          />) : (
          <div className="object-cover flex items-center justify-center">
            No image selected
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose Image
        </Button>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </div>
    </div>
  )
}
