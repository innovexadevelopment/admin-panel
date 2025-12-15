import { PageLoadingSkeleton } from "@/components/shared/loading-skeleton"
import { PageWrapper } from "@/components/shared/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto p-8">
        <PageLoadingSkeleton />
      </div>
    </PageWrapper>
  )
}

