'use client'

import { useEffect, useState, useRef } from 'react'
import { useWebsite } from '../../../lib/hooks/use-website-context'
import { uploadMedia, deleteMedia, getMediaByFolder } from '../../../lib/utils/media'
import type { Media } from '../../../lib/types-separate'
import { Plus, Trash2, Image as ImageIcon, Upload, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../../lib/hooks/use-toast'

export default function MediaPage() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMedia()
  }, [currentWebsite, selectedFolder])

  async function loadMedia() {
    setLoading(true)
    try {
      const data = await getMediaByFolder(currentWebsite, selectedFolder || undefined)
      setMedia(data)
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const folder = selectedFolder || 'pages'
      
      for (const file of Array.from(files)) {
        await uploadMedia({
          file,
          websiteType: currentWebsite,
          folder: folder as any,
        })
      }

      loadMedia()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error uploading media:', error)
      alert('Failed to upload media')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(mediaId: string) {
    if (!confirm('Are you sure you want to delete this media file?')) return

    try {
      await deleteMedia(mediaId, currentWebsite)
      loadMedia()
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Media deleted successfully!',
      })
    } catch (error: any) {
      console.error('Error deleting media:', error)
      toast({
        variant: 'error',
        title: 'Error',
        description: error.message || 'Failed to delete media',
      })
    }
  }

  const folders = ['pages', 'blogs', 'team', 'testimonials', 'partners', 'programs', 'projects']

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-20"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-8 w-8 border-b-2 border-primary mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-muted-foreground"
          >
            Loading media...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Media Library
          </h1>
          <p className="text-muted-foreground">Manage images and files</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-4 py-2 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
          >
            <option value="">All Folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder.charAt(0).toUpperCase() + folder.slice(1)}
              </option>
            ))}
          </motion.select>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <motion.label
            htmlFor="file-upload"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary cursor-pointer shadow-lg hover:shadow-xl transition-all ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Upload Media
              </>
            )}
          </motion.label>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <AnimatePresence mode="wait">
          {media.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4"
              >
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </motion.div>
              <p className="text-muted-foreground text-lg">No media files yet. Upload your first image!</p>
            </motion.div>
          ) : (
            media.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group relative aspect-square border-2 border-border rounded-lg overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {item.type === 'image' ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={item.file_url}
                    alt={item.alt_text || item.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-destructive text-white rounded-lg hover:bg-destructive/90 shadow-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3"
                >
                  <p className="truncate font-medium">{item.file_name}</p>
                </motion.div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {media.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-sm text-muted-foreground text-center"
        >
          Total: <span className="font-semibold text-foreground">{media.length}</span> file{media.length !== 1 ? 's' : ''}
        </motion.div>
      )}
    </div>
  )
}

