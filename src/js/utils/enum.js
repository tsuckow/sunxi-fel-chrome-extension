function populate(self, value, ...values) {
  if(value) {
    self[value] = Symbol(value);
    populate(self, ...values);
  }
}

export default class Enum {
  constructor(...values) {
    populate(this,...values);
  }
}
