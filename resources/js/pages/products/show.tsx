import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Product, Review as ReviewType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConditionBadge } from '@/components/condition-badge';
import { StarRating } from '@/components/star-rating';
import { ProductCard } from '@/components/product-card';
import { ReportDialog } from '@/components/report-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import wishlistRoutes from '@/routes/wishlist';
import {
    ShoppingBag,
    MessageCircle,
    UserPlus,
    MapPin,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    Minus,
    Plus,
    Heart,
    Share2,
    Star,
    CheckCircle2,
    PenLine,
} from 'lucide-react';

type Props = {
    product: Product;
    relatedProducts: Product[];
    isWishlisted: boolean;
    canReview: boolean;
    userReview?: ReviewType | null;
};

export default function ProductShow({ product, relatedProducts, isWishlisted: initialWishlisted, canReview, userReview }: Props) {
    const { auth } = usePage<{ auth: { user: any } }>().props;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(product.size ?? '');
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const images = product.images ?? [];
    const currentImage =
        images[selectedImageIndex]?.image_url ??
        'https://placehold.co/600x800/e2e8f0/475569?text=No+Image';

    const reviews = product.reviews ?? [];
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        percentage:
            reviews.length > 0
                ? (reviews.filter((r) => r.rating === star).length /
                      reviews.length) *
                  100
                : 0,
    }));

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);

    const availableSizes = product.size
        ? product.size.includes(',')
            ? product.size.split(',').map((s) => s.trim())
            : [product.size]
        : ['S', 'M', 'L', 'XL'];

    function handleAddToCart() {
        setProcessing(true);
        router.post('/cart', {
            product_id: product.id,
            quantity,
            size: selectedSize,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Added to cart! 🛍️'),
            onError: () => toast.error('Failed to add to cart.'),
            onFinish: () => setProcessing(false),
        });
    }

    function handleWishlistToggle() {
        if (!auth.user) {
            router.get('/login');
            return;
        }
        router.post(wishlistRoutes.toggle.url({ product: product.id }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setWishlisted((prev) => {
                    const next = !prev;
                    toast[next ? 'success' : 'info'](next ? 'Added to wishlist! ❤️' : 'Removed from wishlist.');
                    return next;
                });
            },
            onError: () => toast.error('Failed to update wishlist.'),
        });
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            toast.success('Link copied to clipboard! 🔗');
        }).catch(() => {
            toast.error('Could not copy link.');
        });
    }

    function handleSubmitReview(e: React.FormEvent) {
        e.preventDefault();
        setSubmittingReview(true);
        router.post(`/products/${product.id}/review`, {
            rating: reviewRating,
            comment: reviewComment,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Review submitted! Thank you.');
                setReviewOpen(false);
            },
            onError: () => toast.error('Failed to submit review.'),
            onFinish: () => setSubmittingReview(false),
        });
    }

    function nextImage() {
        setSelectedImageIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : 0,
        );
    }

    function prevImage() {
        setSelectedImageIndex((prev) =>
            prev > 0 ? prev - 1 : images.length - 1,
        );
    }

    return (
        <>
            <Head title={product.name} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link
                                href={`/search?category=${product.category.id}`}
                                className="hover:text-foreground transition-colors"
                            >
                                {product.category.name}
                            </Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-foreground truncate max-w-[200px]">
                        {product.name}
                    </span>
                </nav>

                {/* Main Product Section: Left Images, Right Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* LEFT: Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div
                            className="relative aspect-3/4 sm:aspect-4/5 overflow-hidden rounded-2xl bg-muted cursor-zoom-in group"
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <img
                                src={currentImage}
                                alt={product.name}
                                className={`h-full w-full object-cover transition-transform duration-500 ${
                                    isZoomed ? 'scale-150' : 'scale-100'
                                }`}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-background/80 backdrop-blur-sm rounded-full p-2">
                                    <ZoomIn className="h-5 w-5" />
                                </div>
                            </div>
                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                            {/* Image counter */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
                                    {selectedImageIndex + 1} / {images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                                            idx === selectedImageIndex
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-transparent hover:border-border opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="space-y-6">
                        {/* Title & Price */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {product.category && (
                                    <Badge variant="secondary" className="text-xs">
                                        {product.category.name}
                                    </Badge>
                                )}
                                <ConditionBadge condition={product.condition} />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold font-heading tracking-tight mb-3">
                                {product.name}
                            </h1>
                            <p className="text-3xl md:text-4xl font-bold text-primary">
                                {formatPrice(product.price)}
                            </p>
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating rating={averageRating} size="sm" />
                                    <span className="text-sm text-muted-foreground">
                                        ({reviews.length}{' '}
                                        {reviews.length === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Size Selector */}
                        <div>
                            <label className="text-sm font-semibold mb-3 block">
                                Size
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[48px] h-10 px-4 rounded-lg border text-sm font-medium transition-all ${
                                            selectedSize === size
                                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                : 'bg-background border-input hover:border-primary/50 hover:bg-accent'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        {auth.user?.id === product.user_id ? (
                            <div className="w-full text-center p-4 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground border border-border">
                                This is your product. You cannot purchase your own listings.
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center border border-input rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-11 w-11 flex items-center justify-center hover:bg-accent rounded-l-lg transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="h-11 w-12 flex items-center justify-center text-sm font-medium border-x border-input">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-11 w-11 flex items-center justify-center hover:bg-accent rounded-r-lg transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button
                                    size="lg"
                                    className="flex-1 rounded-lg font-semibold text-base"
                                    onClick={handleAddToCart}
                                    disabled={processing}
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    {processing ? 'Adding...' : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-lg"
                                    onClick={handleWishlistToggle}
                                    aria-label="Toggle wishlist"
                                >
                                    <Heart
                                        className={`h-5 w-5 transition-colors ${
                                            wishlisted ? 'fill-red-500 text-red-500' : ''
                                        }`}
                                    />
                                </Button>
                            </div>
                        )}

                        <Separator />

                        {/* Product Details Table */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3">
                                Product Details
                            </h3>
                            <Card>
                                <Table>
                                    <TableBody>
                                        {product.brand && (
                                            <TableRow>
                                                <TableCell className="font-medium text-muted-foreground w-1/3">
                                                    Brand
                                                </TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell className="font-medium text-muted-foreground">
                                                Condition
                                            </TableCell>
                                            <TableCell>
                                                <ConditionBadge condition={product.condition} />
                                            </TableCell>
                                        </TableRow>
                                        {product.size && (
                                            <TableRow>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    Size
                                                </TableCell>
                                                <TableCell>{product.size}</TableCell>
                                            </TableRow>
                                        )}
                                        {product.color && (
                                            <TableRow>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    Color
                                                </TableCell>
                                                <TableCell>{product.color}</TableCell>
                                            </TableRow>
                                        )}
                                        {product.material && (
                                            <TableRow>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    Material
                                                </TableCell>
                                                <TableCell>{product.material}</TableCell>
                                            </TableRow>
                                        )}
                                        {product.category && (
                                            <TableRow>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    Category
                                                </TableCell>
                                                <TableCell>{product.category.name}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2">
                                Description
                            </h3>
                            <div 
                                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>

                        <Separator />

                        {/* Seller Card */}
                        {product.seller && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={product.seller.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {product.seller.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm">
                                                {product.seller.name}
                                            </h4>
                                            {product.seller.profile?.city && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                    <MapPin className="h-3 w-3" />
                                                    {product.seller.profile.city}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-3">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-full text-xs"
                                                    onClick={() => {
                                                        router.post('/chat', {
                                                            receiver_id: product.seller!.id,
                                                            product_id: product.id,
                                                        });
                                                    }}
                                                >
                                                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                                    Chat
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="rounded-full text-xs"
                                                >
                                                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                                                    Follow
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Share & Report */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={handleShare}
                            >
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                            </Button>
                            <ReportDialog productId={product.id} />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-heading tracking-tight">
                            Reviews
                        </h2>
                        {/* Write a Review */}
                        {canReview && (
                            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <PenLine className="h-4 w-4 mr-2" />
                                        Write a Review
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Write a Review</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <Label className="mb-2 block">Rating</Label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        className="p-1 transition-colors"
                                                    >
                                                        <Star
                                                            className={`h-7 w-7 transition-colors ${
                                                                star <= reviewRating
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-muted-foreground'
                                                            }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="review-comment" className="mb-2 block">
                                                Comment (optional)
                                            </Label>
                                            <Textarea
                                                id="review-comment"
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder="Share your experience with this product..."
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setReviewOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" disabled={submittingReview}>
                                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                        {userReview && (
                            <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                You reviewed this
                            </Badge>
                        )}
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Rating Summary */}
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <p className="text-5xl font-bold mb-2">
                                        {averageRating.toFixed(1)}
                                    </p>
                                    <StarRating
                                        rating={averageRating}
                                        size="lg"
                                    />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Based on {reviews.length}{' '}
                                        {reviews.length === 1
                                            ? 'review'
                                            : 'reviews'}
                                    </p>
                                    <Separator className="my-4" />
                                    <div className="space-y-2">
                                        {ratingDistribution.map((dist) => (
                                            <div
                                                key={dist.star}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <span className="w-3 text-right">
                                                    {dist.star}
                                                </span>
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full transition-all"
                                                        style={{
                                                            width: `${dist.percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-6 text-right text-muted-foreground text-xs">
                                                    {dist.count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Review List */}
                            <div className="lg:col-span-2 space-y-4">
                                {reviews.map((review) => (
                                    <Card key={review.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={review.user?.avatar}
                                                    />
                                                    <AvatarFallback className="text-xs bg-muted">
                                                        {review.user?.name?.charAt(0) ?? '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">
                                                            {review.user?.name ?? 'Anonymous'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                    <StarRating
                                                        rating={review.rating}
                                                        size="sm"
                                                    />
                                                    {review.comment && (
                                                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                                            {review.comment}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p>No reviews yet for this product.</p>
                                {canReview && (
                                    <Button
                                        className="mt-4"
                                        size="sm"
                                        onClick={() => setReviewOpen(true)}
                                    >
                                        <PenLine className="h-4 w-4 mr-2" />
                                        Be the first to review!
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-xl font-bold font-heading tracking-tight mb-6">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
