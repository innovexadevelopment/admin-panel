import { supabaseServer } from "./supabase-server"
import { fetchAllData } from "./data-fetch-utils"

/**
 * Fetches a single record from a Supabase table by site with fallback filtering.
 * ALWAYS fetches all data first, then filters in JavaScript to ensure we get everything.
 */
export async function fetchSingleBySite<T = any>(
  tableName: string,
  site: "company" | "ngo"
): Promise<{ data: T | null; error: any }> {
  try {
    // ALWAYS fetch all data first to ensure we get everything
    const { data: allData, error: allError } = await supabaseServer
      .from(tableName)
      .select("*")

    if (allError) {
      return { data: null, error: allError }
    }

    if (!allData || allData.length === 0) {
      return { data: null, error: null }
    }

    // Filter in JavaScript - handle both string and enum types
    const filtered = allData.find((item: any) => {
      const itemSite = String(item.site || '').toLowerCase().trim()
      return itemSite === site.toLowerCase().trim()
    })

    if (filtered) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${tableName}] Found single record for site="${site}"`)
      }
      return { data: filtered as T, error: null }
    }

    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      const sites = Array.from(new Set(allData.map((item: any) => String(item.site))))
      console.log(`[${tableName}] Found ${allData.length} items but none match site="${site}". Available sites:`, sites)
    }

    return { data: null, error: null }
  } catch (error: any) {
    console.error(`[${tableName}] Error in fetchSingleBySite:`, error)
    return { data: null, error }
  }
}

/**
 * Fetches data from a Supabase table with fallback filtering.
 * ALWAYS fetches all data first, then filters in JavaScript to ensure we get everything.
 * This handles cases where enum filtering might not work correctly.
 * 
 * @param tableName - The name of the table to query
 * @param site - The site filter value ("company" or "ngo")
 * @param orderBy - Optional column to order by
 * @param ascending - Whether to order ascending (default: true)
 * @returns The filtered data and any error
 */
export async function fetchDataBySite<T = any>(
  tableName: string,
  site: "company" | "ngo",
  orderBy?: string,
  ascending: boolean = true
): Promise<{ data: T[] | null; error: any }> {
  try {
    // Use the utility function to fetch ALL data with pagination
    const { data: allData, error: allError, count: totalCount } = await fetchAllData(
      tableName,
      orderBy,
      ascending
    )

    if (allError) {
      return { data: null, error: allError }
    }

    if (!allData || allData.length === 0) {
      return { data: [], error: null }
    }

    // Filter in JavaScript - handle both string and enum types
    // This ensures we get ALL matching records regardless of enum filtering issues
    const filtered = allData.filter((item: any) => {
      const itemSite = String(item.site || '').toLowerCase().trim()
      const targetSite = site.toLowerCase().trim()
      return itemSite === targetSite
    })

    // Apply ordering if needed (in case database ordering didn't work across pages)
    if (orderBy && filtered.length > 0) {
      filtered.sort((a: any, b: any) => {
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

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      const totalFetched = allData.length
      const filteredCount = filtered.length
      const sites = Array.from(new Set(allData.map((item: any) => String(item.site))))
      
      console.log(`[${tableName}] ✅ Fetched ${totalFetched} total items (DB count: ${totalCount || 'unknown'}), filtered to ${filteredCount} for site="${site}"`)
      
      // Check if we got all rows
      if (totalCount !== null && totalFetched !== totalCount) {
        console.error(`[${tableName}] ⚠️ WARNING: Database has ${totalCount} rows but we only fetched ${totalFetched}!`)
      }
      
      if (filteredCount === 0 && totalFetched > 0) {
        console.warn(`[${tableName}] ⚠️ Found ${totalFetched} items but none match site="${site}". Available sites:`, sites)
      } else if (filteredCount > 0) {
        console.log(`[${tableName}] ✅ Successfully filtered ${filteredCount} items for site="${site}"`)
      }
    }

    return { data: filtered as T[], error: null }
  } catch (error: any) {
    console.error(`[${tableName}] Error in fetchDataBySite:`, error)
    return { data: null, error }
  }
}

