/*!
 * vue-fields v1.1.2
 * https://github.com/pagekit/vue-fields
 * Released under the MIT License.
 */

/**
 * Utility functions.
 */
var _config = {},
    _set;

var assign = Object.assign || _assign;
var isArray = Array.isArray;
function Util (_ref) {
  var set = _ref.set,
      config = _ref.config;
  _set = set;
  _config = config;
}
function log(message, color) {
  if (color === void 0) {
    color = '#41B883';
  }

  if (typeof console !== 'undefined' && _config.devtools) {
    console.log("%c vue-fields %c " + message + " ", 'color: #fff; background: #35495E; padding: 1px; border-radius: 3px 0 0 3px;', "color: #fff; background: " + color + "; padding: 1px; border-radius: 0 3px 3px 0;");
  }
}
function warn(message, color) {
  if (color === void 0) {
    color = '#DB6B00';
  }

  log(message, color);
}
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
function isUndefined(val) {
  return typeof val === 'undefined';
}
function get(obj, key, def) {
  var parts = isArray(key) ? key : key.split('.');

  for (var i = 0; i < parts.length; i++) {
    if (isObject(obj) && !isUndefined(obj[parts[i]])) {
      obj = obj[parts[i]];
    } else {
      return def;
    }
  }

  return obj;
}
function set(obj, key, val) {
  var parts = isArray(key) ? key : key.split('.');

  while (parts.length > 1) {
    var part = parts.shift();

    if (!isObject(obj[part])) {
      _set(obj, part, {});
    }

    obj = obj[part];
  }

  _set(obj, parts.shift(), val);
}
function each(obj, iterator) {
  var i, key;

  if (typeof obj.length == 'number') {
    for (i = 0; i < obj.length; i++) {
      iterator.call(obj[i], obj[i], i);
    }
  } else if (isObject(obj)) {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator.call(obj[key], obj[key], key);
      }
    }
  }

  return obj;
}
/**
 * Object.assign() polyfill.
 */

function _assign(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    Object.keys(source || {}).forEach(function (key) {
      return target[key] = source[key];
    });
  });
  return target;
}

var Field = {
  inject: ['values'],
  props: {
    field: {
      type: Object,
      required: true
    }
  },
  computed: {
    $value: {
      get: function get$$1() {
        return this.getValue(this.values, this.field.name);
      },
      set: function set$$1(value) {
        this.setValue(value);
      }
    }
  },
  methods: {
    getValue: function getValue() {
      return get(this.values, this.field.name);
    },
    setValue: function setValue(value) {
      set(this.values, this.field.name, value);
      this.$emit('change', value);
    },
    filterOptions: function filterOptions(options) {
      var _this = this;

      var opts = [];

      if (!options) {
        warn("Invalid options provided for " + this.name);
        return opts;
      }

      each(options, function (value, name) {
        if (isObject(value)) {
          opts.push({
            label: name,
            options: _this.filterOptions(value)
          });
        } else {
          opts.push({
            text: name,
            value: value
          });
        }
      });
      return opts;
    }
  }
};

var Fields = {
  provide: function provide() {
    return {
      values: this.values
    };
  },
  props: {
    config: {
      type: [Object, Array],
      "default": function _default() {
        return {};
      }
    },
    values: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    prefix: {
      type: String,
      "default": 'field-'
    },
    tag: {
      type: String,
      "default": 'div'
    }
  },
  methods: {
    prepare: function prepare(config, prefix) {
      var arr = isArray(config),
          fields = [];
      each(config, function (field, key) {
        field = assign({}, field);

        if (!field.name && !arr) {
          field.name = key;
        }

        if (field.name) {
          if (!field.type) {
            field.type = 'text';
          }

          if (!field.component) {
            field.component = prefix + field.type;
          }

          fields.push(field);
        } else {
          warn("Field name missing " + JSON.stringify(field));
        }
      });
      return fields;
    }
  },
  render: function render(h, ctx) {
    var _this = this;

    var fields = this.prepare(this.config, this.prefix);

    if (!this.$scopedSlots["default"]) {
      warn('Default Fields slot is missing');
      return;
    }

    return h(this.tag, fields.map(function (field) {
      return _this.$scopedSlots["default"]({
        field: field
      });
    }));
  }
}; // function $match(subject, pattern, flags) {
//     return subject && (new RegExp(pattern, flags).test(subject));
// }

/**
 * Install plugin.
 */
var Plugin = {
  Field: Field,
  Fields: Fields,
  install: function install(Vue) {
    if (this.installed) {
      return;
    }

    Util(Vue);
    log(this.version);
    Vue.component('field', Field);
    Vue.component('fields', Fields);
  },
  version: '1.1.2'
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin);
}

export default Plugin;
export {Field, Fields};
