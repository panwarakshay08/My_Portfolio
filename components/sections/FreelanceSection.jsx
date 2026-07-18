'use client'

import { useEffect, useRef } from 'react'
import { FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/FreelanceSection.module.css'

const FREELANCE = profile.freelance

export default function FreelanceSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return

    let isActive = false

    function resetAnim() {
      gsap.killTweensOf(headerRef.current)
      gsap.killTweensOf(cardRefs.current)
      gsap.set(headerRef.current, { opacity: 0, y: 28 })
      cardRefs.current.forEach(card => {
        if (card) gsap.set(card, { opacity: 0, y: 36, rotateX: 10, transformPerspective: 900 })
      })
    }

    function playAnim() {
      resetAnim()
      gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      gsap.to(cardRefs.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.18,
      })
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.75
      if (inRange && !isActive) { isActive = true; playAnim() }
      if (!inRange && isActive) { isActive = false; resetAnim() }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    function onWheel(e) {
      const canScroll = section.scrollHeight > section.clientHeight + 2
      if (!canScroll) return

      const atTop = section.scrollTop <= 0
      const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 2
      const movingDown = e.deltaY > 0

      if ((movingDown && !atBottom) || (!movingDown && !atTop)) {
        e.stopPropagation()
      }
    }

    section.addEventListener('wheel', onWheel, { capture: true })
    return () => section.removeEventListener('wheel', onWheel, { capture: true })
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgGrid} aria-hidden />
      <span className={styles.watermark} aria-hidden>CLIENTS</span>

      <div ref={headerRef} className={styles.header}>
        <span className={styles.eyebrow}>{FREELANCE.eyebrow}</span>
        <div className={styles.headerGrid}>
          <h2 className={styles.heading}>{FREELANCE.heading}</h2>
          <p className={styles.summary}>{FREELANCE.summary}</p>
        </div>

        <div className={styles.stats} aria-label="Freelance highlights">
          {FREELANCE.stats.map(stat => (
            <div key={stat.label} className={styles.stat}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cards}>
        {FREELANCE.work.map((item, index) => (
          <article
            key={item.title}
            ref={el => { cardRefs.current[index] = el }}
            className={styles.card}
          >
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>0{index + 1}</span>
              <span className={styles.cardType}>{item.type}</span>
            </div>

            <h3 className={styles.cardTitle}>{item.title}</h3>

            <div className={styles.delivered}>
              {item.delivered.map(point => (
                <span key={point} className={styles.deliveredChip}>
                  <FiCheckCircle size={13} />
                  {point}
                </span>
              ))}
            </div>

            <p className={styles.result}>{item.result}</p>

            <div className={styles.feedback}>
              <span className={styles.feedbackLabel}>Client feedback</span>
              <p>{item.feedback}</p>
            </div>

            <span className={styles.cardArrow} aria-hidden>
              <FiArrowUpRight size={18} />
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
