"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MessageActions } from "./message-actions"

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  status: "new" | "seen" | "replied" | "archived"
  created_at: string
}

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  seen: "bg-yellow-100 text-yellow-800",
  replied: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
}

const columns: ColumnDef<Message>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={statusColors[row.original.status as keyof typeof statusColors]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MessageActions message={row.original} />,
  },
]

type Props = {
  messages: Message[]
}

export function MessagesTable({ messages }: Props) {
  return <DataTable columns={columns} data={messages} />
}

