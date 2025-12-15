"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { BlogActions } from "./blog-actions"

type BlogPost = {
  id: string
  title: string
  slug: string
  category: string | null
  is_published: boolean
  published_at: string | null
  featured_image_path: string | null
}

const columns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "is_published",
    header: "Status",
    cell: ({ row }) => (
      row.original.is_published ? (
        <span className="text-green-600 font-medium">Published</span>
      ) : (
        <span className="text-amber-600 font-medium">Draft</span>
      )
    ),
  },
  {
    accessorKey: "published_at",
    header: "Published",
    cell: ({ row }) => (
      row.original.published_at
        ? new Date(row.original.published_at).toLocaleDateString()
        : "—"
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BlogActions post={row.original} />,
  },
]

type Props = {
  posts: BlogPost[]
}

export function BlogTable({ posts }: Props) {
  return <DataTable columns={columns} data={posts} />
}

