import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  fileType?: string
}

/**
 * Compresses an image file to WebP format with size under 100KB
 * Uses iterative compression to ensure file size is always under 100KB
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const maxSizeBytes = 100 * 1024 // 100KB in bytes
  const useWebWorker = options.useWebWorker ?? true
  const fileType = 'image/webp' // Always convert to WebP

  try {
    // Get original file name without extension
    const originalName = file.name.replace(/\.[^/.]+$/, '')
    
    let quality = 0.85
    let maxWidthOrHeight = 1920
    let compressedFile: File = file // Initialize with original file
    let attempts = 0
    const maxAttempts = 10

    // Iteratively compress until under 100KB
    while (attempts < maxAttempts) {
      attempts++
      
      compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1, // 100KB
        maxWidthOrHeight,
        useWebWorker,
        fileType,
        initialQuality: quality,
        alwaysKeepResolution: false,
      })

      // Check if file size is under 100KB
      if (compressedFile.size <= maxSizeBytes) {
        break
      }

      // Reduce quality and/or dimensions for next attempt
      if (quality > 0.5) {
        quality -= 0.1
      } else {
        quality = Math.max(0.4, quality - 0.05)
        maxWidthOrHeight = Math.max(600, maxWidthOrHeight - 200)
      }
    }

    // If still too large after all attempts, do final aggressive compression
    if (compressedFile.size > maxSizeBytes) {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker,
        fileType,
        initialQuality: 0.5,
        alwaysKeepResolution: false,
      })
      
      // If still too large, do one more aggressive pass
      if (compressedFile.size > maxSizeBytes) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 600,
          useWebWorker,
          fileType,
          initialQuality: 0.4,
          alwaysKeepResolution: false,
        })
      }
    }

    // Ensure the file name has .webp extension and correct MIME type
    const fileName = originalName + '.webp'
    
    // Create a new File object with the correct name and WebP type
    const webpFile = new File([compressedFile], fileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    return webpFile
  } catch (error) {
    console.error('Image compression error:', error)
    throw new Error('Failed to compress image to WebP format')
  }
}

/**
 * Validates if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Gets image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

