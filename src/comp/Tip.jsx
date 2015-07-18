import React from 'react';

const Tip = React.createClass({
  style: {
    ul: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    date: {
      marginBottom: 5,
      textAlign: 'center'
    },
    name: {
      margin: 10
    },
    value: {
      'float': 'right',
      padding: '0 10px'
    },
    square(color) {
      return {
        backgroundColor: color,
        display: 'block',
        'float': 'left',
        height: 10,
        margin: '2px 3px',
        width: 10
      };
    }
  },
  propTypes: {
    date: React.PropTypes.string,
    details: React.PropTypes.object,
    tracks: React.PropTypes.arrayOf(React.PropTypes.object)
  },
  render() {
    let li = Object.keys(this.props.details).map(trackName => {
      let value = this.props.details[trackName];
      let color = this.props.tracks[trackName].color;
      if (!value) return null;
      return (
        <li>
          <span style={this.style.square(color)}></span>
          <span style={this.style.name}>{trackName}</span>
          <span style={this.style.value}>{value}</span>
        </li>
      );
    }).filter(i => i);

    return (
      <ul style={this.style.ul}>
        <li style={this.style.date}>{this.props.date}</li>
        {li}
      </ul>
    );
  }
});

export default Tip;
