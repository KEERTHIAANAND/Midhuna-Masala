"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Admin emails that are allowed to access admin panel
export const ADMIN_EMAILS = [
    'keerthiaanand77@gmail.com',
    // Add more admin emails here
];

export interface User {
    id: string;           // Supabase UUID (or Firebase UID as fallback)
    firebaseUid: string;  // Firebase UID
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: string;        // 'customer' or 'admin' from backend
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
    signUpWithEmail: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
    signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
    getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Helper: Get the current Firebase ID token
 */
async function getFirebaseIdToken(): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    try {
        return await currentUser.getIdToken();
    } catch (error) {
        console.error('Failed to get ID token:', error);
        return null;
    }
}

/**
 * Helper: Sync user to backend Supabase DB
 */
async function syncUserToBackend(idToken: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_URL}/api/auth/sync-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            console.error('Backend sync failed:', response.status);
            return null;
        }

        const data = await response.json();
        if (data.success && data.user) {
            return {
                id: data.user.id,
                firebaseUid: data.user.firebaseUid,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone || undefined,
                avatar: data.user.avatarUrl || undefined,
                role: data.user.role,
            };
        }
        return null;
    } catch (error) {
        console.error('Backend sync error:', error);
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if current user is admin (from backend role OR email list)
    const isAdmin = user?.role === 'admin' ||
        (user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Set basic user data immediately (fast UI)
                const basicUser: User = {
                    id: firebaseUser.uid,
                    firebaseUid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'User',
                    email: firebaseUser.email || '',
                    avatar: firebaseUser.photoURL || undefined,
                    phone: firebaseUser.phoneNumber || undefined,
                };
                setUser(basicUser);
                setIsLoading(false);

                // Sync to backend in the background (enriches with Supabase data)
                try {
                    const idToken = await firebaseUser.getIdToken();
                    const backendUser = await syncUserToBackend(idToken);
                    if (backendUser) {
                        setUser(backendUser);
                    }
                } catch (error) {
                    console.error('Background sync failed:', error);
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // ─── Google Sign In ───
    const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const basicUser: User = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || undefined,
                phone: firebaseUser.phoneNumber || undefined,
            };
            setUser(basicUser);
            setIsLoading(false);

            // Sync to backend
            const idToken = await firebaseUser.getIdToken();
            const backendUser = await syncUserToBackend(idToken);
            if (backendUser) {
                setUser(backendUser);
                return { success: true, isAdmin: backendUser.role === 'admin' };
            }

            const userIsAdmin = ADMIN_EMAILS.includes(basicUser.email.toLowerCase());
            return { success: true, isAdmin: userIsAdmin };
        } catch (error: unknown) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
            console.error('Google sign-in error:', error);
            return { success: false, error: errorMessage };
        }
    };

    // ─── Email Sign Up ───
    const signUpWithEmail = async (
        name: string, email: string, password: string, phone?: string
    ): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        try {
            // Create user in Firebase Auth
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            // Set display name in Firebase
            await updateProfile(firebaseUser, { displayName: name });

            // Set local user immediately
            const basicUser: User = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: name,
                email: firebaseUser.email || email,
                phone: phone || undefined,
                avatar: undefined,
            };
            setUser(basicUser);
            setIsLoading(false);

            // Sync to backend (creates user in Supabase)
            const idToken = await firebaseUser.getIdToken(true); // force refresh to get updated name
            const backendUser = await syncUserToBackend(idToken);
            if (backendUser) {
                // If phone was provided, update it in Supabase too
                if (phone) {
                    try {
                        await fetch(`${API_URL}/api/auth/me`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${idToken}`,
                            },
                            body: JSON.stringify({ name, phone }),
                        });
                    } catch (e) {
                        console.error('Failed to update phone:', e);
                    }
                }
                setUser({ ...backendUser, name, phone: phone || backendUser.phone });
            }

            return { success: true };
        } catch (error: unknown) {
            setIsLoading(false);
            let errorMessage = 'Failed to create account';
            if (error instanceof Error) {
                const code = (error as any).code;
                if (code === 'auth/email-already-in-use') errorMessage = 'This email is already registered. Please sign in instead.';
                else if (code === 'auth/weak-password') errorMessage = 'Password is too weak. Must be at least 6 characters.';
                else if (code === 'auth/invalid-email') errorMessage = 'Please enter a valid email address.';
                else errorMessage = error.message;
            }
            console.error('Email sign-up error:', error);
            return { success: false, error: errorMessage };
        }
    };

    // ─── Email Sign In ───
    const signInWithEmail = async (
        email: string, password: string
    ): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
        setIsLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            const basicUser: User = {
                id: firebaseUser.uid,
                firebaseUid: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || email,
                avatar: firebaseUser.photoURL || undefined,
                phone: firebaseUser.phoneNumber || undefined,
            };
            setUser(basicUser);
            setIsLoading(false);

            // Sync to backend
            const idToken = await firebaseUser.getIdToken();
            const backendUser = await syncUserToBackend(idToken);
            if (backendUser) {
                setUser(backendUser);
                return { success: true, isAdmin: backendUser.role === 'admin' };
            }

            const userIsAdmin = ADMIN_EMAILS.includes(basicUser.email.toLowerCase());
            return { success: true, isAdmin: userIsAdmin };
        } catch (error: unknown) {
            setIsLoading(false);
            let errorMessage = 'Failed to sign in';
            if (error instanceof Error) {
                const code = (error as any).code;
                if (code === 'auth/user-not-found') errorMessage = 'No account found with this email. Please sign up first.';
                else if (code === 'auth/wrong-password') errorMessage = 'Incorrect password. Please try again.';
                else if (code === 'auth/invalid-credential') errorMessage = 'Invalid email or password. Please try again.';
                else if (code === 'auth/too-many-requests') errorMessage = 'Too many failed attempts. Please try again later.';
                else if (code === 'auth/invalid-email') errorMessage = 'Please enter a valid email address.';
                else errorMessage = error.message;
            }
            console.error('Email sign-in error:', error);
            return { success: false, error: errorMessage };
        }
    };

    // ─── Logout ───
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...data });
        }
    };

    const getIdToken = async (): Promise<string | null> => {
        return getFirebaseIdToken();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin,
                signInWithGoogle,
                signUpWithEmail,
                signInWithEmail,
                logout,
                updateUser,
                getIdToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
