"use client"

import { createContext, useContext, useState } from "react"

const TabsContext = createContext({
  value: "",
  onValueChange: () => {},
})

export function Tabs({ children, defaultValue, value, onValueChange, className = "", ...props }) {
  const [tabValue, setTabValue] = useState(value || defaultValue || "")

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setTabValue(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: value || tabValue, onValueChange: handleValueChange }}>
      <div className={`${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div
      role="tablist"
      className={`inline-flex h-10 items-center justify-center rounded-md bg-[#031233] p-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, className = "", ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isActive = selectedValue === value

  return (
    <button
      role="tab"
      data-state={isActive ? "active" : "inactive"}
      onClick={() => onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

