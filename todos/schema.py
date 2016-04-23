from graphene import ObjectType, Field, relay
from graphene.contrib.django.types import DjangoNode

from . import models

class User(DjangoNode):
    class Meta:
        model = models.UserModel
        
class Todo(DjangoNode):
    class Meta:
        model = models.TodoModel

class Query(ObjectType):
    user = relay.NodeField(User)
    todo = relay.NodeField(Todo)
    viewer = Field(User)
    
    def solve_viewer(self, args, info):
        request = info.request_context