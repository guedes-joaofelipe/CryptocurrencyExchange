# Cryptocurrency Exchange

Much like regular currencies like dollar and pounds, cryptocurrencies also have exchange markets in order to sell or buy one for another. However, these cryptocurrencies also suffer daily variations and analysing its historical values might result on a better exchange. 

In this sense, **Cryptocurrency Exchange** is a web app that provides historical exchange prices between cryptocurrency markets and a proposal of recommended market to be used in the current day. User can choose among several origin-to-target cryptocurrencies and gets a near-real time exchange rate. Exchange fees are also provided in the web app. 

![](/frontend/img/example_screen.png)

## Architecture

All data is retrieved from two main API resources: 

- [CryptoCompare](https://www.cryptocompare.com/api/): a cryptocurrency API for both current and historical data, such as prices, trading volumes and coins' metadata (tickers, images, fullnames, etc.)
- [BitcoinFees](https://bitcoinfees.earn.com/api): a fee recommender for Bitcoin transactions in satoshis per byte. 

The repository is divided as follows: 
- Frontend
    The front-end was developed using HTML, CSS and Javascript, including [jQuery](https://jquery.com) and [Chart.js](http://www.chartjs.org) (a javascript library to create and manipulate graphs)

- Backend
   The back-end was developed using Python3.6, SQLite3 and [Django Framework](http://www.django-rest-framework.org). 


## Installation 

In order to run the backend system, the following packages need to be installed: 
- django
- djangorestframework

Therefore, if you use the pip library installer, run the commands:

```
pip3 install django
pip3 install djangorestframework
```

Afterwards, clone the existing repository using 

```
git clone https://github.com/guedes-joaofelipe/CryptocurrencyExchange.git
```

## Usage

To run the backend server, open any terminal in the cloned repository and run:

```
python3 ./backend/manage.py runserver
```

Then open the **index.html** contained in the **./frontend** file and you should be able to run the project smoothly. 

--------------

#### Release Notes:
**[09/19/2018]**: 
- Django API seems to be having issues with cross domain access denials. As for this point, a [Chrome extension](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) can be installed in order to allow communication with API. 
