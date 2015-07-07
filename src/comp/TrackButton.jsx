import React from 'react';

const TrackButton = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    color: React.PropTypes.string,
    onClick: React.PropTypes.func.isRequired
  },
  _onClick() {
    let btn = this.refs.btn.getDOMNode();
    btn.classList.add('btn-success');
    btn.setAttribute('disabled', true);
    this.props.onClick(this.props.name);
    setTimeout(() => {
      btn.classList.remove('btn-success');
      btn.removeAttribute('disabled');
    }, 1000);
  },
  render() {
    return (
      <button
        ref="btn"
        className="btn btn-7 btn-7h"
        data-color={this.props.color}
        onClick={this._onClick}>
          <span className="color-dot" style={{backgroundColor: this.props.color}}></span>
          <span>{this.props.name}</span>
      </button>
    );
  }
});

export default TrackButton;
