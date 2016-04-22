import _ from 'lodash';

import dispatcher from 'dispatcher.js';


class USB {
  constructor() {
    this.knownDevices = [];
  }

  getDevices() {
    return this.knownDevices;
  }

  checkForDevices() {
    chrome.usb.getDevices({},(devices) => {
      //const added = _.difference(devices,this.knownDevices);
      //const removed = _.difference(this.knownDevices,devices);
      if(!_.isEqual(this.knownDevices, devices)) {
        this.knownDevices = devices;
        dispatcher.dispatch({ actionType: 'devices-change', devices: devices });
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
