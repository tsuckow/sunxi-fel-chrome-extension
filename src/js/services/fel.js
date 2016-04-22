import Enum from 'utils/enum.js';

import dispatcher from 'dispatcher.js';

const States = new Enum('RESET','OPEN_DEVICE','INTERFACE_CLAIMED','ERROR');

export default class FEL {

  handleDevice(device) {
    console.log("Handling Device")
  }
}
