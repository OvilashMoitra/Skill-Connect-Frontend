"use client"

/**
 * Developer Dashboard Component
 * Shows assigned tasks, time tracking, calendar view, and performance analytics
 * Allows developers to manage their workload and track productivity
 */
import { useState } from "react"
import TaskListView from "./task-list-view"
import TaskCalendar from "./task-calendar"
import DeveloperPerformance from "./developer-performance"
import TimeTracker from "./time-tracker"

export default function DeveloperDashboard({
  developer,
  projects,
  stats,
  currentView,
  setCurrentView,
  onUpdateTaskStatus,
  onLogTime,
  onAddComment,
}) {
  const [activeTab, setActiveTab] = useState("tasks") // "tasks", "calendar", "performance", "time"

  // Get all tasks assigned to the developer
  const assignedTasks = projects
    .flatMap((p) =>
      p.tasks.map((t) => ({
        ...t,
        projectId: p.id,
        projectName: p.name,
      })),
    )
    .filter((t) => t.assignee === developer)

  // Get pending/blocked tasks (dependencies not met)
  const blockedTasks = assignedTasks.filter((t) => {
    const project = projects.find((p) => p.id === t.projectId)
    return t.dependencies.some((depId) => {
      const depTask = project.tasks.find((tk) => tk.id === depId)
      return depTask && depTask.status !== "completed"
    })
  })

  return (
    <div className="space-y-8">
      {/* Header with developer info */}
      <div className="border-b-2 border-border pb-6">
        <h1 className="text-5xl font-black tracking-tight mb-2">{developer}'s Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          {assignedTasks.length} assigned tasks • {stats.hoursLoggedThisWeek}h logged this week
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b-2 border-border pb-4">
        {[
          { id: "tasks", label: "My Tasks" },
          { id: "calendar", label: "Calendar" },
          { id: "time", label: "Time Tracking" },
          { id: "performance", label: "Performance" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-bold text-lg transition ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground border-b-4 border-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "tasks" && (
          <TaskListView
            tasks={assignedTasks}
            blockedTasks={blockedTasks}
            onUpdateStatus={onUpdateTaskStatus}
            onAddComment={onAddComment}
            developer={developer}
          />
        )}
        {activeTab === "calendar" && <TaskCalendar tasks={assignedTasks} />}
        {activeTab === "time" && <TimeTracker tasks={assignedTasks} onLogTime={onLogTime} developer={developer} />}
        {activeTab === "performance" && <DeveloperPerformance stats={stats} developer={developer} />}
      </div>
    </div>
  )
}
