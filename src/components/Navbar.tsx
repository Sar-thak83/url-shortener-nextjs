import React from 'react'
import { Button } from './ui/button'
import { User, LogOut, BarChart3, Link as LinkIcon } from 'lucide-react'
import { User as UserType } from '@/types'
import Link from 'next/link'

interface NavbarProps {
  user: UserType | null
  onLogin: () => void
  onLogout: () => void
}

export default function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              URLShort
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button onClick={onLogin} size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}