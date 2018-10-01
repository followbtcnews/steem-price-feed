/* 
  Based on witness-essentials by @therealwolf
  https://github.com/therealwolf42/witness-essentials
*/

import axios from 'axios';

export let bittrex = async () => {
  try {
    let BTC_USD = (await axios.get('https://bittrex.com/api/v1.1/public/getticker?market=USDT-BTC')).data.result
    let BTC_STEEM = (await axios.get('https://bittrex.com/api/v1.1/public/getticker?market=BTC-STEEM')).data.result
    BTC_USD = JSON.parse(JSON.stringify(BTC_USD)).Last
    BTC_STEEM = JSON.parse(JSON.stringify(BTC_STEEM)).Last
    console.log(`Bittrex $${BTC_STEEM * BTC_USD} USD`)
    return BTC_STEEM * BTC_USD
  } catch (error) {
    console.error(`Bittrex Error`, error.message)
    return null
  }
}

export let binance = async () => {
  try {
    let BTC_USD = (await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')).data
    let BTC_STEEM = (await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=STEEMBTC')).data
    BTC_USD = JSON.parse(JSON.stringify(BTC_USD)).price
    BTC_STEEM = JSON.parse(JSON.stringify(BTC_STEEM)).price
    console.log(`Binance $${BTC_STEEM * BTC_USD} USD`)
    return BTC_STEEM * BTC_USD
  } catch (error) {
    console.error(`Binance Error`, error.message)
    return null
  }
}

export let huobi = async () => {
  try {
    let BTC_USD = (await axios.get('https://api.huobi.pro/market/detail/merged?symbol=btcusdt')).data
    let BTC_STEEM = (await axios.get('https://api.huobi.pro/market/detail/merged?symbol=steembtc')).data
    BTC_USD = JSON.parse(JSON.stringify(BTC_USD)).tick.close
    BTC_STEEM = JSON.parse(JSON.stringify(BTC_STEEM)).tick.close
    console.log(`Huobi $${BTC_STEEM * BTC_USD} USD`)
    return BTC_STEEM * BTC_USD
  } catch (error) {
    console.error(`Huobi Error`, error.message)
    return null
  }
}


export let upbit = async () => {
  try {
    let BTC_USD = (await axios.get('https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.USDT-BTC')).data[0]
    let BTC_STEEM = (await axios.get('https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.BTC-STEEM')).data[0]
    BTC_USD = JSON.parse(JSON.stringify(BTC_USD)).tradePrice
    BTC_STEEM = JSON.parse(JSON.stringify(BTC_STEEM)).tradePrice
    console.log(`Upbit $${BTC_STEEM * BTC_USD} USD`)
    return BTC_STEEM * BTC_USD
  } catch (error) {
    console.error(`Upbit Error`, error.message)
    return null
  }
}

export let poloniex = async () => {
  try {
    let Ticker = (await axios.get('https://poloniex.com/public?command=returnTicker')).data
    let BTC_USD = JSON.parse(JSON.stringify(Ticker))['USDT_BTC'].last
    let BTC_STEEM = JSON.parse(JSON.stringify(Ticker))['BTC_STEEM'].last
    console.log(`Poloniex $${BTC_STEEM * BTC_USD} USD`)
    return BTC_STEEM * BTC_USD
  } catch (error) {
    console.error(`Poloniex Error`, error.message)
    return null
  }
}
