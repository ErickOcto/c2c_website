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
    department?: 'men' | 'women' | 'kids' | 'unisex';
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
    next_page_url?: string | null;
    prev_page_url?: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

// --- Checkout Types ---

export type Address = {
    id: number;
    user_id: number;
    label: string;
    recipient_name: string;
    phone: string;
    address_line: string;
    city_id: number;
    city_name: string;
    province_id: number;
    province_name: string;
    postal_code: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
};

export type SellerGroup = {
    seller_id: number;
    seller_name: string;
    seller_city: string;
    items: CartItemType[];
    subtotal: number;
    shipping: null;
};

export type ShippingService = {
    service: string;
    description: string;
    cost: { value: number; etd: string; note: string }[];
};

export type ShippingCourierResult = {
    code: string;
    name: string;
    costs: ShippingService[];
};
