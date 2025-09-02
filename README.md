# URL Shortener

A modern URL shortener built with Next.js 14, TypeScript, and MongoDB.

## Features

- ✨ Shorten long URLs with custom codes
- 📊 Click analytics and tracking
- 🔐 User authentication
- 🌐 Custom domain support
- 📱 QR code generation
- ⏰ URL expiration dates
- 📋 Dashboard for managing URLs

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone and install**
   ```bash
   npx create-next-app@latest url-shortener --typescript --tailwind --eslint --app
   cd url-shortener
   npm install mongoose bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
   npm install lucide-react nanoid qrcode @types/qrcode
   ```

2. **Setup environment variables**
   ```bash
   # .env.local
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   JWT_SECRET=your-secret-key-here
   DEFAULT_DOMAIN=localhost:3000
   NEXT_PUBLIC_DEFAULT_DOMAIN=localhost:3000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open** http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── dashboard/           # User dashboard
│   ├── [shortCode]/         # URL redirection
│   └── page.tsx            # Homepage
├── components/             # React components
├── lib/                   # Utilities and database
├── models/               # MongoDB schemas
└── types/               # TypeScript types
```

## Usage

1. **Register/Login** to access advanced features
2. **Paste your long URL** in the input field
3. **Customize** short code (optional)
4. **Set expiration** date (optional)
5. **Copy and share** your short URL

## API Endpoints

```bash
POST /api/auth/register    # Register user
POST /api/auth/login       # Login user
POST /api/urls            # Create short URL
GET  /api/urls            # Get user URLs
DELETE /api/urls/:id      # Delete URL
```

## Deployment

### Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=production-secret-key
DEFAULT_DOMAIN=yourdomain.com
NEXT_PUBLIC_DEFAULT_DOMAIN=yourdomain.com
```

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Auth:** JWT with bcrypt
- **Utils:** nanoid, QR codes
