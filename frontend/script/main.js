
let coinsList = [];
let exchangeData; 
let httpResponse; 
let originCoin;
let destinyCoin;
let currentTarget = '';
let apiLocalhost = 'http://127.0.0.1:8000';
let apiUrl = apiLocalhost + '/api/';
let defaultTargetCoin = 'eth';
let defaultOriginCoin = 'btc';
let recommendedMarket = '';
var myChart;

// ---------------------------------------
// Click Functions Sections 
// ---------------------------------------

$('.button-refresh').click(function () {
    // Gets tradeOption and toOption whenever 'refresh' button is clicked
    
    let tradeOption = $('.trade-option:selected').val();
    let toOption = $('.to-option:selected').val();
    
    refreshData(tradeOption, toOption);
});

$('.title-table').click(
    // Checks which 'exchangeTable' column was clicked an orders table with target column
    function ($event) { // gets user clicked item id
        clickOrder(event.target.id);
    }
)

// ----------------------------------------------------
// Coins combo box section functions 
// - getCoinsList
// - getTradeOption
// - getToOption
// ----------------------------------------------------

getCoinList();
refreshData(defaultOriginCoin, defaultTargetCoin);
function getCoinList() {
    // Gets coins list from API and sets it to coinsList variable

    url_coins_list = apiUrl + 'coinsList/'
    // url_coins_list = 'https://www.cryptocompare.com/api/data/coinlist'
    
    $.get(url_coins_list, function (data) {
        retrievedCoinsList = data;
    }).done(
        () => {
                $('#trade').empty();
                $('#to').empty();

                retrievedCoinsList.forEach(value => {
                    const coin = {
                        name: value.fullName,
                        img: value.baseUrl + value.imageUrl,
                        isTrading: value.isTrading,
                        ticker: value.ticker
                    }

                    coinsList.push(coin);

                    // Setting Default Options 
                    if (coin.ticker === defaultOriginCoin.toUpperCase()) {
                        $('#trade').append($(`<option class = "trade-option" value = "${coin.ticker}" selected>${coin.name}</option>`));
                    } else {
                        $('#trade').append($(`<option class = "trade-option" value = "${coin.ticker}">${coin.name}</option>`));
                    }

                    if (coin.ticker === defaultTargetCoin.toUpperCase()) {                    
                        $('#to').append($(`<option class = "to-option" value = "${coin.ticker}" selected>${coin.name}</option>`));
                    } else {
                        $('#to').append($(`<option class = "to-option" value = "${coin.ticker}">${coin.name}</option>`));
                    }
                }
            )
        }
    )
}

// Whenever the Trade combobox is changed, perform getTradeOption and update all subsequent functions 
$('#trade').change(getTradeOption);

function getTradeOption() {
    // Gets selected trade option from combo-box and refreshes data
    let tradeOption = $('.trade-option:selected').val();
    let toOption = $('.to-option:selected').val();
    let coin = coinsList.find(x => x.ticker === tradeOption);

    $('.tradeLogo')[0].src = coin.img;
    $('.firstCoinName').text(coin.name);

    // Update Trade Coin Volume
    $('#lastVolumeFrom').text(`Volume (${tradeOption})`)

    refreshData(tradeOption, toOption);
}

// Whenever the To combobox is changed, perform getTradeOption and update all subsequent functions 
$('#to').change(getToOption);

function getToOption() {
    let toOption = $('.to-option:selected').val();
    let tradeOption = $('.trade-option:selected').val();
    let coin = coinsList.find(x => x.ticker === toOption);
    
    $('.toLogo')[0].src = coin.img;
    $('.secondCoinName').text(coin.name);

    refreshData(tradeOption, toOption);
}

// -------------------------------------------------------------

// -------------------------------------------------------------
// Exchanges Table Function Section
// - refreshData
// - fillExchangeTable
// - clickOrder
// - sortExchangeTable
// - fillExchangeTable
// -------------------------------------------------------------


