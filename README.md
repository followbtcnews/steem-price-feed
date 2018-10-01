# Steem Witness Price Feed

This app periodically publishes the SBD/STEEM price on behalf of witness accounts on [STEEM blockchain](https://steem.io).

HF20 compatible (Base: SBD / Quote: STEEM).

Included exchanges:
* Binance
* Bittrex
* Poloniex
* Huobi*
* Upbit

Note: Huobi is excluded by default

## One Click Setup with Heroku (recommended)

[Heroku](https://heroku.com) can provide secure, stable and reliable hosting of this app for $7/month (1x Hobby server).
Use the button below to be redirected to the guided setup wizard:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/thesweatshop/steem-price-feed)

## Environment Variables / Parameters

#### Required Parameters
```javascript
WITNESS_NAME
// Witness account name (without @ sign)

WITNESS_ACTIVE_KEY
// Witness private active key
```

#### Optional Parameters

```javascript
RPC_NODES
// A comma separated list of RPC nodes to use for broadcast
// default: https://api.steemit.com, https://steemd.privex.io

EXCHANGES
// A comma separated list of exchanges to use for fetching the price",
// default: bittrex, poloniex, binance, upbit

SBD_PEG_MULTIPLIER
// SBD peg multiplier
// default: 1

INTERVAL_MINUTES
// Feed publishing interval in minutes
// default: 60
```

## Setup locally
Clone the project repo into the "steem-price-feed" directory and install project dependencies using NPM:

```
$ git clone https://github.com/thesweatshop/steem-price-feed.git steem-price-feed
$ cd steem-price-feed
$ npm install
```

## Running locally

* Recommended node.js version: __10.x.x__
* Create an `.env` file with your witness account name and private active key in the project root, example can be found in `.env.example`
* Run the application with `node --harmony --experimental-modules --no-warnings main.mjs`;

## Support

This project is brought to you by [@upheaver](https://steemit.com/witness-category/@upheaver/upheaver-witness-announcement).

### License

MIT
