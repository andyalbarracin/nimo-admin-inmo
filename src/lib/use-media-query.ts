'use client'

/*
 * Hook de media query para componentes con inline styles (los themes públicos).
 * SSR devuelve false (desktop) y se actualiza al montar → leve reflow en mobile,
 * aceptable. Usar para colapsar grids / achicar layout en pantallas chicas.
 */
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** true en tablet vertical y phones (≤768px). */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
/** true en teléfonos chicos (≤560px). */
export const useIsPhone = () => useMediaQuery('(max-width: 560px)')
