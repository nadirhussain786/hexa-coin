"use client"

import { luxuryGradients } from "@/utils/hexColors"
import { useEffect, useRef } from "react"

export default function HexChaseGameImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw hexagons
    const drawHexagons = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bgGradient.addColorStop(0, "rgba(15, 10, 31, 0.8)")
      bgGradient.addColorStop(1, "rgba(26, 20, 56, 0.8)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some particle effects
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const radius = Math.random() * 1.5
        const opacity = Math.random() * 0.5 + 0.1

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()
      }

      // Draw hexagons
      const hexSize = Math.min(canvas.width, canvas.height) / 10
      const hexHeight = hexSize * Math.sqrt(3)
      const rows = 5
      const cols = 7

      // Center the grid
      const gridWidth = cols * hexSize * 1.5
      const gridHeight = rows * hexHeight
      const startX = (canvas.width - gridWidth) / 2 + hexSize
      const startY = (canvas.height - gridHeight) / 2 + hexHeight / 2

      // Draw hexagons
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Offset every other row
          const offset = row % 2 === 0 ? 0 : hexSize * 0.75
          const x = startX + col * hexSize * 1.5 + offset
          const y = startY + row * hexHeight * 0.75

          // Skip some hexagons randomly to create an interesting pattern
          if (Math.random() > 0.7) continue

          // Choose a random gradient from our luxury gradients
          
          const gradientIndex = Math.floor(Math.random() * luxuryGradients.length)
          const [color1, color2] = luxuryGradients[gradientIndex]

          // Create gradient for this hexagon
          const gradient = ctx.createLinearGradient(
            x - hexSize / 2,
            y - hexHeight / 2,
            x + hexSize / 2,
            y + hexHeight / 2,
          )
          gradient.addColorStop(0, color1)
          gradient.addColorStop(1, color2)

          // Draw hexagon
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i
            const hx = x + (hexSize / 2) * Math.cos(angle)
            const hy = y + (hexSize / 2) * Math.sin(angle)

            if (i === 0) {
              ctx.moveTo(hx, hy)
            } else {
              ctx.lineTo(hx, hy)
            }
          }
          ctx.closePath()

          // Fill with gradient
          ctx.fillStyle = gradient
          ctx.fill()

          // Add a subtle border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
          ctx.lineWidth = 1
          ctx.stroke()

          // Add a glow effect to some hexagons
          if (Math.random() > 0.7) {
            ctx.shadowColor = color1
            ctx.shadowBlur = 15
            ctx.stroke()
            ctx.shadowBlur = 0
          }

          // Add some text or icons to some hexagons
          if (Math.random() > 0.8) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
            ctx.font = `${hexSize / 4}px Arial`
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"

            // Randomly choose between HXCO, TON, or a symbol
            const symbols = ["HXCO", "TON", "+", "⭐", "💎"]
            const symbol = symbols[Math.floor(Math.random() * symbols.length)]
            ctx.fillText(symbol, x, y)
          }
        }
      }

      // Add a subtle vignette effect
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.5,
      )
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)")
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.5)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add a title overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50)

      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Hex Chase", canvas.width / 2, canvas.height - 25)

      // Add a subtle glow to the title
      ctx.shadowColor = "#7B3FE4"
      ctx.shadowBlur = 10
      ctx.fillText("Hex Chase", canvas.width / 2, canvas.height - 25)
      ctx.shadowBlur = 0
    }

    // Initial draw
    drawHexagons()

    // Redraw on resize
    window.addEventListener("resize", drawHexagons)

    // Animation loop for subtle movement
    let animationFrame: number
    const animate = () => {
      // Redraw every few seconds for subtle animation
      setTimeout(() => {
        drawHexagons()
        animationFrame = requestAnimationFrame(animate)
      }, 3000)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("resize", drawHexagons)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-cover" style={{ display: "block" }} />
    </div>
  )
}
