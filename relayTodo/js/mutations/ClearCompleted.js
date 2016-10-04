import Relay from 'react-relay';

class ClearCompleted extends Relay.Mutation {

    static fragments = {
        viewer : ()=>Relay.QL`
            fragment on User {
                id
            }
        `,
    };

    getMutation() {
        return Relay.QL`
            mutation {
                clearCompletedTodo
            }
        `;
    }

    getVariables() {
        return {}
    }

    getFatQuery() {
        return Relay.QL`
            fragment on ClearCompletedTodoPayload {
                viewer,
                deletedTodoIds
            }
        `;
    }

    getConfigs() {
        return [{
            type : "NODE_DELETE",
            parentName : "viewer",
            connectionName : "todos",
            deletedIDFieldName : "deletedTodoIds",
            parentID : this.props.viewer.id
        }]
    }
}

export default ClearCompleted;