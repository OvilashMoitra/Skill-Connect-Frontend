import { useState } from 'react';
import MilestoneService from '../../services/milestone.service';

export default function MilestoneView({ projectId, milestones = [], onMilestoneUpdated }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'not-started',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMilestone) {
        await MilestoneService.updateMilestone(projectId, editingMilestone._id, formData);
      } else {
        await MilestoneService.createMilestone(projectId, formData);
      }
      
      setShowForm(false);
      setEditingMilestone(null);
      setFormData({ name: '', description: '', dueDate: '', status: 'not-started' });
      
      if (onMilestoneUpdated) onMilestoneUpdated();
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Failed to save milestone');
    }
  };

  const handleEdit = (milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      name: milestone.name,
      description: milestone.description || '',
      dueDate: new Date(milestone.dueDate).toISOString().split('T')[0],
      status: milestone.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (milestoneId) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await MilestoneService.deleteMilestone(projectId, milestoneId);
      if (onMilestoneUpdated) onMilestoneUpdated();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('Failed to delete milestone');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎯 Milestones</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : '+ Add Milestone'}
        </button>
      </div>

      {/* Milestone Form */}
      {showForm && (
        <div className="bg-card border-2 border-border p-6 rounded">
          <h3 className="text-xl font-bold mb-4">
            {editingMilestone ? 'Edit Milestone' : 'New Milestone'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded font-bold hover:bg-primary/90"
              >
                {editingMilestone ? 'Update' : 'Create'} Milestone
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingMilestone(null);
                  setFormData({ name: '', description: '', dueDate: '', status: 'not-started' });
                }}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded font-bold hover:bg-secondary/90"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <div className="text-center py-12 bg-card border-2 border-dashed border-border rounded">
          <p className="text-muted-foreground text-lg">No milestones yet</p>
          <p className="text-sm text-muted-foreground mt-2">Create your first milestone to track project progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone._id}
              className={`p-6 border-2 rounded ${
                isOverdue(milestone.dueDate, milestone.status)
                  ? 'border-red-500 bg-red-50'
                  : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{milestone.name}</h3>
                    <span className={`px-3 py-1 text-xs text-white rounded ${getStatusColor(milestone.status)}`}>
                      {milestone.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  {milestone.description && (
                    <p className="text-muted-foreground mb-2">{milestone.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold ${isOverdue(milestone.dueDate, milestone.status) ? 'text-red-600' : ''}`}>
                      📅 Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      {isOverdue(milestone.dueDate, milestone.status) && ' (OVERDUE)'}
                    </span>
                    <span className="text-muted-foreground">
                      📊 Progress: {milestone.progress || 0}%
                    </span>
                    <span className="text-muted-foreground">
                      📝 {(milestone.tasks || []).length} tasks
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(milestone)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(milestone._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-200 h-3 rounded overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(milestone.status)}`}
                  style={{ width: `${milestone.progress || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
