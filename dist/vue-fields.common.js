/*!
 * vue-fields v1.1.2
 * https://github.com/pagekit/vue-fields
 * Released under the MIT License.
 */

'use strict';

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
function isString(val) {
  return typeof val === 'string';
}
function isFunction(val) {
  return typeof val === 'function';
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
var parsedFunc = {};
var expressionRe = /((?:\d|true|false|null|undefined|(?:this\.|\$)[\w.$]+|\W)*)([\w][\w.]*)?/g;
var quotedStringRe = /([^"']+)((.)(?:[^\3\\]|\\.)*?\3|.)?/g;
function parse(expr) {
  return parsedFunc[expr] = parsedFunc[expr] || Function('$values', '$context', "with($context){return " + expr.replace(quotedStringRe, function (match, unquoted, quoted) {
    if (quoted === void 0) {
      quoted = '';
    }

    return unquoted.replace(expressionRe, function (match, prefix, expression) {
      if (prefix === void 0) {
        prefix = '';
      }

      return match ? "" + prefix + (expression ? "$get('" + expression + "')" : '') : '';
    }) + quoted;
  }) + "}");
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

var Fields = {
  provide: function provide() {
    return {
      Fields: this
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
    tag: {
      type: String,
      "default": 'div'
    }
  },
  methods: {
    prepare: function prepare(config) {
      var fields = [];
      var arr = isArray(config);
      each(config, function (field, key) {
        field = assign({}, field);

        if (!field.name && !arr) {
          field.name = key;
        }

        if (!field.name) {
          warn("Field name missing " + JSON.stringify(field));
          return;
        }

        fields.push(field);
      });
      return fields;
    },
    evaluate: function evaluate(expression, values) {
      if (values === void 0) {
        values = this.values;
      }

      try {
        if (isUndefined(expression)) {
          return true;
        }

        if (isString(expression)) {
          expression = parse(expression);
        }

        if (isFunction(expression)) {
          return expression.call(this, values, {
            $match: $match,
            $get: function $get(key) {
              return get(values, key);
            }
          });
        }

        return expression;
      } catch (e) {
        warn(e);
      }

      return true;
    },
    filterOptions: function filterOptions(options) {
      var _this = this;

      var opts = [];

      if (isArray(options)) {
        return options;
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
  },
  render: function render(h) {
    var _this2 = this;

    var fields = this.prepare(this.config, this.prefix);

    if (!this.$scopedSlots["default"]) {
      warn('Default Fields slot is missing');
      return;
    }

    return h(this.tag, fields.map(function (field) {
      var obj = {
        field: field,
        evaluate: _this2.evaluate,
        filterOptions: _this2.filterOptions
      };
      Object.defineProperty(field, 'value', {
        get: function get$$1() {
          return get(_this2.values, field.name);
        },
        set: function set$$1(value) {
          set(_this2.values, field.name, value);

          _this2.$emit('change', value, field);
        }
      });
      return _this2.$scopedSlots["default"](obj);
    }));
  }
};

function $match(subject, pattern, flags) {
  return subject && new RegExp(pattern, flags).test(subject);
}

/**
 * Install plugin.
 */
var Plugin = {
  Fields: Fields,
  install: function install(Vue) {
    if (this.installed) {
      return;
    }

    Util(Vue);
    log(this.version);
    Vue.component('fields', Fields);
  },
  version: '1.1.2'
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Plugin);
}

module.exports = Plugin;
