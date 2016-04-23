from __future__ import unicode_literals

from django.db import models

# Create your models here.

class UserModel(models.Model):
    created_date = models.DateField(auto_now_add=True)

class TodoModel(models.Model):
    text = models.CharField(max_length=50)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(UserModel, related_name="todos")