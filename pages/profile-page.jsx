"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Mail, Lock, Camera, LogOut, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../auth-context"

export default function ProfilePage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const fileInputRef = useRef(null)

  // Get user from auth context
  const user = auth?.user || {}

  // Form state
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatar, setAvatar] = useState(user.avatar || "/placeholder.svg?height=128&width=128")
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB")
      return
    }

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(file)

    setError("")
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Validate password if changing
    if (newPassword) {
      if (!currentPassword) {
        setError("Current password is required to set a new password")
        return
      }

      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match")
        return
      }
    }

    // Update user data
    const updatedUser = {
      ...user,
      name,
      email,
      avatar,
    }

    // Update in auth context
    if (auth) {
      auth.login(updatedUser)
    } else {
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    setSuccess("Profile updated successfully")
    setIsEditing(false)

    // Reset password fields
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  // Handle logout
  const handleLogout = () => {
    if (auth) {
      auth.logout()
    } else {
      localStorage.removeItem("user")
    }
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/todo")}
            className="mr-2 text-white hover:bg-[#051640]/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to todos
          </Button>
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>

        <Card className="bg-[#051640] border-none text-white mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Error and success messages */}
              {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">{error}</div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500 text-green-100 px-4 py-2 rounded mb-4">
                  {success}
                </div>
              )}

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative w-32 h-32 rounded-full overflow-hidden mb-2 cursor-pointer group"
                  onClick={handleAvatarClick}
                >
                  <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <button type="button" className="text-sm text-[#A7E8D2] hover:underline" onClick={handleAvatarClick}>
                  Change profile picture
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-[#031233] border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="bg-[#031233] border-gray-700 text-white"
                  />
                </div>

                {isEditing && (
                  <>
                    <div className="pt-4 border-t border-gray-700">
                      <h3 className="font-medium mb-4">Change Password (Optional)</h3>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            <Lock className="h-4 w-4 inline mr-2" />
                            Current Password
                          </Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-[#031233] border-gray-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password">
                            <Lock className="h-4 w-4 inline mr-2" />
                            New Password
                          </Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-[#031233] border-gray-700 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            <Lock className="h-4 w-4 inline mr-2" />
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-[#031233] border-gray-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-[#051640] border-none text-white">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[#031233] rounded-lg">
                <h3 className="font-medium mb-2">Data & Privacy</h3>
                <p className="text-sm text-gray-400 mb-4">Manage your data and privacy settings</p>
                <Button variant="outline" size="sm" className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]">
                  Manage Settings
                </Button>
              </div>

              <div className="p-4 bg-[#031233] rounded-lg">
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-sm text-gray-400 mb-4">Configure how and when you receive notifications</p>
                <Button variant="outline" size="sm" className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]">
                  Notification Preferences
                </Button>
              </div>

              <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                <h3 className="font-medium text-red-400 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-400 mb-4">Permanently delete your account and all your data</p>
                <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

