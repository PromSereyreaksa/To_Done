"use client"

import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, Award, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { TaskChart } from "../components/task-chart"
import { CategoryChart } from "../components/category-chart"
import { useEffect, useState } from "react"

// Local storage keys
const STORAGE_KEYS = {
  TASKS: "todone-tasks",
  COMPLETED_TASKS: "todone-completed-tasks",
  FOLDERS: "todone-folders",
}

export default function TaskSummary() {
  const navigate = useNavigate()
  const [completedTasksData, setCompletedTasksData] = useState([])
  const [labels, setLabels] = useState([])
  const [tasks, setTasks] = useState([])
  const [completedTasksArchive, setCompletedTasksArchive] = useState([]) // New state for archived completed tasks
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  // Load tasks and folders from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS)
      const savedCompletedTasks = localStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS)
      const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS)

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        console.log("Loaded tasks from localStorage:", parsedTasks)
        setTasks(parsedTasks)
      }

      if (savedCompletedTasks) {
        const parsedCompletedTasks = JSON.parse(savedCompletedTasks)
        console.log("Loaded completed tasks from localStorage:", parsedCompletedTasks)
        setCompletedTasksArchive(parsedCompletedTasks)
      }

      if (savedFolders) {
        const parsedFolders = JSON.parse(savedFolders)
        console.log("Loaded folders from localStorage:", parsedFolders)
        setFolders(parsedFolders)
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate data for completed tasks per day
  useEffect(() => {
    if (loading) return

    // Combine completed tasks from both sources
    const allCompletedTasks = [...tasks.filter((task) => task.completed), ...completedTasksArchive]
    console.log("All completed tasks:", allCompletedTasks)

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: 0,
      }
    }).reverse()

    // Count completed tasks by day
    allCompletedTasks.forEach((task) => {
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt)
        const dayIndex = last7Days.findIndex(
          (day) =>
            day.date.getDate() === completedDate.getDate() &&
            day.date.getMonth() === completedDate.getMonth() &&
            day.date.getFullYear() === completedDate.getFullYear(),
        )
        if (dayIndex !== -1) last7Days[dayIndex].count++
      } else if (task.completed) {
        last7Days[last7Days.length - 1].count++
      }
    })

    // If we have no data, create some sample data based on completed tasks
    if (last7Days.every((day) => day.count === 0) && allCompletedTasks.length > 0) {
      allCompletedTasks.forEach((task, index) => {
        const dayIndex = index % 7
        last7Days[dayIndex].count++
      })
    }

    const newLabels = last7Days.map((day) => day.label)
    const newData = last7Days.map((day) => day.count)

    console.log("Setting chart data:", newData)
    console.log("Setting chart labels:", newLabels)

    setLabels(newLabels)
    setCompletedTasksData(newData)
  }, [tasks, completedTasksArchive, loading])

  // Calculate stats from actual task data
  const allCompletedTasks = [...tasks.filter((task) => task.completed), ...completedTasksArchive]

  const stats = {
    completed: allCompletedTasks.length,
    total: tasks.length + completedTasksArchive.length,
    streak: 5, // Placeholder; could be calculated based on history
    mostProductiveDay: "Monday", // Placeholder; could be calculated
    completionRate:
      tasks.length + completedTasksArchive.length > 0
        ? Math.round((allCompletedTasks.length / (tasks.length + completedTasksArchive.length)) * 100)
        : 0,
  }

  // Get folder name by ID
  const getFolderName = (folderId) => {
    const folder = folders.find((f) => f.id === folderId)
    return folder ? folder.name : `Folder ${folderId}`
  }

  // Priority colors
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }

  // Handle back button click
  const handleBackClick = () => {
    console.log("Navigating back to todo list")
    navigate("/todo")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020F2B] text-white flex items-center justify-center">
        <p>Loading summary...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackClick} className="mr-2 text-white hover:bg-[#051640]/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to todos
          </Button>
          <h1 className="text-3xl font-bold">Your Todo Summary</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-[#051640] border-none text-white">
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription className="text-gray-400">Your task completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-medium">{stats.completionRate}%</span>
                  </div>
                  <div className="h-2 bg-[#031233] rounded-full overflow-hidden">
                    <div className="h-full bg-[#A7E8D2]" style={{ width: `${stats.completionRate}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex flex-col items-center p-3 bg-[#031233] rounded-lg">
                    <CheckCircle className="h-8 w-8 text-[#A7E8D2] mb-2" />
                    <span className="text-2xl font-bold">{stats.completed}</span>
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-[#031233] rounded-lg">
                    <Award className="h-8 w-8 text-amber-500 mb-2" />
                    <span className="text-2xl font-bold">{stats.streak}</span>
                    <span className="text-sm text-gray-400">Day Streak</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#051640] border-none text-white">
            <CardHeader>
              <CardTitle>Completion by Category</CardTitle>
              <CardDescription className="text-gray-400">Distribution of completed tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <CategoryChart tasks={[...tasks, ...completedTasksArchive]} folders={folders} />
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-[#051640] border-none text-white">
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
            <CardDescription className="text-gray-400">Your completed tasks over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <TaskChart data={completedTasksData} labels={labels} title="Tasks Completed" />
          </CardContent>
        </Card>

        <Card className="mb-8 bg-[#051640] border-none text-white">
          <CardHeader>
            <CardTitle>Recently Completed Tasks</CardTitle>
            <CardDescription className="text-gray-400">Your last 5 completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {allCompletedTasks.slice(0, 5).map((task) => (
                <li key={task.id} className="flex items-center justify-between p-3 bg-[#031233] rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-[#A7E8D2] mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{task.text}</div>
                      <div className="text-sm text-gray-400">
                        <span>{getFolderName(task.folderId)} • </span>
                        {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "Completed recently"}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </div>
                </li>
              ))}
              {allCompletedTasks.length === 0 && (
                <li className="p-3 bg-[#031233] rounded-lg text-center text-gray-400">
                  No completed tasks yet. Start checking off some tasks!
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#051640] border-none text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{stats.completionRate >= 50 ? "Great Job!" : "Keep Going!"}</CardTitle>
            <CardDescription className="text-gray-400">
              You've completed {stats.completionRate}% of your tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#031233] mb-4">
              <CheckCircle className="h-12 w-12 text-[#A7E8D2]" />
            </div>
            <p className="text-gray-400 mb-4">
              {stats.completionRate >= 50
                ? "Keep up the good work! You're making excellent progress on your tasks."
                : "You're on your way! Keep focusing on completing your tasks."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80">
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>
            <Button variant="outline" className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]">
              Share Progress
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

