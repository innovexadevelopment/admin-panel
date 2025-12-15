import { PageLoadingSkeleton } from "@/components/shared/loading-skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div className="flex-1 overflow-y-auto p-8">
        <PageLoadingSkeleton />
      </div>
    </div>
  )
}

