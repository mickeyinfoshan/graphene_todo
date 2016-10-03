import React from 'react';
import Relay from 'react-relay';

import TodoList from './TodoList';
import TodoInput from './TodoInput';

import AddTodo from '../mutations/AddTodo';
import ClearCompleted from '../mutations/ClearCompleted';
import SetCompleteAll from '../mutations/SetCompleteAll';

import Footer from './Footer';

import {getShowingFromHash} from '../utils';

function getActiveCount(viewer) {
  return viewer.totalCount - viewer.completedCount;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showing : getShowingFromHash()
    };
  }

  componentDidMount() {
      window.onhashchange = ()=>{
        this.setState({
          showing : getShowingFromHash()
        });
      };
  }

  addTodo = (text)=>{
    Relay.Store.commitUpdate(new AddTodo({
      text,
      viewer : this.props.viewer
    }));
  };

  setCompleteAll = (complete)=> {
    Relay.Store.commitUpdate(new SetCompleteAll({
      viewer : this.props.viewer,
      complete
    }))
  }

  toggleAll = ()=> {
    var shouldComplete = false;
    if(getActiveCount(this.props.viewer) > 0) {
      shouldComplete = true;
    }
    this.setCompleteAll(shouldComplete);
  };

  render() {
    var main, footer;
    var activeCount = getActiveCount(this.props.viewer);
    if(this.props.viewer.totalCount) {
      main = (
        <section className="main">
          <input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeCount === 0}
						/>
            <TodoList viewer={this.props.viewer} showing={this.state.showing} />
        </section>
      );
      footer = (
        <Footer
            viewer={this.props.viewer}
            showing={this.state.showing}
            clearCompleted={()=>Relay.Store.commitUpdate(new ClearCompleted({viewer:this.props.viewer}))}
        />
      );
    }
    return (
      <div>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <TodoInput addTodo={this.addTodo} />
          </header>
          {main}
          {footer}
        </section>
        <footer className="info">
            <p>
              Double-click to edit a todo
            </p>
            <p>
                Created by Mickey
            </p>
            <p>
                Part of <a href="http://todomvc.com">TodoMVC</a>
            </p>
        </footer>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        totalCount,
        completedCount,
        ${AddTodo.getFragment("viewer")},
        ${ClearCompleted.getFragment("viewer")},
        ${TodoList.getFragment('viewer')},
        ${SetCompleteAll.getFragment('viewer')},
        ${Footer.getFragment("viewer")},
      }
    `,
  },
});