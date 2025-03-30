"use client"

import { useRef, useEffect } from "react"

export function CategoryChart({ tasks = [] }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (!tasks || tasks.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set proper dimensions for the canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Group tasks by folder/category
    const tasksByFolder = {}
    const folderColors = {
      1: "#A7E8D2", // Personal
      2: "#64B6FF", // Work
      3: "#FF9F7A", // Health
      // Add more colors for other folders
    }

    const folderNames = {
      1: "Personal",
      2: "Work",
      3: "Health",
    }

    // Count completed tasks by folder
    const completedTasks = tasks.filter((task) => task.completed)
    console.log("Category chart - completed tasks:", completedTasks.length)

    if (completedTasks.length === 0) {
      // Draw "No data" message
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("No completed tasks yet", rect.width / 2, rect.height / 2)
      return
    }

    completedTasks.forEach((task) => {
      if (!tasksByFolder[task.folderId]) {
        tasksByFolder[task.folderId] = 0
      }
      tasksByFolder[task.folderId]++
    })

    console.log("Category chart - tasks by folder:", tasksByFolder)

    // Draw pie chart
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 40

    let startAngle = 0

    // Draw legend
    let legendY = 20
    Object.entries(tasksByFolder).forEach(([folderId, count]) => {
      const color = folderColors[folderId] || "#CCCCCC"
      ctx.fillStyle = color
      ctx.fillRect(rect.width - 120, legendY, 15, 15)

      ctx.fillStyle = "#FFFFFF"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${folderNames[folderId] || `Folder ${folderId}`}: ${count}`, rect.width - 100, legendY + 12)

      legendY += 25
    })

    // Draw pie slices
    Object.entries(tasksByFolder).forEach(([folderId, count]) => {
      const sliceAngle = (2 * Math.PI * count) / completedTasks.length

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = folderColors[folderId] || "#CCCCCC"
      ctx.fill()

      // Add label if slice is big enough
      if (sliceAngle > 0.3) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

        ctx.fillStyle = "#020F2B"
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${Math.round((count / completedTasks.length) * 100)}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw center circle for donut chart
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fillStyle = "#051640"
    ctx.fill()

    // Add total in center
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${completedTasks.length}`, centerX, centerY - 5)
    ctx.font = "12px sans-serif"
    ctx.fillText("completed", centerX, centerY + 15)
  }, [tasks])

  return (
    <div className="w-full h-[200px] relative">
      <canvas ref={canvasRef} className="w-full h-full bg-[#051640] rounded-lg" style={{ display: "block" }} />
    </div>
  )
}

