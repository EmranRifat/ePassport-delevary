# Migration Guide: Flutter to Next.js

This document outlines the conversion from the Flutter Android application to Next.js web application.

## Overview

The original Flutter application has been successfully converted to a modern Next.js web application with the following improvements:

### Technology Changes

| Flutter           | Next.js                   |
| ----------------- | ------------------------- |
| Dart              | TypeScript                |
| Provider          | Zustand                   |
| Dio               | Axios                     |
| Flutter Widgets   | React Components          |
| QlevarRouter      | Next.js App Router        |
| SharedPreferences | Zustand Persist + Cookies |

## File Mapping

### Data Models

- `lib/data/model/*.dart` → `src/types/*.ts`
  - LoginResponse → auth.ts
  - BookingResponse → booking.ts
  - LicenseData → license.ts
  - PassportData → passport.ts

### State Management

- `lib/data/provider/*.dart` → `src/store/*.ts`
  - LoginProvider → auth-store.ts
  - BookingProvider → booking-store.ts
  - DeliveryDataProvider → delivery-store.ts

### API Services

- `lib/data/api/*.dart` → `src/lib/api-client.ts` & `src/lib/api-services.ts`
  - All API calls converted to Axios
  - Interceptors for logging and error handling
  - Separate DMS API client

### UI Components

- `lib/ui/login/` → `src/app/login/page.tsx`
- `lib/ui/dashboard/` → `src/app/dashboard/page.tsx`
- `lib/ui/responsive/` → Responsive design with Tailwind CSS
- `lib/ui/commonWidget/` → `src/components/ui/`

### Routing

- `lib/routes.dart` → `src/app/` (App Router structure)
- `lib/middleware/auth_middleware.dart` → `src/middleware.ts`

## Key Features Implemented

✅ Authentication with JWT
✅ Dashboard with statistics
✅ Booking management
✅ Delivery management
✅ Passport status checking
✅ Responsive design
✅ Protected routes
✅ Error handling
✅ Loading states
✅ Form validation

## API Endpoints Preserved

All API endpoints from the Flutter app have been maintained:

- `/app/v1/login/` - Authentication
- `/app_dommail_internal_api/public/ws/login` - DMS Login
- `/app_dommail_internal_api/public/ws/bookingreq` - Booking
- `/brta/api/bpo/license-delivery-info` - License Data

## Configuration

### Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_BASE_URL=https://brta2.bpodms.gov.bd
NEXT_PUBLIC_DMS_API_BASE_URL=https://bpodms.ekdak.com
```

### Constants

All constants from `app_constants.dart` are now in `src/utils/constants.ts`

## Running the Application

1. Install dependencies:

```bash
cd nextjs-web
yarn install
```

2. Run development server:

```bash
yarn dev
```

3. Build for production:

```bash
yarn build
yarn start
```

## Differences from Flutter App

### Advantages

1. **Better Web Performance**: Next.js is optimized for web
2. **SEO Friendly**: Server-side rendering support
3. **Modern Stack**: TypeScript, Tailwind CSS
4. **Better Developer Experience**: Hot reload, type safety
5. **Easier Deployment**: Vercel, Netlify, Docker

### Missing Features (To Implement)

1. PDF printing (use react-pdf or jsPDF)
2. Barcode generation (use react-barcode)
3. Advanced date pickers (use react-datepicker)
4. Sidebar navigation (can implement using existing components)

## Next Steps

1. ✅ Core functionality converted
2. ⏳ Add PDF printing capability
3. ⏳ Add barcode generation
4. ⏳ Implement advanced search filters
5. ⏳ Add data export functionality
6. ⏳ Add comprehensive unit tests
7. ⏳ Setup CI/CD pipeline

## Notes

- All TypeScript types are strictly defined
- API error handling is centralized
- State management is modular and scalable
- Components are reusable and maintainable
- Responsive design works on all devices
