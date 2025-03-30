"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./auth-context"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs"
import {
  CheckCircle,
  Circle,
  Trash2,
  Folder,
  ChevronDown,
  ChevronRight,
  Edit,
  X,
  BarChart2,
  Plus,
  Clock,
  Flag,
  MessageSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu"
import { Label } from "./components/ui/label"
import { AppHeader } from "./components/app-header"
import AddTaskButton from "./components/add-task-button.jsx"
import TaskEditModal from "./components/task-edit-modal"
import { useNotifications } from "./components/notification-system"

// Custom theme
const customTheme = {
  primary: "bg-[#A7E8D2] hover:bg-[#A7E8D2]/80 text-[#020F2B]",
  secondary: "bg-[#A7E8D2]/20 text-[#A7E8D2]",
  accent: "text-[#A7E8D2]",
  highlight: "bg-[#051640]",
  border: "border-[#051640]",
  hover: "hover:bg-[#051640]",
  activeTab: "data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2]",
}

// Local storage keys
const STORAGE_KEYS = {
  TASKS: "todone-tasks",
  COMPLETED_TASKS: "todone-completed-tasks",
  FOLDERS: "todone-folders",
  THEME: "todone-theme",
}

export default function TodoApp() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { addNotification } = useNotifications()
  const [user, setUser] = useState(null)

  // Theme state
  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    return savedTheme || "custom"
  })
  const theme = { custom: customTheme }[activeTheme]

  // Default data
  const defaultFolders = [
    { id: 1, name: "Personal", icon: "🏠", expanded: true },
    { id: 2, name: "Work", icon: "💼", expanded: true },
    { id: 3, name: "Health", icon: "🏋️", expanded: false },
  ]

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

  // State
  const [folders, setFolders] = useState(() => {
    const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS)
    const parsedFolders = savedFolders ? JSON.parse(savedFolders) : defaultFolders
    console.log("Initial folders:", parsedFolders)
    return parsedFolders.length > 0 ? parsedFolders : defaultFolders // Ensure non-empty
  })
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS)
    return savedTasks ? JSON.parse(savedTasks) : defaultTasks
  })
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeFolder, setActiveFolder] = useState("all")
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderIcon, setNewFolderIcon] = useState("📁")
  const [editingFolder, setEditingFolder] = useState(null)
  const [showCompletedTasks, setShowCompletedTasks] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [showAddFolderModal, setShowAddFolderModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    console.log("Saved tasks to localStorage:", tasks)
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
    console.log("Saved folders to localStorage:", folders)
  }, [folders])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, activeTheme)
  }, [activeTheme])

  // User authentication
  useEffect(() => {
    console.log("Checking user auth...")
    if (auth && auth.user) {
      setUser(auth.user)
    } else {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          console.log("User loaded from localStorage:", JSON.parse(storedUser))
        } else {
          console.log("No user found, redirecting to login")
          navigate("/login")
        }
      } catch (error) {
        console.error("Failed to parse stored user data", error)
        navigate("/login")
      }
    }
  }, [auth, navigate])

  // Handlers
  const handleAddTask = (newTaskObj) => {
    console.log("Adding new task:", newTaskObj)

    // Ensure the task has a comments array
    if (!newTaskObj.comments) {
      newTaskObj.comments = []
    }

    // Set due date to today if not specified
    if (!newTaskObj.dueDate) {
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today
      newTaskObj.dueDate = today.toISOString()
    }

    const updatedTasks = [...tasks, newTaskObj]
    setTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks))

    // Show notification
    addNotification({
      title: "Task Added",
      message: `"${newTaskObj.text}" has been added`,
      type: "success",
      showToast: true,
    })
  }

  const toggleTaskCompletion = (id) => {
    console.log("Toggling task completion for ID:", id)
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
        : task,
    )
    setTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks))

    // Show notification
    const task = tasks.find((t) => t.id === id)
    if (task) {
      addNotification({
        title: task.completed ? "Task Uncompleted" : "Task Completed",
        message: `"${task.text}" has been ${task.completed ? "marked as incomplete" : "completed"}`,
        type: task.completed ? "info" : "success",
        showToast: true,
      })
    }
  }

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id)
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks))

    // Show notification
    if (taskToDelete) {
      addNotification({
        title: "Task Deleted",
        message: `"${taskToDelete.text}" has been deleted`,
        type: "info",
        showToast: true,
      })
    }
  }

  const clearCompleted = () => {
    const completedTasks = tasks.filter((task) => task.completed)
    const activeTasks = tasks.filter((task) => !task.completed)
    const existingCompleted = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS) || "[]")

    // Save completed tasks to archive
    localStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify([...existingCompleted, ...completedTasks]))
    console.log("Cleared completed tasks:", completedTasks)

    // Update active tasks
    setTasks(activeTasks)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(activeTasks))

    // Show notification
    addNotification({
      title: "Completed Tasks Cleared",
      message: `${completedTasks.length} completed tasks have been archived`,
      type: "info",
      showToast: true,
    })
  }

  const goToSummary = () => {
    console.log("Navigating to summary page")
    navigate("/summary")
  }

  const addFolder = () => {
    if (newFolderName.trim() === "") return
    const newFolder = { id: Date.now(), name: newFolderName, icon: newFolderIcon, expanded: true }
    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updatedFolders))

    setNewFolderName("")
    setNewFolderIcon("📁")
    setShowAddFolderModal(false)

    // Show notification
    addNotification({
      title: "Folder Added",
      message: `"${newFolderName}" folder has been created`,
      type: "success",
      showToast: true,
    })
  }

  const updateFolder = () => {
    if (!editingFolder || newFolderName.trim() === "") return
    const updatedFolders = folders.map((folder) =>
      folder.id === editingFolder.id ? { ...folder, name: newFolderName, icon: newFolderIcon } : folder,
    )
    setFolders(updatedFolders)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updatedFolders))

    setEditingFolder(null)
    setNewFolderName("")
    setNewFolderIcon("📁")
    setShowAddFolderModal(false)

    // Show notification
    addNotification({
      title: "Folder Updated",
      message: `"${newFolderName}" folder has been updated`,
      type: "success",
      showToast: true,
    })
  }

  const deleteFolder = (id) => {
    const folderToDelete = folders.find((f) => f.id === id)
    const defaultFolderId = folders[0].id !== id ? folders[0].id : folders[1] ? folders[1].id : null
    if (defaultFolderId) {
      const updatedTasks = tasks.map((task) => (task.folderId === id ? { ...task, folderId: defaultFolderId } : task))
      setTasks(updatedTasks)

      // Save to localStorage immediately
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks))
    }

    const updatedFolders = folders.filter((folder) => folder.id !== id)
    setFolders(updatedFolders)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updatedFolders))

    if (activeFolder === id.toString()) setActiveFolder("all")

    // Show notification
    if (folderToDelete) {
      addNotification({
        title: "Folder Deleted",
        message: `"${folderToDelete.name}" folder has been deleted`,
        type: "info",
        showToast: true,
      })
    }
  }

  const toggleFolderExpansion = (id) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === id ? { ...folder, expanded: !folder.expanded } : folder,
    )
    setFolders(updatedFolders)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(updatedFolders))
  }

  const startEditFolder = (folder) => {
    setEditingFolder(folder)
    setNewFolderName(folder.name)
    setNewFolderIcon(folder.icon)
    setShowAddFolderModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
  }

  const saveEditedTask = (editedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === editedTask.id ? editedTask : task))
    setTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks))

    // Show notification
    addNotification({
      title: "Task Updated",
      message: `"${editedTask.text}" has been updated`,
      type: "success",
      showToast: true,
    })
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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "active" && task.completed) return false
    if (activeFilter === "completed" && !task.completed) return false
    if (!showCompletedTasks && task.completed) return false
    if (activeFolder !== "all" && task.folderId !== Number.parseInt(activeFolder)) return false
    return true
  })

  const tasksByFolder = {}
  filteredTasks.forEach((task) => {
    const folderId = task.folderId
    if (!tasksByFolder[folderId]) tasksByFolder[folderId] = []
    tasksByFolder[folderId].push(task)
  })

  const remainingTasks = tasks.filter((task) => !task.completed).length

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020F2B] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A7E8D2] mx-auto mb-4"></div>
          <p>Loading your tasks...</p>
        </div>
      </div>
    )
  }

  console.log("Rendering TodoApp, user:", user)
  console.log("Folders:", folders)
  console.log("Tasks:", tasks)

  return (
    <div className="min-h-screen bg-[#020F2B] text-white flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="shadow-md bg-[#051640] border-none text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Folders</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddFolderModal(true)}
                    className="h-7 px-2 border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Folder
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveFolder("all")}
                    className={`w-full flex items-center p-2 rounded-md text-left ${
                      activeFolder === "all" ? theme.secondary : "hover:bg-[#031233]"
                    }`}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    <span>All Folders</span>
                  </button>
                  {folders.map((folder) => (
                    <div key={folder.id}>
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleFolderExpansion(folder.id)}
                          className="p-1 text-gray-400 hover:text-white"
                        >
                          {folder.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => setActiveFolder(folder.id.toString())}
                          className={`flex-1 flex items-center p-2 rounded-md text-left ${
                            activeFolder === folder.id.toString() ? theme.secondary : "hover:bg-[#031233]"
                          }`}
                        >
                          <span className="mr-2">{folder.icon}</span>
                          <span>{folder.name}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {tasks.filter((t) => t.folderId === folder.id && !t.completed).length}
                          </span>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-[#051640]/80">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#051640] text-white border-[#A7E8D2]/20">
                            <DropdownMenuItem
                              onClick={() => startEditFolder(folder)}
                              className="hover:bg-[#031233] cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteFolder(folder.id)}
                              className="text-red-400 hover:bg-[#031233] cursor-pointer"
                              disabled={folders.length <= 1}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-3">
            <Card className="shadow-lg bg-[#051640] border-none text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>
                    {activeFolder === "all"
                      ? "All Tasks"
                      : `${folders.find((f) => f.id.toString() === activeFolder)?.name} Tasks`}
                  </span>
                  <div className="flex items-center gap-2">
                    <AddTaskButton onAddTask={handleAddTask} folders={folders.length > 0 ? folders : defaultFolders} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                      onClick={goToSummary}
                    >
                      <BarChart2 className="h-3.5 w-3.5 mr-1" />
                      View Summary
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-0">
                <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
                  <TabsList className="grid w-full grid-cols-3 bg-[#031233]">
                    <TabsTrigger value="all" className={theme.activeTab}>
                      All
                    </TabsTrigger>
                    <TabsTrigger value="active" className={theme.activeTab}>
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="completed" className={theme.activeTab}>
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {activeFolder === "all" ? (
                  folders.map((folder) => {
                    const folderTasks = tasksByFolder[folder.id] || []
                    if (folderTasks.length === 0) return null
                    return (
                      <div key={folder.id} className="mb-6">
                        <div className="flex items-center mb-2 p-2 rounded-md bg-[#031233]">
                          <span className="mr-2">{folder.icon}</span>
                          <h3 className="font-medium">{folder.name}</h3>
                          <span className="ml-auto text-xs text-gray-400">
                            {folderTasks.filter((t) => !t.completed).length} active
                          </span>
                        </div>
                        <div className="space-y-2">
                          {folderTasks.map((task) => (
                            <div
                              key={task.id}
                              className={`flex items-center justify-between ${compactMode ? "py-2" : "p-3"} bg-[#031233] rounded-lg border border-[#051640] hover:bg-[#031233]/80`}
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <button
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className={`mr-3 flex-shrink-0 ${theme.accent}`}
                                >
                                  {task.completed ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className={`truncate ${task.completed ? "line-through text-gray-400" : ""}`}>
                                    {task.text}
                                  </div>
                                  <div className="flex items-center text-xs text-gray-400 mt-1">
                                    <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(task.priority)}`} />
                                    <span className="mr-2">{task.priority}</span>

                                    {task.dueDate && (
                                      <>
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span className="mr-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                      </>
                                    )}

                                    {task.comments && task.comments.length > 0 && (
                                      <>
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        <span>{task.comments.length}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditTask(task)}
                                  className="h-10 w-10 p-0 text-gray-400 hover:text-white"
                                >
                                  <Edit className="h-5 w-5" />
                                </Button>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-gray-400 hover:text-red-400 ml-2 flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="space-y-2">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between ${compactMode ? "py-2" : "p-3"} bg-[#031233] rounded-lg border border-[#051640] hover:bg-[#031233]/80`}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`mr-3 flex-shrink-0 ${theme.accent}`}
                            >
                              {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className={`truncate ${task.completed ? "line-through text-gray-400" : ""}`}>
                                {task.text}
                              </div>
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <Flag className={`h-3 w-3 mr-1 ${getPriorityColor(task.priority)}`} />
                                <span className="mr-2">{task.priority}</span>

                                {task.dueDate && (
                                  <>
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span className="mr-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </>
                                )}

                                {task.comments && task.comments.length > 0 && (
                                  <>
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    <span>{task.comments.length}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                              className="h-10 w-10 p-0 text-gray-400 hover:text-white"
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-400 hover:text-red-400 ml-2 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-400 bg-[#031233] rounded-lg">
                        {activeFilter === "all"
                          ? "No tasks in this folder yet. Add one!"
                          : activeFilter === "active"
                            ? "No active tasks in this folder!"
                            : "No completed tasks in this folder!"}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <div className="text-sm text-gray-400">
                  {remainingTasks} {remainingTasks === 1 ? "task" : "tasks"} remaining
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  disabled={!tasks.some((task) => task.completed)}
                  className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                >
                  Clear completed
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="bg-[#051640] py-4 border-t border-[#A7E8D2]/10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          ToDone App © {new Date().getFullYear()}
        </div>
      </footer>
      <div className="fixed bottom-6 left-6 z-[9998]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#051640] border-[#A7E8D2]/20 text-white hover:bg-[#031233] h-10 w-10 rounded-full p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#051640] text-white border-[#A7E8D2]/20">
            <DropdownMenuItem
              className="flex items-center justify-between hover:bg-[#031233] cursor-pointer"
              onClick={() => setCompactMode(!compactMode)}
            >
              <span>Compact Mode</span>
              <span>{compactMode ? "✓" : ""}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between hover:bg-[#031233] cursor-pointer"
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            >
              <span>Show Completed</span>
              <span>{showCompletedTasks ? "✓" : ""}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add/Edit Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-[#051640] text-white rounded-lg shadow-xl w-full max-w-sm p-4 mx-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">{editingFolder ? "Edit Folder" : "Add New Folder"}</h2>
              <button onClick={() => setShowAddFolderModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="folder-name" className="text-sm">
                  Folder Name
                </Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="bg-[#031233] border-gray-700 text-white h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Choose Icon</Label>
                <div className="grid grid-cols-6 gap-1">
                  {["📁", "🏠", "💼", "🏋️", "📚", "🎮"].map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setNewFolderIcon(icon)}
                      className={`text-lg p-1.5 rounded ${newFolderIcon === icon ? theme.secondary : "hover:bg-[#031233]"}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddFolderModal(false)}
                  className="border-[#A7E8D2]/50 text-white hover:bg-[#031233] h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 h-8"
                  onClick={editingFolder ? updateFolder : addFolder}
                >
                  {editingFolder ? "Update" : "Add"} Folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={saveEditedTask}
          folders={folders}
        />
      )}
    </div>
  )
}

