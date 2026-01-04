import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Crown, Calendar, User, CreditCard, Users, DollarSign,TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/subscription/all');
        setSubscriptions(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch subscriptions', err);
        setError('Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalRevenue = subscriptions.length * 49.99;

  if (loading) {
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
          Manage subscriptions and view payment information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Quick Actions */}
      <div className="mt-8 bg-card border border-border p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link 
            to="/subscription" 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            View Subscription Plans
          </Link>
          <Link 
            to="/projects" 
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 font-medium"
          >
            Manage Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
