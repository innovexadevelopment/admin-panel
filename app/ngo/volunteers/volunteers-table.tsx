"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { VolunteerActions } from "./volunteer-actions"

type Volunteer = {
  id: string
  name: string
  email: string
  phone: string | null
  skills: string[] | null
  status: string
  created_at: string
}

const columns: ColumnDef<Volunteer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => (
      Array.isArray(row.original.skills) && row.original.skills.length > 0
        ? row.original.skills.join(", ")
        : "—"
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const colors: Record<string, string> = {
        pending: "text-amber-600",
        approved: "text-green-600",
        rejected: "text-red-600",
        active: "text-blue-600",
        inactive: "text-gray-600",
      }
      return (
        <span className={`font-medium capitalize ${colors[status] || ""}`}>
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <VolunteerActions volunteer={row.original} />,
  },
]

type Props = {
  volunteers: Volunteer[]
}

export function VolunteersTable({ volunteers }: Props) {
  return <DataTable columns={columns} data={volunteers} />
}

