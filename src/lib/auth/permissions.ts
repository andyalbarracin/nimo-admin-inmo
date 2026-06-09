/*
 * Archivo: permissions.ts
 * Ruta: src/lib/auth/permissions.ts
 * Creado: 2026-06-06
 * Descripción: Lógica de permisos por rol. Define qué puede hacer cada rol
 *              dentro de una agencia. Los roles son: owner > admin > agent > viewer.
 *
 * USO: Siempre validar permisos desde el servidor. La UI puede ocultarlos
 *      por UX pero el server es la única fuente de verdad.
 */

import type { Database } from '@/types/database'

export type Rol = Database['public']['Enums']['member_role']

/**
 * Tabla de permisos por rol.
 * Si un rol superior tiene un permiso, todos los inferiores también lo tienen.
 *
 * Jerarquía: owner > admin > agent > viewer
 */
const PERMISOS: Record<string, Rol[]> = {
  // Propiedades
  'properties:create': ['owner', 'admin', 'agent'],
  'properties:edit': ['owner', 'admin', 'agent'],
  'properties:delete': ['owner', 'admin'],
  'properties:publish': ['owner', 'admin', 'agent'],
  'properties:view': ['owner', 'admin', 'agent', 'viewer'],

  // Leads
  'leads:view': ['owner', 'admin', 'agent', 'viewer'],
  'leads:edit': ['owner', 'admin', 'agent'],
  'leads:assign': ['owner', 'admin'],
  'leads:delete': ['owner', 'admin'],
  'leads:export': ['owner', 'admin'],

  // Agencia / Configuración
  'agency:settings:view': ['owner', 'admin'],
  'agency:settings:edit': ['owner', 'admin'],
  'agency:theme:edit': ['owner', 'admin'],
  'agency:billing:view': ['owner'],
  'agency:billing:edit': ['owner'],

  // Miembros del equipo
  'members:invite': ['owner', 'admin'],
  'members:remove': ['owner', 'admin'],
  'members:role:edit': ['owner'],

  // Métricas / Reportes
  'analytics:view': ['owner', 'admin'],

  // IA (cuando esté habilitada)
  'ai:use': ['owner', 'admin', 'agent'],
  'ai:settings': ['owner', 'admin'],
}

/**
 * Verifica si un rol tiene un permiso específico.
 *
 * @param rol - Rol del usuario dentro de la agencia
 * @param permiso - Clave del permiso a verificar (ej: 'properties:edit')
 * @returns true si el rol tiene el permiso
 */
export function tienepermiso(rol: Rol, permiso: string): boolean {
  return PERMISOS[permiso]?.includes(rol) ?? false
}

/**
 * Verifica si un rol es al menos tan alto como el rol mínimo requerido.
 * Útil para chequeos simples de jerarquía.
 *
 * @param rol - Rol del usuario
 * @param minimo - Rol mínimo requerido
 */
export function esAlMenos(rol: Rol, minimo: Rol): boolean {
  const jerarquia: Record<Rol, number> = {
    owner: 4,
    admin: 3,
    agent: 2,
    viewer: 1,
  }
  return jerarquia[rol] >= jerarquia[minimo]
}

/** Verifica si un usuario es owner de su agencia */
export const esOwner = (rol: Rol) => rol === 'owner'

/** Verifica si un usuario es admin o owner */
export const esAdmin = (rol: Rol) => esAlMenos(rol, 'admin')
