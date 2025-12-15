"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { CareerActions } from "./career-actions"

type Career = {
  id: string
  title: string
  department: string | null
  location: string | null
  is_active: boolean
}

const columns: ColumnDef<Career>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "department",
    header: "Department",
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
    cell: ({ row }) => <CareerActions career={row.original} />,
  },
]

type Props = {
  careers: Career[]
}

export function CareersTable({ careers }: Props) {
  return <DataTable columns={columns} data={careers} />
}

