import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * DottedSurface — suelo 3D estático y relleno.
 * Reemplaza el modelo de puntos original con un PlaneGeometry
 * texturizado con gradiente violet→dark. Sin animación.
 */
export function DottedSurface() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // ── Escena ──────────────────────────────────────────────
    const scene = new THREE.Scene()

    // Misma posición de cámara que el componente original
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    )
    camera.position.set(0, 355, 1220)

    // Renderer transparente (el fondo #070B14 del hero se ve a través)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // ── Textura de gradiente sobre canvas 2D ────────────────
    const texCanvas = document.createElement('canvas')
    texCanvas.width = 1024
    texCanvas.height = 1024
    const ctx = texCanvas.getContext('2d')

    // Base color secundario #6001d1 (rgb 96,1,209)
    ctx.fillStyle = 'rgba(96, 1, 209, 0.85)'
    ctx.fillRect(0, 0, 1024, 1024)

    // Profundidad: oscurecer los bordes para dar volumen al suelo
    const depth = ctx.createRadialGradient(512, 1024, 0, 512, 1024, 1000)
    depth.addColorStop(0,    'rgba(96,  1, 209, 0.0)')
    depth.addColorStop(0.35, 'rgba(60,  1, 160, 0.3)')
    depth.addColorStop(0.65, 'rgba(20,  5,  60, 0.7)')
    depth.addColorStop(1,    'rgba( 7, 11,  20, 0.95)')
    ctx.fillStyle = depth
    ctx.fillRect(0, 0, 1024, 1024)

    // Fade del borde superior (horizonte → transparente)
    const horizonFade = ctx.createLinearGradient(0, 0, 0, 400)
    horizonFade.addColorStop(0,   'rgba(7, 11, 20, 1.0)')
    horizonFade.addColorStop(0.7, 'rgba(7, 11, 20, 0.3)')
    horizonFade.addColorStop(1,   'rgba(7, 11, 20, 0.0)')
    ctx.fillStyle = horizonFade
    ctx.fillRect(0, 0, 1024, 400)

    const texture = new THREE.CanvasTexture(texCanvas)

    // ── Plano horizontal (suelo relleno, sin puntos) ─────────
    const geometry = new THREE.PlaneGeometry(9000, 28000)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 2   // horizontal
    plane.position.y = -80             // nivel del suelo
    plane.position.z = 4000            // desplazado hacia la cámara para mayor largo visible
    scene.add(plane)

    // ── Render único (estático) ──────────────────────────────
    renderer.render(scene, camera)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
