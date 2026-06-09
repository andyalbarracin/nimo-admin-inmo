/*
 * Archivo: theme.ts
 * Ruta: src/types/theme.ts
 * Creado: 2026-06-06
 * Descripción: Tipos para el sistema de theming multi-tenant.
 *              Cada agencia puede personalizar su paleta, tipografía y layout.
 *              Ver .docs/06-theme-system.md para las especificaciones completas.
 */

import type { Database } from './database'

/* ---- Tipo base del schema ---- */
export type AgencyThemeRow = Database['public']['Tables']['agency_theme']['Row']

/* ---- Layout de la home del tenant ---- */
export type HomeLayout = AgencyThemeRow['home_layout']

/* ---- Estilo de card de propiedad ---- */
export type PropertyCardStyle = AgencyThemeRow['property_card_style']

/**
 * Tokens CSS del tenant inyectados como variables en el :root del layout.
 * Estos valores vienen de agency_theme y se traducen a custom properties.
 *
 * En globals.css existen como:
 *   --tenant-primary, --tenant-secondary, --tenant-accent, --tenant-font-display
 */
export interface TenantTokens {
  primary: string    // color hexadecimal o hsl, ej: "#FF6B6B"
  secondary: string
  accent: string
  fontDisplay: string // nombre de la fuente Google, ej: "Playfair Display"
}

/**
 * Configuración completa del tema de una agencia, parseada para uso en la app.
 * Combina agency_theme + tokens CSS calculados.
 */
export interface TenantTheme {
  agencyId: string
  tokens: TenantTokens
  logoUrl: string | null
  faviconUrl: string | null
  heroImageUrl: string | null
  homeLayout: HomeLayout
  propertyCardStyle: PropertyCardStyle
  showFeaturedSection: boolean
  showRecentSection: boolean
  showNeighborhoodsSection: boolean
  customCss: string | null
}

/**
 * Contexto del tenant resuelto desde el middleware.
 * Disponible en todos los layouts tenant como prop o context.
 */
export interface TenantContext {
  agencyId: string
  slug: string
  name: string
  theme: TenantTheme
  planStatus: Database['public']['Tables']['agencies']['Row']['plan_status']
}
