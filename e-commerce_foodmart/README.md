# 🛒 FoodMart

A full-stack e-commerce web application for browsing and purchasing food products — built with React, Tailwind CSS, and Appwrite.

🔗 **Live Demo:** [food-mart-react-js.vercel.app](https://food-mart-react-js.vercel.app/)

---

## 📌 About

FoodMart is a fully functional online food store where users can browse products across categories, manage a cart, place orders, and track their order history — all within a clean, responsive interface.

The app supports two authentication methods — email/password and OAuth (Google) — with email verification enforced for email-based signups.

---

## ✨ Features

- 🔐 **Authentication** — Email/password signup with email verification, plus OAuth (Google) login via Appwrite
- 🗂️ **Product Categories** — Browse products organized by category
- 🔍 **Search & Filter** — Find products quickly by name or category
- ❤️ **Wishlist** — Save favourite products for later
- 🛒 **Cart Management** — Add, remove, and update product quantities
- 💳 **Checkout Flow** — Seamless order placement with cart validation
- 📦 **Order History** — View and track all past orders
- 👤 **User Profile** — Manage personal account details
- 🌙 **Dark Mode** — Full dark/light theme support
- 📱 **Responsive Design** — Works across desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend & Auth | Appwrite |
| Deployment | Vercel |

---

## 🗄️ Database Structure (Appwrite Collections)

| Collection | Purpose |
|---|---|
| `users` | Stores user profile data |
| `products` | Product listings |
| `categories` | Product categories |
| `cart` | Per-user cart items |
| `favourites` | Per-user wishlist items |
| `orders` | Placed orders |
| `order_items` | Individual items within each order |

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Loader, etc.)
├── pages/            # Page-level components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── VerifyEmail.jsx
│   ├── Home.jsx
│   ├── ProductPage.jsx
│   ├── CategoryPage.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   └── Orders.jsx
├── context/          # Global state management
│   ├── AuthContext.jsx   # User auth state (useAuth hook)
│   └── CartContext.jsx   # Cart state (useCart hook)
└── App.jsx           # Root component — routing and providers
```

---

## 🔐 How Authentication Works

The app uses Appwrite for authentication and supports two login methods:

- **Email/Password** — Users must verify their email before accessing the app. Unverified users are redirected to `/verify-email`.
- **OAuth (Google)** — OAuth users are considered verified by Appwrite automatically and skip the email verification step.

Route protection is handled by a `ProtectedRoute` component that wraps all private pages. Unauthenticated users are redirected to `/login`.

The `CheckoutGuard` component additionally ensures users can only access `/checkout` if they have items in their cart or have just placed an order.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- An [Appwrite](https://appwrite.io/) account and project set up

### Installation

1. Clone the repository

```bash
git clone https://github.com/AurangzebHassan/FoodMart_reactJS.git
cd FoodMart_reactJS
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_PROJECT_NAME=your_project_name
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1

VITE_APPWRITE_DATABASE_ID=your_database_id

VITE_APPWRITE_CATEGORIES_TABLE_ID=categories
VITE_APPWRITE_PRODUCTS_TABLE_ID=products
VITE_APPWRITE_USERS_TABLE_ID=users
VITE_APPWRITE_CART_TABLE_ID=cart
VITE_APPWRITE_FAVOURITES_TABLE_ID=favourites
VITE_APPWRITE_ORDERS_TABLE_ID=orders
VITE_APPWRITE_ORDER_ITEMS_TABLE_ID=order_items
```

> ⚠️ Never commit your actual `.env` file. Make sure it is listed in `.gitignore`.

4. Start the development server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 🌐 Deployment

This project is deployed on **Vercel**. Any push to the main branch automatically triggers a redeployment.

To deploy your own instance:
1. Push the repo to GitHub
2. Import it on [vercel.com](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy

---

## 👨‍💻 Author

**Aurangzeb Hassan**
- GitHub: [@AurangzebHassan](https://github.com/AurangzebHassan)
- LinkedIn: [@Aurangzeb Hassan](https://www.linkedin.com/in/aurangzeb-hassan-20897b230/)
