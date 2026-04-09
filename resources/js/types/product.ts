export type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    created_at: string;
    updated_at: string;
};

export type ProductImage = {
    id: number;
    product_id: number;
    image_url: string;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: number;
    user_id: number;
    category_id: number;
    name: string;
    description: string;
    brand: string | null;
    condition: 'new' | 'good' | 'bad' | 'poor';
    size: string | null;
    color: string | null;
    material: string | null;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'sold' | 'deleted';
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
    category?: Category;
    seller?: ProductSeller;
    reviews?: Review[];
    reviews_count?: number;
    is_wishlisted?: boolean;
};

export type ProductSeller = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    profile?: SellerProfile;
};

export type SellerProfile = {
    id: number;
    user_id: number;
    phone: string;
    address: string;
    city: string;
};

export type Review = {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
};

export type CartItemType = {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    size: string | null;
    created_at: string;
    updated_at: string;
    product?: Product;
};

export type PaginatedProducts = {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
