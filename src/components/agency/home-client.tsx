'use client'

import { useEffect, useRef } from 'react'
import type { Property } from '@/lib/dummy'

interface AgencyHomeClientProps {
  properties: Property[]
  slug: string
}

export default function AgencyHomeClient({ properties }: AgencyHomeClientProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

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

        const center = properties[0]
          ? [properties[0].lat, properties[0].lng]
          : [-34.603722, -58.381592]

        const map = L.map(mapRef.current, {
          center: center as [number, number],
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: false,
        })

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 20,
        }).addTo(map)

        properties.forEach((prop) => {
          const icon = L.divIcon({
            html: `<div style="background:#FF6A00;width:10px;height:10px;border-radius:50%;border:2px solid #F5F5F0;box-shadow:0 2px 8px rgba(255,106,0,.6)"></div>`,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            className: '',
          })

          L.marker([prop.lat, prop.lng], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:'Archivo',sans-serif;min-width:200px;padding:4px">
                <div style="font-size:11px;font-weight:700;color:#111;margin-bottom:4px">${prop.title}</div>
                <div style="font-size:10px;color:#8A8A83;margin-bottom:6px">${prop.neighborhood}</div>
                <div style="font-size:13px;font-weight:900;color:#FF6A00;font-family:'Archivo Black',sans-serif">${prop.currency} ${prop.price.toLocaleString('es-AR')}</div>
              </div>
            `, { className: 'nimo-popup' })
        })

        mapInstanceRef.current = map
        cleanup = () => map.remove()
      } catch {
        // SSR safety
      }
    }

    initMap()
    return () => cleanup?.()
  }, [properties])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#1A1A18' }} />
  )
}
