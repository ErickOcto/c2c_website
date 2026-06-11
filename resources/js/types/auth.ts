export type Profile = {
    id: number;
    user_id: number;
    phone?: string;
    address?: string;
    city?: string;
    city_id?: number;
    province_id?: number;
    province_name?: string;
    postal_code?: string;
    profile_picture?: string;
    date_of_birth?: string;
    gender?: string;
    nationality?: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    profile?: Profile;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
