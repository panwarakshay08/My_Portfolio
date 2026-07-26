'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/EducationSection.module.css'

const EDUCATION = profile.education
const CERTIFICATIONS = profile.certifications
const EDUCATION_PROFILE = profile.educationProfile

export default function EducationSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardRefs = useRef([])
  const focusRefs = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const scroller = document.querySelector('main')
    if (!section || !scroller) return

    let isActive = false

    function resetAnim() {
      gsap.killTweensOf([titleRef.current, ...cardRefs.current, ...focusRefs.current])
      gsap.set(titleRef.current, { opacity: 0, y: 28 })
      gsap.set(cardRefs.current, { opacity: 0, y: 34, rotateX: 12, transformPerspective: 900 })
      gsap.set(focusRefs.current, { opacity: 0, y: 16 })
    }

    function playAnim() {
      resetAnim()
      const tl = gsap.timeline()
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
        .to(cardRefs.current, { opacity: 1, y: 0, rotateX: 0, duration: 0.65, stagger: 0.12, ease: 'power3.out' }, '-=0.25')
        .to(focusRefs.current, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out' }, '-=0.3')
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.55
      if (inRange && !isActive) { isActive = true; playAnim() }
      if (!inRange && isActive) { isActive = false; resetAnim() }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Education</span>
        <span className={styles.labelRight}>Foundation + continuous learning</span>
      </div>

      <div className={styles.content}>
        <div ref={titleRef} className={styles.titleBlock}>
          <p className={styles.eyebrow}>{EDUCATION_PROFILE.eyebrow}</p>
          <h2 className={styles.heading}>{EDUCATION_PROFILE.heading}</h2>
          <p className={styles.summary}>{EDUCATION_PROFILE.summary}</p>
        </div>

        <div className={styles.grid}>
          {EDUCATION.map((item, i) => (
            <article
              key={`${item.degree}-${item.school}`}
              ref={el => { cardRefs.current[i] = el }}
              className={styles.card}
            >
              <span className={styles.cardKicker}>Degree</span>
              <h3 className={styles.cardTitle}>{item.degree}</h3>
              <p className={styles.school}>{item.school}</p>
              <div className={styles.metaRow}>
                <span>{item.location}</span>
                <span>{item.period}</span>
              </div>
            </article>
          ))}

          <article
            ref={el => { cardRefs.current[EDUCATION.length] = el }}
            className={styles.card}
          >
            <span className={styles.cardKicker}>Certification</span>
            <h3 className={styles.cardTitle}>Full Stack Web Development</h3>
            <p className={styles.school}>{CERTIFICATIONS.join(', ')}</p>
            <div className={styles.metaRow}>
              <span>React, APIs, backend fundamentals</span>
            </div>
          </article>
        </div>

        <div className={styles.focusStrip} aria-label="Learning focus areas">
          {EDUCATION_PROFILE.focus.map((item, i) => (
            <span
              key={item}
              ref={el => { focusRefs.current[i] = el }}
              className={styles.focusPill}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
