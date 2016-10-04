from graphene import Node, AbstractType, ObjectType, Field, relay, String, Int, List, Boolean
from graphene_django import DjangoObjectType
from graphql_relay.node.node import from_global_id, to_global_id
from graphql_relay.connection.arrayconnection import offset_to_cursor

import graphene

from . import models

class User(DjangoObjectType):
    class Meta:
        model = models.UserModel
        interfaces = (Node, )

    totalCount = Int()
    completedCount = Int()

    def resolve_totalCount(self, args, context, info):
        return self.todos.count()

    def resolve_completedCount(self, args, context, info):
        return self.todos.filter(completed=True).count()

class Todo(DjangoObjectType):
    class Meta:
        model = models.TodoModel
        filter_fields = ['completed']
        interfaces = (Node, )

class ToggleTodoComplete(relay.ClientIDMutation):

    class Input:
        id = String(required=True)

    todo = Field(Todo)
    viewer = Field(User)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        global_id = input.get("id")
        id = from_global_id(global_id)[1]
        todo = models.TodoModel.objects.get(pk=id)
        todo.completed = not todo.completed
        todo.save()
        viewer = todo.user
        return ToggleTodoComplete(todo=todo, viewer=viewer)

class RemoveTodo(relay.ClientIDMutation):

    class Input:
        id = String(required=True)

    viewer = Field(User)
    todoId = String()

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        global_id = input.get("id")
        id = from_global_id(global_id)[1]
        todo = models.TodoModel.objects.get(pk=id)
        viewer = todo.user
        todo.delete()
        return RemoveTodo(viewer=viewer, todoId=global_id)

class AddTodo(relay.ClientIDMutation):

    class Input:
        text = String(required=True)

    viewer = Field(User)
    todoEdge = Field(Todo.Connection.Edge)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        viewer = get_viewer(context)
        todo = viewer.todos.create(text=input.get("text"))
        cursor = offset_to_cursor(viewer.todos.count() - 1)
        edge = Todo.Connection.Edge(node=todo, cursor=cursor)
        return AddTodo(viewer=viewer, todoEdge=edge)


class ClearCompletedTodo(relay.ClientIDMutation):
    viewer = Field(User)
    deletedTodoIds = List(lambda: String)
    class Input:
        pass
    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        viewer = get_viewer(context)
        todos = viewer.todos.filter(completed=True)
        deletedTodoIds = []
        for todo in todos:
            deletedTodoIds.append(to_global_id("todo", todo.id))
        todos.delete()
        return ClearCompletedTodo(viewer=viewer, deletedTodoIds=deletedTodoIds)

class SetCompleteAll(relay.ClientIDMutation):
    viewer = Field(User)

    class Input:
        complete = Boolean(required=True)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        viewer = get_viewer(context)
        complete = input.get('complete')
        viewer.todos.update(completed=complete)
        return SetCompleteAll(viewer=viewer)

class UpdateTodoText(relay.ClientIDMutation):

    class Input:
        id = String(required=True)
        text = String(required=True)

    todo = Field(lambda: Todo)
    viewer = Field(lambda: User)

    @classmethod
    def mutate_and_get_payload(cls, input, context, info):
        global_id = input.get("id")
        text = input.get("text")
        id = from_global_id(global_id)[1]
        todo = models.TodoModel.objects.get(pk=id)
        todo.text = text
        todo.save()
        viewer = todo.user
        return UpdateTodoText(todo=todo, viewer=viewer)

class Query(AbstractType):
    node = relay.Node.Field()
    user = relay.Node.Field(lambda: User)
    todo = relay.Node.Field(lambda: Todo)
    viewer = Field(lambda: User)

    def resolve_viewer(self, args, context, info):
        return get_viewer(context)

class Mutation(graphene.ObjectType):
    toggleTodoComplete = ToggleTodoComplete.Field()
    removeTodo = RemoveTodo.Field()
    clearCompletedTodo = ClearCompletedTodo.Field()
    addTodo = AddTodo.Field()
    setCompleteAll = SetCompleteAll.Field()
    updateTodoText = UpdateTodoText.Field()

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