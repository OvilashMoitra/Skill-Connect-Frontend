"use client"

/**
 * Dashboard Component
 * Main project manager view showing project selection and task board
 * Displays project overview and allows task management
 */
import { useState } from "react"
import ProjectList from "./project-list"
import TaskBoard from "./task-board"
import ProjectStats from "./project-stats"

export default function Dashboard({
  projects,
  selectedProject,
  setSelectedProject,
  setCurrentView,
  onUpdateTaskStatus,
  onLogTime,
  onAddComment,
}) {
  const [showProjectList, setShowProjectList] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-4 border-primary pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-2">{selectedProject.name}</h1>
            <p className="text-lg text-muted-foreground">{selectedProject.description}</p>
          </div>
          <button
            onClick={() => setShowProjectList(!showProjectList)}
            className="px-6 py-3 font-bold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded transition"
          >
            {showProjectList ? "Hide Projects" : "View All Projects"}
          </button>
        </div>
      </div>

      {/* Project List (if toggled) */}
      {showProjectList && (
        <ProjectList projects={projects} selectedProject={selectedProject} onSelectProject={setSelectedProject} />
      )}

      {/* Project Statistics */}
      <ProjectStats project={selectedProject} />

      {/* Task Board */}
      <TaskBoard
        project={selectedProject}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onLogTime={onLogTime}
        onAddComment={onAddComment}
        setCurrentView={setCurrentView}
      />
    </div>
  )
}
