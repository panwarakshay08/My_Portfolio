'use client'

import { useEffect, useMemo, useRef } from 'react'
import styles from '@/styles/ui/LivingSystemsBackground.module.css'

const COLORS = {
  orange: [247, 147, 30],
  cyan: [97, 232, 225],
  green: [126, 242, 154],
  white: [244, 241, 234],
  ink: [36, 24, 16],
}

function makeNode(label, x, y, color = 'orange', weight = 1) {
  return { label, x, y, color, weight }
}

function getScene(activeIndex, projectCount, projectSlide) {
  const experienceStart = 4 + projectCount
  const freelanceStart = experienceStart + 1
  const impactStart = freelanceStart + 1
  const contactStart = impactStart + 2

  if (activeIndex === 0) {
    return {
      key: 'intro',
      theme: 'dark',
      nodes: [
        makeNode('SIGNAL', 0.7, 0.28, 'orange'),
        makeNode('SYSTEM ONLINE', 0.84, 0.48, 'white', 2),
        makeNode('PUNE / INDIA', 0.66, 0.7, 'green'),
      ],
      links: [[0, 1], [1, 2]],
    }
  }

  if (activeIndex === 1) {
    return {
      key: 'hero',
      theme: 'light',
      nodes: [
        makeNode('REACT UI', 0.5, 0.28, 'ink'),
        makeNode('API GATEWAY', 0.66, 0.4, 'orange', 2),
        makeNode('JAVA SERVICES', 0.81, 0.3, 'ink'),
        makeNode('DATA LAYER', 0.78, 0.65, 'ink'),
        makeNode('AI TOOLCHAIN', 0.55, 0.7, 'orange'),
      ],
      links: [[0, 1], [1, 2], [1, 3], [4, 0], [4, 1]],
    }
  }

  if (activeIndex === 2) {
    return {
      key: 'skills',
      theme: 'light',
      nodes: [
        makeNode('ENGINEERING CORE', 0.69, 0.5, 'orange', 3),
        makeNode('JAVA', 0.51, 0.26, 'ink'),
        makeNode('SPRING BOOT', 0.76, 0.23, 'ink'),
        makeNode('REACT', 0.89, 0.42, 'orange'),
        makeNode('NEXT.JS', 0.84, 0.7, 'ink'),
        makeNode('NODE.JS', 0.64, 0.78, 'ink'),
        makeNode('POSTGRESQL', 0.49, 0.65, 'orange'),
        makeNode('AI AGENTS', 0.5, 0.46, 'ink'),
      ],
      links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
    }
  }

  if (activeIndex === 3) {
    return {
      key: 'knowledge',
      theme: 'dark',
      nodes: [
        makeNode('CS FOUNDATION', 0.5, 0.31, 'orange', 2),
        makeNode('WEB SYSTEMS', 0.68, 0.27, 'cyan'),
        makeNode('FULL STACK', 0.76, 0.49, 'orange', 3),
        makeNode('CLOUD DELIVERY', 0.62, 0.72, 'green'),
        makeNode('AI ENGINEERING', 0.84, 0.7, 'white'),
        makeNode('PRODUCT JUDGMENT', 0.9, 0.38, 'cyan'),
      ],
      links: [[0, 1], [1, 2], [0, 2], [2, 3], [3, 4], [2, 4], [2, 5]],
    }
  }

  if (activeIndex >= 4 && activeIndex < experienceStart) {
    const projectLabels = [
      ['GLOBAL PRICE ENGINE', '50K+ SKU FLOW'],
      ['SALT ATTIRE', 'COMMERCE FLOW'],
      ['DFIN EDITOR', 'LIVE DOCUMENT FLOW'],
    ]
    const [project, outcome] = projectLabels[projectSlide] ?? [`PROJECT 0${projectSlide + 1}`, 'PRODUCTION SYSTEM']
    return {
      key: `project-${projectSlide}`,
      theme: 'dark',
      nodes: [
        makeNode(project, 0.7, 0.32, 'orange', 3),
        makeNode('PRODUCT UI', 0.5, 0.52, 'cyan'),
        makeNode('API CONTRACTS', 0.68, 0.58, 'orange', 2),
        makeNode('DATA SERVICES', 0.86, 0.51, 'green', 2),
        makeNode(outcome, 0.78, 0.76, 'white'),
      ],
      links: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 4]],
    }
  }

  if (activeIndex === experienceStart) {
    return {
      key: 'career',
      theme: 'dark',
      nodes: [
        makeNode('CAPGEMINI', 0.15, 0.76, 'white'),
        makeNode('APTARA', 0.37, 0.62, 'cyan'),
        makeNode('WEBOLOGIX', 0.61, 0.45, 'green', 2),
        makeNode('INGRAM MICRO', 0.84, 0.27, 'orange', 3),
      ],
      links: [[0, 1], [1, 2], [2, 3]],
    }
  }

  if (activeIndex === freelanceStart) {
    return {
      key: 'delivery',
      theme: 'dark',
      nodes: [
        makeNode('DISCOVER', 0.47, 0.28, 'orange'),
        makeNode('DESIGN', 0.61, 0.41, 'cyan'),
        makeNode('BUILD', 0.74, 0.57, 'orange', 2),
        makeNode('MEASURE', 0.88, 0.72, 'green'),
      ],
      links: [[0, 1], [1, 2], [2, 3]],
    }
  }

  if (activeIndex >= impactStart && activeIndex < contactStart) {
    const nodes = Array.from({ length: 12 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 12
      const radius = index % 2 ? 0.18 : 0.25
      return makeNode(
        index % 3 === 0 ? 'IMPACT SIGNAL' : '',
        0.7 + Math.cos(angle) * radius,
        0.5 + Math.sin(angle) * radius,
        index % 3 === 0 ? 'orange' : index % 3 === 1 ? 'cyan' : 'green',
        index % 4 === 0 ? 2 : 1,
      )
    })
    return {
      key: `impact-${activeIndex}`,
      theme: 'dark',
      nodes,
      links: nodes.map((_, index) => [index, (index + 1) % nodes.length]),
    }
  }

  return {
    key: 'contact',
    theme: 'dark',
    nodes: [
      makeNode('OPEN CHANNEL', 0.72, 0.5, 'green', 3),
      makeNode('EMAIL', 0.52, 0.28, 'orange'),
      makeNode('GITHUB', 0.88, 0.27, 'cyan'),
      makeNode('LINKEDIN', 0.88, 0.72, 'cyan'),
      makeNode('WHATSAPP', 0.52, 0.73, 'green'),
    ],
    links: [[0, 1], [0, 2], [0, 3], [0, 4]],
  }
}

