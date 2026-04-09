<?php

namespace Modules\Product\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Modules\Cart\Models\Wishlist;
use Modules\Feedback\Models\Review;

class Product extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'department',
        'name',
        'description',
        'brand',
        'condition',
        'size',
        'color',
        'material',
        'price',
        'stock',
        'status',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return HasMany<ProductImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * @return HasMany<Review, $this>
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * @return HasMany<Wishlist, $this>
     */
    public function wishlistedBy(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }
}
