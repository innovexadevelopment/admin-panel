'use client'

import { ReactNode } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => ReactNode)
  className?: string
}

interface CrudTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onDelete?: (id: string) => void
  editHref?: (id: string) => string
  emptyMessage?: string
}

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

export function CrudTable<T extends { id: string }>({
  data,
  columns,
  onDelete,
  editHref,
  emptyMessage = 'No items yet',
}: CrudTableProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border rounded-lg overflow-hidden shadow-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column, index) => (
                <motion.th
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`text-left p-4 font-semibold text-sm ${column.className || ''}`}
                >
                  {column.header}
                </motion.th>
              ))}
              {(onDelete || editHref) && (
                <motion.th
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: columns.length * 0.05 }}
                  className="text-right p-4 font-semibold text-sm"
                >
                  Actions
                </motion.th>
              )}
            </tr>
          </thead>
          <motion.tbody
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {data.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={columns.length + (onDelete || editHref ? 1 : 0)}
                    className="p-12 text-center text-muted-foreground"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <p className="text-lg">{emptyMessage}</p>
                    </motion.div>
                  </td>
                </motion.tr>
              ) : (
                data.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id}
                    variants={rowVariants}
                    whileHover={{ backgroundColor: 'rgba(var(--muted), 0.5)', scale: 1.005 }}
                    className="border-t transition-colors"
                  >
                    {columns.map((column, index) => (
                      <td key={index} className={`p-4 ${column.className || ''}`}>
                        {typeof column.accessor === 'function'
                          ? column.accessor(row)
                          : String(row[column.accessor])}
                      </td>
                    ))}
                    {(onDelete || editHref) && (
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {editHref && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                href={editHref(row.id)}
                                className="p-2 hover:bg-muted rounded transition-colors"
                              >
                                <Edit className="h-4 w-4 text-primary" />
                              </Link>
                            </motion.div>
                          )}
                          {onDelete && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDelete(row.id)}
                              className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  )
}

