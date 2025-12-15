import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { requireAuth } from '@/lib/auth'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    await requireAuth()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const site = formData.get('site') as string
    const folder = formData.get('folder') as string
    const oldPath = formData.get('oldPath') as string | null

    if (!file || !site || !folder) {
      return NextResponse.json(
        { error: 'Missing required fields: file, site, folder' },
        { status: 400 }
      )
    }

    // Generate file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${fileExt}`
    const filePath = `${site}/${folder}/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload using service role key (bypasses RLS)
    const { data, error } = await supabaseServer.storage
      .from('public-assets')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Delete old image if replacing
    if (oldPath && oldPath !== filePath) {
      await supabaseServer.storage.from('public-assets').remove([oldPath])
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${filePath}`

    return NextResponse.json({
      path: filePath,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      )
    }

    // Delete using service role key (bypasses RLS)
    const { error } = await supabaseServer.storage
      .from('public-assets')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to delete image' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    )
  }
}

