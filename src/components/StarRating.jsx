import { useState } from 'react';

export default function StarRating({ rating, setRating, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  const handleClick = (value) => {
    if (!readonly && setRating) {
      setRating(value);
    }
  };

  const renderStar = (index) => {
    const filled = readonly ? index <= rating : index <= (hover || rating);
    
    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(index)}
        onMouseEnter={() => !readonly && setHover(index)}
        onMouseLeave={() => !readonly && setHover(0)}
        disabled={readonly}
        className={`${sizeClass} transition-all ${
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
        } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        {filled ? '★' : '☆'}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
      {readonly && rating > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
