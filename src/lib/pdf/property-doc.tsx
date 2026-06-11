/* Ficha de propiedad en PDF (@react-pdf/renderer). Render server-side. */
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { Property, Agency } from '@/lib/dummy'

const C = { ink: '#1A1A1A', ink2: '#525252', ink3: '#8A8A8A', accent: '#FF6B6B', line: '#E8E2D8', bg: '#FAF7F2' }

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: C.ink, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 2, borderBottomColor: C.ink, paddingBottom: 12, marginBottom: 20 },
  agency: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  kicker: { fontSize: 8, color: C.ink3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', marginTop: 6, marginBottom: 4, lineHeight: 1.1 },
  addr: { fontSize: 10, color: C.ink2, marginBottom: 16 },
  price: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: C.accent },
  pricePer: { fontSize: 9, color: C.ink3 },
  specRow: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, borderColor: C.line, marginBottom: 16 },
  spec: { width: '25%', padding: 10, borderRightWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  specK: { fontSize: 7, color: C.ink3, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  specV: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  h2: { fontSize: 11, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, color: C.accent, marginBottom: 8, marginTop: 8 },
  desc: { fontSize: 10, color: C.ink2, lineHeight: 1.6, marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 16 },
  chip: { fontSize: 8, color: C.ink2, borderWidth: 1, borderColor: C.line, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 3 },
  footer: { position: 'absolute', bottom: 32, left: 40, right: 40, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: C.ink3 },
})

export function PropertyDoc({ property: p, agency }: { property: Property; agency: Agency | null }) {
  const specs: [string, string][] = [
    ['Operación', p.operation], ['Tipo', p.type],
    ['Ambientes', p.rooms != null ? String(p.rooms) : '—'],
    ['Baños', p.bathrooms != null ? String(p.bathrooms) : '—'],
    ['Sup. cubierta', p.covered_area != null ? `${p.covered_area} m²` : '—'],
    ['Sup. total', p.total_area != null ? `${p.total_area} m²` : '—'],
    ['Barrio', p.neighborhood || '—'], ['Ciudad', p.city || '—'],
  ]
  const m2 = p.total_area ? Math.round(p.price / p.total_area) : null
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.agency}>{agency?.name ?? 'NIMO'}</Text>
          <Text style={s.kicker}>Ficha de propiedad</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={s.kicker}>{p.operation} · {p.neighborhood}</Text>
            <Text style={s.title}>{p.title}</Text>
            <Text style={s.addr}>{p.address}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.price}>{p.currency} {p.price.toLocaleString('es-AR')}</Text>
            {m2 && <Text style={s.pricePer}>{p.currency} {m2.toLocaleString('es-AR')}/m²</Text>}
          </View>
        </View>

        <View style={s.specRow}>
          {specs.map(([k, v]) => (
            <View key={k} style={s.spec}><Text style={s.specK}>{k}</Text><Text style={s.specV}>{v}</Text></View>
          ))}
        </View>

        {p.description ? (<><Text style={s.h2}>Descripción</Text><Text style={s.desc}>{p.description}</Text></>) : null}

        {p.features?.length ? (
          <>
            <Text style={s.h2}>Características</Text>
            <View style={s.chips}>{p.features.map((f, i) => <Text key={i} style={s.chip}>{f}</Text>)}</View>
          </>
        ) : null}

        <Text style={s.h2}>Contacto</Text>
        <Text style={s.desc}>
          {p.agent ? `Asesor: ${p.agent}\n` : ''}
          {agency?.phone ? `Tel: ${agency.phone}\n` : ''}
          {agency?.email ? `Email: ${agency.email}` : ''}
        </Text>

        <View style={s.footer} fixed>
          <Text>{agency?.name ?? 'NIMO'} · {agency?.address ?? ''}</Text>
          <Text>Generado con NIMO · {new Date().toLocaleDateString('es-AR')}</Text>
        </View>
      </Page>
    </Document>
  )
}
