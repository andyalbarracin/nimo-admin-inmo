export type ThemeId = 'editorial' | 'spatial' | 'loft'

export interface SiteTheme {
  id: ThemeId
  name: string
  description: string
  bg: string
  bg2: string
  surface: string
  border: string
  ink: string
  ink2: string
  ink3: string
  accent: string
  accentContrast: string
  fontDisplay: string
  fontBody: string
  radius: string
  heroStyle: 'full-bleed' | 'split' | 'map'
}

export const THEMES: Record<ThemeId, SiteTheme> = {
  // Warm parchment, Playfair Display serif, dusty terracotta accent
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Tipografía serif, papel calido, acento terracota — estilo revista de arquitectura',
    bg: '#F7F3EE',
    bg2: '#EDE7DE',
    surface: '#FFFFFF',
    border: '#DDD5C8',
    ink: '#1E1A16',
    ink2: '#4D453C',
    ink3: '#9E9389',
    accent: '#7B4F3C',
    accentContrast: '#F7F3EE',
    fontDisplay: "var(--font-serif), 'Georgia', serif",
    fontBody: "var(--font-sans), system-ui, sans-serif",
    radius: '3px',
    heroStyle: 'split',
  },
  // Pure white, geometric sans, electric blue — clean PropTech product feel
  spatial: {
    id: 'spatial',
    name: 'Spatial',
    description: 'Fondo blanco, azul eléctrico, tipografía geométrica — producto PropTech moderno',
    bg: '#FFFFFF',
    bg2: '#F4F6FA',
    surface: '#FFFFFF',
    border: '#E0E5EF',
    ink: '#0B1426',
    ink2: '#3A4A63',
    ink3: '#7A8BA8',
    accent: '#2B5FE8',
    accentContrast: '#FFFFFF',
    fontDisplay: "var(--font-sans), system-ui, sans-serif",
    fontBody: "var(--font-sans), system-ui, sans-serif",
    radius: '10px',
    heroStyle: 'map',
  },
  // Near-black, Playfair Display serif, aged gold — ultra-luxury cinematic
  loft: {
    id: 'loft',
    name: 'Loft',
    description: 'Fondo casi negro, oro cálido, serif elegante — inmobiliaria de lujo',
    bg: '#141412',
    bg2: '#1C1C1A',
    surface: '#222220',
    border: '#363633',
    ink: '#EDE9E0',
    ink2: '#B0A898',
    ink3: '#6E6860',
    accent: '#C8A05E',
    accentContrast: '#141412',
    fontDisplay: "var(--font-serif), 'Georgia', serif",
    fontBody: "var(--font-sans), system-ui, sans-serif",
    radius: '2px',
    heroStyle: 'full-bleed',
  },
}

export const DEFAULT_THEME: ThemeId = 'editorial'
