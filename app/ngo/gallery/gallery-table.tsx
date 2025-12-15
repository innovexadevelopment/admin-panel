"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { GalleryActions } from "./gallery-actions"

type GalleryImage = {
  id: string
  site: "company" | "ngo"
  title: string | null
  description: string | null
  image_path: string
  taken_at: string | null
  order_index: number
}

const columns: ColumnDef<GalleryImage>[] = [
  {
    accessorKey: "image_path",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-assets/${row.original.image_path}`
      return (
        <div className="relative h-16 w-16 rounded-lg overflow-hidden border">
          <Image
            src={imageUrl}
            alt={row.original.title || "Gallery image"}
            fill
            className="object-cover"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => row.original.title || <span className="text-muted-foreground">No title</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-2 max-w-md">
        {row.original.description || "No description"}
      </span>
    ),
  },
  {
    accessorKey: "taken_at",
    header: "Date Taken",
    cell: ({ row }) => row.original.taken_at ? new Date(row.original.taken_at).toLocaleDateString() : "-",
  },
  {
    accessorKey: "order_index",
    header: "Order",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <GalleryActions image={row.original} />,
  },
]

type Props = {
  images: GalleryImage[]
}

export function GalleryTable({ images }: Props) {
  return <DataTable columns={columns} data={images} />
}
