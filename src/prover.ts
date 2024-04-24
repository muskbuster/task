import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum,fetchMerkleTree,createTree,fetchTreeConfigFromSeeds,mintToCollectionV1,parseLeafFromMintToCollectionV1Transaction } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity,generateSigner,percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum())
umi.use(dasApi());

