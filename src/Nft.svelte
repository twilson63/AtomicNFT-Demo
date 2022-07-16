<script>
  import { mint } from './lib/fp.js'

  async function doMint() {
    const addr = await arweaveWallet.getActiveAddress()
    // construct AtomicNFT
    const data = '<h1>Hello World</h1>'
    const tags = [
      {name: 'Init-State', value: JSON.stringify({
        ticker: 'TEST-FOOBAR',
        name: 'Test Contract 2',
        title: 'atomicNFT',
        owner: addr,
        locked: false,
        balances: {
          [addr]: 1
        },
        createdAt: Date.now(),
        contentType: 'text/html',
        views: {}
      })}
    ]

    const result = await mint({data: '<h1>Atomic NFT</h1>', tags})
    console.log(result)
  }

</script>
<h1>Atomic NFT</h1>
<button on:click={doMint}>mint</button>