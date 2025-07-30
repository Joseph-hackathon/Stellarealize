import { useState, useEffect } from 'react'
import { ArrowUpDown, Settings, Zap, AlertTriangle, ExternalLink } from 'lucide-react'
import TokenSelector from './TokenSelector'
import { Token, SwapQuote } from '@/lib/types'
import { oneInchService, SUPPORTED_CHAINS } from '@/lib/oneInch'
import { stellarService } from '@/lib/stellar'

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [userBalance, setUserBalance] = useState<{ [address: string]: string }>({})

  // Default tokens
  const defaultFromToken: Token = {
    address: 'native',
    symbol: 'XLM',
    name: 'Stellar Lumens',
    decimals: 7,
    logoURI: '⭐',
    chainId: 0,
    isNative: true
  }

  const defaultToToken: Token = {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: '♦️',
    chainId: 1,
    isNative: true
  }

  useEffect(() => {
    setFromToken(defaultFromToken)
    setToToken(defaultToToken)
  }, [])

  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      getQuote()
    } else {
      setQuote(null)
      setToAmount('')
    }
  }, [fromToken, toToken, fromAmount, slippage])

  const getQuote = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) return

    setIsLoading(true)
    setError(null)

    try {
      // Check if this is a cross-chain swap
      if (fromToken.chainId !== toToken.chainId) {
        // Use Fusion+ API for cross-chain swaps
        const fusionQuote = await oneInchService.getFusionQuote({
          src: fromToken.address,
          dst: toToken.address,
          amount: oneInchService.parseAmount(fromAmount, fromToken.decimals),
          fromChainId: fromToken.chainId,
          toChainId: toToken.chainId
        })

        setQuote({
          inputAmount: fromAmount,
          outputAmount: oneInchService.formatAmount(fusionQuote.dstAmount, toToken.decimals),
          inputToken: fromToken,
          outputToken: toToken,
          priceImpact: 0.1, // Mock value
          fee: '0.3%',
          route: [
            {
              protocol: '1inch Fusion+',
              percentage: 100,
              fromToken,
              toToken
            }
          ],
          slippage
        })

        setToAmount(oneInchService.formatAmount(fusionQuote.dstAmount, toToken.decimals))
      } else if (fromToken.chainId === 0 && toToken.chainId === 0) {
        // Stellar native swap using built-in DEX
        // This is a mock implementation - in reality you'd call Stellar's pathfinding
        const mockRate = 0.1 + Math.random() * 0.02 // Mock exchange rate
        const outputAmount = (parseFloat(fromAmount) * mockRate).toString()
        
        setQuote({
          inputAmount: fromAmount,
          outputAmount,
          inputToken: fromToken,
          outputToken: toToken,
          priceImpact: 0.05,
          fee: '0.01%',
          route: [
            {
              protocol: 'Stellar DEX',
              percentage: 100,
              fromToken,
              toToken
            }
          ],
          slippage
        })

        setToAmount(outputAmount)
      } else {
        // Same-chain swap using 1inch
        const chainId = fromToken.chainId === 1 ? SUPPORTED_CHAINS.ETHEREUM : SUPPORTED_CHAINS.BSC
        
        const quoteResponse = await oneInchService.getQuote(chainId, {
          src: fromToken.address,
          dst: toToken.address,
          amount: oneInchService.parseAmount(fromAmount, fromToken.decimals)
        })

        const outputAmount = oneInchService.formatAmount(quoteResponse.dstAmount, toToken.decimals)
        
        setQuote({
          inputAmount: fromAmount,
          outputAmount,
          inputToken: fromToken,
          outputToken: toToken,
          priceImpact: oneInchService.calculatePriceImpact(fromAmount, outputAmount, 1),
          fee: '0.3%',
          route: [
            {
              protocol: '1inch',
              percentage: 100,
              fromToken,
              toToken
            }
          ],
          slippage
        })

        setToAmount(outputAmount)
      }
    } catch (err) {
      console.error('Quote error:', err)
      setError('Failed to get quote. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount('')
  }

  const handleSwap = async () => {
    if (!quote || !walletConnected) return

    setIsLoading(true)
    setError(null)

    try {
      if (fromToken?.chainId !== toToken?.chainId) {
        // Cross-chain swap
        console.log('Executing cross-chain swap...')
        // Implementation would involve calling Fusion+ API and handling bridge transactions
      } else if (fromToken?.chainId === 0) {
        // Stellar native swap
        console.log('Executing Stellar DEX swap...')
        // Implementation would involve calling Stellar DEX
      } else {
        // Same-chain swap using 1inch
        console.log('Executing 1inch swap...')
        // Implementation would involve calling 1inch swap API
      }
      
      // Mock success
      setTimeout(() => {
        alert('Swap executed successfully!')
        setFromAmount('')
        setToAmount('')
        setQuote(null)
        setIsLoading(false)
      }, 2000)
    } catch (err) {
      console.error('Swap error:', err)
      setError('Swap failed. Please try again.')
      setIsLoading(false)
    }
  }

  const getPriceImpactColor = (impact: number) => {
    if (impact < 1) return 'text-green-400'
    if (impact < 3) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatNumber = (num: string | number) => {
    const n = typeof num === 'string' ? parseFloat(num) : num
    if (n < 0.0001) return n.toExponential(2)
    return n.toFixed(6)
  }

  return (
    <div className="card-gradient p-6 rounded-2xl max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Cross-Chain Swap</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-400 hover:text-stellar-400 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-dark-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Slippage Tolerance</span>
            <span className="text-sm text-white">{slippage}%</span>
          </div>
          <div className="flex space-x-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  slippage === value
                    ? 'bg-stellar-500 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="mb-4">
        <TokenSelector
          selectedToken={fromToken}
          onTokenSelect={setFromToken}
          otherToken={toToken}
          label="From"
          showBalance={walletConnected}
          balance={userBalance[fromToken?.address || ''] || '0'}
        />
        <div className="mt-2">
          <input
            type="number"
            placeholder="0.00"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="w-full p-3 bg-dark-800 border border-gray-600 rounded-xl text-white text-lg font-semibold focus:border-stellar-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleSwapTokens}
          className="p-2 bg-dark-800 border border-gray-600 rounded-xl hover:border-stellar-500 transition-colors"
        >
          <ArrowUpDown className="w-5 h-5 text-stellar-400" />
        </button>
      </div>

      {/* To Token */}
      <div className="mb-6">
        <TokenSelector
          selectedToken={toToken}
          onTokenSelect={setToToken}
          otherToken={fromToken}
          label="To"
        />
        <div className="mt-2">
          <input
            type="number"
            placeholder="0.00"
            value={toAmount}
            readOnly
            className="w-full p-3 bg-dark-800 border border-gray-600 rounded-xl text-white text-lg font-semibold focus:outline-none cursor-not-allowed"
          />
        </div>
      </div>

      {/* Quote Information */}
      {quote && (
        <div className="mb-6 p-4 bg-dark-800/50 rounded-xl space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Rate</span>
            <span className="text-white">
              1 {quote.inputToken.symbol} = {formatNumber(parseFloat(quote.outputAmount) / parseFloat(quote.inputAmount))} {quote.outputToken.symbol}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Price Impact</span>
            <span className={getPriceImpactColor(quote.priceImpact)}>
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Fee</span>
            <span className="text-white">{quote.fee}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Route</span>
            <span className="text-white text-sm">
              {quote.route.map(r => r.protocol).join(' → ')}
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Cross-Chain Warning */}
      {fromToken && toToken && fromToken.chainId !== toToken.chainId && (
        <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Cross-Chain Swap</span>
          </div>
          <p className="text-yellow-200 text-sm">
            This swap will bridge tokens between different networks. Estimated time: 10-30 minutes.
          </p>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={walletConnected ? handleSwap : () => setWalletConnected(true)}
        disabled={isLoading || !quote || (walletConnected && (!fromAmount || parseFloat(fromAmount) <= 0))}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : walletConnected
            ? 'btn-primary hover:scale-105'
            : 'bg-stellar-500 hover:bg-stellar-600 text-white hover:scale-105'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>
              {quote ? 'Swapping...' : 'Getting Quote...'}
            </span>
          </div>
        ) : walletConnected ? (
          <>
            <Zap className="w-5 h-5 inline mr-2" />
            Swap Tokens
          </>
        ) : (
          'Connect Wallet'
        )}
      </button>

      {/* Powered by */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span>Powered by</span>
          <a
            href="https://1inch.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stellar-400 hover:text-stellar-300 transition-colors flex items-center space-x-1"
          >
            <span>1inch</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>&</span>
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stellar-400 hover:text-stellar-300 transition-colors flex items-center space-x-1"
          >
            <span>Stellar</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}