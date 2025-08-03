import {
  Server,
  Keypair,
  Account,
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  Memo,
  BASE_FEE,
  Contract,
  SorobanRpc,
  xdr,
  Address,
  scValToNative,
  nativeToScVal,
  TimeoutInfinite,
  Transaction
} from '@stellar/stellar-sdk';

// Stellar Network Configuration
export const STELLAR_NETWORKS = {
  TESTNET: {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org',
    friendbotUrl: 'https://friendbot.stellar.org'
  },
  MAINNET: {
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://soroban-rpc.mainnet.stellar.gateway.fm'
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
  private sorobanServer: SorobanRpc.Server;
  private network: StellarNetworkConfig;

  constructor(useTestnet: boolean = true) {
    this.network = useTestnet ? STELLAR_NETWORKS.TESTNET : STELLAR_NETWORKS.MAINNET;
    this.server = new Server(this.network.horizonUrl);
    this.sorobanServer = new SorobanRpc.Server(this.network.sorobanUrl);
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
        subentryCount: account.subentryCount(),
        thresholds: {
          low: account.thresholds().low,
          med: account.thresholds().med,
          high: account.thresholds().high
        },
        flags: {
          authRequired: account.flags().authRequired(),
          authRevocable: account.flags().authRevocable(),
          authImmutable: account.flags().authImmutable()
        },
        balances: account.balances.map(balance => ({
          asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
          balance: balance.balance,
          limit: balance.limit || undefined
        }))
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
        fee: response.feeCharged,
        status: 'success'
      };
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }

  // Smart Contract Operations (Soroban)
  async deployContract(
    wasmHash: string,
    deployerSecret: string,
    initArgs: any[] = []
  ): Promise<{ contractId: string; transactionHash: string }> {
    try {
      const deployerKeypair = Keypair.fromSecret(deployerSecret);
      const deployerAccount = await this.server.loadAccount(deployerKeypair.publicKey());

      // Create the deploy contract operation
      const deployContractOp = Operation.deployContract({
        wasmHash: wasmHash
      });

      const transaction = new TransactionBuilder(deployerAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(deployContractOp)
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(deployerKeypair);

      const response = await this.server.submitTransaction(transaction);
      
      // Extract contract ID from the response
      const contractId = response.resultMetaXdr?.v3()?.sorobanMeta()?.returnVal()?.address()?.contractId()?.toString('hex');

      if (!contractId) {
        throw new Error('Failed to extract contract ID from transaction response');
      }

      return {
        contractId: contractId,
        transactionHash: response.hash
      };
    } catch (error) {
      console.error('Contract deployment failed:', error);
      throw error;
    }
  }

  async callContract(
    contractId: string,
    method: string,
    args: any[] = [],
    callerSecret?: string
  ): Promise<any> {
    try {
      const callerKeypair = callerSecret ? Keypair.fromSecret(callerSecret) : Keypair.random();
      const callerAccount = await this.server.loadAccount(callerKeypair.publicKey());

      // Convert arguments to Stellar XDR format
      const xdrArgs = args.map(arg => nativeToScVal(arg));

      // Create the invoke contract operation
      const invokeContractOp = Operation.invokeHostFunction({
        hostFunction: xdr.HostFunction.hostFunctionTypeInvokeContract(),
        auth: [],
        args: xdrArgs
      });

      const transaction = new TransactionBuilder(callerAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(invokeContractOp)
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(callerKeypair);

      const response = await this.server.submitTransaction(transaction);
      
      // Parse the result
      const result = response.resultMetaXdr?.v3()?.sorobanMeta()?.returnVal();
      if (result) {
        return scValToNative(result);
      }

      return null;
    } catch (error) {
      console.error('Contract call failed:', error);
      throw error;
    }
  }

  // Cross-Chain Bridge Operations
  async bridgeToEthereum(
    stellarAsset: string,
    amount: string,
    ethAddress: string,
    senderSecret: string
  ): Promise<StellarTransaction> {
    try {
      // This would integrate with a bridge contract
      const bridgeContractId = process.env.STELLAR_BRIDGE_CONTRACT_ID;
      
      if (!bridgeContractId) {
        throw new Error('Bridge contract not configured');
      }

      const senderKeypair = Keypair.fromSecret(senderSecret);
      const senderAccount = await this.server.loadAccount(senderKeypair.publicKey());

      // Create bridge transaction
      const bridgeOp = Operation.invokeHostFunction({
        hostFunction: xdr.HostFunction.hostFunctionTypeInvokeContract(),
        auth: [],
        args: [
          nativeToScVal(bridgeContractId),
          nativeToScVal('bridge_to_ethereum'),
          nativeToScVal(stellarAsset),
          nativeToScVal(amount),
          nativeToScVal(ethAddress)
        ]
      });

      const transaction = new TransactionBuilder(senderAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(bridgeOp)
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(senderKeypair);

      const response = await this.server.submitTransaction(transaction);

      return {
        id: response.hash,
        type: 'payment',
        from: senderKeypair.publicKey(),
        asset: stellarAsset,
        amount: amount,
        timestamp: new Date().toISOString(),
        transactionHash: response.hash,
        memo: `Bridge to ETH: ${ethAddress}`,
        fee: response.feeCharged,
        status: 'success'
      };
    } catch (error) {
      console.error('Bridge to Ethereum failed:', error);
      throw error;
    }
  }

  async bridgeFromEthereum(
    ethTxHash: string,
    stellarAddress: string,
    recipientSecret: string
  ): Promise<StellarTransaction> {
    try {
      // This would verify the Ethereum transaction and release funds on Stellar
      const bridgeContractId = process.env.STELLAR_BRIDGE_CONTRACT_ID;
      
      if (!bridgeContractId) {
        throw new Error('Bridge contract not configured');
      }

      const recipientKeypair = Keypair.fromSecret(recipientSecret);
      const recipientAccount = await this.server.loadAccount(recipientKeypair.publicKey());

      // Verify and claim bridge transaction
      const claimOp = Operation.invokeHostFunction({
        hostFunction: xdr.HostFunction.hostFunctionTypeInvokeContract(),
        auth: [],
        args: [
          nativeToScVal(bridgeContractId),
          nativeToScVal('claim_from_ethereum'),
          nativeToScVal(ethTxHash),
          nativeToScVal(stellarAddress)
        ]
      });

      const transaction = new TransactionBuilder(recipientAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase
      })
        .addOperation(claimOp)
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(recipientKeypair);

      const response = await this.server.submitTransaction(transaction);

      return {
        id: response.hash,
        type: 'payment',
        from: 'Bridge Contract',
        to: stellarAddress,
        asset: 'XLM',
        amount: '0', // Amount would be determined by bridge contract
        timestamp: new Date().toISOString(),
        transactionHash: response.hash,
        memo: `Bridge from ETH: ${ethTxHash}`,
        fee: response.feeCharged,
        status: 'success'
      };
    } catch (error) {
      console.error('Bridge from Ethereum failed:', error);
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
        fee: response.feeCharged,
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
  streamPayments(accountId: string, onPayment: (payment: StellarTransaction) => void): () => void {
    const eventSource = this.server.payments().forAccount(accountId).cursor('now').stream({
      onmessage: (message) => {
        const payment = message.data;
        onPayment({
          id: payment.id,
          type: payment.type,
          from: payment.from,
          to: payment.to,
          asset: payment.asset,
          amount: payment.amount,
          timestamp: payment.created_at,
          transactionHash: payment.transaction_hash,
          memo: payment.memo,
          fee: payment.fee_charged,
          status: 'success'
        });
      }
    });

    return () => eventSource.close();
  }

  streamTrades(onTrade: (trade: any) => void): () => void {
    const eventSource = this.server.trades().cursor('now').stream({
      onmessage: (message) => {
        onTrade(message.data);
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