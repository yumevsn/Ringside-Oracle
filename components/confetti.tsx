"use client"

import { useEffect, useState } from "react"

interface ConfettiProps {
  colors: string[]
  show: boolean
  onComplete: () => void
}

export function Confetti({ colors, show, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      vx: number
      vy: number
      color: string
      rotation: number
      rotationSpeed: number
    }>
  >([])

  useEffect(() => {
    if (!show) {
      setParticles([])
      return
    }

    // Create confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }))

    setParticles(newParticles)

    // Animate particles
    const animateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // gravity
            rotation: particle.rotation + particle.rotationSpeed,
          }))
          .filter((particle) => particle.y < window.innerHeight + 10),
      )
    }

    const interval = setInterval(animateParticles, 16)

    // Clean up after 3 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setParticles([])
      onComplete()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [show, colors, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 opacity-80"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
          }}
        />
      ))}
    </div>
  )
}
