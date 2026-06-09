/*
 * Archivo: next.config.ts
 * Ruta: next.config.ts
 * Creado: 2026-06-06
 * Descripción: Configuración de Next.js para NIMO.
 *              Imágenes remotas permitidas (Supabase Storage), headers de seguridad,
 *              y ajustes de compilación.
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {

  /* ---- Optimización de imágenes ---- */
  images: {
    remotePatterns: [
      {
        // Supabase Storage — bucket de imágenes de propiedades
        protocol: 'https',
        hostname: 'ihfholzcrvukehezjfuf.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Avatares de Google (Supabase Auth con OAuth)
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Picsum Photos — imágenes de demostración/seed (libres de uso)
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        // Fastly CDN de Picsum (a donde redirigen las URLs de picsum.photos)
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        // Unsplash CDN — fotos de propiedades reales (libres de uso)
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // Formatos modernos para mejor performance
    formats: ['image/avif', 'image/webp'],
  },

  /* ---- Experimentos de React 19 ---- */
  experimental: {
    // Server Actions ya estables en Next 16, pero dejamos la config explícita
    serverActions: {
      bodySizeLimit: '4mb', // para subida de imágenes en Server Actions
    },
    // PPR (Partial Pre-rendering) — habilitar por feature flag cuando sea estable
    // ppr: true,
  },

  /* ---- Headers de seguridad ---- */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Previene que la app se cargue en un iframe de otro dominio
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Previene MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Controla info del referrer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
