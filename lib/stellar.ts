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
  nativeToScVal
} from '@stellar/stellar-sdk';

// Network configuration
export const STELLAR_NETWORKS = {
  TESTNET: {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org'
  },
  MAINNET: {
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://soroban-rpc.mainnet.stellar.gateway.fm'
  }
};

export const getCurrentNetwork = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? STELLAR_NETWORKS.MAINNET : STELLAR_NETWORKS.TESTNET;
};

export class StellarService {
  private server: Server;
  private sorobanServer: SorobanRpc.Server;
  private network: typeof STELLAR_NETWORKS.TESTNET;

  constructor() {
    this.network = getCurrentNetwork();
    this.server = new Server(this.network.horizonUrl);
    this.sorobanServer = new SorobanRpc.Server(this.network.sorobanUrl);
  }

  // Account management
  async createAccount(): Promise<{ publicKey: string; secretKey: string }> {
    const keypair = Keypair.random();
    
    if (this.network === STELLAR_NETWORKS.TESTNET) {
      // Fund account on testnet
      try {
        await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(keypair.publicKey())}`);
      } catch (error) {
        console.error('Failed to fund account:', error);
      }
    }

    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  }

  async getAccountInfo(publicKey: string) {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account;
    } catch (error) {
      console.error('Account not found:', error);
      return null;
    }
  }

  async getAccountBalance(publicKey: string) {
    try {
      const account = await this.getAccountInfo(publicKey);
      if (!account) return [];

      return account.balances.map(balance => ({
        asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
        balance: balance.balance,
        limit: balance.limit || null
      }));
    } catch (error) {
      console.error('Failed to get balance:', error);
      return [];
    }
  }

  // Payment operations
  async sendPayment(
    senderSecret: string,
    receiverPublicKey: string,
    amount: string,
    asset: Asset = Asset.native(),
    memo?: string
  ) {
    try {
      const senderKeypair = Keypair.fromSecret(senderSecret);
      const sender = await this.server.loadAccount(senderKeypair.publicKey());

      const transactionBuilder = new TransactionBuilder(sender, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase,
      });

      transactionBuilder.addOperation(
        Operation.payment({
          destination: receiverPublicKey,
          asset: asset,
          amount: amount,
        })
      );

      if (memo) {
        transactionBuilder.addMemo(Memo.text(memo));
      }

      const transaction = transactionBuilder.setTimeout(30).build();
      transaction.sign(senderKeypair);

      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }

  // Soroban contract interactions
  async deployContract(wasmHash: string, deployer: string) {
    try {
      const account = await this.server.loadAccount(deployer);
      
      const contract = new Contract(wasmHash);
      const operation = contract.getFootprint();
      
      // This is a simplified deployment - actual implementation would be more complex
      return { contractId: 'deployed-contract-id' };
    } catch (error) {
      console.error('Contract deployment failed:', error);
      throw error;
    }
  }

  async callContract(
    contractId: string,
    method: string,
    args: any[] = [],
    caller?: string
  ) {
    try {
      const contract = new Contract(contractId);
      
      // Build the operation
      const operation = contract.call(method, ...args.map(arg => nativeToScVal(arg)));
      
      if (caller) {
        const account = await this.server.loadAccount(caller);
        const transaction = new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase: this.network.networkPassphrase,
        })
          .addOperation(operation)
          .setTimeout(30)
          .build();

        const result = await this.sorobanServer.simulateTransaction(transaction);
        return result;
      } else {
        // Read-only call
        const result = await this.sorobanServer.simulateTransaction(
          new TransactionBuilder(new Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'), {
            fee: BASE_FEE,
            networkPassphrase: this.network.networkPassphrase,
          })
            .addOperation(operation)
            .setTimeout(30)
            .build()
        );
        return result;
      }
    } catch (error) {
      console.error('Contract call failed:', error);
      throw error;
    }
  }

  // Cross-chain bridge helpers
  async bridgeToEthereum(stellarAsset: string, amount: string, ethAddress: string) {
    // This would integrate with a cross-chain bridge contract
    // Placeholder implementation
    return {
      stellarTxId: 'stellar-bridge-tx',
      ethTxId: 'eth-bridge-tx',
      amount,
      status: 'pending'
    };
  }

  async bridgeFromEthereum(ethTxHash: string, stellarAddress: string) {
    // This would listen for Ethereum events and process on Stellar
    // Placeholder implementation
    return {
      stellarTxId: 'stellar-receive-tx',
      status: 'completed'
    };
  }

  // DEX operations
  async createTradingPair(
    sellingAsset: Asset,
    buyingAsset: Asset,
    price: string,
    amount: string,
    traderSecret: string
  ) {
    try {
      const traderKeypair = Keypair.fromSecret(traderSecret);
      const trader = await this.server.loadAccount(traderKeypair.publicKey());

      const transaction = new TransactionBuilder(trader, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase,
      })
        .addOperation(
          Operation.manageSellOffer({
            selling: sellingAsset,
            buying: buyingAsset,
            amount: amount,
            price: price,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(traderKeypair);
      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Trading pair creation failed:', error);
      throw error;
    }
  }

  async getOrderbook(sellingAsset: Asset, buyingAsset: Asset) {
    try {
      const orderbook = await this.server.orderbook(sellingAsset, buyingAsset).call();
      return orderbook;
    } catch (error) {
      console.error('Failed to get orderbook:', error);
      throw error;
    }
  }

  // Streaming operations
  streamPayments(accountId: string, onPayment: (payment: any) => void) {
    return this.server.payments()
      .forAccount(accountId)
      .cursor('now')
      .stream({
        onmessage: onPayment,
        onerror: (error) => console.error('Stream error:', error)
      });
  }

  streamTrades(onTrade: (trade: any) => void) {
    return this.server.trades()
      .cursor('now')
      .stream({
        onmessage: onTrade,
        onerror: (error) => console.error('Trade stream error:', error)
      });
  }
}

export const stellarService = new StellarService();