function refreshData(originCoin, destinyCoin) {
    // Gets exchange data from API and updates exchange table, chart graph and recommended section

    // Old url: `https://api.cryptonator.com/api/full/${originCoin}-${destinyCoin}`
    https = `https://min-api.cryptocompare.com/data/top/exchanges/full?fsym=${originCoin.toUpperCase()}&tsym=${destinyCoin.toUpperCase()}`

    $.get(https, function (data) {
        httpResponse = data.Data.Exchanges;
    }).done(
        () => {
            
            if (typeof httpResponse === undefined){
                alert("Invalid Combination")
                return
            } 

            exchangeData = []
            // console.log(httpResponse)
            httpResponse.forEach(data => {                
                exchange = {'market': data.MARKET, 
                            'price': data.PRICE, 
                            'lastVolumeTo': data.LASTVOLUME, 
                            'lastVolumeFrom': data.LASTVOLUME, 
                            'lastUpdate': data.LASTUPDATE};
                exchangeData.push(exchange);
            })

            recommendedMarket = getRecommendedMarket();

            fillExchangeTable(exchangeData);

            fillChart(recommendedMarket);

            $('.last-updated').text('Last Updated: ' + new Date().toLocaleString());

        }
    )
}

function clickOrder(target) {
    // Sets the order of exchange table 
    const arrowIcon = $(`#${target}`).find('.arrow-icon');

    if (target === currentTarget) {
        if (arrowIcon.hasClass('rotate')) {
            arrowIcon.removeClass('rotate');
            order = true;
            if (target === "market") {
                order = false;
            }

            fillExchangeTable(exchangeData, currentTarget, order);

        } else {
            order = false;
            if (target === "market") {
                order = true;
            }

            arrowIcon.addClass('rotate');
            fillExchangeTable(exchangeData, currentTarget, order);
        }
    } else {
        const icon = $('.arrow-icon');
        icon.addClass('invisible');
        icon.removeClass('rotate');

        arrowIcon.removeClass('invisible');
        arrowIcon.addClass('rotate');
        currentTarget = target;
        order = false;
        if (currentTarget === "market") {
            order = true;
        }

        fillExchangeTable(exchangeData, currentTarget, order);
    }
}



function sortExchangeTable(exchangeData, column, asc) {
    // Sorting Exchange Table according to column and order
    // Column: market, price, volume
    // Order: asc, desc
    var index;
    var filteredColumn = [];
    var sortedExchangeTable = [];    

    // Getting column values
    exchangeData.forEach(
        (res) => {
            filteredColumn.push(res[column]);
        }
    );

    // Sorting values
    filteredColumn.sort();

    // Setting order
    if (asc === false) {
        filteredColumn.reverse();
    }

    // Getting rearranging data
    filteredColumn.forEach(data => {
        index = exchangeData.findIndex(item => item[column] === data);
        sortedExchangeTable.push(exchangeData[index]);
    })

    return sortedExchangeTable;
}

$("#table-header-market").css("border", "3px solid red");


function fillExchangeTable(exchangeData, sortColumn = "market", asc = true) {
    // Filling Exchange Table with Exchanges Data according to object passed in RefreshData
    $('.table-body').empty();
    let table = $('.table-body');
    recommendedMarket = getRecommendedMarket();
    
    // Sorting Exchange Table 
    exchangeData = sortExchangeTable(exchangeData, sortColumn, asc);

    exchangeData.forEach(data => {


        let line = $("<tr>").click(function() {             
            // Show exchange graph if user click on table line
            // fillChart(data.market);
            
            // Checking if Exchange is already on Chart
            let exchangeInChart = -1;            
            let index = 0;

            myChart.data.datasets.forEach(function (dataset) {
                if (dataset.label === data.market) {
                    exchangeInChart = index;                    
                    return   
                }      
                index = index + 1;
            })

            if (exchangeInChart > -1) {
                console.log('Exchange ' + data.market + ' already in Chart');
                removeChart(exchange);
                return 
            } else {
                addChart(data.market);
            }



        });

        let columnMarket = $("<td>").text(data.market);
        let columnPrice = $("<td>").text(parseFloat(data.price).toFixed(3));
        let columnVolumeFrom = $("<td>").text(parseFloat(data.lastVolumeFrom).toFixed(3));
        // let columnVolumeTo = $("<td>").text(parseFloat(data.lastVolumeTo).toFixed(2));

        if (data.market === recommendedMarket) {
            columnMarket.addClass('table-recommended')
            columnPrice.addClass('table-recommended')
            columnVolumeFrom.addClass('table-recommended')
        }

        line.append(columnMarket);
        line.append(columnPrice);
        line.append(columnVolumeFrom);
        // line.append(columnVolumeTo);
        table.append(line);
    });

}
// --------------------------------------------------------------



