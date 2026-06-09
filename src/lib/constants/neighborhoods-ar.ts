/*
 * Archivo: neighborhoods-ar.ts
 * Ruta: src/lib/constants/neighborhoods-ar.ts
 * Creado: 2026-06-06
 * Descripción: Barrios de Buenos Aires (CABA) y GBA para autocompletado en
 *              formularios de propiedades. Extendible con otras ciudades.
 */

/* ---- Barrios de CABA (48 barrios oficiales) ---- */
export const BARRIOS_CABA = [
  'Agronomía',
  'Almagro',
  'Balvanera',
  'Barracas',
  'Belgrano',
  'Boedo',
  'Caballito',
  'Chacarita',
  'Coghlan',
  'Colegiales',
  'Constitución',
  'Flores',
  'Floresta',
  'La Boca',
  'La Paternal',
  'Liniers',
  'Mataderos',
  'Monte Castro',
  'Montserrat',
  'Nueva Pompeya',
  'Núñez',
  'Palermo',
  'Parque Avellaneda',
  'Parque Chacabuco',
  'Parque Chas',
  'Parque Patricios',
  'Puerto Madero',
  'Recoleta',
  'Retiro',
  'Saavedra',
  'San Cristóbal',
  'San Nicolás',
  'San Telmo',
  'Vélez Sársfield',
  'Versalles',
  'Villa Crespo',
  'Villa del Parque',
  'Villa Devoto',
  'Villa General Mitre',
  'Villa Lugano',
  'Villa Luro',
  'Villa Ortúzar',
  'Villa Pueyrredón',
  'Villa Real',
  'Villa Riachuelo',
  'Villa Santa Rita',
  'Villa Soldati',
  'Villa Urquiza',
] as const

/* ---- Zonas del GBA más buscadas ---- */
export const ZONAS_GBA = [
  // GBA Norte
  'Vicente López',
  'Olivos',
  'Florida',
  'Munro',
  'San Isidro',
  'Martínez',
  'Acassuso',
  'Beccar',
  'Boulogne',
  'San Fernando',
  'Tigre',
  'Nordelta',
  'Pilar',
  'Escobar',
  // GBA Oeste
  'Ramos Mejía',
  'San Justo',
  'Morón',
  'Haedo',
  'Ituzaingó',
  'Merlo',
  'Moreno',
  // GBA Sur
  'Avellaneda',
  'Lanús',
  'Lomas de Zamora',
  'Quilmes',
  'Berazategui',
  'Florencio Varela',
  'Temperley',
  'Adrogué',
] as const

/* ---- Sub-barrios populares de Palermo (muy buscados) ---- */
export const SUB_BARRIOS_PALERMO = [
  'Palermo Soho',
  'Palermo Hollywood',
  'Palermo Chico',
  'Palermo Viejo',
  'Palermo Nuevo',
  'Las Cañitas',
  'Palermo Queens',
] as const

/* Lista combinada para autocompletado general */
export const BARRIOS_ARGENTINA = [
  ...BARRIOS_CABA,
  ...SUB_BARRIOS_PALERMO,
  ...ZONAS_GBA,
] as const

/* Provincias argentinas para el select de provincia */
export const PROVINCIAS_ARGENTINA = [
  'Buenos Aires',
  'CABA',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const

export type Provincia = (typeof PROVINCIAS_ARGENTINA)[number]
export type BarrioCaba = (typeof BARRIOS_CABA)[number]
