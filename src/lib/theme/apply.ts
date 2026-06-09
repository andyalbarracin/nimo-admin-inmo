/*
 * Archivo: apply.ts
 * Ruta: src/lib/theme/apply.ts
 * Creado: 2026-06-06
 * Descripción: Genera el atributo style con custom properties del tenant para
 *              inyectar en el <html> o <body> del layout.
 *              Los valores son leídos en globals.css como --tenant-*.
 */

import type { TenantTokens } from '@/types/theme'

/**
 * Genera un objeto de estilos CSS en línea con los tokens del tenant.
 * Se usa como `style={applyTenantTokens(theme.tokens)}` en el layout.
 *
 * Las custom properties definidas aquí deben coincidir con las declaradas
 * en globals.css en la sección "— Tokens del tenant —".
 */
export function applyTenantTokens(tokens: TenantTokens): React.CSSProperties {
  return {
    '--tenant-primary': tokens.primary,
    '--tenant-secondary': tokens.secondary,
    '--tenant-accent': tokens.accent,
    '--tenant-font-display': `'${tokens.fontDisplay}', var(--font-sans)`,
  } as React.CSSProperties
}

/**
 * Genera el tag <style> con el CSS personalizado del tenant.
 * Inyectar como dangerouslySetInnerHTML en el layout del tenant.
 *
 * Solo se llama si customCss no es null.
 */
export function buildCustomCssTag(customCss: string): string {
  // Eliminamos @import para evitar carga de recursos externos no confiables
  const sanitized = customCss.replace(/@import\s+[^;]+;/gi, '')
  return `<style data-tenant-custom>${sanitized}</style>`
}
