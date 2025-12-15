import { TableLoadingSkeleton } from "@/components/shared/loading-skeleton"
import { PageWrapper } from "@/components/shared/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
              <div className="h-6 w-96 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="h-11 w-40 bg-muted animate-pulse rounded-xl" />
          </div>
          <TableLoadingSkeleton />
        </div>
      </div>
    </PageWrapper>
  )
}

