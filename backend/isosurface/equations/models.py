from __future__ import unicode_literals

from django.contrib.postgres.fields import JSONField
from django.db import models

# Create your models here.

class Equation(models.Model):
    name = models.CharField(max_length=200, blank=True)
    data = JSONField(blank=True)
    dimension = JSONField(blank=True)
    vertexCount= models.IntegerField(blank=True)
    faceCount= models.IntegerField(blank=True)
    equation= models.TextField(blank=True)
    boundingBox = JSONField(blank=True)

    def __str__(self):
        return self.name