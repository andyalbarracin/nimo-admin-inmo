'use client'

import { useEffect, useRef } from 'react'

interface MapViewProps {
  lat: number
  lng: number
  title: string
}

export default function PropertyMap({ lat, lng, title }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let L: any
    let cleanup: (() => void) | undefined

    const initMap = async () => {
      try {
        L = (await import('leaflet')).default
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

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map)

        const icon = L.divIcon({
          html: `<div style="background:#FF6B6B;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,.4)"></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          className: '',
        })

        L.marker([lat, lng], { icon })
          .addTo(map)
          .bindPopup(`<b style="font-family:sans-serif">${title}</b>`, { className: 'nimo-popup' })

        mapInstanceRef.current = map
        cleanup = () => map.remove()
      } catch {
        // Leaflet unavailable (SSR safety)
      }
    }

    initMap()
    return () => cleanup?.()
  }, [lat, lng, title])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', background: '#111' }}
    />
  )
}
