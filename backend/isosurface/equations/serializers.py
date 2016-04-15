from rest_framework import serializers
from equations.models import *


class EquationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equation
        fields = ('__all__')

class EquationSerializerMin(serializers.ModelSerializer):
    class Meta:
        model = Equation
        fields = ('id', 'name')
