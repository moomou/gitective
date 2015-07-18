import React from 'react';

import * as data from '../data';

const UndoButton = React.createClass({
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return {
      color: null
    };
  },
  _onClick() {
    let btn = this.refs.btn.getDOMNode();
    btn.setAttribute('disabled', true);
    data.undoEntries(this.props.username);
    setTimeout(() => {
      btn.removeAttribute('disabled');
    }, 750);
  },
  render() {
    if (this.state.color) {
      let style = {
        backgroundColor: this.state.color
      };
      return (
        <button ref="btn" style={style} className="btn btn-black undo-btn" onClick={this._onClick}>UNDO</button>
      );
    }
    return <span></span>;
  },
  updateUndo(color) {
    this.setState({ color });
  }
});

export default UndoButton;
