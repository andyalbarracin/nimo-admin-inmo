export type ThemeId = 'editorial' | 'spatial' | 'atelier'

export interface SiteTheme {
  id: ThemeId
  name: string
  description: string
  bg: string
  bg2: string
  surface: string
  rule: string
  ink: string
  ink2: string
  ink3: string
  accent: string
  accentDark: string
  accentSoft: string
  accentContrast: string
  fontDisplay: string
  fontBody: string
  fontMono: string
  radius: string
  mapTiles: 'voyager' | 'positron'
  heroStyle: 'full-bleed' | 'split' | 'map'
}

export const THEMES: Record<ThemeId, SiteTheme> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial',
    description: 'Arquitectura de revista, serif Fraunces, terracota óxido — para inmobiliarias de trayectoria',
    bg: '#FAF7F0',
    bg2: '#F1ECE2',
    surface: '#FFFFFF',
    rule: '#DBD2C2',
    ink: '#1A1614',
    ink2: '#5C5247',
    ink3: '#8A8071',
    accent: '#B25431',
    accentDark: '#8C3F22',
    accentSoft: '#E8D2C2',
    accentContrast: '#FAF7F0',
    fontDisplay: "var(--font-fraunces), 'Playfair Display', Georgia, serif",
    fontBody: "var(--font-sans), system-ui, sans-serif",
    fontMono: "var(--font-mono), ui-monospace, monospace",
    radius: '4px',
    mapTiles: 'positron',
    heroStyle: 'split',
  },
  spatial: {
    id: 'spatial',
    name: 'Spatial',
    description: 'Swiss design map-forward, Inter Tight, azul electric — para boutiques tech-savvy',
    bg: '#FFFFFF',
    bg2: '#F2F2F0',
    surface: '#FFFFFF',
    rule: '#D8D8D6',
    ink: '#0A0A0A',
    ink2: '#3D3D3D',
    ink3: '#7A7A78',
    accent: '#1F4DD6',
    accentDark: '#163BA8',
    accentSoft: '#E7ECFB',
    accentContrast: '#FFFFFF',
    fontDisplay: "var(--font-inter-tight), 'Inter', system-ui, sans-serif",
    fontBody: "var(--font-inter-tight), 'Inter', system-ui, sans-serif",
    fontMono: "var(--font-mono), ui-monospace, monospace",
    radius: '8px',
    mapTiles: 'positron',
    heroStyle: 'map',
  },
  atelier: {
    id: 'atelier',
    name: 'Atelier',
    description: 'Boutique de lujo, Cormorant Garamond, verde salvia muted — para propiedades premium',
    bg: '#F5F1EC',
    bg2: '#EDE7DE',
    surface: '#FFFFFF',
    rule: '#DDD5CA',
    ink: '#2E2620',
    ink2: '#6B5D52',
    ink3: '#9A8F82',
    accent: '#7A8264',
    accentDark: '#5E6B4E',
    accentSoft: '#E4E7DC',
    accentContrast: '#F5F1EC',
    fontDisplay: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
    fontBody: "var(--font-sans), system-ui, sans-serif",
    fontMono: "var(--font-mono), ui-monospace, monospace",
    radius: '2px',
    mapTiles: 'positron',
    heroStyle: 'full-bleed',
  },
}

export const DEFAULT_THEME: ThemeId = 'editorial'
