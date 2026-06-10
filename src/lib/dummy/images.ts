const BASE = 'https://images.unsplash.com/photo-'
const PARAMS = '?w=1200&q=85&auto=format&fit=crop'
const PARAMS_THUMB = '?w=600&q=80&auto=format&fit=crop'

const u = (id: string, thumb = false) => `${BASE}${id}${thumb ? PARAMS_THUMB : PARAMS}`

// --- Interiors: living rooms, open-plan spaces ---
export const LIVING = [
  u('1522708323590-d24dbb6b0267'),   // modern white living room
  u('1554995207-c18c203602cb'),       // bright airy living room
  u('1560448204-e02f11c3d0e2'),       // minimal apartment
  u('1536376072261-38c75010e6c9'),    // luxury penthouse interior
  u('1555041469-a586c61ea9bc'),       // modern sofa living
  u('1524758631624-e2822e304c36'),    // warm living decor
  u('1493663284031-b7e3aefcae8e'),    // bright apartment living
]

// --- Interiors: kitchens ---
export const KITCHENS = [
  u('1484154218962-a197022b5858'),    // white modern kitchen
  u('1600607687939-ce8a6c25118c'),    // sleek kitchen island
  u('1556909172-54557c7e4fb7'),       // contemporary kitchen
  u('1513584684374-8bab748fbf90'),    // kitchen with island
  u('1556909114-f6e7ad7d3136'),       // kitchen detail light
]

// --- Interiors: bedrooms ---
export const BEDROOMS = [
  u('1505873242700-f289a29e1e0f'),    // minimal bedroom
  u('1630699144867-37acec97df5a'),    // modern master bedroom
  u('1631679706909-1844bbd07221'),    // serene bedroom
  u('1618219908412-a29a1bb7b86e'),    // warm bedroom interior
  u('1586023492125-27b2c045efd7'),    // light & airy bedroom
]

// --- Interiors: bathrooms ---
export const BATHROOMS = [
  u('1552321554-5fefe8c9ef14'),       // modern clean bathroom
  u('1616594039964-ae9021a400a0'),    // minimalist bathroom
]

// --- Exteriors: apartments & buildings ---
export const APARTMENTS = [
  u('1545324418-cc1a3fa10c00'),       // modern apartment block
  u('1502672260266-1c1ef2d93688'),    // studio apartment facade
  u('1493809842364-78817add7ffb'),    // urban apartment
  u('1574362848149-11496d93a7c7'),    // light apartment building
  u('1489171078254-c3365d6e359f'),    // apartment courtyard
  u('1571508601891-ca5e7a713859'),    // modern high-rise
]

// --- Exteriors: houses ---
export const HOUSES = [
  u('1564013799919-ab600027ffc6'),    // modern house exterior
  u('1570129477492-45c003edd2be'),    // house with garden
  u('1512917774080-9991f1c4c750'),    // white minimal house
  u('1600585154340-be6161a56a0c'),    // contemporary house exterior
  u('1523217582562-09d0def993a6'),    // house facade
  u('1558618666-fcd25c85cd64'),       // house terrace view
  u('1600210492493-0946911123ea'),    // modern glass house exterior
]

// --- Exteriors: terraces & outdoor spaces ---
export const TERRACES = [
  u('1600047509807-ba8f99d2cdde'),    // rooftop terrace
  u('1600047508788-786f3865b09a'),    // modern terrace furniture
  u('1560184897-ae75f418493e'),       // balcony with city view
  u('1556912167-f556f1f39fdf'),       // covered terrace
]

// --- Commercial spaces ---
export const COMMERCIAL = [
  u('1441986300917-64674bd600d8'),    // bright commercial interior
  u('1604754742629-3e5728249d73'),    // retail interior
  u('1497366811353-6870744d04b2'),    // commercial/office
]

// --- Nature & land ---
export const NATURE = [
  u('1500534314209-a25ddb2bd429'),    // river landscape
  u('1500382017468-9049fed747ef'),    // green terrain
]

// --- Hero / full-bleed for themes ---
export const HERO = {
  editorial: u('1600585154340-be6161a56a0c'),
  spatial: u('1545324418-cc1a3fa10c00'),
  atelier: u('1564013799919-ab600027ffc6'),
}

// --- Property image sets (used in PROPERTIES dummy data) ---
// Each property gets 5-6 images: hero + rooms + detail
export const PROP_IMAGES = {
  'prop-001': [
    u('1545324418-cc1a3fa10c00'),
    u('1522708323590-d24dbb6b0267'),
    u('1484154218962-a197022b5858'),
    u('1505873242700-f289a29e1e0f'),
    u('1552321554-5fefe8c9ef14'),
    u('1560448204-e02f11c3d0e2'),
  ],
  'prop-002': [
    u('1600047509807-ba8f99d2cdde'),
    u('1600585154340-be6161a56a0c'),
    u('1536376072261-38c75010e6c9'),
    u('1600607687939-ce8a6c25118c'),
    u('1631679706909-1844bbd07221'),
    u('1616594039964-ae9021a400a0'),
  ],
  'prop-003': [
    u('1564013799919-ab600027ffc6'),
    u('1570129477492-45c003edd2be'),
    u('1524758631624-e2822e304c36'),
    u('1484154218962-a197022b5858'),
    u('1505873242700-f289a29e1e0f'),
    u('1558618666-fcd25c85cd64'),
  ],
  'prop-004': [
    u('1502672260266-1c1ef2d93688'),
    u('1493809842364-78817add7ffb'),
    u('1554995207-c18c203602cb'),
    u('1556909172-54557c7e4fb7'),
    u('1552321554-5fefe8c9ef14'),
  ],
  'prop-005': [
    u('1536376072261-38c75010e6c9'),
    u('1484154218962-a197022b5858'),
    u('1555041469-a586c61ea9bc'),
    u('1505873242700-f289a29e1e0f'),
    u('1616594039964-ae9021a400a0'),
  ],
  'prop-006': [
    u('1505691938895-1758d7feb511'),
    u('1554995207-c18c203602cb'),
    u('1536376072261-38c75010e6c9'),
    u('1484154218962-a197022b5858'),
    u('1630699144867-37acec97df5a'),
  ],
  'prop-007': [
    u('1441986300917-64674bd600d8'),
    u('1604754742629-3e5728249d73'),
    u('1497366811353-6870744d04b2'),
  ],
  'prop-008': [
    u('1600047509807-ba8f99d2cdde'),
    u('1600566753086-00f18fb6b3ea'),
    u('1524758631624-e2822e304c36'),
    u('1600607687939-ce8a6c25118c'),
    u('1618219908412-a29a1bb7b86e'),
    u('1616594039964-ae9021a400a0'),
  ],
  'prop-009': [
    u('1560184897-ae75f418493e'),
    u('1556912167-f556f1f39fdf'),
    u('1554995207-c18c203602cb'),
    u('1484154218962-a197022b5858'),
    u('1505873242700-f289a29e1e0f'),
  ],
  'prop-010': [
    u('1500534314209-a25ddb2bd429'),
    u('1500382017468-9049fed747ef'),
  ],
  'prop-011': [
    u('1489171078254-c3365d6e359f'),
    u('1571508601891-ca5e7a713859'),
    u('1554995207-c18c203602cb'),
    u('1556909172-54557c7e4fb7'),
    u('1552321554-5fefe8c9ef14'),
  ],
  'prop-012': [
    u('1604754742629-3e5728249d73'),
    u('1497366811353-6870744d04b2'),
    u('1441986300917-64674bd600d8'),
  ],
}
