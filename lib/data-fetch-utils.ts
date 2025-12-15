import { supabaseServer } from "./supabase-server"

/**
 * Fetches ALL data from a table without any limits or pagination.
 * Uses pagination internally to handle Supabase's 1000 row limit.
 */
export async function fetchAllData<T = any>(
  tableName: string,
  orderBy?: string,
  ascending: boolean = true
): Promise<{ data: T[] | null; error: any; count: number | null }> {
  try {
    let allData: any[] = []
    let hasMore = true
    let page = 0
    const pageSize = 1000 // Supabase max per request
    let totalCount: number | null = null

    // First, get the total count
    const countResult = await supabaseServer
      .from(tableName)
      .select("*", { count: 'exact', head: true })
    
    totalCount = countResult.count

    // Fetch all data with pagination
    // Optimize: fetch larger chunks if count is small
    const optimizedPageSize = totalCount && totalCount < 100 ? totalCount : pageSize
    
    while (hasMore) {
      let query = supabaseServer
        .from(tableName)
        .select("*")
        .range(page * optimizedPageSize, (page + 1) * optimizedPageSize - 1) // Fetch in chunks

      if (orderBy) {
        query = query.order(orderBy, { ascending })
      }

      const result = await query
      
      if (result.error) {
        console.error(`[${tableName}] Error fetching data (page ${page}):`, result.error)
        return { data: null, error: result.error, count: totalCount }
      }

      if (result.data && result.data.length > 0) {
        allData = [...allData, ...result.data]
        // If we got less than optimizedPageSize, we've reached the end
        hasMore = result.data.length === optimizedPageSize
        page++
      } else {
        hasMore = false
      }

      // Safety check: if we've fetched all rows, stop
      if (totalCount !== null && allData.length >= totalCount) {
        hasMore = false
      }

      // Safety limit: prevent infinite loops
      if (page > 100) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[${tableName}] Stopped pagination after 100 pages (safety limit)`)
        }
        hasMore = false
      }
    }

    // Apply ordering if needed (in case database ordering didn't work across pages)
    if (orderBy && allData.length > 0) {
      allData.sort((a: any, b: any) => {
        const aVal = a[orderBy]
        const bVal = b[orderBy]
        
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return ascending ? aVal - bVal : bVal - aVal
        }
        
        const aStr = String(aVal)
        const bStr = String(bVal)
        return ascending ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[${tableName}] ✅ Fetched ${allData.length} total items from ${page} page(s) (DB count: ${totalCount || 'unknown'})`)
      
      if (totalCount !== null && allData.length !== totalCount) {
        console.warn(`[${tableName}] ⚠️ WARNING: Database has ${totalCount} rows but we fetched ${allData.length}!`)
      }
    }

    return { data: allData as T[], error: null, count: totalCount }
  } catch (error: any) {
    console.error(`[${tableName}] Error in fetchAllData:`, error)
    return { data: null, error, count: null }
  }
}

/**
 * Gets the count of records for a specific site.
 * Fetches all data and filters in JavaScript to ensure accuracy.
 */
export async function getCountBySite(
  tableName: string,
  site: "company" | "ngo"
): Promise<number> {
  try {
    const { data: allData, error } = await fetchAllData(tableName)
    
    if (error || !allData) {
      return 0
    }

    const filtered = allData.filter((item: any) => {
      const itemSite = String(item.site || '').toLowerCase().trim()
      return itemSite === site.toLowerCase().trim()
    })

    return filtered.length
  } catch (error: any) {
    console.error(`[${tableName}] Error in getCountBySite:`, error)
    return 0
  }
}

/**
 * Gets the total count of all records in a table.
 */
export async function getTotalCount(tableName: string): Promise<number> {
  try {
    const { count } = await supabaseServer
      .from(tableName)
      .select("*", { count: 'exact', head: true })
    
    return count || 0
  } catch (error: any) {
    console.error(`[${tableName}] Error in getTotalCount:`, error)
    return 0
  }
}

