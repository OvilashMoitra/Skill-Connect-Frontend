"use client"

import { useState } from "react"
import ProjectCard from "./project-card"
import TaskBoard from "./task-board"
import TaskForm from "./task-form"
import { Button } from "@/components/ui/button"

// Dashboard component that displays all projects and allows switching between project view and task board
// Shows a grid of projects with summary information or a detailed task board for a selected project
export default function ProjectDashboard({ projects, onUpdateProject, onDeleteProject }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [showTaskForm, setShowTaskForm] = useState(false)

  // Find the currently selected project from the array
  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  // Handler for adding a new task to the selected project
  // Creates a task object and updates the project's tasks array
  const handleAddTask = (taskData) => {
    if (!selectedProject) return

    const newTask = {
      id: Math.max(0, ...selectedProject.tasks.map((t) => t.id || 0)) + 1,
      ...taskData,
      timeLogged: 0,
      comments: [],
    }

    const updatedTasks = [...selectedProject.tasks, newTask]
    onUpdateProject(selectedProjectId, { tasks: updatedTasks })
    setShowTaskForm(false)
  }

  // Handler for updating an existing task within the selected project
  // Finds the task by ID and replaces it with updated data
  const handleUpdateTask = (taskId, updatedTask) => {
    if (!selectedProject) return

    const updatedTasks = selectedProject.tasks.map((t) => (t.id === taskId ? { ...t, ...updatedTask } : t))
    onUpdateProject(selectedProjectId, { tasks: updatedTasks })
  }

  // Handler for deleting a task from the selected project
  // Filters out the task from the tasks array
  const handleDeleteTask = (taskId) => {
    if (!selectedProject) return

    const updatedTasks = selectedProject.tasks.filter((t) => t.id !== taskId)
    onUpdateProject(selectedProjectId, { tasks: updatedTasks })
  }

  // If a project is selected, show the task board for that project
  if (selectedProjectId) {
    return (
      <div>
        {/* Header for task board view with back button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button onClick={() => setSelectedProjectId(null)} variant="outline" className="mb-4">
              ← Back to Projects
            </Button>
            <h2 className="text-3xl font-bold text-white">{selectedProject?.name}</h2>
            <p className="text-slate-400 mt-1">{selectedProject?.description}</p>
          </div>
          <Button onClick={() => setShowTaskForm(!showTaskForm)} className="bg-green-600 hover:bg-green-700">
            {showTaskForm ? "Cancel" : "+ New Task"}
          </Button>
        </div>

        {/* Show task creation form if enabled */}
        {showTaskForm && (
          <div className="mb-8">
            <TaskForm onSubmit={handleAddTask} projectTasks={selectedProject?.tasks || []} />
          </div>
        )}

        {/* Display task board with all tasks organized by status */}
        <TaskBoard
          tasks={selectedProject?.tasks || []}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>
    )
  }

  // If no project is selected, show the grid of all projects
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={() => setSelectedProjectId(project.id)}
            onDelete={() => onDeleteProject(project.id)}
            onUpdate={(updates) => onUpdateProject(project.id, updates)}
          />
        ))}
      </div>

      {/* Show empty state if no projects exist */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No projects yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
