import { Star, StarHalf } from 'lucide-react';

type Props = {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    count?: number;
};

export function StarRating({
    rating,
    size = 'md',
    showValue = false,
    count,
}: Props) {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {Array.from({ length: fullStars }, (_, i) => (
                    <Star
                        key={`full-${i}`}
                        className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
                    />
                ))}
                {hasHalfStar && (
                    <StarHalf
                        className={`${sizeClasses[size]} fill-amber-400 text-amber-400`}
                    />
                )}
                {Array.from({ length: emptyStars }, (_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className={`${sizeClasses[size]} text-muted-foreground/30`}
                    />
                ))}
            </div>
            {showValue && (
                <span className="text-sm text-muted-foreground ml-1">
                    {rating.toFixed(1)}
                </span>
            )}
            {count !== undefined && (
                <span className="text-sm text-muted-foreground">
                    ({count})
                </span>
            )}
        </div>
    );
}
