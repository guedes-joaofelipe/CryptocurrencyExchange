from django.shortcuts import get_object_or_404 # Return object or an error
from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status
from .models import Cryptocurrency, Exchange
from .serializers import CryptocurrencySerializer, ExchangeSerializer
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
