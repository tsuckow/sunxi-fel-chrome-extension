import _ from 'lodash';

import Enum from 'utils/enum.js';
import EventEmitter from 'utils/eventEmitter.js';

const States = new Enum('RESET','');

class USB extends EventEmitter {
  constructor() {
    super();
    this.state = States.RESET;
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
        this.emit('change', devices);
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
