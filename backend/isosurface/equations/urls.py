from django.conf.urls import url, include
from rest_framework import routers
from equations import views

router = routers.DefaultRouter()
router.register(r'equation', views.EquationViewSet)

urlpatterns = [
    url(r'', include(router.urls)),
]
