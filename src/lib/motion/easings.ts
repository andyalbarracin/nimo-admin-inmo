/*
 * Archivo: easings.ts
 * Ruta: src/lib/motion/easings.ts
 * Creado: 2026-06-06
 * Descripción: Funciones de easing predefinidas para Framer Motion.
 *              Fuente: .docs/10-design-system.md — sección 9.1.
 *
 * Usar SIEMPRE estos easings. No definir curvas ad-hoc en los componentes.
 */

import type { SpringOptions } from 'framer-motion'

/**
 * Colección de easings de NIMO.
 *
 * - out: easeOut bien definido. Para la mayoría de las animaciones de entrada.
 * - inOut: smooth, para transiciones de página o cambios de estado relevantes.
 * - spring: spring response para hover/interacciones táctiles.
 */
export const easings = {
  /** easeOut pronunciado: [0.16, 1, 0.3, 1] */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],

  /** Suave bidireccional: [0.65, 0, 0.35, 1] */
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],

  /** Spring natural para interacciones (hover, drag) */
  spring: {
    type: 'spring',
    stiffness: 350,
    damping: 30,
  } satisfies SpringOptions & { type: 'spring' },
}
