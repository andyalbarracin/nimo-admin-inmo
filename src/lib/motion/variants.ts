/*
 * Archivo: variants.ts
 * Ruta: src/lib/motion/variants.ts
 * Creado: 2026-06-06
 * Descripción: Variants de Framer Motion prearmadas para toda la app.
 *              Fuente: .docs/10-design-system.md — sección 9.2.
 *
 * USO OBLIGATORIO: No crear animaciones ad-hoc fuera de este archivo.
 *                 Usar siempre estas variants para mantener coherencia visual.
 *
 * Ejemplo:
 *   <motion.div variants={fadeUp} initial="initial" animate="animate">
 *     ...
 *   </motion.div>
 */

import type { Variants, Transition } from 'framer-motion'
import { easings } from './easings'

/* ---- Aparición vertical (cards, secciones) ---- */
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: easings.out,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.16 },
  },
}

/* ---- Aparición horizontal (sidebars, sheets, drawers) ---- */
export const slideIn: Variants = {
  initial: {
    opacity: 0,
    x: -16,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: easings.out,
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.16 },
  },
}

/* ---- Aparición desde la derecha (panels laterales) ---- */
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 16,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: easings.out,
    },
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.16 },
  },
}

/* ---- Fade simple (modales overlay, tooltips) ---- */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

/* ---- Escala (popups, notificaciones) ---- */
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: easings.out,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

/* ---- Stagger container (grids bento — envuelve los hijos) ---- */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06, // 60ms entre cada card
      delayChildren: 0.04,   // pequeño delay inicial
    },
  },
}

/* ---- Stagger item (cada hijo en la grilla) — usar junto con staggerContainer ---- */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: easings.out,
    },
  },
}

/* ---- Hover lift (PropertyCard, LeadCard) ---- */
export const lift = {
  whileHover: {
    y: -4,
    transition: easings.spring as Transition,
  },
}

/* ---- Tap feedback (CTAs primarios) ---- */
export const tap = {
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

/* ---- Combinado para cards interactivas (lift + tap) ---- */
export const interactiveCard = {
  ...lift,
  ...tap,
}
