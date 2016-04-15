from equations.serializers import EquationSerializer, EquationSerializerMin
from rest_framework import viewsets
from equations.models import *
from rest_framework.response import Response


class EquationViewSet(viewsets.ModelViewSet):
    serializer_class = EquationSerializer
    queryset = Equation.objects.all()

    def list(self, request):
        queryset = Equation.objects.all()
        serializer = EquationSerializerMin(queryset, many=True)
        return Response(serializer.data)