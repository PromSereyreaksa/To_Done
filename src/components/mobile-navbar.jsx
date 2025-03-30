"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, CheckCircle, BarChart2, Calendar, Users, User } from 'lucide-react'
import { Button } from "./ui/button"

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar only after scrolling down 100px
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const navigateTo = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  if (!isScrolled && !isOpen) {
    return null
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 text-white hover:bg-[#051640]/80 bg-[#051640]/80 rounded-full h-10 w-10 p-0 shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#020F2B] z-40 flex flex-col pt-16">
          <div className="flex flex-col space-y-2 p-4">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-[#A7E8D2] mr-2" />
              <span className="text-2xl font-bold text-[#A7E8D2]">ToDone</span>
            </div>

            <Button
              variant={isActive("/todo") ? "default" : "ghost"}
              className={
                isActive("/todo")
                  ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 justify-start"
                  : "text-white hover:bg-[#051640]/80 justify-start"
              }
              onClick={() => navigateTo("/todo")}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Tasks
            </Button>

            <Button
              variant={isActive("/summary") ? "default" : "ghost"}
              className={
                isActive("/summary")
                  ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 justify-start"
                  : "text-white hover:bg-[#051640]/80 justify-start"
              }
              onClick={() => navigateTo("/summary")}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Summary
            </Button>

            <Button
              variant={isActive("/schedule") ? "default" : "ghost"}
              className={
                isActive("/schedule")
                  ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 justify-start"
                  : "text-white hover:bg-[#051640]/80 justify-start"
              }
              onClick={() => navigateTo("/schedule")}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule
            </Button>

            <Button
              variant={isActive("/team") ? "default" : "ghost"}
              className={
                isActive("/team")
                  ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 justify-start"
                  : "text-white hover:bg-[#051640]/80 justify-start"
              }
              onClick={() => navigateTo("/team")}
            >
              <Users className="h-5 w-5 mr-2" />
              Team
            </Button>

            <Button
              variant={isActive("/profile") ? "default" : "ghost"}
              className={
                isActive("/profile")
                  ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 justify-start"
                  : "text-white hover:bg-[#051640]/80 justify-start"
              }
              onClick={() => navigateTo("/profile")}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
