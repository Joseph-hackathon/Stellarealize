import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Users, Zap, Globe, Shield } from 'lucide-react'
import { StellarEcosystemStats } from '@/lib/types'

interface NetworkStatsProps {
  stats: StellarEcosystemStats
  loading?: boolean
}

export default function NetworkStats({ stats, loading = false }: NetworkStatsProps) {
  const [selectedTab, setSelectedTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'defi', label: 'DeFi', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'network', label: 'Network', icon: <Globe className="w-4 h-4" /> },
  ]

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatXLM = (amount: number) => {
    return `${formatNumber(amount)} XLM`
  }

  if (loading) {
    return (
      <div className="card-gradient p-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/2"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const overviewStats = [
    {
      label: 'Total Accounts',
      value: formatNumber(stats.totalAccounts),
      icon: <Users className="w-5 h-5" />,
      change: '+2.3%',
      changeType: 'positive' as const
    },
    {
      label: 'Total Transactions',
      value: formatNumber(stats.totalTransactions),
      icon: <Activity className="w-5 h-5" />,
      change: '+5.7%',
      changeType: 'positive' as const
    },
    {
      label: 'Ledger Version',
      value: formatNumber(stats.ledgerVersion),
      icon: <Shield className="w-5 h-5" />,
      change: 'Latest',
      changeType: 'neutral' as const
    },
    {
      label: 'Active Validators',
      value: formatNumber(stats.activeValidators),
      icon: <Zap className="w-5 h-5" />,
      change: '+1.2%',
      changeType: 'positive' as const
    },
    {
      label: 'XLM Supply',
      value: formatXLM(stats.lumensSupply),
      icon: <Globe className="w-5 h-5" />,
      change: '+0.1%',
      changeType: 'positive' as const
    },
    {
      label: 'Soroban Contracts',
      value: formatNumber(stats.sorobanContracts),
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+15.3%',
      changeType: 'positive' as const
    }
  ]

  const defiStats = [
    {
      label: 'Total TVL',
      value: '$1.2B',
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+8.4%',
      changeType: 'positive' as const
    },
    {
      label: '24h Volume',
      value: '$45.7M',
      icon: <Activity className="w-5 h-5" />,
      change: '+12.1%',
      changeType: 'positive' as const
    },
    {
      label: 'DEX Pairs',
      value: '1,247',
      icon: <Globe className="w-5 h-5" />,
      change: '+3.2%',
      changeType: 'positive' as const
    },
    {
      label: 'AMM Pools',
      value: '432',
      icon: <Zap className="w-5 h-5" />,
      change: '+7.8%',
      changeType: 'positive' as const
    },
    {
      label: 'Bridge Volume',
      value: '$8.9M',
      icon: <Users className="w-5 h-5" />,
      change: '+22.5%',
      changeType: 'positive' as const
    },
    {
      label: 'Yield Farms',
      value: '89',
      icon: <Shield className="w-5 h-5" />,
      change: '+5.4%',
      changeType: 'positive' as const
    }
  ]

  const networkStats = [
    {
      label: 'Network Load',
      value: '67%',
      icon: <Activity className="w-5 h-5" />,
      change: 'Normal',
      changeType: 'neutral' as const
    },
    {
      label: 'Avg Block Time',
      value: '5.2s',
      icon: <Zap className="w-5 h-5" />,
      change: 'Stable',
      changeType: 'neutral' as const
    },
    {
      label: 'Base Fee',
      value: formatXLM(stats.baseReserve),
      icon: <Users className="w-5 h-5" />,
      change: 'Unchanged',
      changeType: 'neutral' as const
    },
    {
      label: 'Fee Pool',
      value: formatXLM(stats.feePool),
      icon: <Globe className="w-5 h-5" />,
      change: '+0.8%',
      changeType: 'positive' as const
    },
    {
      label: 'Network Health',
      value: '99.9%',
      icon: <Shield className="w-5 h-5" />,
      change: 'Excellent',
      changeType: 'positive' as const
    },
    {
      label: 'Consensus',
      value: 'Active',
      icon: <TrendingUp className="w-5 h-5" />,
      change: 'Stable',
      changeType: 'neutral' as const
    }
  ]

  const getStatsForTab = () => {
    switch (selectedTab) {
      case 'defi':
        return defiStats
      case 'network':
        return networkStats
      default:
        return overviewStats
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="card-gradient p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Stellar Network Stats</h3>
        <div className="flex space-x-1 bg-dark-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'bg-stellar-500 text-white'
                  : 'text-gray-400 hover:text-stellar-400'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {getStatsForTab().map((stat, index) => (
          <div key={index} className="bg-dark-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-stellar-400">
                {stat.icon}
              </div>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
            <div className="text-xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className={`text-sm ${getChangeColor(stat.changeType)}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last updated: {new Date().toLocaleTimeString()}</span>
          <button className="text-stellar-400 hover:text-stellar-300 transition-colors">
            View Explorer →
          </button>
        </div>
      </div>
    </div>
  )
}