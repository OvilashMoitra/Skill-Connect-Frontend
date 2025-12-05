/**
 * Task Column Component
 * Represents a status column in the Kanban board
 * Displays all tasks for a specific status
 */
import TaskCard from "./task-card"

export default function TaskColumn({ title, tasks, status, project, onUpdateStatus, onAddComment, setSelectedTask }) {
  return (
    <div className="bg-secondary border-4 border-border rounded p-4">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-border">
        <h3 className="text-xl font-black flex-1">{title}</h3>
        <span className="px-3 py-1 font-bold text-sm bg-primary text-primary-foreground rounded">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground font-bold">No tasks</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              project={project}
              onUpdateStatus={onUpdateStatus}
              onAddComment={onAddComment}
              setSelectedTask={setSelectedTask}
            />
          ))
        )}
      </div>
    </div>
  )
}
