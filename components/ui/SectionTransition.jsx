'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/ui/SectionTransition.module.css'

const SectionTransition = forwardRef(function SectionTransition(_, ref) {
  const panelRef = useRef(null)
  const indexRef = useRef(null)
  const labelRef = useRef(null)
  const lineRef = useRef(null)
  const timelineRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play({ targetIndex, label, direction, onCovered }) {
      const panel = panelRef.current
      if (!panel) {
        onCovered?.()
        return Promise.resolve()
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        onCovered?.()
        return Promise.resolve()
      }

      timelineRef.current?.kill()
      indexRef.current.textContent = String(targetIndex + 1).padStart(2, '0')
      labelRef.current.textContent = label

      const enterFrom = direction >= 0 ? 100 : -100
      const exitTo = direction >= 0 ? -100 : 100

      return new Promise(resolve => {
        const timeline = gsap.timeline({
          onComplete: () => {
            gsap.set(panel, { visibility: 'hidden' })
            resolve()
          },
        })

        timelineRef.current = timeline
        timeline
          .set(panel, { visibility: 'visible', xPercent: enterFrom })
          .set([indexRef.current, labelRef.current], { opacity: 0, y: 18 })
          .set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
          .to(panel, { xPercent: 0, duration: 0.34, ease: 'power3.inOut' })
          .add(() => onCovered?.())
          .to([indexRef.current, labelRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.035,
            ease: 'power2.out',
          })
          .to(lineRef.current, { scaleX: 1, duration: 0.28, ease: 'power2.out' }, '<')
          .to(panel, { xPercent: exitTo, duration: 0.46, ease: 'power3.inOut' }, '+=0.08')
      })
    },
  }), [])

  useEffect(() => () => timelineRef.current?.kill(), [])

  return (
    <div ref={panelRef} className={styles.panel} aria-hidden="true">
      <span ref={indexRef} className={styles.index}>01</span>
      <div className={styles.copy}>
        <span className={styles.kicker}>Entering system</span>
        <strong ref={labelRef} className={styles.label}>Home</strong>
        <span ref={lineRef} className={styles.line} />
      </div>
    </div>
  )
})

export default SectionTransition
