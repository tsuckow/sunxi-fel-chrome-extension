import _ from 'lodash';

const dispatchees = Symbol('Dispatchees');
export class Dispatcher {
  constructor() {
    this[dispatchees] = [];
  }

  register(fn) {
    this[dispatchees].push(fn);
  }

  dispatch(...args) {
    _.forEach(this[dispatchees], (fn) => fn(...args));
  }
}

export default new Dispatcher();
