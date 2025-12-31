"use client"

/**
 * Task Details Modal Component
 * Comprehensive task view with status updates, time logging, and comments
 * Shows task dependencies and blocks dependent tasks
 */
import { useState, useEffect } from "react"
import FileUpload from "./file-upload"
import ActivityFeed from "./activity-feed"

export default function TaskDetailsModal({ task, project, onClose, onUpdateStatus, onAddComment, developer, onLogTime }) {
  const [activeTab, setActiveTab] = useState("details") // details, time, comments, attachments
  const [comment, setComment] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)
  const [manualHours, setManualHours] = useState("")

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
          {["details", "time", "comments", "attachments"].map((tab) => (
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
              {task.dependencies && task.dependencies.length > 0 && (
                <div>
                  <p className="text-lg font-bold mb-3">Blocked By:</p>
                  <div className="space-y-2">
                    {task.dependencies.map((dep) => (
                      <div key={dep._id || dep} className="px-4 py-3 bg-accent text-accent-foreground rounded font-bold">
                        {typeof dep === 'object' ? dep.title : `Task ${dep}`}
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
            <div className="p-8 space-y-6">
              {/* Time Summary */}
              <div className="bg-secondary p-6 rounded border-2 border-border">
                <p className="text-sm text-muted-foreground font-bold mb-2">TIME LOGGED</p>
                <p className="text-5xl font-black">
                  {(task.timeLogged / 3600).toFixed(1)}h
                  <span className="text-2xl ml-2 text-muted-foreground">/ {task.estimatedTime}h</span>
                </p>
                <div className="mt-4 bg-input h-4 rounded overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${Math.min((task.timeLogged / 3600 / task.estimatedTime) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-center text-muted-foreground mt-2">
                  {(task.timeLogged / 3600) > task.estimatedTime
                    ? `Exceeded by ${((task.timeLogged / 3600) - task.estimatedTime).toFixed(1)}h`
                    : `${(task.estimatedTime - (task.timeLogged / 3600)).toFixed(1)}h remaining`}
                </p>
              </div>

              {/* Timer Section */}
              <div className="bg-card border-2 border-border p-6 rounded">
                <h3 className="text-xl font-bold mb-4">⏱️ Timer</h3>

                {/* Timer Display */}
                <div className="bg-primary text-primary-foreground p-8 rounded text-center mb-4">
                  <p className="text-6xl font-black tracking-tight">
                    {Math.floor(timerSeconds / 3600).toString().padStart(2, '0')}:
                    {Math.floor((timerSeconds % 3600) / 60).toString().padStart(2, '0')}:
                    {(timerSeconds % 60).toString().padStart(2, '0')}
                  </p>
                  <p className="text-sm mt-2 opacity-80">
                    {(timerSeconds / 3600).toFixed(2)} hours
                  </p>
                </div>

                {/* Timer Controls */}
                <div className="flex gap-3">
                  {!isTimerRunning ? (
                    <button
                      onClick={() => {
                        setIsTimerRunning(true);
                        const interval = setInterval(() => {
                          setTimerSeconds(prev => prev + 1);
                        }, 1000);
                        setTimerInterval(interval);
                      }}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded font-bold hover:bg-green-600 transition"
                    >
                      ▶ Start Timer
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          if (timerInterval) clearInterval(timerInterval);
                        }}
                        className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded font-bold hover:bg-yellow-600 transition"
                      >
                        ⏸ Pause
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          if (timerInterval) clearInterval(timerInterval);
                          if (timerSeconds > 0 && onLogTime) {
                            onLogTime(task._id || task.id, timerSeconds / 3600);
                            setTimerSeconds(0);
                            alert(`Logged ${(timerSeconds / 3600).toFixed(2)} hours`);
                          }
                        }}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90 transition"
                      >
                        ⏹ Stop & Log
                      </button>
                    </>
                  )}
                </div>

                {timerSeconds > 0 && !isTimerRunning && (
                  <button
                    onClick={() => setTimerSeconds(0)}
                    className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Reset Timer
                  </button>
                )}
              </div>

              {/* Manual Hour Input */}
              <div className="bg-card border-2 border-border p-6 rounded">
                <h3 className="text-xl font-bold mb-4">📝 Log Hours Manually</h3>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    placeholder="Enter hours (e.g., 2.5)"
                    className="flex-1 px-4 py-3 bg-input border border-border rounded"
                  />
                  <button
                    onClick={() => {
                      if (manualHours && parseFloat(manualHours) > 0 && onLogTime) {
                        onLogTime(task._id || task.id, parseFloat(manualHours));
                        setManualHours("");
                        alert(`Logged ${manualHours} hours`);
                      }
                    }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90 transition"
                  >
                    Log Hours
                  </button>
                </div>
              </div>
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

          {/* Attachments Tab */}
          {activeTab === "attachments" && (
            <div className="p-8">
              <FileUpload
                taskId={task._id || task.id}
                attachments={task.attachments || []}
                onFileUploaded={onClose}
                onFileDeleted={onClose}
                canDelete={!developer}
              />
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
