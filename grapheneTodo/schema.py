import graphene

import todos.schema

class Query(todos.schema.Query):
    pass

class Mutation(todos.schema.Mutation):
    pass

schema = graphene.Schema(name="todo_schema", query=Query, mutation=Mutation)