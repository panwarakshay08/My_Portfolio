'use client'

import { useEffect, useRef, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/Navbar.module.css'
import { FaBars, FaTimes } from 'react-icons/fa'

const PROJECT_SLIDES = profile.projects.length
const EDUCATION_START = 3
const WORK_START = EDUCATION_START + 1
const EXPERIENCE_START = WORK_START + PROJECT_SLIDES
const FREELANCE_START = EXPERIENCE_START + 1
const IMPACT_START = FREELANCE_START + 1
const CONTACT_START = IMPACT_START + 2

const NAV_ITEMS = [
  { label: 'Home',         target: 'home',       idx: 0 },
  { label: 'About',        target: 'about',      idx: 2 },
  { label: 'Education',    target: 'education',  idx: EDUCATION_START },
  { label: 'Work',         target: 'work',       idx: WORK_START },
  { label: 'Experience',   target: 'experience', idx: EXPERIENCE_START },
  { label: 'Freelance',    target: 'freelance',  idx: FREELANCE_START },
  { label: 'Impact',       target: 'impact',     idx: IMPACT_START },
  { label: 'Contact',      target: 'impact',     idx: CONTACT_START, step: 2 },
]

const INDIA_TIME_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'Asia/Calcutta',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
})

function getIndiaTime() {
  return INDIA_TIME_FORMATTER.format(new Date()).toUpperCase()
}

function getNavScrollTop({ target, idx, step = 0 }) {
  const section = document.querySelector(`[data-nav-section="${target}"]`)
  if (section) return section.offsetTop + (step * window.innerHeight)
  return idx * window.innerHeight
}

function scrollToNavItem(item) {
  const scroller = document.querySelector('main')
  if (!scroller) return
  gsap.to(scroller, {
    scrollTop: getNavScrollTop(item),
    duration: 1.0,
    ease: 'power3.inOut',
  })
}

export default function Navbar() {
  const [time,    setTime]    = useState('')   // '' on SSR - avoids hydration mismatch
  const [onIntro, setOnIntro] = useState(true)
  const [onDark,  setOnDark]  = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef   = useRef(null)
  const lastY       = useRef(0)
  const hidden      = useRef(false)
  const stopTimer   = useRef(null)

  // Live clock
  useEffect(() => {
    const tick = () => setTime(getIndiaTime())
    const timer = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(timer)
      clearInterval(id)
    }
  }, [])

  // Auto-hide on scroll-down, reveal on scroll-up or scroll-stop
  useEffect(() => {
    const scroller = document.querySelector('main') ?? window
    const vh = window.innerHeight

    function showNavbar() {
      if (!hidden.current) return
      gsap.to(headerRef.current, { y: '0%', duration: 0.35, ease: 'power2.out' })
      hidden.current = false
    }

    const onScroll = () => {
      const currentY = scroller.scrollTop ?? window.scrollY
      const delta    = currentY - lastY.current

      const sectionIdx = Math.round(currentY / vh)
      setOnIntro(currentY < vh * 0.8)
      setOnDark(sectionIdx >= 3)

      if (delta > 8 && !hidden.current) {
        gsap.to(headerRef.current, { y: '-100%', duration: 0.35, ease: 'power2.inOut' })
        hidden.current = true
      } else if (delta < -6) {
        showNavbar()
      }

      lastY.current = currentY

      // Show navbar 400 ms after scrolling stops
      clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(showNavbar, 400)
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      clearTimeout(stopTimer.current)
    }
  }, [])

  return (
    <>
      <header ref={headerRef} className={`${styles.header} ${onIntro ? styles.introMode : ''} ${onDark ? styles.darkMode : ''}`}>
        <span className={styles.time}>INDIA TIME - {time}</span>

        <NavigationMenu className={styles.navMenu}>
          <NavigationMenuList className="flex gap-6">
            {NAV_ITEMS.map(item => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  className={styles.navLink}
                  onClick={() => scrollToNavItem(item)}
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <a
          href={`mailto:${profile.email}`}
          className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8`}
        >
          Email me
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </header>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className={styles.mobileNavLink}
              onClick={() => {
                scrollToNavItem(item)
                setMenuOpen(false)
              }}
            >
              {item.label}
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className={styles.mobileMailLink}
            onClick={() => setMenuOpen(false)}
          >
            {profile.email}
          </a>
        </div>
      )}
    </>
  )
}
