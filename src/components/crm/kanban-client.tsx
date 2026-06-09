'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KanbanColumn {
  id: string
  label: string
  color: string
}

export interface KanbanCard {
  id: string
  column: string
  title: string
  subtitle?: string
  meta?: string
  tag?: string
  tagColor?: string
  badge?: string
  badgeColor?: string
  phone?: string
  notes?: KanbanNote[]
}

export interface KanbanNote {
  id: string
  text: string
  author: string
  date: string
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const P = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  orange: '#FF6B6B', red: '#E74C3C',
}

// ─── Sortable Card ───────────────────────────────────────────────────────────

function SortableCard({
  card, colColor, onMenuOpen, onCardOpen, isDragging,
}: {
  card: KanbanCard
  colColor: string
  onMenuOpen: (cardId: string, anchor: DOMRect) => void
  onCardOpen: (card: KanbanCard) => void
  isDragging?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CardBody
        card={card}
        colColor={colColor}
        onMenuOpen={onMenuOpen}
        onCardOpen={onCardOpen}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

function CardBody({
  card, colColor, onMenuOpen, onCardOpen, dragHandleProps = {},
}: {
  card: KanbanCard
  colColor: string
  onMenuOpen: (cardId: string, anchor: DOMRect) => void
  onCardOpen: (card: KanbanCard) => void
  dragHandleProps?: Record<string, unknown>
}) {
  return (
    <div
      style={{ background: P.white, border: `1px solid ${P.border}`, borderRadius: 6, padding: '12px 12px 10px', cursor: 'default', userSelect: 'none' }}
    >
      {/* Drag + header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
        {/* Drag handle */}
        <button
          {...dragHandleProps}
          style={{ flexShrink: 0, cursor: 'grab', background: 'none', border: 'none', padding: '2px 0', color: P.ink3, display: 'flex', alignItems: 'center' }}
          title="Arrastrar"
          aria-label="Arrastrar"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <rect x="1" y="1" width="4" height="4" rx="1"/><rect x="7" y="1" width="4" height="4" rx="1"/>
            <rect x="1" y="5.5" width="4" height="4" rx="1"/><rect x="7" y="5.5" width="4" height="4" rx="1"/>
            <rect x="1" y="10" width="4" height="4" rx="1"/><rect x="7" y="10" width="4" height="4" rx="1"/>
          </svg>
        </button>

        {/* Avatar */}
        <div style={{ width: 28, height: 28, borderRadius: 9999, background: colColor + '1A', border: `1.5px solid ${colColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 9, color: colColor, flexShrink: 0 }}>
          {card.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Click title → open side panel */}
          <button
            onClick={() => onCardOpen(card)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: P.ink, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.title}</div>
          </button>
          {card.subtitle && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>{card.subtitle}</div>}
        </div>

        {/* 3-dot menu */}
        <button
          onClick={e => {
            e.stopPropagation()
            onMenuOpen(card.id, (e.currentTarget as HTMLElement).getBoundingClientRect())
          }}
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: P.ink3, padding: '2px 4px', borderRadius: 3, display: 'flex', alignItems: 'center' }}
          aria-label="Opciones"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Meta */}
      {card.meta && (
        <div style={{ fontSize: 11, color: P.ink2, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{card.meta}</div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {card.tag && (
          <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 8, letterSpacing: '.04em', textTransform: 'uppercase', background: (card.tagColor ?? colColor) + '15', color: card.tagColor ?? colColor, padding: '2px 7px', borderRadius: 2 }}>{card.tag}</span>
        )}
        {card.badge && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, background: P.bg, color: P.ink3, padding: '2px 7px', borderRadius: 2, border: `1px solid ${P.border}` }}>{card.badge}</span>
        )}
        {card.notes && card.notes.length > 0 && (
          <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3 }}>{card.notes.length} nota{card.notes.length !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  )
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function SidePanel({
  card, colColor, onClose,
}: {
  card: KanbanCard | null
  colColor: string
  onClose: () => void
}) {
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState<KanbanNote[]>(card?.notes ?? [])

  if (!card) return null

  const addNote = () => {
    if (!newNote.trim()) return
    const note: KanbanNote = {
      id: `note-${Date.now()}`,
      text: newNote.trim(),
      author: 'Superadmin',
      date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    setNotes(prev => [note, ...prev])
    setNewNote('')
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.25)', zIndex: 200 }} />

      {/* Panel */}
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 400, background: P.white, borderLeft: `1px solid ${P.border}`, zIndex: 201, display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9999, background: colColor + '18', border: `1.5px solid ${colColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 11, color: colColor, flexShrink: 0 }}>
                {card.title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 15, color: P.ink, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{card.title}</div>
                {card.subtitle && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{card.subtitle}</div>}
              </div>
            </div>
            {card.tag && <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 9, letterSpacing: '.05em', textTransform: 'uppercase', background: colColor + '12', color: colColor, padding: '3px 9px', borderRadius: 2 }}>{card.tag}</span>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.ink3, flexShrink: 0, fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Notes log */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 16 }}>// LOG DE NOTAS</div>

          {notes.length === 0 && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.ink3, textAlign: 'center', padding: '32px 0', textTransform: 'uppercase', letterSpacing: '.1em' }}>Sin notas aún</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notes.map((note) => (
              <div key={note.id} style={{ background: P.bg, border: `1px solid ${P.border}`, borderRadius: 4, padding: '12px 14px' }}>
                <div style={{ fontSize: 13, color: P.ink, lineHeight: 1.5, marginBottom: 8 }}>{note.text}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{note.author}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3 }}>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add note input */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${P.border}`, background: P.bg }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>AGREGAR NOTA</div>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Escribí una nota..."
            rows={3}
            style={{ width: '100%', background: P.white, border: `1px solid ${P.border}`, borderRadius: 4, padding: '10px 12px', fontSize: 13, color: P.ink, fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addNote() }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3 }}>⌘ + Enter para guardar</span>
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', background: newNote.trim() ? P.ink : P.border, color: newNote.trim() ? P.bg : P.ink3, border: 'none', borderRadius: 3, padding: '8px 14px', cursor: newNote.trim() ? 'pointer' : 'not-allowed' }}
            >
              GUARDAR →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Context Menu ─────────────────────────────────────────────────────────────

function ContextMenu({
  cardId, anchor, onEdit, onDelete, onClose,
}: {
  cardId: string
  anchor: DOMRect
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const menuItems = [
    { label: 'Abrir detalle', action: () => onEdit(cardId) },
    { label: 'Editar', action: () => onEdit(cardId) },
    { label: 'Eliminar', action: () => onDelete(cardId), danger: true },
  ]

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
      <div style={{
        position: 'fixed',
        top: anchor.bottom + 4,
        left: Math.min(anchor.left, window.innerWidth - 180),
        background: P.white,
        border: `1px solid ${P.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        zIndex: 101,
        minWidth: 160,
        boxShadow: '0 8px 24px rgba(0,0,0,.1)',
      }}>
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => { item.action(); onClose() }}
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: item.danger ? P.red : P.ink, fontFamily: 'inherit', borderBottom: i < menuItems.length - 1 ? `1px solid ${P.border}` : 'none' }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}

