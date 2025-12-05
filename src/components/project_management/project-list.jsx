"use client"

/**
 * Project List Component
 * Grid view of all projects with progress indicators
 * Allows selection and quick access to project details
 */
export default function ProjectList({ projects, selectedProject, onSelectProject }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">All Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project)}
            className={`text-left p-6 rounded border-4 transition ${
              selectedProject.id === project.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-card-foreground border-border hover:border-primary"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-sm mb-4 opacity-75">{project.description}</p>

            {/* Progress Bar */}
            <div className="mb-3 bg-secondary h-3 rounded overflow-hidden border-2 border-border">
              <div
                className={`h-full ${selectedProject.id === project.id ? "bg-primary-foreground" : "bg-primary"}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* Stats */}
            <div className="flex justify-between text-xs font-bold">
              <span>{project.tasks.length} tasks</span>
              <span>{project.progress}% done</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
