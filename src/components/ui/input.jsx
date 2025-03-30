export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2] ${className}`}
      {...props}
    />
  )
}

