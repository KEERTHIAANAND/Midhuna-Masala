# **----------------------------- *MIDHUNA MASALA* -------------------------------**



### **AIM**

###### Midhuna Masala is an initiative taken by my MOM, this is a full-fledged e-commerce web application for selling homemade masalas, enabling customers to browse, purchase, and track products online with secure payment integration and an intuitive shopping experience. The system also provides an admin dashboard to manage products, stock, and orders efficiently in real time.



---



Running notes by Keerthi:



**CDN (Content Delivery Network)** -> Without a CDN, if your server for the Clinic Appointment Software is in Mumbai, a user in New York has to wait for data to travel across the ocean.



&nbsp;      The First Request: A user in New York asks for an image. The CDN fetches it from your Mumbai server.



&nbsp;      Caching: The CDN keeps a copy of that image in its New York "Edge Location."



&nbsp;      The Fast Track: The next 1,000 users in New York get the image instantly from the local New York cache, never touching your Mumbai server.

1\. Speed (Lower Latency)

2\. Reduced Server Load

3\. Protection (DDoS)

4\. Cost Savings (Egress)



**Ingress fees** -> Fees for data getting into the main server(max. it will be free of cost).

**Egress fees** -> Fees for data getting out from the main server(cost heavy based on the service provider)



**1. The "Auth-DB Gap"**

Normally, Supabase DB uses Supabase Auth to know which user is logged in so it can protect their data. Since you are using Firebase Auth, the Supabase database doesn't automatically "trust" the Firebase user.



You have two choices to fix this:



The Middleware Approach (Recommended): In your Node.js backend, you verify the Firebase ID Token. Once verified, you use the Supabase Service Role Key to perform database actions.



The Supabase-Firebase Integration: Supabase has a "Third-Party Auth" feature. You can actually configure Supabase to accept Firebase JWTs (tokens). This allows you to use Supabase RLS directly with Firebase users.







**frontend next js**

**backend node js express**

**db - text based in supabase and images ae in cloudfare r2 s3 
auth - refer the before para.**



















### **TECH STACK**

|Layer|Technology|Purpose|
|-|-|-|
|Frontend|**Next.js 15** (React)|Pages, Components, SSR/CSR|
|Styling|**Tailwind CSS**|Responsive UI, Animations|
|Backend (BaaS)|**Firebase**|Auth, Firestore DB, Cloud Storage|
|Backend (API)|**Next.js API Routes**|Payments, Order Logic, Emails|
|Authentication|**Firebase Auth**|Google Sign-in, Email/Password|
|Database|**Firestore** (NoSQL)|Products, Orders, Users, Inventory|
|Images|**Cloudinary**|CDN-optimized product images|
|Payments|**Razorpay**|Indian payment gateway (UPI, Cards, Netbanking)|
|Animations|**Framer Motion**|Page transitions, micro-animations|
|Deployment|**Vercel**|Frontend + API (serverless)|
|Code Quality|**SonarQube**|Static analysis, code smells|



---

### **ARCHITECTURE (Hybrid Backend)**

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │   Home   │  │   Shop   │  │   Cart    │  │  Profile   │  │
│  │   Page   │  │   Page   │  │   Page    │  │   Page     │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬─────┘  │
│       │              │              │              │         │
│  ┌────▼──────────────▼──────────────▼──────────────▼─────┐  │
│  │              Context Providers                         │  │
│  │         AuthContext  |  CartContext                     │  │
│  └────────────┬──────────────────┬────────────────────────┘  │
│               │                  │                           │
└───────────────┼──────────────────┼───────────────────────────┘
                │                  │
        ┌───────▼───────┐  ┌──────▼──────────────┐
        │  Firebase SDK │  │  Next.js API Routes  │
        │  (Client)     │  │  /api/\*  (Server)    │
        │               │  │                      │
        │  • Auth       │  │  • /api/orders       │
        │  • Firestore  │  │  • /api/payments     │
        │    reads      │  │  • /api/admin        │
        └───────┬───────┘  │  • /api/notifications│
                │          └──────┬───────────────┘
                │                 │
        ┌───────▼─────────────────▼───────────────┐
        │           FIREBASE (Google Cloud)         │
        │                                           │
        │  ┌──────────┐  ┌───────────┐  ┌────────┐│
        │  │   Auth   │  │ Firestore │  │Storage ││
        │  │          │  │    DB     │  │        ││
        │  └──────────┘  └───────────┘  └────────┘│
        └─────────────────────────────────────────┘

        ┌──────────────┐  ┌──────────────┐
        │  Cloudinary  │  │   Razorpay   │
        │  Image CDN   │  │   Payments   │
        └──────────────┘  └──────────────┘
