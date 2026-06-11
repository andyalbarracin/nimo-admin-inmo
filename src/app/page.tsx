import './landing.css'
import { planMap } from '@/lib/plans/server'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'NIMO · Tu inmobiliaria, en una sola plataforma',
  description: 'Sitio web premium, CRM con WhatsApp, propiedades con QR y fichas en PDF. Todo en un panel diseñado para vos — no para un programador.',
}

const CheckIcon = () => (
  <svg className="ico" viewBox="0 0 24 24" style={{ color: '#4ECDC4' }}>
    <polyline points="4 12 10 18 20 6" />
  </svg>
)
const CheckIconYellow = () => (
  <svg className="ico" viewBox="0 0 24 24" style={{ color: '#FFD93D' }}>
    <polyline points="4 12 10 18 20 6" />
  </svg>
)
const ArrowRight = () => (
  <svg className="ico" viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

function CompareCell({ type, text, nimo }: { type: 'yes' | 'no' | 'mid'; text: string; nimo?: boolean }) {
  const icons = {
    yes: <svg className="ico" viewBox="0 0 24 24"><polyline points="4 12 10 18 20 6" /></svg>,
    no:  <svg className="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg>,
    mid: <svg className="ico" viewBox="0 0 24 24"><path d="M12 8v4M12 16h.01" /><circle cx="12" cy="12" r="9" /></svg>,
  }
  return (
    <div className={`compare-cell${nimo ? ' nimo' : ''}`}>
      <span className={`pill ${type}`}>{icons[type]} {text}</span>
    </div>
  )
}

const THEMES_DATA = [
  { id: 'editorial', name: 'Editorial', desc: 'Magazine, serif Fraunces, terracota. Para inmobiliarias de trayectoria.', href: '/lopez-asociados', bg: '#FAF7F0', ink: '#1A1614', accent: '#B25431', line: '#DBD2C2', font: 'var(--font-fraunces), Georgia, serif', sample: 'Norte Propiedades', palette: ['#FAF7F0', '#B25431', '#1A1614'] },
  { id: 'spatial', name: 'Spatial', desc: 'Swiss, map-forward, azul electric. Para boutiques tech-savvy.', href: '/norte-propiedades', bg: '#FFFFFF', ink: '#0A0A0A', accent: '#1F4DD6', line: '#D8D8D6', font: 'var(--font-inter-tight), Inter, sans-serif', sample: 'GRID PROPIEDADES', palette: ['#FFFFFF', '#1F4DD6', '#0A0A0A'] },
  { id: 'atelier', name: 'Atelier', desc: 'Boutique de lujo, Cormorant, verde salvia. Para propiedades premium.', href: '/distrito-atelier', bg: '#F5F1EC', ink: '#2E2620', accent: '#7A8264', line: '#DDD5CA', font: 'var(--font-cormorant), Georgia, serif', sample: 'Plaza Mayor', palette: ['#F5F1EC', '#7A8264', '#2E2620'] },
]

export default async function LandingPage() {
  const plans = await planMap()
  const price = (code: string) => plans[code]?.monthly ?? 0
  const setup = (code: string) => plans[code]?.setup ?? 0
  return (
    <div className="lp-wrap">

      {/* ===== NAV ===== */}
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="/" aria-label="NIMO inicio">
            <span className="logo-mark"><span>N</span></span>
            <span className="logo-word">NI<em>MO</em></span>
          </a>
          <nav className="menu">
            <a href="#features">Características</a>
            <a href="#themes">Themes</a>
            <a href="#pricing">Precios</a>
            <a href="#recursos">Recursos</a>
          </nav>
          <div className="nav-cta">
            <a className="link" href="/lopez-asociados/admin/login">Iniciar sesión</a>
            <a className="btn btn-coral" href="#pricing">Iniciá gratis <ArrowRight /></a>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-blob blob-a" />
        <div className="hero-blob blob-b" />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">// SaaS para inmobiliarias · Argentina</span>
            <h1 className="h1">Tu inmobiliaria,<br />en <em>una sola</em> plataforma.</h1>
            <p className="lede">
              Sitio web premium, CRM con WhatsApp, propiedades con QR y fichas en PDF.
              Todo administrado desde un panel diseñado para vos — no para un programador.
            </p>
            <div className="cta-row">
              <a className="btn btn-coral btn-lg" href="#pricing">Probá 15 días gratis <ArrowRight /></a>
              <a className="btn btn-ghost btn-lg" href="#features">
                <svg className="ico" viewBox="0 0 24 24">
                  <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />
                </svg>
                Ver características
              </a>
            </div>
            <div className="hero-badge">
              <span className="dot" />
              Sin tarjeta de crédito
              <span className="sep">·</span>
              Migrá desde cualquier plataforma, gratis
            </div>
          </div>

          {/* Laptop mockup */}
          <div className="laptop-wrap">
            <div className="laptop">
              <div className="laptop-screen">
                <div className="dash">
                  <aside className="dash-side">
                    <div className="dash-brand">
                      <div className="lm">N</div>
                      <b>Tu agencia</b>
                    </div>
                    <div className="dash-item">
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                      </svg>
                      Dashboard
                    </div>
                    <div className="dash-item">
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9.5 12 3l9 6.5V21H3z" />
                      </svg>
                      Propiedades
                    </div>
                    <div className="dash-item active">
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="5" height="14" rx="1" /><rect x="10" y="5" width="5" height="9" rx="1" /><rect x="17" y="5" width="4" height="11" rx="1" />
                      </svg>
                      Kanban
                    </div>
                    <div className="dash-item">
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="8" r="3" /><path d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="10" r="2" />
                      </svg>
                      Leads
                      <span style={{ marginLeft: 'auto', background: '#FF6B6B', color: 'white', padding: '1px 6px', borderRadius: 99, fontSize: 9 }}>23</span>
                    </div>
                    <div className="dash-item">
                      <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18" />
                      </svg>
                      Sitio web
                    </div>
                    <div className="dash-divider" />
                    <div className="dash-promo">
                      <b>Subí a Business</b>
                      7 días gratis. Hasta 5 agentes y reportes avanzados.
                      <span className="mini-btn">Probar →</span>
                    </div>
                  </aside>
                  <main className="dash-main">
                    <div className="dash-head">
                      <div>
                        <div className="dash-h">Tablero de leads</div>
                        <div className="dash-sub">23 leads activos · 5 nuevos esta semana</div>
                      </div>
                      <div className="dash-tabs">
                        <div className="dash-tab">Tabla</div>
                        <div className="dash-tab on">Kanban</div>
                      </div>
                    </div>
                    <div className="kanban">
                      <div className="kcol">
                        <div className="kcol-h">Nuevo <span className="kbadge coral">5</span></div>
                        <div className="lcard"><div className="name">Juan Pérez</div><div className="prop">PH Caballito</div><div className="foot"><div className="ag-av" /><div className="time">hace 1h</div></div></div>
                        <div className="lcard featured"><div className="name">M. González</div><div className="prop">2amb Palermo</div><div className="foot"><div className="ag-av" /><div className="time">hace 3h</div></div></div>
                        <div className="lcard"><div className="name">L. Acosta</div><div className="prop">Casa Morón</div><div className="foot"><div className="ag-av" /><div className="time">hoy</div></div></div>
                      </div>
                      <div className="kcol">
                        <div className="kcol-h">Contactado <span className="kbadge blue">6</span></div>
                        <div className="lcard"><div className="name">C. Rodríguez</div><div className="prop">Depto 3amb</div><div className="foot"><div className="ag-av" /><div className="time">hace 2d</div></div></div>
                        <div className="lcard"><div className="name">R. Fernández</div><div className="prop">PH Flores</div><div className="foot"><div className="ag-av" /><div className="time">hace 4d</div></div></div>
                      </div>
                      <div className="kcol">
                        <div className="kcol-h">Interesado <span className="kbadge amber">4</span></div>
                        <div className="lcard"><div className="name">S. Méndez</div><div className="prop">Casa Castelar</div><div className="foot"><div className="ag-av" /><div className="time">ayer</div></div></div>
                        <div className="lcard"><div className="name">P. Torres</div><div className="prop">Local Morón</div><div className="foot"><div className="ag-av" /><div className="time">hace 3d</div></div></div>
                      </div>
                      <div className="kcol">
                        <div className="kcol-h">Cerrado <span className="kbadge green">3</span></div>
                        <div className="lcard"><div className="name">D. Coronel</div><div className="prop">Depto Belgrano</div><div className="foot"><div className="ag-av" /><div className="time">hace 1w</div></div></div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
            <div className="laptop-base" />
          </div>
        </div>
      </section>

      {/* ===== BENTO FEATURES ===== */}
      <section className="bento-sec" id="features">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="eyebrow">// Plataforma todo-en-uno</span>
              <h2 className="sec-title">Cuatro herramientas en una. <em>Sin integrar nada.</em></h2>
            </div>
            <p className="sec-sub">
              Lo que antes resolvías con múltiples herramientas, planillas y WhatsApp Web, ahora vive en un solo lugar — diseñado para que lo use tu equipo, no un programador.
            </p>
          </div>

          <div className="bento">

            {/* LARGE: Sitio web */}
            <div className="card large">
              <div className="card-tag">/ 01 — Sitio web</div>
              <h3 className="card-h">Sitio web con tu marca, listo en tiempo récord.</h3>
              <p className="card-p">Tres layouts probados: classic-cta, visual-showcase y magazine. Elegís uno y lo personalizás con tu logo, colores y propiedades. SEO impecable, métricas de Google y carga &lt; 1 segundo.</p>
              <div className="layouts-art">
                <div className="mini-site ms-classic">
                  <div className="ms-bar"><i /><i /><i /></div>
                  <div className="ms-hero" />
                  <div className="ms-body">
                    <div className="btn3" /><div className="btn3" /><div className="btn3" />
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, padding: 6, color: '#8A8A8A', letterSpacing: '.1em' }}>CLASSIC-CTA</div>
                </div>
                <div className="mini-site ms-visual">
                  <div className="ms-bar"><i /><i /><i /></div>
                  <div className="ms-hero" />
                  <div className="ms-body">
                    <div className="row"><div className="thumb" /><div className="thumb" /><div className="thumb" /></div>
                    <div className="bar med" /><div className="bar short" />
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, padding: 6, color: '#8A8A8A', letterSpacing: '.1em' }}>VISUAL-SHOWCASE</div>
                </div>
                <div className="mini-site ms-mag">
                  <div className="ms-bar"><i /><i /><i /></div>
                  <div className="ms-hero"><div className="big" /><div className="col"><div className="sq" /><div className="sq" /></div></div>
                  <div className="ms-body">
                    <div className="bar med" /><div className="bar short" /><div className="bar" />
                  </div>
                  <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, padding: 6, color: '#8A8A8A', letterSpacing: '.1em' }}>MAGAZINE</div>
                </div>
              </div>
            </div>

            {/* MEDIUM: CRM */}
            <div className="card">
              <div className="card-tag">/ 02 — CRM</div>
              <h3 className="card-h">Kanban de leads.</h3>
              <p className="card-p">Arrastrá un lead de &quot;Nuevo&quot; a &quot;Visita agendada&quot; sin pensarlo. Auto-asignación por agente y recordatorios.</p>
              <div className="crm-art">
                <div className="crm-col">
                  <h6>Nuevo <span className="b">5</span></h6>
                  <div className="crm-pip"><div className="n">M. González</div><div className="m">PH Caballito</div></div>
                  <div className="crm-pip"><div className="n">L. Acosta</div><div className="m">Casa Morón</div></div>
                </div>
                <div className="crm-col">
                  <h6 className="b1">Contactado <span className="b">6</span></h6>
                  <div className="crm-pip"><div className="n">C. Rodríguez</div><div className="m">Depto 3amb</div></div>
                  <div className="crm-pip"><div className="n">R. Fernández</div><div className="m">PH Flores</div></div>
                </div>
                <div className="crm-col">
                  <h6 className="b2">Interesado <span className="b">4</span></h6>
                  <div className="crm-pip"><div className="n">S. Méndez</div><div className="m">Casa Castelar</div></div>
                  <div className="crm-pip"><div className="n">P. Torres</div><div className="m">Local Morón</div></div>
                </div>
              </div>
            </div>

            {/* MEDIUM: WhatsApp */}
            <div className="card" style={{ background: 'linear-gradient(180deg,#FBF7EE 0%,#F4ECD9 100%)' }}>
              <div className="card-tag">/ 03 — WhatsApp</div>
              <h3 className="card-h">WhatsApp integrado.</h3>
              <p className="card-p">Cada conversación se guarda como lead. Respuestas automáticas con IA fuera de horario.</p>
              <div className="wa-art">
                <div className="wa-msg wa-in">
                  ¡Hola! Vi el aviso del depto en Palermo. ¿Sigue disponible?
                  <span className="wa-time">10:42</span>
                </div>
                <div className="wa-msg wa-out">
                  ¡Hola Mariana! Sí, sigue disponible. ¿Querés que coordinemos una visita esta semana?
                  <span className="wa-time">10:43 ✓✓</span>
                </div>
                <div className="wa-typing"><i /><i /><i /></div>
              </div>
            </div>

            {/* WIDE: QR */}
            <div className="card wide">
              <div>
                <div className="card-tag">/ 04 — QR físico</div>
                <h3 className="card-h">QR para tus carteles &quot;EN VENTA&quot;. Convertí la calle en leads medibles.</h3>
                <p className="card-p">Cada propiedad lleva su QR único. Escaneo → ficha web → lead capturado, con métricas de escaneos por cartel y horario.</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
                  <span className="pill" style={{ background: 'rgba(78,205,196,.15)', color: '#4ECDC4' }}>↗ 3.2x más consultas vs. cartel sin QR</span>
                </div>
              </div>
              <div className="qr-art">
                <div className="sign">
                  <div className="sign-top">EN VENTA</div>
                  <div className="sign-body">
                    <div className="sign-info">
                      <b>Depto 2 amb.</b>
                      <span>Av. Santa Fe 4200, Palermo</span>
                      <div className="price">USD 113.200</div>
                    </div>
                    <div className="qr">
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                        <rect width="100" height="100" fill="white" />
                        <g fill="black">
                          <rect x="5" y="5" width="22" height="22" /><rect x="73" y="5" width="22" height="22" /><rect x="5" y="73" width="22" height="22" />
                        </g>
                        <g fill="white">
                          <rect x="9" y="9" width="14" height="14" /><rect x="77" y="9" width="14" height="14" /><rect x="9" y="77" width="14" height="14" />
                        </g>
                        <g fill="black">
                          <rect x="13" y="13" width="6" height="6" /><rect x="81" y="13" width="6" height="6" /><rect x="13" y="81" width="6" height="6" />
                          <rect x="33" y="5" width="4" height="4" /><rect x="41" y="5" width="4" height="4" /><rect x="49" y="5" width="4" height="4" /><rect x="57" y="5" width="4" height="4" /><rect x="65" y="5" width="4" height="4" />
                          <rect x="33" y="13" width="4" height="4" /><rect x="45" y="13" width="4" height="4" /><rect x="57" y="13" width="4" height="4" /><rect x="65" y="13" width="4" height="4" />
                          <rect x="29" y="21" width="4" height="4" /><rect x="37" y="21" width="4" height="4" /><rect x="49" y="21" width="4" height="4" /><rect x="61" y="21" width="4" height="4" />
                          <rect x="5" y="33" width="4" height="4" /><rect x="13" y="33" width="4" height="4" /><rect x="21" y="33" width="4" height="4" /><rect x="29" y="33" width="4" height="4" /><rect x="41" y="33" width="4" height="4" /><rect x="53" y="33" width="4" height="4" /><rect x="61" y="33" width="4" height="4" /><rect x="73" y="33" width="4" height="4" /><rect x="85" y="33" width="4" height="4" />
                          <rect x="9" y="41" width="4" height="4" /><rect x="17" y="41" width="4" height="4" /><rect x="33" y="41" width="4" height="4" /><rect x="45" y="41" width="4" height="4" /><rect x="57" y="41" width="4" height="4" /><rect x="69" y="41" width="4" height="4" /><rect x="81" y="41" width="4" height="4" /><rect x="93" y="41" width="4" height="4" />
                          <rect x="5" y="49" width="4" height="4" /><rect x="21" y="49" width="4" height="4" /><rect x="29" y="49" width="4" height="4" /><rect x="41" y="49" width="4" height="4" /><rect x="53" y="49" width="4" height="4" /><rect x="65" y="49" width="4" height="4" /><rect x="77" y="49" width="4" height="4" /><rect x="85" y="49" width="4" height="4" />
                          <rect x="13" y="57" width="4" height="4" /><rect x="25" y="57" width="4" height="4" /><rect x="37" y="57" width="4" height="4" /><rect x="49" y="57" width="4" height="4" /><rect x="61" y="57" width="4" height="4" /><rect x="73" y="57" width="4" height="4" /><rect x="81" y="57" width="4" height="4" /><rect x="89" y="57" width="4" height="4" />
                          <rect x="9" y="65" width="4" height="4" /><rect x="21" y="65" width="4" height="4" /><rect x="33" y="65" width="4" height="4" /><rect x="45" y="65" width="4" height="4" /><rect x="57" y="65" width="4" height="4" /><rect x="69" y="65" width="4" height="4" /><rect x="81" y="65" width="4" height="4" />
                          <rect x="33" y="73" width="4" height="4" /><rect x="41" y="73" width="4" height="4" /><rect x="49" y="73" width="4" height="4" /><rect x="57" y="73" width="4" height="4" /><rect x="65" y="73" width="4" height="4" />
                          <rect x="29" y="81" width="4" height="4" /><rect x="41" y="81" width="4" height="4" /><rect x="53" y="81" width="4" height="4" /><rect x="65" y="81" width="4" height="4" /><rect x="77" y="81" width="4" height="4" /><rect x="89" y="81" width="4" height="4" />
                          <rect x="33" y="89" width="4" height="4" /><rect x="45" y="89" width="4" height="4" /><rect x="57" y="89" width="4" height="4" /><rect x="69" y="89" width="4" height="4" /><rect x="85" y="89" width="4" height="4" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="stats-floats">
                  <b>148</b><span>Escaneos · 30d</span>
                </div>
                <div className="stats-floats bottom">
                  <b>23</b><span>Leads del cartel</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== THEMES ===== */}
      <section className="themes-sec" id="themes">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="eyebrow">// 3 estilos, un solo motor</span>
              <h2>Una web que se ve <em>cara.</em></h2>
              <p className="sec-sub">Elegí el estilo que va con tu marca. Los tres comparten el mismo motor: propiedades, mapa, CRM y carga desde un panel. Cambiás de tema sin perder nada.</p>
            </div>
          </div>
          <div className="themes-grid">
            {THEMES_DATA.map(t => (
              <a className="theme-card" href={t.href} target="_blank" rel="noreferrer" key={t.id}>
                <div className="theme-prev" style={{ background: t.bg }}>
                  <div className="theme-prev-bar"><span /><span /><span /></div>
                  <div className="theme-prev-body">
                    <div className="theme-prev-h" style={{ fontFamily: t.font, color: t.ink }}>{t.sample}</div>
                    <div className="theme-prev-accent" style={{ background: t.accent }} />
                    <div className="theme-prev-cards">
                      <span style={{ borderColor: t.line }} /><span style={{ borderColor: t.line }} /><span style={{ borderColor: t.line }} />
                    </div>
                  </div>
                </div>
                <div className="theme-meta">
                  <div className="theme-name">
                    <b>{t.name}</b>
                    <div className="theme-dots">{t.palette.map((c, i) => <span key={i} style={{ background: c }} />)}</div>
                  </div>
                  <p>{t.desc}</p>
                  <span className="theme-link">Ver demo en vivo <ArrowRight /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARATIVA ===== */}
      <section className="compare-sec">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="eyebrow">// Honestidad brutal</span>
              <h2 className="sec-title">NIMO vs. <em>cómo lo hacés hoy.</em></h2>
            </div>
            <p className="sec-sub">
              Comparativa real contra los dos stacks más usados por inmobiliarias argentinas: CMS armado por un freelancer, y Tokko Broker.
            </p>
          </div>

          <div className="compare-table">
            <div className="compare-row compare-head">
              <div className="compare-cell" />
              <div className="compare-cell nimo"><span className="col-name" style={{ color: 'white' }}>NIMO</span></div>
              <div className="compare-cell"><span className="col-name">CMS + plugins</span></div>
              <div className="compare-cell"><span className="col-name">Tokko Broker</span></div>
            </div>
            {[
              { label: 'Diseño del sitio público', detail: 'Cómo se ve para el cliente final', nimo: { type: 'yes', text: '3 layouts premium curados' }, cms: { type: 'mid', text: 'Depende del theme' }, tokko: { type: 'no', text: 'Templates 2014' } },
              { label: 'Velocidad de carga', detail: 'Tiempo hasta primera vista útil', nimo: { type: 'yes', text: '< 1s · 95+ PageSpeed' }, cms: { type: 'mid', text: '3–6s típico' }, tokko: { type: 'no', text: '4–8s' } },
              { label: 'CRM con Kanban + WhatsApp', detail: 'Gestionar leads sin salir del panel', nimo: { type: 'yes', text: 'Nativo, drag & drop' }, cms: { type: 'no', text: 'No incluido' }, tokko: { type: 'mid', text: 'Solo listado básico' } },
              { label: 'Respuestas con IA', detail: 'Auto-respuesta fuera de horario en WhatsApp', nimo: { type: 'yes', text: 'Incluido en Pro+' }, cms: { type: 'no', text: 'No disponible' }, tokko: { type: 'no', text: 'No disponible' } },
              { label: 'Soporte en español', detail: 'Atención humana, no chatbot', nimo: { type: 'yes', text: 'WhatsApp directo, <1h' }, cms: { type: 'no', text: 'Buscás un freelance' }, tokko: { type: 'mid', text: 'Tickets por email' } },
              { label: 'Precio total mensual', detail: 'Hosting + CMS + CRM + WhatsApp', nimo: { type: 'yes', text: 'Desde USD 29/mes, todo' }, cms: { type: 'mid', text: 'USD 60+ sumando piezas' }, tokko: { type: 'mid', text: 'USD 49/mes (solo CRM)' } },
            ].map((row) => (
              <div className="compare-row" key={row.label}>
                <div className="compare-cell cat">
                  {row.label}
                  <small className="compare-detail" style={{ display: 'block', width: '100%' }}>{row.detail}</small>
                </div>
                <CompareCell type={row.nimo.type as 'yes' | 'no' | 'mid'} text={row.nimo.text} nimo />
                <CompareCell type={row.cms.type as 'yes' | 'no' | 'mid'} text={row.cms.text} />
                <CompareCell type={row.tokko.type as 'yes' | 'no' | 'mid'} text={row.tokko.text} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="price-sec" id="pricing">
        <div className="container">
          <div className="sec-head">
            <div>
              <span className="eyebrow">// Precios</span>
              <h2 className="sec-title">Un plan para cada tamaño. <em>Sin sorpresas.</em></h2>
            </div>
            <p className="sec-sub">
              Sin permanencia, cancelás cuando quieras. A cada plan se suma una implementación inicial (única vez): dejamos tu sitio, tu CRM y tus propiedades cargados y listos para vender.
            </p>
          </div>
          <div className="price-grid">
            <div className="price-card">
              <div className="price-head">
                <div className="price-name">Starter</div>
                <h3>Empezando</h3>
                <p>Inmobiliaria de 1 persona. Empezás con sitio web + hasta 30 propiedades.</p>
              </div>
              <div className="price-amount"><sup>USD</sup>{price('starter')}<span className="per">por mes · facturación mensual</span></div>
              <div className="price-setup">+ USD {setup('starter')} de implementación · pago único</div>
              <ul className="price-feat">
                <li><CheckIcon /> Sitio web (1 layout)</li>
                <li><CheckIcon /> Hasta 30 propiedades</li>
                <li><CheckIcon /> Formulario de contacto</li>
                <li><CheckIcon /> QR para carteles</li>
                <li><CheckIcon /> Soporte por email</li>
              </ul>
              <a className="btn btn-ghost" href="/lopez-asociados/admin/login">Probar 15 días</a>
            </div>
            <div className="price-card featured">
              <div className="badge">Más elegido</div>
              <div className="price-head">
                <div className="price-name featured">Pro</div>
                <h3>El estándar NIMO</h3>
                <p>Inmobiliaria con 2–4 agentes. CRM, WhatsApp y propiedades ilimitadas.</p>
              </div>
              <div className="price-amount"><sup>USD</sup>{price('pro')}<span className="per">por mes · facturación mensual</span></div>
              <div className="price-setup">+ USD {setup('pro')} de implementación · pago único</div>
              <ul className="price-feat">
                <li><CheckIcon /> <b>Todo lo de Starter, más:</b></li>
                <li><CheckIcon /> Los 3 layouts premium</li>
                <li><CheckIcon /> CRM con Kanban</li>
                <li><CheckIcon /> WhatsApp integrado</li>
                <li><CheckIcon /> Auto-respuesta IA</li>
                <li><CheckIcon /> Fichas PDF de marca</li>
              </ul>
              <a className="btn btn-coral" href="/lopez-asociados/admin/login">Probar 15 días</a>
            </div>
            <div className="price-card">
              <div className="price-head">
                <div className="price-name">Business</div>
                <h3>Equipo en crecimiento</h3>
                <p>5+ agentes, reportes, integraciones avanzadas y dominio propio.</p>
              </div>
              <div className="price-amount"><sup>USD</sup>{price('business')}<span className="per">por mes · facturación mensual</span></div>
              <div className="price-setup">+ USD {setup('business')} de implementación · pago único</div>
              <ul className="price-feat">
                <li><CheckIcon /> <b>Todo lo de Pro, más:</b></li>
                <li><CheckIcon /> Hasta 10 agentes</li>
                <li><CheckIcon /> Reportes y comisiones</li>
                <li><CheckIcon /> Dominio personalizado</li>
                <li><CheckIcon /> API + integraciones</li>
              </ul>
              <a className="btn btn-ghost" href="mailto:hola@nimo.app">Hablar con ventas</a>
            </div>
            <div className="price-card" style={{ background: '#0F0F0F', color: 'white', borderColor: '#1F1F1F' }}>
              <div className="price-head">
                <div className="price-name" style={{ color: '#FFD93D' }}>Enterprise</div>
                <h3 style={{ color: 'white' }}>A medida</h3>
                <p style={{ color: 'rgba(255,255,255,.7)' }}>Cadenas, franquicias y operaciones multi-sucursal. White-label disponible.</p>
              </div>
              <div className="price-amount" style={{ color: 'white' }}>
                A medida<span className="per" style={{ color: 'rgba(255,255,255,.5)' }}>Hablemos de tu operación</span>
              </div>
              <div className="price-setup" style={{ color: 'rgba(255,255,255,.55)' }}>Implementación a medida · incluida en la propuesta</div>
              <ul className="price-feat">
                <li style={{ color: 'rgba(255,255,255,.8)' }}><CheckIconYellow /> Agentes ilimitados</li>
                <li style={{ color: 'rgba(255,255,255,.8)' }}><CheckIconYellow /> Multi-sucursal</li>
                <li style={{ color: 'rgba(255,255,255,.8)' }}><CheckIconYellow /> SSO + auditoría</li>
                <li style={{ color: 'rgba(255,255,255,.8)' }}><CheckIconYellow /> Soporte dedicado 24/7</li>
                <li style={{ color: 'rgba(255,255,255,.8)' }}><CheckIconYellow /> SLA contractual</li>
              </ul>
              <a className="btn btn-white" href="mailto:hola@nimo.app">Contactar →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="cta-final">
        <div className="container cta-inner">
          <div>
            <h2 className="cta-h">Modernizá tu inmobiliaria <em>esta semana.</em></h2>
            <p className="cta-p">
              15 días gratis. Sin tarjeta de crédito. Migración asistida incluida — vos seguís vendiendo mientras nosotros mudamos las propiedades.
            </p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-white btn-lg" href="/lopez-asociados/admin/login">Acceder a la demo <ArrowRight /></a>
            <span className="micro">o <a href="mailto:hola@nimo.app" style={{ color: 'rgba(255,255,255,.7)' }}>agendá una demo de 20 min →</a></span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <a className="logo" href="#">
                <span className="logo-mark"><span>N</span></span>
                <span className="logo-word">NI<em>MO</em></span>
              </a>
              <p>La plataforma todo-en-uno para inmobiliarias chicas y medianas de Argentina.</p>
              <div className="socials">
                <a href="#" aria-label="Instagram">
                  <svg className="ico" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg className="ico" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4" /></svg>
                </a>
                <a href="#" aria-label="X / Twitter">
                  <svg className="ico" viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" /></svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg className="ico" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3" /><polygon points="10 9 16 12 10 15" fill="currentColor" stroke="none" /></svg>
                </a>
              </div>
            </div>
            <div className="foot-col">
              <h6>Producto</h6>
              <ul>
                <li><a href="#">Sitio web</a></li>
                <li><a href="#">CRM con Kanban</a></li>
                <li><a href="#">WhatsApp</a></li>
                <li><a href="#">QR para carteles</a></li>
                <li><a href="#">Fichas PDF</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h6>Empresa</h6>
              <ul>
                <li><a href="#">Nosotros</a></li>
                <li><a href="#">Clientes</a></li>
                <li><a href="#">Trabajá con nosotros</a></li>
                <li><a href="#">Prensa</a></li>
              </ul>
            </div>
            <div className="foot-col" id="recursos">
              <h6>Recursos</h6>
              <ul>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Guías para inmobiliarias</a></li>
                <li><a href="#">Centro de ayuda</a></li>
                <li><a href="#">Migrar desde Tokko</a></li>
                <li><a href="#">Migrar desde otra plataforma</a></li>
              </ul>
            </div>
            <div className="foot-col">
              <h6>Legal</h6>
              <ul>
                <li><a href="#">Términos</a></li>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <small>© 2026 NIMO · Buenos Aires, Argentina · Hecho con ♥ para inmobiliarias</small>
            <span className="lang">
              <svg className="ico" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              Español (AR)
              <svg className="ico" viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