// ─── Main KanbanBoard Component ───────────────────────────────────────────────

interface KanbanBoardProps {
  columns: KanbanColumn[]
  initialCards: KanbanCard[]
  onCardMove?: (cardId: string, newColumn: string) => void
  emptyLabel?: string
  addLabel?: string
}

export default function KanbanBoard({ columns, initialCards, onCardMove, addLabel = '+ Agregar' }: KanbanBoardProps) {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [menu, setMenu] = useState<{ cardId: string; anchor: DOMRect } | null>(null)
  const [sidePanel, setSidePanel] = useState<KanbanCard | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const getCard = (id: string) => cards.find(c => c.id === id)
  const getColColor = (colId: string) => columns.find(c => c.id === colId)?.color ?? P.orange

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id))
  }, [])

  const handleDragOver = useCallback((e: DragOverEvent) => {
    const { active, over } = e
    if (!over) return
    const activeCard = cards.find(c => c.id === active.id)
    if (!activeCard) return

    const overId = String(over.id)
    const overIsColumn = columns.some(c => c.id === overId)
    const overCard = cards.find(c => c.id === overId)
    const newColumn = overIsColumn ? overId : (overCard?.column ?? activeCard.column)

    if (newColumn !== activeCard.column) {
      setCards(prev => prev.map(c => c.id === active.id ? { ...c, column: newColumn } : c))
    }
  }, [cards, columns])

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over) return

    const activeCard = cards.find(c => c.id === active.id)
    if (!activeCard) return

    setCards(prev => {
      const colCards = prev.filter(c => c.column === activeCard.column)
      const activeIdx = colCards.findIndex(c => c.id === active.id)
      const overIdx = colCards.findIndex(c => c.id === over.id)
      if (activeIdx !== -1 && overIdx !== -1 && activeIdx !== overIdx) {
        const sorted = arrayMove(colCards, activeIdx, overIdx)
        const others = prev.filter(c => c.column !== activeCard.column)
        return [...others, ...sorted]
      }
      return prev
    })

    onCardMove?.(String(active.id), activeCard.column)
  }, [cards, onCardMove])

  const handleDelete = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id))
  }, [])

  const activeCard = activeId ? getCard(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start' }}>
        {columns.map(col => {
          const colCards = cards.filter(c => c.column === col.id)
          return (
            <div key={col.id} style={{ minWidth: 230, maxWidth: 250, flexShrink: 0 }}>
              {/* Column header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, padding: '0 2px' }}>
                <div style={{ width: 6, height: 6, borderRadius: 9999, background: col.color }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.12em', flex: 1 }}>{col.label}</span>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 11, background: P.white, color: P.ink3, padding: '2px 7px', borderRadius: 2, border: `1px solid ${P.border}` }}>{colCards.length}</span>
              </div>

              {/* Drop zone */}
              <SortableContext items={colCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 48 }}>
                  {colCards.map(card => (
                    <SortableCard
                      key={card.id}
                      card={card}
                      colColor={col.color}
                      onMenuOpen={(cardId, anchor) => setMenu({ cardId, anchor })}
                      onCardOpen={c => setSidePanel(c)}
                      isDragging={activeId === card.id}
                    />
                  ))}

                  {colCards.length === 0 && (
                    <div style={{ border: `1.5px dashed ${P.border}`, borderRadius: 6, padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: P.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>Sin leads</div>
                    </div>
                  )}

                  <button style={{ width: '100%', background: 'transparent', border: `1px dashed ${P.border}`, borderRadius: 4, padding: '9px', color: P.ink3, fontSize: 11, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                    {addLabel}
                  </button>
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeCard ? (
          <div style={{ opacity: 0.92, transform: 'rotate(1.5deg)', pointerEvents: 'none' }}>
            <CardBody
              card={activeCard}
              colColor={getColColor(activeCard.column)}
              onMenuOpen={() => {}}
              onCardOpen={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Context menu */}
      {menu && (
        <ContextMenu
          cardId={menu.cardId}
          anchor={menu.anchor}
          onEdit={id => { setSidePanel(cards.find(c => c.id === id) ?? null); setMenu(null) }}
          onDelete={id => { handleDelete(id); setMenu(null) }}
          onClose={() => setMenu(null)}
        />
      )}

      {/* Side panel */}
      {sidePanel && (
        <SidePanel
          card={sidePanel}
          colColor={getColColor(sidePanel.column)}
          onClose={() => setSidePanel(null)}
        />
      )}
    </DndContext>
  )
}
