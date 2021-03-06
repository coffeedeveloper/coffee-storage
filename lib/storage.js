(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Storage = factory());
}(this, (function () { 'use strict';

function extend(target) {
  var arguments$1 = arguments;

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments$1[i];
    for (var p in arg) {
      target[p] = arg[p];
    }
  }
  return target;
}

var defaults = {
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

var Storage = function Storage(options) {
  if (typeof options == 'string') { options = { key: options }; }

  this.opts = extend({}, defaults, options);

  if (this.opts.key == '') {
    console.error('key must be set');
    return;
  }

  this.init();
};

Storage.prototype.init = function init () {
  this.refresh();

  if (this.opts.version && this.val._version_ != this.opts.version) {
    this.clear();
  }
};

Storage.prototype.refresh = function refresh () {
  var r = localStorage.getItem(this.opts.key);

  var v = copy(this.opts.defaultValue);
  if (r != null) {
    try {
      v = JSON.parse(r);
    } catch (e) {
      console.error(("can't parse " + (this.opts.key) + " via localStorage"));
    }
  }

  this.val = v;
};

Storage.prototype.get = function get (prop) {
  if (prop === undefined) { return this.val; }
  return this.val[prop];
};

Storage.prototype.has = function has (prop) {
  return prop in this.val;
};

Storage.prototype.set = function set (prop, val) {
  if (val === undefined) {
    delete this.val[prop];
  } else {
    if (this.check(val)) {
      this.val[prop] = val;
    }
  }
  this.opts.autoSave && (this.save());
  return this.val;
};

Storage.prototype.save = function save () {
  localStorage.setItem(this.opts.key, JSON.stringify(this.val));
};

Storage.prototype.del = function del (prop) {
  this.set(prop);
  return this.val;
};

Storage.prototype.clear = function clear () {
  this.val = copy(this.opts.defaultValue);
  if (this.opts.version) { this.val._version_ = this.opts.version; }
  this.opts.autoSave && (this.save());
  return this.val;
};

Storage.prototype.check = function check (val) {
  var type = typeof val;
  var r = false;

  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return true;
    //array or object
    case 'object':
      try {
        JSON.stringify(val);
        r = true;
      } catch (err) {
        console.warn(err);
        r = false;
      }
  }
  return r;
};

return Storage;

})));
