var binance_btc_usdt = null
// var binance_eos_usdt = null
// var binance_eth_usdt = null

var okex_btc_usdt = null
// var okex_eos_usdt = null
// var okex_eth_usdt = null

var huobi_btc_usdt = null
// var huobi_eos_usdt = null
// var huobi_eth_usdt = null

var fcoin_btc_usdt = null
// var fcoin_eos_usdt = null
// var fcoin_eth_usdt = null

var clients = []
var latestPrice = []

var ObjChart = null
var startTime = null
var strategyVersion = "1.0.0";

// var compareSize = 4

var chartBTC_USDT = {
    __isStock: true,
    extension: {
        layout: 'single', // 不参于分组，单独显示, 默认为分组 'group'
        height: 500,      // 指定高度        // 指定宽度占的单元值, 总值 为12
    },
    plotOptions: {
        area: {
            fillOpacity: 0.3,
            softThreshold:false,
            threshold: null
        },
        fillColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
            },
            stops: [
                [0, '#5dec83'],
                [1, '#4d1fd8']
            ]
        },
        marker: {
            radius: 2
        },
        lineWidth: 1,
        states: {
            hover: {
                lineWidth: 1
            }
        }
    },
    legend: {
        enabled: true,
    },
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},    // 缩放工具
    title : { text : '走势图'},                       // 标题
    rangeSelector: {                                    // 选择范围
        buttons:  [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 3,
        inputEnabled: true
    },
    xAxis: { type: 'datetime'},                         // 坐标轴横轴 即：x轴， 当前设置的类型是 ：时间
    yAxis : [
        { // Primary yAxis                                          // 坐标轴纵轴 即：y轴， 默认数值随数据大小调整。
            labels: {
                format: '{value}',
            },
            title: {
                text: 'Price[USDT]',
            },
            showInLegend: true,
            opposite: false
        }, { // Secondary yAxis
            title: {
                text: 'Diff[USDT]',
            },
            labels: {
                format: '{value}',
            },
            opposite: true
        }],
    series : [                                          // 数据系列，该属性保存的是 各个 数据系列（线， K线图， 标签等..）
        {name : "binance",      id : "binance, BTC_USDT",      data : [], yAxis: 0,showInLegend: true, type:'area', tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。
        {name : "okex", id : "okex, BTC_USDT",   data : [], yAxis: 0,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}},  // 索引为0， data 数组内存放的是该索引系列的 数据
        {name : "huobi",    id : "huobi, BTC_USDT",  data : [], yAxis: 0,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。
        {name : "fcoin",    id : "fcoin, BTC_USDT",  data : [], yAxis: 0,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。

        {name : "binance diff",      id : "binance diff, BTC_USDT",      data : [], yAxis: 1,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。
        {name : "okex diff", id : "okex diff, BTC_USDT",   data : [], yAxis: 1,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}},  // 索引为0， data 数组内存放的是该索引系列的 数据
        {name : "huobi diff",    id : "huobi diff, BTC_USDT",  data : [], yAxis: 1,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。
        {name : "fcoin diff",    id : "fcoin diff, BTC_USDT",  data : [], yAxis: 1,showInLegend: true, tooltip:{valueDecimals: 2, valueSuffix: ' USDT'}}, // 索引为1，设置了dashStyle : 'shortdash' 即：设置 虚线。
    ]
};

var chartDiff1 = {
    __isStock: false,
    extension: {
        layout: 'single',
        col: 6, // 指定宽度占的单元值, 总值 为12
        height: 500,
    },
    title: {
        text: '价差分布图'
    },
    xAxis: [{
        title: { text: 'Data' },
        alignTicks: false
    }, {
        title: { text: 'Histogram' },
        alignTicks: false,
        opposite: true
    }],

    yAxis: [{
        title: { text: 'Data' }
    }, {
        title: { text: 'Histogram' },
        opposite: true
    }],

    series: [{
        name: 'Histogram',
        type: 'histogram',
        xAxis: 1,
        yAxis: 1,
        baseSeries: 's1h',
        zIndex: -1
    },{
        name: 'Data',
        type: 'scatter',
        data: [],
        id: 's1h',
        marker: {
            radius: 1.5
        }
    }]
};

var chartDiff2 = chartDiff1
var chartDiff3 = chartDiff1
var chartDiff4 = chartDiff1
var chartDiff = [chartDiff1, chartDiff2, chartDiff3, chartDiff4]
var maxDiffSize = 3600*2*5
////////////////////////////////////////////////////////////////////
function welcome() {
    Log("======================================================")
    Log("                      ♜Q:6510676#0000FF              ")
    Log("                      ♜Q群:364655408#0000FF          ")
    Log("                      欢迎来交流                       ")
    Log("======================================================")
}

function init() {
    binance_btc_usdt = $.NewMarketCenterClient('binance.com', 'BTC_USDT')
    binance_btc_usdt.SubscribeTicker(200)
    clients.push(binance_btc_usdt)

    // binance_eos_usdt = $.NewMarketCenterClient('binance.com', 'EOS_USDT')
    // binance_eos_usdt.SubscribeTicker(200)
    //  clients.push(binance_eos_usdt)

    // binance_eth_usdt = $.NewMarketCenterClient('binance.com', 'ETH_USDT')
    // binance_eth_usdt.SubscribeTicker(200)
    //  clients.push(binance_eth_usdt)

    // okex_btc_usdt = $.NewMarketCenterClient('okex.com_v3', 'BTC_USDT')
    // okex_btc_usdt.SubscribeTicker(200)
    // clients.push(okex_btc_usdt)

    // okex_eos_usdt = $.NewMarketCenterClient('okex.com_v3', 'EOS_USDT')
    // okex_eos_usdt.SubscribeTicker(200)
    //  clients.push(okex_eos_usdt)

    // okex_eth_usdt = $.NewMarketCenterClient('okex.com_v3', 'ETH_USDT')
    // okex_eth_usdt.SubscribeTicker(200)
    //  clients.push(okex_eth_usdt)

    // huobi_btc_usdt = $.NewMarketCenterClient('huobi.pro', 'BTC_USDT')
    // huobi_btc_usdt.SubscribeTicker(200)
    // clients.push(huobi_btc_usdt)

    // huobi_eos_usdt = $.NewMarketCenterClient('huobi.pro', 'EOS_USDT')
    // huobi_eos_usdt.SubscribeTicker(200)
    //  clients.push(huobi_eos_usdt)

    // huobi_eth_usdt = $.NewMarketCenterClient('huobi.pro', 'ETH_USDT')
    // huobi_eth_usdt.SubscribeTicker(200)
    //  clients.push(huobi_eth_usdt)

    // fcoin_btc_usdt = $.NewMarketCenterClient('fcoin.com', 'BTC_USDT')
    // fcoin_btc_usdt.SubscribeTicker(200)
    // clients.push(fcoin_btc_usdt)

    _.each(clients, function(c) {
        latestPrice.push(0)
    })
    Log("supports size:" + clients.length)
    if(log_reset) {
        LogReset()
        LogVacuum()
    }

     ObjChart = Chart([chartBTC_USDT, chartDiff1, chartDiff2, chartDiff3, chartDiff4]);
     if(chart_reset){
         ObjChart.reset();             // 清空
     }
     startTime = new Date()
     welcome()

}

function updateTicker() {
    var tickers = []
    for(var index = 0; index <  clients.length; index++) {
        var ticker = clients[index].GetTicker()
        Sleep(1)
        if(ticker !== null) {
            tickers.push(ticker)
        }
    }
    if (tickers.length == clients.length) {
        for(var index = 0; index <  tickers.length; index++) {
            var ticker = tickers[index]
            var nowTime = new Date().getTime();
            var price = (ticker.Buy + ticker.Sell) / 2
            ObjChart.add([index, [nowTime, price]]);
            if(latestPrice[index] != 0) {
                var diff = price - latestPrice[index]
                if(chartDiff[index].series[1].data.length > maxDiffSize) {
                    chartDiff[index].series[1].data.shift()
                }
                chartDiff[index].series[1].data.push(diff)
                ObjChart.add([clients.length + index, [nowTime, diff]]);
            }
            latestPrice[index] = price
        }
    }
}

function main() {
    while(true) {
        var now = new Date().getTime()
        updateTicker()
        ObjChart.update([chartBTC_USDT, chartDiff1, chartDiff2, chartDiff3, chartDiff4]);
        var cur = new Date().getTime()
        var pass = cur - now
        if (pass < 200) {
            Sleep(200 - pass)
        }
    }
}