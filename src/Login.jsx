"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./auth-context"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Get auth context if available
  const auth = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    // Create user data
    const userData = {
      name: email.split("@")[0], // Use part of email as name
      email,
      avatar: `/placeholder.svg?height=32&width=32`, // Placeholder avatar
    }

    // Use auth context if available, otherwise use localStorage directly
    if (auth) {
      auth.login(userData)
    } else {
      localStorage.setItem("user", JSON.stringify(userData))
    }

    // Navigate to the todo app
    navigate("/todo")
  }

  return (
    <div className="min-h-screen bg-[#020F2B] text-white flex items-center justify-center">
      <div className="bg-[#051640] p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to ToDone</h1>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">{error}</div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-[#A7E8D2] hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#A7E8D2] text-[#020F2B] py-2 rounded-md font-medium hover:bg-[#A7E8D2]/80 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{" "}
            <a href="#" className="text-[#A7E8D2] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