```



---

### **FLOW OF THE APPLICATION**



---

## **FLOW 1: CUSTOMER JOURNEY**

### **1.1 — Landing \& Browse**

```
User opens website
    │
    ▼
┌─ HOME PAGE ─────────────────────────────────────┐
│  • Hero Section (Cloudinary banner)              │
│  • Our Heritage (3 product categories)           │
│  • Brand Story (Midhuna Legacy)                  │
│  • Testimonials (Marquee carousel)               │
│  • Footer                                        │
└──────────────┬───────────────────────────────────┘
               │
               ▼ Clicks "Explore Our Spices" / "Our Spices" nav
               │
┌─ SHOP PAGE ─────────────────────────────────────┐
│  • Banner with "The Royal Spice Pantry"          │
│  • Category Filter Tabs:                         │
│      All Spices | Whole Spices | Powders | Blends│
│  • Product Grid (2-col mobile, 4-col desktop)    │
│  • Click any product → Product Details Modal     │
│      ├── Product Image (Cloudinary)              │
│      ├── Name, Category, Rating                  │
│      ├── Benefits list                           │
│      ├── Weight selector (100g/200g/500g)        │
│      ├── Quantity picker (+/-)                   │
│      ├── Total price calculation                 │
│      ├── \[Add to Cart] button                    │
│      └── \[Wishlist ❤️] button                    │
└──────────────────────────────────────────────────┘
```

### **1.2 — Authentication**

```
User clicks Profile icon or Login
    │
    ├── Not logged in ──► LOGIN PAGE
    │                      ├── Google Sign-in (Firebase Auth)
    │                      ├── Email + Password login
    │                      └── "Don't have account?" → SIGNUP PAGE
    │                              ├── Name, Email, Password
    │                              ├── Password strength meter
    │                              └── Google Sign-in option
    │
    └── Logged in ──► PROFILE PAGE
                       ├── Tab 1: Overview (Name, Email, Avatar)
                       ├── Tab 2: Order History (Past orders)
                       ├── Tab 3: Settings (Preferences)
                       └── \[Logout] button
```

### **1.3 — Cart \& Checkout**

```
User adds items from Shop
    │
    ▼
┌─ CART PAGE ──────────────────────────────────────┐
│  • Cart items grid (2-col mobile, 3-col desktop) │
│  • Each item card:                               │
│      ├── Checkbox for selection                   │
│      ├── Product image, name, weight              │
│      ├── Price × quantity                        │
│      ├── Quantity controls (+/-)                 │
│      └── \[Remove] button                         │
│                                                  │
│  • Order Summary sidebar (shows when selected):  │
│      ├── Selected items list                     │
│      ├── Subtotal                                │
│      ├── Shipping (Free above ₹500)              │
│      ├── Total                                   │
│      ├── \[Checkout] button                       │
│      └── Trust badges                            │
└──────────────┬───────────────────────────────────┘
               │
               ▼ Clicks "Checkout"
               │
┌─ CHECKOUT FLOW (To be implemented) ─────────────┐
│  Step 1: Delivery Address                        │
│      ├── Saved addresses list                    │
│      ├── Add new address form                    │
│      └── Pin code → auto-fill city/state         │
│                                                  │
│  Step 2: Order Review                            │
│      ├── Items summary                           │
│      ├── Delivery address                        │
│      ├── Expected delivery date                  │
│      └── Apply coupon/promo code                 │
│                                                  │
│  Step 3: Payment (Razorpay)                      │
│      ├── UPI (Google Pay, PhonePe, etc.)         │
│      ├── Credit/Debit Card                       │
│      ├── Netbanking                              │
│      ├── Wallets                                 │
│      └── COD (Cash on Delivery)                  │
│                                                  │
│  Step 4: Order Confirmation                      │
│      ├── Order ID generated                      │
│      ├── Success animation                       │
│      ├── Email confirmation sent                 │
│      └── \[Track Order] button                    │
└──────────────────────────────────────────────────┘
```

### **1.4 — Order Tracking**

```
User navigates to Track Order
    │
    ▼
