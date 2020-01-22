// a client for market center, https://github.com/goex-top/market_center
// api list 
// * GetSupportList
// * SubscribeSpotTicker
// * SubscribeSpotDepth
// * ~~SubscribeSpotTrade~~
// * GetSpotTicker
// * GetSpotDepth
// * ~~GetSpotTrade~~
// * SubscribeFutureTicker
// * SubscribeFutureDepth
// * ~~SubscribeFutureTrade~~
// * GetFutureTicker
// * GetFutureDepth
// * ~~GetFutureTrade~~

// params wit web
// var udspath = /tmp/goex.market.center //ref to https://github.com/goex-top/market_center/blob/1e1bb15c69a1da6fddbba3d506920e91f9ec7842/const.go#L35

// local variable
// var client = null

var ReqType = {
    ReqType_GetSupportList: 1,
    ReqType_SubscribeSpotDepth: 2,
    ReqType_SubscribeSpotTicker: 3,
    ReqType_SubscribeFutureDepth: 4,
    ReqType_SubscribeFutureTicker: 5,
    ReqType_GetSpotDepth: 6,
    ReqType_GetSpotTicker: 7,
    ReqType_GetFutureDepth: 8,
    ReqType_GetFutureTicker: 9,
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
    if (rsp === null) {
        return null
    }
    return rsp
}

function GetSpotDepth(client, exchangeName, pair) {
    var req = {type:ReqType.ReqType_GetSpotDepth, exchange_name: exchangeName, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {Asks:rsp.AskList, Bids:rsp.BidList, Time:rsp.UTime, Info:rsp.rsp}
}

function GetSpotTicker(client, exchangeName, pair) {
    var req = {type:ReqType.ReqType_GetSpotTicker, exchange_name: exchangeName, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {
        Last:parseFloat(rsp.last), 
        Buy:parseFloat(rsp.buy), 
        Sell:parseFloat(rsp.sell), 
        Volume:parseFloat(rsp.vol), 
        Time:parseFloat(rsp.date), 
        High:parseFloat(rsp.high), 
        Low:parseFloat(rsp.low), 
        Info:rsp
    }
}

function SubscribeSpotDepth(client, exchangeName, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeSpotDepth, exchange_name: exchangeName, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

function SubscribeSpotTicker(client, exchangeName, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeSpotTicker, exchange_name: exchangeName, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

function GetFutureDepth(client, exchangeName, contractType, pair) {
    var req = {type:ReqType.ReqType_GetFutureDepth, exchange_name: exchangeName, contract_type: contractType, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {Asks:rsp.AskList, Bids:rsp.BidList, Time:rsp.UTime, Info:rsp.rsp}
}

function GetFutureTicker(client, exchangeName, contractType, pair) {
    var req = {type:ReqType.ReqType_GetFutureTicker, exchange_name: exchangeName, contract_type: contractType, currency_pair: pair}
    var rsp = udsRequest(client, req)
    if(rsp === null) {
        return null
    }
    return {
        Last:parseFloat(rsp.last), 
        Buy:parseFloat(rsp.buy), 
        Sell:parseFloat(rsp.sell), 
        Volume:parseFloat(rsp.vol), 
        Time:parseFloat(rsp.date), 
        High:parseFloat(rsp.high), 
        Low:parseFloat(rsp.low), 
        Info:rsp
    }
}

function SubscribeFutureDepth(client, exchangeName, contractType, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeFutureDepth, exchange_name: exchangeName, contract_type: contractType, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

function SubscribeFutureTicker(client, exchangeName, contractType, pair, period) {
    var req = {type:ReqType.ReqType_SubscribeFutureTicker, exchange_name: exchangeName, contract_type: contractType, currency_pair: pair, period: period}
    var rsp = udsRequest(client, req)
    return rsp
}

var MarketCenterClient = (function() {
    function MarketCenterClient() {
        if (typeof udspath === 'undefined' || udspath === '') {
            throw 'udspath not defined'
        }
        this.client = newUDSClient()
        this.list = GetSupportList(this.client)
        Log("this.list:" + this.list)
    }

    MarketCenterClient.prototype.GetSpotTicker = function(exchangeName, pair) {
        return GetSpotTicker(this.client, exchangeName, pair)
    }

    MarketCenterClient.prototype.GetSpotDepth = function(exchangeName, pair) {
        return GetSpotDepth(this.client, exchangeName, pair)
    }

    MarketCenterClient.prototype.SubscribeSpotDepth = function(exchangeName, pair, period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        var found = false
        _.each(this.list, function(item) {
            if (item === exchangeName) {
                found = true
                return false
            }
        })

        if(!found) {
            throw 'exchange ('+ exchangeName +') not support, please check it again, https://github.com/goex-top/market_center#support-exchanges'
        }
        return SubscribeSpotDepth(this.client, exchangeName, pair, period)
    }

    MarketCenterClient.prototype.SubscribeSpotTicker = function(exchangeName, pair, period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        var found = false
        _.each(this.list, function(item) {
            if (item === exchangeName) {
                found = true
                return false
            }
        })

        if(!found) {
            throw 'exchange ('+ exchangeName +') not support, please check it again, https://github.com/goex-top/market_center#support-exchanges'
        }
        return SubscribeSpotTicker(this.client, exchangeName, pair, period)
    }


    MarketCenterClient.prototype.GetFutureTicker = function(exchangeName, contractType, pair) {
        return GetFutureTicker(this.client, exchangeName, contractType, pair)
    }

    MarketCenterClient.prototype.GetFutureDepth = function(exchangeName, contractType, pair) {
        return GetFutureDepth(this.client, exchangeName, contractType, pair)
    }

    MarketCenterClient.prototype.SubscribeFutureDepth = function(exchangeName, contractType, pair, period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        var found = false
        _.each(this.list, function(item) {
            if (item === exchangeName) {
                found = true
                return false
            }
        })

        if(!found) {
            throw 'exchange ('+ exchangeName +') not support, please check it again, https://github.com/goex-top/market_center#support-exchanges'
        }
        return SubscribeFutureDepth(this.client, exchangeName, contractType, pair, period)
    }

    MarketCenterClient.prototype.SubscribeFutureTicker = function(exchangeName, contractType, pair, period) {
        if(typeof(period) === 'undefined') {
            period = 200
        }
        var found = false
        _.each(this.list, function(item) {
            if (item === exchangeName) {
                found = true
                return false
            }
        })

        if(!found) {
            throw 'exchange ('+ exchangeName +') not support, please check it again, https://github.com/goex-top/market_center#support-exchanges'
        }
        return SubscribeFutureTicker(this.client, exchangeName, contractType, pair, period)
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
    mcc.SubscribeSpotDepth(200)
    Sleep(1000)
    Log(mcc.GetSpotDepth())
    mcc.SubscribeSpotTicker(200)
    Sleep(1000)
    Log(mcc.GetSpotTicker())
}
  