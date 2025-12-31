import { useState, useEffect } from 'react';
import ActivityService from '../../services/activity.service';
import { useAuth } from '../../context/AuthContext';

export default function ActivityFeed({ projectId, taskId, userId, limit = 50 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const { user } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, [projectId, taskId, userId, filter, dateRange]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      let response;
      const filters = {
        limit,
        ...getDateRangeFilter(),
        ...(filter !== 'all' && { action: filter }),
      };

      if (taskId && projectId) {
        response = await ActivityService.getTaskActivity(taskId, projectId);
      } else if (projectId) {
        response = await ActivityService.getProjectActivity(projectId, filters);
      } else if (userId) {
        response = await ActivityService.getUserActivity(userId, filters);
      }

      setActivities(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeFilter = () => {
    const now = new Date();
    const ranges = {
      '24hours': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7days': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30days': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      'all': null,
    };

    return ranges[dateRange] ? { startDate: ranges[dateRange].toISOString() } : {};
  };

  const getActionIcon = (action) => {
    const icons = {
      task_created: '➕',
      task_updated: '📝',
      status_changed: '🔄',
      comment_added: '💬',
      file_uploaded: '📁',
      file_deleted: '🗑️',
      time_logged: '⏱️',
      assignee_changed: '👤',
      project_updated: '📊',
      team_member_added: '👥',
      milestone_created: '🎯',
      milestone_updated: '🎯',
    };
    return icons[action] || '📌';
  };

  const getActionText = (activity) => {
    const actions = {
      task_created: 'created a task',
      task_updated: 'updated a task',
      status_changed: `changed status from ${activity.details?.oldValue} to ${activity.details?.newValue}`,
      comment_added: 'added a comment',
      file_uploaded: 'uploaded a file',
      file_deleted: 'deleted a file',
      time_logged: `logged ${activity.details?.newValue || 0} hours`,
      assignee_changed: 'changed assignee',
      project_updated: 'updated the project',
      team_member_added: 'added a team member',
      milestone_created: 'created a milestone',
      milestone_updated: 'updated a milestone',
    };
    return actions[activity.action] || activity.action.replace(/_/g, ' ');
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📋 Activity Feed</h2>
        <div className="flex gap-3">
          {/* Action Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded text-sm"
          >
            <option value="all">All Activities</option>
            <option value="task_created">Tasks Created</option>
            <option value="task_updated">Tasks Updated</option>
            <option value="status_changed">Status Changes</option>
            <option value="file_uploaded">Files Uploaded</option>
            <option value="time_logged">Time Logged</option>
            <option value="comment_added">Comments</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-input border border-border rounded text-sm"
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded">
          <p className="text-muted-foreground text-lg">No activities found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="p-4 bg-card border border-border rounded hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-3xl">{getActionIcon(activity.action)}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">
                      {activity.userId?.name || 'Unknown User'}
                    </span>
                    <span className="text-muted-foreground">
                      {getActionText(activity)}
                    </span>
                  </div>

                  {/* Details */}
                  {activity.details?.description && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {activity.details.description}
                    </p>
                  )}

                  {/* Metadata */}
                  {activity.details?.metadata && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {Object.entries(activity.details.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <strong>{key}:</strong> {JSON.stringify(value)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-muted-foreground mt-2">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
