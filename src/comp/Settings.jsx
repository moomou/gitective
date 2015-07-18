import React from 'react';

import * as data from '../data';

export default React.createClass({
  style: {
    modal: {
      backgroundColor: 'white',
      border: '1px solid gray',
      bottom: 0,
      height: 500,
      left: 0,
      margin: 'auto',
      position: 'fixed',
      right: 0,
      top: 0,
      width: 360,
      zIndex: 999
    },
    actionBtn: {
      display: 'block',
      margin: '10px auto',
      padding: 10,
      width: 200
    },
    form: {
      padding: 25
    },
    firstTitle: {
      marginTop: 0
    }
  },
  propTypes: {
    username: React.PropTypes.string.isRequired
  },
  getInitialState() {
    return {
      changeDayAtHour: 0,
      grading: {},
      showModal: false
    };
  },
  _getInputValue(refName) {
    return this.refs[refName].getDOMNode().value || '';
  },
  _clickOpenToggle() {
    this.setState({
      showModal: !this.state.showModal
    });
  },
  _clickSave() {
    let config = {
      changeDayAtHour: this._getInputValue('day'),
      grading: {
        s: this._getInputValue('s'),
        a: this._getInputValue('a'),
        b: this._getInputValue('b'),
        c: this._getInputValue('c')
      }
    };

    data.saveUserConfig(this.props.username, config);
    this._clickOpenToggle();
  },
  render() {
    let [displayName] = this.props.username.split(':');
    let formKey = JSON.stringify(this.state.grading);

    return (
      <div>
        <button onClick={this._clickOpenToggle}
          className="btn btn-black settings-btn">{displayName}</button>
        <div ref="modal" style={this.style.modal} hidden={!this.state.showModal}>
          <div style={this.style.form} className="form">
            <h3 style={this.style.firstTitle}>Sunset</h3>
            <div className="inputAddOn mini">
              <button className="btn inputAddOn-btn btn-blue" disabled={true}>Change day at hour</button>
              <input
                key={this.state.changeDayAtHour}
                ref="day" min="0" max="24" type="number"
                defaultValue={this.state.changeDayAtHour}
                className="inputAddOn-field txt-center"
                placeholder="0-24"/>
            </div>
            <h3>Grading</h3>
            <div className="grading-form" key={formKey}>
              <div className="inputAddOn mini">
                <button className="btn inputAddOn-btn g-S" disabled={true}>(S) if >= </button>
                <input
                  ref="s"
                  min="0" max="99" type="number"
                  defaultValue={this.state.grading.s || ''}
                  className="inputAddOn-field" placeholder="0-99"/>
              </div>
              <div className="inputAddOn mini">
                <button className="btn inputAddOn-btn g-A" disabled={true}>(A) if >= </button>
                <input
                    defaultValue={this.state.grading.a || ''}
                    min="0" max="99" type="number" className="inputAddOn-field" ref="a" placeholder="0-99"/>
              </div>
              <div className="inputAddOn mini">
                <button className="btn inputAddOn-btn g-B" disabled={true}>(B) if >= </button>
                <input
                  defaultValue={this.state.grading.b || ''}
                  min="0" max="99" type="number" className="inputAddOn-field" ref="b" placeholder="0-99"/>
              </div>
              <div className="inputAddOn mini">
                <button className="btn inputAddOn-btn g-C" disabled={true}>(C) if >= </button>
                <input
                  defaultValue={this.state.grading.c || ''}
                  min="0" max="99" type="number" className="inputAddOn-field" ref="c" placeholder="0-99"/>
              </div>
            </div>
          </div>
          <button onClick={this._clickSave} ref="saveBtn" style={this.style.actionBtn} className="btn btn-green">SAVE</button>
          <button onClick={this._clickOpenToggle} ref="closeBtn" style={this.style.actionBtn} className="btn btn-orange">CLOSE</button>
        </div>
      </div>
    );
  },
  updateConfig(config) {
    this.setState(config);
  }
});
