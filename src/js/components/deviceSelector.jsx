import _ from 'lodash';
import React from 'react';


import usb from 'services/usb.js';

export default class DeviceSelector extends React.Component {
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
    const devices = _.map(this.state.devices, (d) => {
      const vendor = d.vendorId.toString(16);
      const product = d.productId.toString(16);
      return <div key={d.device}>{d.device + ' - ' + vendor + ' ' + product}</div>;
    });

    return <div className="display deviceSelect">
        {devices}
      </div>;
  }
}
