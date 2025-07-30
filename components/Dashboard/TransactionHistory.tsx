import { useState } from 'react'
import { ExternalLink, Copy, Filter, Search } from 'lucide-react'
import { TransactionHistory as Transaction } from '@/lib/types'

interface TransactionHistoryProps {
  transactions: Transaction[]
  loading?: boolean
}

export default function TransactionHistory({ transactions, loading = false }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'swap' | 'bridge' | 'liquidity'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter || 
      (filter === 'liquidity' && (tx.type === 'add_liquidity' || tx.type === 'remove_liquidity'))
    const matchesSearch = searchTerm === '' || 
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400 bg-green-400/20'
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20'
      case 'failed':
        return 'text-red-400 bg-red-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return '🔄'
      case 'bridge':
        return '🌉'
      case 'add_liquidity':
        return '➕'
      case 'remove_liquidity':
        return '➖'
      default:
        return '📄'
    }
  }

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount)
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
    return num.toFixed(4)
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="card-gradient p-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card-gradient p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-stellar-500 focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-dark-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-stellar-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="swap">Swaps</option>
            <option value="bridge">Bridge</option>
            <option value="liquidity">Liquidity</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-dark-800/50 p-4 rounded-lg hover:bg-dark-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTypeIcon(tx.type)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white capitalize">
                        {tx.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span className="font-mono">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.hash)}
                        className="hover:text-stellar-400 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <a
                        href={`https://stellar.expert/explorer/public/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-stellar-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white">
                    {formatAmount(tx.amount)} {tx.token.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatTime(tx.timestamp)}
                  </div>
                  {tx.fee && (
                    <div className="text-xs text-gray-500">
                      Fee: {formatAmount(tx.fee)} XLM
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="w-full text-stellar-400 hover:text-stellar-300 transition-colors font-medium">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  )
}