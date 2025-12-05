"use client"
import { Trash2 } from "lucide-react"

// Project card component displays a single project with summary information
// Shows project name, description, dates, budget, status, and progress bar
// Allows selecting the project to view tasks or deleting it
export default function ProjectCard({ project, onSelect, onDelete, onUpdate }) {
  // Calculate the percentage of tasks completed to show progress
  const completedTasks = project.tasks.filter((t) => t.status === "Completed").length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div
      className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-blue-500 transition-all cursor-pointer"
      onClick={onSelect}
    >
      {/* Project header with name and delete button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
          <p className="text-slate-400 text-sm">{project.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Project dates and budget information */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-slate-500">Start Date</p>
          <p className="text-white font-medium">{project.startDate}</p>
        </div>
        <div>
          <p className="text-slate-500">End Date</p>
          <p className="text-white font-medium">{project.endDate}</p>
        </div>
        <div>
          <p className="text-slate-500">Budget</p>
          <p className="text-white font-medium">${project.budget.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-500">Status</p>
          <p className="text-green-400 font-medium">{project.status}</p>
        </div>
      </div>

      {/* Progress bar showing completion status */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-400 text-sm">Progress</p>
          <p className="text-white font-medium">{progress}%</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task summary showing completed vs total tasks */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-400">{totalTasks} tasks</p>
        <p className="text-blue-400 font-medium">{completedTasks} completed</p>
      </div>
    </div>
  )
}
