import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Star, Zap, BarChart3 } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Swap', href: '/swap' },
    { name: 'Analytics', href: '/analytics' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 bg-dark-950/80 backdrop-blur-md border-b border-stellar-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 32 32" className="text-stellar-400">
                <defs>
                  <radialGradient id="headerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:0.3}} />
                    <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:0}} />
                  </radialGradient>
                  
                  <linearGradient id="headerStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#38bdf8'}} />
                    <stop offset="50%" style={{stopColor:'#0ea5e9'}} />
                    <stop offset="100%" style={{stopColor:'#0369a1'}} />
                  </linearGradient>
                </defs>
                
                <circle cx="16" cy="16" r="12" fill="url(#headerGlow)" />
                
                <g transform="translate(16, 16)">
                  <path d="M 0 -9 L 2.25 -2.75 L 9 -2.75 L 4.25 1.25 L 6.5 7.5 L 0 4 L -6.5 7.5 L -4.25 1.25 L -9 -2.75 L -2.25 -2.75 Z" 
                        fill="url(#headerStarGradient)" 
                        stroke="currentColor" 
                        strokeWidth="0.5"/>
                  
                  <circle cx="0" cy="0" r="2" fill="#38bdf8" opacity="0.9"/>
                  
                  <g stroke="currentColor" strokeWidth="0.8" opacity="0.6">
                    <line x1="0" y1="0" x2="12" y2="-4" />
                    <line x1="0" y1="0" x2="12" y2="4" />
                    <line x1="0" y1="0" x2="15" y2="0" />
                  </g>
                  
                  <circle cx="12" cy="-4" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="12" cy="4" r="1" fill="currentColor" opacity="0.8"/>
                  <circle cx="15" cy="0" r="1" fill="currentColor" opacity="0.8"/>
                </g>
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">Stellarealize</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-stellar-400 transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="btn-secondary text-sm">
              Connect Wallet
            </button>
            <Link href="/dashboard" className="btn-primary text-sm">
              Launch App
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-stellar-400 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-900/95 rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-stellar-400 hover:bg-stellar-500/10 rounded-md transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <button className="w-full btn-secondary text-sm">
                  Connect Wallet
                </button>
                <Link 
                  href="/dashboard" 
                  className="block w-full text-center btn-primary text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Launch App
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}