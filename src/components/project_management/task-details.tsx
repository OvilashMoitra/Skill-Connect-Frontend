"use client"

import { useState } from "react"

// Task Details Component: Modal showing full task information with status updates and time logging
interface TaskDetailsProps {
  task: any
  onClose: () => void
  onUpdateStatus: (taskId: string, status: string) => void
  onLogTime: (taskId: string, hours: number) => void
}

export default function TaskDetails({ task, onClose, onUpdateStatus, onLogTime }: TaskDetailsProps) {
  const [hoursToLog, setHoursToLog] = useState("")
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  // Handle time logging
  const handleLogTime = () => {
    const hours = Number.parseFloat(hoursToLog)
    if (hours > 0) {
      onLogTime(task.id, hours)
      setHoursToLog("")
    }
  }

  // Handle adding a comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      task.comments.push({
        id: Date.now(),
        text: newComment,
        author: "Current User",
        timestamp: new Date().toISOString(),
      })
      setNewComment("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Modal header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <button onClick={onClose} className="text-2xl hover:text-accent transition">
            ✕
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 space-y-6">
          {/* Tabs for different sections */}
          <div className="flex gap-4 border-b border-border">
            {["details", "time", "comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-bold transition ${
                  activeTab === tab
                    ? "text-accent border-b-2 border-accent -mb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Details tab: shows task information */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={task.status}
                  onChange={(e) => {
                    onUpdateStatus(task.id, e.target.value)
                    onClose()
                  }}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Priority</label>
                  <div className="px-4 py-2 bg-input border border-border rounded-lg">
                    {task.priority.toUpperCase()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Assignee</label>
                  <div className="px-4 py-2 bg-input border border-border rounded-lg">{task.assignee}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <p className="text-muted-foreground">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Deadline</label>
                  <div className="px-4 py-2 bg-input border border-border rounded-lg text-sm">
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Estimated Time</label>
                  <div className="px-4 py-2 bg-input border border-border rounded-lg text-sm">
                    {task.estimatedTime} hours
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time tab: log work hours */}
          {activeTab === "time" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Time Logged</label>
                <div className="px-4 py-2 bg-input border border-border rounded-lg font-bold">
                  {task.timeLogged} / {task.estimatedTime} hours
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <label className="block text-sm font-bold">Progress</label>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min((task.timeLogged / task.estimatedTime) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Input to log additional hours */}
              <div className="space-y-2">
                <label className="block text-sm font-bold">Add Hours</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={hoursToLog}
                    onChange={(e) => setHoursToLog(e.target.value)}
                    placeholder="Hours worked"
                    className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleLogTime}
                    className="px-6 py-2 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 transition"
                  >
                    Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Comments tab: view and add comments */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              {/* Existing comments */}
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {task.comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No comments yet</p>
                ) : (
                  task.comments.map((comment: any) => (
                    <div key={comment.id} className="border-l-2 border-border pl-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add new comment */}
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="block text-sm font-bold">Add Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type your comment..."
                  rows={3}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddComment}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition"
                >
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
