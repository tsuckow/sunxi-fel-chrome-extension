import React from 'react';

import 'styles/searching.less';

import appState from 'stores/appState.js';

import Scanner from 'components/scanner.jsx';

function getState() {
  return {
    searching: appState.isSearching(),
    foundFEL: appState.isFoundFEL(),
    tooMany: appState.isTooManyDevices(),
  };
}

export default class Searching extends React.Component {
  constructor() {
    super();
    this.state = getState();

    this.onAppStateChanged = this.onAppStateChanged.bind(this);
    this.onAppStateChanged.bind(this);

    appState.on('changed',this.onAppStateChanged);
  }

  componentWillUnmount() {
    appState.off('changed', this.onAppStateChanged);
  }

  onAppStateChanged() {
    this.setState(getState());
  }

  render() {
    let message = 'Unknown Error';
    if( this.state.tooMany ) {
      message = 'Too many devices\nOne device at a time';
    } else if( this.state.searching ) {
      message = 'Searching for C.H.I.P.';
    } else {
      message = 'Found C.H.I.P.';
    }
    let felButton = (this.state.foundFEL && !this.state.tooMany)?<button type="button">Connect &amp; Initialize</button>:null;

    return <div className="searching">
      <Scanner loaded={!this.state.searching} error={this.state.tooMany} />
      <div>
        <span className="message">{message}</span>
        <div className="buttons">{felButton}</div>
      </div>
    </div>;
  }
}
