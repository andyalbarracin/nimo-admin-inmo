/*
 * Archivo: layout.tsx
 * Ruta: src/app/layout.tsx
 * Creado: 2026-06-06
 * Descripción: Layout raíz de la aplicación. Carga las fuentes del design system,
 *              provee TooltipProvider de shadcn/ui y el componente Toaster de Sonner.
 *              Es el único lugar donde se aplican variables de fuente globales.
 */

import type { Metadata } from 'next'
import {
  Inter,
  Playfair_Display,
  JetBrains_Mono,
  Syne,
  DM_Serif_Display,
  Fraunces,
  Inter_Tight,
  Cormorant_Garamond,
  Archivo,
  Archivo_Black,
} from 'next/font/google'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

/* ---- Fuente principal (sans-serif) — mapea a --font-sans ---- */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/* ---- Fuente display para headings de lujo ---- */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

/* ---- Fuente mono para código y datos ---- */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

/* ============================================================
 * Fuentes reales del sistema ClaudeDesign (Universos B y C)
 * ============================================================ */

/* T1 Editorial — serif moderna con contraste óptico */
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

/* T2 Spatial — grotesca estrecha, swiss/tech */
const interTight = Inter_Tight({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
})

/* T3 Atelier — serif elegante de lujo */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

/* Zaire (superadmin) — cuerpo grotesco neutro */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

/* Zaire (superadmin) — display ALL CAPS, sustituto libre de Knockout */
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    // Los layouts de tenant sobrescriben esto con el nombre de la agencia
    default: 'NIMO — Inmobiliarias',
    template: '%s | NIMO',
  },
  description: 'La plataforma SaaS para inmobiliarias argentinas.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es-AR"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${syne.variable} ${dmSerifDisplay.variable} ${fraunces.variable} ${interTight.variable} ${cormorant.variable} ${archivo.variable} ${archivoBlack.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/*
         * TooltipProvider envuelve toda la app para que los Tooltip de shadcn/ui
         * funcionen correctamente sin necesidad de wrappear cada componente.
         */}
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>

        {/*
         * Toaster de Sonner — notificaciones globales.
         * Usar con: import { toast } from 'sonner'; toast.success('...')
         */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}
