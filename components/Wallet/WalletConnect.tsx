import { useState, useEffect } from 'react'
import { 
  Wallet, 
  Copy, 
  ExternalLink, 
  LogOut, 
  RefreshCw, 
  Star,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { stellarTestnetService, StellarAccountInfo } from '@/lib/stellar-testnet'

interface WalletConnectProps {
  onConnect?: (account: StellarAccountInfo) => void
  onDisconnect?: () => void
  className?: string
}

export default function WalletConnect({ onConnect, onDisconnect, className = '' }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<StellarAccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secretKey, setSecretKey] = useState<string>('')
  const [showSecretInput, setShowSecretInput] = useState(false)

  // Check for existing wallet connection on mount
  useEffect(() => {
    const savedSecret = localStorage.getItem('stellarealize_wallet_secret')
    if (savedSecret) {
      connectWithSecret(savedSecret)
    }
  }, [])

  const connectWithSecret = async (secret: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate the secret key
      if (!secret || secret.length !== 56) {
        throw new Error('Invalid secret key format')
      }

      // Get account info
      const accountInfo = await stellarTestnetService.getAccountInfo(secret)
      if (!accountInfo) {
        throw new Error('Account not found or invalid')
      }

      setAccount(accountInfo)
      setSecretKey(secret)
      setIsConnected(true)
      localStorage.setItem('stellarealize_wallet_secret', secret)
      onConnect?.(accountInfo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
      setIsConnected(false)
      setAccount(null)
      setSecretKey('')
    } finally {
      setIsLoading(false)
    }
  }

  const createNewAccount = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newAccount = await stellarTestnetService.createTestnetAccount()
      await connectWithSecret(newAccount.secretKey)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAccount(null)
    setSecretKey('')
    setShowSecretInput(false)
    localStorage.removeItem('stellarealize_wallet_secret')
    onDisconnect?.()
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account.publicKey)
    }
  }

  const openExplorer = () => {
    if (account) {
      window.open(`https://stellar.expert/explorer/testnet/account/${account.publicKey}`, '_blank')
    }
  }

  const refreshBalance = async () => {
    if (account) {
      setIsLoading(true)
      try {
        const updatedAccount = await stellarTestnetService.getAccountInfo(account.publicKey)
        if (updatedAccount) {
          setAccount(updatedAccount)
        }
      } catch (err) {
        setError('Failed to refresh balance')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance)
    return (num / 10000000).toFixed(7) // Stellar has 7 decimal places
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && account) {
    return (
      <div className={`bg-dark-800 rounded-xl p-4 border border-stellar-500/20 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-stellar-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-stellar-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Stellar Account</p>
              <p className="text-white font-medium">{formatAddress(account.publicKey)}</p>
            </div>
          </div>
          <button
            onClick={disconnect}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">XLM Balance</span>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">
                {formatBalance(account.balance)} XLM
              </span>
              <button
                onClick={refreshBalance}
                disabled={isLoading}
                className="text-stellar-400 hover:text-stellar-300 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Sequence</span>
            <span className="text-white font-medium">{account.sequence}</span>
          </div>

          {account.balances.length > 1 && (
            <div className="pt-2 border-t border-dark-700">
              <p className="text-gray-400 text-sm mb-2">Other Assets</p>
              <div className="space-y-1">
                {account.balances
                  .filter(balance => balance.asset !== 'XLM')
                  .map((balance, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{balance.asset}</span>
                      <span className="text-white">{balance.balance}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <button
              onClick={copyAddress}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
            <button
              onClick={openExplorer}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Explorer</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-dark-800 rounded-xl p-4 border border-dark-700 ${className}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {showSecretInput ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stellar Secret Key
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your secret key"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-stellar-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => connectWithSecret(secretKey)}
              disabled={isLoading || !secretKey}
              className="flex-1 bg-stellar-500 hover:bg-stellar-600 disabled:bg-dark-700 disabled:text-gray-500 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Connect</span>
            </button>
            <button
              onClick={() => setShowSecretInput(false)}
              className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-stellar-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-stellar-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Connect Stellar Wallet</h3>
            <p className="text-gray-400 text-sm">
              Connect your Stellar account to start trading and bridging assets
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={createNewAccount}
              disabled={isLoading}
              className="w-full bg-stellar-500 hover:bg-stellar-600 disabled:bg-dark-700 disabled:text-gray-500 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Star className="w-4 h-4" />
              )}
              <span>Create Testnet Account</span>
            </button>
            
            <button
              onClick={() => setShowSecretInput(true)}
              className="w-full bg-dark-700 hover:bg-dark-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Import Existing Account</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Testnet accounts are funded with 10,000 XLM for testing
            </p>
          </div>
        </div>
      )}
    </div>
  )
}