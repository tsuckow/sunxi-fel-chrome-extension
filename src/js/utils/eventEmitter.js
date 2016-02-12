import _ from 'lodash';

const events = Symbol('Events');
export default class EventEmitter {
  constructor() {
    this[events] = {};
  }

  on(event, fn) {
    const listeners = this[events][event] = this[events][event] || [];
    if( !_.includes(listeners, fn) ) {
      listeners.push(fn);
    }
    return this;
  }

  off(event, fn) {
    this[events][event] = _.without(this[events][event],fn);
    return this;
  }

  emit(event, ...args) {
    const listeners = this[events][event] || [];
    for(let listener of listeners) {
      listener.apply(this,args);
    }
  }
}
