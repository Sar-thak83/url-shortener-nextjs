'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/Navbar'
import { 

  Settings, 
  TrendingUp, 

  Link as LinkIcon,
  Calendar,
  Eye,
  MousePointer,
  Clock
} from 'lucide-react'
import { User, Url } from '@/types'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [urls, setUrls] = useState<Url[]>([])
  const [loading, setLoading] = useState(true)
  const [customDomain, setCustomDomain] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setCustomDomain(parsedUser.customDomain || '')
      fetchUrls()
    } catch {
      router.push('/')
    }
  }, [router])

  const fetchUrls = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const updateCustomDomain = async () => {
    alert('Custom domain feature coming soon!')
  }

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0)
  const todayUrls = urls.filter(url => 
    new Date(url.createdAt).toDateString() === new Date().toDateString()
  ).length

  const topUrls = [...urls].sort((a, b) => b.clicks - a.clicks).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar user={user} onLogin={() => {}} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your shortened URLs and view analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total URLs</p>
                  <p className="text-3xl font-bold">{urls.length}</p>
                </div>
                <LinkIcon className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Clicks</p>
                  <p className="text-3xl font-bold">{totalClicks}</p>
                </div>
                <MousePointer className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">URLs Today</p>
                  <p className="text-3xl font-bold">{todayUrls}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Clicks</p>
                  <p className="text-3xl font-bold">
                    {urls.length > 0 ? Math.round(totalClicks / urls.length) : 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Custom Domain</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="yourdomain.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                    <Button onClick={updateCustomDomain} size="sm">
                      Update
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use your own domain for branded short links
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Account Info</h4>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing URLs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Top Performing URLs</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topUrls.length > 0 ? (
                  <div className="space-y-4">
                    {topUrls.map((url, index) => {
                      const domain = url.customDomain || window.location.host
                      const shortUrl = `${window.location.protocol}//${domain}/${url.shortCode}`
                      
                      return (
                        <div key={url._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                                {index + 1}
                              </span>
                              <a 
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:underline truncate"
                              >
                                {shortUrl}
                              </a>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {url.originalUrl}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="text-center">
                              <p className="font-medium text-gray-900">{url.clicks}</p>
                              <p className="text-gray-500">clicks</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No URLs created yet</p>
                    <p className="text-sm text-gray-400">Start shortening URLs to see analytics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {urls.slice(0, 10).map((url) => {
              const domain = url.customDomain || window.location.host
              const shortUrl = `${window.location.protocol}//${domain}/${url.shortCode}`
              
              return (
                <div key={url._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-blue-600 truncate">
                          {shortUrl}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {url.originalUrl}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{url.clicks} clicks</span>
                    <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )
            })}
            
            {urls.length === 0 && (
              <div className="text-center py-8">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                  Create Your First Short URL
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}