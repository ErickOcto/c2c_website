import type { LinkedProduct } from '@/types';
import { Send, X, Package, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductPickerModal } from './product-picker-modal';

type Props = {
    onSend: (message: string) => void;
    disabled: boolean;
    linkedProduct: LinkedProduct | null;
    onRemoveLinkedProduct: () => void;
    onLinkProduct: (product: LinkedProduct) => void;
    sellerId?: number;
};

export function MessageInput({
    onSend,
    disabled,
    linkedProduct,
    onRemoveLinkedProduct,
    onLinkProduct,
    sellerId,
}: Props) {
    const [text, setText] = useState('');
    const [pickerOpen, setPickerOpen] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (text.trim() && !disabled) {
            onSend(text.trim());
            setText('');
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <>
            <div className="border-t border-border/60 p-4">
                {/* Linked Product Preview */}
                {linkedProduct && (
                    <div className="mb-3 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {linkedProduct.image_url ? (
                                <img
                                    src={linkedProduct.image_url}
                                    alt={linkedProduct.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-4 w-4 text-muted-foreground/40" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold">
                                {linkedProduct.name}
                            </p>
                            <p className="text-[10px] text-primary font-bold">
                                {formatPrice(linkedProduct.price)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={onRemoveLinkedProduct}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                    {/* Attach Product Button */}
                    <Button
                        type="button"
                        variant={linkedProduct ? 'default' : 'outline'}
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-xl transition-all"
                        onClick={() => setPickerOpen(true)}
                        title="Attach product"
                    >
                        <ShoppingBag className="h-4.5 w-4.5" />
                    </Button>

                    <div className="flex-1 relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            className="w-full resize-none rounded-xl border border-input bg-muted/50 px-4 py-3 pr-4 text-sm placeholder:text-muted-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all max-h-32"
                            style={{
                                height: 'auto',
                                minHeight: '44px',
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height =
                                    Math.min(target.scrollHeight, 128) + 'px';
                            }}
                            disabled={disabled}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        className="h-11 w-11 shrink-0 rounded-xl"
                        disabled={!text.trim() || disabled}
                    >
                        <Send className="h-4.5 w-4.5" />
                    </Button>
                </form>
            </div>

            <ProductPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={onLinkProduct}
                sellerId={sellerId}
            />
        </>
    );
}
