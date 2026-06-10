'use client'

import { useEffect, useRef } from 'react'

interface MapViewProps {
  lat: number
  lng: number
  title: string
  accentColor?: string
  tiles?: 'voyager' | 'positron'
}

export default function PropertyMap({
  lat,
  lng,
  title,
  accentColor = '#B25431',
  tiles = 'voyager',
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  const tileUrl =
    tiles === 'positron'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cleanup: (() => void) | undefined

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        // @ts-expect-error no types available
        await import('leaflet-defaulticon-compatibility')
        await import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css')

        if (!mapRef.current) return

        const map = L.map(mapRef.current, {
          center: [lat, lng],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false,
        })

        L.tileLayer(tileUrl, {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map)

        const icon = L.divIcon({
          html: `<div style="background:${accentColor};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,.25)"></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: '',
        })

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`<b style="font-family:sans-serif;font-size:13px">${title}</b>`)

        mapInstanceRef.current = map
        cleanup = () => map.remove()
      } catch {
        // Leaflet unavailable (SSR safety)
      }
    }

    initMap()
    return () => cleanup?.()
  }, [lat, lng, title, accentColor, tileUrl])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#F2F0EB' }}
    />
  )
}
