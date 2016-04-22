import Enum from 'utils/enum.js';
import EventEmitter from 'utils/eventEmitter.js';

import dispatcher from 'dispatcher.js';

const States = new Enum('SEARCHING','FOUND_FEL','FOUND_FASTBOOT','BACKUP','RESTORE');

const state = Symbol('Dispatch');
class AppState extends EventEmitter {
  constructor() {
    super();
    this[state] = States.SEARCHING;

    dispatcher.register(this.onDispatch.bind(this));
  }

  isSearching() {
    return this[state] === States.SEARCHING;
  }

  isFoundFEL() {
    return this[state] === States.FOUND_FEL;
  }

  onDispatch(action) {
    if (action.actionType === 'devices-change') {
      if( action.devices.length === 0 && this[state] !== States.SEARCHING ) {
        this[state] = States.SEARCHING;
        this.emit('changed');
      } else if( action.devices.length > 0 && this[state] === States.SEARCHING ) {
        this[state] = States.FOUND_FEL;
        this.emit('changed');
      }
    }
  }

  getState() {
    return this[state];
  }
}

export default new AppState();
