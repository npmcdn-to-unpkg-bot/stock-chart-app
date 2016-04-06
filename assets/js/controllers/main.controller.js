'use strict';

angular
    .module('StockChartApp')
    .controller('MainController', MainController);

MainController.$inject = ['logger', 'stockService', '$scope'];

function MainController(logger, stockService, $scope) {
    var vm = this;
    vm.addStock = addStock;
    vm.removeStock = removeStock;
    vm.showStocks = showStocks;
    vm.stockCode = '';
    vm.stockList = [];

    activate();


    function activate() {
        return showStocks();
    }

    io.socket.on('stock', function(msg) {

        switch (msg.verb) {
            case 'created':
                // vm.stockList.push(msg.data);
                vm.chartConfig.series = [];
                showStocks();
                $scope.$apply();
                break;
            case 'destroyed':
                console.log(msg.previous);
                // var index = vm.stockList.indexOf(msg.previous);
                // if (index > -1) {
                //     vm.stockList.splice(index, 1);
                //     $scope.$apply();
                // }
                vm.chartConfig.series = [];
                showStocks();
                $scope.$apply();
                break;
            default:
                return;
        }
    });

    vm.chartConfig = {
        options: {
            chart: {
                zoomType: 'x'
            },
            rangeSelector: {
                enabled: true
            },
            navigator: {
                enabled: true
            },
            yAxis: {
                labels: {
                    formatter: function() {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                }
            },
            plotOptions: {
                series: {
                    compare: 'percent'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2
            },
        },
        series: [],
        title: {
            text: 'Stocks'
        },
        useHighStocks: true
    };

    // Store the stock to the database
    function addStock() {
        return stockService.getName(vm.stockCode)
            .then(function(result) {
                if (result.data.status.code === 200) {
                    io.socket.post('/stock/addStock', {
                        symbol: result.data.results[0].symbol,
                        name: result.data.results[0].name
                    });
                    vm.stockCode = '';
                }
                else {
                    logger.error('Incorrect or not existing stock code');
                }
            })
            .catch(function(err) {
                logger.error('Incorrect or not existing stock code');
            });
    }

    function removeStock(id) {
        io.socket.delete('/stock/removeStock', {
            id: id
        });
    }

    function showStocks() {
        // Connect to socket room
        io.socket.get('/stock/addStock');

        return stockService.getStockList()
            .then(function(results) {

                // Charts
                for (var i = 0; i < results.data.length; i++) {
                    showChart(results.data[i].symbol);
                }

                // Stock list
                vm.stockList = results.data;
            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function showChart(symbol) {

        var startDate = getDate();

        stockService.getHistory(symbol, startDate)
            .then(function(result) {

                var dataArray = result.data.results.map(function(obj) {
                    return [Date.parse(obj.timestamp), obj.open];
                });

                var stockObj = {
                    name: symbol,
                    data: dataArray
                };

                vm.chartConfig.series.push(stockObj);

            })
            .catch(function(err) {
                logger.error(err);
            });
    }

    function getDate() {
        var today = new Date();
        var lastYearTime = new Date().setYear(today.getFullYear() - 1);
        var fullTime = new Date(lastYearTime);
        var year = fullTime.getFullYear();
        var month = fullTime.getMonth() + 1;
        var date = fullTime.getDate();
        var startDate = year + '0' + month + '0' + date;
        return startDate;
    }
}
