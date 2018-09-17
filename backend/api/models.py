from django.db import models

# Create your models here.
class Cryptocurrency(models.Model):    
    # https://min-api.cryptocompare.com/data/all/coinlist
    ticker = models.CharField(max_length = 10) # DOGE
    coinName = models.CharField(max_length = 100) # Dogecoin
    fullName = models.CharField(max_length = 200, blank = True) # Dogecoin (DOGE)
    baseUrl = models.CharField(max_length = 1000, blank = True) # https://www.cryptocompare.com
    imageUrl = models.CharField(max_length = 1000, blank = True) # '/media/19684/doge.png' (must be appended with baseUrl)
    overviewUrl = models.CharField(max_length = 1000, blank = True) # '/coins/DOGE/overview'
    isTrading = models.BooleanField() # True

    def __str__(self):
        return self.fullName


class Exchange(models.Model):
    # = 'https://www.cryptocompare.com/api/data/exchanges'
    name = models.CharField(max_length = 100)
    country = models.CharField(max_length = 200)
    isTrading = models.BooleanField()    
    logoUrl = models.CharField(max_length = 1000, blank = True)
    sponsored = models.BooleanField(blank = True)
    recommended = models.BooleanField(blank = True)
    affiliatedUrl = models.CharField(max_length = 1000, blank = True)

    def __str__(self):
        return self.name

class Price(models.Model):
    idCoinOrigin = models.IntegerField()
    idCoinDestiny = models.IntegerField()
    idExchange = models.IntegerField()
    close = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    open = models.FloatField()
    timestamp = models.IntegerField()
    volumeOrigin = models.FloatField()
    volumeDestiny = models.FloatField()

    def __str__(self):
        coinOrigin = Cryptocurrency.objects.get(pk = self.idCoinOrigin).ticker
        coinDestiny = Cryptocurrency.objects.get(pk = self.idCoinDestiny).ticker        

        return "From-{}_To-{}_at-{}".format(coinOrigin, coinDestiny, self.timestamp)

