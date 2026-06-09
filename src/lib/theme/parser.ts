/*
 * Archivo: parser.ts
 * Ruta: src/lib/theme/parser.ts
 * Creado: 2026-06-06
 * Descripción: Parsea la configuración de agency_theme (Supabase) hacia el
 *              objeto TenantTheme usado en la app. Incluye fallbacks a los
 *              tokens del design system de NIMO.
 */

import type { AgencyThemeRow } from '@/types/theme'
import type { TenantTheme, TenantTokens } from '@/types/theme'

/* Tokens por defecto cuando la agencia no personaliza el tema */
const TOKENS_DEFAULT: TenantTokens = {
  primary: '#FF6B6B',    // coral NIMO
  secondary: '#2D7D5F',  // verde NIMO
  accent: '#FFD93D',     // amarillo NIMO
  fontDisplay: 'Inter',  // misma que --font-sans
}

/**
 * Convierte una fila de `agency_theme` en el objeto `TenantTheme`
 * que usan los layouts y componentes.
 *
 * @param row - Fila de `agency_theme` de Supabase (puede ser null si es nueva agencia)
 * @param agencyId - ID de la agencia dueña del tema
 */
export function parseTenantTheme(
  row: AgencyThemeRow | null,
  agencyId: string,
): TenantTheme {
  if (!row) {
    return {
      agencyId,
      tokens: TOKENS_DEFAULT,
      logoUrl: null,
      faviconUrl: null,
      heroImageUrl: null,
      homeLayout: 'classic-cta',
      propertyCardStyle: 'bento',
      showFeaturedSection: true,
      showRecentSection: true,
      showNeighborhoodsSection: false,
      customCss: null,
    }
  }

  return {
    agencyId: row.agency_id,
    tokens: {
      primary: row.primary_color || TOKENS_DEFAULT.primary,
      secondary: row.secondary_color || TOKENS_DEFAULT.secondary,
      accent: row.accent_color || TOKENS_DEFAULT.accent,
      fontDisplay: row.font_family || TOKENS_DEFAULT.fontDisplay,
    },
    logoUrl: row.logo_url,
    faviconUrl: row.favicon_url,
    heroImageUrl: row.hero_image_url,
    homeLayout: row.home_layout,
    propertyCardStyle: row.property_card_style,
    showFeaturedSection: row.show_featured_section,
    showRecentSection: row.show_recent_section,
    showNeighborhoodsSection: row.show_neighborhoods_section,
    customCss: row.custom_css,
  }
}
