"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CalendarIcon,
  AlertCircle,
  Users,
  Flag,
  Folder,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { useNotifications } from "../components/notification-system"

export default function SchedulePage() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [scheduledTasks, setScheduledTasks] = useState({})
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [tasks, setTasks] = useState([])
  const [teamTasks, setTeamTasks] = useState([])
  const [taskDetails, setTaskDetails] = useState(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [isTeamTask, setIsTeamTask] = useState(false)
  const [teamMembers, setTeamMembers] = useState([])
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showQuickAddDialog, setShowQuickAddDialog] = useState(false)

  // New task fields
  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskFolderId, setNewTaskFolderId] = useState("")
  const [folders, setFolders] = useState([])
  const [draggedTask, setDraggedTask] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Load tasks and scheduled tasks from localStorage
  useEffect(() => {
    try {
      // Load personal tasks
      const savedTasks = localStorage.getItem("todone-tasks")
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        console.log("Loaded tasks for scheduling:", parsedTasks.length)
        setTasks(parsedTasks)
      } else {
        // If no tasks found, check if we need to initialize with default tasks
        const defaultTasks = [
          {
            id: 1,
            text: "Complete project proposal",
            completed: false,
            folderId: 2,
            priority: "high",
            createdAt: new Date().toISOString(),
            completedAt: null,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
          },
          {
            id: 2,
            text: "Schedule team meeting",
            completed: true,
            folderId: 2,
            priority: "medium",
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
          },
          {
            id: 3,
            text: "Buy groceries",
            completed: false,
            folderId: 1,
            priority: "low",
            createdAt: new Date().toISOString(),
            completedAt: null,
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            comments: [],
          },
        ]
        setTasks(defaultTasks)
      }

      // Load team tasks
      const savedTeamTasks = localStorage.getItem("todone-team-tasks")
      if (savedTeamTasks) {
        setTeamTasks(JSON.parse(savedTeamTasks))
      }

      // Load scheduled tasks
      const savedScheduledTasks = localStorage.getItem("todone-scheduled-tasks")
      if (savedScheduledTasks) {
        setScheduledTasks(JSON.parse(savedScheduledTasks))
      }

      // Load team members
      const savedTeamMembers = localStorage.getItem("todone-team-members")
      if (savedTeamMembers) {
        setTeamMembers(JSON.parse(savedTeamMembers))
      }

      // Load folders
      const savedFolders = localStorage.getItem("todone-folders")
      if (savedFolders) {
        setFolders(JSON.parse(savedFolders))
      } else {
        // Default folders
        const defaultFolders = [
          { id: 1, name: "Personal", icon: "🏠", expanded: true },
          { id: 2, name: "Work", icon: "💼", expanded: true },
          { id: 3, name: "Health", icon: "🏋️", expanded: false },
        ]
        setFolders(defaultFolders)
        localStorage.setItem("todone-folders", JSON.stringify(defaultFolders))
      }

      // Check for upcoming deadlines
      checkDeadlines()
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }

    // Set up interval to check deadlines every hour
    const intervalId = setInterval(checkDeadlines, 60 * 60 * 1000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Check for upcoming deadlines and send notifications
  const checkDeadlines = () => {
    const now = new Date()
    const allTasks = [...tasks, ...teamTasks]

    allTasks.forEach((task) => {
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate)
        const timeDiff = dueDate.getTime() - now.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        // Check if task is due in about 24 hours (between 23-25 hours)
        if (hoursDiff > 23 && hoursDiff < 25) {
          addNotification({
            title: "Task Due Tomorrow",
            message: `"${task.text}" is due tomorrow at ${dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            type: "warning",
            showToast: true,
          })
        }
        // Check if task is due in about 12 hours (between 11-13 hours)
        else if (hoursDiff > 11 && hoursDiff < 13) {
          addNotification({
            title: "Task Due Soon",
            message: `"${task.text}" is due in about 12 hours`,
            type: "warning",
            showToast: true,
          })
        }
        // Check if task is due in about 1 hour (between 0.5-1.5 hours)
        else if (hoursDiff > 0.5 && hoursDiff < 1.5) {
          addNotification({
            title: "Task Due Very Soon",
            message: `"${task.text}" is due in about 1 hour`,
            type: "error",
            showToast: true,
          })
        }
      }
    })
  }

  // Save scheduled tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("todone-scheduled-tasks", JSON.stringify(scheduledTasks))
  }, [scheduledTasks])

  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null })
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ day, date })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle day selection
  const selectDay = (date) => {
    if (!date) return
    setSelectedDate(date)
  }

  // Get team member by ID
  const getTeamMemberById = (id) => {
    return teamMembers.find((member) => member.id === id) || { name: "Unassigned" }
  }

  // Get folder by ID
  const getFolderById = (id) => {
    return folders.find((folder) => folder.id === id) || { name: "Unknown Folder", icon: "📁" }
  }

  // Handle task scheduling
  const scheduleTask = () => {
    if (!selectedTask && !newTaskText) return

    const dateKey = selectedDate.toISOString().split("T")[0]
    const newScheduledTasks = { ...scheduledTasks }

    if (!newScheduledTasks[dateKey]) {
      newScheduledTasks[dateKey] = []
    }

    // If we're selecting an existing task
    if (selectedTask) {
      let taskObj
      if (isTeamTask) {
        taskObj = teamTasks.find((t) => t.id.toString() === selectedTask)
      } else {
        taskObj = tasks.find((t) => t.id.toString() === selectedTask)
      }

      if (!taskObj) return

      const newTask = {
        taskId: selectedTask,
        time: selectedTime,
        duration: "30", // Default duration
        task: taskObj,
        isTeamTask: isTeamTask,
      }

      newScheduledTasks[dateKey].push(newTask)

      // Add notification
      addNotification({
        title: "Task Scheduled",
        message: `"${taskObj?.text}" scheduled for ${formatDate(selectedDate)} at ${selectedTime}`,
        type: "success",
        showToast: true,
      })
    }
    // If we're creating a new task
    else if (newTaskText) {
      // Create new task
      const newTaskObj = {
        id: Date.now(),
        text: newTaskText,
        completed: false,
        folderId: Number(newTaskFolderId) || folders[0].id,
        priority: newTaskPriority,
        createdAt: new Date().toISOString(),
        dueDate: newTaskDueDate || null,
      }

      // Add to tasks list
      const updatedTasks = [...tasks, newTaskObj]
      setTasks(updatedTasks)

      // Save to localStorage immediately
      localStorage.setItem("todone-tasks", JSON.stringify(updatedTasks))

      // Schedule the task
      const newTask = {
        taskId: newTaskObj.id,
        time: selectedTime,
        duration: "30", // Default duration
        task: newTaskObj,
        isTeamTask: false,
      }

      newScheduledTasks[dateKey].push(newTask)

      // Add notification
      addNotification({
        title: "Task Created and Scheduled",
        message: `"${newTaskText}" created and scheduled for ${formatDate(selectedDate)} at ${selectedTime}`,
        type: "success",
        showToast: true,
      })

      // Reset form
      setNewTaskText("")
      setNewTaskPriority("medium")
      setNewTaskDueDate("")
      setNewTaskFolderId("")
    }

    setScheduledTasks(newScheduledTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-scheduled-tasks", JSON.stringify(newScheduledTasks))

    // Reset selection
    setSelectedTask(null)
    setIsTeamTask(false)
    setShowAddTaskDialog(false)
    setShowQuickAddDialog(false)
  }

  // Handle task drag and drop
  const handleDragStart = (task, date) => {
    setDraggedTask({ task, date })
    setIsDragging(true)
  }

  const handleDragOver = (e, date) => {
    e.preventDefault()
    e.currentTarget.classList.add("day-drop-target")
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("day-drop-target")
  }

  const handleDrop = (e, targetDate) => {
    e.preventDefault()
    e.currentTarget.classList.remove("day-drop-target")

    if (!draggedTask || !targetDate) return

    const { task, date: sourceDate } = draggedTask

    // Don't do anything if dropped on the same date
    if (sourceDate.toDateString() === targetDate.toDateString()) return

    const sourceDateKey = sourceDate.toISOString().split("T")[0]
    const targetDateKey = targetDate.toISOString().split("T")[0]

    const newScheduledTasks = { ...scheduledTasks }

    // Find the task in the source date
    if (!newScheduledTasks[sourceDateKey]) return

    const sourceTaskIndex = newScheduledTasks[sourceDateKey].findIndex(
      (t) => t.taskId === task.taskId && t.isTeamTask === task.isTeamTask,
    )

    if (sourceTaskIndex === -1) return

    // Get the task
    const taskToMove = newScheduledTasks[sourceDateKey][sourceTaskIndex]

    // Remove from source
    newScheduledTasks[sourceDateKey] = newScheduledTasks[sourceDateKey].filter((_, index) => index !== sourceTaskIndex)

    if (newScheduledTasks[sourceDateKey].length === 0) {
      delete newScheduledTasks[sourceDateKey]
    }

    // Add to target
    if (!newScheduledTasks[targetDateKey]) {
      newScheduledTasks[targetDateKey] = []
    }

    newScheduledTasks[targetDateKey].push(taskToMove)

    // Update state
    setScheduledTasks(newScheduledTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-scheduled-tasks", JSON.stringify(newScheduledTasks))

    setIsDragging(false)
    setDraggedTask(null)

    // Add notification
    addNotification({
      title: "Task Rescheduled",
      message: `"${taskToMove.task?.text}" moved to ${formatDate(targetDate)}`,
      type: "info",
      showToast: true,
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDraggedTask(null)
  }

  // Get tasks for selected date
  const getTasksForDate = (date) => {
    if (!date) return []

    const dateKey = date.toISOString().split("T")[0]
    return scheduledTasks[dateKey] || []
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // Get incomplete tasks for scheduling
  const incompleteTasks = tasks.filter((task) => !task.completed)
  const incompleteTeamTasks = teamTasks.filter((task) => !task.completed)

  // Handle task click to show details
  const handleTaskClick = (task) => {
    setTaskDetails(task)
    setShowTaskDetails(true)
  }

  // Get upcoming tasks for the next 7 days
  const getUpcomingTasks = () => {
    const upcoming = []
    const today = new Date()

    // Look at the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateKey = date.toISOString().split("T")[0]

      if (scheduledTasks[dateKey]) {
        scheduledTasks[dateKey].forEach((task) => {
          upcoming.push({
            ...task,
            date,
            dateKey,
          })
        })
      }
    }

    // Sort by date and time
    return upcoming.sort((a, b) => {
      if (a.date.getTime() !== b.date.getTime()) {
        return a.date.getTime() - b.date.getTime()
      }
      return a.time.localeCompare(b.time)
    })
  }

  const upcomingTasks = getUpcomingTasks()

  // Quick add task to today
  const quickAddTask = () => {
    const today = new Date()
    setSelectedDate(today)
    setShowQuickAddDialog(true)
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/todo")}
              className="mr-2 text-white hover:bg-[#051640]/80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to todos
            </Button>
            <h1 className="text-3xl font-bold">Task Scheduler</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="md:col-span-2">
            <Card className="bg-[#051640] border-none text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevMonth}
                      className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextMonth}
                      className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium py-2 text-gray-400">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        p-2 h-20 border border-[#031233] rounded-md 
                        ${!day.day ? "bg-transparent" : "bg-[#031233] hover:bg-[#051640] cursor-pointer"}
                        ${selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString() ? "ring-2 ring-[#A7E8D2]" : ""}
                      `}
                      onClick={() => day.day && selectDay(day.date)}
                      onDragOver={(e) => day.day && handleDragOver(e, day.date)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => day.day && handleDrop(e, day.date)}
                    >
                      {day.day && (
                        <>
                          <div className="flex justify-between items-start">
                            <span
                              className={`
                              text-sm font-medium
                              ${
                                new Date().toDateString() === day.date.toDateString()
                                  ? "bg-[#A7E8D2] text-[#020F2B] rounded-full w-6 h-6 flex items-center justify-center"
                                  : ""
                              }
                            `}
                            >
                              {day.day}
                            </span>

                            {/* Indicator for scheduled tasks */}
                            {getTasksForDate(day.date).length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-[#A7E8D2]"></span>
                            )}
                          </div>

                          {/* Show first scheduled task if any */}
                          {getTasksForDate(day.date).length > 0 && (
                            <div className="mt-1 text-xs truncate text-[#A7E8D2]">
                              {getTasksForDate(day.date)[0].time} - {getTasksForDate(day.date)[0].task?.text}
                            </div>
                          )}

                          {/* Show count if more than one task */}
                          {getTasksForDate(day.date).length > 1 && (
                            <div className="text-xs text-gray-400">+{getTasksForDate(day.date).length - 1} more</div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule details */}
          <div>
            <Card className="bg-[#051640] border-none text-white mb-6">
              <CardHeader>
                <CardTitle>{selectedDate ? formatDate(selectedDate) : "Select a date"}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Scheduled Tasks</h3>
                      <Button
                        size="sm"
                        className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                        onClick={() => setShowAddTaskDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        New Task
                      </Button>
                    </div>

                    {selectedDateTasks.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateTasks.map((scheduledTask, index) => (
                          <div
                            key={index}
                            className="p-3 bg-[#031233] rounded-lg flex items-start cursor-move"
                            onClick={() => handleTaskClick(scheduledTask)}
                            draggable
                            onDragStart={() => handleDragStart(scheduledTask, selectedDate)}
                            onDragEnd={handleDragEnd}
                          >
                            <Clock className="h-4 w-4 text-[#A7E8D2] mt-1 mr-2" />
                            <div className="flex-1">
                              <div className="font-medium">{scheduledTask.task?.text}</div>
                              <div className="text-sm text-gray-400 flex items-center">
                                <span className="mr-2">{scheduledTask.time}</span>
                                {scheduledTask.isTeamTask && (
                                  <span className="flex items-center text-blue-400">
                                    <Users className="h-3 w-3 mr-1" />
                                    Team
                                  </span>
                                )}
                              </div>
                              {scheduledTask.task?.priority && (
                                <div className="text-xs flex items-center mt-1">
                                  <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(scheduledTask.task.priority)}`} />
                                  <span className={getPriorityColor(scheduledTask.task.priority)}>
                                    {scheduledTask.task.priority} priority
                                  </span>
                                </div>
                              )}
                              {scheduledTask.task?.dueDate && (
                                <div className="text-xs flex items-center mt-1">
                                  <AlertCircle className="h-3 w-3 mr-1 text-blue-400" />
                                  <span className="text-blue-400">
                                    Due: {new Date(scheduledTask.task.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No tasks scheduled for this day</p>
                        <p className="text-sm">Click the Add button to schedule a task</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a date from the calendar</p>
                    <p className="text-sm">to view or schedule tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#051640] border-none text-white">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Upcoming Tasks</CardTitle>
                <Button size="sm" className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80" onClick={quickAddTask}>
                  <Plus className="h-4 w-4 mr-1" />
                  Quick Add
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="p-3 bg-[#031233] rounded-lg">
                        <div className="font-medium mb-1">
                          {task.date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-sm ml-2 mt-1">
                          <Clock className="h-3 w-3 text-[#A7E8D2] mr-1" />
                          <span className="text-gray-400 mr-1">{task.time}</span>
                          <span className="truncate">{task.task?.text}</span>
                          {task.isTeamTask && (
                            <span className="ml-2 flex items-center text-blue-400">
                              <Users className="h-3 w-3 mr-1" />
                              Team
                            </span>
                          )}
                        </div>
                        {task.task?.priority && (
                          <div className="text-xs flex items-center ml-2 mt-1">
                            <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(task.task.priority)}`} />
                            <span className={getPriorityColor(task.task.priority)}>{task.task.priority} priority</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <p>No upcoming scheduled tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add New Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Description</Label>
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="bg-[#031233] border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                  <SelectItem value="low" className="hover:bg-[#031233] cursor-pointer">
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 text-green-400 mr-2" />
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-[#031233] cursor-pointer">
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 text-yellow-400 mr-2" />
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high" className="hover:bg-[#031233] cursor-pointer">
                    <div className="flex items-center">
                      <Flag className="h-4 w-4 text-red-400 mr-2" />
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-[#031233] border-gray-700 text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-[#031233] border-gray-700 text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div className="space-y-2">
              <Label>Folder (Optional)</Label>
              <Select value={newTaskFolderId} onValueChange={setNewTaskFolderId}>
                <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                  {folders.map((folder) => (
                    <SelectItem
                      key={folder.id}
                      value={folder.id.toString()}
                      className="hover:bg-[#031233] cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{folder.icon}</span>
                        <span>{folder.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTaskDialog(false)}
              className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
            >
              Cancel
            </Button>
            <Button
              onClick={scheduleTask}
              className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
              disabled={!newTaskText.trim()}
            >
              Create & Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Add (Existing Task) Dialog */}
      <Dialog open={showQuickAddDialog} onOpenChange={setShowQuickAddDialog}>
        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
          <DialogHeader>
            <DialogTitle>Schedule Existing Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Type</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={!isTeamTask ? "default" : "outline"}
                  className={
                    !isTeamTask
                      ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 flex-1"
                      : "border-[#A7E8D2]/50 text-white hover:bg-[#031233] flex-1"
                  }
                  onClick={() => setIsTeamTask(false)}
                >
                  Personal
                </Button>
                <Button
                  type="button"
                  variant={isTeamTask ? "default" : "outline"}
                  className={
                    isTeamTask
                      ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 flex-1"
                      : "border-[#A7E8D2]/50 text-white hover:bg-[#031233] flex-1"
                  }
                  onClick={() => setIsTeamTask(true)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Team
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Task</Label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                  <SelectValue placeholder="Choose a task" />
                </SelectTrigger>
                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                  {(isTeamTask ? incompleteTeamTasks : incompleteTasks).map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()} className="hover:bg-[#031233] cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span>{task.text}</span>
                        {isTeamTask && task.assigneeId && (
                          <span className="text-xs text-gray-400">{getTeamMemberById(task.assigneeId).name}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                  {(isTeamTask ? incompleteTeamTasks : incompleteTasks).length === 0 && (
                    <div className="p-2 text-center text-gray-400">
                      No {isTeamTask ? "team" : "personal"} tasks available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-[#031233] border-gray-700 text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowQuickAddDialog(false)}
              className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
            >
              Cancel
            </Button>
            <Button
              onClick={scheduleTask}
              className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
              disabled={!selectedTask}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      {showTaskDetails && taskDetails && (
        <Dialog open={showTaskDetails} onOpenChange={setShowTaskDetails}>
          <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-[#031233] rounded-lg">
                <h3 className="font-medium text-lg">{taskDetails.task?.text}</h3>
                <div className="mt-2 text-sm text-gray-400">
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Scheduled for {taskDetails.time}</span>
                  </div>
                  {taskDetails.task?.priority && (
                    <div className="flex items-center mt-1">
                      <Flag
                        className={`h-4 w-4 mr-2 ${
                          taskDetails.task.priority === "high"
                            ? "text-red-400"
                            : taskDetails.task.priority === "medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      />
                      <span>Priority: {taskDetails.task.priority}</span>
                    </div>
                  )}
                  {taskDetails.task?.dueDate && (
                    <div className="flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-400" />
                      <span>Due: {new Date(taskDetails.task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {taskDetails.isTeamTask && taskDetails.task?.assigneeId && (
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 mr-2 text-blue-400" />
                      <span>Assigned to: {getTeamMemberById(taskDetails.task.assigneeId).name}</span>
                    </div>
                  )}
                  {taskDetails.task?.folderId && (
                    <div className="flex items-center mt-1">
                      <Folder className="h-4 w-4 mr-2 text-[#A7E8D2]" />
                      <span>Folder: {getFolderById(taskDetails.task.folderId).name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                onClick={() => {
                  // Remove task from schedule
                  const dateKey = selectedDate.toISOString().split("T")[0]
                  const newScheduledTasks = { ...scheduledTasks }
                  newScheduledTasks[dateKey] = newScheduledTasks[dateKey].filter(
                    (t) => !(t.taskId === taskDetails.taskId && t.isTeamTask === taskDetails.isTeamTask),
                  )
                  if (newScheduledTasks[dateKey].length === 0) {
                    delete newScheduledTasks[dateKey]
                  }
                  setScheduledTasks(newScheduledTasks)

                  // Save to localStorage immediately
                  localStorage.setItem("todone-scheduled-tasks", JSON.stringify(newScheduledTasks))

                  setShowTaskDetails(false)

                  // Add notification
                  addNotification({
                    title: "Task Removed",
                    message: `"${taskDetails.task?.text}" removed from schedule`,
                    type: "info",
                    showToast: true,
                  })
                }}
              >
                Remove
              </Button>
              <Button
                className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                onClick={() => setShowTaskDetails(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

