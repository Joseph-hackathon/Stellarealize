import { useState, useEffect } from 'react'
import { Search, ChevronDown, Star, ExternalLink } from 'lucide-react'
import { Token } from '@/lib/types'

interface TokenSelectorProps {
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  otherToken?: Token | null
  label: string
  disabled?: boolean
  showBalance?: boolean
  balance?: string
}

export default function TokenSelector({
  selectedToken,
  onTokenSelect,
  otherToken,
  label,
  disabled = false,
  showBalance = false,
  balance = '0'
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [tokens, setTokens] = useState<Token[]>([])
  const [favoriteTokens, setFavoriteTokens] = useState<string[]>([])

  // Popular tokens for Stellar Network and cross-chain
  const popularTokens: Token[] = [
    {
      address: 'native',
      symbol: 'XLM',
      name: 'Stellar Lumens',
      decimals: 7,
      logoURI: '⭐',
      chainId: 0,
      isNative: true
    },
    {
      address: 'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoURI: '🔵',
      chainId: 0
    },
    {
      address: 'USDT:GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logoURI: '🟢',
      chainId: 0
    },
    // Ethereum tokens
    {
      address: '0xA0b86a33E6441E86C62C30d5a5e02A1C38a6e68f',
      symbol: 'WETH',
      name: 'Wrapped Ethereum',
      decimals: 18,
      logoURI: '♦️',
      chainId: 1
    },
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoURI: '♦️',
      chainId: 1,
      isNative: true
    },
    {
      address: '0xA0b86a33E6441E86C62C30d5a5e02A1C38a6e68f',
      symbol: 'USDC',
      name: 'USD Coin (Ethereum)',
      decimals: 6,
      logoURI: '🔵',
      chainId: 1
    }
  ]

  useEffect(() => {
    setTokens(popularTokens)
    // Load favorite tokens from localStorage
    const savedFavorites = localStorage.getItem('stellarealize-favorite-tokens')
    if (savedFavorites) {
      setFavoriteTokens(JSON.parse(savedFavorites))
    }
  }, [])

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = searchTerm === '' ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const isNotOtherToken = !otherToken || token.address !== otherToken.address
    
    return matchesSearch && isNotOtherToken
  })

  const toggleFavorite = (tokenAddress: string) => {
    const newFavorites = favoriteTokens.includes(tokenAddress)
      ? favoriteTokens.filter(addr => addr !== tokenAddress)
      : [...favoriteTokens, tokenAddress]
    
    setFavoriteTokens(newFavorites)
    localStorage.setItem('stellarealize-favorite-tokens', JSON.stringify(newFavorites))
  }

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    setIsOpen(false)
    setSearchTerm('')
  }

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 0:
        return 'Stellar'
      case 1:
        return 'Ethereum'
      case 56:
        return 'BSC'
      case 137:
        return 'Polygon'
      case 42161:
        return 'Arbitrum'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      
      {/* Token Selector Button */}
      <button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`w-full p-4 rounded-xl border transition-all duration-200 ${
          disabled
            ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
            : 'bg-dark-800 border-gray-600 hover:border-stellar-500 hover:bg-dark-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedToken ? (
              <>
                <div className="text-2xl">
                  {selectedToken.logoURI}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {selectedToken.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedToken.name}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-400">
                Select a token
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {showBalance && selectedToken && (
              <div className="text-right text-sm">
                <div className="text-gray-400">Balance</div>
                <div className="font-semibold text-white">
                  {parseFloat(balance).toFixed(4)}
                </div>
              </div>
            )}
            {!disabled && (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* Token Selection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-dark-900 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Select Token</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-stellar-500 focus:outline-none"
              />
            </div>

            {/* Token List */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tokens found
                </div>
              ) : (
                filteredTokens.map((token) => (
                  <div
                    key={`${token.address}-${token.chainId}`}
                    onClick={() => handleTokenSelect(token)}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 hover:bg-dark-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">
                        {token.logoURI}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">
                            {token.symbol}
                          </span>
                          <span className="text-xs bg-stellar-500/20 text-stellar-400 px-2 py-1 rounded">
                            {getChainName(token.chainId)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {token.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(token.address)
                        }}
                        className={`p-1 rounded transition-colors ${
                          favoriteTokens.includes(token.address)
                            ? 'text-yellow-400 hover:text-yellow-300'
                            : 'text-gray-500 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      
                      {token.chainId === 1 && (
                        <a
                          href={`https://etherscan.io/token/${token.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-stellar-400 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Custom Token */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => {
                  // Implementation for adding custom token
                  console.log('Add custom token')
                }}
                className="w-full text-stellar-400 hover:text-stellar-300 transition-colors font-medium text-sm"
              >
                + Add Custom Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}