// -------------------------------------------------------------
// --- Chart Functions 
// ------------------------------------------------------------- 




function fillChart(exchange) {
    let tradeOption = $('.trade-option:selected').val();
    let toOption = $('.to-option:selected').val();
    
    limit = 30
    let x_axis = []
    let y_axis = []
    let volume = []
    let history
    https = `https://min-api.cryptocompare.com/data/histohour?fsym=${tradeOption}&tsym=${toOption}&limit=${limit}&aggregate=3&e=${exchange}`

    $.get(https, function (data) {
        history = data.Data;
    }).done(function () {
        
        history.forEach(function (snapshot) {
            x_axis.push(new Date(snapshot.time * 1000).toLocaleTimeString())
            y_axis.push(snapshot.close)            
        })

        minPrice = Math.min.apply(null, y_axis);
        maxPrice = Math.max.apply(null, y_axis);

        $('.min-price').text(`Minimum Price: ${minPrice}`);
        $('.max-price').text(`Maximum Price: ${maxPrice}`);

        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        // return "rgb(" + r + "," + g + "," + b + ")";

        var ctx = document.querySelector(".chart-graph").getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x_axis,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets:
                [ // {dataset1}, {dataset2}
                    {
                    label: exchange,
                    yAxisID: 'close',
                    borderColor: "rgb(" + r + "," + g + "," + b + ")",                   
                    // backgroundColor: '#FFF',
                    fill: false,
                    data: y_axis, //[12, 19, 3, 5, 2, 3],
                    // backgroundColor: [
                    //     'rgba(255, 99, 132, 0.2)',
                    //     'rgba(54, 162, 235, 0.2)',
                    //     'rgba(255, 206, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)',
                    //     'rgba(153, 102, 255, 0.2)',
                    //     'rgba(255, 159, 64, 0.2)'
                    // ],
                    // borderColor: [
                    //     'rgba(255,99,132,1)',
                    //     'rgba(54, 162, 235, 1)',
                    //     'rgba(255, 206, 86, 1)',
                    //     'rgba(75, 192, 192, 1)',
                    //     'rgba(153, 102, 255, 1)',
                    //     'rgba(255, 159, 64, 1)'
                    // ],
                    // borderWidth: 1
                }
                ]
                },
            options: {
                title: {display: true, text: 'Exchanges historical price', fontSize: 18},
                scales: {
                    yAxes: [
                        {
                            id: 'close',
                            position: 'left',
                            ticks: {beginAtZero: false}
                        }                
                    ]
                }
            }
        });

    })
}


function addChart(exchange) {

    let tradeOption = $('.trade-option:selected').val();
    let toOption = $('.to-option:selected').val();
    
    limit = 30
    let x_axis = []
    let y_axis = []    
    let history
    https = `https://min-api.cryptocompare.com/data/histohour?fsym=${tradeOption}&tsym=${toOption}&limit=${limit}&aggregate=3&e=${exchange}`

    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);

    $.get(https, function (data) {
        history = data.Data;
    }).done(function () {
        
        history.forEach(function (snapshot) {
            x_axis.push(new Date(snapshot.time * 1000).toLocaleTimeString())
            y_axis.push(snapshot.close)            
        })

        newDataset = {
            label: exchange,                
            borderColor: "rgb(" + r + "," + g + "," + b + ")",
            fill: false,
            data: y_axis
        }

        myChart.data.labels = x_axis;
        myChart.data.datasets.push(newDataset);
        myChart.update();
    })    
}

function removeChart(exchangeIndex) {
    // Removes a dataset from the chart by its index
    
    myChart.data.datasets.splice(exchangeIndex, 1);    
    myChart.update();
}

// ----------------------------------------------------------
//  Recommended Section Functions 
// ----------------------------------------------------------

// function getRecommended
// function fillRecommended

function getBitcoinFees() {
    $.get('https://bitcoinfees.earn.com/api/v1/fees/recommended', function (data) {
        fees = data;
    }).done(
        () => {            
            $('#highFee').text('High: ' + fees.fastestFee);
            $('#mediumFee').text('Medium: ' + fees.halfHourFee);
            $('#lowFee').text('Low: ' + fees.hourFee);
        }
    )
}

