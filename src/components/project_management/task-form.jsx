import { useState } from "react"

// Task form component for creating new tasks within a project
// Takes user input for task details including title, description, priority, deadline, estimated time, and assignee
// Also allows selecting task dependencies (other tasks that must be completed first)
export default function TaskForm({ onSubmit, projectTasks = [], teamMembers = [] }) {
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
    <form onSubmit={handleSubmit} className="bg-card shadow-sm rounded-md border border-border p-4 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">New Task</h3>
      </div>

      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full bg-input border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full bg-input border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20"
        />

        {/* Row 1: Priority, Deadline */}
        <div className="grid grid-cols-2 gap-3">
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full bg-input border border-input rounded px-3 py-2 text-sm"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full bg-input border border-input rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Row 2: Time, Assignee */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="estimatedTime"
            value={formData.estimatedTime}
            onChange={handleChange}
            placeholder="Est. Hours"
            className="w-full bg-input border border-input rounded px-3 py-2 text-sm"
          />
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full bg-input border border-input rounded px-3 py-2 text-sm"
          >
            <option value="">Assign To...</option>
            {teamMembers && teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name || member.email}
              </option>
            ))}
          </select>
        </div>

        {/* Dependencies */}
        {projectTasks && projectTasks.length > 0 && (
          <div className="text-xs">
            <p className="mb-1 text-muted-foreground">Dependencies:</p>
            <div className="flex flex-wrap gap-2">
              {projectTasks.map((task) => (
                <label key={task.id} className="flex items-center gap-1 cursor-pointer bg-secondary px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.dependencies.includes(task.id)}
                    onChange={() => handleDependencyToggle(task.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{task.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2 rounded">
          Add Task
        </button>
      </div>
    </form>
  )
}
