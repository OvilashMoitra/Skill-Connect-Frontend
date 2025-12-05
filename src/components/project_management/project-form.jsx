"use client"

/**
 * Project Creation Form Component
 * Form for creating new projects with budget and timeline
 * Validates project details before submission
 */
import { useState } from "react"

export default function ProjectForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.startDate && formData.endDate && formData.budget) {
      onSubmit(formData)
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        budget: "",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-5xl font-black mb-2">Create New Project</h2>
        <p className="text-lg text-muted-foreground">Set up a project with timeline and budget</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border-2 border-border p-8 rounded space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-lg font-bold mb-3">Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Website Redesign"
            className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-bold mb-3">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project overview and objectives"
            rows={4}
            className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-bold mb-3">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-bold mb-3">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-lg font-bold mb-3">Budget ($)</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 50000"
            className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6 border-t-2 border-border">
          <button
            type="submit"
            className="flex-1 px-6 py-4 font-bold text-lg bg-primary text-primary-foreground hover:opacity-90 rounded transition"
          >
            Create Project
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 font-bold text-lg bg-secondary text-secondary-foreground hover:bg-accent rounded transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
