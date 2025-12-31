import React, { useEffect, useState } from 'react';
import ProjectService from '../services/project.service';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects based on role
        const projectsResponse = await api.get('/projects');
        const userProjects = projectsResponse.data.data || [];
        setProjects(userProjects);

        // Calculate stats from projects
        const calculatedStats = calculateStats(userProjects, user?.role);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const calculateStats = (projects, role) => {
    const allTasks = projects.flatMap(p => p.tasks || []);
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status !== 'completed');
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    
    // Get upcoming deadlines (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = allTasks
      .filter(t => {
        const deadline = new Date(t.deadline);
        return deadline >= now && deadline <= nextWeek && t.status !== 'completed';
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => {
        const hasIncompleteTasks = (p.tasks || []).some(t => t.status !== 'completed');
        return hasIncompleteTasks;
      }).length,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalBudget,
      upcomingDeadlines,
      myTasks: role === 'developer' ? allTasks.filter(t => t.assigneeId === user?.userId) : [],
    };
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!stats) return <div className="p-8 text-center">Failed to load stats.</div>;

  const isManager = user?.role === 'project_manager' || user?.role === 'manager';

  console.log({stats});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {isManager ? 'Manager Dashboard' : 'Developer Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {isManager 
            ? `Overview of all your projects and team performance` 
            : `Your assigned tasks and project involvement`}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isManager ? (
          <>
            <StatCard title="Total Projects" value={stats.totalProjects} color="blue" />
            <StatCard title="Active Projects" value={stats.activeProjects} color="green" />
            <StatCard title="Total Budget" value={`$${stats.totalBudget.toLocaleString()}`} color="purple" />
            <StatCard title="Tasks Completed" value={`${stats.completedTasks} / ${stats.totalTasks}`} color="orange" />
          </>
        ) : (
          <>
            <StatCard title="My Projects" value={stats.totalProjects} color="blue" />
            <StatCard title="My Tasks" value={stats.myTasks.length} color="green" />
            <StatCard title="Completed" value={stats.myTasks.filter(t => t.status === 'completed').length} color="purple" />
            <StatCard title="In Progress" value={stats.totalTasks} color="orange" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Overview */}
        <div className="bg-card border border-border p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">
            {isManager ? 'Projects Overview' : 'My Projects'}
          </h2>
          {projects.length === 0 ? (
            <p className="text-muted-foreground">
              {isManager ? 'No projects created yet.' : 'Not assigned to any projects yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link 
                  key={project._id} 
                  to="/projects"
                  className="block p-3 bg-secondary hover:bg-secondary/80 rounded transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(project.tasks || []).length} tasks • {(project.team || []).length} members
                      </p>
                    </div>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      {Math.round(((project.tasks || []).filter(t => t.status === 'completed').length / (project.tasks || []).length || 0) * 100)}%
                    </span>
                  </div>
                </Link>
              ))}
              {projects.length > 5 && (
                <Link to="/projects" className="text-sm text-primary hover:underline">
                  View all {projects.length} projects →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card border border-border p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
          {stats.upcomingDeadlines.length === 0 ? (
            <p className="text-muted-foreground">No upcoming deadlines in the next 7 days.</p>
          ) : (
            <ul className="space-y-3">
              {stats.upcomingDeadlines.map((task) => (
                <li key={task._id} className="flex justify-between items-center border-b border-border pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-card border border-border p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link 
            to="/projects" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            {isManager ? 'Manage Projects' : 'View My Tasks'}
          </Link>
          {isManager && (
            <Link 
              to="/projects" 
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-medium"
            >
              Create New Project
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    purple: 'border-purple-500 bg-purple-50',
    orange: 'border-orange-500 bg-orange-50',
  };

  return (
    <div className={`bg-card border-2 ${colorClasses[color]} p-6 rounded-lg`}>
      <h3 className="text-muted-foreground text-sm font-medium uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
