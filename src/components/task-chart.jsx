"use client"

import { useRef, useEffect } from "react"

export function TaskChart({ data, labels, title }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    console.log("TaskChart rendering with data:", data)
    if (!canvasRef.current) return
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set proper dimensions for the canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear previous chart
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Set chart dimensions with proper margins
    const margin = { top: 40, right: 20, bottom: 40, left: 40 }
    const chartWidth = rect.width - margin.left - margin.right
    const chartHeight = rect.height - margin.top - margin.bottom

    // Draw chart background
    ctx.fillStyle = "#031233"
    ctx.fillRect(margin.left, margin.top, chartWidth, chartHeight)

    // Draw title
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(title || "Tasks Completed", rect.width / 2, margin.top / 2)

    // Find max value for scaling
    const maxValue = Math.max(...data, 5) // Minimum of 5 for scale

    // Draw Y-axis
    ctx.strokeStyle = "#A7E8D2"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, margin.top + chartHeight)
    ctx.stroke()

    // Draw X-axis
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top + chartHeight)
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight)
    ctx.stroke()

    // Draw Y-axis labels
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"

    for (let i = 0; i <= maxValue; i += Math.ceil(maxValue / 5)) {
      const y = margin.top + chartHeight - (i / maxValue) * chartHeight

      // Draw grid line
      ctx.strokeStyle = "#1E3A5F"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(margin.left, y)
      ctx.lineTo(margin.left + chartWidth, y)
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#FFFFFF"
      ctx.fillText(i.toString(), margin.left - 5, y + 4)
    }

    // Calculate bar width based on available space
    const barWidth = (chartWidth / data.length) * 0.7
    const barSpacing = (chartWidth / data.length) * 0.3

    // Draw bars
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = margin.left + index * (barWidth + barSpacing) + barSpacing
      const y = margin.top + chartHeight - barHeight

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(x, y, x, margin.top + chartHeight)
      gradient.addColorStop(0, "#A7E8D2")
      gradient.addColorStop(1, "rgba(167, 232, 210, 0.3)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4)
      ctx.fill()

      // Draw value on top of bar
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)

      // Draw label below bar
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(labels[index] || "", x + barWidth / 2, margin.top + chartHeight + 20)
    })
  }, [data, labels, title, JSON.stringify(data)])

  if (!data || data.length === 0 || data.every((value) => value === 0)) {
    console.log("TaskChart showing empty state")
    return (
      <div className="w-full h-[300px] relative flex items-center justify-center bg-[#051640] rounded-lg">
        <div className="text-center text-white">
          <p>No completed tasks data available</p>
          <p className="text-sm text-gray-400 mt-2">Complete some tasks to see your progress</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] relative">
      <canvas ref={canvasRef} className="w-full h-full bg-[#051640] rounded-lg" style={{ display: "block" }} />
    </div>
  )
}

