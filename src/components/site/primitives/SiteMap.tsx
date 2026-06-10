'use client'

import { useEffect, useRef } from 'react'

interface MapMarker {
  lat: number
  lng: number
  title: string
  price?: string
  id?: string
  href?: string
}

interface SiteMapProps {
  markers: MapMarker[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: number | string
  accentColor?: string
  tiles?: 'voyager' | 'positron'
  numbered?: boolean
  activeId?: string | null
  onMarkerHover?: (id: string | null) => void
}

export default function SiteMap({
  markers,
  center,
  zoom = 13,
  height = 400,
  accentColor = '#B25431',
  tiles = 'voyager',
  numbered = false,
  activeId = null,
  onMarkerHover,
}: SiteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  // dict id -> { marker, leaflet, index }
  const markersRef = useRef<Record<string, { marker: unknown; index: number }>>({})
  const leafletRef = useRef<unknown>(null)
  const hoverRef = useRef(onMarkerHover)
  hoverRef.current = onMarkerHover

  const tileUrl =
    tiles === 'positron'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  /* ---- pin builders ---- */
  const teardrop = (color: string, active: boolean) =>
    `<div style="background:${color};width:${active ? 34 : 28}px;height:${active ? 34 : 28}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;box-shadow:0 ${active ? 4 : 2}px ${active ? 14 : 8}px rgba(0,0,0,.28)"></div>`

  const numberedPin = (color: string, active: boolean, n: number) =>
    `<div style="background:${active ? color : 'white'};color:${active ? 'white' : color};width:${active ? 30 : 26}px;height:${active ? 30 : 26}px;border-radius:6px;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-family:ui-monospace,monospace;font-weight:700;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.22)">${n}</div>`

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cleanup: (() => void) | undefined

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        // @ts-expect-error no types
        await import('leaflet-defaulticon-compatibility')
        await import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css')

        if (!mapRef.current) return
        leafletRef.current = L

        const c = center ?? {
          lat: markers.length > 0 ? markers.reduce((s, m) => s + m.lat, 0) / markers.length : -34.6037,
          lng: markers.length > 0 ? markers.reduce((s, m) => s + m.lng, 0) / markers.length : -58.3816,
        }

        const map = L.map(mapRef.current, {
          center: [c.lat, c.lng],
          zoom,
          zoomControl: true,
          scrollWheelZoom: false,
        })

        L.tileLayer(tileUrl, {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map)

        markersRef.current = {}

        markers.forEach((m, i) => {
          const id = m.id ?? `m${i}`
          const icon = L.divIcon({
            html: numbered ? numberedPin(accentColor, false, i + 1) : teardrop(accentColor, false),
            iconSize: numbered ? [26, 26] : [28, 28],
            iconAnchor: numbered ? [13, 13] : [14, 28],
            className: '',
          })

          const popup = m.price
            ? `<div style="font-family:sans-serif;min-width:130px"><b style="font-size:13px;color:${accentColor}">${m.price}</b><br><span style="font-size:12px;color:#444">${m.title}</span></div>`
            : `<b style="font-family:sans-serif;font-size:13px">${m.title}</b>`

          const marker = L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup)

          marker.on('mouseover', () => hoverRef.current?.(id))
          marker.on('mouseout', () => hoverRef.current?.(null))

          markersRef.current[id] = { marker, index: i }
        })

        mapInstanceRef.current = map
        cleanup = () => {
          map.remove()
          mapInstanceRef.current = null
        }
      } catch {
        // SSR safety
      }
    }

    initMap()
    return () => cleanup?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, center, zoom, accentColor, tileUrl, numbered])

  /* ---- resalta marker activo sin reconstruir el mapa ---- */
  useEffect(() => {
    const L = leafletRef.current as { divIcon: (o: unknown) => unknown } | null
    if (!L) return
    Object.entries(markersRef.current).forEach(([id, { marker, index }]) => {
      const active = id === activeId
      const icon = L.divIcon({
        html: numbered ? numberedPin(accentColor, active, index + 1) : teardrop(accentColor, active),
        iconSize: numbered ? (active ? [30, 30] : [26, 26]) : active ? [34, 34] : [28, 28],
        iconAnchor: numbered ? (active ? [15, 15] : [13, 13]) : active ? [17, 34] : [14, 28],
        className: '',
      })
      const mk = marker as { setIcon: (i: unknown) => void; openPopup?: () => void; closePopup?: () => void }
      mk.setIcon(icon)
      if (active) mk.openPopup?.()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height, background: '#F2F0EB' }}
    />
  )
}
