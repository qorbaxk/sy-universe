import * as THREE from 'three'

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((part) => part + part)
          .join('')
      : value
  const num = Number.parseInt(full, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

export type PlanetTextureStyle = 'sun' | 'gas' | 'rocky' | 'ice' | 'earth'

export function createPlanetTexture(
  baseHex: string,
  style: PlanetTextureStyle = 'rocky',
) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return new THREE.Texture()
  }

  const base = hexToRgb(baseHex)

  if (style === 'sun') {
    const sun = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.05,
      size * 0.5,
      size * 0.5,
      size * 0.5,
    )
    sun.addColorStop(0, '#fff6c8')
    sun.addColorStop(0.25, '#ffd56a')
    sun.addColorStop(0.65, '#ff9a3c')
    sun.addColorStop(1, '#e86a1f')
    ctx.fillStyle = sun
    ctx.fillRect(0, 0, size, size)

    for (let i = 0; i < 40; i += 1) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 240, 180, ${0.05 + Math.random() * 0.12})`
      ctx.arc(
        Math.random() * size,
        Math.random() * size,
        3 + Math.random() * 14,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }

  const gradient = ctx.createRadialGradient(
    size * 0.35,
    size * 0.3,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.55,
  )
  gradient.addColorStop(
    0,
    `rgb(${Math.min(255, base.r + 50)}, ${Math.min(255, base.g + 40)}, ${Math.min(255, base.b + 30)})`,
  )
  gradient.addColorStop(0.55, `rgb(${base.r}, ${base.g}, ${base.b})`)
  gradient.addColorStop(
    1,
    `rgb(${Math.max(0, base.r - 70)}, ${Math.max(0, base.g - 60)}, ${Math.max(0, base.b - 50)})`,
  )
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  if (style === 'earth') {
    ctx.fillStyle = 'rgba(46, 140, 90, 0.35)'
    for (let i = 0; i < 12; i += 1) {
      ctx.beginPath()
      ctx.ellipse(
        Math.random() * size,
        Math.random() * size,
        18 + Math.random() * 30,
        10 + Math.random() * 18,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
    ctx.fillStyle = 'rgba(245,245,245,0.18)'
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath()
      ctx.ellipse(
        Math.random() * size,
        Math.random() * size,
        12 + Math.random() * 20,
        5 + Math.random() * 8,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
  }

  if (style === 'gas') {
    for (let i = 0; i < 22; i += 1) {
      const y = (i / 22) * size
      ctx.fillStyle = `rgba(255,255,255,${0.025 + (i % 3) * 0.02})`
      ctx.fillRect(0, y, size, size / 26)
    }
  }

  if (style === 'rocky' || style === 'ice') {
    for (let i = 0; i < 40; i += 1) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 2 + Math.random() * 10
      ctx.beginPath()
      ctx.fillStyle =
        style === 'ice'
          ? `rgba(220,245,255,${0.08 + Math.random() * 0.12})`
          : `rgba(0,0,0,${0.08 + Math.random() * 0.14})`
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const shade = ctx.createLinearGradient(0, 0, size, size)
  shade.addColorStop(0, 'rgba(255,255,255,0.14)')
  shade.addColorStop(0.45, 'rgba(255,255,255,0)')
  shade.addColorStop(1, 'rgba(0,0,0,0.32)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}
