"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Users,
  Plus,
  UserPlus,
  MessageSquare,
  CheckCircle,
  Clock,
  Flag,
  X,
  Send,
  Folder,
  FileText,
  AlertTriangle,
  Edit,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useNotifications } from "../components/notification-system"
import { useAuth } from "../auth-context"
import AddTaskButton from "../components/add-task-button"
import TaskEditModal from "../components/task-edit-modal"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Switch } from "../components/ui/switch"

export default function TeamCollaboration() {
  const navigate = useNavigate()
  const { addNotification } = useNotifications()
  const auth = useAuth()
  const user = auth?.user || {}

  // State
  const [activeTab, setActiveTab] = useState("all")
  const [teamMembers, setTeamMembers] = useState([])
  const [teamTasks, setTeamTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [message, setMessage] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const [assigneeId, setAssigneeId] = useState("")
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [folders, setFolders] = useState([])
  const [showAddFolderModal, setShowAddFolderModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderIcon, setNewFolderIcon] = useState("📁")
  const [editingTask, setEditingTask] = useState(null)

  // Project states
  const [projects, setProjects] = useState([])
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [newProjectDescription, setNewProjectDescription] = useState("")
  const [selectedMembers, setSelectedMembers] = useState({})
  const [activeProject, setActiveProject] = useState(null)
  const [showProjectView, setShowProjectView] = useState(false)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState("")

  // New team member states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("")

  // Add task states
  const [newTaskFolderId, setNewTaskFolderId] = useState("")

  // Determine if we can create projects
  const canCreateProjects = teamMembers.length > 0

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load team members
      const savedTeamMembers = localStorage.getItem("todone-team-members")
      if (savedTeamMembers) {
        setTeamMembers(JSON.parse(savedTeamMembers))
      } else {
        // Default team members
        const defaultTeamMembers = [
          {
            id: 1,
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Product Manager",
            status: "online",
          },
          {
            id: 2,
            name: "Sarah Williams",
            email: "sarah@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Designer",
            status: "offline",
          },
          {
            id: 3,
            name: "Michael Chen",
            email: "michael@example.com",
            avatar: "/placeholder.svg?height=40&width=40",
            role: "Developer",
            status: "away",
          },
        ]
        setTeamMembers(defaultTeamMembers)
        localStorage.setItem("todone-team-members", JSON.stringify(defaultTeamMembers))
      }

      // Load team tasks
      const savedTeamTasks = localStorage.getItem("todone-team-tasks")
      if (savedTeamTasks) {
        setTeamTasks(JSON.parse(savedTeamTasks))
      } else {
        // Default team tasks
        const defaultTeamTasks = [
          {
            id: 101,
            text: "Finalize project requirements",
            completed: false,
            folderId: 2,
            priority: "high",
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 1,
            createdBy: user.id || 0,
            isTeamTask: true,
            projectId: 1,
            comments: [],
          },
          {
            id: 102,
            text: "Design homepage mockup",
            completed: true,
            folderId: 2,
            priority: "medium",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date().toISOString(),
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 2,
            createdBy: user.id || 0,
            isTeamTask: true,
            projectId: 1,
            comments: [],
          },
          {
            id: 103,
            text: "Implement authentication system",
            completed: false,
            folderId: 2,
            priority: "medium",
            createdAt: new Date().toISOString(),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            assigneeId: 3,
            createdBy: user.id || 0,
            isTeamTask: true,
            projectId: 2,
            comments: [],
          },
        ]
        setTeamTasks(defaultTeamTasks)
        localStorage.setItem("todone-team-tasks", JSON.stringify(defaultTeamTasks))
      }

      // Load activities
      const savedActivities = localStorage.getItem("todone-team-activities")
      if (savedActivities) {
        setActivities(JSON.parse(savedActivities))
      } else {
        // Default activities
        const defaultActivities = [
          {
            id: 1,
            type: "task_created",
            taskId: 101,
            userId: 1,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            type: "task_assigned",
            taskId: 101,
            userId: 1,
            assigneeId: 1,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            type: "task_created",
            taskId: 102,
            userId: 1,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 4,
            type: "task_assigned",
            taskId: 102,
            userId: 1,
            assigneeId: 2,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 5,
            type: "task_completed",
            taskId: 102,
            userId: 2,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 6,
            type: "message",
            userId: 3,
            message: "I'll start working on the authentication system tomorrow.",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          },
        ]
        setActivities(defaultActivities)
        localStorage.setItem("todone-team-activities", JSON.stringify(defaultActivities))
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

      // Load projects
      const savedProjects = localStorage.getItem("todone-projects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      } else {
        // Default projects
        const defaultProjects = [
          {
            id: 1,
            name: "Website Redesign",
            description: "Redesign the company website with new branding",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            createdBy: 1,
            members: [1, 2, 3],
            tasks: [101, 102],
          },
          {
            id: 2,
            name: "Mobile App Development",
            description: "Develop a new mobile app for customers",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdBy: 1,
            members: [1, 3],
            tasks: [103],
          },
        ]
        setProjects(defaultProjects)
        localStorage.setItem("todone-projects", JSON.stringify(defaultProjects))
      }
    } catch (error) {
      console.error("Error loading team data:", error)
    }
  }, [user.id])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("todone-team-members", JSON.stringify(teamMembers))
  }, [teamMembers])

  useEffect(() => {
    localStorage.setItem("todone-team-tasks", JSON.stringify(teamTasks))
  }, [teamTasks])

  useEffect(() => {
    localStorage.setItem("todone-team-activities", JSON.stringify(activities))
  }, [activities])

  useEffect(() => {
    localStorage.setItem("todone-folders", JSON.stringify(folders))
  }, [folders])

  useEffect(() => {
    localStorage.setItem("todone-projects", JSON.stringify(projects))
  }, [projects])

  // Handle adding a new team member
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      addNotification({
        title: "Error",
        message: "Name and email are required",
        type: "error",
        showToast: true,
      })
      return
    }

    // Check if email already exists
    if (teamMembers.some((member) => member.email === newMemberEmail)) {
      addNotification({
        title: "Error",
        message: "A team member with this email already exists",
        type: "error",
        showToast: true,
      })
      return
    }

    // Create new team member
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole || "Team Member",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
    }

    const updatedTeamMembers = [...teamMembers, newMember]
    setTeamMembers(updatedTeamMembers)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-members", JSON.stringify(updatedTeamMembers))

    // Add activity
    addActivity({
      type: "member_added",
      userId: user.id || 0,
      newMemberId: newMember.id,
      newMemberName: newMember.name,
    })

    // Add notification
    addNotification({
      title: "Team Member Added",
      message: `${newMemberName} has been added to the team`,
      type: "success",
      showToast: true,
    })

    // Reset form
    setNewMemberName("")
    setNewMemberEmail("")
    setNewMemberRole("")
    setShowAddMemberModal(false)
  }

  // Handle inviting a team member
  const handleInvite = () => {
    if (!inviteEmail.trim()) return

    // Check if email already exists
    if (teamMembers.some((member) => member.email === inviteEmail)) {
      addNotification({
        title: "Invitation Failed",
        message: "This email is already a team member",
        type: "error",
        showToast: true,
      })
      return
    }

    // Create new team member
    const newMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0], // Use part of email as name
      email: inviteEmail,
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Team Member",
      status: "invited",
    }

    const updatedTeamMembers = [...teamMembers, newMember]
    setTeamMembers(updatedTeamMembers)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-members", JSON.stringify(updatedTeamMembers))

    // Add activity
    addActivity({
      type: "member_invited",
      userId: user.id || 0,
      inviteeEmail: inviteEmail,
    })

    // Add notification
    addNotification({
      title: "Team Invitation Sent",
      message: `Invitation sent to ${inviteEmail}`,
      type: "success",
      showToast: true,
    })

    setInviteEmail("")
    setShowInviteDialog(false)
  }

  // Handle adding a folder
  const addFolder = () => {
    if (newFolderName.trim() === "") return
    const newFolder = { id: Date.now(), name: newFolderName, icon: newFolderIcon, expanded: true }

    const updatedFolders = [...folders, newFolder]
    setFolders(updatedFolders)

    // Save to localStorage immediately
    localStorage.setItem("todone-folders", JSON.stringify(updatedFolders))

    // Add activity
    addActivity({
      type: "folder_created",
      userId: user.id || 0,
      folderName: newFolderName,
    })

    // Add notification
    addNotification({
      title: "Folder Created",
      message: `Folder "${newFolderName}" has been created`,
      type: "success",
      showToast: true,
    })

    setNewFolderName("")
    setNewFolderIcon("📁")
    setShowAddFolderModal(false)
  }

  // Handle adding a project
  const addProject = () => {
    if (newProjectName.trim() === "") return

    // Check if there are team members
    if (teamMembers.length === 0) {
      addNotification({
        title: "Project Creation Failed",
        message: "You need to add team members before creating a project",
        type: "error",
        showToast: true,
      })
      return
    }

    // Get selected member IDs
    const memberIds = Object.entries(selectedMembers)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => Number(id))

    if (memberIds.length === 0) {
      addNotification({
        title: "Project Creation Failed",
        message: "Please select at least one team member",
        type: "error",
        showToast: true,
      })
      return
    }

    const newProject = {
      id: Date.now(),
      name: newProjectName,
      description: newProjectDescription,
      createdAt: new Date().toISOString(),
      createdBy: user.id || 0,
      members: memberIds,
      tasks: [],
    }

    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)

    // Save to localStorage immediately
    localStorage.setItem("todone-projects", JSON.stringify(updatedProjects))

    // Add activity
    addActivity({
      type: "project_created",
      userId: user.id || 0,
      projectName: newProjectName,
      projectId: newProject.id,
    })

    // Add notification
    addNotification({
      title: "Project Created",
      message: `Project "${newProjectName}" has been created`,
      type: "success",
      showToast: true,
    })

    setNewProjectName("")
    setNewProjectDescription("")
    setSelectedMembers({})
    setShowAddProjectModal(false)
  }

  // Handle adding a team task
  const handleAddTeamTask = (newTaskObj) => {
    // Ensure the task has a comments array
    if (!newTaskObj.comments) {
      newTaskObj.comments = []
    }

    // Add team-specific properties
    const teamTask = {
      ...newTaskObj,
      assigneeId: null,
      createdBy: user.id || 0,
      projectId: Number(selectedProjectId),
      folderId: Number(newTaskFolderId) || newTaskObj.folderId || folders[0].id, // Use selected folder or default
      isTeamTask: true,
    }

    // Update team tasks in state
    const updatedTeamTasks = [...teamTasks, teamTask]
    setTeamTasks(updatedTeamTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-tasks", JSON.stringify(updatedTeamTasks))

    // Add this task to the project
    const projectId = Number(selectedProjectId)
    const updatedProjects = projects.map((project) =>
      project.id === projectId ? { ...project, tasks: [...project.tasks, teamTask.id] } : project,
    )
    setProjects(updatedProjects)
    localStorage.setItem("todone-projects", JSON.stringify(updatedProjects))

    // Add activity
    addActivity({
      type: "task_created",
      taskId: teamTask.id,
      userId: user.id || 0,
      projectId: projectId,
    })

    // Add notification
    addNotification({
      title: "Team Task Added",
      message: `"${teamTask.text}" added to project ${getProjectById(projectId).name}`,
      type: "success",
      showToast: true,
    })

    setShowAddTaskDialog(false)
    setSelectedProjectId("")
    setNewTaskFolderId("")
  }

  // Handle task completion toggle
  const toggleTaskCompletion = (id) => {
    const updatedTasks = teamTasks.map((task) => {
      if (task.id === id) {
        const completed = !task.completed

        // Add activity if task is completed
        if (completed) {
          addActivity({
            type: "task_completed",
            taskId: id,
            userId: user.id || 0,
            projectId: task.projectId,
          })
        }

        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        }
      }
      return task
    })

    setTeamTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-tasks", JSON.stringify(updatedTasks))

    // Show notification
    const task = teamTasks.find((t) => t.id === id)
    if (task) {
      addNotification({
        title: task.completed ? "Task Uncompleted" : "Task Completed",
        message: `"${task.text}" has been ${task.completed ? "marked as incomplete" : "completed"}`,
        type: task.completed ? "info" : "success",
        showToast: true,
      })
    }
  }

  // Handle task assignment
  const handleAssignTask = () => {
    if (!selectedTask || !assigneeId) return

    const updatedTasks = teamTasks.map((task) => {
      if (task.id === selectedTask) {
        return {
          ...task,
          assigneeId: Number(assigneeId),
        }
      }
      return task
    })

    setTeamTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-tasks", JSON.stringify(updatedTasks))

    // Add activity
    addActivity({
      type: "task_assigned",
      taskId: selectedTask,
      userId: user.id || 0,
      assigneeId: Number(assigneeId),
    })

    // Add notification
    const task = teamTasks.find((t) => t.id === selectedTask)
    const assignee = teamMembers.find((m) => m.id === Number(assigneeId))

    addNotification({
      title: "Task Assigned",
      message: `"${task?.text}" assigned to ${assignee?.name}`,
      type: "success",
      showToast: true,
    })

    setSelectedTask(null)
    setAssigneeId("")
    setShowAssignDialog(false)
  }

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditingTask(task)
  }

  const saveEditedTask = (editedTask) => {
    const updatedTasks = teamTasks.map((task) => (task.id === editedTask.id ? editedTask : task))
    setTeamTasks(updatedTasks)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-tasks", JSON.stringify(updatedTasks))

    // Add activity
    addActivity({
      type: "task_updated",
      taskId: editedTask.id,
      userId: user.id || 0,
      projectId: editedTask.projectId,
    })

    // Show notification
    addNotification({
      title: "Task Updated",
      message: `"${editedTask.text}" has been updated`,
      type: "success",
      showToast: true,
    })
  }

  // Open project view
  const openProject = (project) => {
    setActiveProject(project)
    setShowProjectView(true)
  }

  // Close project view
  const closeProject = () => {
    setActiveProject(null)
    setShowProjectView(false)
  }

  // Add activity
  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...activity,
    }

    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)

    // Save to localStorage immediately
    localStorage.setItem("todone-team-activities", JSON.stringify(updatedActivities))
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add message activity
    addActivity({
      type: "message",
      userId: user.id || 0,
      message,
      projectId: activeProject ? activeProject.id : null,
    })

    setMessage("")
  }

  // Get user by ID
  const getUserById = (id) => {
    return teamMembers.find((member) => member.id === id) || { name: "Unknown User" }
  }

  // Get task by ID
  const getTaskById = (id) => {
    return teamTasks.find((task) => task.id === id) || { text: "Unknown Task" }
  }

  // Get folder by ID
  const getFolderById = (id) => {
    return folders.find((folder) => folder.id === id) || { name: "Unknown Folder", icon: "📁" }
  }

  // Get project by ID
  const getProjectById = (id) => {
    return projects.find((project) => project.id === id) || { name: "Unknown Project" }
  }

  // Format activity
  const formatActivity = (activity) => {
    const activityUser = getUserById(activity.userId)
    const date = new Date(activity.timestamp)

    switch (activity.type) {
      case "task_created":
        const createdTask = getTaskById(activity.taskId)
        return {
          icon: <Plus className="h-4 w-4 text-blue-400" />,
          text: `${activityUser.name} created task "${createdTask.text}"`,
        }
      case "task_assigned":
        const assignedTask = getTaskById(activity.taskId)
        const assignee = getUserById(activity.assigneeId)
        return {
          icon: <UserPlus className="h-4 w-4 text-green-400" />,
          text: `${activityUser.name} assigned "${assignedTask.text}" to ${assignee.name}`,
        }
      case "task_completed":
        const completedTask = getTaskById(activity.taskId)
        return {
          icon: <CheckCircle className="h-4 w-4 text-[#A7E8D2]" />,
          text: `${activityUser.name} completed "${completedTask.text}"`,
        }
      case "task_updated":
        const updatedTask = getTaskById(activity.taskId)
        return {
          icon: <Edit className="h-4 w-4 text-yellow-400" />,
          text: `${activityUser.name} updated task "${updatedTask.text}"`,
        }
      case "member_invited":
        return {
          icon: <UserPlus className="h-4 w-4 text-blue-400" />,
          text: `${activityUser.name} invited ${activity.inviteeEmail} to the team`,
        }
      case "member_added":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-400" />,
          text: `${activityUser.name} added ${activity.newMemberName} to the team`,
        }
      case "folder_created":
        return {
          icon: <Folder className="h-4 w-4 text-blue-400" />,
          text: `${activityUser.name} created folder "${activity.folderName}"`,
        }
      case "project_created":
        return {
          icon: <FileText className="h-4 w-4 text-purple-400" />,
          text: `${activityUser.name} created project "${activity.projectName}"`,
        }
      case "message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-yellow-400" />,
          text: `${activityUser.name}: ${activity.message}`,
          isMessage: true,
        }
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-400" />,
          text: "Unknown activity",
        }
    }
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

  // Filter tasks based on active tab and project
  const filteredTasks = teamTasks.filter((task) => {
    // First filter by project if we're in project view
    if (showProjectView && activeProject) {
      if (!activeProject.tasks.includes(task.id)) return false
    }

    // Then filter by tab
    if (activeTab === "all") return true
    if (activeTab === "my-tasks") return task.assigneeId === (user.id || 0)
    if (activeTab === "unassigned") return !task.assigneeId
    if (activeTab === "completed") return task.completed
    return true
  })

  // Check if we can add team tasks
  const canAddTeamTasks = projects.length > 0

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
            <h1 className="text-3xl font-bold">
              {showProjectView && activeProject ? `Project: ${activeProject.name}` : "Team Collaboration"}
            </h1>
            {showProjectView && activeProject && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeProject}
                className="ml-4 text-white hover:bg-[#051640]/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to all projects
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Team Members and Projects */}
          <div className="md:col-span-1">
            {!showProjectView && (
              <>
                <Card className="bg-[#051640] border-none text-white mb-6">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>Team Members</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                        onClick={() => setShowAddMemberModal(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add Member
                      </Button>
                      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Email Address</Label>
                              <Input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="bg-[#031233] border-gray-700 text-white"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]">
                                Cancel
                              </Button>
                            </DialogClose>
                            <Button
                              onClick={handleInvite}
                              className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                              disabled={!inviteEmail.trim()}
                            >
                              Send Invitation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center p-3 bg-[#031233] rounded-lg">
                          <div className="relative">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <span
                              className={`absolute bottom-0 right-2 w-3 h-3 rounded-full ${
                                member.status === "online"
                                  ? "bg-green-500"
                                  : member.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                              }`}
                            ></span>
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-gray-400">{member.role}</div>
                          </div>
                        </div>
                      ))}

                      {teamMembers.length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                          <p>No team members yet. Add your first team member!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Projects */}
                <Card className="bg-[#051640] border-none text-white mb-6">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>Projects</CardTitle>
                    <Button
                      size="sm"
                      className={`${canCreateProjects ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                      onClick={() => {
                        if (canCreateProjects) {
                          setShowAddProjectModal(true)
                        } else {
                          addNotification({
                            title: "Cannot Create Project",
                            message: "You need to add team members before creating a project",
                            type: "warning",
                            showToast: true,
                          })
                        }
                      }}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      New Project
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="p-3 bg-[#031233] rounded-lg hover:bg-[#031233]/80 cursor-pointer"
                          onClick={() => openProject(project)}
                        >
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <span className="mr-2">{project.tasks.length} tasks</span>
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {project.members.length} members
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Created {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}

                      {projects.length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                          <p>No projects yet. Create your first project!</p>
                          {!canCreateProjects && (
                            <p className="mt-2 text-yellow-400 flex items-center justify-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Add team members first
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Folders */}
                <Card className="bg-[#051640] border-none text-white mb-6">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>Folders</CardTitle>
                    <Button
                      size="sm"
                      className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                      onClick={() => setShowAddFolderModal(true)}
                    >
                      <Folder className="h-4 w-4 mr-1" />
                      Add Folder
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {folders.map((folder) => (
                        <div key={folder.id} className="flex items-center p-2 bg-[#031233] rounded-lg">
                          <span className="mr-2">{folder.icon}</span>
                          <span className="font-medium">{folder.name}</span>
                          <span className="ml-auto text-xs text-gray-400">
                            {teamTasks.filter((t) => t.folderId === folder.id).length} tasks
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Activity Feed */}
            <Card className="bg-[#051640] border-none text-white">
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {activities
                    .filter(
                      (activity) =>
                        !showProjectView ||
                        !activeProject ||
                        !activity.projectId ||
                        activity.projectId === activeProject.id,
                    )
                    .map((activity) => {
                      const formattedActivity = formatActivity(activity)
                      return (
                        <div
                          key={activity.id}
                          className={`p-3 ${formattedActivity.isMessage ? "bg-[#031233]/70" : "bg-[#031233]"} rounded-lg`}
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-0.5">{formattedActivity.icon}</div>
                            <div className="flex-1">
                              <p className="text-sm">{formattedActivity.text}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#A7E8D2]/10 pt-4">
                <div className="flex w-full">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-[#031233] border-gray-700 text-white mr-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Team Tasks */}
          <div className="md:col-span-2">
            <Card className="bg-[#051640] border-none text-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {showProjectView && activeProject ? `${activeProject.name} Tasks` : "Team Tasks"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className={`${canAddTeamTasks ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80" : "bg-gray-600 text-gray-300 cursor-not-allowed"}`}
                      onClick={() => setShowAddTaskDialog(true)}
                      disabled={!canAddTeamTasks}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </div>
                {showProjectView && activeProject && (
                  <div className="text-sm text-gray-400 mt-2">{activeProject.description}</div>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
                  <TabsList className="grid w-full grid-cols-4 bg-[#031233]">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2]"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="my-tasks"
                      className="data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2]"
                    >
                      My Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="unassigned"
                      className="data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2]"
                    >
                      Unassigned
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="data-[state=active]:bg-[#A7E8D2]/20 data-[state=active]:text-[#A7E8D2]"
                    >
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-[#031233] rounded-lg border border-[#051640] hover:bg-[#031233]/80"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className="mr-3 flex-shrink-0 text-[#A7E8D2]"
                          >
                            {task.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-[#A7E8D2]" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium truncate ${task.completed ? "line-through text-gray-400" : ""}`}
                            >
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

                              {task.assigneeId ? (
                                <span>Assigned to: {getUserById(task.assigneeId).name}</span>
                              ) : (
                                <span className="text-yellow-400">Unassigned</span>
                              )}

                              <span className="ml-2 text-blue-400">
                                {getFolderById(task.folderId).icon} {getFolderById(task.folderId).name}
                              </span>

                              {task.comments && task.comments.length > 0 && (
                                <span className="ml-2 flex items-center">
                                  <MessageSquare className="h-3 w-3 mr-1 text-[#A7E8D2]" />
                                  {task.comments.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                onClick={() => {
                                  setSelectedTask(task.id)
                                  setAssigneeId(task.assigneeId?.toString() || "")
                                }}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                              <DialogHeader>
                                <DialogTitle>Assign Task</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="p-3 bg-[#031233] rounded-lg mb-4">
                                  <p className="font-medium">{task.text}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Assign to</Label>
                                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                                    <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                                      <SelectValue placeholder="Select team member" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                                      {teamMembers.map((member) => (
                                        <SelectItem
                                          key={member.id}
                                          value={member.id.toString()}
                                          className="hover:bg-[#031233] cursor-pointer"
                                        >
                                          {member.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    onClick={handleAssignTask}
                                    className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                                    disabled={!assigneeId}
                                  >
                                    Assign
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
                            onClick={() => {
                              const updatedTasks = teamTasks.filter((t) => t.id !== task.id)
                              setTeamTasks(updatedTasks)

                              // Save to localStorage immediately
                              localStorage.setItem("todone-team-tasks", JSON.stringify(updatedTasks))

                              // If we're in a project, remove this task from the project
                              if (activeProject) {
                                const updatedProjects = projects.map((project) =>
                                  project.id === activeProject.id
                                    ? { ...project, tasks: project.tasks.filter((id) => id !== task.id) }
                                    : project,
                                )
                                setProjects(updatedProjects)
                                localStorage.setItem("todone-projects", JSON.stringify(updatedProjects))
                              }

                              addActivity({
                                type: "task_deleted",
                                taskId: task.id,
                                userId: user.id || 0,
                                projectId: activeProject ? activeProject.id : null,
                              })

                              // Show notification
                              addNotification({
                                title: "Task Deleted",
                                message: `"${task.text}" has been deleted`,
                                type: "info",
                                showToast: true,
                              })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-400 bg-[#031233] rounded-lg">
                      {activeTab === "all"
                        ? "No team tasks yet. Add one!"
                        : activeTab === "my-tasks"
                          ? "You don't have any assigned tasks."
                          : activeTab === "unassigned"
                            ? "No unassigned tasks."
                            : "No completed tasks."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter team member's name"
                className="bg-[#031233] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="bg-[#031233] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-role">Role (Optional)</Label>
              <Input
                id="member-role"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="e.g. Designer, Developer, Manager"
                className="bg-[#031233] border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberModal(false)}
              className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
              disabled={!newMemberName.trim() || !newMemberEmail.trim()}
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-[#051640] text-white rounded-lg shadow-xl w-full max-w-sm p-4 mx-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Add New Folder</h2>
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
                      className={`text-lg p-1.5 rounded ${newFolderIcon === icon ? "bg-[#A7E8D2]/20 text-[#A7E8D2]" : "hover:bg-[#031233]"}`}
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
                  onClick={addFolder}
                >
                  Add Folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-[#051640] text-white rounded-lg shadow-xl w-full max-w-md p-4 mx-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Create New Project</h2>
              <button onClick={() => setShowAddProjectModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="bg-[#031233] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Description</Label>
                <Input
                  id="project-description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Brief description of the project"
                  className="bg-[#031233] border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="bg-[#031233] border border-gray-700 rounded-md p-2 max-h-48 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center py-2 border-b border-gray-700 last:border-0">
                      <div className="flex items-center flex-1">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.role}</div>
                        </div>
                      </div>
                      <Switch
                        checked={selectedMembers[member.id] || false}
                        onCheckedChange={(checked) => {
                          setSelectedMembers((prev) => ({
                            ...prev,
                            [member.id]: checked,
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddProjectModal(false)}
                  className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                  onClick={addProject}
                  disabled={!newProjectName.trim() || Object.values(selectedMembers).filter(Boolean).length === 0}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
          <DialogHeader>
            <DialogTitle>Add Team Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Project <span className="text-red-400">*</span>
              </Label>
              <div className="flex gap-2">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId} className="flex-1">
                  <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                    {selectedProjectId ? (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-400" />
                        {getProjectById(Number(selectedProjectId)).name}
                      </div>
                    ) : (
                      <span>Select project</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                        className="hover:bg-[#031233] cursor-pointer"
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProjectId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-400 hover:text-white"
                    onClick={() => setSelectedProjectId("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {projects.length === 0 && <p className="text-xs text-yellow-400">You need to create a project first</p>}
            </div>

            {selectedProjectId && (
              <div className="space-y-2">
                <Label>Folder (Optional)</Label>
                <div className="flex gap-2">
                  <Select value={newTaskFolderId} onValueChange={setNewTaskFolderId} className="flex-1">
                    <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                      {newTaskFolderId ? (
                        <div className="flex items-center">
                          <span className="mr-2">{getFolderById(Number(newTaskFolderId)).icon}</span>
                          {getFolderById(Number(newTaskFolderId)).name}
                        </div>
                      ) : (
                        <span>Select folder</span>
                      )}
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
                  {newTaskFolderId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-white"
                      onClick={() => setNewTaskFolderId("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {selectedProjectId && <AddTaskButton onAddTask={handleAddTeamTask} folders={folders} isTeamTask={true} />}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTaskDialog(false)}
              className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Edit Modal */}
      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={saveEditedTask}
          folders={folders}
          isTeamTask={true}
          teamMembers={teamMembers}
        />
      )}
    </div>
  )
}

