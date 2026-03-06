"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ─── Cart Item Type ───
// This is what the frontend uses to display cart items.
export interface CartItem {
  id: number;          // Numeric ID (generated from slug for backward compat)
  productId?: string;  // Supabase UUID of the product (used for API calls)
  slug?: string;       // Product slug (e.g. "guntur-red-chilli")
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  total: number;
  shipping: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Helper: Generate a numeric ID from a slug ───
// This keeps backward compatibility with the old cart system
// that used numeric IDs.
function slugToNumericId(slug: string): number {
  return slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, getIdToken } = useAuth();

  // Track if we've already synced for this login session
  const hasSyncedRef = useRef(false);
  // Track previous auth state to detect login
  const prevAuthRef = useRef(false);

  // ─── Load cart from localStorage on mount ───
  // This runs once when the app loads, so the cart appears instantly
  // even before we check the backend.
  useEffect(() => {
    const savedCart = localStorage.getItem('midhunamasala-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
      }
    }
  }, []);

  // ─── Save cart to localStorage whenever it changes ───
  // This ensures the cart persists even if the user isn't logged in.
  useEffect(() => {
    if (items.length > 0 || localStorage.getItem('midhunamasala-cart')) {
      localStorage.setItem('midhunamasala-cart', JSON.stringify(items));
    }
  }, [items]);

  // ─── Sync cart when user logs in ───
  // This is the key part:
  // 1. When user logs in, send local cart items to backend (merge)
  // 2. Then fetch the full cart from backend (which now has everything)
  // 3. Update local state with the backend cart
  useEffect(() => {
    const justLoggedIn = isAuthenticated && !prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (justLoggedIn && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncCartOnLogin();
    }

    // Reset sync flag when user logs out
    if (!isAuthenticated) {
      hasSyncedRef.current = false;
    }
  }, [isAuthenticated]);

  // ─── Sync local cart to backend on login ───
  async function syncCartOnLogin() {
    try {
      const token = await getIdToken();
      if (!token) return;

      // Step 1: If there are local items, send them to backend to merge
      if (items.length > 0) {
        const syncItems = items.map(item => ({
          slug: item.slug || generateSlugFromName(item.name),
          quantity: item.quantity,
        }));

        await fetch(`${API_URL}/api/cart/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ items: syncItems }),
        });
      }

      // Step 2: Fetch the full cart from backend
      await loadCartFromBackend(token);
    } catch (error) {
      console.error('Cart sync on login failed:', error);
    }
  }

  // ─── Load cart from backend ───
  async function loadCartFromBackend(token?: string) {
    try {
      if (!token) {
        token = await getIdToken() || undefined;
      }
      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.items) {
          // Transform backend items to frontend format
          const backendItems: CartItem[] = data.items.map((item: any) => ({
            id: slugToNumericId(item.slug || ''),
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            weight: item.weight || '100g',
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            inStock: item.inStock,
          }));
          setItems(backendItems);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from backend:', error);
    }
  }

  // ─── Helper: Generate slug from product name ───
  function generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // ─── API helper: Call backend cart endpoint ───
  async function callCartApi(method: string, path: string, body?: any) {
    if (!isAuthenticated) return; // Only sync if logged in

    try {
      const token = await getIdToken();
      if (!token) return;

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      await fetch(`${API_URL}/api/cart${path}`, options);
    } catch (error) {
      console.error(`Cart API ${method} ${path} failed:`, error);
      // Don't throw — local state is already updated, backend sync is best-effort
    }
  }

  // ─── Add to Cart ───
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });

    // Sync to backend (fire and forget)
    if (product.productId) {
      callCartApi('POST', '', { productId: product.productId, quantity });
    }
  }, [isAuthenticated]);

  // ─── Remove from Cart ───
  const removeFromCart = useCallback((id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    setItems(prevItems => prevItems.filter(item => item.id !== id));

    // Sync to backend
    if (itemToRemove?.productId) {
      callCartApi('DELETE', `/${itemToRemove.productId}`);
    }
  }, [items, isAuthenticated]);

  // ─── Update Quantity ───
  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    const itemToUpdate = items.find(item => item.id === id);
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    // Sync to backend
    if (itemToUpdate?.productId) {
      callCartApi('PUT', `/${itemToUpdate.productId}`, { quantity });
    }
  }, [items, isAuthenticated]);

  // ─── Clear Cart ───
  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('midhunamasala-cart');

    // Sync to backend
    callCartApi('DELETE', '');
  }, [isAuthenticated]);

  // ─── Computed Values ───
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 25 ? 0 : 3.99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        total,
        shipping,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
