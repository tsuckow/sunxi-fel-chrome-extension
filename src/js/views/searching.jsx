import React from 'react';

import 'styles/searching.less';

import usb from 'services/usb.js';

import Scanner from 'components/scanner.jsx';

export default class Searching extends React.Component {
  constructor() {
    super();
    this.state = { devices: usb.getDevices() };

    this.onDevices = this.onDevices.bind(this);
    usb.on('change', this.onDevices);
  }

  componentWillUnmount() {
    usb.off('change', this.onDevices);
  }

  onDevices(devices) {
    this.setState({ devices: devices });
  }

  render() {
    let message = this.state.devices.length?'Found C.H.I.P.':'Searching for C.H.I.P.';

    return <div className="searching">
      <Scanner loaded={!!this.state.devices.length} />
      <span>{message}</span>
    </div>;
  }
}
