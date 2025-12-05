"use client"

/**
 * Task Details Modal Component
 * Comprehensive task view with status updates, time logging, and comments
 * Shows task dependencies and blocks dependent tasks
 */
import { useState } from "react"

export default function TaskDetailsModal({ task, project, onClose, onUpdateStatus, onAddComment, developer }) {
  const [activeTab, setActiveTab] = useState("details") // details, time, comments
  const [comment, setComment] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  // Show team comments or just private ones (for developers)
  const visibleComments =
    developer && task.comments.some((c) => c.isPrivate) ? task.comments.filter((c) => !c.isPrivate) : task.comments

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background border-4 border-primary w-full max-w-2xl rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b-4 border-primary p-8 flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-black mb-2">{task.title}</h2>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
          <button onClick={onClose} className="text-3xl font-bold hover:opacity-50 transition">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-border">
          {["details", "time", "comments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 font-bold text-lg transition border-b-4 ${
                activeTab === tab
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent hover:bg-secondary"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Status */}
              <div>
                <label className="block text-lg font-bold mb-3">Status</label>
                <div className="flex gap-3">
                  {["not-started", "in-progress", "completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateStatus(task.id, status)
                        onClose()
                      }}
                      className={`px-6 py-3 font-bold rounded transition ${
                        task.status === status
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent"
                      }`}
                    >
                      {status === "not-started"
                        ? "○ Not Started"
                        : status === "in-progress"
                          ? "→ In Progress"
                          : "✓ Completed"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-secondary p-6 rounded border-2 border-border">
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Priority</p>
                  <p className="font-bold text-lg">{task.priority.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Deadline</p>
                  <p className="font-bold text-lg">{new Date(task.deadline).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Estimated</p>
                  <p className="font-bold text-lg">{task.estimatedTime}h</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-bold mb-1">Assignee</p>
                  <p className="font-bold text-lg">{task.assignee}</p>
                </div>
              </div>

              {/* Dependencies */}
              {task.dependencies.length > 0 && (
                <div>
                  <p className="text-lg font-bold mb-3">Blocked By:</p>
                  <div className="space-y-2">
                    {task.dependencies.map((depId) => (
                      <div key={depId} className="px-4 py-3 bg-accent text-accent-foreground rounded font-bold">
                        Task {depId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {task.files && task.files.length > 0 && (
                <div>
                  <p className="text-lg font-bold mb-3">Files:</p>
                  <div className="space-y-2">
                    {task.files.map((file, idx) => (
                      <div key={idx} className="p-3 bg-card border-2 border-border rounded">
                        📄 {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "time" && (
            <div className="space-y-4">
              <div className="bg-secondary p-6 rounded border-2 border-border">
                <p className="text-sm text-muted-foreground font-bold mb-2">TIME LOGGED</p>
                <p className="text-5xl font-black">
                  {task.timeLogged.toFixed(1)}
                  <span className="text-2xl ml-2">/ {task.estimatedTime}h</span>
                </p>
                <div className="mt-4 bg-input h-4 rounded overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{ width: `${(task.timeLogged / task.estimatedTime) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                {task.timeLogged > task.estimatedTime
                  ? `Exceeded by ${(task.timeLogged - task.estimatedTime).toFixed(1)}h`
                  : `${(task.estimatedTime - task.timeLogged).toFixed(1)}h remaining`}
              </p>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4">
              {/* Add Comment */}
              <div className="bg-card border-2 border-border p-4 rounded">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or feedback..."
                  rows={3}
                  className="w-full px-4 py-3 bg-input border border-border rounded font-bold mb-3 resize-none"
                />
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5 border-2 border-primary cursor-pointer"
                  />
                  <span className="font-bold text-sm">Private comment (manager only)</span>
                </label>
                <button
                  onClick={() => {
                    onAddComment(task.id, comment, isPrivate)
                    setComment("")
                    setIsPrivate(false)
                  }}
                  disabled={!comment}
                  className="w-full px-4 py-3 font-bold bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 rounded transition"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {visibleComments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No comments yet</p>
                ) : (
                  visibleComments.map((c) => (
                    <div key={c.id} className="bg-secondary p-4 rounded border-2 border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold">{c.author}</p>
                        <p className="text-xs text-muted-foreground">{c.timestamp}</p>
                      </div>
                      <p className="text-foreground">{c.text}</p>
                      {c.isPrivate && <p className="text-xs text-accent font-bold mt-2">🔒 Private</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-primary p-8 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 font-bold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
