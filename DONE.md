# ✅ DONE — Café System Build Log

> Built with **Laravel 10** · **MySQL** · **React 18** · **Tailwind CSS 3** · **Vite**

---

## 📋 What Was Built

### Backend — Laravel API

| File | Purpose |
|------|---------|
| `app/Models/User.php` | Updated with `role` field (`admin`/`cashier`), helper methods `isAdmin()`, `isCashier()` |
| `app/Models/Category.php` | Category model (id, name, icon) |
| `app/Models/Product.php` | Product model with category FK, image, price, availability |
| `app/Models/Order.php` | Order model (customer, subtotal, tax, total, discount, status) |
| `app/Models/OrderItem.php` | Per-item order line (product, quantity, unit_price, addons) |
| `app/Http/Controllers/Api/AuthController.php` | Login, Logout, Me — Sanctum token auth |
| `app/Http/Controllers/Api/CategoryController.php` | Full CRUD for categories |
| `app/Http/Controllers/Api/ProductController.php` | Full CRUD with image upload to `storage/app/public/products` |
| `app/Http/Controllers/Api/OrderController.php` | Place order, list orders, view detail, update status |
| `app/Http/Controllers/Api/DashboardController.php` | Revenue stats (today/week/month), chart data, top products |
| `app/Http/Middleware/AdminOnly.php` | 403 guard — blocks non-admin users from admin routes |
| `routes/api.php` | All API endpoints grouped by auth + admin middleware |
| `routes/web.php` | Catch-all → serves React SPA blade template |

### Database Migrations

| Migration | Creates |
|-----------|---------|
| `2024_01_01_000001_add_role_to_users_table` | `role` enum column on `users` |
| `2024_01_01_000002_create_categories_table` | `categories` (id, name, icon) |
| `2024_01_01_000003_create_products_table` | `products` with FK to categories |
| `2024_01_01_000004_create_orders_table` | `orders` with FK to users |
| `2024_01_01_000005_create_order_items_table` | `order_items` with FK to orders & products |

### Seeders

| File | Seeds |
|------|-------|
| `database/seeders/CafeSeeder.php` | Admin user, Cashier user, 4 categories, 14 sample products |
| `database/seeders/DatabaseSeeder.php` | Calls `CafeSeeder` |

---

### Frontend — React SPA

#### Entry Points
| File | Purpose |
|------|---------|
| `resources/js/main.jsx` | React root mount point |
| `resources/js/App.jsx` | BrowserRouter + all routes + role protection |
| `resources/views/app.blade.php` | Blade SPA shell that loads Vite assets |

#### API Layer (`resources/js/api/`)
| File | Endpoints Covered |
|------|------------------|
| `client.js` | Axios instance with auth token interceptor + 401 redirect |
| `auth.js` | login, logout, getMe |
| `categories.js` | getCategories, createCategory, updateCategory, deleteCategory |
| `products.js` | getProducts, createProduct, updateProduct, deleteProduct |
| `orders.js` | getOrders, createOrder, getOrder, updateOrderStatus |
| `dashboard.js` | getDashboardStats |

#### Context (`resources/js/context/`)
| File | Purpose |
|------|---------|
| `AuthContext.jsx` | Stores user & token, persists to localStorage, provides login/logout |
| `CartContext.jsx` | Cart state — items, customer name, discount, subtotal/tax/total |

#### Common Components (`resources/js/components/common/`)
| Component | Purpose |
|-----------|---------|
| `LoadingSpinner.jsx` | Animated spinner, supports `fullScreen` mode |
| `Modal.jsx` | Reusable modal with ESC key dismiss + backdrop click |
| `ConfirmDialog.jsx` | Delete/action confirmation prompt |
| `Toast.jsx` | Auto-dismissing success/error/warning notification |
| `Badge.jsx` | Color-coded status label |
| `StatCard.jsx` | Dashboard stat card with icon and value |

#### Layout Components (`resources/js/components/layout/`)
| Component | Purpose |
|-----------|---------|
| `Sidebar.jsx` | Admin nav with links for Dashboard, Products, Categories, Orders + user profile + logout |
| `Header.jsx` | Top bar with dynamic page title and current date |
| `AdminLayout.jsx` | Wraps pages in Sidebar + Header |
| `ProtectedRoute.jsx` | Auth guard — redirects unauthenticated or wrong-role users |

