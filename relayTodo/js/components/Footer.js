import React from 'react';
import Relay from 'react-relay';

import classNames from 'classnames';

import { todoFilter } from '../const';

class Footer extends React.Component {
    
    render() {
        var clearButton = null;
        var {completedCount, totalCount} = this.props.viewer;
        if (completedCount > 0) {
            clearButton = (
                <button 
                    className="clear-completed"
                    onClick={this.props.clearCompleted}
                >
                    Clear completed
                </button>  
            );   
        }
        var showing = this.props.showing;
        var filterButtons = [];
        for(var key in todoFilter) {
            var buttonText = key;
            filterButtons.push((
               <li key={key}>
                    <a
                        href={`#/${todoFilter[key]}`}
                        className={classNames({selected: showing === todoFilter[key]})}
                    >
                    {buttonText}
                    </a>
               </li> 
            ));
        }
        return (
            <div className="footer">
                <span className="todo-count">
                    <strong>{totalCount - completedCount}</strong> left
                </span>
                <ul className="filters">
                    {filterButtons}
                </ul>
                {clearButton}
            </div>
        );
    }
}

Footer = Relay.createContainer(Footer, {
   fragments : {
       viewer : ()=>Relay.QL`
            fragment on User {
                totalCount,
                completedCount
            }
       `,
   } 
});

export default Footer;