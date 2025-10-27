// 'use client'

// import { useState, useEffect } from 'react'
// import URLShortener from '@/components/URLShortener'
// import AuthForm from '@/components/AuthForm'
// import Navbar from '@/components/Navbar'
// import { User } from '@/types'

// export default function Home() {
//   const [user, setUser] = useState<User | null>(null)
//   const [showAuth, setShowAuth] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
//     const userData = localStorage.getItem('user')
    
//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData))
//       } catch {
//         localStorage.removeItem('token')
//         localStorage.removeItem('user')
//       }
//     }
//   }, [])

//   const handleLogin = (userData: User, token: string) => {
//     localStorage.setItem('token', token)
//     localStorage.setItem('user', JSON.stringify(userData))
//     setUser(userData)
//     setShowAuth(false)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     setUser(null)
//   }

//   return (
//     <div className="min-h-screen">
//       <Navbar 
//         user={user} 
//         onLogin={() => setShowAuth(true)}
//         onLogout={handleLogout}
//       />
      
//       <main className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
//               URL Shortener Pro
//             </h1>
//             <p className="text-xl text-gray-600 mb-8">
//               Transform long URLs into powerful, trackable short links with custom domains
//             </p>
//           </div>

//           {user ? (
//             <URLShortener user={user} />
//           ) : (
//             <div className="max-w-md mx-auto">
//               <URLShortener user={null} />
//               <div className="mt-8 text-center">
//                 <p className="text-gray-600 mb-4">
//                   Create an account to unlock advanced features:
//                 </p>
//                 <ul className="text-sm text-gray-500 mb-6 space-y-1">
//                   <li>• Custom short codes</li>
//                   <li>• Click analytics</li>
//                   <li>• Custom domains</li>
//                   <li>• URL expiration</li>
//                 </ul>
//                 <button
//                   onClick={() => setShowAuth(true)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
//                 >
//                   Get Started Free
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       {showAuth && (
//         <AuthForm
//           onClose={() => setShowAuth(false)}
//           onLogin={handleLogin}
//         />
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import URLShortener from '@/components/URLShortener'
import AuthForm from '@/components/AuthForm'
import Navbar from '@/components/Navbar'
import { User } from '@/types'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're now on the client side
    setIsClient(true)
    
    // Only access localStorage after we're sure we're on the client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData))
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }
  }, [])

  const handleLogin = (userData: User, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
    }
    setUser(userData)
    setShowAuth(false)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    setUser(null)
  }

  // Optional: Show a loading state until client-side hydration
  if (!isClient) {
    return (
      <div className="min-h-screen">
        <Navbar 
          user={null} 
          onLogin={() => {}}
          onLogout={() => {}}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                URL Shortener Pro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform long URLs into powerful, trackable short links with custom domains
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        user={user} 
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              URL Shortener Pro
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Transform long URLs into powerful, trackable short links with custom domains
            </p>
          </div>

          {user ? (
            <URLShortener user={user} />
          ) : (
            <div className="max-w-md mx-auto">
              <URLShortener user={null} />
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Create an account to unlock advanced features:
                </p>
                <ul className="text-sm text-gray-500 mb-6 space-y-1">
                  <li>• Custom short codes</li>
                  <li>• Click analytics</li>
                  <li>• Custom domains</li>
                  <li>• URL expiration</li>
                </ul>
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAuth && (
        <AuthForm
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}