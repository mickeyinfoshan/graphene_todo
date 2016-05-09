import React from 'react';
import Relay from 'react-relay';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

class TodoInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    handleKeyDown(e) {
        // console.log("key down");
        if(e.keyCode === ENTER_KEY_CODE) {
            // console.log("enter key down");
             var text = e.target.value.trim();
             if(text.length > 0) {
                 this.props.addTodo(text);
             }
             e.target.value = "";
        }
    }
    render() {
        return <input onKeyDown={this.handleKeyDown} className="new-todo" placeholder="What needs to be done" />
    }
}

export default TodoInput;