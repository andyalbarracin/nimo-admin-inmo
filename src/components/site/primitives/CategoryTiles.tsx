import Link from 'next/link'

interface Tile {
  label: string
  sub?: string
  href: string
  imageBg?: string
}

interface CategoryTilesProps {
  tiles: Tile[]
  accent: string
  accentContrast: string
  ink: string
  radius?: string
}

const DEFAULT_IMAGES = [
  'linear-gradient(135deg,#D4C8B8,#A89880)',
  'linear-gradient(135deg,#B8CCD4,#6888A0)',
  'linear-gradient(135deg,#C8D4B8,#88A068)',
  'linear-gradient(135deg,#D4C0B0,#A07858)',
]

export default function CategoryTiles({ tiles, accent, accentContrast, ink, radius = '8px' }: CategoryTilesProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${tiles.length}, 1fr)`, gap: 2 }}>
      {tiles.map((tile, i) => (
        <Link
          key={tile.label}
          href={tile.href}
          style={{
            textDecoration: 'none',
            display: 'block',
            position: 'relative',
            height: 200,
            background: tile.imageBg ?? DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
            borderRadius: radius,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,.45) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-.01em' }}>{tile.label}</div>
            {tile.sub && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 4 }}>{tile.sub}</div>}
          </div>
        </Link>
      ))}
    </div>
  )
}
