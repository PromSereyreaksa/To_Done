"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./auth-context"
import { NotificationProvider } from "./components/notification-system"
import LandingPage from "./landing-page"
import Login from "./Login"
import SignUp from "./Register"
import TodoApp from "./todo-app"
import TaskSummary from "./pages/task-summary"
import SchedulePage from "./pages/schedule-page"
import ProfilePage from "./pages/profile-page"
import TeamCollaboration from "./pages/team-collaboration"
// Import the MobileNavbar component
import MobileNavbar from "./components/mobile-navbar"

// Protected route component
function ProtectedRoute({ children }) {
  // Check if user exists in localStorage
  const isAuthenticated = () => {
    try {
      return !!localStorage.getItem("user")
    } catch (error) {
      return false
    }
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <MobileNavbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/todo"
              element={
                <ProtectedRoute>
                  <TodoApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/summary"
              element={
                <ProtectedRoute>
                  <TaskSummary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <SchedulePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <TeamCollaboration />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

