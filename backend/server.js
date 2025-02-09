const express = require('express');
const cors = require('cors');
const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');
const { SOLANA_RPC_URL, DONATION_WALLET } = require('./config');

const app = express();
app.use(cors());
app.use(express.json());

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// ✅ Handle donations
app.post('/donate', async (req, res) => {
    try {
        const { privateKey, amount } = req.body;
        if (!privateKey || !amount) {
            return res.status(400).json({ status: 'error', message: 'Missing private key or amount' });
        }

        const sender = Keypair.fromSecretKey(Buffer.from(privateKey, 'base64'));
        const recipient = new PublicKey(DONATION_WALLET);
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: sender.publicKey,
                toPubkey: recipient,
                lamports: amount * 1e9
            })
        );

        const signature = await connection.sendTransaction(transaction, [sender]);
        res.json({ status: 'success', tx_id: signature });
    } catch (error) {
        console.error('Error processing donation:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// ✅ Fetch recent donations (Mock Data)
app.get('/recent_donations', (req, res) => {
    res.json([
        { donor: "Alice", amount: 2.5, time: "5 mins ago" },
        { donor: "Bob", amount: 1.0, time: "10 mins ago" },
    ]);
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
