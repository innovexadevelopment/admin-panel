"use client"

import { useState } from "react"
import imageCompression from "browser-image-compression"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

type Props = {
  site: "company" | "ngo"
  folder: string
  initialPath?: string | null
  onChange: (path: string | null) => void
}

export function ImageUploader({ site, folder, initialPath, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(
    initialPath
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${initialPath}`
      : null
  )
  const { toast } = useToast()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Compress to ~200kb
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })

      // Upload via API route (uses service role key, bypasses RLS)
      const formData = new FormData()
      formData.append('file', compressed, compressed.name)
      formData.append('site', site)
      formData.append('folder', folder)
      if (initialPath) {
        formData.append('oldPath', initialPath)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const data = await response.json()
      setPreview(data.url)
      onChange(data.path)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: err.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleClear() {
    if (initialPath) {
      try {
        await fetch(`/api/upload?path=${encodeURIComponent(initialPath)}`, {
          method: 'DELETE',
        })
      } catch (err) {
        console.error("Error deleting image:", err)
      }
    }
    setPreview(null)
    onChange(null)
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-lg border overflow-hidden bg-muted">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClear}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload an image (will be compressed to ~200KB)
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById(`file-input-${folder}`)?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Choose Image"
            )}
          </Button>
          <input
            id={`file-input-${folder}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
      {preview && !uploading && (
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`file-input-${folder}`)?.click()}
          className="w-full"
        >
          Replace Image
        </Button>
      )}
      <input
        id={`file-input-${folder}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