┌─ TRACK ORDER PAGE ───────────────────────────────┐
│  • Enter Order ID / Auto-show if logged in       │
│  • Order details:                                │
│      ├── Items ordered                           │
│      ├── Order date \& total                      │
│      └── Delivery address                        │
│  • Status Timeline:                              │
│      ├── ✅ Order Placed                          │
│      ├── ✅ Confirmed \& Processing                │
│      ├── 🔄 Packed \& Ready to Ship                │
│      ├── ⏳ Shipped (tracking ID)                 │
│      └── ⏳ Out for Delivery → Delivered          │
└──────────────────────────────────────────────────┘
```



---

## **FLOW 2: ADMIN JOURNEY**

### **2.1 — Admin Access**

```
Admin navigates to /admin
    │
    ├── Not authenticated ──► ADMIN LOGIN PAGE
    │                          ├── Email/Password
    │                          ├── Google Sign-in
    │                          └── Only ADMIN\_EMAILS allowed
    │                              (Defined in AuthContext)
    │
    └── Authenticated as Admin ──► ADMIN DASHBOARD
```

### **2.2 — Admin Dashboard (6 Sections)**

```
┌─ ADMIN NAVBAR (Shared across all admin pages) ───┐
│  Midhuna Masala | \[Garden View] \[Spice Catalog]   │
│  \[Orders] \[Inventory] \[Sales Growth] \[Settings]   │
│                                          \[Logout]  │
└──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  1. GARDEN VIEW (/admin) ─── Dashboard Overview              │
│     ├── Total Orders count                                   │
│     ├── Stock Varieties count                                │
│     ├── Expiring Soon alerts                                 │
│     ├── Sales Overview chart (daily/weekly/monthly)          │
│     └── Recent Activity feed                                 │
│                                                              │
│  2. SPICE CATALOG (/admin/products) ─── Product Management  │
│     ├── Product grid with images                             │
│     ├── \[Add New Product] form                               │
│     │     ├── Name, Description, Category                    │
│     │     ├── Price, Weight options                           │
│     │     ├── Image upload (→ Cloudinary)                    │
│     │     └── Stock quantity                                 │
│     ├── Edit product (inline / modal)                        │
│     └── Delete product (with confirmation)                   │
│                                                              │
│  3. ORDERS (/admin/orders) ─── Order Management              │
│     ├── Orders list with filters (Pending/Shipped/Delivered) │
│     ├── Order details view                                   │
│     │     ├── Customer info, items, total                    │
│     │     ├── Delivery address                               │
│     │     └── Payment status                                 │
│     ├── Update order status (dropdown)                       │
│     ├── Generate \& Print Invoice (PDF)                       │
│     └── Add tracking ID for shipment                         │
│                                                              │
│  4. INVENTORY (/admin/inventory) ─── Stock Management        │
│     ├── Stock levels for each product                        │
│     ├── Low stock alerts (< threshold)                       │
│     ├── Expiry date tracking                                 │
│     ├── Update stock quantities                              │
│     └── Stock history log                                    │
│                                                              │
│  5. SALES GROWTH (/admin/reports) ─── Analytics              │
│     ├── Revenue chart (daily/weekly/monthly)                 │
│     ├── Top selling products                                 │
│     ├── Customer acquisition trend                           │
│     ├── Order volume trends                                  │
│     └── Export reports (CSV)                                 │
│                                                              │
│  6. SETTINGS (/admin/settings) ─── Configuration             │
│     ├── Store info (name, contact, address)                  │
│     ├── Shipping rates configuration                         │
│     ├── Tax settings                                         │
│     ├── Notification preferences                             │
│     └── Admin user management                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```



---

## **FLOW 3: DATA FLOW (How Data Moves)**

### **3.1 — Product Flow**

```
Admin adds product (/admin/products)
    │
    ▼ Image uploaded to Cloudinary (returns URL)
    ▼ Product data saved to Firestore (products collection)
    │
    ▼ Customer visits /shop
    │
    ▼ Frontend reads Firestore (products collection) 
    ▼ Images loaded from Cloudinary CDN (optimized)
    │
    ▼ Product displayed on ShopPage
