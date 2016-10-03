import graphene
# from graphene_django.debug import DjangoDebug

import todos.schema

class Query(todos.schema.Query, graphene.ObjectType):
    pass

# class Mutation(todos.schema.Mutation, graphene.ObjectType):
#     pass

schema = graphene.Schema(query=Query, mutation=todos.schema.Mutation)
