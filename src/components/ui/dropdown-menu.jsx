"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from "react"

const DropdownMenuContext = createContext({
  open: false,
  setOpen: () => {},
})

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)

  return <DropdownMenuContext.Provider value={{ open, setOpen }}>{children}</DropdownMenuContext.Provider>
}

export function DropdownMenuTrigger({ children, asChild }) {
  const { open, setOpen } = useContext(DropdownMenuContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        e.stopPropagation()
        setOpen(!open)
      },
    })
  }

  return <button onClick={() => setOpen(!open)}>{children}</button>
}

export function DropdownMenuContent({ children, align = "center", className = "", ...props }) {
  const { open, setOpen } = useContext(DropdownMenuContext)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setOpen])

  if (!open) return null

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      ref={ref}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-[#051640] text-white border-[#A7E8D2]/20 p-1 shadow-md animate-in fade-in-80 ${alignClasses[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, className = "", onClick, disabled = false, ...props }) {
  const { setOpen } = useContext(DropdownMenuContext)

  const handleClick = (e) => {
    if (disabled) return

    if (onClick) {
      onClick(e)
    }

    setOpen(false)
  }

  return (
    <button
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-[#031233] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

