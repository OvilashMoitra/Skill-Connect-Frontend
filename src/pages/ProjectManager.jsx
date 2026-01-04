


import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import api from "../services/api"
import Dashboard from "../components/project_management/dashboard"
import ProjectForm from "../components/project_management/project-form"
import TaskForm from "../components/project_management/task-form"
import AddDeveloperSection from "../components/project_management/add-developer-section"
import Navigation from "../components/project_management/navigation"
import DeveloperDashboard from "../components/project_management/developer-dashboard"
import ActivityFeed from "../components/project_management/activity-feed"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Crown, X, Sparkles } from 'lucide-react'

import { useAuth } from "../context/AuthContext";

/**
 * Main App Component
 * Manages overall state for projects, tasks, developers, and user roles
 * Handles routing between project manager view and developer view
 * Tracks project creation, task management, time logging, and performance
 */
export default function ProjectManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(user?.role || "manager");
  const [currentDeveloper, setCurrentDeveloper] = useState(user?.name || "John"); 
  const queryClient = useQueryClient();

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    if (user?.role) setUserRole(user.role);
  }, [user]);


  // Project data - starts empty, populated from API
  const [projects, setProjects] = useState([])

  // Default developer stats (fallback for new developers)
  const defaultStats = {
    totalTasksCompleted: 0,
    averageTimePerTask: 0,
    rating: 0,
    tasksThisWeek: 0,
    hoursLoggedThisWeek: 0,
    productivity: [
      { day: "Mon", hours: 0 },
      { day: "Tue", hours: 0 },
      { day: "Wed", hours: 0 },
      { day: "Thu", hours: 0 },
      { day: "Fri", hours: 0 },
    ],
  };

  // Developer performance data (can be fetched from API in future)
  const [developerStats] = useState({})

  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState(projects[0])

  /**
   * Create a new project
   * Validates project data and adds to projects list
   */
  const createProjectMutation = useMutation({
    mutationFn: (newProject) => {
      // Ensure data format matches backend expectation
      return api.post('/projects', {
        ...newProject,
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate),
        budget: Number(newProject.budget),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCurrentView("dashboard");
    },
    onError: (error) => {
      // Check if this is a project limit error (403 Forbidden)
      if (error.response?.status === 403 && error.response?.data?.message?.includes('Upgrade to premium')) {
        setShowUpgradeModal(true);
      } else {
        alert(error.response?.data?.message || 'Failed to create project');
      }
    },
  });

  /**
   * Create a new project
   * Validates project data and adds to projects list
   */
  const handleAddProject = (newProject) => {
    createProjectMutation.mutate(newProject);
  }

  /**
   * Add a new task to selected project
   * Automatically generates task ID and initializes tracking data
   */
  const createTaskMutation = useMutation({
    mutationFn: (newTask) => {
      return api.post('/tasks', {
        ...newTask,
        projectId: selectedProject.id,
        deadline: new Date(newTask.deadline),
        estimatedTime: Number(newTask.estimatedTime),
        status: newTask.status.toLowerCase().replace(" ", "-"), // "Not Started" -> "not-started"
        priority: newTask.priority.toLowerCase(), // "High" -> "high"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setCurrentView("dashboard");
    },
  });

  /**
   * Add a new task to selected project
   * Automatically generates task ID and initializes tracking data
   */
  const handleAddTask = (newTask) => {
    createTaskMutation.mutate(newTask);
  }

  /**
   * Update task status
   * Tracks status changes in activity log
   * Updates start/completion dates automatically
   */
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }) => {
      return api.patch(`/tasks/${taskId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  /**
   * Update task status
   * Tracks status changes in activity log
   * Updates start/completion dates automatically
   */
  const handleUpdateTaskStatus = (taskId, status) => {
    const data = { status };
    if (status === "in-progress") {
      data.startDate = new Date();
    }
    if (status === "completed") {
      data.completedDate = new Date();
    }
    updateTaskMutation.mutate({ taskId, data });
  }

  /**
   * Log time for a task
   * Updates developer stats and project progress
   */
  /*
   * Log time for a task
   * Updates developer stats and project progress
   */
  const handleLogTime = (taskId, hours) => {
    // Calculate start and end time based on hours duration - estimation
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);
    
    api.post(`/tasks/${taskId}/log-time`, {
      startTime,
      endTime
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    });
  }

  /**
   * Add a comment to a task
   * Supports private comments for manager or team-visible comments
   */
  /**
   * Add a comment to a task
   * Supports private comments for manager or team-visible comments
   */
  const handleAddComment = (taskId, comment, isPrivate = false) => {
    api.post(`/tasks/${taskId}/comments`, {
      text: comment,
      isPrivate
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    });
  }



  const { data: fetchedProjects, isSuccess } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects');
      return response.data.data;
    },
  })

  useEffect(() => {
    if (isSuccess && fetchedProjects) {
        const formattedProjects = fetchedProjects.map(p => ({
            ...p,
            id: p.id || p._id,
            tasks: p.tasks || [],
            milestones: p.milestones || [],
            activityLog: p.activityLog || []
        }));
        setProjects(formattedProjects);

      // Auto-select the first real project if we are currently holding the mock one or nothing
      if (formattedProjects.length > 0) {
        // Check if we need to update the currently selected project with fresh data
        if (selectedProject && selectedProject.id !== '1' && selectedProject.id !== '2') {
          const updatedSelected = formattedProjects.find(p => p.id === selectedProject.id);
          if (updatedSelected) {
            setSelectedProject(updatedSelected);
          }
        } else if (!selectedProject || selectedProject.id === '1' || selectedProject.id === '2') {
          // Initial load or replacing mock
          setSelectedProject(formattedProjects[0]);
        }
      }
    }
  }, [fetchedProjects, isSuccess]); // Remove selectedProject from dependency to avoid loop, or be careful

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        projectCount={projects.length}
        userRole={userRole}
        setUserRole={setUserRole}
        currentDeveloper={currentDeveloper}
        setCurrentDeveloper={setCurrentDeveloper}
      />

      <main className="container mx-auto px-6 py-8">
        {/* Project Manager View */}
        {(userRole === "project_manager" || userRole === "manager") && (
          <>
            {currentView === "dashboard" && (
              <>
                {projects.length === 0 ? (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-bold mb-4">No Projects Yet</h2>
                    <p className="text-muted-foreground mb-6">Create your first project to get started.</p>
                    <button
                      onClick={() => setCurrentView("new-project")}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Create New Project
                    </button>
                  </div>
                ) : (
                  <>
                      <Dashboard
                        projects={projects}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        setCurrentView={setCurrentView}
                        onUpdateTaskStatus={handleUpdateTaskStatus}
                        onLogTime={handleLogTime}
                        onAddComment={handleAddComment}
                      />

                    {selectedProject && (
                      <div className="mt-8 p-6 bg-card border border-border rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Manage Team</h3>
                        <AddDeveloperSection
                          projectId={selectedProject.id}
                          currentTeam={selectedProject.team}
                          onUserAdded={() => queryClient.invalidateQueries({ queryKey: ['projects'] })}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {currentView === "new-project" && (
              <ProjectForm onSubmit={handleAddProject} onCancel={() => setCurrentView("dashboard")} />
            )}

            {/* Activity View */}
            {currentView === "activity" && selectedProject && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">Project Activity</h2>
                    <p className="text-muted-foreground mt-1">{selectedProject.name}</p>
                  </div>
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <ActivityFeed
                  projectId={selectedProject._id || selectedProject.id}
                  limit={100}
                />
              </div>
            )}
            {currentView === "new-task" && selectedProject && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                  <button onClick={() => setCurrentView("dashboard")} className="text-sm hover:underline">
                    &larr; Back to Dashboard
                  </button>
                </div>
                <TaskForm
                  onSubmit={handleAddTask}
                  projectTasks={selectedProject.tasks || []}
                  teamMembers={selectedProject.team || []}
                  onCancel={() => setCurrentView("dashboard")}
                />
              </div>
            )}
          </>
        )}

        {/* Developer View */}
        {userRole === "developer" && (
          <DeveloperDashboard
            developer={currentDeveloper}
            projects={projects}
            stats={developerStats[currentDeveloper] || defaultStats}
            currentView={currentView}
            setCurrentView={setCurrentView}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onLogTime={handleLogTime}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Upgrade to Premium Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Project Limit Reached
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Free tier users can only create up to 2 projects. Upgrade to Premium for unlimited projects and exclusive features!
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    navigate({ to: '/subscription' });
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Upgrade to Premium
                </button>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

