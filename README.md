# Atomic NFTs via Warp/Bundlr

This example code base, demonstrates how to create Atomic NFTs using Warp and Bundlr, Warps sequencer deploys the contract in a extremely fast execution environment and bundles via arBundles to Arweave, the contract remains wrapped in a bundle. So to work around this issue, we also submit the contract to bundlr.network using the same identifier, this gives us the functionality we are looking for. 

AtomicNFT

An AtomicNFT is a single transaction/data-entry identifier that points to both a contract and data, in this example the data is a webpage. This simple design leads to all kinds of interesting applications.

## Run the Demo

``` sh
npm install
npm run build
npx w3
```

