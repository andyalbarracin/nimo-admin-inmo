/*
 * Ciudades/localidades de Argentina con código postal (4 dígitos) — dataset
 * embebido CURADO (las más importantes). Para lo que no esté acá, el
 * autocomplete cae a la API oficial georef.ar (sin CP). Ver lib/geo/search.ts.
 *
 * Los CP son representativos (la cabecera de cada localidad). Para producción
 * conviene un dataset verificado de CPA por calle.
 */

export interface ArCity {
  city: string
  province: string
  cp: string
}

export const AR_CITIES: ArCity[] = [
  // ── CABA (barrios) ──
  { city: 'Palermo', province: 'CABA', cp: '1425' },
  { city: 'Belgrano', province: 'CABA', cp: '1426' },
  { city: 'Recoleta', province: 'CABA', cp: '1129' },
  { city: 'Caballito', province: 'CABA', cp: '1405' },
  { city: 'Villa Crespo', province: 'CABA', cp: '1414' },
  { city: 'Núñez', province: 'CABA', cp: '1429' },
  { city: 'Colegiales', province: 'CABA', cp: '1426' },
  { city: 'Almagro', province: 'CABA', cp: '1172' },
  { city: 'Flores', province: 'CABA', cp: '1406' },
  { city: 'San Telmo', province: 'CABA', cp: '1103' },
  { city: 'Puerto Madero', province: 'CABA', cp: '1107' },
  { city: 'Barracas', province: 'CABA', cp: '1275' },
  { city: 'Boedo', province: 'CABA', cp: '1218' },
  { city: 'Saavedra', province: 'CABA', cp: '1430' },
  { city: 'Villa Urquiza', province: 'CABA', cp: '1431' },
  { city: 'Chacarita', province: 'CABA', cp: '1414' },
  { city: 'Villa Devoto', province: 'CABA', cp: '1419' },
  { city: 'Once / Balvanera', province: 'CABA', cp: '1184' },
  { city: 'Constitución', province: 'CABA', cp: '1148' },
  { city: 'Retiro', province: 'CABA', cp: '1003' },

  // ── GBA (conurbano) ──
  { city: 'Vicente López', province: 'Buenos Aires', cp: '1638' },
  { city: 'Olivos', province: 'Buenos Aires', cp: '1636' },
  { city: 'San Isidro', province: 'Buenos Aires', cp: '1642' },
  { city: 'Martínez', province: 'Buenos Aires', cp: '1640' },
  { city: 'Acassuso', province: 'Buenos Aires', cp: '1641' },
  { city: 'Tigre', province: 'Buenos Aires', cp: '1648' },
  { city: 'San Fernando', province: 'Buenos Aires', cp: '1646' },
  { city: 'Quilmes', province: 'Buenos Aires', cp: '1878' },
  { city: 'Avellaneda', province: 'Buenos Aires', cp: '1870' },
  { city: 'Lanús', province: 'Buenos Aires', cp: '1824' },
  { city: 'Lomas de Zamora', province: 'Buenos Aires', cp: '1832' },
  { city: 'Morón', province: 'Buenos Aires', cp: '1708' },
  { city: 'Ramos Mejía', province: 'Buenos Aires', cp: '1704' },
  { city: 'Castelar', province: 'Buenos Aires', cp: '1712' },
  { city: 'Ituzaingó', province: 'Buenos Aires', cp: '1714' },
  { city: 'Hurlingham', province: 'Buenos Aires', cp: '1686' },
  { city: 'San Miguel', province: 'Buenos Aires', cp: '1663' },
  { city: 'Pilar', province: 'Buenos Aires', cp: '1629' },
  { city: 'Escobar', province: 'Buenos Aires', cp: '1625' },
  { city: 'San Justo', province: 'Buenos Aires', cp: '1754' },
  { city: 'Merlo', province: 'Buenos Aires', cp: '1722' },
  { city: 'Haedo', province: 'Buenos Aires', cp: '1706' },
  { city: 'El Palomar', province: 'Buenos Aires', cp: '1684' },
  { city: 'Villa Tesei', province: 'Buenos Aires', cp: '1688' },
  { city: 'Moreno', province: 'Buenos Aires', cp: '1744' },

  // ── Provincia de Buenos Aires (interior) ──
  { city: 'La Plata', province: 'Buenos Aires', cp: '1900' },
  { city: 'Mar del Plata', province: 'Buenos Aires', cp: '7600' },
  { city: 'Bahía Blanca', province: 'Buenos Aires', cp: '8000' },
  { city: 'Tandil', province: 'Buenos Aires', cp: '7000' },
  { city: 'Pergamino', province: 'Buenos Aires', cp: '2700' },
  { city: 'Junín', province: 'Buenos Aires', cp: '6000' },
  { city: 'San Nicolás', province: 'Buenos Aires', cp: '2900' },
  { city: 'Olavarría', province: 'Buenos Aires', cp: '7400' },
  { city: 'Necochea', province: 'Buenos Aires', cp: '7630' },

  // ── Capitales y ciudades principales por provincia ──
  { city: 'Córdoba', province: 'Córdoba', cp: '5000' },
  { city: 'Villa Carlos Paz', province: 'Córdoba', cp: '5152' },
  { city: 'Río Cuarto', province: 'Córdoba', cp: '5800' },
  { city: 'Rosario', province: 'Santa Fe', cp: '2000' },
  { city: 'Santa Fe', province: 'Santa Fe', cp: '3000' },
  { city: 'Rafaela', province: 'Santa Fe', cp: '2300' },
  { city: 'Mendoza', province: 'Mendoza', cp: '5500' },
  { city: 'San Rafael', province: 'Mendoza', cp: '5600' },
  { city: 'San Miguel de Tucumán', province: 'Tucumán', cp: '4000' },
  { city: 'Salta', province: 'Salta', cp: '4400' },
  { city: 'Resistencia', province: 'Chaco', cp: '3500' },
  { city: 'Corrientes', province: 'Corrientes', cp: '3400' },
  { city: 'Posadas', province: 'Misiones', cp: '3300' },
  { city: 'San Salvador de Jujuy', province: 'Jujuy', cp: '4600' },
  { city: 'Neuquén', province: 'Neuquén', cp: '8300' },
  { city: 'San Juan', province: 'San Juan', cp: '5400' },
  { city: 'Paraná', province: 'Entre Ríos', cp: '3100' },
  { city: 'Concordia', province: 'Entre Ríos', cp: '3200' },
  { city: 'Gualeguaychú', province: 'Entre Ríos', cp: '2820' },
  { city: 'Formosa', province: 'Formosa', cp: '3600' },
  { city: 'San Luis', province: 'San Luis', cp: '5700' },
  { city: 'Santiago del Estero', province: 'Santiago del Estero', cp: '4200' },
  { city: 'San Fernando del Valle de Catamarca', province: 'Catamarca', cp: '4700' },
  { city: 'La Rioja', province: 'La Rioja', cp: '5300' },
  { city: 'Santa Rosa', province: 'La Pampa', cp: '6300' },
  { city: 'Viedma', province: 'Río Negro', cp: '8500' },
  { city: 'San Carlos de Bariloche', province: 'Río Negro', cp: '8400' },
  { city: 'Rawson', province: 'Chubut', cp: '9103' },
  { city: 'Comodoro Rivadavia', province: 'Chubut', cp: '9000' },
  { city: 'Puerto Madryn', province: 'Chubut', cp: '9120' },
  { city: 'Río Gallegos', province: 'Santa Cruz', cp: '9400' },
  { city: 'El Calafate', province: 'Santa Cruz', cp: '9405' },
  { city: 'Ushuaia', province: 'Tierra del Fuego', cp: '9410' },
  { city: 'Río Grande', province: 'Tierra del Fuego', cp: '9420' },
]

/** Búsqueda local (instantánea) por nombre de ciudad o CP. */
export function searchLocal(query: string, max = 6): ArCity[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const starts: ArCity[] = []
  const includes: ArCity[] = []
  for (const c of AR_CITIES) {
    const name = c.city.toLowerCase()
    if (name.startsWith(q) || c.cp.startsWith(q)) starts.push(c)
    else if (name.includes(q) || c.province.toLowerCase().includes(q)) includes.push(c)
  }
  return [...starts, ...includes].slice(0, max)
}
