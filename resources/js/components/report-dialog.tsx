import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Flag } from 'lucide-react';

type Props = {
    productId: number;
};

const reportReasons = [
    'Counterfeit item',
    'Inappropriate content',
    'Misleading description',
    'Suspected scam',
    'Prohibited item',
    'Other',
];

export function ReportDialog({ productId }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        reason: '',
        description: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/products/${productId}/report`, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Flag className="h-4 w-4 mr-1" />
                    Report this item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Report Product</DialogTitle>
                        <DialogDescription>
                            Help us keep the marketplace safe. Please select a
                            reason for your report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Reason
                            </label>
                            <Select
                                value={data.reason}
                                onValueChange={(value) =>
                                    setData('reason', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {reportReasons.map((reason) => (
                                        <SelectItem
                                            key={reason}
                                            value={reason}
                                        >
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.reason && (
                                <p className="text-sm text-destructive">
                                    {errors.reason}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Additional details (optional)
                            </label>
                            <textarea
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                rows={3}
                                placeholder="Provide any additional context..."
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={processing || !data.reason}
                        >
                            {processing ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
