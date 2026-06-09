/*
 * Archivo: cn.ts
 * Ruta: src/lib/utils/cn.ts
 * Creado: 2026-06-06
 * Descripción: Helper para combinar clases de Tailwind sin conflictos.
 *              Combina clsx (condicionales) con tailwind-merge (deduplicación).
 *              Usado en todos los componentes de la app.
 *
 * Ejemplo de uso:
 *   cn('px-4 py-2', isActive && 'bg-primary', className)
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind manejando correctamente los conflictos.
 * Acepta cualquier combinación de strings, arrays, objetos condicionales.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
