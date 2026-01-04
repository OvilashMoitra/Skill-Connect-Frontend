import { useState } from 'react';
import StarRating from '../StarRating';
import RatingService from '../../services/rating.service';
import toast from 'react-hot-toast';

export default function RatingModal({
  isOpen,
  onClose,
  toUserId,
  toUserName,
  entityType,
  entityId,
  entityName,
  onSuccess,
  showSkip = false,
  onSkip,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      await RatingService.submitRating({
        toUserId,
        entityType,
        entityId,
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success('Rating submitted successfully!');
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={showSkip ? onSkip : onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="bg-card border-4 border-primary rounded-lg shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="p-6 border-b-2 border-border">
            <h2 className="text-2xl font-black">
              {showSkip ? '🎉 Task Completed!' : 'Rate Performance'}
            </h2>
            {showSkip && (
              <p className="text-sm text-green-500 font-bold mt-1">
                Would you like to rate {toUserName}'s work?
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {showSkip ? 'Rating' : 'Rating'} {toUserName}
            </p>
            <p className="text-xs text-muted-foreground">
              {entityType === 'task' ? 'Task' : 'Project'}: "{entityName}"
            </p>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">
                Your Rating *
              </label>
              <div className="flex justify-center">
                <StarRating rating={rating} setRating={setRating} size="lg" />
              </div>
              {rating > 0 && (
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  {rating === 1 && '⭐ Poor'}
                  {rating === 2 && '⭐⭐ Fair'}
                  {rating === 3 && '⭐⭐⭐ Good'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your feedback..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 bg-secondary border-2 border-border rounded-lg focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {showSkip ? (
                <button
                  type="button"
                  onClick={onSkip}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-accent transition disabled:opacity-50"
                >
                  Skip for Now
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-accent transition disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : '⭐ Submit Rating'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

