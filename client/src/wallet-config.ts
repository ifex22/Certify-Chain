// ====== SECURE WALLET CONFIGURATION ======
// These addresses are hardcoded into the application build.
// To change the receiving wallets, edit the values below and redeploy the application.
// This provides better security than browser storage as it cannot be tampered with at runtime.

export const WALLET_CONFIG = {
  // Ethereum / EVM Compatible Wallet (Metamask)
  EVM_ADDRESS: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",

  // Solana Wallet (Phantom)
  SOLANA_ADDRESS: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",

  // Admin Security Token
  // CHANGE THIS TO A RANDOM STRING FOR BETTER SECURITY
  ADMIN_TOKEN: "34028" 
};
