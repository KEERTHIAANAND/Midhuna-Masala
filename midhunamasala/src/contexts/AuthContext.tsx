"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

// Admin emails that are allowed to access admin panel
export const ADMIN_EMAILS = [
    'keerthiaanand77@gmail.com',
    // Add more admin emails here
];

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if current user is admin
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Convert Firebase user to our User type
                const userData: User = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'User',
                    email: firebaseUser.email || '',
                    avatar: firebaseUser.photoURL || undefined,
                    phone: firebaseUser.phoneNumber || undefined
                };
                setUser(userData);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async (): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const userData: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                avatar: firebaseUser.photoURL || undefined,
                phone: firebaseUser.phoneNumber || undefined
            };

            setUser(userData);
            setIsLoading(false);

            // Check if the signed-in user is an admin
            const userIsAdmin = ADMIN_EMAILS.includes(userData.email.toLowerCase());
            return { success: true, isAdmin: userIsAdmin };
        } catch (error: unknown) {
            setIsLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
            console.error('Google sign-in error:', error);
            return { success: false, error: errorMessage };
        }
    };

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

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                isAdmin,
                signInWithGoogle,
                logout,
                updateUser,
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
