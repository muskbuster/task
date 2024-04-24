import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum, fetchMerkleTree, createTree, mintToCollectionV1, parseLeafFromMintToCollectionV1Transaction,parseLeafFromMintV1Transaction, findLeafAssetIdPda, mintV1 } from '@metaplex-foundation/mpl-bubblegum';
import { keypairIdentity, generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import fs from 'fs';
// Use the RPC endpoint of your choice.
async function main() {
    const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum());
    const wallet = '/home/gitpod/.config/solana/id.json';
    const secretKey = JSON.parse(fs.readFileSync(wallet, 'utf-8'));
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
    umi.use(keypairIdentity(keypair));

    const merkleTree = generateSigner(umi);
    const pubkey = merkleTree.publicKey;
    const builder = await createTree(umi, {
        merkleTree,
        maxDepth: 14,
        maxBufferSize: 64,
    });
    await builder.sendAndConfirm(umi);
    const merkleTreeAccount = await fetchMerkleTree(umi, pubkey);
    console.log(merkleTreeAccount);
    console.log("trying mint");
    const collectionMint = generateSigner(umi);
    console.log("signergen")
    const Mintaddr = collectionMint.publicKey;
    // await createNft(umi, {
    //     mint: Mintaddr,
    //     name: 'My Collection',
    //     uri: 'https://example.com/my-collection.json',
    //     sellerFeeBasisPoints: percentAmount(5.5),
    //     isCollection: true,
    // }).sendAndConfirm(umi);
    const leafOwner = keypair.publicKey;
    const { signature } = await mintV1(umi, {
        leafOwner,
        metadata: {
            name: 'My Compressed NFT',  
            uri: 'https://example.com/my-cnft.json',
            sellerFeeBasisPoints: 500, // 5%
            collection: { key: Mintaddr, verified: false },
            creators: [
                { address: umi.identity.publicKey, verified: false, share: 100 },
            ],
        },
        merkleTree: pubkey,
        collectionMint: Mintaddr
    }).sendAndConfirm(umi);
 
    const leaf = await parseLeafFromMintV1Transaction(umi, signature);
    const [assetId, bump] = findLeafAssetIdPda(umi, { merkleTree: pubkey, leafIndex: leaf.nonce });
    umi.use(dasApi());
    const rpcAsset = await umi.rpc.getAsset(assetId);
    const rpcAssetProof = await umi.rpc.getAssetProof(assetId);
    console.log(rpcAsset, rpcAssetProof);
}
main().catch(console.error);
