"use client"

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  type = "button",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7E8D2] disabled:opacity-50"

  const variants = {
    default: "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80",
    outline: "border border-[#A7E8D2]/50 text-white hover:bg-[#031233]",
    ghost: "text-white hover:bg-[#051640]/80",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
  }

  const variantStyle = variants[variant] || variants.default
  const sizeStyle = sizes[size] || sizes.default

  return (
    <button
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

