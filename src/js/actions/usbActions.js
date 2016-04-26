import dispatcher from 'dispatcher.js';

import usb from 'services/usb.js';
import fel from 'services/fel.js';

export default class USBActions {

  static programFel() {
    let device = usb.getFELDevices();
    if( device.length === 1 ) {
      fel.handleDevice( device[0] );
      dispatcher.dispatch({
        actionType: 'booting',
      });
    } else {
      console.error('Attempt to program ' + device.length  + 'devcies');
    }
  }
}
