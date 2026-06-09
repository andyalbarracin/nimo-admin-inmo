/*
 * Archivo: slug.ts
 * Ruta: src/lib/utils/slug.ts
 * Creado: 2026-06-06
 * Descripción: Helpers para generación y validación de slugs en NIMO.
 *              Los slugs se usan en URLs de agencies (/[agency_slug])
 *              y propiedades (/propiedades/[property_slug]).
 */

import slugifyLib from 'slugify'
import { nanoid } from 'nanoid'

/**
 * Convierte un string en un slug URL-amigable en español.
 * Reemplaza acentos, ñ y caracteres especiales.
 *
 * Ejemplo: "Departamento 3 Amb. – Palermo" → "departamento-3-amb-palermo"
 */
export function slugify(texto: string): string {
  return slugifyLib(texto, {
    lower: true,     // minúsculas
    strict: true,    // solo letras, números y guiones
    locale: 'es',    // manejo correcto de ñ, acentos, etc.
    trim: true,
  })
}

/**
 * Genera un slug único para una propiedad.
 * Combina el título slugificado con un ID corto para garantizar unicidad.
 *
 * Ejemplo: "Depto 3 amb Palermo" → "depto-3-amb-palermo-a3b9k"
 */
export function slugifyPropiedad(titulo: string): string {
  const base = slugify(titulo)
  const id = nanoid(5) // 5 caracteres son suficientes para unicidad por inmobiliaria
  return `${base}-${id}`
}

/**
 * Valida si un string es un slug válido.
 * Solo letras minúsculas, números y guiones. Sin doble guión.
 */
export function esSlugValido(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

/**
 * Genera un código corto para QR de propiedades.
 * 8 caracteres alfanuméricos, más compacto que un UUID.
 * Ejemplo: "a3B9kXmP"
 */
export function generarCodigoQR(): string {
  return nanoid(8)
}
