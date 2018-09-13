
let market
let coinsList = []
let coinsName = []

$('.button-refresh').click(refreshData)
refreshData();

getCoinList();

function getCoinList() {
    $.get('/coinList.json', function(data){
        coinsList = data;
    }).done(
        () => {
            console.log(coinsList)
            // coinsList.forEach(value => {
            //     const coin = {
            //         name: value.FullName,
            //         img: 'https://www.cryptocompare.com' + coin.ImageUrl
            //     }

            //     coinsName.append(coin);
            // })
        }
    )
}

function refreshData() {
    $.get('https://api.cryptonator.com/api/full/btc-usd', function(data) {
        market = data;
    }).done (
        () => {
            preencherPagina(market.ticker.markets);
            $('.last-updated').text(
                'Last Updated: ' + new Date().toLocaleString()
            )
        }
    )
}


function preencherPagina(market) {

    $('.table').empty();
    let table = $('.table');
    
    let lineTitle = $("<tr>");
    let titleMarket = $("<th>").text("Market");
    let titlePrice = $("<th>").text("Price");
    let titleVolume = $("<th>").text("Volume");

    lineTitle.append(titleMarket);
    lineTitle.append(titlePrice);
    lineTitle.append(titleVolume);

    table.append(lineTitle);

    market.forEach(data => {

        let line = $("<tr>");

        let columnMarket = $("<td>").text(data.market);
        let columnPrice = $("<td>").text(parseFloat(data.price).toFixed(2));
        let columnVolume = $("<td>").text(parseFloat(data.volume).toFixed(2));

        line.append(columnMarket);
        line.append(columnPrice);
        line.append(columnVolume);
        table.append(line);
    });

}