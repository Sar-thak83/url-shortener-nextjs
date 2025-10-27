import { redirect } from 'next/navigation'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import Url from '@/models/Url'

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  // Await the params proxy before reading properties to satisfy Next.js requirement
  const { shortCode } = await params

  await connectDB()

  // Use the awaited shortCode here instead of params.shortCode
  const url = await Url.findOne({ shortCode })

  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - URL Not Found</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  if (url.expiresAt && new Date() > url.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Link Expired</h1>
          <p className="text-gray-600 mb-8">
            This short URL has expired and is no longer available.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } })

  // Build an absolute redirect target for production:
  const protocol = process.env.DEFAULT_PROTOCOL || process.env.NEXT_PUBLIC_DEFAULT_PROTOCOL || 'https'
  const domain =
    process.env.DEFAULT_DOMAIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'localhost:3000'

  const normalizedPath = url.originalUrl.startsWith('/') ? url.originalUrl : `/${url.originalUrl}`
  const target = /^https?:\/\//i.test(url.originalUrl) ? url.originalUrl : `${protocol}://${domain}${normalizedPath}`

  redirect(target)
}
