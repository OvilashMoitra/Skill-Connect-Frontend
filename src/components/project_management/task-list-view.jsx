"use client"

/**
 * Task List View Component
 * Displays developer's assigned tasks with filtering
 * Shows blocked tasks, upcoming deadlines, and task details
 */
import { useState } from "react"
import TaskDetailsModal from "./task-details-modal"

export default function TaskListView({ tasks, blockedTasks, onUpdateStatus, onAddComment, onLogTime, developer }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all") // all, not-started, in-progress, completed
  const [logTimeTaskId, setLogTimeTaskId] = useState(null)
  const [hoursToLog, setHoursToLog] = useState("")

  // Filter tasks by status
  const filteredTasks = filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus)

  // Check if task is overdue
  const isOverdue = (task) => {
    return new Date(task.deadline) < new Date() && task.status !== "completed"
  }

  return (
    <div className="space-y-6">
      {/* Filter buttons */}
      <div className="flex gap-3 border-b-2 border-border pb-4">
        {[
          { value: "all", label: "All Tasks" },
          { value: "not-started", label: "Not Started" },
          { value: "in-progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-4 py-2 font-bold text-sm transition ${
              filterStatus === filter.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Blocked tasks alert */}
      {blockedTasks.length > 0 && (
        <div className="bg-accent border-2 border-accent p-4 rounded">
          <p className="font-bold text-accent-foreground">⚠ {blockedTasks.length} task(s) waiting on dependencies</p>
        </div>
      )}

      {/* Tasks list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 border-2 cursor-pointer transition ${
                isOverdue(task) ? "border-accent bg-accent/10" : "border-border hover:border-primary"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{task.title}</h3>
                <span
                  className={`px-3 py-1 font-bold text-sm ${
                    task.priority === "high"
                      ? "bg-accent text-accent-foreground"
                      : task.priority === "medium"
                        ? "bg-muted text-muted-foreground"
                        : "bg-card text-card-foreground border border-border"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

              <div className="flex items-center justify-between">
                <div className="text-sm space-y-1">
                  <p className="font-bold">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                  <p className="text-muted-foreground">
                    {(task.timeLogged / 3600).toFixed(1)}h / {task.estimatedTime}h
                  </p>
                </div>
                <span
                  className={`px-3 py-1 font-bold text-sm ${
                    task.status === "completed"
                      ? "bg-primary text-primary-foreground"
                      : task.status === "in-progress"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {task.status === "completed"
                    ? "✓ Completed"
                    : task.status === "in-progress"
                      ? "→ In Progress"
                      : "○ Not Started"}
                </span>
              </div>

              {/* Time Logging Section */}
              {logTimeTaskId === task.id ? (
                <div className="mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={hoursToLog}
                      onChange={(e) => setHoursToLog(e.target.value)}
                      placeholder="Hours"
                      className="w-24 px-2 py-1 bg-input border border-input rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        if (hoursToLog && parseFloat(hoursToLog) > 0) {
                          onLogTime(task.id, parseFloat(hoursToLog))
                          setHoursToLog("")
                          setLogTimeTaskId(null)
                        }
                      }}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                    >
                      Log
                    </button>
                    <button
                      onClick={() => {
                        setLogTimeTaskId(null)
                        setHoursToLog("")
                      }}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setLogTimeTaskId(task.id)}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm hover:bg-accent/90"
                  >
                    ⏱ Log Time
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Task details modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          project={null}
          onClose={() => setSelectedTask(null)}
          onUpdateStatus={onUpdateStatus}
          onAddComment={onAddComment}
          onLogTime={onLogTime}
          developer={developer}
        />
      )}
    </div>
  )
}
