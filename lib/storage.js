(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('Storage', ['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Storage = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
      var arg = arguments[i];
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
    autoSave: true
  };

  function copy(val) {
    if (Object.prototype.toString.call(val) == '[object Array]') {
      return Array.prototype.slice.call(val);
    } else {
      return extend({}, val);
    }
  }

  var Storage = function () {
    function Storage(options) {
      _classCallCheck(this, Storage);

      if (typeof options == 'string') options = { key: options };

      this.opts = extend({}, defaults, options);

      if (this.opts.key == '') {
        console.error('key must be set');
        return;
      }

      this.init();
    }

    _createClass(Storage, [{
      key: 'init',
      value: function init() {
        var r = localStorage.getItem(this.opts.key);

        var v = copy(this.opts.defaultValue);
        if (r != null) {
          try {
            v = JSON.parse(r);
          } catch (e) {
            console.error('can\'t parse ' + this.opts.key + ' via localStorage');
          }
        }

        this.val = v;

        if (this.opts.version && this.val._version_ != this.opts.version) {
          this.clear();
        }
      }
    }, {
      key: 'get',
      value: function get(prop) {
        if (prop === undefined) return this.val;
        return this.val[prop];
      }
    }, {
      key: 'has',
      value: function has(prop) {
        return prop in this.val;
      }
    }, {
      key: 'set',
      value: function set(prop, val) {
        if (val === undefined) {
          delete this.val[prop];
        } else {
          if (this.check(val)) {
            this.val[prop] = val;
          }
        }
        this.opts.autoSave && this.save();
        return this.val;
      }
    }, {
      key: 'save',
      value: function save() {
        localStorage.setItem(this.opts.key, JSON.stringify(this.val));
      }
    }, {
      key: 'del',
      value: function del(prop) {
        this.set(prop);
        return this.val;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.val = copy(this.opts.defaultValue);
        if (this.opts.version) this.val._version_ = this.opts.version;
        this.opts.autoSave && this.save();
        return this.val;
      }
    }, {
      key: 'check',
      value: function check(val) {
        var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
        var r = false;

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
    }]);

    return Storage;
  }();

  exports.default = Storage;
  module.exports = exports['default'];
});
