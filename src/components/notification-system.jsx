"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { X, Info, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "./ui/button"

// Create notification context
const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
  toggleNotifications: () => {},
  unreadCount: 0,
})

export function useNotifications() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on initial load
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("todone-notifications")
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
        setUnreadCount(parsedNotifications.filter((n) => !n.read).length)
      }
    } catch (error) {
      console.error("Failed to load notifications", error)
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem("todone-notifications", JSON.stringify(notifications))
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    }
    setNotifications((prev) => [newNotification, ...prev])

    // Auto-dismiss toast notifications after 5 seconds
    if (notification.showToast) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
      }, 5000)
    }
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      markAllAsRead()
    }
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAllNotifications,
        toggleNotifications,
        unreadCount: unreadCount,
      }}
    >
      {children}

      {/* Notification Bell - now accessed through the header */}
      <div className="z-[9999]">
        {showNotifications && (
          <div className="fixed right-4 top-16 mt-2 w-80 bg-[#051640] border border-[#A7E8D2]/20 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 border-b border-[#A7E8D2]/10 flex justify-between items-center">
              <h3 className="font-medium text-white">Notifications</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                >
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleNotifications}
                  className="h-7 w-7 p-0 text-white hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-[#A7E8D2]/10 hover:bg-[#031233] ${!notification.read ? "bg-[#031233]/50" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="h-6 w-6 p-0 text-white hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">
                  <p>No notifications</p>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t border-[#A7E8D2]/10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="w-full text-xs text-gray-400 hover:text-white"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9998] flex flex-col gap-2 items-end">
        {notifications
          .filter((n) => n.showToast && !n.toastDismissed)
          .slice(0, 3)
          .map((notification) => (
            <div
              key={`toast-${notification.id}`}
              className="bg-[#051640] border border-[#A7E8D2]/20 rounded-lg shadow-lg p-3 w-80 animate-slideIn"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{notification.title}</p>
                  <p className="text-xs text-gray-400">{notification.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, toastDismissed: true } : n)),
                    )
                  }}
                  className="h-6 w-6 p-0 text-white hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </NotificationContext.Provider>
  )
}

