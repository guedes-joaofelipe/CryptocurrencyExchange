from . import views 
from django.conf.urls import include, url

# namespacing the url (this enables us to have views with the same name on multiple apps)
app_name = 'api'

urlpatterns = [
    # path: (What regular expression to look for, what view function to execute)    
    #url(r'^$', views.index, name = "index"), # The default homepage (user did not request a thing),
    url(r'^coinsList/$', views.CryptocurrencyList.as_view()),    
    url(r'^coinsList/updateCoinsData/$', views.updateCoinsData, name = "updateCoins"),    
    url(r'^coinsList/(?P<ticker>[0-9A-Za-z]+)/$', views.coinDetail, name = "coinDetail"), # saves whatever comes in /coinsList/[0-9A-Za-z] to a variable ticker
    
    url(r'^exchangesList/$', views.ExchangeList.as_view()),    
    url(r'^exchangesList/updateExchangesData/$', views.updateExchangesData, name = "updateExchanges"), 
    url(r'^exchangesList/(?P<name>[0-9A-Za-z]+)/$', views.exchangeDetail, name = "exchangeDetail"),   

    url(r'^pricesList/$', views.PriceList.as_view()),    
    # pricesList/updatePricesData/trade=BTC&to=USD&exchange=CCCAGG&limit=60
    url(r'^pricesList/updatePricesData/trade=(?P<coinOrigin>[0-9A-Za-z]+)&to=(?P<coinDestiny>[0-9A-Za-z]+)&exchange=(?P<exchange>[0-9A-Za-z]+)&limit=(?P<limit>[0-9]+)$', views.updatePricesData, name = "updatePrices"), 
    #url(r'^pricesList/(?P<name>[0-9A-Za-z]+)/$', views.exchangeDetail, name = "exchangeDetail"),   
    #coinSnapshot/trade=BTC&to=ETH)
    url(r'^coinSnapshot/trade=(?P<coinOrigin>[0-9A-Za-z]+)&to=(?P<coinDestiny>[0-9A-Za-z]+)$', views.priceSnapshot, name = "priceSnapshot"), 

]
