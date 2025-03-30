"use client"
import { useNavigate } from "react-router-dom"
import { BarChart2, Calendar, Users, Bell } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "../auth-context"
import { useNotifications } from "./notification-system"

export function AppHeader() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { notifications, toggleNotifications } = useNotifications()
  const user = auth?.user || {}

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="bg-[#051640] shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#A7E8D2]">ToDone</h1>

          <nav className="ml-8 hidden md:flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/todo")}
              className="text-white hover:bg-[#051640]/80"
            >
              Tasks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/summary")}
              className="text-white hover:bg-[#051640]/80"
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Summary
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/schedule")}
              className="text-white hover:bg-[#051640]/80"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/team")}
              className="text-white hover:bg-[#051640]/80"
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleNotifications}
            className="relative text-white hover:bg-[#051640]/80 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-[#051640]/80"
          >
            <div className="flex items-center">
              <img
                src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                alt={user?.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  )
}

