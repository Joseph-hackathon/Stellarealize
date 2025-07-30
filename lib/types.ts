// Stellar types
export interface StellarAccount {
  publicKey: string;
  balance: string;
  sequence: string;
  subentryCount: number;
  thresholds: {
    low: number;
    med: number;
    high: number;
  };
  flags: {
    authRequired: boolean;
    authRevocable: boolean;
    authImmutable: boolean;
  };
  balances: Balance[];
}

export interface Balance {
  asset: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
}

export interface Payment {
  id: string;
  type: 'payment' | 'create_account';
  from: string;
  to: string;
  asset: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  memo?: string;
}

// Cross-chain bridge types
export interface BridgeTransaction {
  id: string;
  sourceChain: string;
  destinationChain: string;
  sourceToken: string;
  destinationToken: string;
  amount: string;
  sender: string;
  recipient: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sourceTxHash?: string;
  destinationTxHash?: string;
  timestamp: number;
  estimatedTime?: number;
  fee: string;
}

// Swap types
export interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  inputToken: Token;
  outputToken: Token;
  priceImpact: number;
  fee: string;
  route: SwapRoute[];
  estimatedGas?: string;
  slippage: number;
}

export interface SwapRoute {
  protocol: string;
  percentage: number;
  fromToken: Token;
  toToken: Token;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  isNative?: boolean;
}

// TVL and Analytics types
export interface TVLData {
  total: number;
  chains: { [chainId: number]: number };
  protocols: { [protocol: string]: number };
  timestamp: number;
}

export interface VolumeData {
  volume24h: number;
  volume7d: number;
  volume30d: number;
  volumeChange24h: number;
  transactions24h: number;
  timestamp: number;
}

export interface PriceData {
  current: number;
  change24h: number;
  change7d: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap?: number;
  timestamp: number;
}

// Dashboard types
export interface DashboardStats {
  totalTVL: number;
  totalVolume24h: number;
  totalTransactions: number;
  uniqueUsers: number;
  stellarTVL: number;
  crossChainVolume: number;
  averageTransactionValue: number;
  topTokens: TokenStats[];
  topPairs: TradingPair[];
  recentTransactions: TransactionHistory[];
}

export interface TokenStats {
  token: Token;
  tvl: number;
  volume24h: number;
  priceChange24h: number;
  transactions24h: number;
}

export interface TradingPair {
  tokenA: Token;
  tokenB: Token;
  volume24h: number;
  tvl: number;
  apr: number;
  transactions24h: number;
}

export interface TransactionHistory {
  id: string;
  type: 'swap' | 'bridge' | 'add_liquidity' | 'remove_liquidity';
  hash: string;
  from: string;
  to?: string;
  amount: string;
  token: Token;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  fee: string;
  gasUsed?: string;
}

// Stellar ecosystem types
export interface StellarEcosystemStats {
  totalAccounts: number;
  totalTransactions: number;
  ledgerVersion: number;
  feePool: number;
  baseReserve: number;
  lumensSupply: number;
  sorobanContracts: number;
  activeValidators: number;
}

export interface StellarDEXStats {
  totalTrades24h: number;
  totalVolume24h: number;
  activePairs: number;
  topAssets: StellarAsset[];
  recentTrades: StellarTrade[];
}

export interface StellarAsset {
  code: string;
  issuer: string;
  domain?: string;
  volume24h: number;
  trades24h: number;
  price: number;
  change24h: number;
}

export interface StellarTrade {
  id: string;
  timestamp: number;
  type: 'buy' | 'sell';
  baseAsset: StellarAsset;
  counterAsset: StellarAsset;
  baseAmount: string;
  counterAmount: string;
  price: string;
  account: string;
}

// Wallet types
export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  balance: Balance[];
  networkType: 'testnet' | 'mainnet';
}

export interface WalletProvider {
  name: string;
  icon: string;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  isInstalled: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  period: '1h' | '24h' | '7d' | '30d' | '1y';
  data: ChartDataPoint[];
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark';
  currency: 'USD' | 'EUR' | 'KRW';
  language: 'en' | 'ko';
  notifications: {
    trades: boolean;
    priceAlerts: boolean;
    system: boolean;
  };
  slippageTolerance: number;
  gasPreference: 'fast' | 'standard' | 'slow';
}

// Network types
export interface NetworkConfig {
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
  logoUrl: string;
  isTestnet: boolean;
}

export interface StellarNetworkConfig {
  networkPassphrase: string;
  horizonUrl: string;
  sorobanUrl: string;
  friendbotUrl?: string;
  isTestnet: boolean;
}