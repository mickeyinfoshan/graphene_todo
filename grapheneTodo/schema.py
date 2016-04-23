import graphene

import todos.schema

class Query(todos.schema.Query):
    pass

schema = graphene.Schema(name="todo_schema", query=Query)