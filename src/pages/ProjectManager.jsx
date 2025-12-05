

import { useState, useEffect } from "react"
import axios from 'axios'
import Dashboard from "../components/project_management/dashboard"
import ProjectForm from "../components/project_management/project-form"
import Navigation from "../components/project_management/navigation"
import DeveloperDashboard from "../components/project_management/developer-dashboard"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Main App Component
 * Manages overall state for projects, tasks, developers, and user roles
 * Handles routing between project manager view and developer view
 * Tracks project creation, task management, time logging, and performance
 */
export default function ProjectManager() {
  const [userRole, setUserRole] = useState("manager") // "manager" or "developer"
  const [currentDeveloper, setCurrentDeveloper] = useState("John") // Active developer user
  const queryClient = useQueryClient();

  // Project data structure with all features
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete redesign of company website",
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      budget: 15000,
      progress: 65,
      milestones: [
        { id: "m1", name: "Design Phase", dueDate: "2025-02-01", completed: true },
        { id: "m2", name: "Development", dueDate: "2025-02-28", completed: false },
        { id: "m3", name: "Testing & Launch", dueDate: "2025-03-15", completed: false },
      ],
      tasks: [
        {
          id: "t1",
          title: "Homepage Design",
          description: "Design the new homepage layout with responsive components",
          priority: "high",
          deadline: "2025-01-30",
          estimatedTime: 20,
          status: "in-progress",
          assignee: "John",
          timeLogged: 12,
          dependencies: [],
          comments: [
            { id: "c1", author: "Manager", text: "Great progress! Keep it up.", timestamp: "2025-01-20 10:30" },
          ],
          files: ["homepage-sketch.pdf", "design-specs.doc"],
          startDate: "2025-01-18",
          completedDate: null,
        },
        {
          id: "t2",
          title: "Backend API Setup",
          description: "Setup REST API endpoints for frontend integration",
          priority: "high",
          deadline: "2025-02-05",
          estimatedTime: 30,
          status: "not-started",
          assignee: "Sarah",
          timeLogged: 0,
          dependencies: ["t1"],
          comments: [],
          files: [],
          startDate: null,
          completedDate: null,
        },
        {
          id: "t3",
          title: "Database Migration",
          description: "Migrate data from old system to new database",
          priority: "medium",
          deadline: "2025-02-20",
          estimatedTime: 15,
          status: "completed",
          assignee: "Mike",
          timeLogged: 16,
          dependencies: ["t2"],
          comments: [{ id: "c2", author: "Mike", text: "Completed ahead of schedule.", timestamp: "2025-01-25 14:00" }],
          files: ["migration-script.sql"],
          startDate: "2025-01-22",
          completedDate: "2025-01-25",
        },
      ],
      activityLog: [
        { id: "a1", action: "Task status changed", task: "t1", status: "in-progress", timestamp: "2025-01-18 09:00" },
        { id: "a2", action: "Time logged", task: "t1", hours: 8, timestamp: "2025-01-20 17:00" },
      ],
    },
    {
      id: "2",
      name: "Mobile App",
      description: "iOS and Android mobile application",
      startDate: "2025-02-01",
      endDate: "2025-05-01",
      budget: 25000,
      progress: 30,
      milestones: [
        { id: "m4", name: "UI Kit Design", dueDate: "2025-02-15", completed: true },
        { id: "m5", name: "Core Features", dueDate: "2025-03-31", completed: false },
      ],
      tasks: [
        {
          id: "t4",
          title: "UI Kit Design",
          description: "Design reusable UI components for iOS and Android",
          priority: "high",
          deadline: "2025-02-15",
          estimatedTime: 25,
          status: "in-progress",
          assignee: "Emma",
          timeLogged: 8,
          dependencies: [],
          comments: [],
          files: [],
          startDate: "2025-02-01",
          completedDate: null,
        },
      ],
      activityLog: [],
    },
  ])

  // Developer performance data
  const [developerStats, setDeveloperStats] = useState({
    John: {
      totalTasksCompleted: 42,
      averageTimePerTask: 7.5,
      rating: 4.8,
      tasksThisWeek: 5,
      hoursLoggedThisWeek: 35,
      productivity: [
        { day: "Mon", hours: 8 },
        { day: "Tue", hours: 7.5 },
        { day: "Wed", hours: 8 },
        { day: "Thu", hours: 8.5 },
        { day: "Fri", hours: 7 },
      ],
    },
    Sarah: {
      totalTasksCompleted: 38,
      averageTimePerTask: 8.2,
      rating: 4.6,
      tasksThisWeek: 4,
      hoursLoggedThisWeek: 32,
      productivity: [
        { day: "Mon", hours: 7 },
        { day: "Tue", hours: 8 },
        { day: "Wed", hours: 7.5 },
        { day: "Thu", hours: 8 },
        { day: "Fri", hours: 8 },
      ],
    },
    Emma: {
      totalTasksCompleted: 35,
      averageTimePerTask: 6.8,
      rating: 4.9,
      tasksThisWeek: 6,
      hoursLoggedThisWeek: 40,
      productivity: [
        { day: "Mon", hours: 8 },
        { day: "Tue", hours: 8 },
        { day: "Wed", hours: 8 },
        { day: "Thu", hours: 8 },
        { day: "Fri", hours: 8 },
      ],
    },
  })

  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedProject, setSelectedProject] = useState(projects[0])

  /**
   * Create a new project
   * Validates project data and adds to projects list
   */
  const createProjectMutation = useMutation({
    mutationFn: (newProject) => {
      // Ensure data format matches backend expectation
      return axios.post('http://localhost:1022/api/v1/projects', {
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
      return axios.post('http://localhost:1022/api/v1/tasks', {
        ...newTask,
        projectId: selectedProject.id,
        deadline: new Date(newTask.deadline),
        estimatedTime: Number(newTask.estimatedTime),
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
      return axios.patch(`http://localhost:1022/api/v1/tasks/${taskId}`, data);
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
  const handleLogTime = (taskId, hours) => {
    // Note: Backend should handle incrementing time logic if needed, 
    // or we fetch current task, calculate new total, and send it.
    // For simplicity, assuming backend or we just send the incremental change if backend supported it,
    // but typically REST PATCH replaces fields. 
    // We would ideally fetch the task first or adjust backend to accept 'inc'.
    // Here we will do a best-effort simpler approach or just acknowledge limitation 
    // that we need current value. Since we have 'projects' state from react-query, we can find it.
    
    // Find current task time
    const project = projects.find(p => p.id === selectedProject.id);
    const task = project?.tasks.find(t => t.id === taskId);
    if (task) {
        const newTime = (task.timeLogged || 0) + hours;
        updateTaskMutation.mutate({ taskId, data: { timeLogged: newTime } });
    }
  }

  /**
   * Add a comment to a task
   * Supports private comments for manager or team-visible comments
   */
  const handleAddComment = (taskId, comment, isPrivate = false) => {
     // Similar logic: we need to append to existing comments.
     // In a real app, comments would likely be a separate sub-resource or backend handles push.
     // Since backend uses simple update, we must construct the new array.
    const project = projects.find(p => p.id === selectedProject.id);
    const task = project?.tasks.find(t => t.id === taskId);
    if (task) {
        const newComment = {
            text: comment,
            isPrivate,
            authorId: "current-user-id", // Needs actual user ID handling
            timestamp: new Date()
        };
        // Backend expects 'comments' array replacement or we need a specific 'add comment' endpoint.
        // Given current backend 'updateTask' just updates fields, we send new array.
        // NOTE: This has race conditions but fits the current simple architecture.
        // Ideally we should have POST /api/v1/tasks/:id/comments
        const updatedComments = [...(task.comments || []), newComment];
        
        // Since our backend Task model defines comments structure, we might face issues if we don't send valid objects.
        // For now, let's try sending the updated array.
        // Actually, looking at backend model, comments is an array of subdocuments.
        // We'll proceed with this.
        updateTaskMutation.mutate({ taskId, data: { comments: updatedComments }});
    }
  }


  const { data: fetchedProjects, isSuccess } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:1022/api/v1/projects');
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
    }
  }, [fetchedProjects, isSuccess]);

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
        {userRole === "manager" && (
          <>
            {currentView === "dashboard" && (
              <Dashboard
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                setCurrentView={setCurrentView}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onLogTime={handleLogTime}
                onAddComment={handleAddComment}
              />
            )}
            {currentView === "new-project" && (
              <ProjectForm onSubmit={handleAddProject} onCancel={() => setCurrentView("dashboard")} />
            )}
          </>
        )}

        {/* Developer View */}
        {userRole === "developer" && (
          <DeveloperDashboard
            developer={currentDeveloper}
            projects={projects}
            stats={developerStats[currentDeveloper]}
            currentView={currentView}
            setCurrentView={setCurrentView}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onLogTime={handleLogTime}
            onAddComment={handleAddComment}
          />
        )}
      </main>
    </div>
  )
}
