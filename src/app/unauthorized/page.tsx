/*
 * Archivo: page.tsx
 * Ruta: src/app/unauthorized/page.tsx
 * Creado: 2026-06-06
 * Descripción: Página de acceso denegado. Se muestra cuando un usuario autenticado
 *              intenta acceder a un recurso sin el rol suficiente.
 */

export default function UnauthorizedPage() {
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
          <a
            href="/"
            className="inline-flex items-center h-10 px-5 rounded-full border border-border text-sm hover:bg-accent transition-colors"
          >
            ← Ir al inicio
          </a>
          <a
            href="javascript:history.back()"
            className="inline-flex items-center h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
          >
            Volver
          </a>
        </div>
      </div>
    </main>
  )
}
