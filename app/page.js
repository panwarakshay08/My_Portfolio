'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import Navbar                from '@/components/ui/Navbar'
import LivingSystemsBackground from '@/components/ui/LivingSystemsBackground'
import SectionTransition     from '@/components/ui/SectionTransition'
import VideoIntro            from '@/components/sections/VideoIntro'
import HeroSection           from '@/components/sections/HeroSection'
import AboutSection          from '@/components/sections/AboutSection'
import ProjectsSection       from '@/components/sections/ProjectsSection'
import WorkExperienceSection from '@/components/sections/WorkExperienceSection'
import EducationSection      from '@/components/sections/EducationSection'
import FreelanceSection      from '@/components/sections/FreelanceSection'
import PublicationsFooterSection from '@/components/sections/PublicationsFooterSection'
import ScreenLoader from '@/components/sections/ScreenLoader'
import profile               from '@/data/profile.json'

// Snap: 0=video 1=hero 2=about 3=education 4..(3+projects)=projects, then work-exp, freelance, publications, footer.
const PROJECT_SLIDES = profile.projects.length
const TOTAL          = 9 + PROJECT_SLIDES
const EXPERIENCE_START = 4 + PROJECT_SLIDES
const FREELANCE_START = EXPERIENCE_START + 1
const IMPACT_START = FREELANCE_START + 1
const CONTACT_START = IMPACT_START + 2

function getSectionLabel(index) {
  if (index === 0) return 'Introduction'
  if (index === 1) return 'Home'
  if (index === 2) return 'About'
  if (index === 3) return 'Education'
  if (index >= 4 && index < EXPERIENCE_START) return 'Featured Work'
  if (index === EXPERIENCE_START) return 'Experience'
  if (index === FREELANCE_START) return 'Freelance'
  if (index === IMPACT_START) return 'Impact'
  if (index === IMPACT_START + 1) return 'Engineering Snapshot'
  return 'Contact'
}

export default function Home() {
  const mainRef        = useRef(null)
  const idxRef         = useRef(0)
  const busyRef        = useRef(false)
  const scrollTweenRef = useRef(null)
  const transitionRef  = useRef(null)
  const [showLoader, setShowLoader] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    function goTo(idx, { withTransition = false } = {}) {
      if (idx >= TOTAL) idx = 0
      if (idx < 0)      idx = TOTAL - 1

      if (idx === idxRef.current || busyRef.current) return

      const previousIdx = idxRef.current
      const direction = (
        previousIdx === TOTAL - 1 && idx === 0
          ? 1
          : previousIdx === 0 && idx === TOTAL - 1
            ? -1
            : idx > previousIdx ? 1 : -1
      )

      busyRef.current = true

      // Wheel, touch, CTA, and automatic navigation retain the smooth portfolio
      // movement. The cinematic curtain is reserved for explicit Navbar jumps.
      if (!withTransition) {
        idxRef.current = idx
        setActiveIndex(idx)
        scrollTweenRef.current?.kill()
        scrollTweenRef.current = gsap.to(el, {
          scrollTop: idx * el.clientHeight,
          duration: 1,
          ease: 'power3.inOut',
          onComplete: () => {
            setTimeout(() => { busyRef.current = false }, 180)
          },
        })
        return
      }

      const transition = transitionRef.current?.play({
        targetIndex: idx,
        label: getSectionLabel(idx),
        direction,
        onCovered: () => {
          el.scrollTop = idx * el.clientHeight
          idxRef.current = idx
          setActiveIndex(idx)
        },
      })

      Promise.resolve(transition).finally(() => {
        setTimeout(() => { busyRef.current = false }, 140)
      })
    }

    function onWheel(e) {
      e.preventDefault()
      if (busyRef.current) return
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) { touchY = e.touches[0].clientY }
    function onTouchEnd(e) {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40 || busyRef.current) return
      goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    function onScroll() {
      const nextIndex = Math.max(0, Math.min(TOTAL - 1, Math.round(el.scrollTop / el.clientHeight)))
      if (nextIndex !== idxRef.current && !busyRef.current) {
        if (isMobile) {
          goTo(nextIndex)
        } else {
          idxRef.current = nextIndex
          setActiveIndex(nextIndex)
        }
      }
    }

    function onFooterLoop() {
      if (busyRef.current) return
      goTo(0)
    }

    function onNavigate(event) {
      const targetIndex = Number(event.detail?.index)
      if (!Number.isInteger(targetIndex)) return
      goTo(targetIndex, {
        withTransition: event.detail?.withTransition === true,
      })
    }

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    el.addEventListener('wheel',  onWheel,  { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true  })

    let mTouchY = 0
    function onMobileTouchStart(e) { mTouchY = e.touches[0].clientY }
    function onMobileTouchEnd(e) {
      const dy = mTouchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
      const atTop    = el.scrollTop < 8
      if (dy > 0 && atBottom) goTo(0)
      if (dy < 0 && atTop)    goTo(TOTAL - 1)
    }

    if (!isMobile) {
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    } else {
      el.addEventListener('touchstart', onMobileTouchStart, { passive: true })
      el.addEventListener('touchend',   onMobileTouchEnd,   { passive: true })
    }
    window.addEventListener('footer-loop-back', onFooterLoop)
    window.addEventListener('portfolio:navigate', onNavigate)

    return () => {
      el.removeEventListener('wheel',  onWheel)
      el.removeEventListener('scroll', onScroll)
      if (!isMobile) {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchend',   onTouchEnd)
      } else {
        el.removeEventListener('touchstart', onMobileTouchStart)
        el.removeEventListener('touchend',   onMobileTouchEnd)
      }
      window.removeEventListener('footer-loop-back', onFooterLoop)
      window.removeEventListener('portfolio:navigate', onNavigate)
      scrollTweenRef.current?.kill()
    }
  }, [])

  return (
    <>
      {showLoader && (
        <ScreenLoader onDismiss={() => setShowLoader(false)} />
      )}

      <LivingSystemsBackground
        activeIndex={activeIndex}
        projectCount={PROJECT_SLIDES}
        projectSlide={Math.max(0, Math.min(PROJECT_SLIDES - 1, activeIndex - 4))}
      />
      <SectionTransition ref={transitionRef} />

      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll', overscrollBehavior: 'none' }}>
        <div>
          <div data-nav-section="home">
            <VideoIntro />
          </div>
          <div data-nav-section="hero">
            <HeroSection />
          </div>
          <div data-nav-section="about">
            <AboutSection />
          </div>
          <div data-nav-section="education">
            <EducationSection />
          </div>
          <div data-nav-section="work">
            <ProjectsSection />
          </div>
          <div data-nav-section="experience">
            <WorkExperienceSection />
          </div>
          <div data-nav-section="freelance">
            <FreelanceSection />
          </div>
          <div data-nav-section="impact">
            <PublicationsFooterSection />
          </div>
        </div>
      </main>
    </>
  )
}
