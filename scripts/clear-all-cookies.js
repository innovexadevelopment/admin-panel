// Run this in browser console to clear all cookies and localStorage
// Copy and paste into browser console (F12 → Console)

(function() {
  console.log('🧹 Clearing all cookies and localStorage...')
  
  // Clear all cookies
  const cookies = document.cookie.split(";")
  let clearedCookies = 0
  cookies.forEach(c => {
    const name = c.replace(/^ +/, "").replace(/=.*/, "")
    if (name) {
      // Clear for all possible paths and domains
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`
      clearedCookies++
    }
  })
  
  // Clear localStorage
  const localStorageKeys = Object.keys(localStorage)
  localStorageKeys.forEach(key => localStorage.removeItem(key))
  
  console.log(`✅ Cleared ${clearedCookies} cookies and ${localStorageKeys.length} localStorage items`)
  console.log('🔄 Reloading page...')
  
  // Reload page
  setTimeout(() => {
    window.location.href = '/login'
  }, 500)
})()

