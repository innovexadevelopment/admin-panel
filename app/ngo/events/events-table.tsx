"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { EventActions } from "./event-actions"

type Event = {
  id: string
  title: string
  slug: string
  start_date: string
  end_date: string | null
  location: string | null
  is_active: boolean
  is_featured: boolean
  cover_image_path: string | null
}

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      row.original.is_active ? (
        <span className="text-green-600 font-medium">Active</span>
      ) : (
        <span className="text-muted-foreground">Inactive</span>
      )
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EventActions event={row.original} />,
  },
]

type Props = {
  events: Event[]
}

export function EventsTable({ events }: Props) {
  return <DataTable columns={columns} data={events} />
}

