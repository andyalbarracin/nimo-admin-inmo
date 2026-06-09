/*
 * Archivo: login-form.tsx
 * Ruta: src/components/auth/login-form.tsx
 * Creado: 2026-06-06
 * Descripción: Formulario de login reutilizable con pre-llenado de credenciales demo.
 *              Usado tanto en /superadmin/login como en /[slug]/admin/login.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

/* ---- Tipos de credencial de demo ---- */
export interface DemoCredential {
  label: string         // "Owner", "Agente", "Super Admin"
  email: string
  password: string
  rol: string           // Badge: "owner", "agente", "super-admin"
  descripcion: string   // Texto breve que se muestra bajo el botón
}

interface LoginFormProps {
  redirectTo: string             // A dónde redirigir tras el login exitoso
  demoCredentials?: DemoCredential[]
  titulo?: string
  subtitulo?: string
}

export function LoginForm({
  redirectTo,
  demoCredentials = [],
  titulo = 'Iniciar sesión',
  subtitulo,
}: LoginFormProps) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  /* Llena los campos con las credenciales de demo seleccionadas */
  const usarCredencial = (cred: DemoCredential) => {
    setEmail(cred.email)
    setPassword(cred.password)
    setError(null)
  }

  /* Maneja el submit del formulario */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(
          authError.message.includes('Invalid login credentials')
            ? 'Email o contraseña incorrectos. Verificá los datos.'
            : authError.message
        )
        return
      }

      // Refrescar el server state y redirigir
      router.refresh()
      router.push(redirectTo)
    })
  }

  return (
    <div className="w-full max-w-md space-y-8">

      {/* ---- Encabezado ---- */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        )}
      </div>

      {/* ---- Formulario ---- */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isPending}
            autoComplete="email"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isPending}
            autoComplete="current-password"
            className="h-11"
          />
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={isPending || !email || !password}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Ingresando...
            </span>
          ) : (
            'Ingresar'
          )}
        </Button>
      </form>

      {/* ---- Credenciales de demostración ---- */}
      {demoCredentials.length > 0 && (
        <>
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground whitespace-nowrap">
              Usuarios de demostración
            </span>
          </div>

          <div className="space-y-3">
            {demoCredentials.map((cred) => (
              <DemoCredentialCard
                key={cred.email}
                cred={cred}
                onUsar={usarCredencial}
                isActive={email === cred.email}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---- Tarjeta de credencial de demo ---- */
function DemoCredentialCard({
  cred,
  onUsar,
  isActive,
}: {
  cred: DemoCredential
  onUsar: (c: DemoCredential) => void
  isActive: boolean
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-colors',
        isActive
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-card hover:border-border/80'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">

          {/* Rol + label */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {cred.label}
            </span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {cred.rol}
            </Badge>
          </div>

          {/* Email */}
          <p className="text-xs text-muted-foreground font-mono truncate">
            {cred.email}
          </p>

          {/* Password con toggle de visibilidad */}
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground font-mono">
              {passwordVisible ? cred.password : '••••••••••••'}
            </p>
            <button
              type="button"
              onClick={() => setPasswordVisible((v) => !v)}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {passwordVisible ? 'ocultar' : 'ver'}
            </button>
          </div>

          {/* Descripción */}
          <p className="text-xs text-muted-foreground/80 pt-0.5">
            {cred.descripcion}
          </p>
        </div>

        {/* Botón "Usar" */}
        <Button
          type="button"
          variant={isActive ? 'default' : 'outline'}
          size="sm"
          className="shrink-0 h-8 text-xs"
          onClick={() => onUsar(cred)}
        >
          {isActive ? '✓ Cargado' : 'Usar'}
        </Button>
      </div>
    </div>
  )
}
