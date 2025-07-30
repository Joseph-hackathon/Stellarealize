import Head from 'next/head'
import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import SwapInterface from '@/components/Swap/SwapInterface'
import { Zap, Shield, Globe, TrendingUp, ArrowLeftRight, Clock } from 'lucide-react'

export default function Swap() {
  const [selectedTab, setSelectedTab] = useState('swap')

  const tabs = [
    { id: 'swap', label: 'Swap', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'bridge', label: 'Bridge', icon: <Globe className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <Clock className="w-4 h-4" /> },
  ]

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Swap tokens in seconds across multiple networks'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Audited',
      description: 'Built with security-first approach and audited smart contracts'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Cross-Chain',
      description: 'Bridge assets seamlessly between Stellar and other networks'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Best Rates',
      description: 'Access deep liquidity pools for optimal exchange rates'
    }
  ]

  const supportedNetworks = [
    { name: 'Stellar', logo: '⭐', tvl: '$234M', pairs: '1,247' },
    { name: 'Ethereum', logo: '♦️', tvl: '$1.2B', pairs: '8,923' },
    { name: 'BSC', logo: '🟡', tvl: '$89M', pairs: '2,156' },
    { name: 'Polygon', logo: '🟣', tvl: '$156M', pairs: '3,421' },
    { name: 'Arbitrum', logo: '🔵', tvl: '$67M', pairs: '1,832' },
    { name: 'Optimism', logo: '🔴', tvl: '$45M', pairs: '987' }
  ]

  return (
    <>
      <Head>
        <title>Cross-Chain Swap - Stellarealize</title>
        <meta name="description" content="Swap tokens seamlessly across Stellar Network and other blockchains with the best rates" />
      </Head>

      <div className="min-h-screen bg-dark-950">
        <Header />

        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Cross-Chain{' '}
                <span className="gradient-text">Swap</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Swap tokens seamlessly between Stellar Network and other blockchains 
                with institutional-grade security and the best available rates.
              </p>
            </div>

            {/* Main Swap Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Swap Panel */}
              <div className="lg:col-span-1">
                <SwapInterface />
              </div>

              {/* Features & Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="card-gradient p-6 rounded-xl">
                      <div className="text-stellar-400 mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Supported Networks */}
                <div className="card-gradient p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Supported Networks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {supportedNetworks.map((network, index) => (
                      <div key={index} className="bg-dark-800/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">{network.logo}</div>
                        <div className="font-semibold text-white mb-1">
                          {network.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          TVL: {network.tvl}
                        </div>
                        <div className="text-xs text-gray-500">
                          {network.pairs} pairs
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How It Works */}
                <div className="card-gradient p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-6">
                    How Cross-Chain Swaps Work
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-stellar-500/20 rounded-full p-2 mt-1">
                        <span className="text-stellar-400 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Select Tokens
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Choose source and destination tokens from any supported network
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-stellar-500/20 rounded-full p-2 mt-1">
                        <span className="text-stellar-400 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Get Best Rate
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Our aggregator finds the optimal route across multiple DEXes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-stellar-500/20 rounded-full p-2 mt-1">
                        <span className="text-stellar-400 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Bridge & Swap
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Execute the swap with automatic bridging between networks
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-stellar-500/20 rounded-full p-2 mt-1">
                        <span className="text-stellar-400 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">
                          Receive Tokens
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Get your tokens on the destination network within minutes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="card-gradient p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-white mb-2">$45.7M</div>
                <div className="text-gray-400">24h Volume</div>
              </div>
              <div className="card-gradient p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-white mb-2">12,347</div>
                <div className="text-gray-400">Total Swaps</div>
              </div>
              <div className="card-gradient p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-white mb-2">6</div>
                <div className="text-gray-400">Networks</div>
              </div>
              <div className="card-gradient p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-white mb-2">0.3%</div>
                <div className="text-gray-400">Avg Fee</div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card-gradient p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Frequently Asked Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What is a cross-chain swap?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      A cross-chain swap allows you to exchange tokens from one blockchain 
                      to another without needing to manually bridge or use multiple platforms.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      How long do cross-chain swaps take?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Cross-chain swaps typically take 10-30 minutes depending on network 
                      congestion and the specific blockchain pair involved.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      What are the fees?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Fees include network gas fees, bridge fees (if applicable), and a 
                      small protocol fee. Total fees typically range from 0.1% to 1%.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Is it safe to use?
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Yes, our platform uses audited smart contracts and integrates with 
                      trusted bridge protocols to ensure maximum security for your assets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}