```

### **3.2 — Order Flow**

```
Customer clicks \[Checkout]
    │
    ▼ Frontend sends order to Next.js API: POST /api/orders
    │
    ▼ API Route (Server-side):
    │   ├── Validates stock availability (Firestore read)
    │   ├── Calculates total (prevents price manipulation)
    │   ├── Creates Razorpay order (Razorpay API)
    │   └── Returns order\_id + payment\_url to frontend
    │
    ▼ Frontend opens Razorpay payment modal
    │
    ▼ Customer pays (UPI / Card / Netbanking)
    │
    ▼ Razorpay sends webhook → POST /api/payments/webhook
    │
    ▼ API Route (Server-side):
    │   ├── Verifies payment signature (security)
    │   ├── Updates order status in Firestore → "confirmed"
    │   ├── Deducts stock from inventory
    │   ├── Sends confirmation email to customer
    │   └── Sends notification to admin
    │
    ▼ Customer sees Order Confirmation page
    ▼ Can track order on /track-order
```

### **3.3 — Authentication Flow**

```
User clicks "Sign in with Google"
    │
    ▼ Firebase Auth SDK → Google OAuth popup
    │
    ▼ User selects Google account
    │
    ▼ Firebase returns user token + profile
    │
    ▼ AuthContext stores user state
    │   ├── user.email checked against ADMIN\_EMAILS\[]
    │   ├── If admin → isAdmin = true → can access /admin
    │   └── If customer → isAdmin = false → normal access
    │
    ▼ User profile stored/updated in Firestore (users collection)
```



---

## **FLOW 4: DATABASE SCHEMA (Firestore Collections)**

```
Firestore Database
│
├── 📁 users/
│   └── {userId}
│       ├── name: "Keerthi"
│       ├── email: "keerthi@gmail.com"
│       ├── phone: "+91 9876543210"
│       ├── role: "customer" | "admin"
│       ├── addresses: \[
│       │     { label, street, city, state, pincode, isDefault }
│       │   ]
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── 📁 products/
│   └── {productId}
│       ├── name: "Guntur Red Chilli Powder"
│       ├── description: "Sun-dried Guntur chillies..."
│       ├── category: "POWDER" | "BLEND" | "WHOLE SPICES"
│       ├── price: 149  (in ₹)
│       ├── weights: \[100, 200, 500]  (grams)
│       ├── image: "cloudinary-url"
│       ├── stock: 50
│       ├── isActive: true
│       ├── rating: 4.8
│       ├── benefits: \["Rich in antioxidants", ...]
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── 📁 orders/
│   └── {orderId}
│       ├── userId: "abc123"
│       ├── orderNumber: "MM-2026-0001"
│       ├── items: \[
│       │     { productId, name, weight, quantity, price, image }
│       │   ]
│       ├── subtotal: 450
│       ├── shipping: 0
│       ├── total: 450
│       ├── status: "placed" | "confirmed" | "packed" | "shipped" | "delivered"
│       ├── paymentStatus: "pending" | "paid" | "failed" | "refunded"
│       ├── paymentId: "razorpay\_payment\_id"
│       ├── deliveryAddress: { street, city, state, pincode }
│       ├── trackingId: "TRACK123456"
│       ├── estimatedDelivery: Timestamp
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── 📁 inventory/
│   └── {productId}
│       ├── productName: "Guntur Red Chilli Powder"
│       ├── currentStock: 50
│       ├── lowStockThreshold: 10
│       ├── batchNumber: "B-2026-02"
│       ├── expiryDate: Timestamp
│       ├── lastRestocked: Timestamp
│       └── stockHistory: \[
│             { date, quantity, type: "added" | "sold", note }
│           ]
│
└── 📁 settings/
    └── store
        ├── storeName: "Midhuna Masala"
        ├── email: "midhunamasala@gmail.com"
        ├── phone: "+91 ..."
        ├── address: { ... }
        ├── shippingFreeAbove: 500
        ├── shippingRate: 49
        └── taxRate: 0  (GST if applicable)
