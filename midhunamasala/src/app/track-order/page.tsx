"use client";
import React from 'react';
import Link from 'next/link';

import { clientEnv } from '@/lib/env';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = clientEnv.NEXT_PUBLIC_API_URL;

type BackendOrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  shipping?: number;
  subtotal?: number;
  createdAt: string;
  itemCount?: number;
};

type BackendOrderItem = {
  id: string;
  name: string;
  weight?: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderDetail = {
  order: BackendOrderSummary;
  items: BackendOrderItem[];
};

type TimelineStep = { status: string; completed: boolean };

function statusRank(status: string): number {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return 1;
  if (s === 'paid') return 2;
  if (s === 'packed') return 3;
  if (s === 'shipped') return 4;
  if (s === 'delivered') return 5;
  if (s === 'cancelled') return 99;
  if (s === 'refund') return 98;
  return 1;
}

function buildTimeline(status: string): TimelineStep[] {
  const s = String(status || '').toLowerCase();
  if (s === 'cancelled') {
    return [
      { status: 'Received', completed: true },
      { status: 'Cancelled', completed: true },
    ];
  }
  if (s === 'refund') {
    return [
      { status: 'Received', completed: true },
      { status: 'Refund', completed: true },
    ];
  }

  const rank = statusRank(s);
  return [
    { status: 'Received', completed: rank >= 1 },
    { status: 'Packed', completed: rank >= 3 },
    { status: 'Shipped', completed: rank >= 4 },
    { status: 'Delivered', completed: rank >= 5 },
  ];
}

function statusLabel(status: string): string {
  const s = String(status || '').toLowerCase();
  if (s === 'pending') return 'Received';
  if (s === 'paid') return 'Paid';
  if (s === 'packed') return 'Packed';
  if (s === 'shipped') return 'Shipped';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled') return 'Cancelled';
  if (s === 'refund') return 'Refund';
  return 'Processing';
}

export default function TrackOrderPage() {
  const { user, isLoading: authLoading, getIdToken } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  const [orders, setOrders] = React.useState<BackendOrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(false);
  const [ordersError, setOrdersError] = React.useState<string | null>(null);

  const [trackOrderNumber, setTrackOrderNumber] = React.useState('');
  const [trackEmailOrPhone, setTrackEmailOrPhone] = React.useState('');
  const [trackLoading, setTrackLoading] = React.useState(false);
  const [trackError, setTrackError] = React.useState<string | null>(null);

  const [detailsById, setDetailsById] = React.useState<Record<string, OrderDetail>>({});
  const [detailLoadingId, setDetailLoadingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const token = await getIdToken();
        if (!token) {
          setOrdersError('Please sign in again to view your orders.');
          return;
        }
        const resp = await fetch(`${API_URL}/api/orders?limit=50&offset=0`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json().catch(() => null);
        if (!resp.ok || !data?.success) {
          setOrdersError(data?.error || 'Failed to load orders.');
          return;
        }
        setOrders((data.orders || []) as BackendOrderSummary[]);
      } catch (e) {
        console.error('Load my orders failed:', e);
        setOrdersError('Failed to load orders.');
      } finally {
        setOrdersLoading(false);
      }
    }

    if (user) loadOrders();
  }, [user, getIdToken]);

  const openOrder = async (order: BackendOrderSummary) => {
    const nextId = selectedOrderId === order.id ? null : order.id;
    setSelectedOrderId(nextId);
    if (!nextId) return;
    if (detailsById[nextId]) return;

    setDetailLoadingId(nextId);
    try {
      const token = await getIdToken();
      if (!token) return;
      const resp = await fetch(`${API_URL}/api/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.success) return;

      const rawItems: unknown = data?.items;
      const items = (Array.isArray(rawItems) ? rawItems : []).map((it) => {
        const row = (it ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id ?? ''),
          name: String(row.name ?? ''),
          weight: row.weight ? String(row.weight) : undefined,
          price: Number(row.price ?? 0),
          quantity: Number(row.quantity ?? 0),
          image: row.image ? String(row.image) : undefined,
        } as BackendOrderItem;
      });

      const orderRow: BackendOrderSummary = (data?.order || order) as BackendOrderSummary;
      setDetailsById((prev) => ({ ...prev, [order.id]: { order: orderRow, items } }));
    } catch (e) {
      console.error('Load order details failed:', e);
    } finally {
      setDetailLoadingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0EAE0] px-4 py-6 flex items-center justify-center">
        <div className="text-sm text-[#8B1E1E] font-semibold">Loading…</div>
      </div>
    );
  }

  const submitGuestTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trackLoading) return;

    const orderNumber = trackOrderNumber.trim();
    const ident = trackEmailOrPhone.trim();
    if (!orderNumber || !ident) {
      setTrackError('Enter order number and email/phone.');
      return;
    }

    setTrackLoading(true);
    setTrackError(null);

    try {
      const isEmail = ident.includes('@');
      const params = new URLSearchParams();
      params.set('orderNumber', orderNumber);
      if (isEmail) params.set('email', ident);
      else params.set('phone', ident);

      const resp = await fetch(`${API_URL}/api/orders/track?${params.toString()}`);
      const data = await resp.json().catch(() => null);
      if (!resp.ok || !data?.success) {
        setTrackError(data?.error || 'Order not found.');
        return;
      }

      const order: BackendOrderSummary = data.order as BackendOrderSummary;
      const rawItems: unknown = data.items;
      const items = (Array.isArray(rawItems) ? rawItems : []).map((it) => {
        const row = (it ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id ?? ''),
          name: String(row.name ?? ''),
          weight: row.weight ? String(row.weight) : undefined,
          price: Number(row.price ?? 0),
          quantity: Number(row.quantity ?? 0),
          image: row.image ? String(row.image) : undefined,
        } as BackendOrderItem;
      });

      setOrders([order]);
      setDetailsById({ [order.id]: { order, items } });
      setSelectedOrderId(order.id);
    } catch (err) {
      console.error('Guest track order failed:', err);
      setTrackError('Failed to track order. Please try again.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EAE0] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] rounded-full mb-4 shadow-md">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#8B1E1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Order Tracking
          </h1>
          <p className="text-base text-[#D4AF37] italic" style={{ fontFamily: 'Crimson Text, serif' }}>
            Track your spice journey from our village to your kitchen.
          </p>
        </div>

        {!user && (
          <div className="mx-auto max-w-xl bg-white rounded-2xl shadow-lg p-5 mb-8">
            <form onSubmit={submitGuestTracking} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#8B1E1E] mb-1">Order Number</label>
                <input
                  value={trackOrderNumber}
                  onChange={(e) => setTrackOrderNumber(e.target.value)}
                  placeholder="e.g. MM-10023"
                  className="w-full rounded-lg border border-[#E5D4B8] px-3 py-2 text-sm outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B1E1E] mb-1">Email or Phone</label>
                <input
                  value={trackEmailOrPhone}
                  onChange={(e) => setTrackEmailOrPhone(e.target.value)}
                  placeholder="email@example.com or phone"
                  className="w-full rounded-lg border border-[#E5D4B8] px-3 py-2 text-sm outline-none focus:border-[#D4AF37]"
                />
              </div>

              {trackError && <div className="text-sm text-red-600">{trackError}</div>}

              <button
                type="submit"
                disabled={trackLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white text-sm font-semibold rounded-lg disabled:opacity-60"
              >
                {trackLoading ? 'Tracking…' : 'Track Order'}
              </button>

              <div className="text-xs text-gray-600 text-center">
                Have an account?{' '}
                <Link href="/login" className="text-[#8B1E1E] underline underline-offset-2">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Orders Grid Layout */}
        {ordersError && (
          <div className="mx-auto max-w-lg bg-white rounded-xl shadow p-4 text-sm text-red-600 mb-6">
            {ordersError}
          </div>
        )}

        {user && ordersLoading ? (
          <div className="text-center text-sm text-[#8B1E1E] font-semibold">Loading orders…</div>
        ) : user && orders.length === 0 ? (
          <div className="mx-auto max-w-lg bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">No orders yet.</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
              const label = statusLabel(order.status);
              return (
                <div
                  key={order.id}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Diagonal Ribbon - Top Right Corner */}
                  <div className="absolute top-0 right-0 z-20 overflow-hidden w-28 h-28">
                    <div className={`absolute transform rotate-45 text-center text-[10px] font-bold uppercase tracking-wider py-1.5 w-40 top-6 -right-10 shadow-md ${label === 'Delivered'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : label === 'Cancelled' || label === 'Refund'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                        : 'bg-gradient-to-r from-[#D4AF37] to-[#C9A030] text-[#8B1E1E]'
                      }`}>
                      {label}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-4">
                        <h3 className="text-base font-bold text-[#8B1E1E] mb-0.5 line-clamp-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
                          <span className="text-[#D4AF37]">•</span>
                          <span>{order.itemCount ?? 0} item{(order.itemCount ?? 0) === 1 ? '' : 's'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                          ₹{Number(order.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => void openOrder(order)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] text-white text-xs font-semibold rounded-lg hover:from-[#6B1515] hover:to-[#8B1E1E] transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                    >
                      {selectedOrderId === order.id ? 'Hide Details' : 'View Journey'}
                      <svg className={`w-4 h-4 transition-transform duration-300 ${selectedOrderId === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Modal Overlay for Order Details */}
      {selectedOrderId && (() => {
        const orderSummary = orders.find(o => o.id === selectedOrderId);
        if (!orderSummary) return null;

        const detail = detailsById[selectedOrderId];
        const order = detail?.order || orderSummary;
        const items = detail?.items || [];
        const timeline = buildTimeline(order.status);
        const label = statusLabel(order.status);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrderId(null)}>
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#8B1E1E] to-[#A02C2C] px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-xs text-white/70">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Order ID */}
              <div className="px-5 py-3 border-b border-[#E5D4B8]/30 flex items-center justify-between bg-[#FAF8F3]">
                <span className="text-sm text-gray-500">Order Reference</span>
                <span className="text-sm font-bold text-[#8B1E1E] bg-[#8B1E1E]/10 px-3 py-1 rounded-full">{order.orderNumber}</span>
              </div>

              {/* Timeline */}
              <div className="px-5 py-4">
                <h4 className="text-xs font-bold text-[#8B1E1E] mb-4 uppercase tracking-wider">
                  Order Journey
                </h4>
                <div className="relative">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#E5D4B8]"></div>
                  <div className="flex justify-between relative">
                    {timeline.map((step, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.completed
                          ? 'bg-gradient-to-br from-[#8B1E1E] to-[#A02C2C] border-[#8B1E1E] text-white'
                          : 'bg-white border-[#E5D4B8] text-gray-300'
                          } shadow-sm z-10`}>
                          {step.completed ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[10px] font-bold">{index + 1}</span>
                          )}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-semibold ${step.completed ? 'text-[#8B1E1E]' : 'text-gray-400'
                          }`}>{step.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-600">
                  Current status: <span className="font-semibold text-[#8B1E1E]">{label}</span>
                </div>
              </div>

              {/* Order Contents */}
              <div className="px-5 pb-4">
                <h4 className="text-xs font-bold text-[#8B1E1E] mb-3 uppercase tracking-wider">
                  Order Contents
                </h4>
                {detailLoadingId === selectedOrderId ? (
                  <div className="text-sm text-gray-600">Loading items…</div>
                ) : items.length === 0 ? (
                  <div className="text-sm text-gray-600">No items found for this order.</div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div key={item.id || index} className="flex items-center gap-3 p-2.5 bg-[#FAF8F3] rounded-lg">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0 shadow-sm">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-lg">🌶️</div>';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🌶️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#8B1E1E] truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.weight ? `${item.weight} • ` : ''}Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-[#8B1E1E]">₹{Number(item.price || 0).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="px-5 py-4 bg-[#FAF8F3] border-t border-[#E5D4B8]/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">Payment: <span className="font-semibold text-[#8B1E1E]">{String(order.paymentStatus || '').toUpperCase()}</span></span>
                    </div>
                    <p className="text-base font-bold text-[#8B1E1E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Total: <span className="text-lg">₹{Number(order.total || 0).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
