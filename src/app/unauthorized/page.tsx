'use client'

/*
 * Archivo: page.tsx
 * Ruta: src/app/unauthorized/page.tsx
 * Modif.: 2026-06-15
 * Descripción: Página de acceso denegado. Se muestra cuando un usuario autenticado
 *              intenta acceder a una agencia a la que no pertenece.
 */
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center space-y-6 max-w-md">
        <p className="text-6xl">🔐</p>
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Acceso denegado
          </h1>
          <p className="text-muted-foreground">
            No tenés los permisos necesarios para acceder a esta sección.
            Contactá al administrador de tu agencia si creés que es un error.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center h-10 px-5 rounded-full border border-border text-sm hover:bg-accent transition-colors"
          >
            ← Ir al inicio
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  )
}
