# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
cd nextjs-web
yarn install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` if needed (default values work with existing APIs).

### 3. Run the Application

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login (if applicable)

- **URL:** http://localhost:3000/login
- **User ID:** [Your existing credentials]
- **Password:** [Your existing credentials]

## Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `yarn dev`        | Start development server |
| `yarn build`      | Build for production     |
| `yarn start`      | Start production server  |
| `yarn lint`       | Run ESLint               |
| `yarn type-check` | Check TypeScript types   |

## Project Features

✅ **Authentication** - Secure login with JWT  
✅ **Dashboard** - Overview with statistics  
✅ **Booking Management** - Create and track bookings  
✅ **Delivery Management** - Search and update deliveries  
✅ **Passport Status** - Check passport information  
✅ **Responsive Design** - Works on all devices

## Folder Structure

```
nextjs-web/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   ├── components/       # React components
│   ├── lib/             # API client & services
│   ├── store/           # State management (Zustand)
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities & constants
├── public/              # Static files
└── package.json
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
yarn dev -p 3001
```

### Type Errors

```bash
yarn type-check
```

### Clear Cache

```bash
rm -rf .next
yarn dev
```

## Need Help?

- Read the full [README.md](./README.md)
- Check [MIGRATION.md](./MIGRATION.md) for Flutter to Next.js mapping
- Review API documentation in `src/lib/api-services.ts`

## Next Steps

1. Customize the theme in `tailwind.config.ts`
2. Add your logo to `public/images/`
3. Configure API endpoints in `.env.local`
4. Test all features with your credentials
5. Deploy to production (see README.md)

Happy coding! 🚀
