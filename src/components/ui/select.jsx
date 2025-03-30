"use client"

import { createContext, useContext, useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const SelectContext = createContext({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

export function Select({ children, value, onValueChange, defaultValue }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setSelectedValue(newValue)
    }
    setOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        value: value !== undefined ? value : selectedValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className = "", ...props }) {
  const { open, setOpen, value } = useContext(SelectContext)

  return (
    <button
      type="button"
      role="combobox"
      aria-expanded={open}
      className={`flex h-10 w-full items-center justify-between rounded-md border bg-[#031233] border-gray-700 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#A7E8D2] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext)

  return <span className="text-sm">{value ? value : placeholder}</span>
}

export function SelectContent({ children, className = "", ...props }) {
  const { open, setOpen } = useContext(SelectContext)
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

  return (
    <div
      ref={ref}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-[#051640] text-white border-[#A7E8D2]/20 p-1 shadow-md animate-in fade-in-80 w-full mt-1 ${className}`}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">{children}</div>
    </div>
  )
}

export function SelectItem({ children, value, className = "", ...props }) {
  const { onValueChange } = useContext(SelectContext)

  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-[#031233] cursor-pointer ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* Checkmark could go here */}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  )
}

