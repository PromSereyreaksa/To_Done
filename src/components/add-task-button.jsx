"use client"

import { useState } from "react"
import { Plus, Briefcase, Home, Activity, Flag, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"

export default function AddTaskButton({ onAddTask, folders, isTeamTask = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTask, setNewTask] = useState("")
  const [newTaskFolder, setNewTaskFolder] = useState(folders[0]?.id.toString() || "1")
  const [newTaskPriority, setNewTaskPriority] = useState("medium")
  const [dueDate, setDueDate] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Get folder icons based on folder ID
  const getFolderIcon = (folderId) => {
    const folderIcons = {
      1: <Home className="h-4 w-4 text-[#A7E8D2]" />,
      2: <Briefcase className="h-4 w-4 text-blue-400" />,
      3: <Activity className="h-4 w-4 text-orange-400" />,
    }

    // Find the folder by ID
    const folder = folders.find((f) => f.id === Number(folderId))
    if (folder && folder.icon) {
      return <span className="h-4 w-4 flex items-center justify-center">{folder.icon}</span>
    }

    return folderIcons[folderId] || <Home className="h-4 w-4 text-[#A7E8D2]" />
  }

  // Get folder name based on folder ID
  const getFolderName = (folderId) => {
    const folder = folders.find((f) => f.id === Number(folderId))
    return folder ? folder.name : `Folder ${folderId}`
  }

  // Get priority icon and color
  const getPriorityDetails = (priority) => {
    const details = {
      low: { icon: <Flag className="h-4 w-4 text-green-400" />, text: "Low Priority" },
      medium: { icon: <Flag className="h-4 w-4 text-yellow-400" />, text: "Medium Priority" },
      high: { icon: <Flag className="h-4 w-4 text-red-400" />, text: "High Priority" },
    }
    return details[priority] || details.medium
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (newTask.trim() === "") return

    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      folderId: Number.parseInt(newTaskFolder) || folders[0]?.id || 1,
      priority: newTaskPriority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      isTeamTask: isTeamTask,
    }

    onAddTask(newTaskObj)

    // Show success message
    setSuccessMessage(`Task "${newTask}" added successfully!`)
    setTimeout(() => setSuccessMessage(""), 3000)

    // Reset form
    setNewTask("")
    setNewTaskPriority("medium")
    setDueDate("")
    setIsOpen(false)
  }

  return (
    <>
      {/* Button that's part of the normal flow */}
      <Button
        onClick={() => setIsOpen(true)}
        size="sm"
        className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 h-7 px-2"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        <span>Add Task</span>
      </Button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-[#051640] text-white rounded-lg shadow-xl w-full max-w-md mx-4 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#A7E8D2]">Add New {isTeamTask ? "Team " : ""}Task</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#031233]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleAddTask}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="task-text" className="text-gray-300">
                    Task Description
                  </Label>
                  <Input
                    id="task-text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                    className="bg-[#031233] border-gray-700 text-white focus:border-[#A7E8D2]/70 focus:ring-1 focus:ring-[#A7E8D2]/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-priority" className="text-gray-300">
                    Priority
                  </Label>
                  <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                    <SelectTrigger
                      className="bg-[#031233] border-gray-700 text-white h-10 px-3 py-2"
                      id="task-priority"
                    >
                      <SelectValue>
                        <div className="flex items-center">
                          {getPriorityDetails(newTaskPriority).icon}
                          <span className="ml-2">{getPriorityDetails(newTaskPriority).text}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      className="bg-[#051640] text-white border-[#A7E8D2]/20 max-h-48"
                      position="popper"
                      sideOffset={5}
                    >
                      <SelectItem value="low" className="hover:bg-[#031233] cursor-pointer py-2">
                        <div className="flex items-center">
                          <Flag className="h-4 w-4 text-green-400" />
                          <span className="ml-2">Low Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium" className="hover:bg-[#031233] cursor-pointer py-2">
                        <div className="flex items-center">
                          <Flag className="h-4 w-4 text-yellow-400" />
                          <span className="ml-2">Medium Priority</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="high" className="hover:bg-[#031233] cursor-pointer py-2">
                        <div className="flex items-center">
                          <Flag className="h-4 w-4 text-red-400" />
                          <span className="ml-2">High Priority</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due-date" className="text-gray-300">
                    Due Date (Optional)
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[#031233] border-gray-700 text-white focus:border-[#A7E8D2]/70 focus:ring-1 focus:ring-[#A7E8D2]/50"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                {!isTeamTask && (
                  <div className="space-y-2">
                    <Label htmlFor="task-folder" className="text-gray-300">
                      Folder (Optional)
                    </Label>
                    <Select value={newTaskFolder} onValueChange={(value) => setNewTaskFolder(value)}>
                      <SelectTrigger
                        className="bg-[#031233] border-gray-700 text-white h-10 px-3 py-2"
                        id="task-folder"
                      >
                        <div className="flex items-center">
                          {getFolderIcon(Number(newTaskFolder))}
                          <span className="ml-2">{getFolderName(newTaskFolder)}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent
                        className="bg-[#051640] text-white border-[#A7E8D2]/20 max-h-48"
                        position="popper"
                        sideOffset={5}
                      >
                        {folders.map((folder) => (
                          <SelectItem
                            key={folder.id}
                            value={folder.id.toString()}
                            className="hover:bg-[#031233] cursor-pointer py-2"
                          >
                            <div className="flex items-center">
                              {getFolderIcon(folder.id)}
                              <span className="ml-2">{folder.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {successMessage && (
                  <div className="p-2 bg-green-500/20 border border-green-500 text-green-100 rounded text-center text-sm animate-pulse">
                    {successMessage}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 font-medium">
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

