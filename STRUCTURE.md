# Project Structure Overview

## 📁 Complete Directory Tree

```
bpo-epassport-licence/
│
├── 📂 nextjs-web/                    ← NEW Next.js Web Application
│   ├── 📂 src/
│   │   ├── 📂 app/                   ← Next.js App Router (Pages)
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home (redirects to login)
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── 📂 login/
│   │   │   │   └── page.tsx         # Login page
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── page.tsx         # Dashboard with stats
│   │   │   ├── 📂 booking/
│   │   │   │   └── page.tsx         # Booking management
│   │   │   ├── 📂 delivery/
│   │   │   │   └── page.tsx         # Delivery management
│   │   │   └── 📂 passport/
│   │   │       └── page.tsx         # Passport status
│   │   │
│   │   ├── 📂 components/            ← Reusable Components
│   │   │   └── 📂 ui/
│   │   │       ├── Button.tsx       # Button component
│   │   │       ├── Input.tsx        # Input component
│   │   │       ├── Card.tsx         # Card component
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── index.ts         # Exports
│   │   │
│   │   ├── 📂 lib/                   ← Core Libraries
│   │   │   ├── api-client.ts        # Axios setup & interceptors
│   │   │   ├── api-services.ts      # API service functions
│   │   │   └── error-handler.ts     # Error handling utilities
│   │   │
│   │   ├── 📂 store/                 ← State Management (Zustand)
│   │   │   ├── auth-store.ts        # Authentication state
│   │   │   ├── booking-store.ts     # Booking state
│   │   │   ├── delivery-store.ts    # Delivery state
│   │   │   └── index.ts             # Exports
│   │   │
│   │   ├── 📂 types/                 ← TypeScript Definitions
│   │   │   ├── api.ts               # API response types
│   │   │   ├── auth.ts              # Auth types
│   │   │   ├── booking.ts           # Booking types
│   │   │   ├── license.ts           # License types
│   │   │   ├── passport.ts          # Passport types
│   │   │   ├── delivery.ts          # Delivery types
│   │   │   ├── menu.ts              # Menu types
│   │   │   └── index.ts             # Exports
│   │   │
│   │   ├── 📂 utils/                 ← Utilities
│   │   │   └── constants.ts         # App constants & API URLs
│   │   │
│   │   └── middleware.ts             ← Next.js Middleware (Auth)
│   │
│   ├── 📂 public/                    ← Static Assets
│   │   └── 📂 images/
│   │
│   ├── package.json                  ← Dependencies
│   ├── tsconfig.json                 ← TypeScript config
│   ├── next.config.js                ← Next.js config
│   ├── tailwind.config.ts            ← Tailwind CSS config
│   ├── postcss.config.js             ← PostCSS config
│   ├── .eslintrc.json                ← ESLint config
│   ├── .gitignore                    ← Git ignore
│   ├── .env.example                  ← Environment template
│   ├── README.md                     ← Full documentation
│   ├── QUICKSTART.md                 ← Quick start guide
│   └── MIGRATION.md                  ← Migration details
│
├── 📂 lib/                            ← Original Flutter Code
│   ├── main.dart
│   ├── routes.dart
│   ├── 📂 data/
│   ├── 📂 ui/
│   └── 📂 utils/
│
├── install.bat                        ← Windows install script
├── install.sh                         ← Linux/Mac install script
└── CONVERSION_SUMMARY.md              ← This summary

```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │    Login     │    │  Dashboard   │    │   Booking    │ │
│  │    Page      │───▶│     Page     │───▶│     Page     │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│         └────────────────────┴────────────────────┘         │
│                              │                               │
│                    ┌─────────▼──────────┐                   │
│                    │  Zustand Store     │                   │
│                    │  (State Management)│                   │
│                    └─────────┬──────────┘                   │
│                              │                               │
│                    ┌─────────▼──────────┐                   │
│                    │   API Services     │                   │
│                    │  (api-services.ts) │                   │
│                    └─────────┬──────────┘                   │
│                              │                               │
│                    ┌─────────▼──────────┐                   │
│                    │   API Client       │                   │
│                    │  (Axios + Auth)    │                   │
│                    └─────────┬──────────┘                   │
└──────────────────────────────┼──────────────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Backend APIs       │
                    │  - BRTA API          │
                    │  - DMS API           │
                    └──────────────────────┘
