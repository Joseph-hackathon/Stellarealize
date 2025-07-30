import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import StatCard from '@/components/Dashboard/StatCard'
import TVLChart from '@/components/Dashboard/TVLChart'
import TransactionHistory from '@/components/Dashboard/TransactionHistory'
import NetworkStats from '@/components/Dashboard/NetworkStats'
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  Globe,
  Activity,
  Star
} from 'lucide-react'
import { DashboardStats, StellarEcosystemStats, TransactionHistory as TxHistory } from '@/lib/types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [stellarStats, setStellarStats] = useState<StellarEcosystemStats | null>(null)
  const [transactions, setTransactions] = useState<TxHistory[]>([])
  const [tvlData, setTvlData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      // Mock data - in real app, this would be API calls
      setTimeout(() => {
        setStats({
          totalTVL: 1234567890,
          totalVolume24h: 45678901,
          totalTransactions: 2145678,
          uniqueUsers: 87432,
          stellarTVL: 234567890,
          crossChainVolume: 12345678,
          averageTransactionValue: 156.78,
          topTokens: [],
          topPairs: [],
          recentTransactions: []
        })

        setStellarStats({
          totalAccounts: 7234567,
          totalTransactions: 145678901,
          ledgerVersion: 48234567,
          feePool: 1234567,
          baseReserve: 1,
          lumensSupply: 50001234567,
          sorobanContracts: 12345,
          activeValidators: 67
        })

        // Generate mock TVL data
        const mockTvlData = []
        const now = Date.now()
        for (let i = 30; i >= 0; i--) {
          mockTvlData.push({
            timestamp: now - (i * 24 * 60 * 60 * 1000),
            value: 1234567890 + Math.random() * 100000000 - 50000000
          })
        }
        setTvlData(mockTvlData)

        // Generate mock transaction data
        const mockTransactions: TxHistory[] = []
        for (let i = 0; i < 20; i++) {
          mockTransactions.push({
            id: `tx-${i}`,
            type: ['swap', 'bridge', 'add_liquidity', 'remove_liquidity'][Math.floor(Math.random() * 4)] as any,
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            from: `G${Math.random().toString(36).substr(2, 55).toUpperCase()}`,
            amount: (Math.random() * 10000).toFixed(4),
            token: {
              address: 'native',
              symbol: ['XLM', 'USDC', 'USDT', 'BTC'][Math.floor(Math.random() * 4)],
              name: 'Token',
              decimals: 7,
              chainId: 1,
            },
            timestamp: now - Math.random() * 24 * 60 * 60 * 1000,
            status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
            fee: (Math.random() * 0.1).toFixed(6)
          })
        }
        setTransactions(mockTransactions)

        setLoading(false)
      }, 1500)
    }

    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toLocaleString()
  }

  return (
    <>
      <Head>
        <title>Dashboard - Stellarealize</title>
        <meta name="description" content="Stellar Network DeFi Dashboard - Track TVL, volume, and ecosystem statistics" />
      </Head>

      <div className="min-h-screen bg-dark-950">
        <Header />

        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Stellar Economy{' '}
                <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Real-time analytics for the Stellar Network DeFi ecosystem
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total TVL"
                value={stats ? formatCurrency(stats.totalTVL) : '--'}
                change="+8.4%"
                changeType="positive"
                icon={<DollarSign className="w-5 h-5" />}
                description="Across all Stellar DeFi protocols"
              />
              <StatCard
                title="24h Volume"
                value={stats ? formatCurrency(stats.totalVolume24h) : '--'}
                change="+12.1%"
                changeType="positive"
                icon={<BarChart3 className="w-5 h-5" />}
                description="Total trading volume"
              />
              <StatCard
                title="Total Transactions"
                value={stats ? formatNumber(stats.totalTransactions) : '--'}
                change="+5.7%"
                changeType="positive"
                icon={<Activity className="w-5 h-5" />}
                description="All-time network transactions"
              />
              <StatCard
                title="Active Users"
                value={stats ? formatNumber(stats.uniqueUsers) : '--'}
                change="+3.2%"
                changeType="positive"
                icon={<Users className="w-5 h-5" />}
                description="30-day active addresses"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Stellar TVL"
                value={stats ? formatCurrency(stats.stellarTVL) : '--'}
                change="+6.8%"
                changeType="positive"
                icon={<Star className="w-5 h-5" />}
                description="Native Stellar protocols"
              />
              <StatCard
                title="Cross-Chain Volume"
                value={stats ? formatCurrency(stats.crossChainVolume) : '--'}
                change="+22.5%"
                changeType="positive"
                icon={<Globe className="w-5 h-5" />}
                description="Bridge and swap volume"
              />
              <StatCard
                title="Avg Transaction Value"
                value={stats ? `$${stats.averageTransactionValue.toFixed(2)}` : '--'}
                change="-2.1%"
                changeType="negative"
                icon={<TrendingUp className="w-5 h-5" />}
                description="Mean transaction size"
              />
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* TVL Chart */}
              <div className="lg:col-span-2">
                <TVLChart data={tvlData} title="Total Value Locked Over Time" />
              </div>
            </div>

            {/* Network Stats and Transaction History */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Network Statistics */}
              <div className="xl:col-span-1">
                {stellarStats && (
                  <NetworkStats stats={stellarStats} loading={loading} />
                )}
              </div>

              {/* Transaction History */}
              <div className="xl:col-span-2">
                <TransactionHistory transactions={transactions} loading={loading} />
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  🌟 Stellar Highlights
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Fast 3-5 second settlements</li>
                  <li>• $0.00001 average transaction cost</li>
                  <li>• Built-in DEX with pathfinding</li>
                  <li>• Multi-signature support</li>
                  <li>• Soroban smart contracts</li>
                </ul>
              </div>

              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  🔗 Cross-Chain Support
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Ethereum bridging</li>
                  <li>• BSC connectivity</li>
                  <li>• Polygon integration</li>
                  <li>• Arbitrum support</li>
                  <li>• More networks coming</li>
                </ul>
              </div>

              <div className="card-gradient p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  📈 DeFi Ecosystem
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• AMM liquidity pools</li>
                  <li>• Yield farming opportunities</li>
                  <li>• Lending protocols</li>
                  <li>• Stablecoin issuance</li>
                  <li>• NFT marketplaces</li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}