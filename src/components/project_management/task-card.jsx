"use client"

/**
 * Task Card Component
 * Individual task display with status, priority, and quick actions
 * Shows progress towards estimated time and upcoming deadlines
 */
import { useState } from "react"
import TaskDetailsModal from "./task-details-modal"

export default function TaskCard({ task, project, onUpdateStatus, onAddComment, setSelectedTask }) {
  const [showDetails, setShowDetails] = useState(false)

  // Check if overdue
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "completed"

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className={`p-4 rounded border-2 cursor-pointer transition ${
          isOverdue ? "bg-accent/20 border-accent" : "bg-background border-border hover:border-primary"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-sm flex-1">{task.title}</h4>
          <span
            className={`px-2 py-1 text-xs font-bold rounded whitespace-nowrap ${
              task.priority === "high"
                ? "bg-accent text-accent-foreground"
                : task.priority === "medium"
                  ? "bg-muted text-muted-foreground"
                  : "bg-card text-card-foreground border border-border"
            }`}
          >
            {task.priority.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="bg-secondary h-2 rounded overflow-hidden border border-border">
            <div className="bg-primary h-full" style={{ width: `${Math.min(((task.timeLogged / 3600) / task.estimatedTime) * 100, 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(task.timeLogged / 3600).toFixed(1)}h / {task.estimatedTime}h
          </p>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>📅 {new Date(task.deadline).toLocaleDateString()}</p>
          <p>👤 {task.assignee}</p>
          {isOverdue && <p className="font-bold text-accent">⚠ OVERDUE</p>}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <TaskDetailsModal
          task={task}
          project={project}
          onClose={() => setShowDetails(false)}
          onUpdateStatus={onUpdateStatus}
          onAddComment={onAddComment}
          onLogTime={() => { }}
        />
      )}
    </>
  )
}
