import React from 'react';

import 'styles/searching.less';

import appState from 'stores/appState.js';

import Scanner from 'components/scanner.jsx';

export default class Searching extends React.Component {
  constructor() {
    super();
    this.state = { searching: appState.isSearching(), foundFEL: appState.isFoundFEL() };

    this.onAppStateChanged = this.onAppStateChanged.bind(this);
    this.onAppStateChanged.bind(this);

    appState.on('changed',this.onAppStateChanged);
  }

  componentWillUnmount() {
    appState.off('changed', this.onAppStateChanged);
  }

  onAppStateChanged() {
    this.setState({ searching: appState.isSearching(), foundFEL: appState.isFoundFEL() });
  }

  render() {
    let message = (!this.state.searching)?'Found C.H.I.P.':'Searching for C.H.I.P.';
    let felButton = this.state.foundFEL?<button type="button">Connect &amp; Initialize</button>:null;

    return <div className="searching">
      <Scanner loaded={!this.state.searching} />
      <div>
        <span className="message">{message}</span>
        <div className="buttons">{felButton}</div>
      </div>
    </div>;
  }
}
