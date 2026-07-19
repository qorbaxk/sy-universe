import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { getCelestialBody } from '@/entities/portfolio/model/celestial'
import { theme } from '@/shared/config/theme'
import type { GraphNode } from '@/entities/portfolio'
import { createPlanetTexture } from './createPlanetTexture'

export function createGraphNodeObject(node: GraphNode) {
  const body = getCelestialBody(node.id)
  const group = new THREE.Group()
  const size = body.size
  const color = new THREE.Color(body.color)
  const texture = createPlanetTexture(body.color, body.texture)
  const isSun = body.role === 'sun'

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(size, isSun ? 56 : 48, isSun ? 56 : 48),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.98,
    }),
  )
  group.add(core)

  if (isSun) {
    // 태양 코로나 / 후광 (고리 없이 빛나는 구체)
    const coronaInner = new THREE.Mesh(
      new THREE.SphereGeometry(size * 1.18, 32, 32),
      new THREE.MeshBasicMaterial({
        color: '#ffd27a',
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    )
    group.add(coronaInner)

    const coronaOuter = new THREE.Mesh(
      new THREE.SphereGeometry(size * 1.85, 32, 32),
      new THREE.MeshBasicMaterial({
        color: '#ff9a3c',
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      }),
    )
    group.add(coronaOuter)

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(size * 2.45, 32, 32),
      new THREE.MeshBasicMaterial({
        color: '#ffb347',
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    )
    group.add(halo)

    group.userData = {
      core,
      glow: coronaOuter,
      atmosphere: coronaInner,
      halo,
      baseGlowOpacity: 0.16,
      pulseSpeed: 1.15,
      isSun: true,
    }
  } else {
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(size * 1.12, 32, 32),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    )
    group.add(atmosphere)

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(size * 1.55, 32, 32),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
      }),
    )
    group.add(glow)

    let ring: THREE.Mesh | undefined
    if (body.hasRing) {
      const inner = body.role === 'uranus' ? size * 1.35 : size * 1.5
      const outer = body.role === 'uranus' ? size * 1.85 : size * 2.35
      ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 80),
        new THREE.MeshBasicMaterial({
          color: body.role === 'saturn' ? '#f0d9a0' : '#b7e6e6',
          transparent: true,
          opacity: body.role === 'saturn' ? 0.5 : 0.35,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      ring.rotation.x = Math.PI / 2.35
      ring.rotation.y = body.ringTilt ?? 0.35
      group.add(ring)

      if (body.role === 'saturn') {
        const ringDust = new THREE.Mesh(
          new THREE.RingGeometry(size * 1.65, size * 2.15, 80),
          new THREE.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        )
        ringDust.rotation.copy(ring.rotation)
        group.add(ringDust)
      }
    }

    if (body.hasMoon) {
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(size * 0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#d7e0ea' }),
      )
      moon.position.set(size * 1.55, size * 0.15, size * 0.3)
      group.add(moon)
      group.userData.moon = moon
    }

    group.userData = {
      ...group.userData,
      core,
      glow,
      ring,
      atmosphere,
      baseGlowOpacity: 0.1,
      pulseSpeed: 0.75 + Math.random() * 0.35,
      isSun: false,
    }
  }

  const label = new SpriteText(node.label)
  label.color = theme.colors.ink
  label.backgroundColor = 'rgba(4, 8, 16, 0.45)'
  label.padding = 1.8
  label.borderRadius = 5
  label.textHeight = isSun ? 6.2 : 3.8
  label.position.y = size + (isSun ? 16 : 12)
  group.add(label)

  if (node.subtitle) {
    const subtitle = new SpriteText(node.subtitle)
    subtitle.color = theme.colors.muted
    subtitle.backgroundColor = false
    subtitle.textHeight = 2.5
    subtitle.position.y = size + (isSun ? 9.5 : 6.5)
    group.add(subtitle)
  }

  return group
}

export function pulseGraphNodeObject(object: THREE.Object3D, time: number) {
  const {
    glow,
    ring,
    core,
    moon,
    atmosphere,
    halo,
    baseGlowOpacity,
    pulseSpeed,
    isSun,
  } = object.userData as {
    glow?: THREE.Mesh
    ring?: THREE.Mesh
    core?: THREE.Mesh
    moon?: THREE.Mesh
    atmosphere?: THREE.Mesh
    halo?: THREE.Mesh
    baseGlowOpacity?: number
    pulseSpeed?: number
    isSun?: boolean
  }

  const speed = pulseSpeed ?? 1
  const wave = (Math.sin(time * speed) + 1) / 2

  if (core) {
    core.rotation.y = time * (isSun ? 0.12 : 0.18) * speed
  }

  if (glow) {
    const glowMat = glow.material as THREE.MeshBasicMaterial
    glowMat.opacity = (baseGlowOpacity ?? 0.1) + wave * (isSun ? 0.1 : 0.06)
    if (isSun) {
      glow.scale.setScalar(1 + wave * 0.04)
    }
  }

  if (atmosphere) {
    const atmosphereMat = atmosphere.material as THREE.MeshBasicMaterial
    atmosphereMat.opacity = (isSun ? 0.22 : 0.1) + wave * 0.06
  }

  if (halo) {
    const haloMat = halo.material as THREE.MeshBasicMaterial
    haloMat.opacity = 0.06 + wave * 0.05
    halo.scale.setScalar(1 + wave * 0.05)
  }

  if (ring) {
    const ringMat = ring.material as THREE.MeshBasicMaterial
    ring.rotation.z = time * 0.08
    ring.scale.setScalar(1 + wave * 0.03)
    ringMat.opacity = 0.32 + wave * 0.12
  }

  if (moon) {
    const orbit = time * 0.7
    const radius = Math.hypot(moon.position.x, moon.position.z) || 12
    moon.position.set(
      Math.cos(orbit) * radius,
      Math.sin(orbit * 0.35) * radius * 0.25,
      Math.sin(orbit) * radius,
    )
  }
}
