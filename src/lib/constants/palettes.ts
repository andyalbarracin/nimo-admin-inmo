/*
 * Archivo : palettes.ts
 * Ruta    : src/lib/constants/palettes.ts
 * Modif.  : 2026-06-14
 * Descripción: Catálogo de paletas pre-armadas que la agencia elige en el
 *              onboarding. La paleta seleccionada se vuelca a agency_theme
 *              (primary/secondary/accent).
 */
export interface Palette {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
}

export const PALETTES: Palette[] = [
  { id: 'coral', name: 'Coral & Crema', primary: '#FF6B6B', secondary: '#2D7D5F', accent: '#FFD93D' },
  { id: 'azul', name: 'Azul Profesional', primary: '#2563EB', secondary: '#1E293B', accent: '#38BDF8' },
  { id: 'esmeralda', name: 'Esmeralda', primary: '#0E9F6E', secondary: '#134E4A', accent: '#FBBF24' },
  { id: 'borgona', name: 'Borgoña', primary: '#9D174D', secondary: '#3F1D38', accent: '#F59E0B' },
  { id: 'grafito', name: 'Grafito & Naranja', primary: '#FF6A00', secondary: '#111111', accent: '#FFC107' },
  { id: 'oceano', name: 'Océano', primary: '#0EA5E9', secondary: '#0F172A', accent: '#22D3EE' },
  { id: 'tierra', name: 'Tierra', primary: '#B45309', secondary: '#451A03', accent: '#D97706' },
  { id: 'violeta', name: 'Violeta', primary: '#7C3AED', secondary: '#2E1065', accent: '#A78BFA' },
]
