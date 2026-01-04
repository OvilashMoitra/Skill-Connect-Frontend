import React, { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import PaymentService from '../services/payment.service';
import { 
  Crown, 
  Check, 
  Zap, 
  Shield, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Calendar,
  CreditCard
} from 'lucide-react';

export default function Subscription() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const sessionId = search?.session_id;
    
    if (sessionId && search?.status === 'success') {
      verifyPayment(sessionId);
    } else if (search?.status === 'cancelled') {
      setStatus('cancelled');
    }

    fetchPriceInfo();
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [search, user]);

  const verifyPayment = async (sessionId) => {
    setVerifying(true);
    setStatus('verifying');
    try {
      const response = await PaymentService.verifyPayment(sessionId);
      if (response.data.success) {
        setStatus('success');
        if (refreshUser) refreshUser();
        fetchSubscriptionStatus();
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Failed to verify payment', error);
      setStatus('failed');
    } finally {
      setVerifying(false);
    }
  };

  const fetchPriceInfo = async () => {
    try {
      const response = await PaymentService.getPremiumPriceInfo();
      setPriceInfo(response.data.data);
    } catch (error) {
      console.error('Failed to fetch price info', error);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await PaymentService.getSubscriptionStatus();
      setSubscriptionInfo(response.data.data);
    } catch (error) {
      console.error('Failed to fetch subscription status', error);
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }

    setLoading(true);
    try {
      const response = await PaymentService.createCheckoutSession();
      const { url } = response.data.data;
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session', error);
      alert(error.response?.data?.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const features = [
    { icon: Crown, text: 'Unlimited Projects', description: 'Create as many projects as you need' },
    { icon: Zap, text: 'Priority Support', description: '24/7 priority customer support' },
    { icon: Shield, text: 'Advanced Analytics', description: 'Detailed insights and reports' },
    { icon: Calendar, text: '1 Year Access', description: 'Full premium access for 365 days' },
  ];

  // Verifying state
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg p-8 text-center border border-border">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Verifying Payment...</h1>
          <p className="text-muted-foreground">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  // Failed state
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg p-8 text-center border border-border">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Verification Failed</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't verify your payment. Please try again.
          </p>
          <button
            onClick={() => setStatus(null)}
            className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg p-8 text-center border border-border">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Welcome to Premium!</h1>
          <p className="text-muted-foreground mb-6">
            Your 1-year subscription is now active. Enjoy unlimited projects and premium features!
          </p>
          <button
            onClick={() => navigate({ to: '/projects' })}
            className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            Go to Projects <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Cancelled state
  if (status === 'cancelled') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg p-8 text-center border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            No worries! You can try again whenever you're ready.
          </p>
          <button
            onClick={() => setStatus(null)}
            className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Already premium - show subscription info
  if (user?.paid && subscriptionInfo?.subscription) {
    const sub = subscriptionInfo.subscription;
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium text-sm">Premium Member</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Subscription</h1>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Subscription Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium text-foreground">Premium (1 Year)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 text-primary font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Active
                </span>
              </div>
              {sub.paidAt && (
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Purchase Date</span>
                  <span className="font-medium text-foreground">{formatDate(sub.paidAt)}</span>
                </div>
              )}
              {sub.expiresAt && (
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-muted-foreground">Expires On</span>
                  <span className="font-medium text-foreground">{formatDate(sub.expiresAt)}</span>
                </div>
              )}
              {sub.stripeSessionId && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm text-muted-foreground">{sub.stripeSessionId.slice(-12)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Premium Benefits</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{feature.text}</p>
                    <p className="text-muted-foreground text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate({ to: '/projects' })}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-medium py-2 px-6 rounded-md hover:bg-primary/90"
            >
              Go to Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default - Upgrade page
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium text-sm">Premium Subscription</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Upgrade to Premium
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Remove the 2-project limit and unlock premium features for your team.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-card rounded-lg border border-border p-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm uppercase tracking-wide mb-2">1 Year Subscription</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">{priceInfo?.display || '$49.99'}</span>
                <span className="text-muted-foreground">/year</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Subscribe Now
                </>
              )}
            </button>

            <p className="text-center text-muted-foreground text-xs mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground text-center mb-6">Compare Plans</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-background rounded-lg border border-border p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2">Free</h3>
              <p className="text-2xl font-bold text-foreground mb-4">$0</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Up to 2 projects
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Basic task management
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Team collaboration
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4" /> Unlimited projects
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="bg-background rounded-lg border-2 border-primary p-5 relative">
              <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                RECOMMENDED
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium</h3>
              <p className="text-2xl font-bold text-foreground mb-4">{priceInfo?.display || '$49.99'}<span className="text-sm font-normal text-muted-foreground">/year</span></p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Everything in Free
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground font-medium">
                  <Check className="w-4 h-4 text-primary" /> Unlimited projects
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Priority support
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> Advanced analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
