'use client'

/*
 * Archivo : onboarding-wizard.tsx
 * Ruta    : src/components/agency/onboarding-wizard.tsx
 * Modif.  : 2026-06-14
 * Descripción: Wizard de onboarding de la agencia (3 pasos): Identidad, Operación,
 *              Preferencias. Guarda progreso parcial y, al finalizar, vuelca la
 *              paleta elegida al theme y marca el onboarding como completado.
 */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveOnboarding, completeOnboarding, type OnboardingData } from '@/lib/agencies/onboarding'
import { PALETTES } from '@/lib/constants/palettes'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#E8E2D8', cream: '#F4F0E8',
  ink: '#1A1A1A', ink2: '#525252', ink3: '#9A9590', coral: '#FF6B6B', green: '#2D7D5F', red: '#E71D0A',
  sans: 'var(--font-sans), system-ui, sans-serif',
}
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: LA.ink2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6, display: 'block' }
const inp: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 8, padding: '10px 12px', color: LA.ink, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: LA.sans }

const EMPTY: OnboardingData = {
  description: '', tagline: '', palette: '',
  employees: '', properties_approx: '', ops_monthly: '', ops_annual: '', avg_ticket_usd: '',
  zones: [], avoid: '', notes: '',
}

const STEPS = ['Identidad', 'Operación', 'Preferencias']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OnboardingWizard({ slug, agencyId, initial }: { slug: string; agencyId: string; initial: any | null }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [step, setStep] = useState(0)
  const [err, setErr] = useState<string | null>(null)
  const [d, setD] = useState<OnboardingData>({
    ...EMPTY,
    ...(initial ? {
      description: initial.description ?? '', tagline: initial.tagline ?? '', palette: initial.palette ?? '',
      employees: initial.employees?.toString() ?? '', properties_approx: initial.properties_approx?.toString() ?? '',
      ops_monthly: initial.ops_monthly?.toString() ?? '', ops_annual: initial.ops_annual?.toString() ?? '',
      avg_ticket_usd: initial.avg_ticket_usd?.toString() ?? '',
      zones: initial.zones ?? [], avoid: initial.avoid ?? '', notes: initial.notes ?? '',
    } : {}),
  })
  const set = (k: keyof OnboardingData, v: string | string[]) => setD(prev => ({ ...prev, [k]: v }))

  const next = () => { setErr(null); start(async () => { const r = await saveOnboarding(agencyId, d, step + 1); if (!r.ok) { setErr(r.error ?? 'Error'); return } setStep(s => Math.min(s + 1, STEPS.length - 1)) }) }
  const back = () => setStep(s => Math.max(s - 1, 0))
  const finish = () => { setErr(null); start(async () => { const r = await completeOnboarding(agencyId, d); if (!r.ok) { setErr(r.error ?? 'Error'); return } router.push(`/${slug}/admin`); router.refresh() }) }

  return (
    <div style={{ minHeight: '100vh', background: LA.bg, fontFamily: LA.sans, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        {/* Header + progreso */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: LA.coral, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Bienvenido/a · configuremos tu agencia</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: LA.ink, margin: 0, letterSpacing: '-.02em' }}>Onboarding</h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 9999, background: i <= step ? LA.coral : LA.border }} />
                <div style={{ fontSize: 11, fontWeight: i === step ? 700 : 500, color: i === step ? LA.ink : LA.ink3, marginTop: 6 }}>{i + 1}. {s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 14, padding: 28 }}>
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={lbl}>Descripción de la agencia</label><textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={d.description} onChange={e => set('description', e.target.value)} placeholder="Quiénes son, qué los distingue…" /></div>
              <div><label style={lbl}>Mensaje / tagline</label><input style={inp} value={d.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Tu inmobiliaria de confianza en…" /></div>
              <div>
                <label style={lbl}>Paleta de colores</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                  {PALETTES.map(p => {
                    const sel = d.palette === p.id
                    return (
                      <button key={p.id} type="button" onClick={() => set('palette', p.id)} style={{ textAlign: 'left', cursor: 'pointer', background: LA.white, border: `2px solid ${sel ? LA.ink : LA.border}`, borderRadius: 10, padding: 10 }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                          <span style={{ flex: 1, height: 22, borderRadius: 4, background: p.primary }} />
                          <span style={{ flex: 1, height: 22, borderRadius: 4, background: p.secondary }} />
                          <span style={{ flex: 1, height: 22, borderRadius: 4, background: p.accent }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: LA.ink }}>{p.name}{sel ? ' ✓' : ''}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={lbl}>Cantidad de empleados</label><input type="number" style={inp} value={d.employees} onChange={e => set('employees', e.target.value)} /></div>
                <div><label style={lbl}>Propiedades (aprox.)</label><input type="number" style={inp} value={d.properties_approx} onChange={e => set('properties_approx', e.target.value)} /></div>
                <div><label style={lbl}>Operaciones por mes</label><input type="number" style={inp} value={d.ops_monthly} onChange={e => set('ops_monthly', e.target.value)} /></div>
                <div><label style={lbl}>Operaciones por año</label><input type="number" style={inp} value={d.ops_annual} onChange={e => set('ops_annual', e.target.value)} /></div>
                <div><label style={lbl}>Ticket promedio de venta (USD)</label><input type="number" style={inp} value={d.avg_ticket_usd} onChange={e => set('avg_ticket_usd', e.target.value)} /></div>
              </div>
              <div>
                <label style={lbl}>Zonas donde operan (barrios / ciudades / provincias)</label>
                <textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={d.zones.join(', ')} onChange={e => set('zones', e.target.value.split(',').map(z => z.trim()).filter(Boolean))} placeholder="Palermo, Belgrano, Núñez, CABA…" />
                <div style={{ fontSize: 11, color: LA.ink3, marginTop: 4 }}>Separá con comas.</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={lbl}>¿Qué NO querés para tu agencia?</label><textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={d.avoid} onChange={e => set('avoid', e.target.value)} placeholder="Estilos, colores, secciones o cosas que prefieras evitar…" /></div>
              <div><label style={lbl}>Notas / cualquier cosa que quieras contarnos</label><textarea rows={4} style={{ ...inp, resize: 'vertical' }} value={d.notes} onChange={e => set('notes', e.target.value)} /></div>
            </div>
          )}

          {err && <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(231,29,10,.07)', border: `1px solid ${LA.red}`, borderRadius: 8, color: LA.red, fontSize: 13 }}>{err}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 24, alignItems: 'center' }}>
            {step > 0 && <button onClick={back} disabled={pending} style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 8, padding: '11px 20px', fontSize: 14, fontWeight: 600, color: LA.ink2, cursor: 'pointer', fontFamily: LA.sans }}>Atrás</button>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => start(async () => { await saveOnboarding(agencyId, d, step) })} disabled={pending} style={{ background: 'none', border: 'none', fontSize: 13, color: LA.ink3, cursor: 'pointer', fontFamily: LA.sans }}>Guardar y seguir luego</button>
              {step < STEPS.length - 1
                ? <button onClick={next} disabled={pending} style={{ background: LA.coral, border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, color: LA.white, cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1, fontFamily: LA.sans }}>{pending ? 'Guardando…' : 'Siguiente'}</button>
                : <button onClick={finish} disabled={pending} style={{ background: LA.green, border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, color: LA.white, cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1, fontFamily: LA.sans }}>{pending ? 'Finalizando…' : 'Finalizar'}</button>}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href={`/${slug}/admin`} style={{ fontSize: 12, color: LA.ink3, textDecoration: 'none' }}>Omitir por ahora →</a>
        </div>
      </div>
    </div>
  )
}
