"use client"

/**
 * Task List View Component
 * Displays developer's assigned tasks with filtering
 * Shows blocked tasks, upcoming deadlines, and task details
 */
import { useState } from "react"
import TaskDetailsModal from "./task-details-modal"

export default function TaskListView({ tasks, blockedTasks, onUpdateStatus, onAddComment, developer }) {
  const [selectedTask, setSelectedTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all") // all, not-started, in-progress, completed

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
                    {task.timeLogged}h / {task.estimatedTime}h
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
          developer={developer}
        />
      )}
    </div>
  )
}
