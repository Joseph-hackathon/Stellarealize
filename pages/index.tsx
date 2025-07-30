import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  BarChart3, 
  ArrowRight,
  ChevronDown,
  Lock,
  Coins,
  Layers
} from 'lucide-react'

export default function Home() {
  const [tvl, setTvl] = useState('1.2B')
  const [volume24h, setVolume24h] = useState('45.7M')
  const [transactions, setTransactions] = useState('2.1M')

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Execute cross-chain swaps in seconds with Stellar\'s fast settlement and 1inch aggregation'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Battle Tested',
      description: 'Built on Stellar\'s proven infrastructure with institutional-grade security'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Cross-Chain',
      description: 'Seamlessly bridge assets between Stellar and major blockchain networks'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Best Rates',
      description: 'Access the deepest liquidity across DEXes for optimal swap rates'
    }
  ]

  const stats = [
    { label: 'Total Value Locked', value: tvl, icon: <Lock className="w-5 h-5" /> },
    { label: '24h Volume', value: volume24h, icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Total Transactions', value: transactions, icon: <Users className="w-5 h-5" /> },
    { label: 'Supported Networks', value: '12', icon: <Globe className="w-5 h-5" /> }
  ]

  const networkLogos = [
    { name: 'Stellar', logo: '⭐' },
    { name: 'Ethereum', logo: '♦️' },
    { name: 'BSC', logo: '🟡' },
    { name: 'Polygon', logo: '🟣' },
    { name: 'Arbitrum', logo: '🔵' },
    { name: 'Optimism', logo: '🔴' }
  ]

  return (
    <>
      <Head>
        <title>Stellarealize - Stellar Network DeFi Platform</title>
        <meta name="description" content="The premier DeFi platform connecting Stellar Network to the global financial ecosystem" />
      </Head>

      <div className="min-h-screen bg-dark-950">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stellar-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stellar-600/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Connecting{' '}
                <span className="gradient-text">Stellar</span>
                <br />
                to the DeFi Ecosystem
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Stellar Network is the most secure, most battle-tested, and most resilient 
                blockchain for institutional DeFi. Access unlimited liquidity with cross-chain capabilities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 glow-effect">
                  Explore Stellar Economy
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link href="/swap" className="btn-secondary text-lg px-8 py-4">
                  Start Swapping
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-center mb-2 text-stellar-400">
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* XLM: Store of Value Section */}
        <section className="py-20 bg-gradient-to-r from-dark-900/50 to-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  XLM: A Store of Value with{' '}
                  <span className="gradient-text">Cash Flow</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  The Stellar ecosystem is secured by its native asset, XLM. As more value 
                  flows through the network, XLM becomes increasingly valuable. Activity across 
                  the Stellar economy accrues value to XLM holders.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-stellar-500/20 p-3 rounded-lg">
                      <Coins className="w-6 h-6 text-stellar-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Native Asset Utility</h3>
                      <p className="text-gray-400">XLM powers all transactions and serves as the bridge currency for cross-border payments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-stellar-500/20 p-3 rounded-lg">
                      <Layers className="w-6 h-6 text-stellar-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Network Effects</h3>
                      <p className="text-gray-400">As adoption grows, network effects increase the utility and value of XLM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-gradient p-8 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">Network Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Accounts</span>
                    <span className="font-semibold">7.2M+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Transaction Time</span>
                    <span className="font-semibold">3-5 seconds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Transaction Cost</span>
                    <span className="font-semibold">$0.00001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Transactions</span>
                    <span className="font-semibold">4.5M+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose{' '}
                <span className="gradient-text">Stellarealize</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Built for institutions and power users who demand the best in DeFi infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="card-gradient p-8 rounded-xl text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-stellar-400 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Networks */}
        <section className="py-20 bg-dark-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Cross-Chain{' '}
                <span className="gradient-text">Connectivity</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Seamlessly bridge assets between Stellar and major blockchain networks
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
              {networkLogos.map((network, index) => (
                <div key={index} className="card-gradient p-6 rounded-xl text-center hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl mb-2">{network.logo}</div>
                  <div className="text-sm font-medium text-gray-300">{network.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build on{' '}
              <span className="gradient-text">Stellar</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of institutional DeFi with Stellarealize
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-4 glow-effect">
                Launch Dashboard
              </Link>
              <Link href="/docs" className="btn-secondary text-lg px-8 py-4">
                Read Documentation
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}