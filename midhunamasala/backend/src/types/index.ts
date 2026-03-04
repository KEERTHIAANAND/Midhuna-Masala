import { Request } from 'express';

// Extends Express Request to include authenticated user data
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email: string;
        name?: string;
        avatar?: string;
    };
}

// Database row types
export interface UserRow {
    id: string;
    firebase_uid: string;
    email: string;
    name: string;
    phone: string | null;
    avatar_url: string | null;
    role: 'customer' | 'admin';
    created_at: string;
    updated_at: string;
}

export interface AddressRow {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    street: string;
    landmark: string | null;
    city: string;
    state: string;
    pincode: string;
    label: 'home' | 'work' | 'other';
    is_default: boolean;
    created_at: string;
}
