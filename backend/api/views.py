from django.shortcuts import get_object_or_404 # Return object or an error
from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status
from .models import Cryptocurrency, Exchange, Price
from .serializers import CryptocurrencySerializer, ExchangeSerializer, PriceSerializer
from django.http import JsonResponse, Http404
import requests  

# Create your views here.

# Lists all cryptocurrencies or create a new one
# cryptocurrency/list
class CryptocurrencyList(APIView):
    def get(self, request):
        cryptocurrencies = Cryptocurrency.objects.all()
        serializer = CryptocurrencySerializer(cryptocurrencies, many = True) # Many: return multiple json objects instead of just one
        print (serializer.data)
        return Response(serializer.data) # Just the json data

def updateCoinsData(request):    
    request_result = requests.get('https://min-api.cryptocompare.com/data/all/coinlist')
    request_json = request_result.json()

    baseUrl = request_json['BaseImageUrl']

    for coinTicker, coinInfo in request_json['Data'].items():

        try: 
            # if cryptocurrency exists, gets saved data to be updated (preserves existing ID)
            cryptocurrency = Cryptocurrency.objects.get(ticker = coinTicker)
        
        except Cryptocurrency.DoesNotExist:
            # if id does not exist, we create a new one with a new id
            cryptocurrency = Cryptocurrency(ticker = coinTicker)

        # Tries to set attribute to object. If info does not exists, sets None
        cryptocurrency.baseUrl = baseUrl
        cryptocurrency.coinName = coinInfo.get('CoinName', None)
        cryptocurrency.fullName = coinInfo.get('FullName', None)
        cryptocurrency.imageUrl = coinInfo.get('ImageUrl', None)
        cryptocurrency.overviewUrl = coinInfo.get('Url', None)
        cryptocurrency.isTrading = coinInfo.get('IsTrading', None)
        cryptocurrency.save()

    # Returns updated list    
    #return Http200()


# List details of a given Coin through its ticker
def coinDetail(request, ticker):    
    # cryptocurrency = get_object_or_404(Cryptocurrency, ticker = ticker)
    # print (cryptocurrency)
    # serializer = CryptocurrencySerializer(cryptocurrency)
    # return JsonResponse(serializer.data, safe = False)    

    try: 
        cryptocurrency = Cryptocurrency.objects.get(ticker = ticker)
        serializer = CryptocurrencySerializer(cryptocurrency)
        return JsonResponse(serializer.data, safe = False)    


    # if id does not exist, an error is raised
    except Cryptocurrency.DoesNotExist:

        # Update coinsList
        # ---- To be implemented     
        # Trying to get from cryptocompare
        raise Http404("Coin ticker {} does not exist".format(ticker))



##############################
#  Exchange Class Functions
##############################


class ExchangeList(APIView):
    def get(self, request):
        exchange = Exchange.objects.all()
        serializer = ExchangeSerializer(exchange, many = True) # Many: return multiple json objects instead of just one
        print (serializer.data)
        return Response(serializer.data) # Just the json data

    
def updateExchangesData(request):    
    request_result = requests.get('https://www.cryptocompare.com/api/data/exchanges')
    request_json = request_result.json()

    baseUrl = 'https://www.cryptocompare.com'

    for exchangeName, exchangeInfo in request_json['Data'].items():
        try: 
            # if cryptocurrency exists, gets saved data to be updated (preserves existing ID)
            exchange = Exchange.objects.get(name = exchangeName)
        
        except Exchange.DoesNotExist:
            # if id does not exist, we create a new one with a new id
            exchange = Exchange(name = exchangeName)

        # Tries to set attribute to object. If info does not exists, sets None
        exchange.baseUrl = baseUrl
        exchange.country = exchangeInfo.get('Country')
        exchange.isTrading = exchangeInfo.get('Trades', None)
        exchange.logoUrl = exchangeInfo.get('LogoUrl', None)
        exchange.sponsored = exchangeInfo.get('Sponsored', None)
        exchange.recommended = exchangeInfo.get('Recommended', None)
        exchange.affiliatedUrl = exchangeInfo.get('AffiliateUrl', None)
        exchange.save()

    # Returns updated list    
    #return Http200()

