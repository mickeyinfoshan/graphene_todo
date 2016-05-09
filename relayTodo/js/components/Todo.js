import React from 'react';
import Relay from 'react-relay';

import classNames from 'classnames';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

class Todo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            editing : false
        }
        this.updateTodoText = this.updateTodoText.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    updateTodoText(text) {
        this.setState({
            editing : false
        });
        if(text === this.props.todo.text) {
            return;
        }
        this.props.updateTodoText(text);
    }
    handleKeyDown(e) {
        if(e.keyCode === ENTER_KEY_CODE) {
             var text = e.target.value.trim();
             if(text.length > 0) {
                this.updateTodoText(text);
             }
        
        }
        if(e.keyCode === ESC_KEY_CODE) {
            this.setState({editing : false});
        }
    }
    handleBlur(e) {
        if(!this.state.editing) {
            return;
        }
        this.updateTodoText(e.target.value);
    }
    render() {
        var {text, completed} = this.props.todo;
        return (
          <li className={classNames({
              completed,
              editing : this.state.editing
          })}>
            <div className="view">
                <input 
                    className="toggle"
                    type="checkbox"
                    checked={completed}
                    onChange={this.props.toggleComplete}
                />
                <label onDoubleClick={()=>this.setState({editing : true})}>
                    {text}
                </label>
                <button className="destroy" onClick={this.props.remove} />
            </div>
            <input 
                className="edit"
                defaultValue={text}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
            />
          </li>  
        );
    }
}

Todo = Relay.createContainer(Todo, {
   fragments : {
       todo : ()=>Relay.QL`
            fragment on Todo {
                text,
                completed,
            }
       `,
   } 
});

export default Todo;