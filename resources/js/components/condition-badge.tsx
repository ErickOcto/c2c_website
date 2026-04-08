import { Badge } from '@/components/ui/badge';

type Props = {
    condition: 'new' | 'good' | 'bad' | 'poor';
    className?: string;
};

const conditionConfig = {
    new: {
        label: 'New',
        className:
            'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    good: {
        label: 'Good',
        className:
            'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
    },
    bad: {
        label: 'Fair',
        className:
            'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400',
    },
    poor: {
        label: 'Poor',
        className:
            'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400',
    },
} as const;

export function ConditionBadge({ condition, className = '' }: Props) {
    const config = conditionConfig[condition];

    return (
        <Badge
            variant="outline"
            className={`text-xs font-medium ${config.className} ${className}`}
        >
            {config.label}
        </Badge>
    );
}
