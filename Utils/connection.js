import { Keypair, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
export function loadWalletKey(keypairFile) {
    const fs = require("fs");
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())));
}
export async function sendVersionedTx(connection, instructions, payer, signers) {
    let latestBlockhash = await connection.getLatestBlockhash();
    const messageLegacy = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
    }).compileToLegacyMessage();
    const transation = new VersionedTransaction(messageLegacy);
    transation.sign(signers);
    const signature = await connection.sendTransaction(transation);
    return signature;
}
