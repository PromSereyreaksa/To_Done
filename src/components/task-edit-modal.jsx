"use client"

import { useState, useEffect } from "react"
import { X, Flag, Users, MessageSquare, Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Textarea } from "./ui/textarea"

export default function TaskEditModal({ task, onClose, onSave, folders = [], isTeamTask = false, teamMembers = [] }) {
  const [editedTask, setEditedTask] = useState({ ...task })
  const [newComment, setNewComment] = useState("")

  // Initialize comments array if it doesn't exist
  useEffect(() => {
    if (!editedTask.comments) {
      setEditedTask((prev) => ({ ...prev, comments: [] }))
    }
  }, [])

  const handleChange = (field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(editedTask)
    onClose()
  }

  const addComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      text: newComment,
      createdAt: new Date().toISOString(),
      userId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id || 0 : 0,
      userName: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name || "You" : "You",
    }

    setEditedTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), comment],
    }))

    setNewComment("")
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

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
      <div className="bg-[#051640] text-white rounded-lg shadow-xl w-full max-w-md p-4 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Task Text */}
          <div className="space-y-2">
            <Label htmlFor="task-text">Task Description</Label>
            <Input
              id="task-text"
              value={editedTask.text}
              onChange={(e) => handleChange("text", e.target.value)}
              placeholder="What needs to be done?"
              className="bg-[#031233] border-gray-700 text-white"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="task-priority">Priority</Label>
            <Select value={editedTask.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger className="bg-[#031233] border-gray-700 text-white" id="task-priority">
                <SelectValue>
                  <div className="flex items-center">
                    <Flag className={`h-4 w-4 mr-2 ${getPriorityColor(editedTask.priority)}`} />
                    <span>{editedTask.priority} priority</span>
                  </div>
                </SelectValue>
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

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={formatDateForInput(editedTask.dueDate)}
              onChange={(e) => handleChange("dueDate", e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="bg-[#031233] border-gray-700 text-white"
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Folder Selection (for personal tasks) */}
          {!isTeamTask && folders.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="task-folder">Folder</Label>
              <Select
                value={editedTask.folderId?.toString()}
                onValueChange={(value) => handleChange("folderId", Number(value))}
              >
                <SelectTrigger className="bg-[#031233] border-gray-700 text-white" id="task-folder">
                  {editedTask.folderId ? (
                    <div className="flex items-center">
                      <span className="mr-2">{folders.find((f) => f.id === editedTask.folderId)?.icon || "📁"}</span>
                      <span>
                        {folders.find((f) => f.id === editedTask.folderId)?.name || `Folder ${editedTask.folderId}`}
                      </span>
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
            </div>
          )}

          {/* Team Member Assignment (for team tasks) */}
          {isTeamTask && teamMembers.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assign To</Label>
              <Select
                value={editedTask.assigneeId?.toString() || ""}
                onValueChange={(value) => handleChange("assigneeId", value ? Number(value) : null)}
              >
                <SelectTrigger className="bg-[#031233] border-gray-700 text-white" id="task-assignee">
                  <SelectValue>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {editedTask.assigneeId
                        ? teamMembers.find((m) => m.id === editedTask.assigneeId)?.name || "Unassigned"
                        : "Unassigned"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                  <SelectItem value="" className="hover:bg-[#031233] cursor-pointer">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Unassigned</span>
                    </div>
                  </SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem
                      key={member.id}
                      value={member.id.toString()}
                      className="hover:bg-[#031233] cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-2 mt-6">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-[#A7E8D2]" />
              <Label>Comments</Label>
            </div>

            <div className="bg-[#031233] rounded-lg p-3 max-h-40 overflow-y-auto">
              {editedTask.comments && editedTask.comments.length > 0 ? (
                <div className="space-y-3">
                  {editedTask.comments.map((comment) => (
                    <div key={comment.id} className="bg-[#051640] p-2 rounded">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-2">
                  <p className="text-sm">No comments yet</p>
                </div>
              )}
            </div>

            <div className="flex mt-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="bg-[#031233] border-gray-700 text-white resize-none mr-2 flex-1"
                rows={2}
              />
              <Button
                onClick={addComment}
                className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80 self-end"
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

