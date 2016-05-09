import Relay from 'react-relay';

class SetCompleteAll extends Relay.Mutation {
    
    static fragments = {
      viewer : () => Relay.QL`
        fragment on User {
            id
        }
      `,  
    };
    
    getMutation() {
        return Relay.QL`
            mutation {
                setCompleteAll
            }
        `;
    }
    
    getVariables() {
        return {
            complete : this.props.complete
        }
    }
    
    getFatQuery() {
        return Relay.QL`
            fragment on SetCompleteAll @relay(pattern:true) {
                viewer {
                    completedCount,
                    todos {
                        edges {
                            node {
                                completed
                            }
                        }
                    }
                }
            }
        `;
    }
    
    getConfigs() {
        return [{
            type : "FIELDS_CHANGE",
            fieldIDs : {
                viewer : this.props.viewer.id
            }
        }]
    }
}

export default SetCompleteAll;