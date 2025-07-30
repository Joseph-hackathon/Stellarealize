/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    STELLAR_NETWORK: process.env.NODE_ENV === 'production' ? 'MAINNET' : 'TESTNET',
    STELLAR_RPC_URL: process.env.NODE_ENV === 'production' 
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org',
    SOROBAN_RPC_URL: process.env.NODE_ENV === 'production'
      ? 'https://soroban-rpc.mainnet.stellar.gateway.fm'
      : 'https://soroban-testnet.stellar.org',
  },
  images: {
    domains: ['cdn.jsdelivr.net', 'raw.githubusercontent.com']
  }
}

module.exports = nextConfig