<script>
  //import Arweave from 'arweave'
  // warp sequencer 
  const warpUrl = `https://d1o5nlqr4okus2.cloudfront.net/gateway/contracts/deploy`
  const contractSRC = 'kSiq990WBHkz6uYO_1z7jylm3YbRrcpm7UfhYUb8Cg0'

  const [APP_NAME, APP_VERSION, SDK, CONTENT_TYPE, CONTRACT_SRC, INIT_STATE] = 
    ['App-Name', 'App-Version', 'SDK', 'Content-Type', 'Contract-Src', 'Init-State']
  const arweave = window.Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  })

  const warp = window.warp.WarpWebFactory.memCached(arweave)

  async function test() {
    const addr = await arweaveWallet.getActiveAddress()
    // construct AtomicNFT
    const data = '<h1>Hello World</h1>'
    const tags = [
      {name: APP_NAME, value: 'SmartWeaveContract'},
      {name: APP_VERSION, value: '0.3.0'},
      {name: SDK, value: 'RedStone'},
      {name: CONTENT_TYPE, value: 'text/html'},
      {name: CONTRACT_SRC, value: contractSRC},
      {name: INIT_STATE, value: JSON.stringify({
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

    try {
      // dispatch AtomicNFT
      const dataEntry = await arweave.createTransaction({data})
      tags.map(({name, value}) => dataEntry.addTag(name, value))
      const deResult = await arweaveWallet.dispatch(dataEntry)
      

      // deploy AtomicNFT Contract
      const contractTx = await arweave.createTransaction({data})
      tags.map(({name, value}) => contractTx.addTag.bind(contractTx)(name, value))
      await arweave.transactions.sign(contractTx)
      // set contract transaction to bundlr dataEntry txId
      contractTx.id = deResult.id 
      
      const response = await fetch(warpUrl, {
        method: 'POST',
        body: JSON.stringify({contractTx}),
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      const nft = await response.json()
      console.log(nft)

      const contract = warp.contract(nft.contractId)
      console.log(await contract.readState())

    } catch (e) {
      console.log('error', e)
    }
  }

</script>
<h1>Hello World</h1>
<button on:click={test}>Test Bundlr</button>