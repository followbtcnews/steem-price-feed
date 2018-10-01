import fs from 'fs';
import axios from 'axios';
import dsteem from '@sweatshop/dsteem-fallback';
import * as exchanges from './lib/exchanges';
import env from 'dotenv-safe';

env.config({ allowEmptyValues: true });

const WITNESS_NAME = process.env.WITNESS_NAME;
const WITNESS_ACTIVE_KEY = process.env.WITNESS_ACTIVE_KEY;
const RPC_NODES = process.env.RPC_NODES ? process.env.RPC_NODES.split(',').map((v)=>v.trim()) : ["https://api.steemit.com", "https://steemd.privex.io"];
const EXCHANGES = process.env.EXCHANGES ? process.env.EXCHANGES.split(',').map((v)=>v.trim()) : ["bittrex", "poloniex", "binance", "upbit"];
const INTERVAL_MINUTES = process.env.INTERVAL_MINUTES ? Number(process.env.INTERVAL_MINUTES) : 60;
const SBD_PEG_MULTIPLIER = process.env.SBD_PEG_MULTIPLIER ? Number(process.env.SBD_PEG_MULTIPLIER) : 1;
const RPC_TIMEOUT_SECONDS = process.env.RPC_TIMEOUT_SECONDS ? Number(process.env.RPC_TIMEOUT_SECONDS) : 5;

const client = new dsteem.Client(RPC_NODES, {
  timeout: RPC_TIMEOUT_SECONDS * 1000
});

function timeout(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function publishPriceFeed(price) {
  try {
    const exchange_rate = new dsteem.Price(dsteem.Asset.fromString(`${price.toFixed(3)} SBD`), dsteem.Asset.fromString(`${(1 / SBD_PEG_MULTIPLIER).toFixed(3)} STEEM`))
    const op = ['feed_publish', { exchange_rate, publisher: WITNESS_NAME }]
    await client.broadcast.sendOperations([op], dsteem.PrivateKey.from(WITNESS_ACTIVE_KEY));
    console.log(`Published price feed ${exchange_rate}, next attempt in ${INTERVAL_MINUTES} minutes`);
  } catch(e) {
    console.error(e);
    console.log(`Next attempt in ${INTERVAL_MINUTES} minutes`);
  }
}

function setUpAdapters() {
  const adapters = [];
  EXCHANGES.map((e)=>{
    if(exchanges[e]) {
      console.log('Using adapter: ', e);
      adapters.push(exchanges[e]);
    } else {
      console.log('Ignoring unknown adapter: ', e);
    }
  });
  if(adapters.length === 0) { throw new Error('No exchange adapters defined (process.env.EXCHANGES)'); }
  return adapters;
}

(async function start() {

  if(!WITNESS_NAME) { throw new Error(`process.env.WITNESS_NAME must be defined`) };
  if(!WITNESS_ACTIVE_KEY) { throw new Error(`process.env.WITNESS_ACTIVE_KEY must be defined`) };
  console.log(`Starting witness price feed for ${WITNESS_NAME}`);

  const adapters = setUpAdapters();
  const loop = async () => {
    const prices = (await Promise.all(adapters.map(v => v()))).filter(v => !!v);
    if(prices.length === 0) {
      console.log(`No price information has been received, retrying in 1 minute`);
      await timeout(60);
      await loop();
    } else {
      if(prices.length === 1) { console.log(`You are using a single feed source, exchange rate might differ significantly!`); }
      const average = prices.reduce((t, v) => t + v, 0) / prices.length;
      console.log(`Publishing an average price of $${average} USD`);
      await publishPriceFeed(average);
      await timeout(60 * INTERVAL_MINUTES);
      await loop();
    }
  };

  await loop();

})().catch((e) => {
  console.error(e);
})
