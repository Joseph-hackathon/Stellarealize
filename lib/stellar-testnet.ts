import {
  Keypair,
  Account,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Memo,
  BASE_FEE,
  Contract,
  xdr,
  Address,
  scValToNative,
  nativeToScVal,
  TimeoutInfinite,
  Transaction
} from '@stellar/stellar-sdk';
import { HorizonServer as Server } from '@stellar/stellar-sdk/lib/horizon/server';
import { Server as SorobanServer } from '@stellar/stellar-sdk/lib/rpc';

// Stellar Network Configuration
export const STELLAR_NETWORKS = {
  TESTNET: {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org',
    friendbotUrl: 'https://friendbot.stellar.org',
    isTestnet: true
  },
  MAINNET: {
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://soroban-rpc.mainnet.stellar.gateway.fm',
    isTestnet: false
  }
};

export interface StellarNetworkConfig {
  networkPassphrase: string;
  horizonUrl: string;
  sorobanUrl: string;
  friendbotUrl?: string;
  isTestnet: boolean;
}

export interface StellarAccountInfo {
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
  balances: Array<{
    asset: string;
    balance: string;
    limit?: string;
  }>;
}

export interface StellarTransaction {
  id: string;
  type: 'payment' | 'create_account' | 'manage_data' | 'set_options';
  from: string;
  to?: string;
  asset: string;
  amount: string;
  timestamp: string;
  transactionHash: string;
  memo?: string;
  fee: string;
  status: 'success' | 'pending' | 'failed';
}

export class StellarTestnetService {
  private server: Server;
  private sorobanServer: SorobanServer;
  private network: StellarNetworkConfig;

  constructor(useTestnet: boolean = true) {
    this.network = useTestnet ? STELLAR_NETWORKS.TESTNET : STELLAR_NETWORKS.MAINNET;
    this.server = new Server(this.network.horizonUrl);
    this.sorobanServer = new SorobanServer(this.network.sorobanUrl);
  }