```



---

## **FLOW 5: API ROUTES STRUCTURE**

```
src/app/api/
│
├── orders/
│   ├── route.ts          ── POST: Create order, GET: List user orders
│   └── \[orderId]/
│       └── route.ts      ── GET: Order details, PATCH: Update status
│
├── payments/
│   ├── create/
│   │   └── route.ts      ── POST: Create Razorpay order
│   ├── verify/
│   │   └── route.ts      ── POST: Verify payment signature
│   └── webhook/
│       └── route.ts      ── POST: Razorpay webhook handler
│
├── products/
│   └── route.ts          ── GET: All products (public)
│
├── admin/
│   ├── products/
│   │   ├── route.ts      ── POST: Add product, GET: All products
│   │   └── \[id]/
│   │       └── route.ts  ── PUT: Edit, DELETE: Remove product
│   ├── orders/
│   │   └── route.ts      ── GET: All orders, PATCH: Update status
│   ├── inventory/
│   │   └── route.ts      ── GET: Stock levels, PUT: Update stock
│   └── reports/
│       └── route.ts      ── GET: Sales analytics
│
└── notifications/
    └── route.ts          ── POST: Send email/SMS
```



---

## **FLOW 6: FOLDER STRUCTURE**

```
midhunamasala/
├── public/
│   └── images/            ── Local images (fallback)
├── scripts/
│   └── upload-to-cloudinary.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx     ── Root layout (Providers, Navbar)
│   │   ├── page.tsx       ── Home page
│   │   ├── shop/          ── Shop page
│   │   ├── cart/          ── Cart page
│   │   ├── checkout/      ── Checkout flow (TO DO)
│   │   ├── track-order/   ── Order tracking
│   │   ├── profile/       ── User profile
│   │   ├── login/         ── User login
│   │   ├── signup/        ── User signup
│   │   ├── admin/         ── Admin section
│   │   │   ├── page.tsx       ── Dashboard
│   │   │   ├── login/        ── Admin login
│   │   │   ├── products/     ── Product management
│   │   │   ├── orders/       ── Order management
│   │   │   ├── inventory/    ── Stock management
│   │   │   ├── reports/      ── Sales analytics
│   │   │   └── settings/     ── Store settings
│   │   ├── api/           ── API Routes (TO DO)
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── products/
│   │   │   ├── admin/
│   │   │   └── notifications/
│   │   └── globals.css
│   ├── components/
│   │   ├── common/        ── Navbar, CloudImage
│   │   ├── home/          ── HeroSection, OurHeritage, BrandStory, etc.
│   │   ├── shop/          ── ShopPage, ProductCard, ProductDetails
│   │   ├── admin/         ── AdminNavbar
│   │   └── layout/        ── Footer
│   ├── contexts/
│   │   ├── AuthContext.tsx ── Authentication state
│   │   └── CartContext.tsx ── Cart state
│   └── lib/
│       ├── firebase.ts    ── Firebase client config
│       ├── firebase-admin.ts ── Firebase Admin SDK (TO DO)
│       └── razorpay.ts    ── Razorpay config (TO DO)
├── .env.local             ── Environment variables
├── next.config.ts
├── package.json
└── tsconfig.json
```



---

## **FLOW 7: SECURITY MODEL**

```
┌─────────────────────────────────────────────────┐
│                 SECURITY LAYERS                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  Layer 1: AUTHENTICATION                         │
│  ├── Firebase Auth (Google + Email)              │
│  ├── JWT tokens for session management           │
│  └── Auto-logout on token expiry                 │
│                                                  │
│  Layer 2: ROLE-BASED ACCESS                      │
│  ├── ADMIN\_EMAILS\[] in AuthContext               │
│  ├── isAdmin flag checked on every admin page    │
│  ├── Non-admin redirected to home                │
│  └── API routes verify admin token server-side   │
│                                                  │
│  Layer 3: SERVER-SIDE VALIDATION                 │
│  ├── API routes validate all inputs              │
│  ├── Price calculated server-side (no tampering) │
│  ├── Stock checked before order confirmation     │
│  └── Razorpay signature verified on server       │
│                                                  │
│  Layer 4: ENVIRONMENT SECRETS                    │
│  ├── NEXT\_PUBLIC\_\* → Safe for browser            │
│  ├── RAZORPAY\_SECRET → Server-only               │
│  ├── FIREBASE\_ADMIN\_SDK → Server-only            │
│  └── SMTP credentials → Server-only              │
│                                                  │
│  Layer 5: FIRESTORE SECURITY RULES               │
│  ├── Users can only read/write their own data    │
│  ├── Products are publicly readable              │
│  ├── Orders: users read own, admins read all     │
│  └── Inventory: admin write only                 │
│                                                  │
└─────────────────────────────────────────────────┘
```



---

## **FLOW 8: DEPLOYMENT PIPELINE**

```
Developer pushes code
    │
    ▼ git push origin main
    │
    ▼ GitHub triggers Vercel build
    │
    ▼ Vercel:
    │   ├── Installs dependencies (npm install)
    │   ├── Builds Next.js app (next build)
    │   ├── Deploys pages as static/SSR
    │   ├── Deploys API routes as serverless functions
    │   └── Injects environment variables
    │
    ▼ Live at: https://midhunamasala.vercel.app
    │
    ▼ Custom domain: https://midhunamasala.com (optional)

