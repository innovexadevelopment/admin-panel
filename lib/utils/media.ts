import { supabase } from '../supabase/client'
import { compressImage, getImageDimensions, isImageFile } from './image-compression'
import { getTableName } from './tables'
import type { WebsiteType } from '../types-separate'
import type { Media } from '../types-separate'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

export interface UploadMediaOptions {
  file: File
  websiteType: WebsiteType
  folder: 'pages' | 'blogs' | 'team' | 'testimonials' | 'partners' | 'programs' | 'projects'
  altText?: string
  caption?: string
}

/**
 * Uploads a media file to Supabase storage with automatic compression
 * Returns the media record from database
 */
export async function uploadMedia(
  options: UploadMediaOptions
): Promise<Media> {
  const { file, websiteType, folder, altText, caption } = options

  // Compress image if it's an image file
  let fileToUpload = file
  let width: number | undefined
  let height: number | undefined
  let mimeType = file.type
  let fileName: string

  if (isImageFile(file)) {
    // Always convert images to WebP format and compress under 100KB
    fileToUpload = await compressImage(file)
    const dimensions = await getImageDimensions(fileToUpload)
    width = dimensions.width
    height = dimensions.height
    mimeType = 'image/webp' // Always WebP for images
    
    // Generate unique file name with .webp extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    fileName = `${timestamp}-${randomString}.webp`
    
    // Create a new File object with the unique name (keeping the compressed blob)
    fileToUpload = new File([fileToUpload], fileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })
  } else {
    // For non-image files, use original extension
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'bin'
    fileName = `${timestamp}-${randomString}.${fileExtension}`
  }

  const filePath = `${websiteType}/${folder}/${fileName}`

  // Upload to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, fileToUpload, {
      contentType: mimeType,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(filePath)

  const fileUrl = urlData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/media/${filePath}`

  // Get current user for created_by
  const { data: { user } } = await supabase.auth.getUser()

  // Create media record in database (using separate table)
  const tableName = getTableName(websiteType, 'media')
  const { data: media, error: mediaError } = await supabase
    .from(tableName)
    .insert({
      file_name: fileName, // Use the processed file name (always .webp for images)
      file_path: filePath,
      file_url: fileUrl,
      file_size: fileToUpload.size,
      mime_type: mimeType, // Always 'image/webp' for images
      type: isImageFile(file) ? 'image' : 'other',
      width,
      height,
      alt_text: altText,
      caption: caption,
      folder_path: folder,
      created_by: user?.id,
    })
    .select()
    .single()

  if (mediaError || !media) {
    // Clean up uploaded file if database insert fails
    await supabase.storage.from('media').remove([filePath])
    throw new Error(`Failed to create media record: ${mediaError?.message}`)
  }

  return media
}

/**
 * Deletes a media file from both storage and database
 * Note: You need to specify websiteType to know which table to query
 */
export async function deleteMedia(mediaId: string, websiteType: WebsiteType): Promise<void> {
  const tableName = getTableName(websiteType, 'media')
  
  // Get media record
  const { data: media, error: fetchError } = await supabase
    .from(tableName)
    .select('file_path')
    .eq('id', mediaId)
    .single()

  if (fetchError || !media) {
    throw new Error('Media not found')
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([media.file_path])

  if (storageError) {
    console.error('Storage deletion error:', storageError)
    // Continue with database deletion even if storage fails
  }

  // Delete from database (this will cascade to any references)
  const { error: dbError } = await supabase
    .from(tableName)
    .delete()
    .eq('id', mediaId)

  if (dbError) {
    throw new Error(`Failed to delete media: ${dbError.message}`)
  }
}

/**
 * Gets all media for a website and folder
 */
export async function getMediaByFolder(
  websiteType: WebsiteType,
  folder?: string
): Promise<Media[]> {
  const tableName = getTableName(websiteType, 'media')
  
  let query = supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })

  if (folder) {
    query = query.eq('folder_path', folder)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching media:', error)
    return []
  }

  return data || []
}

