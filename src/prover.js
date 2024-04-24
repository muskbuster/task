import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';
const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum());
umi.use(dasApi());