Already in cloud (no deploy needed):
    ├── Firebase Auth + Firestore → Google Cloud
    ├── Cloudinary Images → Cloudinary CDN
    └── Razorpay → Razorpay servers
```



---

## **DEVELOPMENT ROADMAP**

### ✅ Phase 1: Frontend (COMPLETED)

* \[x] Home page (Hero, Heritage, Brand Story, Testimonials)
* \[x] Shop page (Product grid, filters, detail modal)
* \[x] Cart page (Selection, quantities, order summary)
* \[x] User auth pages (Login, Signup, Profile)
* \[x] Order tracking page
* \[x] Admin dashboard (6 sections)
* \[x] Shared components (Navbar, Footer, AdminNavbar, CloudImage)
* \[x] Responsive design (Mobile + Desktop)
* \[x] Cloudinary image integration
* \[x] Firebase Auth (Google Sign-in)
* \[x] Cart state management (Context API + LocalStorage)

### 🔲 Phase 2: Backend (TO DO)

* \[ ] Firestore setup (products, users, orders, inventory collections)
* \[ ] Firebase Admin SDK (server-side auth verification)
* \[ ] API routes for orders (create, list, update)
* \[ ] API routes for admin (CRUD products, manage orders)
* \[ ] Connect frontend to Firestore (replace mock data)

### 🔲 Phase 3: Payments (TO DO)

* \[ ] Razorpay integration
* \[ ] Create payment order (API route)
* \[ ] Payment verification (webhook)
* \[ ] Order confirmation flow
* \[ ] Checkout page UI

### 🔲 Phase 4: Notifications (TO DO)

* \[ ] Order confirmation email
* \[ ] Shipping update email/SMS
* \[ ] Low stock alert for admin
* \[ ] Push notifications (Firebase Cloud Messaging)

### 🔲 Phase 5: Polish \& Deploy (TO DO)

* \[ ] SEO optimization (meta tags, sitemap)
* \[ ] Performance optimization (lazy loading, caching)
* \[ ] Error handling \& loading states
* \[ ] SonarQube code quality scan
* \[ ] Deploy to Vercel
* \[ ] Connect custom domain
* \[ ] SSL certificate (auto via Vercel)

### 🔲 Phase 6: Post-Launch (FUTURE)

* \[ ] Customer reviews \& ratings
* \[ ] Wishlist functionality
* \[ ] Coupon/promo code system
* \[ ] WhatsApp order notifications
* \[ ] Monthly sales reports (PDF export)
* \[ ] Multi-language support (Tamil + English)



---

### **NOTES**

* Use SonarQube for code quality analysis
* All prices in ₹ (Indian Rupees)
* Target audience: Tamil Nadu, India-wide shipping
* Products are homemade, limited stock — inventory tracking is critical
