from graphene import ObjectType, Field, relay
from graphene.contrib.django.types import DjangoNode

from . import models

class User(DjangoNode):
    class Meta:
        model = models.UserModel
        
class Todo(DjangoNode):
    class Meta:
        model = models.TodoModel
        filter_fields = ['completed']

class Query(ObjectType):
    user = relay.NodeField(User)
    todo = relay.NodeField(Todo)
    viewer = Field(User)
    
    def resolve_viewer(self, args, info):
        VIEWER_ID_KEY = 'viewer_id'
        request = info.request_context
        user_id = request.session.get(VIEWER_ID_KEY)
        viewer = None
        if user_id == None:
            viewer = models.UserModel()
            viewer.save()
            request.session[VIEWER_ID_KEY] = viewer.id
        else:
            viewer = models.UserModel.objects.get(pk=user_id)
        return viewer
    
    class Meta:
        abstract = True