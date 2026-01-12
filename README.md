# Bangladesh Post Office - ePassport Web Portal

A modern web application for Bangladesh Post Office's ePassport issuing portal, converted from Flutter to Next.js with TypeScript.

## 🚀 Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Package Manager:** Yarn
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Date Utilities:** date-fns

## 📋 Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0

## 🛠️ Installation

1. Navigate to the project directory:

```bash
cd nextjs-web
```

2. Install dependencies using Yarn:

```bash
yarn install
```

3. Create environment file:

```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your API endpoints:

```env
NEXT_PUBLIC_API_BASE_URL=https://brta2.bpodms.gov.bd
NEXT_PUBLIC_DMS_API_BASE_URL=https://bpodms.ekdak.com
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
yarn build
yarn start
```

### Type Checking

```bash
yarn type-check
```

### Linting

```bash
yarn lint
```

## 📁 Project Structure

```
nextjs-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Login page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── booking/           # Booking management
│   │   ├── delivery/          # Delivery management
│   │   ├── passport/          # Passport status
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                   # Utility libraries
│   │   ├── api-client.ts     # Axios configuration
│   │   ├── api-services.ts   # API service functions
│   │   └── error-handler.ts  # Error handling utilities
│   ├── store/                 # Zustand state management
│   │   ├── auth-store.ts     # Authentication state
│   │   ├── booking-store.ts  # Booking state
│   │   └── delivery-store.ts # Delivery state
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   │   └── constants.ts      # Application constants
│   └── middleware.ts          # Next.js middleware for auth
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🔑 Key Features

### Authentication

- Secure login with JWT token
- Session management using Zustand persist
- Protected routes with middleware
- Automatic token refresh

### Dashboard

- Real-time statistics display
- Quick action buttons
- User information panel

### Booking Management

- Create new bookings
- Track booking status
- Integration with DMS API

### Delivery Management

- Search by license number, NID, or mobile
- View delivery information
- Update delivery status

### Passport Management

- Check passport status
- View passport details
- Track delivery

## 🔒 Environment Variables

| Variable                       | Description       | Default                       |
| ------------------------------ | ----------------- | ----------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`     | Main API base URL | `https://brta2.bpodms.gov.bd` |
| `NEXT_PUBLIC_DMS_API_BASE_URL` | DMS API base URL  | `https://bpodms.ekdak.com`    |

## 📝 API Integration

The application integrates with the following APIs:

- **Authentication API:** User login and session management
- **Booking API:** Create and manage bookings
- **License API:** Fetch and update license delivery information
- **Passport API:** Check passport status and details

## 🎨 Styling

The application uses Tailwind CSS for styling with a custom color palette:

- Primary color: Deep Purple (#673AB7)
- Responsive design for mobile, tablet, and desktop
- Custom UI components with consistent design language

## 🔐 Security Features

- HTTP-only cookies for token storage
- CSRF protection
- API request/response interceptors
- Automatic redirect on authentication failure
- Secure password handling

## 📱 Responsive Design

The application is fully responsive and works on:

- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop (1024px and up)

## 🚢 Deployment

### Vercel (Recommended)

```bash
yarn build
# Deploy to Vercel
```

### Docker

```dockerfile
# Create a Dockerfile for containerization
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

© 2026 Bangladesh Post Office. All rights reserved.

## 🆘 Support

For support, please contact the Bangladesh Post Office IT department.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
