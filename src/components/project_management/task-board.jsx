"use client"

/**
 * Task Board Component (Kanban View)
 * Organizes tasks by status: Not Started, In Progress, Completed
 * Allows drag-drop or click to change task status
 */
import { useState } from "react"
import TaskColumn from "./task-column"

export default function TaskBoard({ project, onUpdateTaskStatus, onLogTime, onAddComment, setCurrentView }) {
  const [selectedTask, setSelectedTask] = useState(null)

  // Organize tasks by status
  const tasksByStatus = {
    "not-started": project.tasks.filter((t) => t.status === "not-started"),
    "in-progress": project.tasks.filter((t) => t.status === "in-progress"),
    completed: project.tasks.filter((t) => t.status === "completed"),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">Task Board</h2>
        <button
          onClick={() => setCurrentView("new-task")}
          className="px-6 py-3 font-bold bg-accent text-accent-foreground hover:opacity-90 rounded transition"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="Not Started"
          tasks={tasksByStatus["not-started"]}
          status="not-started"
          project={project}
          onUpdateStatus={onUpdateTaskStatus}
          onAddComment={onAddComment}
          setSelectedTask={setSelectedTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={tasksByStatus["in-progress"]}
          status="in-progress"
          project={project}
          onUpdateStatus={onUpdateTaskStatus}
          onAddComment={onAddComment}
          setSelectedTask={setSelectedTask}
        />
        <TaskColumn
          title="Completed"
          tasks={tasksByStatus["completed"]}
          status="completed"
          project={project}
          onUpdateStatus={onUpdateTaskStatus}
          onAddComment={onAddComment}
          setSelectedTask={setSelectedTask}
        />
      </div>

      {/* Activity Log */}
      <div className="bg-card border-2 border-border p-6 rounded">
        <h3 className="text-2xl font-bold mb-4">Activity Log</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {project.activityLog.length === 0 ? (
            <p className="text-muted-foreground">No activity yet</p>
          ) : (
            project.activityLog.map((log) => (
              <div key={log.id} className="text-sm flex justify-between border-b border-border pb-2">
                <span className="font-bold">{log.action}</span>
                <span className="text-muted-foreground">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
