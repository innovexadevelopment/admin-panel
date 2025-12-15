"use client"

import { DataTable } from "@/components/shared/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ServiceActions } from "./service-actions"

type Service = {
  id: string
  site: "company" | "ngo"
  title: string
  short_description: string | null
  long_description: string | null
  icon: string | null
  order_index: number
}

const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "short_description",
    header: "Description",
  },
  {
    accessorKey: "icon",
    header: "Icon",
  },
  {
    accessorKey: "order_index",
    header: "Order",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ServiceActions service={row.original} />,
  },
]

type Props = {
  services: Service[]
}

export function ServicesTable({ services }: Props) {
  return <DataTable columns={columns} data={services} />
}

