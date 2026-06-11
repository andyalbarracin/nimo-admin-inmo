/* Ficha de lead/cliente en PDF (@react-pdf/renderer). Render server-side. */
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Lead, Agency } from '@/lib/dummy'

const C = { ink: '#1A1A1A', ink2: '#525252', ink3: '#8A8A8A', accent: '#FF6B6B', line: '#E8E2D8' }
const STAGE: Record<string, string> = { new: 'Prospecto', contacted: 'Contactado', interested: 'Interesado', visit: 'Visita', proposal: 'Propuesta', won: 'Cerrado', lost: 'Perdido' }

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: C.ink, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2, borderBottomColor: C.ink, paddingBottom: 12, marginBottom: 20 },
  agency: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  kicker: { fontSize: 8, color: C.ink3, textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 24, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  badge: { fontSize: 9, color: C.accent, fontFamily: 'Helvetica-Bold', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  cell: { width: '50%', paddingVertical: 8, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: C.line },
  k: { fontSize: 7, color: C.ink3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  v: { fontSize: 12 },
  h2: { fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: C.accent, marginTop: 18, marginBottom: 8 },
  notes: { fontSize: 10, color: C.ink2, lineHeight: 1.6 },
  footer: { position: 'absolute', bottom: 32, left: 40, right: 40, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: C.ink3 },
})

export function LeadDoc({ lead: l, agency }: { lead: Lead; agency: Agency | null }) {
  const rows: [string, string][] = [
    ['Tipo de cliente', l.client_type ?? '—'],
    ['Operación', l.operation_interest ?? '—'],
    ['Etapa', STAGE[l.stage] ?? l.stage],
    ['Origen', l.source || '—'],
    ['Teléfono', l.phone || '—'],
    ['Email', l.email || '—'],
    ['Contacto 2', l.contact2_name || '—'],
    ['Tel. contacto 2', l.contact2_phone || '—'],
    ['Interés', l.property_interest || '—'],
    ['Presupuesto', l.budget || '—'],
    ['Agente', l.agent || 'Sin asignar'],
    ['Último contacto', l.last_contact || '—'],
  ]
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.agency}>{agency?.name ?? 'NIMO'}</Text>
          <Text style={s.kicker}>Ficha de cliente / lead</Text>
        </View>

        <Text style={s.name}>{l.name || 'Sin nombre'}</Text>
        <Text style={s.badge}>{STAGE[l.stage] ?? l.stage}{l.client_type ? ` · ${l.client_type}` : ''}</Text>

        <View style={s.grid}>
          {rows.map(([k, v]) => (
            <View key={k} style={s.cell}><Text style={s.k}>{k}</Text><Text style={s.v}>{v}</Text></View>
          ))}
        </View>

        {l.notes ? (<><Text style={s.h2}>Observaciones</Text><Text style={s.notes}>{l.notes}</Text></>) : null}

        <View style={s.footer} fixed>
          <Text>{agency?.name ?? 'NIMO'} · CRM</Text>
          <Text>Generado con NIMO · {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  )
}