// getRecommendedMarket()
function getRecommendedMarket() {
    
    let recommendedMarket;
    biggestPrice = 0;

    exchangeData.forEach(function (exchange) {        
        if (exchange.price > biggestPrice) {
            recommendedMarket = exchange.market;
            biggestPrice = exchange.price;
        }
    })
    
    return recommendedMarket;
}



















function fillChart2(exchange) {
    let tradeOption = $('.trade-option:selected').val();
    let toOption = $('.to-option:selected').val();
    
    limit = 30
    let x_axis = []
    let y_axis = []
    let volume = []
    let history
    https = `https://min-api.cryptocompare.com/data/histohour?fsym=${tradeOption}&tsym=${toOption}&limit=${limit}&aggregate=3&e=${exchange}`

    $.get(https, function (data) {
        history = data.Data;
    }).done(function () {
        
        history.forEach(function (snapshot) {
            x_axis.push(new Date(snapshot.time * 1000).toLocaleTimeString())
            y_axis.push(snapshot.close)
            volume.push(snapshot.volumefrom);
        })

        minPrice = Math.min.apply(null, y_axis);
        maxPrice = Math.max.apply(null, y_axis);

        $('.min-price').text(`Minimum Price: ${minPrice}`);
        $('.max-price').text(`Maximum Price: ${maxPrice}`);

        var ctx = document.querySelector(".chart-graph").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x_axis,//["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets:
                [ // {dataset1}, {dataset2}
                    {
                    label: 'Close Price',
                    yAxisID: 'close',
                    borderColor: '#002244',
                    // backgroundColor: '#FFF',
                    fill: false,
                    data: y_axis, //[12, 19, 3, 5, 2, 3],
                    // backgroundColor: [
                    //     'rgba(255, 99, 132, 0.2)',
                    //     'rgba(54, 162, 235, 0.2)',
                    //     'rgba(255, 206, 86, 0.2)',
                    //     'rgba(75, 192, 192, 0.2)',
                    //     'rgba(153, 102, 255, 0.2)',
                    //     'rgba(255, 159, 64, 0.2)'
                    // ],
                    // borderColor: [
                    //     'rgba(255,99,132,1)',
                    //     'rgba(54, 162, 235, 1)',
                    //     'rgba(255, 206, 86, 1)',
                    //     'rgba(75, 192, 192, 1)',
                    //     'rgba(153, 102, 255, 1)',
                    //     'rgba(255, 159, 64, 1)'
                    // ],
                    // borderWidth: 1
                }, {
                    label: 'Volume',
                    yAxisID: 'volume',
                    borderColor: '#F00',
                    fill: false,
                    data: volume
                }
            ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            id: 'close',
                            position: 'left',
                            ticks: {beginAtZero: false}
                        },
                        {
                            id: 'volume',
                            position: 'right',
                            ticks: {beginAtZero: true}
                        }                    
                    ]
                }
            }
        });

    })
}






// createCORSRequest(method = "GET", url)
// function createCORSRequest(method, url) {
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr) {

//       // Check if the XMLHttpRequest object has a "withCredentials" property.
//       // "withCredentials" only exists on XMLHTTPRequest2 objects.
//       xhr.open(method, url, true);

//     } else if (typeof XDomainRequest != "undefined") {

//       // Otherwise, check if XDomainRequest.
//       // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
//       xhr = new XDomainRequest();
//       xhr.open(method, url);

//     } else {

//       // Otherwise, CORS is not supported by the browser.
//       xhr = null;

//     }
//     return xhr;
//   }


//   / Make the actual CORS request.
//https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related
// https://www.html5rocks.com/en/tutorials/cors/
// makeCorsRequest() 
// function makeCorsRequest() {
// // This is a sample server that supports CORS.
// var url =  apiUrl + 'coinsList/';

// var xhr = createCORSRequest('GET', url);
// if (!xhr) {
//     alert('CORS not supported');
//     return;
// }

// xhr.withCredentials = true;

// // Response handlers.
// xhr.onload = function() {
//     var text = xhr.responseText;
//     var title = getTitle(text);
//     alert('Response from CORS request to ' + url + ': ' + title);
// };

// xhr.onerror = function() {
//     alert('Woops, there was an error making the request.');
// };

// xhr.send();
// }