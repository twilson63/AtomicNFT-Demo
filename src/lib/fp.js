import { Async } from 'crocks'

import always from 'ramda/src/always'
import assoc from 'ramda/src/assoc'
import concat from 'ramda/src/concat'

// --- CONSTANTS --- //
const WARP_URL = `https://d1o5nlqr4okus2.cloudfront.net/gateway/contracts/deploy`
const CONTACT_SRC_ID = 'kSiq990WBHkz6uYO_1z7jylm3YbRrcpm7UfhYUb8Cg0'

const [APP_NAME, APP_VERSION, SDK, CONTENT_TYPE, CONTRACT_SRC, INIT_STATE] = 
  ['App-Name', 'App-Version', 'SDK', 'Content-Type', 'Contract-Src', 'Init-State']

const arweave = window.Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const TAGS = [
  {name: APP_NAME, value: 'SmartWeaveContract'},
  {name: APP_VERSION, value: '0.3.0'},
  {name: SDK, value: 'RedStone'},
  {name: CONTENT_TYPE, value: 'text/html'},
  {name: CONTRACT_SRC, value: CONTACT_SRC_ID}
]

// --- HELPERS --- //
const createDataEntry = data => Async.fromPromise(arweave.createTransaction.bind(arweave))({data})
const addTags = tags => tx => {
  tags.map(({name, value}) => tx.addTag(name, value))
  return tx 
}
//const dispatch = Async.fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))
const sign = tx => 
  Async.fromPromise(arweave.transactions.sign.bind(arweave.transactions))(tx).map(always(tx))
const post = contractTx => Async.fromPromise(fetch)(WARP_URL, {
  method: 'POST',
  body: JSON.stringify({contractTx}),
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})  
const toJSON = response => response.ok ? Async.fromPromise(response.json.bind(response))() : Async.Rejected(response)

// mint atomic nft
export const mint = (nft) => {  
  const dispatch = Async.fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))

  return Async.of({data: nft.data, tags: concat(TAGS, nft.tags)})
  .chain(({data, tags}) => 
    createDataEntry(data).map(addTags(tags)).chain(dispatch)
    .map(_ => (console.log('Result', _), _))  
    .chain(result => createDataEntry(data)
      .map(addTags(tags))
      .chain(sign)
      .map(assoc('id', result.id))
      .chain(post)
      .chain(toJSON)
      .map(_ => (console.log('Post', _), _))
      .map(_ => ({id: _.contractId }))
    )  
  )
    .toPromise()
}