import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Globe, 
  Activity, 
  Star,
  Zap,
  Shield,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Network,
  Database,
  Cpu,
  HardDrive
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface AnalyticsData {
  stellarStats: {
    totalAccounts: number
    totalTransactions: number
    ledgerVersion: number
    feePool: number
    baseReserve: number
    lumensSupply: number
    sorobanContracts: number
    activeValidators: number
    averageTransactionFee: number
    networkLoad: number
  }
  tradingStats: {
    volume24h: number
    volume7d: number
    volumeChange24h: number
    totalTrades24h: number
    activePairs: number
    averageTradeSize: number
    topAssets: Array<{
      code: string
      volume: number
      trades: number
      price: number
      change24h: number
    }>
  }
  bridgeStats: {
    totalBridged24h: number
    totalBridged7d: number
    bridgeVolumeChange24h: number
    activeBridges: number
    averageBridgeTime: number
    topBridgedAssets: Array<{
      asset: string
      volume: number
      bridges: number
    }>
  }
  networkPerformance: {
    averageBlockTime: number
    transactionThroughput: number
    networkUptime: number
    activeNodes: number
    averageGasPrice: number
  }
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h')

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      setTimeout(() => {
        setData({
          stellarStats: {
            totalAccounts: 7234567,
            totalTransactions: 145678901,
            ledgerVersion: 48234567,
            feePool: 1234567,
            baseReserve: 1,
            lumensSupply: 50001234567,
            sorobanContracts: 12345,
            activeValidators: 67,
            averageTransactionFee: 0.00001,
            networkLoad: 78.5
          },
          tradingStats: {
            volume24h: 45678901,
            volume7d: 234567890,
            volumeChange24h: 12.5,
            totalTrades24h: 45678,
            activePairs: 1247,
            averageTradeSize: 156.78,
            topAssets: [
              { code: 'XLM', volume: 23456789, trades: 12345, price: 0.1234, change24h: 5.2 },
              { code: 'USDC', volume: 12345678, trades: 9876, price: 1.0000, change24h: 0.1 },
              { code: 'USDT', volume: 9876543, trades: 7654, price: 1.0001, change24h: -0.05 },
              { code: 'BTC', volume: 5432109, trades: 4321, price: 45678.90, change24h: 2.8 }
            ]
          },
          bridgeStats: {
            totalBridged24h: 12345678,
            totalBridged7d: 67890123,
            bridgeVolumeChange24h: 8.7,
            activeBridges: 12,
            averageBridgeTime: 45,
            topBridgedAssets: [
              { asset: 'USDC', volume: 5678901, bridges: 2345 },
              { asset: 'USDT', volume: 4321098, bridges: 1876 },
              { asset: 'XLM', volume: 2345678, bridges: 1234 },
              { asset: 'BTC', volume: 1234567, bridges: 567 }
            ]
          },
          networkPerformance: {
            averageBlockTime: 3.5,
            transactionThroughput: 1000,
            networkUptime: 99.99,
            activeNodes: 156,
            averageGasPrice: 0.00001
          }
        })
        setLoading(false)
      }, 1500)
    }

    fetchAnalyticsData()
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

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ]

  // Mock chart data
  const volumeData = [
    { time: '00:00', volume: 1200000 },
    { time: '04:00', volume: 1800000 },
    { time: '08:00', volume: 2200000 },
    { time: '12:00', volume: 2800000 },
    { time: '16:00', volume: 3200000 },
    { time: '20:00', volume: 2600000 },
    { time: '24:00', volume: 1900000 }
  ]

  const transactionData = [
    { time: '00:00', txs: 1200 },
    { time: '04:00', txs: 1800 },
    { time: '08:00', txs: 2200 },
    { time: '12:00', txs: 2800 },
    { time: '16:00', txs: 3200 },
    { time: '20:00', txs: 2600 },
    { time: '24:00', txs: 1900 }
  ]

  const COLORS = ['#0ea5e9', '#38bdf8', '#0369a1', '#075985']

  if (loading) {
    return (
      <>
        <Head>
          <title>Analytics - Stellarealize</title>
          <meta name="description" content="Comprehensive analytics and statistics for the Stellar Network ecosystem" />
        </Head>
        <div className="min-h-screen bg-dark-950">
          <Header />
          <div className="pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <div className="h-8 bg-dark-800 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-dark-800 rounded-lg"></div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-80 bg-dark-800 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Analytics - Stellarealize</title>
        <meta name="description" content="Comprehensive analytics and statistics for the Stellar Network ecosystem" />
      </Head>

      <div className="min-h-screen bg-dark-950">
        <Header />

        <main className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Stellar Network <span className="gradient-text">Analytics</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Comprehensive insights into the Stellar Network ecosystem, trading activity, and network performance
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedTimeframe === timeframe.value
                        ? 'bg-stellar-500 text-white'
                        : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            {data && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-stellar-400">
                        <DollarSign className="w-8 h-8" />
                      </div>
                      <div className="flex items-center text-green-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">+{data.tradingStats.volumeChange24h}%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {formatCurrency(data.tradingStats.volume24h)}
                    </h3>
                    <p className="text-gray-400 text-sm">24h Trading Volume</p>
                  </div>

                  <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-stellar-400">
                        <Activity className="w-8 h-8" />
                      </div>
                      <div className="flex items-center text-green-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">+5.2%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {formatNumber(data.tradingStats.totalTrades24h)}
                    </h3>
                    <p className="text-gray-400 text-sm">24h Transactions</p>
                  </div>

                  <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-stellar-400">
                        <Users className="w-8 h-8" />
                      </div>
                      <div className="flex items-center text-green-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">+2.1%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {formatNumber(data.stellarStats.totalAccounts)}
                    </h3>
                    <p className="text-gray-400 text-sm">Total Accounts</p>
                  </div>

                  <div className="card-gradient p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-stellar-400">
                        <Network className="w-8 h-8" />
                      </div>
                      <div className="flex items-center text-green-400">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        <span className="text-sm">+8.7%</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {formatCurrency(data.bridgeStats.totalBridged24h)}
                    </h3>
                    <p className="text-gray-400 text-sm">24h Bridge Volume</p>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Volume Chart */}
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Trading Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={volumeData}>
                        <defs>
                          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#0ea5e9" 
                          fill="url(#volumeGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Transaction Chart */}
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6">Transaction Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={transactionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="txs" 
                          stroke="#38bdf8" 
                          strokeWidth={3}
                          dot={{ fill: '#38bdf8', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Stellar Network Stats */}
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Star className="w-6 h-6 mr-2 text-stellar-400" />
                      Stellar Network
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Ledger Version</span>
                        <span className="text-white font-medium">{data.stellarStats.ledgerVersion.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Validators</span>
                        <span className="text-white font-medium">{data.stellarStats.activeValidators}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Soroban Contracts</span>
                        <span className="text-white font-medium">{data.stellarStats.sorobanContracts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Network Load</span>
                        <span className="text-white font-medium">{data.stellarStats.networkLoad}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Fee</span>
                        <span className="text-white font-medium">{data.stellarStats.averageTransactionFee} XLM</span>
                      </div>
                    </div>
                  </div>

                  {/* Trading Stats */}
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-stellar-400" />
                      Trading Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Pairs</span>
                        <span className="text-white font-medium">{data.tradingStats.activePairs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Trade Size</span>
                        <span className="text-white font-medium">${data.tradingStats.averageTradeSize.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">7d Volume</span>
                        <span className="text-white font-medium">{formatCurrency(data.tradingStats.volume7d)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Volume Change</span>
                        <span className={`font-medium ${data.tradingStats.volumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {data.tradingStats.volumeChange24h >= 0 ? '+' : ''}{data.tradingStats.volumeChange24h}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bridge Stats */}
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Globe className="w-6 h-6 mr-2 text-stellar-400" />
                      Cross-Chain Bridges
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Bridges</span>
                        <span className="text-white font-medium">{data.bridgeStats.activeBridges}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg Bridge Time</span>
                        <span className="text-white font-medium">{data.bridgeStats.averageBridgeTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">7d Bridge Volume</span>
                        <span className="text-white font-medium">{formatCurrency(data.bridgeStats.totalBridged7d)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Bridge Change</span>
                        <span className={`font-medium ${data.bridgeStats.bridgeVolumeChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {data.bridgeStats.bridgeVolumeChange24h >= 0 ? '+' : ''}{data.bridgeStats.bridgeVolumeChange24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Assets */}
                <div className="card-gradient p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-bold text-white mb-6">Top Trading Assets</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-700">
                          <th className="text-left py-3 text-gray-400 font-medium">Asset</th>
                          <th className="text-right py-3 text-gray-400 font-medium">Volume (24h)</th>
                          <th className="text-right py-3 text-gray-400 font-medium">Trades</th>
                          <th className="text-right py-3 text-gray-400 font-medium">Price</th>
                          <th className="text-right py-3 text-gray-400 font-medium">24h Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tradingStats.topAssets.map((asset, index) => (
                          <tr key={index} className="border-b border-dark-800/50">
                            <td className="py-3 text-white font-medium">{asset.code}</td>
                            <td className="py-3 text-right text-white">{formatCurrency(asset.volume)}</td>
                            <td className="py-3 text-right text-gray-300">{asset.trades.toLocaleString()}</td>
                            <td className="py-3 text-right text-white">${asset.price.toFixed(4)}</td>
                            <td className={`py-3 text-right font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Network Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <Cpu className="w-6 h-6 mr-2 text-stellar-400" />
                      Network Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Block Time</span>
                        <span className="text-white font-medium">{data.networkPerformance.averageBlockTime}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Throughput</span>
                        <span className="text-white font-medium">{data.networkPerformance.transactionThroughput} TPS</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Uptime</span>
                        <span className="text-white font-medium">{data.networkPerformance.networkUptime}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Nodes</span>
                        <span className="text-white font-medium">{data.networkPerformance.activeNodes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-gradient p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <HardDrive className="w-6 h-6 mr-2 text-stellar-400" />
                      Bridge Assets
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.bridgeStats.topBridgedAssets}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="volume"
                          label={({ asset, percent }) => `${asset} ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.bridgeStats.topBridgedAssets.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}