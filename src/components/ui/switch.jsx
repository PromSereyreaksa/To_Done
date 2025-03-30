"use client"

import { useState } from "react"

export function Switch({ checked = false, onCheckedChange, className = "", ...props }) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    if (onCheckedChange) {
      onCheckedChange(newValue)
    }
  }

  return (
    <button
      role="switch"
      aria-checked={checked || isChecked}
      onClick={handleChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7E8D2] focus-visible:ring-offset-2 ${checked || isChecked ? "bg-[#A7E8D2]" : "bg-gray-600"} ${className}`}
      {...props}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked || isChecked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  )
}

