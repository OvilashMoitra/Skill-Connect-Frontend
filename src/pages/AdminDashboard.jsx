import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Crown, Calendar, User, CreditCard, Users, DollarSign, TrendingUp,
  Shield, Ban, CheckCircle, XCircle, BarChart3, Settings
} from 'lucide-react';
import * as UserService from '../services/user.service';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roleUpdate, setRoleUpdate] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'analytics') {
        const analyticsRes = await UserService.getPlatformAnalytics();
        setAnalytics(analyticsRes.data);
      } else if (activeTab === 'users') {
        const usersRes = await UserService.getAllUsers();
        setUsers(usersRes.data);
      } else if (activeTab === 'subscriptions') {
        const subscriptionsRes = await api.get('/subscription/all');
        setSubscriptions(subscriptionsRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await UserService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchData();
      setEditingUser(null);
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await UserService.suspendUser(userId);
      toast.success('User suspended successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to suspend user');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await UserService.activateUser(userId);
      toast.success('User activated successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to activate user');
    }
  };

  const handleBlock = async (userId) => {
    if (!confirm('Are you sure you want to block this user?')) return;
    try {
      await UserService.blockUser(userId);
      toast.success('User blocked successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to block user');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await UserService.unblockUser(userId);
      toast.success('User unblocked successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to unblock user');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalRevenue = subscriptions.length * 49.99;

  if (loading && !analytics && !users.length && !subscriptions.length) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, view analytics, and monitor platform activity
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'subscriptions'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <CreditCard className="w-4 h-4 inline mr-2" />
          Subscriptions
        </button>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {analytics && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border-2 border-blue-500 bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Total Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.totalUsers || 0}</p>
                </div>

                <div className="bg-card border-2 border-green-500 bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Active Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.activeUsers || 0}</p>
                </div>

                <div className="bg-card border-2 border-red-500 bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Ban className="w-5 h-5 text-red-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Blocked Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.blockedUsers || 0}</p>
                </div>

                <div className="bg-card border-2 border-purple-500 bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Premium Users</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.premiumUsers || 0}</p>
                </div>

                <div className="bg-card border-2 border-yellow-500 bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Total Projects</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.totalProjects || 0}</p>
                </div>

                <div className="bg-card border-2 border-indigo-500 bg-indigo-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-muted-foreground text-sm font-medium uppercase">Total Subscriptions</h3>
                  </div>
                  <p className="text-3xl font-bold">{analytics.totalSubscriptions || 0}</p>
                </div>
              </div>

              {/* Users by Role */}
              {analytics.usersByRole && analytics.usersByRole.length > 0 && (
                <div className="bg-card border border-border p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Users by Role</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analytics.usersByRole.map((roleStat) => (
                      <div key={roleStat._id} className="p-4 bg-secondary rounded-lg">
                        <div className="text-sm text-muted-foreground capitalize">{roleStat._id.replace('_', ' ')}</div>
                        <div className="text-2xl font-bold mt-1">{roleStat.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Users */}
              {analytics.recentUsers && analytics.recentUsers.length > 0 && (
                <div className="bg-card border border-border p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentUsers.map((user) => (
                          <tr key={user._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                            <td className="py-3 px-4">{user.name || 'Unknown'}</td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className="capitalize">{user.role?.replace('_', ' ')}</span>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {formatDate(user.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-card border border-border p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">User Management</h2>
            <span className="text-sm text-muted-foreground">{users.length} total users</span>
          </div>

          {error ? (
            <p className="text-destructive text-center py-8">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Premium</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{u.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                      <td className="py-3 px-4">
                        {editingUser === u._id ? (
                          <div className="flex gap-2">
                            <select
                              value={roleUpdate || u.role}
                              onChange={(e) => setRoleUpdate(e.target.value)}
                              className="text-sm border border-input bg-background px-2 py-1 rounded"
                            >
                              <option value="super_admin">Super Admin</option>
                              <option value="project_manager">Project Manager</option>
                              <option value="developer">Developer</option>
                            </select>
                            <button
                              onClick={() => handleRoleUpdate(u._id, roleUpdate || u.role)}
                              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(null);
                                setRoleUpdate('');
                              }}
                              className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{u.role?.replace('_', ' ')}</span>
                            <button
                              onClick={() => {
                                setEditingUser(u._id);
                                setRoleUpdate(u.role);
                              }}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {u.isBlocked ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Ban className="w-3 h-3 mr-1" />
                            Blocked
                          </span>
                        ) : u.isActive === false ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {u.paid ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Free</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {u.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(u._id)}
                              className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Unblock
                            </button>
                          ) : (
                            <>
                              {u.isActive === false ? (
                                <button
                                  onClick={() => handleActivate(u._id)}
                                  className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                  Activate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspend(u._id)}
                                  className="text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                  Suspend
                                </button>
                              )}
                              <button
                                onClick={() => handleBlock(u._id)}
                                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Block
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border-2 border-purple-500 bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-muted-foreground text-sm font-medium uppercase">Total Subscribers</h3>
              </div>
              <p className="text-3xl font-bold">{subscriptions.length}</p>
            </div>

            <div className="bg-card border-2 border-green-500 bg-green-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-muted-foreground text-sm font-medium uppercase">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>

            <div className="bg-card border-2 border-blue-500 bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-muted-foreground text-sm font-medium uppercase">Avg per User</h3>
              </div>
              <p className="text-3xl font-bold">$49.99</p>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Premium Subscriptions</h2>
              <span className="text-sm text-muted-foreground">{subscriptions.length} total</span>
            </div>

            {error ? (
              <p className="text-destructive text-center py-8">{error}</p>
            ) : subscriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No premium subscriptions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Purchase Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Expires</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Days Left</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => (
                      <tr key={sub._id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{sub.user?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{sub.user?.email || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span>{sub.amount || '$49.99'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatDate(sub.paidAt)}</td>
                        <td className="py-3 px-4">{formatDate(sub.expiresAt)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            sub.daysRemaining > 30
                              ? 'bg-green-100 text-green-800'
                              : sub.daysRemaining > 7
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {sub.daysRemaining !== null ? `${sub.daysRemaining} days` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