# List details of a given Coin through its ticker
def exchangeDetail(request, name):    
    # cryptocurrency = get_object_or_404(Cryptocurrency, ticker = ticker)
    # print (cryptocurrency)
    # serializer = CryptocurrencySerializer(cryptocurrency)
    # return JsonResponse(serializer.data, safe = False)    

    try: 
        exchange = Exchange.objects.get(name = name)
        serializer = ExchangeSerializer(exchange)
        return JsonResponse(serializer.data, safe = False)    


    # if id does not exist, an error is raised
    except Exchange.DoesNotExist:

        # Trying to get from cryptocompare
        raise Http404("Exchange {} does not exist".format(name))




##############################
#  Price Class Functions
##############################


class PriceList(APIView):
    def get(self, request):
        price = Price.objects.all()
        serializer = PriceSerializer(price, many = True) # Many: return multiple json objects instead of just one
        print (serializer.data)
        return Response(serializer.data) # Just the json data

    
def updatePricesData(request, coinOrigin, coinDestiny, exchange, limit):    
    # http://127.0.0.1:8000/api/pricesList/updatePricesData/trade=BTC&to=ETH&exchange=Coincap&limit=60
    # limit = 60
    https = 'https://min-api.cryptocompare.com/data/histominute?fsym={0}&tsym={1}&limit={2}&aggregate=3&e={3}'.format(coinOrigin, coinDestiny, limit, exchange)
    request_result = requests.get(https)
    request_json = request_result.json()

    for priceDict in request_json['Data']:
        # print (priceDict)        
        # print ("From: ", coinOrigin)
        cryptocurrencyOrigin = Cryptocurrency.objects.get(ticker = coinOrigin)

        # print ("To: ", coinDestiny)
        cryptocurrencyDestiny = Cryptocurrency.objects.get(ticker = coinDestiny)

        # print ("Where: ", exchange)        
        exchangeObject = Exchange.objects.get(name = exchange)
        # print ("Found")

        try: 
            # if cryptocurrency exists, gets saved data to be updated (preserves existing ID)            
            price = Price.objects.get(idCoinOrigin = cryptocurrencyOrigin.id, idCoinDestiny = cryptocurrencyDestiny.id, idExchange = exchangeObject.id, timestamp = priceDict['time'])
        
        except Price.DoesNotExist:
            # if id does not exist, we create a new one with a new id
            price = Price(idCoinOrigin = cryptocurrencyOrigin.id, idCoinDestiny = cryptocurrencyDestiny.id, idExchange = exchangeObject.id, timestamp = priceDict['time'])

        # Tries to set attribute to object. If info does not exists, sets None
        
        price.close = priceDict['close']
        price.high = priceDict['high']
        price.low = priceDict['low']
        price.open = priceDict['open']        
        price.volumeOrigin = priceDict['volumefrom']
        price.volumeDestiny = priceDict['volumeto']
        price.save()

    # Returns updated list    
    #return Http200()

# List details of a given Coin through its ticker
def priceDetail(request, coinOrigin, coinDestiny, exchange, limit = None):    
    # cryptocurrency = get_object_or_404(Cryptocurrency, ticker = ticker)
    # print (cryptocurrency)
    # serializer = CryptocurrencySerializer(cryptocurrency)
    # return JsonResponse(serializer.data, safe = False)    

    coinOrigin = Cryptocurrency.objects.get(ticker = coinOrigin)
    coinDestiny = Cryptocurrency.objects.get(ticker = coinDestiny)
    exchange = Exchange.objects.get(name = exchange)

    try: 
        # # if cryptocurrency exists, gets saved data to be updated (preserves existing ID)            
        # price = Price.objects.get(idCoinOrigin = coinOrigin.id, idCoinDestiny = coinDestiny.id, idExchange = exchange, timestamp = priceDict['time'])
        # serializer = ExchangeSerializer(price)
        # return JsonResponse(serializer.data, safe = False)    

        https = 'https://min-api.cryptocompare.com/data/histominute?fsym={0}&tsym={1}&limit={2}&aggregate=3&e={3}'.format(coinOrigin, coinDestiny, limit, exchange)
        request_result = requests.get(https)
        request_json = request_result.json()

        return Response(request_json) # Just the json data


    except Price.DoesNotExist:
        # if id does not exist, we create a new one with a new id
        raise Http404("Price data from {} to {} in {} does not exist".format(coinOrigin.ticker, coinDestiny.ticker, exchange.name))


    

