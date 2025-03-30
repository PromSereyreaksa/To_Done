"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "./auth-context"

const SignUp = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const auth = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }

    // Create user data
    const userData = {
      name: `${firstName} ${lastName}`,
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
        <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">{error}</div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
                placeholder="Doe"
              />
            </div>
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded-md bg-[#031233] border border-gray-700 focus:border-[#A7E8D2] focus:outline-none focus:ring-1 focus:ring-[#A7E8D2]"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-[#A7E8D2] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#A7E8D2] hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#A7E8D2] text-[#020F2B] py-2 rounded-md font-medium hover:bg-[#A7E8D2]/80 transition-colors"
          >
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-[#A7E8D2] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp

