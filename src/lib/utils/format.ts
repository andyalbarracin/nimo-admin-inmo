/*
 * Archivo: format.ts
 * Ruta: src/lib/utils/format.ts
 * Creado: 2026-06-06
 * Descripción: Funciones de formateo para la UI de NIMO.
 *              Cubre precios en ARS/USD, fechas en español argentino,
 *              números abreviados y superficie en m².
 */

import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

/* ---- Precios ---- */

/**
 * Formatea un precio inmobiliario según la moneda.
 * USD: "USD 145.000" (sin decimales, con puntos de miles)
 * ARS: "$ 25.000.000"
 */
export function formatPrecio(
  precio: number | null | undefined,
  moneda: 'USD' | 'ARS' = 'USD',
): string {
  if (precio == null) return 'Consultar'

  const entero = Math.round(precio)

  if (moneda === 'USD') {
    return `USD ${entero.toLocaleString('es-AR')}`
  }

  return `$ ${entero.toLocaleString('es-AR')}`
}

/**
 * Formatea expensas. Si son 0 o null, devuelve "Sin expensas".
 */
export function formatExpensas(
  monto: number | null | undefined,
  moneda: 'ARS' | 'USD' = 'ARS',
): string {
  if (!monto) return 'Sin expensas'
  return `${moneda === 'ARS' ? '$ ' : 'USD '}${Math.round(monto).toLocaleString('es-AR')}/mes`
}

/* ---- Fechas ---- */

/**
 * Fecha larga: "6 de junio de 2026"
 */
export function formatFecha(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es })
}

/**
 * Fecha corta: "06/06/2026"
 */
export function formatFechaCorta(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return format(d, 'dd/MM/yyyy', { locale: es })
}

/**
 * Tiempo relativo: "hace 3 horas", "hace 2 días"
 * Ideal para columnas "Última actividad" en tablas.
 */
export function formatTiempoRelativo(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return formatDistanceToNow(d, { addSuffix: true, locale: es })
}

/* ---- Superficie ---- */

/**
 * Formatea metros cuadrados: "120 m²"
 * Si el valor es 0 o nulo, devuelve "—"
 */
export function formatM2(valor: number | null | undefined): string {
  if (!valor) return '—'
  return `${valor.toLocaleString('es-AR')} m²`
}

/* ---- Números ---- */

/**
 * Abrevia números grandes: 1500 → "1.5K", 1200000 → "1.2M"
 * Usado en KPIs del super-dashboard.
 */
export function formatNumeroAbreviado(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

/* ---- Teléfonos ---- */

/**
 * Formatea número de teléfono argentino para mostrar.
 * Ejemplo: "1144441234" → "11 4444-1234"
 */
export function formatTelefono(tel: string | null | undefined): string {
  if (!tel) return '—'
  // Limpia todo lo que no sea dígito
  const solo = tel.replace(/\D/g, '')
  if (solo.length === 10) {
    // celular: 11 4444-1234
    return `${solo.slice(0, 2)} ${solo.slice(2, 6)}-${solo.slice(6)}`
  }
  return tel // retorna tal cual si no encaja en el patrón
}
