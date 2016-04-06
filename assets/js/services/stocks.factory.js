'use strict';

angular
    .module('StockChartApp')
    .factory('stockService', stockService);

stockService.$inject = ['$http'];

function stockService($http) {
    var service = {
        getHistory: getHistory,
        getName: getName,
        getStockList: getStockList,
    };

    return service;
    
    ///////////////////////////////////////

    function getHistory(symbol, startDate) {
        return $http.get('http://marketdata.websol.barchart.com/getHistory.json?key=b899172514dfad351ab967061c4e3dbf&symbol=' + symbol + '&type=daily&startDate=' + startDate);
    }
    
    function getName(symbol) {
        return $http.get('http://marketdata.websol.barchart.com/getQuote.json?key=b899172514dfad351ab967061c4e3dbf&symbols=' + symbol);
    }
    
    function getStockList() {
        return $http.get('/stock');
    }
}
