import fs from 'fs';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, percentAmount,keypairIdentity } from '@metaplex-foundation/umi';
import {
  createNft,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';

// Initialize UMI with the necessary plugins
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata());

// Load wallet keypair
const walletPath = '/home/gitpod/.config/solana/id.json';
const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));

// Set up identity with the keypair
umi.use(keypairIdentity(keypair)); // Ensure `keypairIdentity` is defined or imported

async function main() {
  // Generate a signer for the new mint
  const mint = generateSigner(umi);

  // Create a new NFT
  await createNft(umi, {
    mint,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: percentAmount(5.5),
  }).sendAndConfirm(umi);

  // Fetch the newly created digital asset
  const asset = await fetchDigitalAsset(umi, mint.publicKey);
  console.log('Asset fetched:', asset);
}

main().catch(console.error);
