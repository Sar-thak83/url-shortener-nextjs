import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { 
  Copy, 
  ExternalLink, 
  QrCode, 
  Calendar, 
  BarChart3, 
  Trash2,
  Globe,
  Clock,
  TrendingUp
} from 'lucide-react'
import { User, Url } from '@/types'
import QRCode from 'qrcode'

interface URLShortenerProps {
  user: User | null
}

export default function URLShortener({ user }: URLShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customShortCode, setCustomShortCode] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<Url[]>([])
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showQR, setShowQR] = useState(false)

  const fetchUrls = React.useCallback(async () => {
    if (!user) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/urls', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUrls(data.urls)
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchUrls()
    }
  }, [user, fetchUrls])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShortenedUrl('')
    setQrCodeUrl('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          originalUrl,
          customShortCode: customShortCode || undefined,
          expiresAt: expiresAt || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const domain = data.url.customDomain || window.location.host
        const shortUrl = `${window.location.protocol}//${domain}/${data.url.shortCode}`
        setShortenedUrl(shortUrl)
        
        // Generate QR code
        const qrCode = await QRCode.toDataURL(shortUrl)
        setQrCodeUrl(qrCode)
        
        // Reset form
        setOriginalUrl('')
        setCustomShortCode('')
        setExpiresAt('')
        
        // Refresh URLs list
        if (user) {
          fetchUrls()
        }
      } else {
        alert(data.message)
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const deleteUrl = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data.success) {
        fetchUrls()
      } else {
        alert(data.message)
      }
    } catch {
      alert('Failed to delete URL')
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-8">
      {/* URL Shortening Form */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span>Shorten Your URL</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Original URL</label>
              <Input
                type="url"
                placeholder="https://example.com/very-long-url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
                className="text-lg p-4 h-12"
              />
            </div>

            {user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Short Code (Optional)</label>
                  <Input
                    type="text"
                    placeholder="my-custom-link"
                    value={customShortCode}
                    onChange={(e) => setCustomShortCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expires At (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </Button>
          </form>

          {/* Result */}
          {shortenedUrl && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Your shortened URL is ready!
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Input value={shortenedUrl} readOnly className="flex-1" />
                <Button
                  onClick={() => copyToClipboard(shortenedUrl)}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => window.open(shortenedUrl, '_blank')}
                  variant="outline"
                  size="icon"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setShowQR(!showQR)}
                  variant="outline"
                  size="icon"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
              {showQR && qrCodeUrl && (
                <div className="text-center">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* URLs List */}
      {user && urls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span>Your URLs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urls.map((url) => {
                const domain = url.customDomain || window.location.host
                const shortUrl = `${window.location.protocol}//${domain}/${url.shortCode}`
                
                return (
                  <div key={url._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <a 
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline truncate"
                          >
                            {shortUrl}
                          </a>
                          <Button
                            onClick={() => copyToClipboard(shortUrl)}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {url.originalUrl}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {url.clicks} clicks
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(url.createdAt)}
                          </span>
                          {url.expiresAt && (
                            <span className="flex items-center text-orange-500">
                              <Clock className="w-3 h-3 mr-1" />
                              Expires: {formatDate(url.expiresAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteUrl(url._id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}