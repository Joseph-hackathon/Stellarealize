import axios, { AxiosInstance } from 'axios';

// 1inch API configuration
const ONE_INCH_API_BASE = 'https://api.1inch.dev';
const API_VERSION = 'v6.0';

export interface SwapParams {
  src: string;
  dst: string;
  amount: string;
  from: string;
  slippage: number;
  protocols?: string;
  fee?: number;
  gasPrice?: string;
  complexityLevel?: number;
  connectorTokens?: string;
  allowPartialFill?: boolean;
  disableEstimate?: boolean;
  usePatching?: boolean;
}

export interface QuoteParams {
  src: string;
  dst: string;
  amount: string;
  protocols?: string;
  fee?: number;
  gasPrice?: string;
  complexityLevel?: number;
  connectorTokens?: string;
  mainRouteParts?: number;
  parts?: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapResponse {
  dstAmount: string;
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: number;
  };
  protocols: any[][];
}

export interface QuoteResponse {
  dstAmount: string;
  protocols: any[][];
  estimatedGas: number;
}

export interface HistoryTransaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  status: 'success' | 'failed';
  tokenIn?: Token;
  tokenOut?: Token;
  amountIn?: string;
  amountOut?: string;
}

export class OneInchService {
  private api: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
    this.api = axios.create({
      baseURL: ONE_INCH_API_BASE,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Swap API methods
  async getSwap(chainId: number, params: SwapParams): Promise<SwapResponse> {
    try {
      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/swap`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Swap request failed:', error);
      throw new Error(`Swap failed: ${error}`);
    }
  }

  async getQuote(chainId: number, params: QuoteParams): Promise<QuoteResponse> {
    try {
      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/quote`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Quote request failed:', error);
      throw new Error(`Quote failed: ${error}`);
    }
  }

  async getTokens(chainId: number): Promise<{ [address: string]: Token }> {
    try {
      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/tokens`);
      return response.data.tokens;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      throw new Error(`Get tokens failed: ${error}`);
    }
  }

  async getProtocols(chainId: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/liquidity-sources`);
      return response.data.protocols;
    } catch (error) {
      console.error('Failed to get protocols:', error);
      throw new Error(`Get protocols failed: ${error}`);
    }
  }

  async getSpender(chainId: number): Promise<string> {
    try {
      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/approve/spender`);
      return response.data.address;
    } catch (error) {
      console.error('Failed to get spender:', error);
      throw new Error(`Get spender failed: ${error}`);
    }
  }

  async getApprove(
    chainId: number,
    tokenAddress: string,
    amount?: string
  ): Promise<{ data: string; gasPrice: string; to: string; value: string }> {
    try {
      const params: any = { tokenAddress };
      if (amount) params.amount = amount;

      const response = await this.api.get(`/swap/${API_VERSION}/${chainId}/approve/transaction`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get approve transaction:', error);
      throw new Error(`Get approve failed: ${error}`);
    }
  }

  // History API methods
  async getTransactionHistory(
    chainId: number,
    address: string,
    page: number = 1,
    limit: number = 100
  ): Promise<HistoryTransaction[]> {
    try {
      const response = await this.api.get(`/history/${API_VERSION}/${chainId}/history`, {
        params: {
          address,
          page,
          limit
        }
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw new Error(`Get history failed: ${error}`);
    }
  }

  async getTransactionStatus(chainId: number, txHash: string): Promise<any> {
    try {
      const response = await this.api.get(`/history/${API_VERSION}/${chainId}/transaction/${txHash}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw new Error(`Get transaction status failed: ${error}`);
    }
  }

  // Fusion+ API for cross-chain swaps
  async getFusionQuote(params: {
    src: string;
    dst: string;
    amount: string;
    fromChainId: number;
    toChainId: number;
  }): Promise<any> {
    try {
      const response = await this.api.post('/fusion-plus/quote', params);
      return response.data;
    } catch (error) {
      console.error('Fusion quote failed:', error);
      throw new Error(`Fusion quote failed: ${error}`);
    }
  }

  async getFusionSwap(params: {
    src: string;
    dst: string;
    amount: string;
    fromChainId: number;
    toChainId: number;
    from: string;
    receiver?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post('/fusion-plus/swap', params);
      return response.data;
    } catch (error) {
      console.error('Fusion swap failed:', error);
      throw new Error(`Fusion swap failed: ${error}`);
    }
  }

  // Utility methods
  formatAmount(amount: string, decimals: number): string {
    const factor = Math.pow(10, decimals);
    return (parseFloat(amount) / factor).toString();
  }

  parseAmount(amount: string, decimals: number): string {
    const factor = Math.pow(10, decimals);
    return (parseFloat(amount) * factor).toString();
  }

  calculatePriceImpact(amountIn: string, amountOut: string, price: number): number {
    const expectedOut = parseFloat(amountIn) * price;
    const actualOut = parseFloat(amountOut);
    return ((expectedOut - actualOut) / expectedOut) * 100;
  }
}

// Supported chain IDs
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  GNOSIS: 100,
  AVALANCHE: 43114,
  FANTOM: 250,
  KLAYTN: 8217,
  AURORA: 1313161554,
  ZK_SYNC_ERA: 324,
  BASE: 8453,
};

// Create service instance
export const oneInchService = new OneInchService(process.env.NEXT_PUBLIC_ONE_INCH_API_KEY || '');