```

## 🎯 Component Hierarchy

```
App (layout.tsx)
│
├─ Login Page
│  └─ Card
│     ├─ Input (User ID)
│     ├─ Input (Password)
│     ├─ Input (Device IMEI)
│     └─ Button (Submit)
│
├─ Dashboard Page
│  ├─ Header (with logout)
│  ├─ Statistics Cards (4x Card)
│  ├─ Quick Actions Card
│  │  ├─ Button (New Booking)
│  │  ├─ Button (Delivery)
│  │  └─ Button (Passport Status)
│  └─ User Info Card
│
├─ Booking Page
│  ├─ Header
│  └─ Card (Create Booking Form)
│     ├─ Input (Tracking Number)
│     ├─ Input (Branch Code - disabled)
│     ├─ Input (RMS Code - disabled)
│     └─ Button (Create Booking)
│
├─ Delivery Page
│  ├─ Header
│  ├─ Card (Search Form)
│  │  ├─ Radio Buttons (Search Type)
│  │  ├─ Input (Search Value)
│  │  └─ Button (Search)
│  └─ Card (Results)
│     └─ Delivery Information Display
│
└─ Passport Page
   ├─ Header
   ├─ Card (Search Form)
   │  ├─ Input (Passport Number)
   │  └─ Button (Search)
   └─ Card (Results)
      └─ Passport Details Display
```

## 🔐 Authentication Flow

```
1. User visits protected route
          ↓
2. Middleware checks for auth token
          ↓
   ┌──────┴──────┐
   │             │
   ✗ No Token    ✓ Has Token
   │             │
   ↓             ↓
3. Redirect  Allow Access
   to Login      │
   │             ↓
   ↓         Load Page
4. User Logs In  │
   │             ↓
   ↓         API Calls
5. Token Stored  │
   │             ↓
   ↓         With Auth
6. Redirect to   Header
   Dashboard
```

## 📦 State Management Structure

```
Zustand Stores
│
├─ Auth Store
│  ├─ isAuthenticated (boolean)
│  ├─ user (LoginResponse)
│  ├─ token (string)
│  ├─ setAuth()
│  ├─ clearAuth()
│  └─ updateUser()
│
├─ Booking Store
│  ├─ currentBooking (BookingResponse)
│  ├─ bookingList (BookingResponse[])
│  ├─ isLoading (boolean)
│  ├─ error (string)
│  ├─ setCurrentBooking()
│  ├─ addBooking()
│  ├─ setBookingList()
│  └─ clearBooking()
│
└─ Delivery Store
   ├─ currentDelivery (LicenseData)
   ├─ deliveryList (LicenseData[])
   ├─ isLoading (boolean)
   ├─ error (string)
   ├─ setCurrentDelivery()
   ├─ addDelivery()
   ├─ setDeliveryList()
   └─ clearDelivery()
```

## 🌐 API Endpoints Mapping

| Endpoint                                         | Method | Purpose             | File            |
| ------------------------------------------------ | ------ | ------------------- | --------------- |
| `/app/v1/login/`                                 | POST   | User authentication | api-services.ts |
| `/app_dommail_internal_api/public/ws/login`      | POST   | DMS login           | api-services.ts |
| `/app_dommail_internal_api/public/ws/bookingreq` | POST   | Create booking      | api-services.ts |
| `/brta/api/bpo/license-delivery-info`            | POST   | Get license data    | api-services.ts |
| `/api/passport/dashboard`                        | GET    | Dashboard stats     | api-services.ts |
| `/api/passport/{id}`                             | GET    | Passport details    | api-services.ts |

## 🎨 Styling System

```
Tailwind CSS
│
├─ Custom Theme (tailwind.config.ts)
│  ├─ Primary Colors (Deep Purple)
│  │  ├─ 50 → #EDE7F6
│  │  ├─ 100 → #D1C4E9
│  │  ├─ 500 → #673AB7 (main)
│  │  └─ 900 → #311B92
│  │
│  └─ Responsive Breakpoints
│     ├─ sm: 640px
│     ├─ md: 768px
│     ├─ lg: 1024px
│     └─ xl: 1280px
│
└─ Component Styling
   ├─ Button variants (primary, secondary, outline, danger)
   ├─ Input with validation states
   ├─ Card with header/body
   └─ LoadingSpinner
```

---

**This structure provides a complete, scalable, and maintainable web application!** 🚀
