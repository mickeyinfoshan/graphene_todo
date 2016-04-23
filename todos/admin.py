from django.contrib import admin

# Register your models here.
from . import models

admin.site.register(models.UserModel)
admin.site.register(models.TodoModel)