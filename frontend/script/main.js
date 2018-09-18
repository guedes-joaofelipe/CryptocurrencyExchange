
let market
let coinsList = []
let coinsName = []
let exchangeData; // global
let originCoin;
let destinyCoin;
let currentTarget = ''
let apiUrl = 'http://127.0.0.1:8000/api/'

$('.button-refresh').click(refreshData);

// https://api.cryptonator.com/api/full/btc-ETH
// https://api.cryptonator.com/api/full/eth-usd
// https://api.cryptonator.com/api/full/32bit-btc
// https://api.cryptonator.com/api/full/aba-eth

refreshData('btc', 'usd');

$('.title-table').click(
    function ($event) { // gets user clicked item id
        clickOrder(event.target.id);
    }
)

$('.switch-container').click(
    function () {
        // // Get trade selected option
        $('.trade-option:selected').val($('.to-option:selected').val()); // LTC
        $('.trade-option:selected').text($('.to-option:selected').text()); // LTC

        // Get to selected option
        // toOptionVal = $('.to-option:selected').val(); // BTC
        // toOptionText = $('.to-option:selected').text(); // BTC
        // console.log(toOptionVal)

        // // Swap selected options
        // // $('.trade-option:select').val(toOption);
        // // $('.to-option:select').val(tradeOption);
        // $('.trade-option:selected').text(toOptionText).change();
        // $('.to-option:selected').text(tradeOptionText).change();
        // $('.trade-option:selected').val(toOptionVal).change();
        // $('.to-option:selected').val(tradeOptionVal).change();
        
        
    }
)

function clickOrder(target) {

    const arrowIcon = $(`#${target}`).find('.arrow-icon');

    if (target === currentTarget) {
        if (arrowIcon.hasClass('rotate')) {
            arrowIcon.removeClass('rotate');
            order = true;
            if (target === "market"){
                order = false;
            }

            fillExchangeTable(exchangeData.ticker.markets, currentTarget, order);

        } else {
            order = false;
            if (target === "market"){
                order = true;
            }

            arrowIcon.addClass('rotate');
            fillExchangeTable(exchangeData.ticker.markets, currentTarget, order);
        }
    } else {
        const icon = $('.arrow-icon');
        icon.addClass('invisible');
        icon.removeClass('rotate');

        arrowIcon.removeClass('invisible');
        arrowIcon.addClass('rotate');
        currentTarget = target;
        order = false;
        if (currentTarget === "market"){
            order = true;
        }

        fillExchangeTable(exchangeData.ticker.markets, currentTarget, order);
    }
}


getCoinList()
function getCoinList() {

    // url_coins_list = 'http://127.0.0.1:8000/api/coinsList/'
    url_coins_list = apiUrl + 'coinsList/'
    // url_coins_list = 'https://www.cryptocompare.com/api/data/coinlist'
    // console.log(url_coins_list)
    $.get(url_coins_list, function (data) {
        
        retrievedCoinsList = data;
    }).done(
        () => {            
            $('#trade').empty();
            $('#to').empty();

            // console.log(retrievedCoinsList)

            retrievedCoinsList.forEach(value => {
                const coin = {
                    name: value.fullName,                    
                    img: value.baseUrl + value.imageUrl,
                    isTrading: value.isTrading,
                    ticker: value.ticker
                }

                //console.log(coin);
                coinsList.push(coin);

                if (coin.ticker === "BTC") {
                    $('#trade').append($(`<option class = "trade-option" value = "${coin.ticker}" selected>${coin.name}</option>`));
                } else {
                    $('#trade').append($(`<option class = "trade-option" value = "${coin.ticker}">${coin.name}</option>`));
                }

                if (coin.ticker === "LTC") {
                    console.log('Tickier', coin.ticker);
                    $('#to').append($(`<option class = "to-option" value = "${coin.ticker}" selected>${coin.name}</option>`));
                } else {
                    $('#to').append($(`<option class = "to-option" value = "${coin.ticker}">${coin.name}</option>`));
                }
                
                
            })

            // return coinsList;
        }
    )
   
}

// change coin method 
$('#trade').change( getTradeOption );

// function changeTradeOption
// function getTradeOption
// function changeToOption
// function getToOption
// function getRecommended
// function fillExchangeTable
// function fillChart
// function fillRecommended

function getTradeOption() {
    let option = $('.trade-option:selected').val();
    
    let coin = coinsList.find(x => x.ticker === option)
    console.log(coin);
    console.log($('.trade-logo'));
    


}
// ----





//getBitcoinFees();

function getBitcoinFees() {
    $.get('https://bitcoinfees.earn.com/api/v1/fees/recommended', function (data) {
        fees = data;
    }).done(
        () => {
            console.log(fees);
            $('#highFee').text('High: ' + fees.fastestFee);
            $('#mediumFee').text('Medium: ' + fees.halfHourFee);
            $('#lowFee').text('Low: ' + fees.hourFee);
        }
    )
}

function getExchangeData(originCoin, destinyCoin) {
    $.get(`https://api.cryptonator.com/api/full/${originCoin.toLowerCase()}-${destinyCoin.toLowerCase()}/`, function (data) {
        exchangeData = data;
    })

    return exchangeData

}

function refreshData(originCoin, destinyCoin) {
    $.get(`https://api.cryptonator.com/api/full/${originCoin}-${destinyCoin}`, function (data) {
        exchangeData = data;
    }).done(
        () => {
            exchangeData.ticker.markets.forEach((content) => {
                content.price = parseFloat(content.price);
            })

            fillExchangeTable(exchangeData.ticker.markets, "market", "asc");
            $('.last-updated').text(
                'Last Updated: ' + new Date().toLocaleString()
            )
        }
    )
}

function getRecommendedMarket() {
    return "ACX";
}


function sortExchangeTable(exchangeData, column, asc) {
    // Column: Market, Price, Volume
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

function fillExchangeTable(exchangeData, sortColumn, order) {

    $('.table-body').empty();
    let table = $('.table-body');

    // let lineTitle = $("<tr>");
    // let titleMarket = $("<th id = \"table-header-market\">").text("Market");
    // let titlePrice = $("<th id = \"table-header-price\">").text("Price");
    // let titleVolume = $("<th id = \"table-header-volume\">").text("Volume");

    // lineTitle.append(titleMarket);
    // lineTitle.append(titlePrice);
    // lineTitle.append(titleVolume);

    // table.append(lineTitle);

    let recommendedMarket = getRecommendedMarket();

    // console.log(exchangeData);

    exchangeData = sortExchangeTable(exchangeData, sortColumn, order);

    // console.log(exchangeData);

    exchangeData.forEach(data => {

        let line = $("<tr>");

        let columnMarket = $("<td>").text(data.market);
        let columnPrice = $("<td>").text(parseFloat(data.price).toFixed(2));
        let columnVolume = $("<td>").text(parseFloat(data.volume).toFixed(2));

        if (data.market === recommendedMarket) {
            console.log(data.market);
            console.log(recommendedMarket);
            columnMarket.addClass('table-recommended')
            columnPrice.addClass('table-recommended')
            columnVolume.addClass('table-recommended')
        }

        line.append(columnMarket);
        line.append(columnPrice);
        line.append(columnVolume);


        // if (data.market === recommendedMarket) {
        //     console.log(data.market);
        //     console.log(recommendedMarket);
        //     $("<tr>").addClass(".table-recommended");
        // }


        table.append(line);
    });

    $("#table-header-market").click(function () {
        console.log("Order market header");
    });

}

console.log(coinsList);