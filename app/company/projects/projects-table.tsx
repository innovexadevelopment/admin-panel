"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ProjectActions } from "./project-actions"

type Project = {
  id: string
  title: string
  slug: string
  category: string | null
  highlight: boolean
  is_ongoing: boolean
  created_at: string
}

const columns: ColumnDef<Project>[] = [
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
    accessorKey: "highlight",
    header: "Highlight",
    cell: ({ row }) => (row.original.highlight ? "Yes" : "No"),
  },
  {
    accessorKey: "is_ongoing",
    header: "Status",
    cell: ({ row }) => (row.original.is_ongoing ? "Ongoing" : "Completed"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ProjectActions project={row.original} />,
  },
]

type Props = {
  projects: Project[]
}

export function ProjectsTable({ projects }: Props) {
  return <DataTable columns={columns} data={projects} />
}

