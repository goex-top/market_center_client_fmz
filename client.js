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
    var client = Dial("unix://"+udspath)
    if (null === client) {
        throw "new usd client fail"
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
    return obj
}

function GetSupportList(client) {
    var reqList = {Type:ReqType.ReqType_GetSupportList}
    var rsp = udsRequest(client,reqList)
    if (rsp === null) {
        return null
    }
    return rsp
}

function GetTicker(exchangeName, pair) {
    // var ret = HttpQuery(api_url, 'api_id=' + apiId + '&method=GetTicker')
    // var retJson = JSON.parse(ret)
    // return retJson
}

var MarketCenterClient = (function() {
    function MarketCenterClient(exchangeName, pair) {
        if (typeof exchangeName === 'undefined') {
            throw 'exchangeName not defined'
          }
          if (typeof pair === 'undefined') {
            throw 'pair not defined'
          }
          if (typeof udspath === 'undefined' || udspath === "") {
            throw 'udspath not defined'
          }
          this.client = newUDSClient()
          Log(GetSupportList(this.client))
          this.exchangeName = exchangeName
          this.pair = pair
      }
      MarketCenterClient.prototype.GetTicker = function() {
        return GetTicker(this.client)
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
    mcc = $.NewMarketCenterClient("binance.com", "BTC_USDT")
    Log(mcc.GetSupportList())
  }
  