import Relay from 'react-relay';

class UpdateTodoText extends Relay.Mutation {
    getMutation() {
        return Relay.QL`mutation{
            updateTodoText
        }`
    }
    
    getVariables() {
        return {
            id : this.props.todo.id,
            text : this.props.text
        };
    }
    
    getFatQuery() {
        return Relay.QL`
            fragment on UpdateTodoText {
                viewer {
                    todos
                }
                todo {
                    text
                }
            }
        `;
    }
    
    getConfigs() {
        return [{
           type : "FIELDS_CHANGE",
           fieldIDs : {
               viewer : this.props.viewer.id,
               todo : this.props.todo.id
           } 
        }];
    }
    
    static fragments = {
        viewer : ()=>Relay.QL`
            fragment on User {
                id
            }
        `,
        todo : ()=>Relay.QL`
            fragment on Todo {
                id
            }
        `,
    };
}

export default UpdateTodoText;