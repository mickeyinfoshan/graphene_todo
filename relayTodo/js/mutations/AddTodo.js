import Relay from 'react-relay'

class AddTodo extends Relay.Mutation {
    
    static fragments = {
        viewer : () => Relay.QL`
            fragment on User {
                id,
                totalCount
            }  
        `,
    };
    
    getMutation() {
        return Relay.QL`mutation{
            addTodo
        }`;
    }
    
    getVariables() {
        return {text : this.props.text}
    }
    
    getFatQuery () {
        return Relay.QL`
            fragment on AddTodo @relay(pattern:true) {
                todoEdge,
                viewer {
                    todos,
                    totalCount,
                }
            }
        `
    }
    
    getConfigs() {
        return [{
            type : "RANGE_ADD",
            parentName : "viewer",
            parentID : this.props.viewer.id,
            connectionName : "todos",
            edgeName : "todoEdge",
            rangeBehaviors : {
                '' : 'append',
                'completed()' : 'append',
            }
        }]
    }
    
     getOptimisticResponse() {
       return {
          todoEdge: {
             node: {
                text : this.props.text,
                completed : false 
            },
          },
          viewer: {
             totalCount: parseInt(this.props.viewer.totalCount) + 1,
             id : this.props.viewer.id
          },
       };
     }
}

export default AddTodo;