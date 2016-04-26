import _ from 'lodash';

import dispatcher from 'dispatcher.js';


//FEL
const DeviceFEL = {
  "vendorId": 7994,
  "productId": 61416
};
//Fastboot
const DeviceFastboot = {
  "vendorId": 6353,
  "productId": 4112
};

class USB {
  constructor() {
    this.knownDevices = [];
  }

  getDevices() {
    return this.knownDevices;
  }

  getFELDevices() {
    return _.filter(this.knownDevices,DeviceFEL);
  }

  getFastbootDevices() {
    return _.filter(this.knownDevices,DeviceFastboot);
  }

  checkForDevices() {
    chrome.usb.getDevices({},(devices) => {
      //const added = _.difference(devices,this.knownDevices);
      //const removed = _.difference(this.knownDevices,devices);
      if(!_.isEqual(this.knownDevices, devices)) {
        this.knownDevices = devices;
        dispatcher.dispatch({
          actionType: 'devices-change',
          devices: devices,
          devicesFel: this.getFELDevices(),
          devicesFastboot: this.getFastbootDevices(),
        });
        console.log('Devices', devices);
      }
    });
  }
}

export default new USB();

/*
chrome.usb.openDevice(devices[0], function(handle) {
   if(!handle) {
      console.error(chrome.runtime.lastError.message);
      return;
   }
   console.log("Device",handle);

   chrome.usb.listInterfaces( handle, function(info){
     console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
   });
 });
}
console.log("Devices",devices, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
*/
