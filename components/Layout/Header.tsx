import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Star, Zap, BarChart3 } from 'lucide-react'
import Logo from '@/components/Logo'
import WalletConnect from '@/components/Wallet/WalletConnect'

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
            <Logo size="md" showText={true} />
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
            <WalletConnect />
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