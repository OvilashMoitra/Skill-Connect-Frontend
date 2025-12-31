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
import { useAuth } from "../../context/AuthContext"

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
  const { user } = useAuth();

  console.log('Developer Dashboard Debug:', {
    user,
    projects,
    projectsWithTasks: projects.map(p => ({ name: p.name, taskCount: p.tasks?.length || 0 }))
  });

  // Get all tasks assigned to the developer
  const assignedTasks = projects
    .flatMap((p) =>
      (p.tasks || []).map((t) => ({
        ...t,
        projectId: p._id || p.id,
        projectName: p.name,
      })),
    )
    .filter((t) => {
      // Primary filter: Check assigneeId
      if (t.assigneeId) {
        const taskAssigneeId = typeof t.assigneeId === 'object' ? t.assigneeId._id : t.assigneeId;
        const currentUserId = user?.id || user?._id;

        console.log('Task filter check:', {
          taskTitle: t.title,
          taskAssigneeId,
          currentUserId,
          match: taskAssigneeId === currentUserId
        });

        return taskAssigneeId === currentUserId;
      }
      return false;
    });

  console.log('Assigned tasks count:', assignedTasks.length);

  // Get pending/blocked tasks (dependencies not met)
  const blockedTasks = assignedTasks.filter((t) => {
    if (!t.dependencies || t.dependencies.length === 0) return false;

    const project = projects.find((p) => (p._id || p.id) === t.projectId);
    if (!project || !project.tasks) return false;

    return t.dependencies.some((depId) => {
      const depTask = project.tasks.find((tk) => (tk._id || tk.id) === (depId._id || depId));
      return depTask && depTask.status !== "completed";
    });
  });

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
          assignedTasks.length > 0 ? (
            <TaskListView
              tasks={assignedTasks}
              blockedTasks={blockedTasks}
              onUpdateStatus={onUpdateTaskStatus}
              onAddComment={onAddComment}
              onLogTime={onLogTime}
              developer={developer}
            />
          ) : (
            <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded-lg">
              <h3 className="text-xl font-bold text-muted-foreground">No Tasks Assigned</h3>
              <p className="text-muted-foreground mt-2">Ask your manager to assign tasks to <strong>{developer}</strong>.</p>
            </div>
          )
        )}
        {activeTab === "calendar" && <TaskCalendar tasks={assignedTasks} />}
        {activeTab === "time" && <TimeTracker tasks={assignedTasks} onLogTime={onLogTime} developer={developer} />}
        {activeTab === "performance" && <DeveloperPerformance stats={stats} developer={developer} />}
      </div>
    </div>
  )
}
