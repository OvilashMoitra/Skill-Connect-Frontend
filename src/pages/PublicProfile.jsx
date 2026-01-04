import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import StarRating from '../components/StarRating';
import RatingService from '../services/rating.service';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PublicProfile() {
  const { userId } = useParams({ strict: false });
  const [profile, setProfile] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Feedback form state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      loadProfileAndRatings();
    }
  }, [userId]);

  const loadProfileAndRatings = async () => {
    setLoading(true);
    try {
      const profileRes = await api.get(`/profile/${userId}`);
      setProfile(profileRes.data.data);

      const ratingsRes = await RatingService.getUserRatings(userId);
      setRatings(ratingsRes.data.data.ratings || []);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (feedbackRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await RatingService.submitRating({
        toUserId: profile._id,
        entityType: 'project',
        entityId: profile._id,
        rating: feedbackRating,
        comment: feedbackComment.trim() || undefined,
      });

      toast.success('Feedback submitted successfully!');
      setFeedbackRating(0);
      setFeedbackComment('');
      setShowFeedbackForm(false);
      loadProfileAndRatings();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Profile Not Found</h2>
          <p className="text-muted-foreground mt-2">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const canLeaveFeedback = isLoggedIn && currentUserId !== userId;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="bg-card border-4 border-primary rounded-lg overflow-hidden mb-8">
          <div className="bg-primary h-24"></div>
          <div className="p-6 -mt-12">
            <div className="flex items-end gap-6 flex-wrap">
              <div className="w-24 h-24 rounded-full bg-secondary border-4 border-card overflow-hidden flex items-center justify-center">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-muted-foreground">
                    {profile.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-black">{profile.name}</h1>
                <p className="text-muted-foreground capitalize">{profile.auth?.role || 'User'}</p>
              </div>

              <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg text-center">
                <div className="text-3xl font-black">{profile.averageRating?.toFixed(1) || '0.0'}</div>
                <div className="text-sm font-bold">⭐ Rating</div>
              </div>

              {canLeaveFeedback && (
                <button
                  onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                  className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition"
                >
                  {showFeedbackForm ? '✕ Close' : '✍️ Leave Feedback'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        {showFeedbackForm && canLeaveFeedback && (
          <div className="bg-card border-4 border-primary rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Leave Your Feedback</h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Your Rating *</label>
                <div className="flex justify-center py-4 bg-secondary rounded-lg">
                  <StarRating rating={feedbackRating} setRating={setFeedbackRating} size="lg" />
                </div>
                {feedbackRating > 0 && (
                  <p className="text-center mt-2 text-sm text-muted-foreground">
                    {feedbackRating === 1 && '⭐ Poor'}
                    {feedbackRating === 2 && '⭐⭐ Fair'}
                    {feedbackRating === 3 && '⭐⭐⭐ Good'}
                    {feedbackRating === 4 && '⭐⭐⭐⭐ Very Good'}
                    {feedbackRating === 5 && '⭐⭐⭐⭐⭐ Excellent!'}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Your Comment (Optional)</label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience working with this person..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{feedbackComment.length}/500 characters</p>
              </div>

              <button
                type="submit"
                disabled={submitting || feedbackRating === 0}
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : '📤 Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {!isLoggedIn && (
          <div className="bg-secondary border-2 border-border rounded-lg p-4 mb-8 text-center">
            <p className="text-muted-foreground">
              <a href="/login" className="text-primary font-bold hover:underline">Log in</a> to leave feedback for this user.
            </p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {profile.bio && (
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            {profile.skill && profile.skill.length > 0 && (
              <div className="bg-card border-2 border-border rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skill.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card border-2 border-border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Rating Breakdown</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = profile.ratingsBreakdown?.[star] || 0;
                  const total = profile.totalRatings || 0;
                  const percent = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-bold">{star} ⭐</span>
                      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-muted-foreground mt-4 text-sm">{profile.totalRatings || 0} total reviews</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Reviews & Feedback</h3>

              {ratings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No reviews yet</p>
                  {canLeaveFeedback && (
                    <button
                      onClick={() => setShowFeedbackForm(true)}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition"
                    >
                      Be the first to leave feedback!
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {ratings.map((rating, index) => (
                    <div key={rating._id || index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-muted-foreground">
                            {rating.fromUserId?.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div>
                              <span className="font-bold">{rating.fromUserId?.name || 'Anonymous'}</span>
                              <span className="text-muted-foreground text-sm ml-2">• {formatDate(rating.createdAt)}</span>
                            </div>
                            <StarRating rating={rating.rating} readonly size="sm" />
                          </div>
                          {rating.comment && <p className="text-foreground">{rating.comment}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
