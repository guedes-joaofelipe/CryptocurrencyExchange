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

    # /music/albumId/
    # name references 
    #url(r'^(?P<album_id>[0-9]+)/$', views.detail, name = "detail"), # saves whatever comes in [0-9] to a variable album_id

    # /music/<album_id>/favorite/
    #url(r'^(?P<album_id>[0-9]+)/favorite/$', views.favorite, name = "favorite"), 
    

]
