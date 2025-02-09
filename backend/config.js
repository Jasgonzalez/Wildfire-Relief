require('dotenv').config();

module.exports = {
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
    DONATION_WALLET: process.env.DONATION_WALLET || "EUWx5bRum53rwfYKtBQzCZXjAEZCpgAr1n3FUCeM36h3"
};
