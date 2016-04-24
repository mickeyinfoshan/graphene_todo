from graphene import ObjectType, Field, relay, String
from graphene.contrib.django.types import DjangoNode
from graphql_relay.node.node import from_global_id
from graphql_relay.connection.arrayconnection import offset_to_cursor

import graphene

from . import models

class User(DjangoNode):
    class Meta:
        model = models.UserModel
        
class Todo(DjangoNode):
    class Meta:
        model = models.TodoModel
        filter_fields = ['completed']

class CompleteTodo(relay.ClientIDMutation):
    
    class Input:
        id = String(required=True)
    
    todo = Field(Todo)
    viewer = Field(User)
    
    @classmethod
    def mutate_and_get_payload(cls, input, info):
        global_id = input.get("id")
        id = from_global_id(global_id).id
        todo = models.TodoModel.objects.get(pk=id)
        todo.completed = not todo.completed
        todo.save()
        viewer = todo.user
        return CompleteTodo(todo=todo, viewer=viewer)

class RemoveTodo(relay.ClientIDMutation):

    class Input:
        id = String(required=True)
     
    viewer = Field(User)
    todoId = String()
    
    @classmethod
    def mutate_and_get_payload(cls, input, info):
        global_id = input.get("id")
        id = from_global_id(global_id).id
        todo = models.TodoModel.objects.get(pk=id)        
        viewer = todo.user
        todo.delete()
        return RemoveTodo(viewer=viewer, todoId=global_id)

class AddTodo(relay.ClientIDMutation):

    class Input:
        text = String(required=True)
        
    viewer = Field(User)
    todoEdge = Field(relay.types.Edge.for_node(Todo))
    
    @classmethod
    def mutate_and_get_payload(cls, input, info):
        viewer = get_viewer(info.request_context)
        todo = viewer.todos.create(text=input.get("text"))
        cursor = offset_to_cursor(viewer.todos.count() - 1)
        edge = relay.types.Edge.for_node(Todo)(node=todo, cursor=cursor)
        return AddTodo(viewer=viewer, todoEdge=edge)
    

class ClearCompletedTodo(relay.ClientIDMutation):
    viewer = Field(User)
    class Input:
        pass
    @classmethod
    def mutate_and_get_payload(cls, input, info):
        viewer = get_viewer(info.request_context)
        viewer.todos.filter(completed=True).delete()
        return ClearCompletedTodo(viewer=viewer)
    

class Query(ObjectType):
    user = relay.NodeField(User)
    todo = relay.NodeField(Todo)
    viewer = Field(User)
    
    def resolve_viewer(self, args, info):
        request = info.request_context
        return get_viewer(request)
            
    class Meta:
        abstract = True

class Mutation(ObjectType):
    completeTodo = Field(CompleteTodo)
    removeTodo = Field(RemoveTodo)
    clearCompletedTodo = Field(ClearCompletedTodo)
    addTodo = Field(AddTodo)
    class Meta:
        abstract = True

def get_viewer(request):
    VIEWER_ID_KEY = 'viewer_id'
    user_id = request.session.get(VIEWER_ID_KEY)
    viewer = None
    if user_id == None:
        viewer = models.UserModel()
        viewer.save()
        request.session[VIEWER_ID_KEY] = viewer.id
    else:
        viewer = models.UserModel.objects.get(pk=user_id)
    return viewer