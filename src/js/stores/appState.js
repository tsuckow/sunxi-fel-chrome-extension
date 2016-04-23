import _ from 'lodash';

import Enum from 'utils/enum.js';
import EventEmitter from 'utils/eventEmitter.js';

import dispatcher from 'dispatcher.js';

const States = new Enum('SEARCHING','FOUND_FEL','FOUND_FASTBOOT','BACKUP','RESTORE');

class AppState extends EventEmitter {
  constructor() {
    super();
    this.state = States.SEARCHING;
    this.tooMany = false;

    dispatcher.register(this.onDispatch.bind(this));
  }

  isState(states) {
    return _.intersection([this.state],_.flatten([states])).length > 0;
  }

  isSearching() {
    return this.state === States.SEARCHING;
  }

  isTooManyDevices() {
    return this.tooMany;
  }

  isFoundFEL() {
    return this.state === States.FOUND_FEL;
  }

  onDispatch(action) {
    if (action.actionType === 'devices-change') {
      if( action.devices.length === 0 && this.state !== States.SEARCHING ) {
        this.state = States.SEARCHING;
        this.tooMany = false;
        this.emit('changed');
      } else if( action.devices.length > 1 && this.isState([States.SEARCHING,States.FOUND_FEL,States.FOUND_FASTBOOT]) ) {
        this.state = States.SEARCHING;
        this.tooMany = true;
        this.emit('changed');
      } else if( action.devices.length === 1 && this.state === States.SEARCHING ) {
        this.state = States.FOUND_FEL;
        this.tooMany = false;
        this.emit('changed');
      }
    }
  }
}

export default new AppState();