  // Account Management
  async createTestnetAccount(): Promise<{ publicKey: string; secretKey: string }> {
    const keypair = Keypair.random();
    
    if (this.network.isTestnet && this.network.friendbotUrl) {
      try {
        const response = await fetch(
          `${this.network.friendbotUrl}?addr=${encodeURIComponent(keypair.publicKey())}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fund account on testnet');
        }
        
        console.log('Account funded successfully on testnet');
      } catch (error) {
        console.error('Failed to fund account:', error);
        throw error;
      }
    }

    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  }

  async getAccountInfo(publicKey: string): Promise<StellarAccountInfo | null> {
    try {
      const account = await this.server.loadAccount(publicKey);
      
      return {
        publicKey: account.accountId(),
        balance: account.balances.find(b => b.asset_type === 'native')?.balance || '0',
        sequence: account.sequenceNumber(),
        subentryCount: account.subentry_count,
        thresholds: {
          low: account.thresholds.low_threshold,
          med: account.thresholds.med_threshold,
          high: account.thresholds.high_threshold
        },
        flags: {
          authRequired: account.flags.auth_required,
          authRevocable: account.flags.auth_revocable,
          authImmutable: account.flags.auth_immutable
        },
        balances: account.balances.map(balance => {
          let asset = 'XLM';
          if (balance.asset_type !== 'native' && 'asset_code' in balance) {
            asset = `${balance.asset_code}:${balance.asset_issuer}`;
          }
          return {
            asset,
            balance: balance.balance,
            limit: 'limit' in balance ? balance.limit : undefined
          };
        })
      };
    } catch (error) {
      console.error('Account not found:', error);
      return null;
    }
  }

  async getAccountBalance(publicKey: string): Promise<Array<{ asset: string; balance: string; limit?: string }>> {
    try {
      const account = await this.getAccountInfo(publicKey);
      if (!account) return [];

      return account.balances;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return [];
    }
  }

  // Payment Operations
  async sendPayment(
    senderSecret: string,
    receiverPublicKey: string,
    amount: string,
    asset: Asset = Asset.native(),
    memo?: string
  ): Promise<StellarTransaction> {
    try {
      const senderKeypair = Keypair.fromSecret(senderSecret);
      const senderAccount = await this.server.loadAccount(senderKeypair.publicKey());

      const transaction = new TransactionBuilder(senderAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(
          Operation.payment({
            destination: receiverPublicKey,
            asset: asset,
            amount: amount
          })
        )
        .addMemo(memo ? Memo.text(memo) : Memo.none())
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(senderKeypair);

      const response = await this.server.submitTransaction(transaction);

      return {
        id: response.hash,
        type: 'payment',
        from: senderKeypair.publicKey(),
        to: receiverPublicKey,
        asset: asset.isNative() ? 'XLM' : `${asset.getCode()}:${asset.getIssuer()}`,
        amount: amount,
        timestamp: new Date().toISOString(),
        transactionHash: response.hash,
        memo: memo,
        fee: BASE_FEE,
        status: 'success'
      };
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }

  // DEX Operations
  async createTradingPair(
    sellingAsset: Asset,
    buyingAsset: Asset,
    price: string,
    amount: string,
    traderSecret: string
  ): Promise<StellarTransaction> {
    try {
      const traderKeypair = Keypair.fromSecret(traderSecret);
      const traderAccount = await this.server.loadAccount(traderKeypair.publicKey());

      // Create manage sell offer operation
      const manageSellOfferOp = Operation.manageSellOffer({
        selling: sellingAsset,
        buying: buyingAsset,
        amount: amount,
        price: price,
        offerId: '0' // New offer
      });

      const transaction = new TransactionBuilder(traderAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(manageSellOfferOp)
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(traderKeypair);

      const response = await this.server.submitTransaction(transaction);

      return {
        id: response.hash,
        type: 'payment',
        from: traderKeypair.publicKey(),
        asset: `${sellingAsset.getCode()}:${buyingAsset.getCode()}`,
        amount: amount,
        timestamp: new Date().toISOString(),
        transactionHash: response.hash,
        memo: `Create trading pair: ${sellingAsset.getCode()}/${buyingAsset.getCode()}`,
        fee: BASE_FEE,
        status: 'success'
      };
    } catch (error) {
      console.error('Create trading pair failed:', error);
      throw error;
    }
  }

  async getOrderbook(sellingAsset: Asset, buyingAsset: Asset): Promise<any> {
    try {
      const orderbook = await this.server.orderbook(sellingAsset, buyingAsset).call();
      return orderbook;
    } catch (error) {
      console.error('Failed to get orderbook:', error);
      throw error;
    }
  }

  // Real-time Data Streaming
  streamPayments(accountId: string, onPayment: (payment: any) => void): () => void {
    const eventSource = this.server.payments().forAccount(accountId).cursor('now').stream({
      onmessage: (message) => {
        onPayment(message);
      }
    });

    return () => eventSource.close();
  }

  streamTrades(onTrade: (trade: any) => void): () => void {
    const eventSource = this.server.trades().cursor('now').stream({
      onmessage: (message) => {
        onTrade(message);
      }
    });

    return () => eventSource.close();
  }

  // Network Information
  async getNetworkInfo(): Promise<{
    ledgerVersion: number;
    baseFee: number;
    baseReserve: number;
    networkPassphrase: string;
  }> {
    try {
      const serverInfo = await this.server.loadAccount('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
      const ledger = await this.server.ledgers().order('desc').limit(1).call();
      
      return {
        ledgerVersion: parseInt(ledger.records[0].sequence),
        baseFee: BASE_FEE,
        baseReserve: 1, // Stellar base reserve
        networkPassphrase: this.network.networkPassphrase
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }

  // Utility Methods
  async waitForTransaction(transactionHash: string, timeout: number = 30000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const transaction = await this.server.transactions().transaction(transactionHash).call();
        if (transaction.successful) {
          return true;
        }
      } catch (error) {
        // Transaction not found yet, continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }

  validateStellarAddress(address: string): boolean {
    try {
      Keypair.fromPublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  formatStellarAmount(amount: string, decimals: number = 7): string {
    const num = parseFloat(amount);
    return (num / Math.pow(10, decimals)).toFixed(decimals);
  }

  parseStellarAmount(amount: string, decimals: number = 7): string {
    const num = parseFloat(amount);
    return Math.floor(num * Math.pow(10, decimals)).toString();
  }
}

// Export singleton instance
export const stellarTestnetService = new StellarTestnetService(true);
export const stellarMainnetService = new StellarTestnetService(false);