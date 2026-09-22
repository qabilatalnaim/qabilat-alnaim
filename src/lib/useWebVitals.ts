/**
 * useWebVitals — tracks Core Web Vitals metrics
 * Reports LCP, FID, CLS, FCP, TTFB to console (or future analytics endpoint)
 */
import { useEffect } from 'react'

export type WebVital = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB'
export type VitalRating = 'good' | 'needs-improvement' | 'poor'

interface VitalEntry {
  name: WebVital
  value: number
  rating: VitalRating
  id: string
}

const THRESHOLDS: Record<WebVital, [number, number]> = {
  // [good, needs-improvement]
  LCP: [2500, 4000], // ms
  FID: [100, 300], // ms
  CLS: [0.1, 0.25], // score
  FCP: [1800, 3000], // ms
  TTFB: [800, 1800], // ms
}

export function getRating(name: WebVital, value: number): VitalRating {
  const [good, needsImp] = THRESHOLDS[name]
  if (value <= good) return 'good'
  if (value <= needsImp) return 'needs-improvement'
  return 'poor'
}

// Minimal web-vitals shim — no dependency needed for basic metrics
function observeLCP(cb: (entry: VitalEntry) => void) {
  try {
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last = entries[entries.length - 1] as PerformanceEntry & {
        renderTime?: number
        loadTime?: number
      }
      if (!last) return
      const value = last.renderTime || last.loadTime || last.startTime
      cb({ name: 'LCP', value, rating: getRating('LCP', value), id: 'lcp' })
    })
    obs.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch {
    // Browser doesn't support
  }
}

function observeFCP(cb: (entry: VitalEntry) => void) {
  try {
    const obs = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-contentful-paint') {
          const value = e.startTime
          cb({ name: 'FCP', value, rating: getRating('FCP', value), id: 'fcp' })
        }
      }
    })
    obs.observe({ type: 'paint', buffered: true })
  } catch {
    // ignore
  }
}

function observeCLS(cb: (entry: VitalEntry) => void) {
  try {
    let cls = 0
    const obs = new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput?: boolean })[]) {
        if (!e.hadRecentInput) cls += e.value
      }
      cb({ name: 'CLS', value: cls, rating: getRating('CLS', cls), id: 'cls' })
    })
    obs.observe({ type: 'layout-shift', buffered: true })
  } catch {
    // ignore
  }
}

function observeTTFB(cb: (entry: VitalEntry) => void) {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (nav) {
      const value = nav.responseStart - nav.requestStart
      cb({ name: 'TTFB', value, rating: getRating('TTFB', value), id: 'ttfb' })
    }
  } catch {
    // ignore
  }
}

export function useWebVitals(onReport?: (entry: VitalEntry) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handler = (entry: VitalEntry) => {
      if (process.env.NODE_ENV === 'development') {
        const emoji = entry.rating === 'good' ? '✅' : entry.rating === 'needs-improvement' ? '⚠️' : '❌'
        console.log(`${emoji} ${entry.name}: ${entry.value.toFixed(0)}ms (${entry.rating})`)
      }
      onReport?.(entry)
    }

    observeLCP(handler)
    observeFCP(handler)
    observeCLS(handler)
    observeTTFB(handler)
  }, [onReport])
}
