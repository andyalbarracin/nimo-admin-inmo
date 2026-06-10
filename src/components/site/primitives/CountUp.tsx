'use client'

import NumberFlow from '@number-flow/react'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

interface CountUpProps {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  style?: React.CSSProperties
}

export default function CountUp({ value, suffix = '', prefix = '', decimals = 0, style }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (inView) setDisplayed(value)
  }, [inView, value])

  return (
    <span ref={ref} style={style}>
      {prefix}
      <NumberFlow value={displayed} format={{ maximumFractionDigits: decimals, minimumFractionDigits: decimals }} />
      {suffix}
    </span>
  )
}
