import Relay from 'react-relay';

class ToggleTodoCompelete extends Relay.Mutation {
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
        return Relay.QL`mutation{toggleTodoComplete}`
    }
    
    getVariables() {
        return {id : this.props.todo.id}
    }
    
    getFatQuery() {
        return Relay.QL`
            fragment on ToggleTodoComplete {
                viewer{
                    todos,
                    completedCount
                }
                todo {
                    completed
                }
            }
        `;
    }
    
    getConfigs() {
        return [{
            type : "FIELDS_CHANGE",
            fieldIDs : {
                todo : this.props.todo.id,
                viewer : this.props.viewer.id
            }
        }]
    }
}

export default ToggleTodoCompelete