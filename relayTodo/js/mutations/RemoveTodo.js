import Relay from 'react-relay';

class RemoveTodo extends Relay.Mutation {
    static fragments = {
      todo : () => Relay.QL`
        fragment on Todo {
            id
        }
      `,
      viewer : () => Relay.QL`
        fragment on User {
            id
        }
      `,
    };

    getMutation() {
        return Relay.QL`mutation{removeTodo}`;
    }

    getFatQuery() {
        return Relay.QL`
            fragment on RemoveTodoPayload {
                viewer {
                    totalCount,
                    completedCount,
                    todos
                }
            }
        `;
    }

    getVariables() {
        return {id : this.props.todo.id}
    }

    getConfigs() {
        return [{
            type : "NODE_DELETE",
            parentName : "viewer",
            connectionName : "todos",
            parentID : this.props.viewer.id,
            deletedIDFieldName : "todoId"
        }]
    }
}

export default RemoveTodo;