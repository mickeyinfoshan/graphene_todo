import React from 'react'
import Relay from 'react-relay';

import Todo from './Todo';

import ToggleTodoComplete from '../mutations/ToggleTodoComplete'
import RemoveTodo from '../mutations/RemoveTodo'
import UpdateTodoText from "../mutations/UpdateTodoText";

import { todoFilter } from '../const';
import {getShowingFromHash} from '../utils';

export function mapShowingToCompletedVariable(showing) {
    var completed; 
    switch (showing) {
        case todoFilter.Any:
            completed = null;
            break;
        case todoFilter.Active:
            completed = false;
            break;
        case todoFilter.Completed:
            completed = true;
            break;
        default:
            completed = null;
            break;
    }
    console.log(completed);
    return completed;
}

class TodoList extends React.Component {
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.showing !== this.props.showing) {
            this.props.relay.setVariables({
               completed : mapShowingToCompletedVariable(nextProps.showing) 
            });
        }
    }
    render() {    
        var todos = this.props.viewer.todos.edges.map((edge)=> {
            var todo = edge.node;
            return (
                <Todo todo={todo} 
                      key={todo.id} 
                      toggleComplete={ ()=>Relay.Store.commitUpdate(new ToggleTodoComplete({todo, viewer:this.props.viewer})) } 
                      remove={ ()=>Relay.Store.commitUpdate(new RemoveTodo({viewer : this.props.viewer, todo})) }
                      updateTodoText={ text=>Relay.Store.commitUpdate(new UpdateTodoText({viewer:this.props.viewer, todo, text})) }
                />
            );
        });
        return (<ul className="todo-list">
            {todos}
        </ul>);
        
    }
}

TodoList = Relay.createContainer(TodoList, {
   initialVariables : {
       limit : 2147483647,
       completed : mapShowingToCompletedVariable(getShowingFromHash())
   },
   
   fragments : {
       viewer : ()=>Relay.QL`
            fragment on User {
                ${ToggleTodoComplete.getFragment("viewer")},
                ${RemoveTodo.getFragment("viewer")},
                ${UpdateTodoText.getFragment("viewer")},
                todos(first:$limit, completed : $completed){
                    edges {
                        node {
                            id,
                            completed,
                            ${Todo.getFragment('todo')},
                            ${ToggleTodoComplete.getFragment('todo')},
                            ${RemoveTodo.getFragment("todo")},
                            ${UpdateTodoText.getFragment("todo")},    
                        }
                    }
                }
            }
       `,
   }
});

export default TodoList;