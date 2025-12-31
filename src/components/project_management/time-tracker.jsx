"use client"

/**
 * Time Tracker Component
 * Real-time timer for tasks with pause/resume functionality
 * Manual time logging option for tasks worked on outside the app
 */
import { useState, useEffect } from "react"

export default function TimeTracker({ tasks, onLogTime, developer }) {
  const [activeTimerTask, setActiveTimerTask] = useState(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [manualHours, setManualHours] = useState("")
  const [selectedTask, setSelectedTask] = useState(tasks[0]?.id || "")

  // Auto-increment timer
  useEffect(() => {
    if (!activeTimerTask) return

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimerTask])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start timer for task
  const handleStartTimer = (taskId) => {
    setActiveTimerTask(taskId)
    setTimeElapsed(0)
  }

  // Stop timer and log time
  const handleStopTimer = () => {
    if (activeTimerTask) {
      const hours = timeElapsed / 3600
      onLogTime(activeTimerTask, hours)
      setActiveTimerTask(null)
      setTimeElapsed(0)
    }
  }

  // Manual time logging
  const handleLogManualTime = () => {
    if (selectedTask && manualHours) {
      onLogTime(selectedTask, Number.parseFloat(manualHours))
      setManualHours("")
    }
  }

  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")

  return (
    <div className="space-y-8">
      {/* Active Timer */}
      <div className="bg-card border-2 border-border p-8 rounded">
        <h3 className="text-2xl font-bold mb-6">Active Timer</h3>

        {inProgressTasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks in progress. Start a task to use the timer.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {inProgressTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => (activeTimerTask === task.id ? handleStopTimer() : handleStartTimer(task.id))}
                  className={`p-4 border-2 rounded font-bold text-left transition ${
                    activeTimerTask === task.id
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                  }`}
                >
                  <p className="text-sm text-muted-foreground">{task.title}</p>
                  <p className="text-xs mt-1">{(task.timeLogged / 3600).toFixed(1)}h logged</p>
                </button>
              ))}
            </div>

            {activeTimerTask && (
              <div className="bg-primary text-primary-foreground p-6 rounded text-center">
                <p className="text-5xl font-black tracking-tight">{formatTime(timeElapsed)}</p>
                <button
                  onClick={handleStopTimer}
                  className="mt-4 px-8 py-3 font-bold bg-accent text-accent-foreground hover:opacity-90 rounded transition"
                >
                  Stop & Log Time
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual Time Logging */}
      <div className="bg-card border-2 border-border p-8 rounded">
        <h3 className="text-2xl font-bold mb-6">Log Manual Time</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Select Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold"
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({(task.timeLogged / 3600).toFixed(1)}h / {task.estimatedTime}h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Hours to Log</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={manualHours}
              onChange={(e) => setManualHours(e.target.value)}
              placeholder="e.g., 2.5"
              className="w-full px-4 py-3 bg-input border-2 border-border rounded font-bold"
            />
          </div>

          <button
            onClick={handleLogManualTime}
            className="w-full px-4 py-3 font-bold bg-primary text-primary-foreground hover:opacity-90 rounded transition"
          >
            Log Time
          </button>
        </div>
      </div>

      {/* Time Summary */}
      <div className="bg-card border-2 border-border p-8 rounded">
        <h3 className="text-2xl font-bold mb-6">Time Summary by Task</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between pb-2 border-b border-border last:border-b-0"
            >
              <span className="font-bold">{task.title}</span>
              <span className="text-muted-foreground">
                {(task.timeLogged / 3600).toFixed(1)}h / {task.estimatedTime}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
