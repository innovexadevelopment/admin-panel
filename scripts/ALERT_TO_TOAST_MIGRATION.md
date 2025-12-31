# Alert to Toast Migration

This document tracks the migration from `alert()` to toast notifications.

## Completed Files
- ✅ settings/page.tsx
- ✅ donations/page.tsx
- ✅ contact-submissions/page.tsx
- ✅ blogs/page.tsx
- ✅ media/page.tsx
- ✅ team/page.tsx
- ✅ programs/page.tsx
- ✅ testimonials/page.tsx
- ✅ partners/page.tsx

## Remaining Files
- ⏳ projects/page.tsx
- ⏳ impact-stats/page.tsx
- ⏳ pages/page.tsx
- ⏳ admin-users/page.tsx
- ⏳ All [id]/page.tsx (edit pages)
- ⏳ All new/page.tsx (create pages)

## Pattern to Replace

1. Add import:
```typescript
import { useToast } from '../../../lib/hooks/use-toast'
```

2. Add hook in component:
```typescript
const { toast } = useToast()
```

3. Replace alerts:
```typescript
// Before
alert(`Error: ${error.message}`)

// After
toast({
  variant: 'error',
  title: 'Error',
  description: error.message,
})

// Success
toast({
  variant: 'success',
  title: 'Success',
  description: 'Operation completed successfully!',
})
```

