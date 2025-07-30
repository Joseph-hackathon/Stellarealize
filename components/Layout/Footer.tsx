import Link from 'next/link'
import { Star, Github, Twitter, Linkedin, MessageCircle } from 'lucide-react'

export default function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Swap', href: '/swap' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Bridge', href: '/bridge' },
      ]
    },
    {
      title: 'Developers',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'API Reference', href: '/api' },
        { name: 'SDKs', href: '/sdks' },
        { name: 'GitHub', href: 'https://github.com' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Help Center', href: '/help' },
        { name: 'Status', href: '/status' },
        { name: 'Security', href: '/security' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: 'https://discord.gg' },
        { name: 'Twitter', href: 'https://twitter.com' },
        { name: 'Telegram', href: 'https://t.me' },
        { name: 'Forum', href: '/forum' },
      ]
    }
  ]

  return (
    <footer className="bg-dark-900/50 border-t border-stellar-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-stellar-400">
                  <defs>
                    <radialGradient id="footerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:0.3}} />
                      <stop offset="100%" style={{stopColor:'#0ea5e9', stopOpacity:0}} />
                    </radialGradient>
                    
                    <linearGradient id="footerStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:'#38bdf8'}} />
                      <stop offset="50%" style={{stopColor:'#0ea5e9'}} />
                      <stop offset="100%" style={{stopColor:'#0369a1'}} />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="16" cy="16" r="12" fill="url(#footerGlow)" />
                  
                  <g transform="translate(16, 16)">
                    <path d="M 0 -9 L 2.25 -2.75 L 9 -2.75 L 4.25 1.25 L 6.5 7.5 L 0 4 L -6.5 7.5 L -4.25 1.25 L -9 -2.75 L -2.25 -2.75 Z" 
                          fill="url(#footerStarGradient)" 
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
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting Stellar Network to the global DeFi ecosystem with 
              institutional-grade tools and cross-chain capabilities.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://github.com" 
                className="text-gray-400 hover:text-stellar-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-400 hover:text-stellar-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://discord.gg" 
                className="text-gray-400 hover:text-stellar-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-400 hover:text-stellar-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-stellar-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stellar-500/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 Stellarealize. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                href="/privacy" 
                className="text-gray-400 hover:text-stellar-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-stellar-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-gray-400 hover:text-stellar-400 text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}