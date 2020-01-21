// a client for market center, https://github.com/goex-top/market_center
// api list 
// - GetTicker
// - GetDepth
// - SubscribeDepth
// - SubscribeTicker

// params wit web
// var udspath = /tmp/goex.market.center //ref to https://github.com/goex-top/market_center/blob/1e1bb15c69a1da6fddbba3d506920e91f9ec7842/const.go#L35

// local variable
// var client = null

var ReqType = {
    ReqType_GetSupportList: 1,
    ReqType_SubscribeDepth: 2,
    ReqType_SubscribeTicker: 3,
    ReqType_GetDepth: 4,
    ReqType_GetTicker: 5,
}

//---------------------------------------
function newUDSClient() {
    var client = Dial('unix://'+udspath)
    if (null === client) {
        throw 'new usd client fail'
    }
    return client
}

function udsRequest(client, req) {
    client.write(JSON.stringify(req))
    var rsp = client.read(2000)
    if (rsp === null) {
        return null
    }
    var obj = JSON.parse(rsp)
    if(obj.status !== 0) {
        return null
    }
    return obj.data
}

function GetSupportList(client) {
    var req = {type:ReqType.ReqType_GetSupportList}
    var rsp = udsRequest(client, req)
    return rsp
}

function GetDepth(client, exchangeName, pair) {
    var req = {type:ReqType.ReqType_GetDepth, exchange_name: exchangeName, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {Asks:rsp.AskList, Bids:rsp.BidList, Time:rsp.UTime, Info:rsp.rsp}
}

function GetTicker(client, exchangeName, pair) {
    var req = {type:ReqType.ReqType_GetTicker, exchange_name: exchangeName, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {Last:rsp.last, Buy:rsp.buy, Sell:rsp.sell, Volume:rsp.vol, Time:rsp.date, High:rsp.high, Low:rsp.low, Info:rsp}
}


function SubscribeDepth(client, exchangeName, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeDepth, exchange_name: exchangeName, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

function SubscribeTicker(client, exchangeName, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeTicker, exchange_name: exchangeName, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

var MarketCenterClient = (function() {
    function MarketCenterClient(exchangeName, pair) {
        if (typeof exchangeName === 'undefined') {
            throw 'exchangeName not defined'
          }
          if (typeof pair === 'undefined') {
            throw 'pair not defined'
          }
          if (typeof udspath === 'undefined' || udspath === '') {
            throw 'udspath not defined'
          }
          this.client = newUDSClient()
          var list = GetSupportList(this.client)
          var found = false
          _.each(list, function(item) {
            if (item === exchangeName) {
                found = true
                return false
            }
          })
          if(!found) {
              throw 'exchange not support, please check it again, https://github.com/goex-top/market_center#support-exchanges'
          }
          this.exchangeName = exchangeName
          this.pair = pair
      }
      MarketCenterClient.prototype.GetTicker = function() {
        return GetTicker(this.client, this.exchangeName, this.pair)
      }

      MarketCenterClient.prototype.GetDepth = function() {
        return GetDepth(this.client, this.exchangeName, this.pair)
      }
      MarketCenterClient.prototype.SubscribeDepth = function(period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        return SubscribeDepth(this.client, this.exchangeName, this.pair, period)
      }
      MarketCenterClient.prototype.SubscribeTicker = function(period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        return SubscribeTicker(this.client, this.exchangeName, this.pair, period)
      }
      MarketCenterClient.prototype.GetSupportList = function() {
        return GetSupportList(this.client)
      }
      return MarketCenterClient
    })()

$.NewMarketCenterClient = function(exchangeName, pair) {
    return new MarketCenterClient(exchangeName, pair)
}

function main() {
    mcc = $.NewMarketCenterClient('binance.com', 'BTC_USDT')
    Log('support list'+mcc.GetSupportList())
    mcc.SubscribeDepth(200)
    Sleep(1000)
    Log(mcc.GetDepth())
    mcc.SubscribeTicker(200)
    Sleep(1000)
    Log(mcc.GetTicker())
}
  