#### Auth Components (`resources/js/components/auth/`)
| Component | Purpose |
|-----------|---------|
| `LoginForm.jsx` | Login form with validation, role-based redirect after login |

#### Admin Components (`resources/js/components/admin/`)
| Component | Purpose |
|-----------|---------|
| `Dashboard.jsx` | Stat cards + revenue chart + recent orders + top products |
| `RevenueChart.jsx` | Recharts AreaChart for 7-day revenue |
| `ProductList.jsx` | Searchable/filterable product table with edit/delete actions |
| `ProductForm.jsx` | Add/edit form with image upload preview, category picker, toggle availability |
| `CategoryList.jsx` | Category grid cards with inline edit/delete + embedded form |
| `OrderList.jsx` | Paginated orders table with status filter + detail modal + mark paid |

#### Cashier Components (`resources/js/components/cashier/`)
| Component | Purpose |
|-----------|---------|
| `POSView.jsx` | Full POS layout — product grid + search + category filter |
| `ProductCard.jsx` | Clickable product card with image, name, price |
| `CategoryFilter.jsx` | Horizontal scrollable category pill buttons |
| `Cart.jsx` | Right-panel cart with customer name, voucher, summary, checkout |
| `CartItem.jsx` | Single cart row with +/− quantity controls and remove |

#### Pages (`resources/js/pages/`)
| Page | Route | Role |
|------|-------|------|
| `LoginPage.jsx` | `/login` | Public |
| `admin/DashboardPage.jsx` | `/admin/dashboard` | Admin |
| `admin/ProductsPage.jsx` | `/admin/products` | Admin |
| `admin/CategoriesPage.jsx` | `/admin/categories` | Admin |
| `admin/OrdersPage.jsx` | `/admin/orders` | Admin |
| `cashier/CashierPage.jsx` | `/cashier` | Cashier |

#### Utilities (`resources/js/utils/`)
| File | Exports |
|------|---------|
| `format.js` | `formatRp(amount)` — formats Rupiah, `formatDate(str)` |

---

## 🚀 How to Run (Step-by-Step)

### 1. Prerequisites
- PHP 8.1+, Composer, Node.js 18+, MySQL running

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Create the database
Create a MySQL database named `cafe_system_db` (or change `.env`).

### 4. Run migrations + seed
```bash
php artisan migrate --seed
```

### 5. Create storage symlink (for product images)
```bash
php artisan storage:link
```

### 6. Install Node dependencies
```bash
npm install
```

### 7. Start development servers (2 terminals)

**Terminal 1 — Laravel:**
```bash
php artisan serve
```

**Terminal 2 — Vite:**
```bash
npm run dev
```

### 8. Open browser
Visit: **http://localhost:8000**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@cafe.com` | `password` |
| Cashier | `cashier@cafe.com` | `password` |

---

## 🏗 Folder Structure Summary

```
resources/js/
├── main.jsx                    — React entry
├── App.jsx                     — Router + role guards
├── api/                        — All Axios API calls
│   ├── client.js
│   ├── auth.js
│   ├── categories.js
│   ├── products.js
│   ├── orders.js
│   └── dashboard.js
├── context/                    — Global state
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── components/
│   ├── common/                 — Reusable UI atoms
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── Toast.jsx
│   │   ├── Badge.jsx
│   │   └── StatCard.jsx
│   ├── layout/                 — Page shells & guards
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── AdminLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── auth/
│   │   └── LoginForm.jsx
│   ├── admin/                  — Admin-only components
│   │   ├── Dashboard.jsx
│   │   ├── RevenueChart.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   ├── CategoryList.jsx
│   │   └── OrderList.jsx
│   └── cashier/                — POS components
│       ├── POSView.jsx
│       ├── ProductCard.jsx
│       ├── CategoryFilter.jsx
│       ├── Cart.jsx
│       └── CartItem.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── admin/
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── CategoriesPage.jsx
│   │   └── OrdersPage.jsx
│   └── cashier/
│       └── CashierPage.jsx
└── utils/
    └── format.js
```

---

## 🔒 Role Access Matrix

