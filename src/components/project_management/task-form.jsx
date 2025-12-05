"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

// Task form component for creating new tasks within a project
// Takes user input for task details including title, description, priority, deadline, estimated time, and assignee
// Also allows selecting task dependencies (other tasks that must be completed first)
export default function TaskForm({ onSubmit, projectTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    deadline: "",
    estimatedTime: "",
    assignee: "",
    status: "Not Started",
    dependencies: [],
  })

  // Handler for input field changes
  // Updates the corresponding field in the form data state
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handler for selecting or deselecting task dependencies
  // Toggles the task ID in the dependencies array
  const handleDependencyToggle = (taskId) => {
    setFormData((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(taskId)
        ? prev.dependencies.filter((id) => id !== taskId)
        : [...prev.dependencies, taskId],
    }))
  }

  // Handler for form submission
  // Validates all required fields are filled
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation check
    if (
      !formData.title ||
      !formData.description ||
      !formData.deadline ||
      !formData.estimatedTime ||
      !formData.assignee
    ) {
      alert("Please fill in all required fields")
      return
    }

    // Submit form with validated data
    onSubmit({
      ...formData,
      estimatedTime: Number.parseFloat(formData.estimatedTime),
    })

    // Reset form after submission
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      deadline: "",
      estimatedTime: "",
      assignee: "",
      status: "Not Started",
      dependencies: [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Create New Task</h3>

      {/* Task title input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Task description input */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task"
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          rows="3"
        />
      </div>

      {/* Priority, deadline, and estimated time inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Estimated time and assignee inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Time (hours)</label>
          <input
            type="number"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            placeholder="e.g., 8"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Assign To</label>
          <input
            type="text"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            placeholder="Developer name"
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Task dependencies selector */}
      {projectTasks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Task Dependencies</label>
          <p className="text-xs text-slate-400 mb-2">Select tasks that must be completed first</p>
          <div className="space-y-2 bg-slate-700/50 p-3 rounded border border-slate-600">
            {projectTasks.map((task) => (
              <label key={task.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dependencies.includes(task.id)}
                  onChange={() => handleDependencyToggle(task.id)}
                  className="rounded"
                />
                <span className="text-sm text-slate-300">{task.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Form action buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          Create Task
        </Button>
      </div>
    </form>
  )
}
