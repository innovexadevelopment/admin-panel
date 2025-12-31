export function handleSupabaseError(error: any): string {
  if (!error) return 'An unknown error occurred'

  // RLS policy errors
  if (error.message?.includes('row-level security') || error.message?.includes('RLS')) {
    return 'Permission denied. Please ensure you are logged in and have admin access.'
  }

  // Authentication errors
  if (error.message?.includes('JWT') || error.message?.includes('token') || error.message?.includes('auth')) {
    return 'Authentication required. Please log in.'
  }

  // Not found errors
  if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
    return 'Record not found.'
  }

  // Foreign key errors
  if (error.message?.includes('foreign key') || error.code?.includes('23503')) {
    return 'Cannot perform this operation. Related records exist.'
  }

  // Unique constraint errors
  if (error.code?.includes('23505') || error.message?.includes('unique')) {
    return 'This record already exists. Please use a different value.'
  }

  // Return the actual error message if it's user-friendly
  if (error.message) {
    return error.message
  }

  return 'An error occurred. Please try again.'
}

export function showError(error: any) {
  const message = handleSupabaseError(error)
  alert(message)
  console.error('Supabase Error:', error)
}