| Feature | Admin | Cashier |
|---------|-------|---------|
| Login | ✅ | ✅ |
| View Dashboard stats | ✅ | ❌ |
| Add / Edit / Delete Products | ✅ | ❌ |
| Add / Edit / Delete Categories | ✅ | ❌ |
| View all orders | ✅ | ❌ |
| Mark orders paid/cancelled | ✅ | ❌ |
| POS / Browse products | ✅ (via admin) | ✅ |
| Checkout / Place order | ✅ (via admin) | ✅ |

---

## ⚙️ Config Changes

| File | Change |
|------|--------|
| `vite.config.js` | Added `@vitejs/plugin-react`, changed entry to `main.jsx` |
| `package.json` | Added React, React Router, Recharts, Tailwind, PostCSS, Autoprefixer |
| `tailwind.config.js` | Created — scans JSX files, custom `primary` color palette |
| `postcss.config.js` | Created — Tailwind + Autoprefixer |
| `resources/css/app.css` | Tailwind directives + `card`, `input`, `btn-*` component classes |

---

*Generated on: 2026-02-23*
---

## 🚀 Phase 2 — Customization & Currency Update

### What Changed

#### Currency
All prices switched from Indonesian Rupiah (Rp) to **US Dollars ($)**.  
`resources/js/utils/format.js` now exports `formatCurrency` using `Intl.NumberFormat` with `currency: 'USD'`.

#### New Database Columns (Migration `2024_01_01_000006_add_options_to_products_table`)
| Column | Type | Purpose |
|--------|------|---------|
| `sizes` | JSON nullable | Cup-size prices — `{"S": 3.99, "M": 4.99, "L": 5.99}` |
| `toppings` | JSON nullable | Array of toppings — `[{"name":"Boba","extra_price":0.50}]` |

#### Backend Changes
| File | Change |
|------|--------|
| `app/Models/Product.php` | Added `sizes`, `toppings` to `$fillable` + array casts |
| `app/Http/Controllers/Api/ProductController.php` | Decodes JSON strings for `sizes` and `toppings` from FormData |
| `app/Http/Controllers/Api/OrderController.php` | Resolves `unit_price` from selected size; adds topping `extra_price` |

#### New Frontend File
| File | Purpose |
|------|---------|
| `resources/js/components/cashier/CustomizeModal.jsx` | Full-screen overlay modal for customizing a drink before adding to cart — size S/M/L with per-size pricing, sugar level (0 % / 25 % / 50 % / 70 % / 100 % / 120 %), ice/temperature (No Ice / Less Ice / Normal Ice / More Ice / Warm / Hot), topping picker from product list, topping level (No Topping / Less / Normal / More), live price calculation, unique `cartKey` per customization combo |

#### Updated Frontend Files
| File | Change |
|------|--------|
| `CartContext.jsx` | Fully rewritten — `addItem(item)` uses `cartKey`; same product with different customizations = separate cart lines |
| `CartItem.jsx` | Uses `item.cartKey` for quantity/remove; shows customization badges (size, sugar, ice, topping) |
| `Cart.jsx` | Uses `item.cartKey` as React key; sends `addons` per item in checkout payload; all amounts in USD |
| `ProductCard.jsx` | Shows S–L price range when sizes exist; calls `onCustomize(product)` instead of `onAdd(product)` |
| `POSView.jsx` | Manages `customizeProduct` state; renders `<CustomizeModal>` overlay; passes `onCustomize` to `ProductCard` |
| `ProductForm.jsx` | "Base Price ($)" field; **Cup Sizes** toggle with S/M/L price inputs; **Toppings** toggle with dynamic topping rows (name + extra price) |
| `Dashboard.jsx` | `formatRp` → `formatCurrency` |
| `ProductList.jsx` | `formatRp` → `formatCurrency` |
| `OrderList.jsx` | `formatRp` → `formatCurrency` |
| `RevenueChart.jsx` | `formatRp` → `formatCurrency` |

#### Seeder
`CafeSeeder.php` updated with USD prices and sample `sizes` / `toppings` for all Coffee and Non-Coffee drinks.

### Cashier Customization Flow
1. Cashier clicks a product card → `CustomizeModal` opens
2. Selects size (S / M / L) — price updates live
3. Selects sugar level, ice/temperature, topping + level
4. Clicks **Add to Cart** → item added with `cartKey = "id|size|sugar|ice|topping|toppingLevel"`
5. Same drink ordered differently appears as two separate cart lines
6. At checkout, each item's `addons` object is sent to the API; server resolves final price