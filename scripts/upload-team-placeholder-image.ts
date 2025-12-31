/**
 * Upload a placeholder team member image to Supabase storage
 * This creates a default avatar image that can be used for team members
 * 
 * Run with: npx tsx scripts/upload-team-placeholder-image.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { resolve } from 'path'
import sharp from 'sharp'

dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

/**
 * Create a placeholder avatar image
 */
async function createPlaceholderAvatar(name: string = 'Team Member'): Promise<Buffer> {
  const size = 400
  const fontSize = 120
  const initial = name.charAt(0).toUpperCase()
  
  // Create a gradient background
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central"
      >${initial}</text>
    </svg>
  `
  
  return sharp(Buffer.from(svg))
    .resize(size, size)
    .webp({ quality: 90 })
    .toBuffer()
}

/**
 * Upload placeholder image for company team
 */
async function uploadCompanyTeamPlaceholder() {
  console.log('📤 Creating placeholder avatar for company team...')
  
  try {
    // Create placeholder image
    const imageBuffer = await createPlaceholderAvatar('Team Member')
    const fileName = `team-placeholder-${Date.now()}.webp`
    const filePath = `company/team/${fileName}`
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }
    
    console.log('✅ Image uploaded to storage')
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)
    
    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata()
    
    // Create media record
    const { data: media, error: mediaError } = await supabase
      .from('company_media')
      .insert({
        file_name: fileName,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: imageBuffer.length,
        mime_type: 'image/webp',
        type: 'image',
        folder_path: 'team',
        width: metadata.width,
        height: metadata.height,
        alt_text: 'Team Member Placeholder Avatar',
        caption: 'Default placeholder image for team members'
      })
      .select()
      .single()
    
    if (mediaError) {
      console.error('❌ Error creating media record:', mediaError)
      throw new Error(`Failed to create media record: ${mediaError.message}`)
    }
    
    console.log('✅ Media record created:', media.id)
    console.log('📎 Image URL:', urlData.publicUrl)
    console.log('\n💡 You can now use this photo_id in team member records:')
    console.log(`   photo_id: ${media.id}`)
    
    return media.id
  } catch (error: any) {
    console.error('❌ Error uploading company team placeholder:', error.message)
    throw error
  }
}

/**
 * Upload placeholder image for NGO team
 */
async function uploadNgoTeamPlaceholder() {
  console.log('📤 Creating placeholder avatar for NGO team...')
  
  try {
    // Create placeholder image
    const imageBuffer = await createPlaceholderAvatar('Team Member')
    const fileName = `team-placeholder-${Date.now()}.webp`
    const filePath = `ngo/team/${fileName}`
    
    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, imageBuffer, {
        contentType: 'image/webp',
        upsert: true,
      })
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }
    
    console.log('✅ Image uploaded to storage')
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)
    
    // Get image dimensions
    const metadata = await sharp(imageBuffer).metadata()
    
    // Create media record
    const { data: media, error: mediaError } = await supabase
      .from('ngo_media')
      .insert({
        file_name: fileName,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: imageBuffer.length,
        mime_type: 'image/webp',
        type: 'image',
        folder_path: 'team',
        width: metadata.width,
        height: metadata.height,
        alt_text: 'Team Member Placeholder Avatar',
        caption: 'Default placeholder image for team members'
      })
      .select()
      .single()
    
    if (mediaError) {
      console.error('❌ Error creating media record:', mediaError)
      throw new Error(`Failed to create media record: ${mediaError.message}`)
    }
    
    console.log('✅ Media record created:', media.id)
    console.log('📎 Image URL:', urlData.publicUrl)
    console.log('\n💡 You can now use this photo_id in team member records:')
    console.log(`   photo_id: ${media.id}`)
    
    return media.id
  } catch (error: any) {
    console.error('❌ Error uploading NGO team placeholder:', error.message)
    throw error
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting team placeholder image upload...\n')
  
  try {
    // Upload for both company and NGO
    const [companyPhotoId, ngoPhotoId] = await Promise.all([
      uploadCompanyTeamPlaceholder(),
      uploadNgoTeamPlaceholder()
    ])
    
    console.log('\n✅ Successfully uploaded placeholder images!')
    console.log('\n📋 Summary:')
    console.log(`   Company team placeholder ID: ${companyPhotoId}`)
    console.log(`   NGO team placeholder ID: ${ngoPhotoId}`)
    console.log('\n💡 Next steps:')
    console.log('   1. Run the SQL migration: update-team-schema.sql')
    console.log('   2. Update team member records to use these photo_ids')
    console.log('   3. Or use these IDs as defaults for new team members')
    
  } catch (error: any) {
    console.error('\n❌ Failed to upload placeholder images:', error.message)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { uploadCompanyTeamPlaceholder, uploadNgoTeamPlaceholder }

