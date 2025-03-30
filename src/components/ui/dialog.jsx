"use client"

import React, { createContext, useContext, useState } from "react"

const DialogContext = createContext({
  open: false,
  setOpen: () => {},
})

export function Dialog({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)

  const handleOpenChange = (value) => {
    setIsOpen(value)
    if (onOpenChange) {
      onOpenChange(value)
    }
  }

  if (!open && !isOpen) return null

  return (
    <DialogContext.Provider value={{ open: open || isOpen, setOpen: handleOpenChange }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={() => handleOpenChange(false)} />
        {children}
      </div>
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild }) {
  const { setOpen } = useContext(DialogContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setOpen(true),
    })
  }

  return <button onClick={() => setOpen(true)}>{children}</button>
}

export function DialogContent({ children, className = "", ...props }) {
  return (
    <div
      className={`fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-[#051640] p-6 opacity-100 shadow-lg border border-[#A7E8D2]/20 rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = "", ...props }) {
  return (
    <h2 className={`text-lg font-semibold text-white ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function DialogFooter({ children, className = "", ...props }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DialogClose({ children, asChild, ...props }) {
  const { setOpen } = useContext(DialogContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setOpen(false),
      ...props,
    })
  }

  return (
    <button onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  )
}

