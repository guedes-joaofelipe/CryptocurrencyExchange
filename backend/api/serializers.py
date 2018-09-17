# A serializer converts a class object into a json object so we can transfer it to users if requested

from rest_framework import serializers
from . models import Cryptocurrency, Exchange 

# Template: [modelName]Serializer(serializers.ModelSerializer)
class CryptocurrencySerializer(serializers.ModelSerializer):

    class Meta: 
        # which model to serializer
        model = Cryptocurrency 
        
        # which atributes to return
        # fields = ('ticker', 'coinName') # If you want to specify which atributes to return
        fields = '__all__' # If you want to return all atributes
        
class ExchangeSerializer(serializers.ModelSerializer):
    
    class Meta: 
        # which model to serializer
        model = Exchange 
        
        # which atributes to return
        # fields = ('ticker', 'coinName') # If you want to specify which atributes to return
        fields = '__all__' # If you want to return all atributes