import { useState, useEffect, useRef } from 'react'
import { formatCompactNumber, formatLocalizedNumber } from '../../lib/useSocialStats'

const AnimatedCounter = ({ end, duration = 2000, suffix = '', compact = false, localized = false }: { end: number; duration?: number; suffix?: string; compact?: boolean; localized?: boolean }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  const display = compact
    ? formatCompactNumber(count)
    : localized
    ? formatLocalizedNumber(count)
    : count.toString()
  return <div ref={ref}>{display}{suffix}</div>
}

export default AnimatedCounter
