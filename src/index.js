function extend(target) {
  for (let i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    for (let p in arg) {
      target[p] = arg[p];
    }
  }
  return target;
}

const defaults = {
  key: '',
  version: '',
  defaultValue: {},
  autoSave: true,
};

function copy(val) {
  if (Object.prototype.toString.call(val) == '[object Array]') {
    return Array.prototype.slice.call(val);
  } else {
    return extend({}, val);
  }
}

export default class Storage {
  constructor(options) {
    if (typeof options == 'string') options = { key: options };

    this.opts = extend({}, defaults, options);

    if (this.opts.key == '') {
      console.error('key must be set');
      return;
    }

    this.init();
  }

  init() {
    let r = localStorage.getItem(this.opts.key);

    let v = copy(this.opts.defaultValue);
    if (r != null) {
      try {
        v = JSON.parse(r);
      } catch (e) {
        console.error(`can't parse ${this.opts.key} via localStorage`);
      }
    }

    this.val = v;

    if (this.opts.version && this.val._version_ != this.opts.version) {
      this.clear();
    }
  }

  get(prop) {
    if (prop === undefined) return this.val;
    return this.val[prop];
  }

  has(prop) {
    return prop in this.val;
  }

  set(prop, val) {
    if (val === undefined) {
      delete this.val[prop];
    } else {
      if (this.check(val)) {
        this.val[prop] = val;
      }
    }
    this.opts.autoSave && (this.save());
    return this.val;
  }

  save() {
    localStorage.setItem(this.opts.key, JSON.stringify(this.val));
  }

  del(prop) {
    this.set(prop);
    return this.val;
  }

  clear() {
    this.val = copy(this.opts.defaultValue);
    if (this.opts.version) this.val._version_ = this.opts.version;
    this.opts.autoSave && (this.save());
    return this.val;
  }

  check(val) {
    let type = typeof val;
    let r = false;

    switch (type) {
      case 'string':
      case 'number':
      case 'boolean':
        return true;
      //array or object
      case 'object':
        try {
          JSON.parse(val);
          r = true;
        } catch (err) {
          console.warn(err);
          r = false;
        }
    }
    return r;
  }
}