function rgba(rgb, alpha) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
}

export default function LivingSystemsBackground({ activeIndex, projectCount, projectSlide }) {
  const canvasRef = useRef(null)
  const scene = useMemo(
    () => getScene(activeIndex, projectCount, projectSlide),
    [activeIndex, projectCount, projectSlide],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const pointer = {
      x: window.innerWidth * 0.68,
      y: window.innerHeight * 0.5,
      targetX: window.innerWidth * 0.68,
      targetY: window.innerHeight * 0.5,
    }
    const phases = scene.nodes.map((_, index) => index * 0.79)
    const packets = scene.links.map((link, index) => ({
      link,
      progress: (index * 0.173) % 1,
      speed: 0.00075 + (index % 4) * 0.00018,
    }))

    let width = window.innerWidth
    let height = window.innerHeight
    let rafId
    let visible = !document.hidden
    let lastTime = performance.now()

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.75)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    function scanStrength(x, y) {
      if (coarsePointer) return 0.36
      return Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / 210)
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height)

      pointer.x += (pointer.targetX - pointer.x) * 0.08
      pointer.y += (pointer.targetY - pointer.y) * 0.08

      const lightTheme = scene.theme === 'light'
      const baseLineAlpha = lightTheme ? 0.11 : 0.075

      packets.forEach(packet => {
        const [fromIndex, toIndex] = packet.link
        const from = scene.nodes[fromIndex]
        const to = scene.nodes[toIndex]
        if (!from || !to) return

        const fromX = from.x * width
        const fromY = from.y * height
        const toX = to.x * width
        const toY = to.y * height
        const strength = scanStrength((fromX + toX) / 2, (fromY + toY) / 2)

        ctx.save()
        ctx.strokeStyle = rgba(lightTheme ? COLORS.ink : COLORS.white, baseLineAlpha + strength * 0.2)
        ctx.lineWidth = 1
        ctx.setLineDash(strength > 0.24 ? [] : [3, 7])
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.stroke()
        ctx.setLineDash([])

        if (!reducedMotion) {
          packet.progress = (packet.progress + packet.speed * Math.min(time - lastTime, 32)) % 1
        }
        const x = fromX + (toX - fromX) * packet.progress
        const y = fromY + (toY - fromY) * packet.progress
        const color = COLORS[from.color] ?? COLORS.orange
        ctx.shadowColor = rgba(color, 0.8)
        ctx.shadowBlur = 10
        ctx.fillStyle = rgba(color, 0.42 + strength * 0.4)
        ctx.beginPath()
        ctx.arc(x, y, 1.5 + strength, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      scene.nodes.forEach((node, index) => {
        const x = node.x * width
        const y = node.y * height
        const strength = scanStrength(x, y)
        const pulse = reducedMotion ? 0 : Math.sin(time * 0.0014 + phases[index]) * 1.3
        const color = COLORS[node.color] ?? COLORS.orange
        const radius = 3 + node.weight * 1.8

        ctx.save()
        ctx.shadowColor = rgba(color, 0.72)
        ctx.shadowBlur = strength * 22
        ctx.fillStyle = rgba(color, (lightTheme ? 0.34 : 0.22) + strength * 0.5)
        ctx.beginPath()
        ctx.arc(x, y, radius + pulse, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = rgba(color, 0.12 + strength * 0.34)
        ctx.beginPath()
        ctx.arc(x, y, 14 + node.weight * 4 + pulse, 0, Math.PI * 2)
        ctx.stroke()

        if (node.label && (!coarsePointer || node.weight > 1)) {
          ctx.font = `${strength > 0.2 ? 700 : 500} ${strength > 0.2 ? 10 : 8}px Consolas, monospace`
          ctx.fillStyle = rgba(color, (lightTheme ? 0.48 : 0.3) + strength * 0.55)
          ctx.fillText(node.label, x + 14, y - 10)
        }
        ctx.restore()
      })

      lastTime = time
      if (visible && !reducedMotion) rafId = requestAnimationFrame(draw)
    }

    function onPointerMove(event) {
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
    }

    function onVisibilityChange() {
      visible = !document.hidden
      if (visible && !reducedMotion) {
        lastTime = performance.now()
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(rafId)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (!coarsePointer) window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (reducedMotion) draw(performance.now())
    else rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [scene])

  return (
    <div
      className={`${styles.layer} ${scene.theme === 'light' ? styles.light : styles.dark} ${styles[scene.key.split('-')[0]] ?? ''}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.scanGrid} />
    </div>
  )
}
