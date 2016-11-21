var Prototype = {
    Version: '1.7',
    Browser: (function() {
        var ua = navigator.userAgent;
        var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
        return {
            IE: !!window.attachEvent && !isOpera,
            Opera: isOpera,
            WebKit: ua.indexOf('AppleWebKit/') > -1,
            Gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1,
            MobileSafari: /Apple.*Mobile/.test(ua)
        }
    })(),
    BrowserFeatures: {
        XPath: !!document.evaluate,
        SelectorsAPI: !!document.querySelector,
        ElementExtensions: (function() {
            var constructor = window.Element || window.HTMLElement;
            return !!(constructor && constructor.prototype);
        })(),
        SpecificElementExtensions: (function() {
            if (typeof window.HTMLDivElement !== 'undefined')
                return true;
            var div = document.createElement('div'),
                form = document.createElement('form'),
                isSupported = false;
            if (div['__proto__'] && (div['__proto__'] !== form['__proto__'])) {
                isSupported = true;
            }
            div = form = null;
            return isSupported;
        })()
    },
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function() {},
    K: function(x) {
        return x
    }
};
if (Prototype.Browser.MobileSafari)
    Prototype.BrowserFeatures.SpecificElementExtensions = false;
var Abstract = {};
var Try = {
    these: function() {
        var returnValue;
        for (var i = 0, length = arguments.length; i < length; i++) {
            var lambda = arguments[i];
            try {
                returnValue = lambda();
                break;
            } catch (e) {}
        }
        return returnValue;
    }
};
var Class = (function() {
    var IS_DONTENUM_BUGGY = (function() {
        for (var p in {
                toString: 1
            }) {
            if (p === 'toString') return false;
        }
        return true;
    })();

    function subclass() {};

    function create() {
        var parent = null,
            properties = $A(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments);
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }
        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);
        if (!klass.prototype.initialize)
            klass.prototype.initialize = Prototype.emptyFunction;
        klass.prototype.constructor = klass;
        return klass;
    }

    function addMethods(source) {
        var ancestor = this.superclass && this.superclass.prototype,
            properties = Object.keys(source);
        if (IS_DONTENUM_BUGGY) {
            if (source.toString != Object.prototype.toString)
                properties.push("toString");
            if (source.valueOf != Object.prototype.valueOf)
                properties.push("valueOf");
        }
        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i],
                value = source[property];
            if (ancestor && Object.isFunction(value) && value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function(m) {
                    return function() {
                        return ancestor[m].apply(this, arguments);
                    };
                })(property).wrap(method);
                value.valueOf = method.valueOf.bind(method);
                value.toString = method.toString.bind(method);
            }
            this.prototype[property] = value;
        }
        return this;
    }
    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();
(function() {
    var _toString = Object.prototype.toString,
        NULL_TYPE = 'Null',
        UNDEFINED_TYPE = 'Undefined',
        BOOLEAN_TYPE = 'Boolean',
        NUMBER_TYPE = 'Number',
        STRING_TYPE = 'String',
        OBJECT_TYPE = 'Object',
        FUNCTION_CLASS = '[object Function]',
        BOOLEAN_CLASS = '[object Boolean]',
        NUMBER_CLASS = '[object Number]',
        STRING_CLASS = '[object String]',
        ARRAY_CLASS = '[object Array]',
        DATE_CLASS = '[object Date]',
        NATIVE_JSON_STRINGIFY_SUPPORT = window.JSON && typeof JSON.stringify === 'function' && JSON.stringify(0) === '0' && typeof JSON.stringify(Prototype.K) === 'undefined';

    function Type(o) {
        switch (o) {
            case null:
                return NULL_TYPE;
            case (void 0):
                return UNDEFINED_TYPE;
        }
        var type = typeof o;
        switch (type) {
            case 'boolean':
                return BOOLEAN_TYPE;
            case 'number':
                return NUMBER_TYPE;
            case 'string':
                return STRING_TYPE;
        }
        return OBJECT_TYPE;
    }

    function extend(destination, source) {
        for (var property in source)
            destination[property] = source[property];
        return destination;
    }

    function inspect(object) {
        try {
            if (isUndefined(object)) return 'undefined';
            if (object === null) return 'null';
            return object.inspect ? object.inspect() : String(object);
        } catch (e) {
            if (e instanceof RangeError) return '...';
            throw e;
        }
    }

    function toJSON(value) {
        return Str('', {
            '': value
        }, []);
    }

    function Str(key, holder, stack) {
        var value = holder[key],
            type = typeof value;
        if (Type(value) === OBJECT_TYPE && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        var _class = _toString.call(value);
        switch (_class) {
            case NUMBER_CLASS:
            case BOOLEAN_CLASS:
            case STRING_CLASS:
                value = value.valueOf();
        }
        switch (value) {
            case null:
                return 'null';
            case true:
                return 'true';
            case false:
                return 'false';
        }
        type = typeof value;
        switch (type) {
            case 'string':
                return value.inspect(true);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'object':
                for (var i = 0, length = stack.length; i < length; i++) {
                    if (stack[i] === value) {
                        throw new TypeError();
                    }
                }
                stack.push(value);
                var partial = [];
                if (_class === ARRAY_CLASS) {
                    for (var i = 0, length = value.length; i < length; i++) {
                        var str = Str(i, value, stack);
                        partial.push(typeof str === 'undefined' ? 'null' : str);
                    }
                    partial = '[' + partial.join(',') + ']';
                } else {
                    var keys = Object.keys(value);
                    for (var i = 0, length = keys.length; i < length; i++) {
                        var key = keys[i],
                            str = Str(key, value, stack);
                        if (typeof str !== "undefined") {
                            partial.push(key.inspect(true) + ':' + str);
                        }
                    }
                    partial = '{' + partial.join(',') + '}';
                }
                stack.pop();
                return partial;
        }
    }

    function stringify(object) {
        return JSON.stringify(object);
    }

    function toQueryString(object) {
        return $H(object).toQueryString();
    }

    function toHTML(object) {
        return object && object.toHTML ? object.toHTML() : String.interpret(object);
    }

    function keys(object) {
        if (Type(object) !== OBJECT_TYPE) {
            throw new TypeError();
        }
        var results = [];
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                results.push(property);
            }
        }
        return results;
    }

    function values(object) {
        var results = [];
        for (var property in object)
            results.push(object[property]);
        return results;
    }

    function clone(object) {
        return extend({}, object);
    }

    function isElement(object) {
        return !!(object && object.nodeType == 1);
    }

    function isArray(object) {
        return _toString.call(object) === ARRAY_CLASS;
    }
    var hasNativeIsArray = (typeof Array.isArray == 'function') && Array.isArray([]) && !Array.isArray({});
    if (hasNativeIsArray) {
        isArray = Array.isArray;
    }

    function isHash(object) {
        return object instanceof Hash;
    }

    function isFunction(object) {
        return _toString.call(object) === FUNCTION_CLASS;
    }

    function isString(object) {
        return _toString.call(object) === STRING_CLASS;
    }

    function isNumber(object) {
        return _toString.call(object) === NUMBER_CLASS;
    }

    function isDate(object) {
        return _toString.call(object) === DATE_CLASS;
    }

    function isUndefined(object) {
        return typeof object === "undefined";
    }
    extend(Object, {
        extend: extend,
        inspect: inspect,
        toJSON: NATIVE_JSON_STRINGIFY_SUPPORT ? stringify : toJSON,
        toQueryString: toQueryString,
        toHTML: toHTML,
        keys: Object.keys || keys,
        values: values,
        clone: clone,
        isElement: isElement,
        isArray: isArray,
        isHash: isHash,
        isFunction: isFunction,
        isString: isString,
        isNumber: isNumber,
        isDate: isDate,
        isUndefined: isUndefined
    });
})();
Object.extend(Function.prototype, (function() {
    var slice = Array.prototype.slice;

    function update(array, args) {
        var arrayLength = array.length,
            length = args.length;
        while (length--) array[arrayLength + length] = args[length];
        return array;
    }

    function merge(array, args) {
        array = slice.call(array, 0);
        return update(array, args);
    }

    function argumentNames() {
        var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '').replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    }

    function bind(context) {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        var __method = this,
            args = slice.call(arguments, 1);
        return function() {
            var a = merge(args, arguments);
            return __method.apply(context, a);
        }
    }

    function bindAsEventListener(context) {
        var __method = this,
            args = slice.call(arguments, 1);
        return function(event) {
            var a = update([event || window.event], args);
            return __method.apply(context, a);
        }
    }

    function curry() {
        if (!arguments.length) return this;
        var __method = this,
            args = slice.call(arguments, 0);
        return function() {
            var a = merge(args, arguments);
            return __method.apply(this, a);
        }
    }

    function delay(timeout) {
        var __method = this,
            args = slice.call(arguments, 1);
        timeout = timeout * 1000;
        return window.setTimeout(function() {
            return __method.apply(__method, args);
        }, timeout);
    }

    function defer() {
        var args = update([0.01], arguments);
        return this.delay.apply(this, args);
    }

    function wrap(wrapper) {
        var __method = this;
        return function() {
            var a = update([__method.bind(this)], arguments);
            return wrapper.apply(this, a);
        }
    }

    function methodize() {
        if (this._methodized) return this._methodized;
        var __method = this;
        return this._methodized = function() {
            var a = update([this], arguments);
            return __method.apply(null, a);
        };
    }
    return {
        argumentNames: argumentNames,
        bind: bind,
        bindAsEventListener: bindAsEventListener,
        curry: curry,
        delay: delay,
        defer: defer,
        wrap: wrap,
        methodize: methodize
    }
})());
(function(proto) {
    function toISOString() {
        return this.getUTCFullYear() + '-' +
            (this.getUTCMonth() + 1).toPaddedString(2) + '-' +
            this.getUTCDate().toPaddedString(2) + 'T' +
            this.getUTCHours().toPaddedString(2) + ':' +
            this.getUTCMinutes().toPaddedString(2) + ':' +
            this.getUTCSeconds().toPaddedString(2) + 'Z';
    }

    function toJSON() {
        return this.toISOString();
    }
    if (!proto.toISOString) proto.toISOString = toISOString;
    if (!proto.toJSON) proto.toJSON = toJSON;
})(Date.prototype);
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};
var PeriodicalExecuter = Class.create({
    initialize: function(callback, frequency) {
        this.callback = callback;
        this.frequency = frequency;
        this.currentlyExecuting = false;
        this.registerCallback();
    },
    registerCallback: function() {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
    },
    execute: function() {
        this.callback(this);
    },
    stop: function() {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null;
    },
    onTimerEvent: function() {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute();
                this.currentlyExecuting = false;
            } catch (e) {
                this.currentlyExecuting = false;
                throw e;
            }
        }
    }
});
Object.extend(String, {
    interpret: function(value) {
        return value == null ? '' : String(value);
    },
    specialChar: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '\\': '\\\\'
    }
});
Object.extend(String.prototype, (function() {
    var NATIVE_JSON_PARSE_SUPPORT = window.JSON && typeof JSON.parse === 'function' && JSON.parse('{"test": true}').test;

    function prepareReplacement(replacement) {
        if (Object.isFunction(replacement)) return replacement;
        var template = new Template(replacement);
        return function(match) {
            return template.evaluate(match)
        };
    }

    function gsub(pattern, replacement) {
        var result = '',
            source = this,
            match;
        replacement = prepareReplacement(replacement);
        if (Object.isString(pattern))
            pattern = RegExp.escape(pattern);
        if (!(pattern.length || pattern.source)) {
            replacement = replacement('');
            return replacement + source.split('').join(replacement) + replacement;
        }
        while (source.length > 0) {
            if (match = source.match(pattern)) {
                result += source.slice(0, match.index);
                result += String.interpret(replacement(match));
                source = source.slice(match.index + match[0].length);
            } else {
                result += source, source = '';
            }
        }
        return result;
    }

    function sub(pattern, replacement, count) {
        replacement = prepareReplacement(replacement);
        count = Object.isUndefined(count) ? 1 : count;
        return this.gsub(pattern, function(match) {
            if (--count < 0) return match[0];
            return replacement(match);
        });
    }

    function scan(pattern, iterator) {
        this.gsub(pattern, iterator);
        return String(this);
    }

    function truncate(length, truncation) {
        length = length || 30;
        truncation = Object.isUndefined(truncation) ? '...' : truncation;
        return this.length > length ? this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function stripScripts() {
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }

    function extractScripts() {
        var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
            matchOne = new RegExp(Prototype.ScriptFragment, 'im');
        return (this.match(matchAll) || []).map(function(scriptTag) {
            return (scriptTag.match(matchOne) || ['', ''])[1];
        });
    }

    function evalScripts() {
        return this.extractScripts().map(function(script) {
            return eval(script)
        });
    }

    function escapeHTML() {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function unescapeHTML() {
        return this.stripTags().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
    }

    function toQueryParams(separator) {
        var match = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!match) return {};
        return match[1].split(separator || '&').inject({}, function(hash, pair) {
            if ((pair = pair.split('='))[0]) {
                var key = decodeURIComponent(pair.shift()),
                    value = pair.length > 1 ? pair.join('=') : pair[0];
                if (value != undefined) value = decodeURIComponent(value);
                if (key in hash) {
                    if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
                    hash[key].push(value);
                } else hash[key] = value;
            }
            return hash;
        });
    }

    function toArray() {
        return this.split('');
    }

    function succ() {
        return this.slice(0, this.length - 1) +
            String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }

    function times(count) {
        return count < 1 ? '' : new Array(count + 1).join(this);
    }

    function camelize() {
        return this.replace(/-+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    function capitalize() {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
        return this.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    }

    function dasherize() {
        return this.replace(/_/g, '-');
    }

    function inspect(useDoubleQuotes) {
        var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
            if (character in String.specialChar) {
                return String.specialChar[character];
            }
            return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
        });
        if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
        return "'" + escapedString.replace(/'/g, '\\\'') + "'";
    }

    function unfilterJSON(filter) {
        return this.replace(filter || Prototype.JSONFilter, '$1');
    }

    function isJSON() {
        var str = this;
        if (str.blank()) return false;
        str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
        str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        return (/^[\],:{}\s]*$/).test(str);
    }

    function evalJSON(sanitize) {
        var json = this.unfilterJSON(),
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        if (cx.test(json)) {
            json = json.replace(cx, function(a) {
                return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        try {
            if (!sanitize || json.isJSON()) return eval('(' + json + ')');
        } catch (e) {}
        throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    }

    function parseJSON() {
        var json = this.unfilterJSON();
        return JSON.parse(json);
    }

    function include(pattern) {
        return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern) {
        return this.lastIndexOf(pattern, 0) === 0;
    }

    function endsWith(pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
        return this == '';
    }

    function blank() {
        return /^\s*$/.test(this);
    }

    function interpolate(object, pattern) {
        return new Template(this, pattern).evaluate(object);
    }
    return {
        gsub: gsub,
        sub: sub,
        scan: scan,
        truncate: truncate,
        strip: String.prototype.trim || strip,
        stripTags: stripTags,
        stripScripts: stripScripts,
        extractScripts: extractScripts,
        evalScripts: evalScripts,
        escapeHTML: escapeHTML,
        unescapeHTML: unescapeHTML,
        toQueryParams: toQueryParams,
        parseQuery: toQueryParams,
        toArray: toArray,
        succ: succ,
        times: times,
        camelize: camelize,
        capitalize: capitalize,
        underscore: underscore,
        dasherize: dasherize,
        inspect: inspect,
        unfilterJSON: unfilterJSON,
        isJSON: isJSON,
        evalJSON: NATIVE_JSON_PARSE_SUPPORT ? parseJSON : evalJSON,
        include: include,
        startsWith: startsWith,
        endsWith: endsWith,
        empty: empty,
        blank: blank,
        interpolate: interpolate
    };
})());
var Template = Class.create({
    initialize: function(template, pattern) {
        this.template = template.toString();
        this.pattern = pattern || Template.Pattern;
    },
    evaluate: function(object) {
        if (object && Object.isFunction(object.toTemplateReplacements))
            object = object.toTemplateReplacements();
        return this.template.gsub(this.pattern, function(match) {
            if (object == null) return (match[1] + '');
            var before = match[1] || '';
            if (before == '\\') return match[2];
            var ctx = object,
                expr = match[3],
                pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            match = pattern.exec(expr);
            if (match == null) return before;
            while (match != null) {
                var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
                ctx = ctx[comp];
                if (null == ctx || '' == match[3]) break;
                expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
                match = pattern.exec(expr);
            }
            return before + String.interpret(ctx);
        });
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = (function() {
    function each(iterator, context) {
        var index = 0;
        try {
            this._each(function(value) {
                iterator.call(context, value, index++);
            });
        } catch (e) {
            if (e != $break) throw e;
        }
        return this;
    }

    function eachSlice(number, iterator, context) {
        var index = -number,
            slices = [],
            array = this.toArray();
        if (number < 1) return array;
        while ((index += number) < array.length)
            slices.push(array.slice(index, index + number));
        return slices.collect(iterator, context);
    }

    function all(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = true;
        this.each(function(value, index) {
            result = result && !!iterator.call(context, value, index);
            if (!result) throw $break;
        });
        return result;
    }

    function any(iterator, context) {
        iterator = iterator || Prototype.K;
        var result = false;
        this.each(function(value, index) {
            if (result = !!iterator.call(context, value, index))
                throw $break;
        });
        return result;
    }

    function collect(iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];
        this.each(function(value, index) {
            results.push(iterator.call(context, value, index));
        });
        return results;
    }

    function detect(iterator, context) {
        var result;
        this.each(function(value, index) {
            if (iterator.call(context, value, index)) {
                result = value;
                throw $break;
            }
        });
        return result;
    }

    function findAll(iterator, context) {
        var results = [];
        this.each(function(value, index) {
            if (iterator.call(context, value, index))
                results.push(value);
        });
        return results;
    }

    function grep(filter, iterator, context) {
        iterator = iterator || Prototype.K;
        var results = [];
        if (Object.isString(filter))
            filter = new RegExp(RegExp.escape(filter));
        this.each(function(value, index) {
            if (filter.match(value))
                results.push(iterator.call(context, value, index));
        });
        return results;
    }

    function include(object) {
        if (Object.isFunction(this.indexOf))
            if (this.indexOf(object) != -1) return true;
        var found = false;
        this.each(function(value) {
            if (value == object) {
                found = true;
                throw $break;
            }
        });
        return found;
    }

    function inGroupsOf(number, fillWith) {
        fillWith = Object.isUndefined(fillWith) ? null : fillWith;
        return this.eachSlice(number, function(slice) {
            while (slice.length < number) slice.push(fillWith);
            return slice;
        });
    }

    function inject(memo, iterator, context) {
        this.each(function(value, index) {
            memo = iterator.call(context, memo, value, index);
        });
        return memo;
    }

    function invoke(method) {
        var args = $A(arguments).slice(1);
        return this.map(function(value) {
            return value[method].apply(value, args);
        });
    }

    function max(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function(value, index) {
            value = iterator.call(context, value, index);
            if (result == null || value >= result)
                result = value;
        });
        return result;
    }

    function min(iterator, context) {
        iterator = iterator || Prototype.K;
        var result;
        this.each(function(value, index) {
            value = iterator.call(context, value, index);
            if (result == null || value < result)
                result = value;
        });
        return result;
    }

    function partition(iterator, context) {
        iterator = iterator || Prototype.K;
        var trues = [],
            falses = [];
        this.each(function(value, index) {
            (iterator.call(context, value, index) ? trues : falses).push(value);
        });
        return [trues, falses];
    }

    function pluck(property) {
        var results = [];
        this.each(function(value) {
            results.push(value[property]);
        });
        return results;
    }

    function reject(iterator, context) {
        var results = [];
        this.each(function(value, index) {
            if (!iterator.call(context, value, index))
                results.push(value);
        });
        return results;
    }

    function sortBy(iterator, context) {
        return this.map(function(value, index) {
            return {
                value: value,
                criteria: iterator.call(context, value, index)
            };
        }).sort(function(left, right) {
            var a = left.criteria,
                b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }).pluck('value');
    }

    function toArray() {
        return this.map();
    }

    function zip() {
        var iterator = Prototype.K,
            args = $A(arguments);
        if (Object.isFunction(args.last()))
            iterator = args.pop();
        var collections = [this].concat(args).map($A);
        return this.map(function(value, index) {
            return iterator(collections.pluck(index));
        });
    }

    function size() {
        return this.toArray().length;
    }

    function inspect() {
        return '#<Enumerable:' + this.toArray().inspect() + '>';
    }
    return {
        each: each,
        eachSlice: eachSlice,
        all: all,
        every: all,
        any: any,
        some: any,
        collect: collect,
        map: collect,
        detect: detect,
        findAll: findAll,
        select: findAll,
        filter: findAll,
        grep: grep,
        include: include,
        member: include,
        inGroupsOf: inGroupsOf,
        inject: inject,
        invoke: invoke,
        max: max,
        min: min,
        partition: partition,
        pluck: pluck,
        reject: reject,
        sortBy: sortBy,
        toArray: toArray,
        entries: toArray,
        zip: zip,
        size: size,
        inspect: inspect,
        find: detect
    };
})();

function $A(iterable) {
    if (!iterable) return [];
    if ('toArray' in Object(iterable)) return iterable.toArray();
    var length = iterable.length || 0,
        results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
}

function $w(string) {
    if (!Object.isString(string)) return [];
    string = string.strip();
    return string ? string.split(/\s+/) : [];
}
Array.from = $A;
(function() {
    var arrayProto = Array.prototype,
        slice = arrayProto.slice,
        _each = arrayProto.forEach;

    function each(iterator, context) {
        for (var i = 0, length = this.length >>> 0; i < length; i++) {
            if (i in this) iterator.call(context, this[i], i, this);
        }
    }
    if (!_each) _each = each;

    function clear() {
        this.length = 0;
        return this;
    }

    function first() {
        return this[0];
    }

    function last() {
        return this[this.length - 1];
    }

    function compact() {
        return this.select(function(value) {
            return value != null;
        });
    }

    function flatten() {
        return this.inject([], function(array, value) {
            if (Object.isArray(value))
                return array.concat(value.flatten());
            array.push(value);
            return array;
        });
    }

    function without() {
        var values = slice.call(arguments, 0);
        return this.select(function(value) {
            return !values.include(value);
        });
    }

    function reverse(inline) {
        return (inline === false ? this.toArray() : this)._reverse();
    }

    function uniq(sorted) {
        return this.inject([], function(array, value, index) {
            if (0 == index || (sorted ? array.last() != value : !array.include(value)))
                array.push(value);
            return array;
        });
    }

    function intersect(array) {
        return this.uniq().findAll(function(item) {
            return array.detect(function(value) {
                return item === value
            });
        });
    }

    function clone() {
        return slice.call(this, 0);
    }

    function size() {
        return this.length;
    }

    function inspect() {
        return '[' + this.map(Object.inspect).join(', ') + ']';
    }

    function indexOf(item, i) {
        i || (i = 0);
        var length = this.length;
        if (i < 0) i = length + i;
        for (; i < length; i++)
            if (this[i] === item) return i;
        return -1;
    }

    function lastIndexOf(item, i) {
        i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
        var n = this.slice(0, i).reverse().indexOf(item);
        return (n < 0) ? n : i - n - 1;
    }

    function concat() {
        var array = slice.call(this, 0),
            item;
        for (var i = 0, length = arguments.length; i < length; i++) {
            item = arguments[i];
            if (Object.isArray(item) && !('callee' in item)) {
                for (var j = 0, arrayLength = item.length; j < arrayLength; j++)
                    array.push(item[j]);
            } else {
                array.push(item);
            }
        }
        return array;
    }
    Object.extend(arrayProto, Enumerable);
    if (!arrayProto._reverse)
        arrayProto._reverse = arrayProto.reverse;
    Object.extend(arrayProto, {
        _each: _each,
        clear: clear,
        first: first,
        last: last,
        compact: compact,
        flatten: flatten,
        without: without,
        reverse: reverse,
        uniq: uniq,
        intersect: intersect,
        clone: clone,
        toArray: clone,
        size: size,
        inspect: inspect
    });
    var CONCAT_ARGUMENTS_BUGGY = (function() {
        return [].concat(arguments)[0][0] !== 1;
    })(1, 2)
    if (CONCAT_ARGUMENTS_BUGGY) arrayProto.concat = concat;
    if (!arrayProto.indexOf) arrayProto.indexOf = indexOf;
    if (!arrayProto.lastIndexOf) arrayProto.lastIndexOf = lastIndexOf;
})();

function $H(object) {
    return new Hash(object);
};
var Hash = Class.create(Enumerable, (function() {
    function initialize(object) {
        this._object = Object.isHash(object) ? object.toObject() : Object.clone(object);
    }

    function _each(iterator) {
        for (var key in this._object) {
            var value = this._object[key],
                pair = [key, value];
            pair.key = key;
            pair.value = value;
            iterator(pair);
        }
    }

    function set(key, value) {
        return this._object[key] = value;
    }

    function get(key) {
        if (this._object[key] !== Object.prototype[key])
            return this._object[key];
    }

    function unset(key) {
        var value = this._object[key];
        delete this._object[key];
        return value;
    }

    function toObject() {
        return Object.clone(this._object);
    }

    function keys() {
        return this.pluck('key');
    }

    function values() {
        return this.pluck('value');
    }

    function index(value) {
        var match = this.detect(function(pair) {
            return pair.value === value;
        });
        return match && match.key;
    }

    function merge(object) {
        return this.clone().update(object);
    }

    function update(object) {
        return new Hash(object).inject(this, function(result, pair) {
            result.set(pair.key, pair.value);
            return result;
        });
    }

    function toQueryPair(key, value) {
        if (Object.isUndefined(value)) return key;
        return key + '=' + encodeURIComponent(String.interpret(value));
    }

    function toQueryString() {
        return this.inject([], function(results, pair) {
            var key = encodeURIComponent(pair.key),
                values = pair.value;
            if (values && typeof values == 'object') {
                if (Object.isArray(values)) {
                    var queryValues = [];
                    for (var i = 0, len = values.length, value; i < len; i++) {
                        value = values[i];
                        queryValues.push(toQueryPair(key, value));
                    }
                    return results.concat(queryValues);
                }
            } else results.push(toQueryPair(key, values));
            return results;
        }).join('&');
    }

    function inspect() {
        return '#<Hash:{' + this.map(function(pair) {
            return pair.map(Object.inspect).join(': ');
        }).join(', ') + '}>';
    }

    function clone() {
        return new Hash(this);
    }
    return {
        initialize: initialize,
        _each: _each,
        set: set,
        get: get,
        unset: unset,
        toObject: toObject,
        toTemplateReplacements: toObject,
        keys: keys,
        values: values,
        index: index,
        merge: merge,
        update: update,
        toQueryString: toQueryString,
        inspect: inspect,
        toJSON: toObject,
        clone: clone
    };
})());
Hash.from = $H;
Object.extend(Number.prototype, (function() {
    function toColorPart() {
        return this.toPaddedString(2, 16);
    }

    function succ() {
        return this + 1;
    }

    function times(iterator, context) {
        $R(0, this, true).each(iterator, context);
        return this;
    }

    function toPaddedString(length, radix) {
        var string = this.toString(radix || 10);
        return '0'.times(length - string.length) + string;
    }

    function abs() {
        return Math.abs(this);
    }

    function round() {
        return Math.round(this);
    }

    function ceil() {
        return Math.ceil(this);
    }

    function floor() {
        return Math.floor(this);
    }
    return {
        toColorPart: toColorPart,
        succ: succ,
        times: times,
        toPaddedString: toPaddedString,
        abs: abs,
        round: round,
        ceil: ceil,
        floor: floor
    };
})());

function $R(start, end, exclusive) {
    return new ObjectRange(start, end, exclusive);
}
var ObjectRange = Class.create(Enumerable, (function() {
    function initialize(start, end, exclusive) {
        this.start = start;
        this.end = end;
        this.exclusive = exclusive;
    }

    function _each(iterator) {
        var value = this.start;
        while (this.include(value)) {
            iterator(value);
            value = value.succ();
        }
    }

    function include(value) {
        if (value < this.start)
            return false;
        if (this.exclusive)
            return value < this.end;
        return value <= this.end;
    }
    return {
        initialize: initialize,
        _each: _each,
        include: include
    };
})());
var Ajax = {
    getTransport: function() {
        return Try.these(function() {
            return new XMLHttpRequest()
        }, function() {
            return new ActiveXObject('Msxml2.XMLHTTP')
        }, function() {
            return new ActiveXObject('Microsoft.XMLHTTP')
        }) || false;
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function(iterator) {
        this.responders._each(iterator);
    },
    register: function(responder) {
        if (!this.include(responder))
            this.responders.push(responder);
    },
    unregister: function(responder) {
        this.responders = this.responders.without(responder);
    },
    dispatch: function(callback, request, transport, json) {
        this.each(function(responder) {
            if (Object.isFunction(responder[callback])) {
                try {
                    responder[callback].apply(responder, [request, transport, json]);
                } catch (e) {}
            }
        });
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function() {
        Ajax.activeRequestCount++
    },
    onComplete: function() {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function(options) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/x-www-form-urlencoded',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, options || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isHash(this.options.parameters))
            this.options.parameters = this.options.parameters.toObject();
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function($super, url, options) {
        $super(options);
        this.transport = Ajax.getTransport();
        this.request(url);
    },
    request: function(url) {
        this.url = url;
        this.method = this.options.method;
        var params = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);
        if (!['get', 'post'].include(this.method)) {
            params += (params ? '&' : '') + "_method=" + this.method;
            this.method = 'post';
        }
        if (params && this.method === 'get') {
            this.url += (this.url.include('?') ? '&' : '?') + params;
        }
        this.parameters = params.toQueryParams();
        try {
            var response = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(response);
            Ajax.Responders.dispatch('onCreate', this, response);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == 'post' ? (this.options.postBody || params) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType)
                this.onStateChange();
        } catch (e) {
            this.dispatchException(e);
        }
    },
    onStateChange: function() {
        var readyState = this.transport.readyState;
        if (readyState > 1 && !((readyState == 4) && this._complete))
            this.respondToReadyState(this.transport.readyState);
    },
    setRequestHeaders: function() {
        var headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Prototype-Version': Prototype.Version,
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };
        if (this.method == 'post') {
            headers['Content-type'] = this.options.contentType +
                (this.options.encoding ? '; charset=' + this.options.encoding : '');
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005)
                headers['Connection'] = 'close';
        }
        if (typeof this.options.requestHeaders == 'object') {
            var extras = this.options.requestHeaders;
            if (Object.isFunction(extras.push))
                for (var i = 0, length = extras.length; i < length; i += 2)
                    headers[extras[i]] = extras[i + 1];
            else
                $H(extras).each(function(pair) {
                    headers[pair.key] = pair.value
                });
        }
        for (var name in headers)
            this.transport.setRequestHeader(name, headers[name]);
    },
    success: function() {
        var status = this.getStatus();
        return !status || (status >= 200 && status < 300) || status == 304;
    },
    getStatus: function() {
        try {
            if (this.transport.status === 1223) return 204;
            return this.transport.status || 0;
        } catch (e) {
            return 0
        }
    },
    respondToReadyState: function(readyState) {
        var state = Ajax.Request.Events[readyState],
            response = new Ajax.Response(this);
        if (state == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || Prototype.emptyFunction)(response, response.headerJSON);
            } catch (e) {
                this.dispatchException(e);
            }
            var contentType = response.getHeader('Content-type');
            if (this.options.evalJS == 'force' || (this.options.evalJS && this.isSameOrigin() && contentType && contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
                this.evalResponse();
        }
        try {
            (this.options['on' + state] || Prototype.emptyFunction)(response, response.headerJSON);
            Ajax.Responders.dispatch('on' + state, this, response, response.headerJSON);
        } catch (e) {
            this.dispatchException(e);
        }
        if (state == 'Complete') {
            this.transport.onreadystatechange = Prototype.emptyFunction;
        }
    },
    isSameOrigin: function() {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ':' + location.port : ''
        }));
    },
    getHeader: function(name) {
        try {
            return this.transport.getResponseHeader(name) || null;
        } catch (e) {
            return null;
        }
    },
    evalResponse: function() {
        try {
            return eval((this.transport.responseText || '').unfilterJSON());
        } catch (e) {
            this.dispatchException(e);
        }
    },
    dispatchException: function(exception) {
        (this.options.onException || Prototype.emptyFunction)(this, exception);
        Ajax.Responders.dispatch('onException', this, exception);
    }
});
Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
Ajax.Response = Class.create({
    initialize: function(request) {
        this.request = request;
        var transport = this.transport = request.transport,
            readyState = this.readyState = transport.readyState;
        if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(transport.responseText);
            this.headerJSON = this._getHeaderJSON();
        }
        if (readyState == 4) {
            var xml = transport.responseXML;
            this.responseXML = Object.isUndefined(xml) ? null : xml;
            this.responseJSON = this._getResponseJSON();
        }
    },
    status: 0,
    statusText: '',
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function() {
        try {
            return this.transport.statusText || '';
        } catch (e) {
            return ''
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function() {
        try {
            return this.getAllResponseHeaders();
        } catch (e) {
            return null
        }
    },
    getResponseHeader: function(name) {
        return this.transport.getResponseHeader(name);
    },
    getAllResponseHeaders: function() {
        return this.transport.getAllResponseHeaders();
    },
    _getHeaderJSON: function() {
        var json = this.getHeader('X-JSON');
        if (!json) return null;
        json = decodeURIComponent(escape(json));
        try {
            return json.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    },
    _getResponseJSON: function() {
        var options = this.request.options;
        if (!options.evalJSON || (options.evalJSON != 'force' && !(this.getHeader('Content-type') || '').include('application/json')) || this.responseText.blank())
            return null;
        try {
            return this.responseText.evalJSON(options.sanitizeJSON || !this.request.isSameOrigin());
        } catch (e) {
            this.request.dispatchException(e);
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function($super, container, url, options) {
        this.container = {
            success: (container.success || container),
            failure: (container.failure || (container.success ? null : container))
        };
        options = Object.clone(options);
        var onComplete = options.onComplete;
        options.onComplete = (function(response, json) {
            this.updateContent(response.responseText);
            if (Object.isFunction(onComplete)) onComplete(response, json);
        }).bind(this);
        $super(url, options);
    },
    updateContent: function(responseText) {
        var receiver = this.container[this.success() ? 'success' : 'failure'],
            options = this.options;
        if (!options.evalScripts) responseText = responseText.stripScripts();
        if (receiver = $(receiver)) {
            if (options.insertion) {
                if (Object.isString(options.insertion)) {
                    var insertion = {};
                    insertion[options.insertion] = responseText;
                    receiver.insert(insertion);
                } else options.insertion(receiver, responseText);
            } else receiver.update(responseText);
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function($super, container, url, options) {
        $super(options);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = container;
        this.url = url;
        this.start();
    },
    start: function() {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent();
    },
    stop: function() {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
    },
    updateComplete: function(response) {
        if (this.options.decay) {
            this.decay = (response.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = response.responseText;
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency);
    },
    onTimerEvent: function() {
        this.updater = new Ajax.Updater(this.container, this.url, this.options);
    }
});

function $(element) {
    if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length; i < length; i++)
            elements.push($(arguments[i]));
        return elements;
    }
    if (Object.isString(element))
        element = document.getElementById(element);
    return Element.extend(element);
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function(expression, parentElement) {
        var results = [];
        var query = document.evaluate(expression, $(parentElement) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, length = query.snapshotLength; i < length; i++)
            results.push(Element.extend(query.snapshotItem(i)));
        return results;
    };
}
if (!Node) var Node = {};
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    });
}
(function(global) {
    function shouldUseCache(tagName, attributes) {
        if (tagName === 'select') return false;
        if ('type' in attributes) return false;
        return true;
    }
    var HAS_EXTENDED_CREATE_ELEMENT_SYNTAX = (function() {
        try {
            var el = document.createElement('<input name="x">');
            return el.tagName.toLowerCase() === 'input' && el.name === 'x';
        } catch (err) {
            return false;
        }
    })();
    var element = global.Element;
    global.Element = function(tagName, attributes) {
        attributes = attributes || {};
        tagName = tagName.toLowerCase();
        var cache = Element.cache;
        if (HAS_EXTENDED_CREATE_ELEMENT_SYNTAX && attributes.name) {
            tagName = '<' + tagName + ' name="' + attributes.name + '">';
            delete attributes.name;
            return Element.writeAttribute(document.createElement(tagName), attributes);
        }
        if (!cache[tagName]) cache[tagName] = Element.extend(document.createElement(tagName));
        var node = shouldUseCache(tagName, attributes) ? cache[tagName].cloneNode(false) : document.createElement(tagName);
        return Element.writeAttribute(node, attributes);
    };
    Object.extend(global.Element, element || {});
    if (element) global.Element.prototype = element.prototype;
})(this);
Element.idCounter = 1;
Element.cache = {};
Element._purgeElement = function(element) {
    var uid = element._prototypeUID;
    if (uid) {
        Element.stopObserving(element);
        element._prototypeUID = void 0;
        delete Element.Storage[uid];
    }
}
Element.Methods = {
    visible: function(element) {
        return $(element).style.display != 'none';
    },
    toggle: function(element) {
        element = $(element);
        Element[Element.visible(element) ? 'hide' : 'show'](element);
        return element;
    },
    hide: function(element) {
        element = $(element);
        element.style.display = 'none';
        return element;
    },
    show: function(element) {
        element = $(element);
        element.style.display = '';
        return element;
    },
    remove: function(element) {
        element = $(element);
        element.parentNode.removeChild(element);
        return element;
    },
    update: (function() {
        var SELECT_ELEMENT_INNERHTML_BUGGY = (function() {
            var el = document.createElement("select"),
                isBuggy = true;
            el.innerHTML = "<option value=\"test\">test</option>";
            if (el.options && el.options[0]) {
                isBuggy = el.options[0].nodeName.toUpperCase() !== "OPTION";
            }
            el = null;
            return isBuggy;
        })();
        var TABLE_ELEMENT_INNERHTML_BUGGY = (function() {
            try {
                var el = document.createElement("table");
                if (el && el.tBodies) {
                    el.innerHTML = "<tbody><tr><td>test</td></tr></tbody>";
                    var isBuggy = typeof el.tBodies[0] == "undefined";
                    el = null;
                    return isBuggy;
                }
            } catch (e) {
                return true;
            }
        })();
        var LINK_ELEMENT_INNERHTML_BUGGY = (function() {
            try {
                var el = document.createElement('div');
                el.innerHTML = "<link>";
                var isBuggy = (el.childNodes.length === 0);
                el = null;
                return isBuggy;
            } catch (e) {
                return true;
            }
        })();
        var ANY_INNERHTML_BUGGY = SELECT_ELEMENT_INNERHTML_BUGGY || TABLE_ELEMENT_INNERHTML_BUGGY || LINK_ELEMENT_INNERHTML_BUGGY;
        var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (function() {
            var s = document.createElement("script"),
                isBuggy = false;
            try {
                s.appendChild(document.createTextNode(""));
                isBuggy = !s.firstChild || s.firstChild && s.firstChild.nodeType !== 3;
            } catch (e) {
                isBuggy = true;
            }
            s = null;
            return isBuggy;
        })();

        function update(element, content) {
            element = $(element);
            var purgeElement = Element._purgeElement;
            var descendants = element.getElementsByTagName('*'),
                i = descendants.length;
            while (i--) purgeElement(descendants[i]);
            if (content && content.toElement)
                content = content.toElement();
            if (Object.isElement(content))
                return element.update().insert(content);
            content = Object.toHTML(content);
            var tagName = element.tagName.toUpperCase();
            if (tagName === 'SCRIPT' && SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING) {
                element.text = content;
                return element;
            }
            if (ANY_INNERHTML_BUGGY) {
                if (tagName in Element._insertionTranslations.tags) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    Element._getContentFromAnonymousElement(tagName, content.stripScripts()).each(function(node) {
                        element.appendChild(node)
                    });
                } else if (LINK_ELEMENT_INNERHTML_BUGGY && Object.isString(content) && content.indexOf('<link') > -1) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                    var nodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts(), true);
                    nodes.each(function(node) {
                        element.appendChild(node)
                    });
                } else {
                    element.innerHTML = content.stripScripts();
                }
            } else {
                element.innerHTML = content.stripScripts();
            }
            content.evalScripts.bind(content).defer();
            return element;
        }
        return update;
    })(),
    replace: function(element, content) {
        element = $(element);
        if (content && content.toElement) content = content.toElement();
        else if (!Object.isElement(content)) {
            content = Object.toHTML(content);
            var range = element.ownerDocument.createRange();
            range.selectNode(element);
            content.evalScripts.bind(content).defer();
            content = range.createContextualFragment(content.stripScripts());
        }
        element.parentNode.replaceChild(content, element);
        return element;
    },
    insert: function(element, insertions) {
        element = $(element);
        if (Object.isString(insertions) || Object.isNumber(insertions) || Object.isElement(insertions) || (insertions && (insertions.toElement || insertions.toHTML)))
            insertions = {
                bottom: insertions
            };
        var content, insert, tagName, childNodes;
        for (var position in insertions) {
            content = insertions[position];
            position = position.toLowerCase();
            insert = Element._insertionTranslations[position];
            if (content && content.toElement) content = content.toElement();
            if (Object.isElement(content)) {
                insert(element, content);
                continue;
            }
            content = Object.toHTML(content);
            tagName = ((position == 'before' || position == 'after') ? element.parentNode : element).tagName.toUpperCase();
            childNodes = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
            if (position == 'top' || position == 'after') childNodes.reverse();
            childNodes.each(insert.curry(element));
            content.evalScripts.bind(content).defer();
        }
        return element;
    },
    wrap: function(element, wrapper, attributes) {
        element = $(element);
        if (Object.isElement(wrapper))
            $(wrapper).writeAttribute(attributes || {});
        else if (Object.isString(wrapper)) wrapper = new Element(wrapper, attributes);
        else wrapper = new Element('div', wrapper);
        if (element.parentNode)
            element.parentNode.replaceChild(wrapper, element);
        wrapper.appendChild(element);
        return wrapper;
    },
    inspect: function(element) {
        element = $(element);
        var result = '<' + element.tagName.toLowerCase();
        $H({
            'id': 'id',
            'className': 'class'
        }).each(function(pair) {
            var property = pair.first(),
                attribute = pair.last(),
                value = (element[property] || '').toString();
            if (value) result += ' ' + attribute + '=' + value.inspect(true);
        });
        return result + '>';
    },
    recursivelyCollect: function(element, property, maximumLength) {
        element = $(element);
        maximumLength = maximumLength || -1;
        var elements = [];
        while (element = element[property]) {
            if (element.nodeType == 1)
                elements.push(Element.extend(element));
            if (elements.length == maximumLength)
                break;
        }
        return elements;
    },
    ancestors: function(element) {
        return Element.recursivelyCollect(element, 'parentNode');
    },
    descendants: function(element) {
        return Element.select(element, "*");
    },
    firstDescendant: function(element) {
        element = $(element).firstChild;
        while (element && element.nodeType != 1) element = element.nextSibling;
        return $(element);
    },
    immediateDescendants: function(element) {
        var results = [],
            child = $(element).firstChild;
        while (child) {
            if (child.nodeType === 1) {
                results.push(Element.extend(child));
            }
            child = child.nextSibling;
        }
        return results;
    },
    previousSiblings: function(element, maximumLength) {
        return Element.recursivelyCollect(element, 'previousSibling');
    },
    nextSiblings: function(element) {
        return Element.recursivelyCollect(element, 'nextSibling');
    },
    siblings: function(element) {
        element = $(element);
        return Element.previousSiblings(element).reverse().concat(Element.nextSiblings(element));
    },
    match: function(element, selector) {
        element = $(element);
        if (Object.isString(selector))
            return Prototype.Selector.match(element, selector);
        return selector.match(element);
    },
    up: function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return $(element.parentNode);
        var ancestors = Element.ancestors(element);
        return Object.isNumber(expression) ? ancestors[expression] : Prototype.Selector.find(ancestors, expression, index);
    },
    down: function(element, expression, index) {
        element = $(element);
        if (arguments.length == 1) return Element.firstDescendant(element);
        return Object.isNumber(expression) ? Element.descendants(element)[expression] : Element.select(element, expression)[index || 0];
    },
    previous: function(element, expression, index) {
        element = $(element);
        if (Object.isNumber(expression)) index = expression, expression = false;
        if (!Object.isNumber(index)) index = 0;
        if (expression) {
            return Prototype.Selector.find(element.previousSiblings(), expression, index);
        } else {
            return element.recursivelyCollect("previousSibling", index + 1)[index];
        }
    },
    next: function(element, expression, index) {
        element = $(element);
        if (Object.isNumber(expression)) index = expression, expression = false;
        if (!Object.isNumber(index)) index = 0;
        if (expression) {
            return Prototype.Selector.find(element.nextSiblings(), expression, index);
        } else {
            var maximumLength = Object.isNumber(index) ? index + 1 : 1;
            return element.recursivelyCollect("nextSibling", index + 1)[index];
        }
    },
    select: function(element) {
        element = $(element);
        var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
        return Prototype.Selector.select(expressions, element);
    },
    adjacent: function(element) {
        element = $(element);
        var expressions = Array.prototype.slice.call(arguments, 1).join(', ');
        return Prototype.Selector.select(expressions, element.parentNode).without(element);
    },
    identify: function(element) {
        element = $(element);
        var id = Element.readAttribute(element, 'id');
        if (id) return id;
        do {
            id = 'anonymous_element_' + Element.idCounter++
        } while ($(id));
        Element.writeAttribute(element, 'id', id);
        return id;
    },
    readAttribute: function(element, name) {
        element = $(element);
        if (Prototype.Browser.IE) {
            var t = Element._attributeTranslations.read;
            if (t.values[name]) return t.values[name](element, name);
            if (t.names[name]) name = t.names[name];
            if (name.include(':')) {
                return (!element.attributes || !element.attributes[name]) ? null : element.attributes[name].value;
            }
        }
        return element.getAttribute(name);
    },
    writeAttribute: function(element, name, value) {
        element = $(element);
        var attributes = {},
            t = Element._attributeTranslations.write;
        if (typeof name == 'object') attributes = name;
        else attributes[name] = Object.isUndefined(value) ? true : value;
        for (var attr in attributes) {
            name = t.names[attr] || attr;
            value = attributes[attr];
            if (t.values[attr]) name = t.values[attr](element, value);
            if (value === false || value === null)
                element.removeAttribute(name);
            else if (value === true)
                element.setAttribute(name, name);
            else element.setAttribute(name, value);
        }
        return element;
    },
    getHeight: function(element) {
        return Element.getDimensions(element).height;
    },
    getWidth: function(element) {
        return Element.getDimensions(element).width;
    },
    classNames: function(element) {
        return new Element.ClassNames(element);
    },
    hasClassName: function(element, className) {
        if (!(element = $(element))) return;
        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    },
    addClassName: function(element, className) {
        if (!(element = $(element))) return;
        if (!Element.hasClassName(element, className))
            element.className += (element.className ? ' ' : '') + className;
        return element;
    },
    removeClassName: function(element, className) {
        if (!(element = $(element))) return;
        element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').strip();
        return element;
    },
    toggleClassName: function(element, className) {
        if (!(element = $(element))) return;
        return Element[Element.hasClassName(element, className) ? 'removeClassName' : 'addClassName'](element, className);
    },
    cleanWhitespace: function(element) {
        element = $(element);
        var node = element.firstChild;
        while (node) {
            var nextNode = node.nextSibling;
            if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
                element.removeChild(node);
            node = nextNode;
        }
        return element;
    },
    empty: function(element) {
        return $(element).innerHTML.blank();
    },
    descendantOf: function(element, ancestor) {
        element = $(element), ancestor = $(ancestor);
        if (element.compareDocumentPosition)
            return (element.compareDocumentPosition(ancestor) & 8) === 8;
        if (ancestor.contains)
            return ancestor.contains(element) && ancestor !== element;
        while (element = element.parentNode)
            if (element == ancestor) return true;
        return false;
    },
    scrollTo: function(element) {
        element = $(element);
        var pos = Element.cumulativeOffset(element);
        window.scrollTo(pos[0], pos[1]);
        return element;
    },
    getStyle: function(element, style) {
        element = $(element);
        style = style == 'float' ? 'cssFloat' : style.camelize();
        var value = element.style[style];
        if (!value || value == 'auto') {
            var css = document.defaultView.getComputedStyle(element, null);
            value = css ? css[style] : null;
        }
        if (style == 'opacity') return value ? parseFloat(value) : 1.0;
        return value == 'auto' ? null : value;
    },
    getOpacity: function(element) {
        return $(element).getStyle('opacity');
    },
    setStyle: function(element, styles) {
        element = $(element);
        var elementStyle = element.style,
            match;
        if (Object.isString(styles)) {
            element.style.cssText += ';' + styles;
            return styles.include('opacity') ? element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]) : element;
        }
        for (var property in styles)
            if (property == 'opacity') element.setOpacity(styles[property]);
            else
                elementStyle[(property == 'float' || property == 'cssFloat') ? (Object.isUndefined(elementStyle.styleFloat) ? 'cssFloat' : 'styleFloat') : property] = styles[property];
        return element;
    },
    setOpacity: function(element, value) {
        element = $(element);
        element.style.opacity = (value == 1 || value === '') ? '' : (value < 0.00001) ? 0 : value;
        return element;
    },
    makePositioned: function(element) {
        element = $(element);
        var pos = Element.getStyle(element, 'position');
        if (pos == 'static' || !pos) {
            element._madePositioned = true;
            element.style.position = 'relative';
            if (Prototype.Browser.Opera) {
                element.style.top = 0;
                element.style.left = 0;
            }
        }
        return element;
    },
    undoPositioned: function(element) {
        element = $(element);
        if (element._madePositioned) {
            element._madePositioned = undefined;
            element.style.position = element.style.top = element.style.left = element.style.bottom = element.style.right = '';
        }
        return element;
    },
    makeClipping: function(element) {
        element = $(element);
        if (element._overflow) return element;
        element._overflow = Element.getStyle(element, 'overflow') || 'auto';
        if (element._overflow !== 'hidden')
            element.style.overflow = 'hidden';
        return element;
    },
    undoClipping: function(element) {
        element = $(element);
        if (!element._overflow) return element;
        element.style.overflow = element._overflow == 'auto' ? '' : element._overflow;
        element._overflow = null;
        return element;
    },
    clonePosition: function(element, source) {
        var options = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {});
        source = $(source);
        var p = Element.viewportOffset(source),
            delta = [0, 0],
            parent = null;
        element = $(element);
        if (Element.getStyle(element, 'position') == 'absolute') {
            parent = Element.getOffsetParent(element);
            delta = Element.viewportOffset(parent);
        }
        if (parent == document.body) {
            delta[0] -= document.body.offsetLeft;
            delta[1] -= document.body.offsetTop;
        }
        if (options.setLeft) element.style.left = (p[0] - delta[0] + options.offsetLeft) + 'px';
        if (options.setTop) element.style.top = (p[1] - delta[1] + options.offsetTop) + 'px';
        if (options.setWidth) element.style.width = source.offsetWidth + 'px';
        if (options.setHeight) element.style.height = source.offsetHeight + 'px';
        return element;
    }
};
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: 'class',
            htmlFor: 'for'
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function(proceed, element, style) {
        switch (style) {
            case 'height':
            case 'width':
                if (!Element.visible(element)) return null;
                var dim = parseInt(proceed(element, style), 10);
                if (dim !== element['offset' + style.capitalize()])
                    return dim + 'px';
                var properties;
                if (style === 'height') {
                    properties = ['border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width'];
                } else {
                    properties = ['border-left-width', 'padding-left', 'padding-right', 'border-right-width'];
                }
                return properties.inject(dim, function(memo, property) {
                    var val = proceed(element, property);
                    return val === null ? memo : memo - parseInt(val, 10);
                }) + 'px';
            default:
                return proceed(element, style);
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function(proceed, element, attribute) {
        if (attribute === 'title') return element.title;
        return proceed(element, attribute);
    });
} else if (Prototype.Browser.IE) {
    Element.Methods.getStyle = function(element, style) {
        element = $(element);
        style = (style == 'float' || style == 'cssFloat') ? 'styleFloat' : style.camelize();
        var value = element.style[style];
        if (!value && element.currentStyle) value = element.currentStyle[style];
        if (style == 'opacity') {
            if (value = (element.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
                if (value[1]) return parseFloat(value[1]) / 100;
            return 1.0;
        }
        if (value == 'auto') {
            if ((style == 'width' || style == 'height') && (element.getStyle('display') != 'none'))
                return element['offset' + style.capitalize()] + 'px';
            return null;
        }
        return value;
    };
    Element.Methods.setOpacity = function(element, value) {
        function stripAlpha(filter) {
            return filter.replace(/alpha\([^\)]*\)/gi, '');
        }
        element = $(element);
        var currentStyle = element.currentStyle;
        if ((currentStyle && !currentStyle.hasLayout) || (!currentStyle && element.style.zoom == 'normal'))
            element.style.zoom = 1;
        var filter = element.getStyle('filter'),
            style = element.style;
        if (value == 1 || value === '') {
            (filter = stripAlpha(filter)) ? style.filter = filter: style.removeAttribute('filter');
            return element;
        } else if (value < 0.00001) value = 0;
        style.filter = stripAlpha(filter) + 'alpha(opacity=' + (value * 100) + ')';
        return element;
    };
    Element._attributeTranslations = (function() {
        var classProp = 'className',
            forProp = 'for',
            el = document.createElement('div');
        el.setAttribute(classProp, 'x');
        if (el.className !== 'x') {
            el.setAttribute('class', 'x');
            if (el.className === 'x') {
                classProp = 'class';
            }
        }
        el = null;
        el = document.createElement('label');
        el.setAttribute(forProp, 'x');
        if (el.htmlFor !== 'x') {
            el.setAttribute('htmlFor', 'x');
            if (el.htmlFor === 'x') {
                forProp = 'htmlFor';
            }
        }
        el = null;
        return {
            read: {
                names: {
                    'class': classProp,
                    'className': classProp,
                    'for': forProp,
                    'htmlFor': forProp
                },
                values: {
                    _getAttr: function(element, attribute) {
                        return element.getAttribute(attribute);
                    },
                    _getAttr2: function(element, attribute) {
                        return element.getAttribute(attribute, 2);
                    },
                    _getAttrNode: function(element, attribute) {
                        var node = element.getAttributeNode(attribute);
                        return node ? node.value : "";
                    },
                    _getEv: (function() {
                        var el = document.createElement('div'),
                            f;
                        el.onclick = Prototype.emptyFunction;
                        var value = el.getAttribute('onclick');
                        if (String(value).indexOf('{') > -1) {
                            f = function(element, attribute) {
                                attribute = element.getAttribute(attribute);
                                if (!attribute) return null;
                                attribute = attribute.toString();
                                attribute = attribute.split('{')[1];
                                attribute = attribute.split('}')[0];
                                return attribute.strip();
                            };
                        } else if (value === '') {
                            f = function(element, attribute) {
                                attribute = element.getAttribute(attribute);
                                if (!attribute) return null;
                                return attribute.strip();
                            };
                        }
                        el = null;
                        return f;
                    })(),
                    _flag: function(element, attribute) {
                        return $(element).hasAttribute(attribute) ? attribute : null;
                    },
                    style: function(element) {
                        return element.style.cssText.toLowerCase();
                    },
                    title: function(element) {
                        return element.title;
                    }
                }
            }
        }
    })();
    Element._attributeTranslations.write = {
        names: Object.extend({
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing'
        }, Element._attributeTranslations.read.names),
        values: {
            checked: function(element, value) {
                element.checked = !!value;
            },
            style: function(element, value) {
                element.style.cssText = value ? value : '';
            }
        }
    };
    Element._attributeTranslations.has = {};
    $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' + 'encType maxLength readOnly longDesc frameBorder').each(function(attr) {
        Element._attributeTranslations.write.names[attr.toLowerCase()] = attr;
        Element._attributeTranslations.has[attr.toLowerCase()] = attr;
    });
    (function(v) {
        Object.extend(v, {
            href: v._getAttr2,
            src: v._getAttr2,
            type: v._getAttr,
            action: v._getAttrNode,
            disabled: v._flag,
            checked: v._flag,
            readonly: v._flag,
            multiple: v._flag,
            onload: v._getEv,
            onunload: v._getEv,
            onclick: v._getEv,
            ondblclick: v._getEv,
            onmousedown: v._getEv,
            onmouseup: v._getEv,
            onmouseover: v._getEv,
            onmousemove: v._getEv,
            onmouseout: v._getEv,
            onfocus: v._getEv,
            onblur: v._getEv,
            onkeypress: v._getEv,
            onkeydown: v._getEv,
            onkeyup: v._getEv,
            onsubmit: v._getEv,
            onreset: v._getEv,
            onselect: v._getEv,
            onchange: v._getEv
        });
    })(Element._attributeTranslations.read.values);
    if (Prototype.BrowserFeatures.ElementExtensions) {
        (function() {
            function _descendants(element) {
                var nodes = element.getElementsByTagName('*'),
                    results = [];
                for (var i = 0, node; node = nodes[i]; i++)
                    if (node.tagName !== "!")
                        results.push(node);
                return results;
            }
            Element.Methods.down = function(element, expression, index) {
                element = $(element);
                if (arguments.length == 1) return element.firstDescendant();
                return Object.isNumber(expression) ? _descendants(element)[expression] : Element.select(element, expression)[index || 0];
            }
        })();
    }
} else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
    Element.Methods.setOpacity = function(element, value) {
        element = $(element);
        element.style.opacity = (value == 1) ? 0.999999 : (value === '') ? '' : (value < 0.00001) ? 0 : value;
        return element;
    };
} else if (Prototype.Browser.WebKit) {
    Element.Methods.setOpacity = function(element, value) {
        element = $(element);
        element.style.opacity = (value == 1 || value === '') ? '' : (value < 0.00001) ? 0 : value;
        if (value == 1)
            if (element.tagName.toUpperCase() == 'IMG' && element.width) {
                element.width++;
                element.width--;
            } else try {
                var n = document.createTextNode(' ');
                element.appendChild(n);
                element.removeChild(n);
            } catch (e) {}
        return element;
    };
}
if ('outerHTML' in document.documentElement) {
    Element.Methods.replace = function(element, content) {
        element = $(element);
        if (content && content.toElement) content = content.toElement();
        if (Object.isElement(content)) {
            element.parentNode.replaceChild(content, element);
            return element;
        }
        content = Object.toHTML(content);
        var parent = element.parentNode,
            tagName = parent.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[tagName]) {
            var nextSibling = element.next(),
                fragments = Element._getContentFromAnonymousElement(tagName, content.stripScripts());
            parent.removeChild(element);
            if (nextSibling)
                fragments.each(function(node) {
                    parent.insertBefore(node, nextSibling)
                });
            else
                fragments.each(function(node) {
                    parent.appendChild(node)
                });
        } else element.outerHTML = content.stripScripts();
        content.evalScripts.bind(content).defer();
        return element;
    };
}
Element._returnOffset = function(l, t) {
    var result = [l, t];
    result.left = l;
    result.top = t;
    return result;
};
Element._getContentFromAnonymousElement = function(tagName, html, force) {
    var div = new Element('div'),
        t = Element._insertionTranslations.tags[tagName];
    var workaround = false;
    if (t) workaround = true;
    else if (force) {
        workaround = true;
        t = ['', '', 0];
    }
    if (workaround) {
        div.innerHTML = '&nbsp;' + t[0] + html + t[1];
        div.removeChild(div.firstChild);
        for (var i = t[2]; i--;) {
            div = div.firstChild;
        }
    } else {
        div.innerHTML = html;
    }
    return $A(div.childNodes);
};
Element._insertionTranslations = {
    before: function(element, node) {
        element.parentNode.insertBefore(node, element);
    },
    top: function(element, node) {
        element.insertBefore(node, element.firstChild);
    },
    bottom: function(element, node) {
        element.appendChild(node);
    },
    after: function(element, node) {
        element.parentNode.insertBefore(node, element.nextSibling);
    },
    tags: {
        TABLE: ['<table>', '</table>', 1],
        TBODY: ['<table><tbody>', '</tbody></table>', 2],
        TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
        TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
        SELECT: ['<select>', '</select>', 1]
    }
};
(function() {
    var tags = Element._insertionTranslations.tags;
    Object.extend(tags, {
        THEAD: tags.TBODY,
        TFOOT: tags.TBODY,
        TH: tags.TD
    });
})();
Element.Methods.Simulated = {
    hasAttribute: function(element, attribute) {
        attribute = Element._attributeTranslations.has[attribute] || attribute;
        var node = $(element).getAttributeNode(attribute);
        return !!(node && node.specified);
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
(function(div) {
    if (!Prototype.BrowserFeatures.ElementExtensions && div['__proto__']) {
        window.HTMLElement = {};
        window.HTMLElement.prototype = div['__proto__'];
        Prototype.BrowserFeatures.ElementExtensions = true;
    }
    div = null;
})(document.createElement('div'));
Element.extend = (function() {
    function checkDeficiency(tagName) {
        if (typeof window.Element != 'undefined') {
            var proto = window.Element.prototype;
            if (proto) {
                var id = '_' + (Math.random() + '').slice(2),
                    el = document.createElement(tagName);
                proto[id] = 'x';
                var isBuggy = (el[id] !== 'x');
                delete proto[id];
                el = null;
                return isBuggy;
            }
        }
        return false;
    }

    function extendElementWith(element, methods) {
        for (var property in methods) {
            var value = methods[property];
            if (Object.isFunction(value) && !(property in element))
                element[property] = value.methodize();
        }
    }
    var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY = checkDeficiency('object');
    if (Prototype.BrowserFeatures.SpecificElementExtensions) {
        if (HTMLOBJECTELEMENT_PROTOTYPE_BUGGY) {
            return function(element) {
                if (element && typeof element._extendedByPrototype == 'undefined') {
                    var t = element.tagName;
                    if (t && (/^(?:object|applet|embed)$/i.test(t))) {
                        extendElementWith(element, Element.Methods);
                        extendElementWith(element, Element.Methods.Simulated);
                        extendElementWith(element, Element.Methods.ByTag[t.toUpperCase()]);
                    }
                }
                return element;
            }
        }
        return Prototype.K;
    }
    var Methods = {},
        ByTag = Element.Methods.ByTag;
    var extend = Object.extend(function(element) {
        if (!element || typeof element._extendedByPrototype != 'undefined' || element.nodeType != 1 || element == window) return element;
        var methods = Object.clone(Methods),
            tagName = element.tagName.toUpperCase();
        if (ByTag[tagName]) Object.extend(methods, ByTag[tagName]);
        extendElementWith(element, methods);
        element._extendedByPrototype = Prototype.emptyFunction;
        return element;
    }, {
        refresh: function() {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(Methods, Element.Methods);
                Object.extend(Methods, Element.Methods.Simulated);
            }
        }
    });
    extend.refresh();
    return extend;
})();
if (document.documentElement.hasAttribute) {
    Element.hasAttribute = function(element, attribute) {
        return element.hasAttribute(attribute);
    };
} else {
    Element.hasAttribute = Element.Methods.Simulated.hasAttribute;
}
Element.addMethods = function(methods) {
    var F = Prototype.BrowserFeatures,
        T = Element.Methods.ByTag;
    if (!methods) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            "FORM": Object.clone(Form.Methods),
            "INPUT": Object.clone(Form.Element.Methods),
            "SELECT": Object.clone(Form.Element.Methods),
            "TEXTAREA": Object.clone(Form.Element.Methods),
            "BUTTON": Object.clone(Form.Element.Methods)
        });
    }
    if (arguments.length == 2) {
        var tagName = methods;
        methods = arguments[1];
    }
    if (!tagName) Object.extend(Element.Methods, methods || {});
    else {
        if (Object.isArray(tagName)) tagName.each(extend);
        else extend(tagName);
    }

    function extend(tagName) {
        tagName = tagName.toUpperCase();
        if (!Element.Methods.ByTag[tagName])
            Element.Methods.ByTag[tagName] = {};
        Object.extend(Element.Methods.ByTag[tagName], methods);
    }

    function copy(methods, destination, onlyIfAbsent) {
        onlyIfAbsent = onlyIfAbsent || false;
        for (var property in methods) {
            var value = methods[property];
            if (!Object.isFunction(value)) continue;
            if (!onlyIfAbsent || !(property in destination))
                destination[property] = value.methodize();
        }
    }

    function findDOMClass(tagName) {
        var klass;
        var trans = {
            "OPTGROUP": "OptGroup",
            "TEXTAREA": "TextArea",
            "P": "Paragraph",
            "FIELDSET": "FieldSet",
            "UL": "UList",
            "OL": "OList",
            "DL": "DList",
            "DIR": "Directory",
            "H1": "Heading",
            "H2": "Heading",
            "H3": "Heading",
            "H4": "Heading",
            "H5": "Heading",
            "H6": "Heading",
            "Q": "Quote",
            "INS": "Mod",
            "DEL": "Mod",
            "A": "Anchor",
            "IMG": "Image",
            "CAPTION": "TableCaption",
            "COL": "TableCol",
            "COLGROUP": "TableCol",
            "THEAD": "TableSection",
            "TFOOT": "TableSection",
            "TBODY": "TableSection",
            "TR": "TableRow",
            "TH": "TableCell",
            "TD": "TableCell",
            "FRAMESET": "FrameSet",
            "IFRAME": "IFrame"
        };
        if (trans[tagName]) klass = 'HTML' + trans[tagName] + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName + 'Element';
        if (window[klass]) return window[klass];
        klass = 'HTML' + tagName.capitalize() + 'Element';
        if (window[klass]) return window[klass];
        var element = document.createElement(tagName),
            proto = element['__proto__'] || element.constructor.prototype;
        element = null;
        return proto;
    }
    var elementPrototype = window.HTMLElement ? HTMLElement.prototype : Element.prototype;
    if (F.ElementExtensions) {
        copy(Element.Methods, elementPrototype);
        copy(Element.Methods.Simulated, elementPrototype, true);
    }
    if (F.SpecificElementExtensions) {
        for (var tag in Element.Methods.ByTag) {
            var klass = findDOMClass(tag);
            if (Object.isUndefined(klass)) continue;
            copy(T[tag], klass.prototype);
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) Element.extend.refresh();
    Element.cache = {};
};
document.viewport = {
    getDimensions: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    },
    getScrollOffsets: function() {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop);
    }
};
(function(viewport) {
    var B = Prototype.Browser,
        doc = document,
        element, property = {};

    function getRootElement() {
        if (B.WebKit && !doc.evaluate)
            return document;
        if (B.Opera && window.parseFloat(window.opera.version()) < 9.5)
            return document.body;
        return document.documentElement;
    }

    function define(D) {
        if (!element) element = getRootElement();
        property[D] = 'client' + D;
        viewport['get' + D] = function() {
            return element[property[D]]
        };
        return viewport['get' + D]();
    }
    viewport.getWidth = define.curry('Width');
    viewport.getHeight = define.curry('Height');
})(document.viewport);
Element.Storage = {
    UID: 1
};
Element.addMethods({
    getStorage: function(element) {
        if (!(element = $(element))) return;
        var uid;
        if (element === window) {
            uid = 0;
        } else {
            if (typeof element._prototypeUID === "undefined")
                element._prototypeUID = Element.Storage.UID++;
            uid = element._prototypeUID;
        }
        if (!Element.Storage[uid])
            Element.Storage[uid] = $H();
        return Element.Storage[uid];
    },
    store: function(element, key, value) {
        if (!(element = $(element))) return;
        if (arguments.length === 2) {
            Element.getStorage(element).update(key);
        } else {
            Element.getStorage(element).set(key, value);
        }
        return element;
    },
    retrieve: function(element, key, defaultValue) {
        if (!(element = $(element))) return;
        var hash = Element.getStorage(element),
            value = hash.get(key);
        if (Object.isUndefined(value)) {
            hash.set(key, defaultValue);
            value = defaultValue;
        }
        return value;
    },
    clone: function(element, deep) {
        if (!(element = $(element))) return;
        var clone = element.cloneNode(deep);
        clone._prototypeUID = void 0;
        if (deep) {
            var descendants = Element.select(clone, '*'),
                i = descendants.length;
            while (i--) {
                descendants[i]._prototypeUID = void 0;
            }
        }
        return Element.extend(clone);
    },
    purge: function(element) {
        if (!(element = $(element))) return;
        var purgeElement = Element._purgeElement;
        purgeElement(element);
        var descendants = element.getElementsByTagName('*'),
            i = descendants.length;
        while (i--) purgeElement(descendants[i]);
        return null;
    }
});
(function() {
    function toDecimal(pctString) {
        var match = pctString.match(/^(\d+)%?$/i);
        if (!match) return null;
        return (Number(match[1]) / 100);
    }

    function getPixelValue(value, property, context) {
        var element = null;
        if (Object.isElement(value)) {
            element = value;
            value = element.getStyle(property);
        }
        if (value === null) {
            return null;
        }
        if ((/^(?:-)?\d+(\.\d+)?(px)?$/i).test(value)) {
            return window.parseFloat(value);
        }
        var isPercentage = value.include('%'),
            isViewport = (context === document.viewport);
        if (/\d/.test(value) && element && element.runtimeStyle && !(isPercentage && isViewport)) {
            var style = element.style.left,
                rStyle = element.runtimeStyle.left;
            element.runtimeStyle.left = element.currentStyle.left;
            element.style.left = value || 0;
            value = element.style.pixelLeft;
            element.style.left = style;
            element.runtimeStyle.left = rStyle;
            return value;
        }
        if (element && isPercentage) {
            context = context || element.parentNode;
            var decimal = toDecimal(value);
            var whole = null;
            var position = element.getStyle('position');
            var isHorizontal = property.include('left') || property.include('right') || property.include('width');
            var isVertical = property.include('top') || property.include('bottom') || property.include('height');
            if (context === document.viewport) {
                if (isHorizontal) {
                    whole = document.viewport.getWidth();
                } else if (isVertical) {
                    whole = document.viewport.getHeight();
                }
            } else {
                if (isHorizontal) {
                    whole = $(context).measure('width');
                } else if (isVertical) {
                    whole = $(context).measure('height');
                }
            }
            return (whole === null) ? 0 : whole * decimal;
        }
        return 0;
    }

    function toCSSPixels(number) {
        if (Object.isString(number) && number.endsWith('px')) {
            return number;
        }
        return number + 'px';
    }

    function isDisplayed(element) {
        var originalElement = element;
        while (element && element.parentNode) {
            var display = element.getStyle('display');
            if (display === 'none') {
                return false;
            }
            element = $(element.parentNode);
        }
        return true;
    }
    var hasLayout = Prototype.K;
    if ('currentStyle' in document.documentElement) {
        hasLayout = function(element) {
            if (!element.currentStyle.hasLayout) {
                element.style.zoom = 1;
            }
            return element;
        };
    }

    function cssNameFor(key) {
        if (key.include('border')) key = key + '-width';
        return key.camelize();
    }
    Element.Layout = Class.create(Hash, {
        initialize: function($super, element, preCompute) {
            $super();
            this.element = $(element);
            Element.Layout.PROPERTIES.each(function(property) {
                this._set(property, null);
            }, this);
            if (preCompute) {
                this._preComputing = true;
                this._begin();
                Element.Layout.PROPERTIES.each(this._compute, this);
                this._end();
                this._preComputing = false;
            }
        },
        _set: function(property, value) {
            return Hash.prototype.set.call(this, property, value);
        },
        set: function(property, value) {
            throw "Properties of Element.Layout are read-only.";
        },
        get: function($super, property) {
            var value = $super(property);
            return value === null ? this._compute(property) : value;
        },
        _begin: function() {
            if (this._prepared) return;
            var element = this.element;
            if (isDisplayed(element)) {
                this._prepared = true;
                return;
            }
            var originalStyles = {
                position: element.style.position || '',
                width: element.style.width || '',
                visibility: element.style.visibility || '',
                display: element.style.display || ''
            };
            element.store('prototype_original_styles', originalStyles);
            var position = element.getStyle('position'),
                width = element.getStyle('width');
            if (width === "0px" || width === null) {
                element.style.display = 'block';
                width = element.getStyle('width');
            }
            var context = (position === 'fixed') ? document.viewport : element.parentNode;
            element.setStyle({
                position: 'absolute',
                visibility: 'hidden',
                display: 'block'
            });
            var positionedWidth = element.getStyle('width');
            var newWidth;
            if (width && (positionedWidth === width)) {
                newWidth = getPixelValue(element, 'width', context);
            } else if (position === 'absolute' || position === 'fixed') {
                newWidth = getPixelValue(element, 'width', context);
            } else {
                var parent = element.parentNode,
                    pLayout = $(parent).getLayout();
                newWidth = pLayout.get('width') -
                    this.get('margin-left') -
                    this.get('border-left') -
                    this.get('padding-left') -
                    this.get('padding-right') -
                    this.get('border-right') -
                    this.get('margin-right');
            }
            element.setStyle({
                width: newWidth + 'px'
            });
            this._prepared = true;
        },
        _end: function() {
            var element = this.element;
            var originalStyles = element.retrieve('prototype_original_styles');
            element.store('prototype_original_styles', null);
            element.setStyle(originalStyles);
            this._prepared = false;
        },
        _compute: function(property) {
            var COMPUTATIONS = Element.Layout.COMPUTATIONS;
            if (!(property in COMPUTATIONS)) {
                throw "Property not found.";
            }
            return this._set(property, COMPUTATIONS[property].call(this, this.element));
        },
        toObject: function() {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
            var obj = {};
            keys.each(function(key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                var value = this.get(key);
                if (value != null) obj[key] = value;
            }, this);
            return obj;
        },
        toHash: function() {
            var obj = this.toObject.apply(this, arguments);
            return new Hash(obj);
        },
        toCSS: function() {
            var args = $A(arguments);
            var keys = (args.length === 0) ? Element.Layout.PROPERTIES : args.join(' ').split(' ');
            var css = {};
            keys.each(function(key) {
                if (!Element.Layout.PROPERTIES.include(key)) return;
                if (Element.Layout.COMPOSITE_PROPERTIES.include(key)) return;
                var value = this.get(key);
                if (value != null) css[cssNameFor(key)] = value + 'px';
            }, this);
            return css;
        },
        inspect: function() {
            return "#<Element.Layout>";
        }
    });
    Object.extend(Element.Layout, {
        PROPERTIES: $w('height width top left right bottom border-left border-right border-top border-bottom padding-left padding-right padding-top padding-bottom margin-top margin-bottom margin-left margin-right padding-box-width padding-box-height border-box-width border-box-height margin-box-width margin-box-height'),
        COMPOSITE_PROPERTIES: $w('padding-box-width padding-box-height margin-box-width margin-box-height border-box-width border-box-height'),
        COMPUTATIONS: {
            'height': function(element) {
                if (!this._preComputing) this._begin();
                var bHeight = this.get('border-box-height');
                if (bHeight <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }
                var bTop = this.get('border-top'),
                    bBottom = this.get('border-bottom');
                var pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');
                if (!this._preComputing) this._end();
                return bHeight - bTop - bBottom - pTop - pBottom;
            },
            'width': function(element) {
                if (!this._preComputing) this._begin();
                var bWidth = this.get('border-box-width');
                if (bWidth <= 0) {
                    if (!this._preComputing) this._end();
                    return 0;
                }
                var bLeft = this.get('border-left'),
                    bRight = this.get('border-right');
                var pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');
                if (!this._preComputing) this._end();
                return bWidth - bLeft - bRight - pLeft - pRight;
            },
            'padding-box-height': function(element) {
                var height = this.get('height'),
                    pTop = this.get('padding-top'),
                    pBottom = this.get('padding-bottom');
                return height + pTop + pBottom;
            },
            'padding-box-width': function(element) {
                var width = this.get('width'),
                    pLeft = this.get('padding-left'),
                    pRight = this.get('padding-right');
                return width + pLeft + pRight;
            },
            'border-box-height': function(element) {
                if (!this._preComputing) this._begin();
                var height = element.offsetHeight;
                if (!this._preComputing) this._end();
                return height;
            },
            'border-box-width': function(element) {
                if (!this._preComputing) this._begin();
                var width = element.offsetWidth;
                if (!this._preComputing) this._end();
                return width;
            },
            'margin-box-height': function(element) {
                var bHeight = this.get('border-box-height'),
                    mTop = this.get('margin-top'),
                    mBottom = this.get('margin-bottom');
                if (bHeight <= 0) return 0;
                return bHeight + mTop + mBottom;
            },
            'margin-box-width': function(element) {
                var bWidth = this.get('border-box-width'),
                    mLeft = this.get('margin-left'),
                    mRight = this.get('margin-right');
                if (bWidth <= 0) return 0;
                return bWidth + mLeft + mRight;
            },
            'top': function(element) {
                var offset = element.positionedOffset();
                return offset.top;
            },
            'bottom': function(element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pHeight = parent.measure('height');
                var mHeight = this.get('border-box-height');
                return pHeight - mHeight - offset.top;
            },
            'left': function(element) {
                var offset = element.positionedOffset();
                return offset.left;
            },
            'right': function(element) {
                var offset = element.positionedOffset(),
                    parent = element.getOffsetParent(),
                    pWidth = parent.measure('width');
                var mWidth = this.get('border-box-width');
                return pWidth - mWidth - offset.left;
            },
            'padding-top': function(element) {
                return getPixelValue(element, 'paddingTop');
            },
            'padding-bottom': function(element) {
                return getPixelValue(element, 'paddingBottom');
            },
            'padding-left': function(element) {
                return getPixelValue(element, 'paddingLeft');
            },
            'padding-right': function(element) {
                return getPixelValue(element, 'paddingRight');
            },
            'border-top': function(element) {
                return getPixelValue(element, 'borderTopWidth');
            },
            'border-bottom': function(element) {
                return getPixelValue(element, 'borderBottomWidth');
            },
            'border-left': function(element) {
                return getPixelValue(element, 'borderLeftWidth');
            },
            'border-right': function(element) {
                return getPixelValue(element, 'borderRightWidth');
            },
            'margin-top': function(element) {
                return getPixelValue(element, 'marginTop');
            },
            'margin-bottom': function(element) {
                return getPixelValue(element, 'marginBottom');
            },
            'margin-left': function(element) {
                return getPixelValue(element, 'marginLeft');
            },
            'margin-right': function(element) {
                return getPixelValue(element, 'marginRight');
            }
        }
    });
    if ('getBoundingClientRect' in document.documentElement) {
        Object.extend(Element.Layout.COMPUTATIONS, {
            'right': function(element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();
                return (pRect.right - rect.right).round();
            },
            'bottom': function(element) {
                var parent = hasLayout(element.getOffsetParent());
                var rect = element.getBoundingClientRect(),
                    pRect = parent.getBoundingClientRect();
                return (pRect.bottom - rect.bottom).round();
            }
        });
    }
    Element.Offset = Class.create({
        initialize: function(left, top) {
            this.left = left.round();
            this.top = top.round();
            this[0] = this.left;
            this[1] = this.top;
        },
        relativeTo: function(offset) {
            return new Element.Offset(this.left - offset.left, this.top - offset.top);
        },
        inspect: function() {
            return "#<Element.Offset left: #{left} top: #{top}>".interpolate(this);
        },
        toString: function() {
            return "[#{left}, #{top}]".interpolate(this);
        },
        toArray: function() {
            return [this.left, this.top];
        }
    });

    function getLayout(element, preCompute) {
        return new Element.Layout(element, preCompute);
    }

    function measure(element, property) {
        return $(element).getLayout().get(property);
    }

    function getDimensions(element) {
        element = $(element);
        var display = Element.getStyle(element, 'display');
        if (display && display !== 'none') {
            return {
                width: element.offsetWidth,
                height: element.offsetHeight
            };
        }
        var style = element.style;
        var originalStyles = {
            visibility: style.visibility,
            position: style.position,
            display: style.display
        };
        var newStyles = {
            visibility: 'hidden',
            display: 'block'
        };
        if (originalStyles.position !== 'fixed')
            newStyles.position = 'absolute';
        Element.setStyle(element, newStyles);
        var dimensions = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
        Element.setStyle(element, originalStyles);
        return dimensions;
    }

    function getOffsetParent(element) {
        element = $(element);
        if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
            return $(document.body);
        var isInline = (Element.getStyle(element, 'display') === 'inline');
        if (!isInline && element.offsetParent) return $(element.offsetParent);
        while ((element = element.parentNode) && element !== document.body) {
            if (Element.getStyle(element, 'position') !== 'static') {
                return isHtml(element) ? $(document.body) : $(element);
            }
        }
        return $(document.body);
    }

    function cumulativeOffset(element) {
        element = $(element);
        var valueT = 0,
            valueL = 0;
        if (element.parentNode) {
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
        }
        return new Element.Offset(valueL, valueT);
    }

    function positionedOffset(element) {
        element = $(element);
        var layout = element.getLayout();
        var valueT = 0,
            valueL = 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
            if (element) {
                if (isBody(element)) break;
                var p = Element.getStyle(element, 'position');
                if (p !== 'static') break;
            }
        } while (element);
        valueL -= layout.get('margin-top');
        valueT -= layout.get('margin-left');
        return new Element.Offset(valueL, valueT);
    }

    function cumulativeScrollOffset(element) {
        var valueT = 0,
            valueL = 0;
        do {
            valueT += element.scrollTop || 0;
            valueL += element.scrollLeft || 0;
            element = element.parentNode;
        } while (element);
        return new Element.Offset(valueL, valueT);
    }

    function viewportOffset(forElement) {
        element = $(element);
        var valueT = 0,
            valueL = 0,
            docBody = document.body;
        var element = forElement;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            if (element.offsetParent == docBody && Element.getStyle(element, 'position') == 'absolute') break;
        } while (element = element.offsetParent);
        element = forElement;
        do {
            if (element != docBody) {
                valueT -= element.scrollTop || 0;
                valueL -= element.scrollLeft || 0;
            }
        } while (element = element.parentNode);
        return new Element.Offset(valueL, valueT);
    }

    function absolutize(element) {
        element = $(element);
        if (Element.getStyle(element, 'position') === 'absolute') {
            return element;
        }
        var offsetParent = getOffsetParent(element);
        var eOffset = element.viewportOffset(),
            pOffset = offsetParent.viewportOffset();
        var offset = eOffset.relativeTo(pOffset);
        var layout = element.getLayout();
        element.store('prototype_absolutize_original_styles', {
            left: element.getStyle('left'),
            top: element.getStyle('top'),
            width: element.getStyle('width'),
            height: element.getStyle('height')
        });
        element.setStyle({
            position: 'absolute',
            top: offset.top + 'px',
            left: offset.left + 'px',
            width: layout.get('width') + 'px',
            height: layout.get('height') + 'px'
        });
        return element;
    }

    function relativize(element) {
        element = $(element);
        if (Element.getStyle(element, 'position') === 'relative') {
            return element;
        }
        var originalStyles = element.retrieve('prototype_absolutize_original_styles');
        if (originalStyles) element.setStyle(originalStyles);
        return element;
    }
    if (Prototype.Browser.IE) {
        getOffsetParent = getOffsetParent.wrap(function(proceed, element) {
            element = $(element);
            if (isDocument(element) || isDetached(element) || isBody(element) || isHtml(element))
                return $(document.body);
            var position = element.getStyle('position');
            if (position !== 'static') return proceed(element);
            element.setStyle({
                position: 'relative'
            });
            var value = proceed(element);
            element.setStyle({
                position: position
            });
            return value;
        });
        positionedOffset = positionedOffset.wrap(function(proceed, element) {
            element = $(element);
            if (!element.parentNode) return new Element.Offset(0, 0);
            var position = element.getStyle('position');
            if (position !== 'static') return proceed(element);
            var offsetParent = element.getOffsetParent();
            if (offsetParent && offsetParent.getStyle('position') === 'fixed')
                hasLayout(offsetParent);
            element.setStyle({
                position: 'relative'
            });
            var value = proceed(element);
            element.setStyle({
                position: position
            });
            return value;
        });
    } else if (Prototype.Browser.Webkit) {
        cumulativeOffset = function(element) {
            element = $(element);
            var valueT = 0,
                valueL = 0;
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                if (element.offsetParent == document.body)
                    if (Element.getStyle(element, 'position') == 'absolute') break;
                element = element.offsetParent;
            } while (element);
            return new Element.Offset(valueL, valueT);
        };
    }
    Element.addMethods({
        getLayout: getLayout,
        measure: measure,
        getDimensions: getDimensions,
        getOffsetParent: getOffsetParent,
        cumulativeOffset: cumulativeOffset,
        positionedOffset: positionedOffset,
        cumulativeScrollOffset: cumulativeScrollOffset,
        viewportOffset: viewportOffset,
        absolutize: absolutize,
        relativize: relativize
    });

    function isBody(element) {
        return element.nodeName.toUpperCase() === 'BODY';
    }

    function isHtml(element) {
        return element.nodeName.toUpperCase() === 'HTML';
    }

    function isDocument(element) {
        return element.nodeType === Node.DOCUMENT_NODE;
    }

    function isDetached(element) {
        return element !== document.body && !Element.descendantOf(element, document.body);
    }
    if ('getBoundingClientRect' in document.documentElement) {
        Element.addMethods({
            viewportOffset: function(element) {
                element = $(element);
                if (isDetached(element)) return new Element.Offset(0, 0);
                var rect = element.getBoundingClientRect(),
                    docEl = document.documentElement;
                return new Element.Offset(rect.left - docEl.clientLeft, rect.top - docEl.clientTop);
            }
        });
    }
})();
window.$$ = function() {
    var expression = $A(arguments).join(', ');
    return Prototype.Selector.select(expression, document);
};
Prototype.Selector = (function() {
    function select() {
        throw new Error('Method "Prototype.Selector.select" must be defined.');
    }

    function match() {
        throw new Error('Method "Prototype.Selector.match" must be defined.');
    }

    function find(elements, expression, index) {
        index = index || 0;
        var match = Prototype.Selector.match,
            length = elements.length,
            matchIndex = 0,
            i;
        for (i = 0; i < length; i++) {
            if (match(elements[i], expression) && index == matchIndex++) {
                return Element.extend(elements[i]);
            }
        }
    }

    function extendElements(elements) {
        for (var i = 0, length = elements.length; i < length; i++) {
            Element.extend(elements[i]);
        }
        return elements;
    }
    var K = Prototype.K;
    return {
        select: select,
        match: match,
        find: find,
        extendElements: (Element.extend === K) ? K : extendElements,
        extendElement: Element.extend
    };
})();
Prototype._original_property = window.Sizzle;

(function() {
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        done = 0,
        toString = Object.prototype.toString,
        hasDuplicate = false,
        baseHasDuplicate = true;
    [0, 0].sort(function() {
        baseHasDuplicate = false;
        return 0;
    });
    var Sizzle = function(selector, context, results, seed) {
        results = results || [];
        var origContext = context = context || document;
        if (context.nodeType !== 1 && context.nodeType !== 9) {
            return [];
        }
        if (!selector || typeof selector !== "string") {
            return results;
        }
        var parts = [],
            m, set, checkSet, check, mode, extra, prune = true,
            contextXML = isXML(context),
            soFar = selector;
        while ((chunker.exec(""), m = chunker.exec(soFar)) !== null) {
            soFar = m[3];
            parts.push(m[1]);
            if (m[2]) {
                extra = m[3];
                break;
            }
        }
        if (parts.length > 1 && origPOS.exec(selector)) {
            if (parts.length === 2 && Expr.relative[parts[0]]) {
                set = posProcess(parts[0] + parts[1], context);
            } else {
                set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                while (parts.length) {
                    selector = parts.shift();
                    if (Expr.relative[selector])
                        selector += parts.shift();
                    set = posProcess(selector, set);
                }
            }
        } else {
            if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                var ret = Sizzle.find(parts.shift(), context, contextXML);
                context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
            }
            if (context) {
                var ret = seed ? {
                    expr: parts.pop(),
                    set: makeArray(seed)
                } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                if (parts.length > 0) {
                    checkSet = makeArray(set);
                } else {
                    prune = false;
                }
                while (parts.length) {
                    var cur = parts.pop(),
                        pop = cur;
                    if (!Expr.relative[cur]) {
                        cur = "";
                    } else {
                        pop = parts.pop();
                    }
                    if (pop == null) {
                        pop = context;
                    }
                    Expr.relative[cur](checkSet, pop, contextXML);
                }
            } else {
                checkSet = parts = [];
            }
        }
        if (!checkSet) {
            checkSet = set;
        }
        if (!checkSet) {
            throw "Syntax error, unrecognized expression: " + (cur || selector);
        }
        if (toString.call(checkSet) === "[object Array]") {
            if (!prune) {
                results.push.apply(results, checkSet);
            } else if (context && context.nodeType === 1) {
                for (var i = 0; checkSet[i] != null; i++) {
                    if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i]))) {
                        results.push(set[i]);
                    }
                }
            } else {
                for (var i = 0; checkSet[i] != null; i++) {
                    if (checkSet[i] && checkSet[i].nodeType === 1) {
                        results.push(set[i]);
                    }
                }
            }
        } else {
            makeArray(checkSet, results);
        }
        if (extra) {
            Sizzle(extra, origContext, results, seed);
            Sizzle.uniqueSort(results);
        }
        return results;
    };
    Sizzle.uniqueSort = function(results) {
        if (sortOrder) {
            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (var i = 1; i < results.length; i++) {
                    if (results[i] === results[i - 1]) {
                        results.splice(i--, 1);
                    }
                }
            }
        }
        return results;
    };
    Sizzle.matches = function(expr, set) {
        return Sizzle(expr, null, null, set);
    };
    Sizzle.find = function(expr, context, isXML) {
        var set, match;
        if (!expr) {
            return [];
        }
        for (var i = 0, l = Expr.order.length; i < l; i++) {
            var type = Expr.order[i],
                match;
            if ((match = Expr.leftMatch[type].exec(expr))) {
                var left = match[1];
                match.splice(1, 1);
                if (left.substr(left.length - 1) !== "\\") {
                    match[1] = (match[1] || "").replace(/\\/g, "");
                    set = Expr.find[type](match, context, isXML);
                    if (set != null) {
                        expr = expr.replace(Expr.match[type], "");
                        break;
                    }
                }
            }
        }
        if (!set) {
            set = context.getElementsByTagName("*");
        }
        return {
            set: set,
            expr: expr
        };
    };
    Sizzle.filter = function(expr, set, inplace, not) {
        var old = expr,
            result = [],
            curLoop = set,
            match, anyFound, isXMLFilter = set && set[0] && isXML(set[0]);
        while (expr && set.length) {
            for (var type in Expr.filter) {
                if ((match = Expr.match[type].exec(expr)) != null) {
                    var filter = Expr.filter[type],
                        found, item;
                    anyFound = false;
                    if (curLoop == result) {
                        result = [];
                    }
                    if (Expr.preFilter[type]) {
                        match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                        if (!match) {
                            anyFound = found = true;
                        } else if (match === true) {
                            continue;
                        }
                    }
                    if (match) {
                        for (var i = 0;
                            (item = curLoop[i]) != null; i++) {
                            if (item) {
                                found = filter(item, match, i, curLoop);
                                var pass = not ^ !!found;
                                if (inplace && found != null) {
                                    if (pass) {
                                        anyFound = true;
                                    } else {
                                        curLoop[i] = false;
                                    }
                                } else if (pass) {
                                    result.push(item);
                                    anyFound = true;
                                }
                            }
                        }
                    }
                    if (found !== undefined) {
                        if (!inplace) {
                            curLoop = result;
                        }
                        expr = expr.replace(Expr.match[type], "");
                        if (!anyFound) {
                            return [];
                        }
                        break;
                    }
                }
            }
            if (expr == old) {
                if (anyFound == null) {
                    throw "Syntax error, unrecognized expression: " + expr;
                } else {
                    break;
                }
            }
            old = expr;
        }
        return curLoop;
    };
    var Expr = Sizzle.selectors = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
        },
        leftMatch: {},
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function(elem) {
                return elem.getAttribute("href");
            }
        },
        relative: {
            "+": function(checkSet, part, isXML) {
                var isPartStr = typeof part === "string",
                    isTag = isPartStr && !/\W/.test(part),
                    isPartStrNotTag = isPartStr && !isTag;
                if (isTag && !isXML) {
                    part = part.toUpperCase();
                }
                for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                    if ((elem = checkSet[i])) {
                        while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ? elem || false : elem === part;
                    }
                }
                if (isPartStrNotTag) {
                    Sizzle.filter(part, checkSet, true);
                }
            },
            ">": function(checkSet, part, isXML) {
                var isPartStr = typeof part === "string";
                if (isPartStr && !/\W/.test(part)) {
                    part = isXML ? part : part.toUpperCase();
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName === part ? parent : false;
                        }
                    }
                } else {
                    for (var i = 0, l = checkSet.length; i < l; i++) {
                        var elem = checkSet[i];
                        if (elem) {
                            checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                        }
                    }
                    if (isPartStr) {
                        Sizzle.filter(part, checkSet, true);
                    }
                }
            },
            "": function(checkSet, part, isXML) {
                var doneName = done++,
                    checkFn = dirCheck;
                if (!/\W/.test(part)) {
                    var nodeCheck = part = isXML ? part : part.toUpperCase();
                    checkFn = dirNodeCheck;
                }
                checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
            },
            "~": function(checkSet, part, isXML) {
                var doneName = done++,
                    checkFn = dirCheck;
                if (typeof part === "string" && !/\W/.test(part)) {
                    var nodeCheck = part = isXML ? part : part.toUpperCase();
                    checkFn = dirNodeCheck;
                }
                checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
            }
        },
        find: {
            ID: function(match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? [m] : [];
                }
            },
            NAME: function(match, context, isXML) {
                if (typeof context.getElementsByName !== "undefined") {
                    var ret = [],
                        results = context.getElementsByName(match[1]);
                    for (var i = 0, l = results.length; i < l; i++) {
                        if (results[i].getAttribute("name") === match[1]) {
                            ret.push(results[i]);
                        }
                    }
                    return ret.length === 0 ? null : ret;
                }
            },
            TAG: function(match, context) {
                return context.getElementsByTagName(match[1]);
            }
        },
        preFilter: {
            CLASS: function(match, curLoop, inplace, result, not, isXML) {
                match = " " + match[1].replace(/\\/g, "") + " ";
                if (isXML) {
                    return match;
                }
                for (var i = 0, elem;
                    (elem = curLoop[i]) != null; i++) {
                    if (elem) {
                        if (not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0)) {
                            if (!inplace)
                                result.push(elem);
                        } else if (inplace) {
                            curLoop[i] = false;
                        }
                    }
                }
                return false;
            },
            ID: function(match) {
                return match[1].replace(/\\/g, "");
            },
            TAG: function(match, curLoop) {
                for (var i = 0; curLoop[i] === false; i++) {}
                return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
            },
            CHILD: function(match) {
                if (match[1] == "nth") {
                    var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                }
                match[0] = done++;
                return match;
            },
            ATTR: function(match, curLoop, inplace, result, not, isXML) {
                var name = match[1].replace(/\\/g, "");
                if (!isXML && Expr.attrMap[name]) {
                    match[1] = Expr.attrMap[name];
                }
                if (match[2] === "~=") {
                    match[4] = " " + match[4] + " ";
                }
                return match;
            },
            PSEUDO: function(match, curLoop, inplace, result, not) {
                if (match[1] === "not") {
                    if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                        match[3] = Sizzle(match[3], null, null, curLoop);
                    } else {
                        var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                        if (!inplace) {
                            result.push.apply(result, ret);
                        }
                        return false;
                    }
                } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                    return true;
                }
                return match;
            },
            POS: function(match) {
                match.unshift(true);
                return match;
            }
        },
        filters: {
            enabled: function(elem) {
                return elem.disabled === false && elem.type !== "hidden";
            },
            disabled: function(elem) {
                return elem.disabled === true;
            },
            checked: function(elem) {
                return elem.checked === true;
            },
            selected: function(elem) {
                elem.parentNode.selectedIndex;
                return elem.selected === true;
            },
            parent: function(elem) {
                return !!elem.firstChild;
            },
            empty: function(elem) {
                return !elem.firstChild;
            },
            has: function(elem, i, match) {
                return !!Sizzle(match[3], elem).length;
            },
            header: function(elem) {
                return /h\d/i.test(elem.nodeName);
            },
            text: function(elem) {
                return "text" === elem.type;
            },
            radio: function(elem) {
                return "radio" === elem.type;
            },
            checkbox: function(elem) {
                return "checkbox" === elem.type;
            },
            file: function(elem) {
                return "file" === elem.type;
            },
            password: function(elem) {
                return "password" === elem.type;
            },
            submit: function(elem) {
                return "submit" === elem.type;
            },
            image: function(elem) {
                return "image" === elem.type;
            },
            reset: function(elem) {
                return "reset" === elem.type;
            },
            button: function(elem) {
                return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
            },
            input: function(elem) {
                return /input|select|textarea|button/i.test(elem.nodeName);
            }
        },
        setFilters: {
            first: function(elem, i) {
                return i === 0;
            },
            last: function(elem, i, match, array) {
                return i === array.length - 1;
            },
            even: function(elem, i) {
                return i % 2 === 0;
            },
            odd: function(elem, i) {
                return i % 2 === 1;
            },
            lt: function(elem, i, match) {
                return i < match[3] - 0;
            },
            gt: function(elem, i, match) {
                return i > match[3] - 0;
            },
            nth: function(elem, i, match) {
                return match[3] - 0 == i;
            },
            eq: function(elem, i, match) {
                return match[3] - 0 == i;
            }
        },
        filter: {
            PSEUDO: function(elem, match, i, array) {
                var name = match[1],
                    filter = Expr.filters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                } else if (name === "contains") {
                    return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
                } else if (name === "not") {
                    var not = match[3];
                    for (var i = 0, l = not.length; i < l; i++) {
                        if (not[i] === elem) {
                            return false;
                        }
                    }
                    return true;
                }
            },
            CHILD: function(elem, match) {
                var type = match[1],
                    node = elem;
                switch (type) {
                    case 'only':
                    case 'first':
                        while ((node = node.previousSibling)) {
                            if (node.nodeType === 1) return false;
                        }
                        if (type == 'first') return true;
                        node = elem;
                    case 'last':
                        while ((node = node.nextSibling)) {
                            if (node.nodeType === 1) return false;
                        }
                        return true;
                    case 'nth':
                        var first = match[2],
                            last = match[3];
                        if (first == 1 && last == 0) {
                            return true;
                        }
                        var doneName = match[0],
                            parent = elem.parentNode;
                        if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                            var count = 0;
                            for (node = parent.firstChild; node; node = node.nextSibling) {
                                if (node.nodeType === 1) {
                                    node.nodeIndex = ++count;
                                }
                            }
                            parent.sizcache = doneName;
                        }
                        var diff = elem.nodeIndex - last;
                        if (first == 0) {
                            return diff == 0;
                        } else {
                            return (diff % first == 0 && diff / first >= 0);
                        }
                }
            },
            ID: function(elem, match) {
                return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },
            TAG: function(elem, match) {
                return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
            },
            CLASS: function(elem, match) {
                return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
            },
            ATTR: function(elem, match) {
                var name = match[1],
                    result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                    value = result + "",
                    type = match[2],
                    check = match[4];
                return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value != check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
            },
            POS: function(elem, match, i, array) {
                var name = match[2],
                    filter = Expr.setFilters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                }
            }
        }
    };
    var origPOS = Expr.match.POS;
    for (var type in Expr.match) {
        Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
        Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source);
    }
    var makeArray = function(array, results) {
        array = Array.prototype.slice.call(array, 0);
        if (results) {
            results.push.apply(results, array);
            return results;
        }
        return array;
    };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes, 0);
    } catch (e) {
        makeArray = function(array, results) {
            var ret = results || [];
            if (toString.call(array) === "[object Array]") {
                Array.prototype.push.apply(ret, array);
            } else {
                if (typeof array.length === "number") {
                    for (var i = 0, l = array.length; i < l; i++) {
                        ret.push(array[i]);
                    }
                } else {
                    for (var i = 0; array[i]; i++) {
                        ret.push(array[i]);
                    }
                }
            }
            return ret;
        };
    }
    var sortOrder;
    if (document.documentElement.compareDocumentPosition) {
        sortOrder = function(a, b) {
            if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                if (a == b) {
                    hasDuplicate = true;
                }
                return 0;
            }
            var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
            if (ret === 0) {
                hasDuplicate = true;
            }
            return ret;
        };
    } else if ("sourceIndex" in document.documentElement) {
        sortOrder = function(a, b) {
            if (!a.sourceIndex || !b.sourceIndex) {
                if (a == b) {
                    hasDuplicate = true;
                }
                return 0;
            }
            var ret = a.sourceIndex - b.sourceIndex;
            if (ret === 0) {
                hasDuplicate = true;
            }
            return ret;
        };
    } else if (document.createRange) {
        sortOrder = function(a, b) {
            if (!a.ownerDocument || !b.ownerDocument) {
                if (a == b) {
                    hasDuplicate = true;
                }
                return 0;
            }
            var aRange = a.ownerDocument.createRange(),
                bRange = b.ownerDocument.createRange();
            aRange.setStart(a, 0);
            aRange.setEnd(a, 0);
            bRange.setStart(b, 0);
            bRange.setEnd(b, 0);
            var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
            if (ret === 0) {
                hasDuplicate = true;
            }
            return ret;
        };
    }
    (function() {
        var form = document.createElement("div"),
            id = "script" + (new Date).getTime();
        form.innerHTML = "<a name='" + id + "'/>";
        var root = document.documentElement;
        root.insertBefore(form, root.firstChild);
        if (!!document.getElementById(id)) {
            Expr.find.ID = function(match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                }
            };
            Expr.filter.ID = function(elem, match) {
                var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return elem.nodeType === 1 && node && node.nodeValue === match;
            };
        }
        root.removeChild(form);
        root = form = null;
    })();
    (function() {
        var div = document.createElement("div");
        div.appendChild(document.createComment(""));
        if (div.getElementsByTagName("*").length > 0) {
            Expr.find.TAG = function(match, context) {
                var results = context.getElementsByTagName(match[1]);
                if (match[1] === "*") {
                    var tmp = [];
                    for (var i = 0; results[i]; i++) {
                        if (results[i].nodeType === 1) {
                            tmp.push(results[i]);
                        }
                    }
                    results = tmp;
                }
                return results;
            };
        }
        div.innerHTML = "<a href='#'></a>";
        if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
            Expr.attrHandle.href = function(elem) {
                return elem.getAttribute("href", 2);
            };
        }
        div = null;
    })();
    if (document.querySelectorAll)(function() {
        var oldSizzle = Sizzle,
            div = document.createElement("div");
        div.innerHTML = "<p class='TEST'></p>";
        if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
            return;
        }
        Sizzle = function(query, context, extra, seed) {
            context = context || document;
            if (!seed && context.nodeType === 9 && !isXML(context)) {
                try {
                    return makeArray(context.querySelectorAll(query), extra);
                } catch (e) {}
            }
            return oldSizzle(query, context, extra, seed);
        };
        for (var prop in oldSizzle) {
            Sizzle[prop] = oldSizzle[prop];
        }
        div = null;
    })();
    if (document.getElementsByClassName && document.documentElement.getElementsByClassName)(function() {
        var div = document.createElement("div");
        div.innerHTML = "<div class='test e'></div><div class='test'></div>";
        if (div.getElementsByClassName("e").length === 0)
            return;
        div.lastChild.className = "e";
        if (div.getElementsByClassName("e").length === 1)
            return;
        Expr.order.splice(1, 0, "CLASS");
        Expr.find.CLASS = function(match, context, isXML) {
            if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                return context.getElementsByClassName(match[1]);
            }
        };
        div = null;
    })();

    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        var sibDir = dir == "previousSibling" && !isXML;
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                if (sibDir && elem.nodeType === 1) {
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1 && !isXML) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }
                    if (elem.nodeName === cur) {
                        match = elem;
                        break;
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }

    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        var sibDir = dir == "previousSibling" && !isXML;
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                if (sibDir && elem.nodeType === 1) {
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1) {
                        if (!isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (typeof cur !== "string") {
                            if (elem === cur) {
                                match = true;
                                break;
                            }
                        } else if (Sizzle.filter(cur, [elem]).length > 0) {
                            match = elem;
                            break;
                        }
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }
    var contains = document.compareDocumentPosition ? function(a, b) {
        return a.compareDocumentPosition(b) & 16;
    } : function(a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };
    var isXML = function(elem) {
        return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" || !!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
    };
    var posProcess = function(selector, context) {
        var tmpSet = [],
            later = "",
            match, root = context.nodeType ? [context] : context;
        while ((match = Expr.match.PSEUDO.exec(selector))) {
            later += match[0];
            selector = selector.replace(Expr.match.PSEUDO, "");
        }
        selector = Expr.relative[selector] ? selector + "*" : selector;
        for (var i = 0, l = root.length; i < l; i++) {
            Sizzle(selector, root[i], tmpSet);
        }
        return Sizzle.filter(later, tmpSet);
    };
    window.Sizzle = Sizzle;
})();;
(function(engine) {
    var extendElements = Prototype.Selector.extendElements;

    function select(selector, scope) {
        return extendElements(engine(selector, scope || document));
    }

    function match(element, selector) {
        return engine.matches(selector, [element]).length == 1;
    }
    Prototype.Selector.engine = engine;
    Prototype.Selector.select = select;
    Prototype.Selector.match = match;
})(Sizzle);
window.Sizzle = Prototype._original_property;
delete Prototype._original_property;
var Form = {
    reset: function(form) {
        form = $(form);
        form.reset();
        return form;
    },
    serializeElements: function(elements, options) {
        if (typeof options != 'object') options = {
            hash: !!options
        };
        else if (Object.isUndefined(options.hash)) options.hash = true;
        var key, value, submitted = false,
            submit = options.submit,
            accumulator, initial;
        if (options.hash) {
            initial = {};
            accumulator = function(result, key, value) {
                if (key in result) {
                    if (!Object.isArray(result[key])) result[key] = [result[key]];
                    result[key].push(value);
                } else result[key] = value;
                return result;
            };
        } else {
            initial = '';
            accumulator = function(result, key, value) {
                return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }
        }
        return elements.inject(initial, function(result, element) {
            if (!element.disabled && element.name) {
                key = element.name;
                value = $(element).getValue();
                if (value != null && element.type != 'file' && (element.type != 'submit' || (!submitted && submit !== false && (!submit || key == submit) && (submitted = true)))) {
                    result = accumulator(result, key, value);
                }
            }
            return result;
        });
    }
};
Form.Methods = {
    serialize: function(form, options) {
        return Form.serializeElements(Form.getElements(form), options);
    },
    getElements: function(form) {
        var elements = $(form).getElementsByTagName('*'),
            element, arr = [],
            serializers = Form.Element.Serializers;
        for (var i = 0; element = elements[i]; i++) {
            arr.push(element);
        }
        return arr.inject([], function(elements, child) {
            if (serializers[child.tagName.toLowerCase()])
                elements.push(Element.extend(child));
            return elements;
        })
    },
    getInputs: function(form, typeName, name) {
        form = $(form);
        var inputs = form.getElementsByTagName('input');
        if (!typeName && !name) return $A(inputs).map(Element.extend);
        for (var i = 0, matchingInputs = [], length = inputs.length; i < length; i++) {
            var input = inputs[i];
            if ((typeName && input.type != typeName) || (name && input.name != name))
                continue;
            matchingInputs.push(Element.extend(input));
        }
        return matchingInputs;
    },
    disable: function(form) {
        form = $(form);
        Form.getElements(form).invoke('disable');
        return form;
    },
    enable: function(form) {
        form = $(form);
        Form.getElements(form).invoke('enable');
        return form;
    },
    findFirstElement: function(form) {
        var elements = $(form).getElements().findAll(function(element) {
            return 'hidden' != element.type && !element.disabled;
        });
        var firstByIndex = elements.findAll(function(element) {
            return element.hasAttribute('tabIndex') && element.tabIndex >= 0;
        }).sortBy(function(element) {
            return element.tabIndex
        }).first();
        return firstByIndex ? firstByIndex : elements.find(function(element) {
            return /^(?:input|select|textarea)$/i.test(element.tagName);
        });
    },
    focusFirstElement: function(form) {
        form = $(form);
        var element = form.findFirstElement();
        if (element) element.activate();
        return form;
    },
    request: function(form, options) {
        form = $(form), options = Object.clone(options || {});
        var params = options.parameters,
            action = form.readAttribute('action') || '';
        if (action.blank()) action = window.location.href;
        options.parameters = form.serialize(true);
        if (params) {
            if (Object.isString(params)) params = params.toQueryParams();
            Object.extend(options.parameters, params);
        }
        if (form.hasAttribute('method') && !options.method)
            options.method = form.method;
        return new Ajax.Request(action, options);
    }
};
Form.Element = {
    focus: function(element) {
        $(element).focus();
        return element;
    },
    select: function(element) {
        $(element).select();
        return element;
    }
};
Form.Element.Methods = {
    serialize: function(element) {
        element = $(element);
        if (!element.disabled && element.name) {
            var value = element.getValue();
            if (value != undefined) {
                var pair = {};
                pair[element.name] = value;
                return Object.toQueryString(pair);
            }
        }
        return '';
    },
    getValue: function(element) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        return Form.Element.Serializers[method](element);
    },
    setValue: function(element, value) {
        element = $(element);
        var method = element.tagName.toLowerCase();
        Form.Element.Serializers[method](element, value);
        return element;
    },
    clear: function(element) {
        $(element).value = '';
        return element;
    },
    present: function(element) {
        return $(element).value != '';
    },
    activate: function(element) {
        element = $(element);
        try {
            element.focus();
            if (element.select && (element.tagName.toLowerCase() != 'input' || !(/^(?:button|reset|submit)$/i.test(element.type))))
                element.select();
        } catch (e) {}
        return element;
    },
    disable: function(element) {
        element = $(element);
        element.disabled = true;
        return element;
    },
    enable: function(element) {
        element = $(element);
        element.disabled = false;
        return element;
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = (function() {
    function input(element, value) {
        switch (element.type.toLowerCase()) {
            case 'checkbox':
            case 'radio':
                return inputSelector(element, value);
            default:
                return valueSelector(element, value);
        }
    }

    function inputSelector(element, value) {
        if (Object.isUndefined(value))
            return element.checked ? element.value : null;
        else element.checked = !!value;
    }

    function valueSelector(element, value) {
        if (Object.isUndefined(value)) return element.value;
        else element.value = value;
    }

    function select(element, value) {
        if (Object.isUndefined(value))
            return (element.type === 'select-one' ? selectOne : selectMany)(element);
        var opt, currentValue, single = !Object.isArray(value);
        for (var i = 0, length = element.length; i < length; i++) {
            opt = element.options[i];
            currentValue = this.optionValue(opt);
            if (single) {
                if (currentValue == value) {
                    opt.selected = true;
                    return;
                }
            } else opt.selected = value.include(currentValue);
        }
    }

    function selectOne(element) {
        var index = element.selectedIndex;
        return index >= 0 ? optionValue(element.options[index]) : null;
    }

    function selectMany(element) {
        var values, length = element.length;
        if (!length) return null;
        for (var i = 0, values = []; i < length; i++) {
            var opt = element.options[i];
            if (opt.selected) values.push(optionValue(opt));
        }
        return values;
    }

    function optionValue(opt) {
        return Element.hasAttribute(opt, 'value') ? opt.value : opt.text;
    }
    return {
        input: input,
        inputSelector: inputSelector,
        textarea: valueSelector,
        select: select,
        selectOne: selectOne,
        selectMany: selectMany,
        optionValue: optionValue,
        button: valueSelector
    };
})();
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function($super, element, frequency, callback) {
        $super(callback, frequency);
        this.element = $(element);
        this.lastValue = this.getValue();
    },
    execute: function() {
        var value = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(value) ? this.lastValue != value : String(this.lastValue) != String(value)) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element);
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function() {
        return Form.serialize(this.element);
    }
});
Abstract.EventObserver = Class.create({
    initialize: function(element, callback) {
        this.element = $(element);
        this.callback = callback;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == 'form')
            this.registerFormCallbacks();
        else
            this.registerCallback(this.element);
    },
    onElementEvent: function() {
        var value = this.getValue();
        if (this.lastValue != value) {
            this.callback(this.element, value);
            this.lastValue = value;
        }
    },
    registerFormCallbacks: function() {
        Form.getElements(this.element).each(this.registerCallback, this);
    },
    registerCallback: function(element) {
        if (element.type) {
            switch (element.type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                    Event.observe(element, 'click', this.onElementEvent.bind(this));
                    break;
                default:
                    Event.observe(element, 'change', this.onElementEvent.bind(this));
                    break;
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.Element.getValue(this.element);
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function() {
        return Form.serialize(this.element);
    }
});
(function() {
    var Event = {
        KEY_BACKSPACE: 8,
        KEY_TAB: 9,
        KEY_RETURN: 13,
        KEY_ESC: 27,
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_DELETE: 46,
        KEY_HOME: 36,
        KEY_END: 35,
        KEY_PAGEUP: 33,
        KEY_PAGEDOWN: 34,
        KEY_INSERT: 45,
        cache: {}
    };
    var docEl = document.documentElement;
    var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED = 'onmouseenter' in docEl && 'onmouseleave' in docEl;
    var isIELegacyEvent = function(event) {
        return false;
    };
    if (window.attachEvent) {
        if (window.addEventListener) {
            isIELegacyEvent = function(event) {
                return !(event instanceof window.Event);
            };
        } else {
            isIELegacyEvent = function(event) {
                return true;
            };
        }
    }
    var _isButton;

    function _isButtonForDOMEvents(event, code) {
        return event.which ? (event.which === code + 1) : (event.button === code);
    }
    var legacyButtonMap = {
        0: 1,
        1: 4,
        2: 2
    };

    function _isButtonForLegacyEvents(event, code) {
        return event.button === legacyButtonMap[code];
    }

    function _isButtonForWebKit(event, code) {
        switch (code) {
            case 0:
                return event.which == 1 && !event.metaKey;
            case 1:
                return event.which == 2 || (event.which == 1 && event.metaKey);
            case 2:
                return event.which == 3;
            default:
                return false;
        }
    }
    if (window.attachEvent) {
        if (!window.addEventListener) {
            _isButton = _isButtonForLegacyEvents;
        } else {
            _isButton = function(event, code) {
                return isIELegacyEvent(event) ? _isButtonForLegacyEvents(event, code) : _isButtonForDOMEvents(event, code);
            }
        }
    } else if (Prototype.Browser.WebKit) {
        _isButton = _isButtonForWebKit;
    } else {
        _isButton = _isButtonForDOMEvents;
    }

    function isLeftClick(event) {
        return _isButton(event, 0)
    }

    function isMiddleClick(event) {
        return _isButton(event, 1)
    }

    function isRightClick(event) {
        return _isButton(event, 2)
    }

    function element(event) {
        event = Event.extend(event);
        var node = event.target,
            type = event.type,
            currentTarget = event.currentTarget;
        if (currentTarget && currentTarget.tagName) {
            if (type === 'load' || type === 'error' || (type === 'click' && currentTarget.tagName.toLowerCase() === 'input' && currentTarget.type === 'radio'))
                node = currentTarget;
        }
        if (node.nodeType == Node.TEXT_NODE)
            node = node.parentNode;
        return Element.extend(node);
    }

    function findElement(event, expression) {
        var element = Event.element(event);
        if (!expression) return element;
        while (element) {
            if (Object.isElement(element) && Prototype.Selector.match(element, expression)) {
                return Element.extend(element);
            }
            element = element.parentNode;
        }
    }

    function pointer(event) {
        return {
            x: pointerX(event),
            y: pointerY(event)
        };
    }

    function pointerX(event) {
        var docElement = document.documentElement,
            body = document.body || {
                scrollLeft: 0
            };
        return event.pageX || (event.clientX +
            (docElement.scrollLeft || body.scrollLeft) -
            (docElement.clientLeft || 0));
    }

    function pointerY(event) {
        var docElement = document.documentElement,
            body = document.body || {
                scrollTop: 0
            };
        return event.pageY || (event.clientY +
            (docElement.scrollTop || body.scrollTop) -
            (docElement.clientTop || 0));
    }

    function stop(event) {
        Event.extend(event);
        event.preventDefault();
        event.stopPropagation();
        event.stopped = true;
    }
    Event.Methods = {
        isLeftClick: isLeftClick,
        isMiddleClick: isMiddleClick,
        isRightClick: isRightClick,
        element: element,
        findElement: findElement,
        pointer: pointer,
        pointerX: pointerX,
        pointerY: pointerY,
        stop: stop
    };
    var methods = Object.keys(Event.Methods).inject({}, function(m, name) {
        m[name] = Event.Methods[name].methodize();
        return m;
    });
    if (window.attachEvent) {
        function _relatedTarget(event) {
            var element;
            switch (event.type) {
                case 'mouseover':
                case 'mouseenter':
                    element = event.fromElement;
                    break;
                case 'mouseout':
                case 'mouseleave':
                    element = event.toElement;
                    break;
                default:
                    return null;
            }
            return Element.extend(element);
        }
        var additionalMethods = {
            stopPropagation: function() {
                this.cancelBubble = true
            },
            preventDefault: function() {
                this.returnValue = false
            },
            inspect: function() {
                return '[object Event]'
            }
        };
        Event.extend = function(event, element) {
            if (!event) return false;
            if (!isIELegacyEvent(event)) return event;
            if (event._extendedByPrototype) return event;
            event._extendedByPrototype = Prototype.emptyFunction;
            var pointer = Event.pointer(event);
            Object.extend(event, {
                target: event.srcElement || element,
                relatedTarget: _relatedTarget(event),
                pageX: pointer.x,
                pageY: pointer.y
            });
            Object.extend(event, methods);
            Object.extend(event, additionalMethods);
            return event;
        };
    } else {
        Event.extend = Prototype.K;
    }
    if (window.addEventListener) {
        Event.prototype = window.Event.prototype || document.createEvent('HTMLEvents').__proto__;
        Object.extend(Event.prototype, methods);
    }

    function _createResponder(element, eventName, handler) {
        var registry = Element.retrieve(element, 'prototype_event_registry');
        if (Object.isUndefined(registry)) {
            CACHE.push(element);
            registry = Element.retrieve(element, 'prototype_event_registry', $H());
        }
        var respondersForEvent = registry.get(eventName);
        if (Object.isUndefined(respondersForEvent)) {
            respondersForEvent = [];
            registry.set(eventName, respondersForEvent);
        }
        if (respondersForEvent.pluck('handler').include(handler)) return false;
        var responder;
        if (eventName.include(":")) {
            responder = function(event) {
                if (Object.isUndefined(event.eventName))
                    return false;
                if (event.eventName !== eventName)
                    return false;
                Event.extend(event, element);
                handler.call(element, event);
            };
        } else {
            if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED && (eventName === "mouseenter" || eventName === "mouseleave")) {
                if (eventName === "mouseenter" || eventName === "mouseleave") {
                    responder = function(event) {
                        Event.extend(event, element);
                        var parent = event.relatedTarget;
                        while (parent && parent !== element) {
                            try {
                                parent = parent.parentNode;
                            } catch (e) {
                                parent = element;
                            }
                        }
                        if (parent === element) return;
                        handler.call(element, event);
                    };
                }
            } else {
                responder = function(event) {
                    Event.extend(event, element);
                    handler.call(element, event);
                };
            }
        }
        responder.handler = handler;
        respondersForEvent.push(responder);
        return responder;
    }

    function _destroyCache() {
        for (var i = 0, length = CACHE.length; i < length; i++) {
            Event.stopObserving(CACHE[i]);
            CACHE[i] = null;
        }
    }
    var CACHE = [];
    if (Prototype.Browser.IE)
        window.attachEvent('onunload', _destroyCache);
    if (Prototype.Browser.WebKit)
        window.addEventListener('unload', Prototype.emptyFunction, false);
    var _getDOMEventName = Prototype.K,
        translations = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
    if (!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED) {
        _getDOMEventName = function(eventName) {
            return (translations[eventName] || eventName);
        };
    }

    function observe(element, eventName, handler) {
        element = $(element);
        var responder = _createResponder(element, eventName, handler);
        if (!responder) return element;
        if (eventName.include(':')) {
            if (element.addEventListener)
                element.addEventListener("dataavailable", responder, false);
            else {
                element.attachEvent("ondataavailable", responder);
                element.attachEvent("onlosecapture", responder);
            }
        } else {
            var actualEventName = _getDOMEventName(eventName);
            if (element.addEventListener)
                element.addEventListener(actualEventName, responder, false);
            else
                element.attachEvent("on" + actualEventName, responder);
        }
        return element;
    }

    function stopObserving(element, eventName, handler) {
        element = $(element);
        var registry = Element.retrieve(element, 'prototype_event_registry');
        if (!registry) return element;
        if (!eventName) {
            registry.each(function(pair) {
                var eventName = pair.key;
                stopObserving(element, eventName);
            });
            return element;
        }
        var responders = registry.get(eventName);
        if (!responders) return element;
        if (!handler) {
            responders.each(function(r) {
                stopObserving(element, eventName, r.handler);
            });
            return element;
        }
        var i = responders.length,
            responder;
        while (i--) {
            if (responders[i].handler === handler) {
                responder = responders[i];
                break;
            }
        }
        if (!responder) return element;
        if (eventName.include(':')) {
            if (element.removeEventListener)
                element.removeEventListener("dataavailable", responder, false);
            else {
                element.detachEvent("ondataavailable", responder);
                element.detachEvent("onlosecapture", responder);
            }
        } else {
            var actualEventName = _getDOMEventName(eventName);
            if (element.removeEventListener)
                element.removeEventListener(actualEventName, responder, false);
            else
                element.detachEvent('on' + actualEventName, responder);
        }
        registry.set(eventName, responders.without(responder));
        return element;
    }

    function fire(element, eventName, memo, bubble) {
        element = $(element);
        if (Object.isUndefined(bubble))
            bubble = true;
        if (element == document && document.createEvent && !element.dispatchEvent)
            element = document.documentElement;
        var event;
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent('dataavailable', bubble, true);
        } else {
            event = document.createEventObject();
            event.eventType = bubble ? 'ondataavailable' : 'onlosecapture';
        }
        event.eventName = eventName;
        event.memo = memo || {};
        if (document.createEvent)
            element.dispatchEvent(event);
        else
            element.fireEvent(event.eventType, event);
        return Event.extend(event);
    }
    Event.Handler = Class.create({
        initialize: function(element, eventName, selector, callback) {
            this.element = $(element);
            this.eventName = eventName;
            this.selector = selector;
            this.callback = callback;
            this.handler = this.handleEvent.bind(this);
        },
        start: function() {
            Event.observe(this.element, this.eventName, this.handler);
            return this;
        },
        stop: function() {
            Event.stopObserving(this.element, this.eventName, this.handler);
            return this;
        },
        handleEvent: function(event) {
            var element = Event.findElement(event, this.selector);
            if (element) this.callback.call(this.element, event, element);
        }
    });

    function on(element, eventName, selector, callback) {
        element = $(element);
        if (Object.isFunction(selector) && Object.isUndefined(callback)) {
            callback = selector, selector = null;
        }
        return new Event.Handler(element, eventName, selector, callback).start();
    }
    Object.extend(Event, Event.Methods);
    Object.extend(Event, {
        fire: fire,
        observe: observe,
        stopObserving: stopObserving,
        on: on
    });
    Element.addMethods({
        fire: fire,
        observe: observe,
        stopObserving: stopObserving,
        on: on
    });
    Object.extend(document, {
        fire: fire.methodize(),
        observe: observe.methodize(),
        stopObserving: stopObserving.methodize(),
        on: on.methodize(),
        loaded: false
    });
    if (window.Event) Object.extend(window.Event, Event);
    else window.Event = Event;
})();
(function() {
    var timer;

    function fireContentLoadedEvent() {
        if (document.loaded) return;
        if (timer) window.clearTimeout(timer);
        document.loaded = true;
        document.fire('dom:loaded');
    }

    function checkReadyState() {
        if (document.readyState === 'complete') {
            document.stopObserving('readystatechange', checkReadyState);
            fireContentLoadedEvent();
        }
    }

    function pollDoScroll() {
        try {
            document.documentElement.doScroll('left');
        } catch (e) {
            timer = pollDoScroll.defer();
            return;
        }
        fireContentLoadedEvent();
    }
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
    } else {
        document.observe('readystatechange', checkReadyState);
        if (window == top)
            timer = pollDoScroll.defer();
    }
    Event.observe(window, 'load', fireContentLoadedEvent);
})();
Element.addMethods();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function(element, content) {
        return Element.insert(element, {
            before: content
        });
    },
    Top: function(element, content) {
        return Element.insert(element, {
            top: content
        });
    },
    Bottom: function(element, content) {
        return Element.insert(element, {
            bottom: content
        });
    },
    After: function(element, content) {
        return Element.insert(element, {
            after: content
        });
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function() {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    },
    within: function(element, x, y) {
        if (this.includeScrollOffsets)
            return this.withinIncludingScrolloffsets(element, x, y);
        this.xcomp = x;
        this.ycomp = y;
        this.offset = Element.cumulativeOffset(element);
        return (y >= this.offset[1] && y < this.offset[1] + element.offsetHeight && x >= this.offset[0] && x < this.offset[0] + element.offsetWidth);
    },
    withinIncludingScrolloffsets: function(element, x, y) {
        var offsetcache = Element.cumulativeScrollOffset(element);
        this.xcomp = x + offsetcache[0] - this.deltaX;
        this.ycomp = y + offsetcache[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(element);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + element.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + element.offsetWidth);
    },
    overlap: function(mode, element) {
        if (!mode) return 0;
        if (mode == 'vertical')
            return ((this.offset[1] + element.offsetHeight) - this.ycomp) / element.offsetHeight;
        if (mode == 'horizontal')
            return ((this.offset[0] + element.offsetWidth) - this.xcomp) / element.offsetWidth;
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function(element) {
        Position.prepare();
        return Element.absolutize(element);
    },
    relativize: function(element) {
        Position.prepare();
        return Element.relativize(element);
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function(source, target, options) {
        options = options || {};
        return Element.clonePosition(target, source, options);
    }
};
if (!document.getElementsByClassName) document.getElementsByClassName = function(instanceMethods) {
    function iter(name) {
        return name.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + name + " ')]";
    }
    instanceMethods.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function(element, className) {
        className = className.toString().strip();
        var cond = /\s/.test(className) ? $w(className).map(iter).join('') : iter(className);
        return cond ? document._getElementsByXPath('.//*' + cond, element) : [];
    } : function(element, className) {
        className = className.toString().strip();
        var elements = [],
            classNames = (/\s/.test(className) ? $w(className) : null);
        if (!classNames && !className) return elements;
        var nodes = $(element).getElementsByTagName('*');
        className = ' ' + className + ' ';
        for (var i = 0, child, cn; child = nodes[i]; i++) {
            if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(className) || (classNames && classNames.all(function(name) {
                    return !name.toString().blank() && cn.include(' ' + name + ' ');
                }))))
                elements.push(Element.extend(child));
        }
        return elements;
    };
    return function(className, parentElement) {
        return $(parentElement || document.body).getElementsByClassName(className);
    };
}(Element.Methods);
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function(element) {
        this.element = $(element);
    },
    _each: function(iterator) {
        this.element.className.split(/\s+/).select(function(name) {
            return name.length > 0;
        })._each(iterator);
    },
    set: function(className) {
        this.element.className = className;
    },
    add: function(classNameToAdd) {
        if (this.include(classNameToAdd)) return;
        this.set($A(this).concat(classNameToAdd).join(' '));
    },
    remove: function(classNameToRemove) {
        if (!this.include(classNameToRemove)) return;
        this.set($A(this).without(classNameToRemove).join(' '));
    },
    toString: function() {
        return $A(this).join(' ');
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
(function() {
    window.Selector = Class.create({
        initialize: function(expression) {
            this.expression = expression.strip();
        },
        findElements: function(rootElement) {
            return Prototype.Selector.select(this.expression, rootElement);
        },
        match: function(element) {
            return Prototype.Selector.match(element, this.expression);
        },
        toString: function() {
            return this.expression;
        },
        inspect: function() {
            return "#<Selector: " + this.expression + ">";
        }
    });
    Object.extend(Selector, {
        matchElements: function(elements, expression) {
            var match = Prototype.Selector.match,
                results = [];
            for (var i = 0, length = elements.length; i < length; i++) {
                var element = elements[i];
                if (match(element, expression)) {
                    results.push(Element.extend(element));
                }
            }
            return results;
        },
        findElement: function(elements, expression, index) {
            index = index || 0;
            var matchIndex = 0,
                element;
            for (var i = 0, length = elements.length; i < length; i++) {
                element = elements[i];
                if (Prototype.Selector.match(element, expression) && index === matchIndex++) {
                    return Element.extend(element);
                }
            }
        },
        findChildElements: function(element, expressions) {
            var selector = expressions.toArray().join(', ');
            return Prototype.Selector.select(selector, element || document);
        }
    });
})();

function validateCreditCard(s) {
    var v = "0123456789";
    var w = "";
    for (i = 0; i < s.length; i++) {
        x = s.charAt(i);
        if (v.indexOf(x, 0) != -1)
            w += x;
    }
    j = w.length / 2;
    k = Math.floor(j);
    m = Math.ceil(j) - k;
    c = 0;
    for (i = 0; i < k; i++) {
        a = w.charAt(i * 2 + m) * 2;
        c += a > 9 ? Math.floor(a / 10 + a % 10) : a;
    }
    for (i = 0; i < k + m; i++) c += w.charAt(i * 2 + 1 - m) * 1;
    return (c % 10 == 0);
}
var Validator = Class.create();
Validator.prototype = {
    initialize: function(className, error, test, options) {
        if (typeof test == 'function') {
            this.options = $H(options);
            this._test = test;
        } else {
            this.options = $H(test);
            this._test = function() {
                return true
            };
        }
        this.error = error || 'Validation failed.';
        this.className = className;
    },
    test: function(v, elm) {
        return (this._test(v, elm) && this.options.all(function(p) {
            return Validator.methods[p.key] ? Validator.methods[p.key](v, elm, p.value) : true;
        }));
    }
}
Validator.methods = {
    pattern: function(v, elm, opt) {
        return Validation.get('IsEmpty').test(v) || opt.test(v)
    },
    minLength: function(v, elm, opt) {
        return v.length >= opt
    },
    maxLength: function(v, elm, opt) {
        return v.length <= opt
    },
    min: function(v, elm, opt) {
        return v >= parseFloat(opt)
    },
    max: function(v, elm, opt) {
        return v <= parseFloat(opt)
    },
    notOneOf: function(v, elm, opt) {
        return $A(opt).all(function(value) {
            return v != value;
        })
    },
    oneOf: function(v, elm, opt) {
        return $A(opt).any(function(value) {
            return v == value;
        })
    },
    is: function(v, elm, opt) {
        return v == opt
    },
    isNot: function(v, elm, opt) {
        return v != opt
    },
    equalToField: function(v, elm, opt) {
        return v == $F(opt)
    },
    notEqualToField: function(v, elm, opt) {
        return v != $F(opt)
    },
    include: function(v, elm, opt) {
        return $A(opt).all(function(value) {
            return Validation.get(value).test(v, elm);
        })
    }
}
var Validation = Class.create();
Validation.defaultOptions = {
    onSubmit: true,
    stopOnFirst: false,
    immediate: false,
    focusOnError: true,
    useTitles: false,
    addClassNameToContainer: false,
    containerClassName: '.input-box',
    onFormValidate: function(result, form) {},
    onElementValidate: function(result, elm) {}
};
Validation.prototype = {
    initialize: function(form, options) {
        this.form = $(form);
        if (!this.form) {
            return;
        }
        this.options = Object.extend({
            onSubmit: Validation.defaultOptions.onSubmit,
            stopOnFirst: Validation.defaultOptions.stopOnFirst,
            immediate: Validation.defaultOptions.immediate,
            focusOnError: Validation.defaultOptions.focusOnError,
            useTitles: Validation.defaultOptions.useTitles,
            onFormValidate: Validation.defaultOptions.onFormValidate,
            onElementValidate: Validation.defaultOptions.onElementValidate
        }, options || {});
        if (this.options.onSubmit) Event.observe(this.form, 'submit', this.onSubmit.bind(this), false);
        if (this.options.immediate) {
            Form.getElements(this.form).each(function(input) {
                if (input.tagName.toLowerCase() == 'select') {
                    Event.observe(input, 'blur', this.onChange.bindAsEventListener(this));
                }
                if (input.type.toLowerCase() == 'radio' || input.type.toLowerCase() == 'checkbox') {
                    Event.observe(input, 'click', this.onChange.bindAsEventListener(this));
                } else {
                    Event.observe(input, 'change', this.onChange.bindAsEventListener(this));
                }
            }, this);
        }
    },
    onChange: function(ev) {
        Validation.isOnChange = true;
        Validation.validate(Event.element(ev), {
            useTitle: this.options.useTitles,
            onElementValidate: this.options.onElementValidate
        });
        Validation.isOnChange = false;
    },
    onSubmit: function(ev) {
        if (!this.validate()) Event.stop(ev);
    },
    validate: function() {
        var result = false;
        var useTitles = this.options.useTitles;
        var callback = this.options.onElementValidate;
        try {
            if (this.options.stopOnFirst) {
                result = Form.getElements(this.form).all(function(elm) {
                    if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                        return true;
                    }
                    return Validation.validate(elm, {
                        useTitle: useTitles,
                        onElementValidate: callback
                    });
                }, this);
            } else {
                result = Form.getElements(this.form).collect(function(elm) {
                    if (elm.hasClassName('local-validation') && !this.isElementInForm(elm, this.form)) {
                        return true;
                    }
                    return Validation.validate(elm, {
                        useTitle: useTitles,
                        onElementValidate: callback
                    });
                }, this).all();
            }
        } catch (e) {}
        if (!result && this.options.focusOnError) {
            try {
                Form.getElements(this.form).findAll(function(elm) {
                    return $(elm).hasClassName('validation-failed')
                }).first().focus()
            } catch (e) {}
        }
        this.options.onFormValidate(result, this.form);
        return result;
    },
    reset: function() {
        Form.getElements(this.form).each(Validation.reset);
    },
    isElementInForm: function(elm, form) {
        var domForm = elm.up('form');
        if (domForm == form) {
            return true;
        }
        return false;
    }
}
Object.extend(Validation, {
    validate: function(elm, options) {
        options = Object.extend({
            useTitle: false,
            onElementValidate: function(result, elm) {}
        }, options || {});
        elm = $(elm);
        var cn = $w(elm.className);
        return result = cn.all(function(value) {
            var test = Validation.test(value, elm, options.useTitle);
            options.onElementValidate(test, elm);
            return test;
        });
    },
    insertAdvice: function(elm, advice) {
        var container = $(elm).up('.field-row');
        if (container) {
            Element.insert(container, {
                after: advice
            });
        } else if (elm.up('td.value')) {
            elm.up('td.value').insert({
                bottom: advice
            });
        } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
            $(elm.advaiceContainer).update(advice);
        } else {
            switch (elm.type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                    var p = elm.parentNode;
                    if (p) {
                        Element.insert(p, {
                            'bottom': advice
                        });
                    } else {
                        Element.insert(elm, {
                            'after': advice
                        });
                    }
                    break;
                default:
                    Element.insert(elm, {
                        'after': advice
                    });
            }
        }
    },
    showAdvice: function(elm, advice, adviceName) {
        if (!elm.advices) {
            elm.advices = new Hash();
        } else {
            elm.advices.each(function(pair) {
                if (!advice || pair.value.id != advice.id) {
                    this.hideAdvice(elm, pair.value);
                }
            }.bind(this));
        }
        elm.advices.set(adviceName, advice);
        if (typeof Effect == 'undefined') {
            advice.style.display = 'block';
        } else {
            if (!advice._adviceAbsolutize) {
                new Effect.Appear(advice, {
                    duration: 1
                });
            } else {
                Position.absolutize(advice);
                advice.show();
                advice.setStyle({
                    'top': advice._adviceTop,
                    'left': advice._adviceLeft,
                    'width': advice._adviceWidth,
                    'z-index': 1000
                });
                advice.addClassName('advice-absolute');
            }
        }
    },
    hideAdvice: function(elm, advice) {
        if (advice != null) {
            new Effect.Fade(advice, {
                duration: 1,
                afterFinishInternal: function() {
                    advice.hide();
                }
            });
        }
    },
    updateCallback: function(elm, status) {
        if (typeof elm.callbackFunction != 'undefined') {
            eval(elm.callbackFunction + '(\'' + elm.id + '\',\'' + status + '\')');
        }
    },
    ajaxError: function(elm, errorMsg) {
        var name = 'validate-ajax';
        var advice = Validation.getAdvice(name, elm);
        if (advice == null) {
            advice = this.createAdvice(name, elm, false, errorMsg);
        }
        this.showAdvice(elm, advice, 'validate-ajax');
        this.updateCallback(elm, 'failed');
        elm.addClassName('validation-failed');
        elm.addClassName('validate-ajax');
        if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
            var container = elm.up(Validation.defaultOptions.containerClassName);
            if (container && this.allowContainerClassName(elm)) {
                container.removeClassName('validation-passed');
                container.addClassName('validation-error');
            }
        }
    },
    allowContainerClassName: function(elm) {
        if (elm.type == 'radio' || elm.type == 'checkbox') {
            return elm.hasClassName('change-container-classname');
        }
        return true;
    },
    test: function(name, elm, useTitle) {
        var v = Validation.get(name);
        var prop = '__advice' + name.camelize();
        try {
            if (Validation.isVisible(elm) && !v.test($F(elm), elm)) {
                var advice = Validation.getAdvice(name, elm);
                if (advice == null) {
                    advice = this.createAdvice(name, elm, useTitle);
                }
                this.showAdvice(elm, advice, name);
                this.updateCallback(elm, 'failed');
                elm[prop] = 1;
                if (!elm.advaiceContainer) {
                    elm.removeClassName('validation-passed');
                    elm.addClassName('validation-failed');
                }
                if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                    var container = elm.up(Validation.defaultOptions.containerClassName);
                    if (container && this.allowContainerClassName(elm)) {
                        container.removeClassName('validation-passed');
                        container.addClassName('validation-error');
                    }
                }
                return false;
            } else {
                var advice = Validation.getAdvice(name, elm);
                this.hideAdvice(elm, advice);
                this.updateCallback(elm, 'passed');
                elm[prop] = '';
                elm.removeClassName('validation-failed');
                elm.addClassName('validation-passed');
                if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                    var container = elm.up(Validation.defaultOptions.containerClassName);
                    if (container && !container.down('.validation-failed') && this.allowContainerClassName(elm)) {
                        if (!Validation.get('IsEmpty').test(elm.value) || !this.isVisible(elm)) {
                            container.addClassName('validation-passed');
                        } else {
                            container.removeClassName('validation-passed');
                        }
                        container.removeClassName('validation-error');
                    }
                }
                return true;
            }
        } catch (e) {
            throw (e)
        }
    },
    isVisible: function(elm) {
        while (elm.tagName != 'BODY') {
            if (!$(elm).visible()) return false;
            elm = elm.parentNode;
        }
        return true;
    },
    getAdvice: function(name, elm) {
        return $('advice-' + name + '-' + Validation.getElmID(elm)) || $('advice-' + Validation.getElmID(elm));
    },
    createAdvice: function(name, elm, useTitle, customError) {
        var v = Validation.get(name);
        var errorMsg = useTitle ? ((elm && elm.title) ? elm.title : v.error) : v.error;
        if (customError) {
            errorMsg = customError;
        }
        try {
            if (Translator) {
                errorMsg = Translator.translate(errorMsg);
            }
        } catch (e) {}
        advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm) + '" style="display:none">' + errorMsg + '</div>'
        Validation.insertAdvice(elm, advice);
        advice = Validation.getAdvice(name, elm);
        if ($(elm).hasClassName('absolute-advice')) {
            var dimensions = $(elm).getDimensions();
            var originalPosition = Position.cumulativeOffset(elm);
            advice._adviceTop = (originalPosition[1] + dimensions.height) + 'px';
            advice._adviceLeft = (originalPosition[0]) + 'px';
            advice._adviceWidth = (dimensions.width) + 'px';
            advice._adviceAbsolutize = true;
        }
        return advice;
    },
    getElmID: function(elm) {
        return elm.id ? elm.id : elm.name;
    },
    reset: function(elm) {
        elm = $(elm);
        var cn = $w(elm.className);
        cn.each(function(value) {
            var prop = '__advice' + value.camelize();
            if (elm[prop]) {
                var advice = Validation.getAdvice(value, elm);
                if (advice) {
                    advice.hide();
                }
                elm[prop] = '';
            }
            elm.removeClassName('validation-failed');
            elm.removeClassName('validation-passed');
            if (Validation.defaultOptions.addClassNameToContainer && Validation.defaultOptions.containerClassName != '') {
                var container = elm.up(Validation.defaultOptions.containerClassName);
                if (container) {
                    container.removeClassName('validation-passed');
                    container.removeClassName('validation-error');
                }
            }
        });
    },
    add: function(className, error, test, options) {
        var nv = {};
        nv[className] = new Validator(className, error, test, options);
        Object.extend(Validation.methods, nv);
    },
    addAllThese: function(validators) {
        var nv = {};
        $A(validators).each(function(value) {
            nv[value[0]] = new Validator(value[0], value[1], value[2], (value.length > 3 ? value[3] : {}));
        });
        Object.extend(Validation.methods, nv);
    },
    get: function(name) {
        return Validation.methods[name] ? Validation.methods[name] : Validation.methods['_LikeNoIDIEverSaw_'];
    },
    methods: {
        '_LikeNoIDIEverSaw_': new Validator('_LikeNoIDIEverSaw_', '', {})
    }
});
Validation.add('IsEmpty', '', function(v) {
    return (v == '' || (v == null) || (v.length == 0) || /^\s+$/.test(v));
});
Validation.addAllThese([
    ['validate-no-html-tags', 'HTML tags are not allowed', function(v) {
        return !/<(\/)?\w+/.test(v);
    }],
    ['validate-select', 'Please select an option.', function(v) {
        return ((v != "none") && (v != null) && (v.length != 0));
    }],
    ['required-entry', 'This is a required field.', function(v) {
        return !Validation.get('IsEmpty').test(v);
    }],
    ['validate-number', 'Please enter a valid number in this field.', function(v) {
        return Validation.get('IsEmpty').test(v) || (!isNaN(parseNumber(v)) && /^\s*-?\d*(\.\d*)?\s*$/.test(v));
    }],
    ['validate-number-range', 'The value is not within the specified range.', function(v, elm) {
        if (Validation.get('IsEmpty').test(v)) {
            return true;
        }
        var numValue = parseNumber(v);
        if (isNaN(numValue)) {
            return false;
        }
        var reRange = /^number-range-(-?[\d.,]+)?-(-?[\d.,]+)?$/,
            result = true;
        $w(elm.className).each(function(name) {
            var m = reRange.exec(name);
            if (m) {
                result = result && (m[1] == null || m[1] == '' || numValue >= parseNumber(m[1])) && (m[2] == null || m[2] == '' || numValue <= parseNumber(m[2]));
            }
        });
        return result;
    }],
    ['validate-digits', 'Please use numbers only in this field. Please avoid spaces or other characters such as dots or commas.', function(v) {
        return Validation.get('IsEmpty').test(v) || !/[^\d]/.test(v);
    }],
    ['validate-digits-range', 'The value is not within the specified range.', function(v, elm) {
        if (Validation.get('IsEmpty').test(v)) {
            return true;
        }
        var numValue = parseNumber(v);
        if (isNaN(numValue)) {
            return false;
        }
        var reRange = /^digits-range-(-?\d+)?-(-?\d+)?$/,
            result = true;
        $w(elm.className).each(function(name) {
            var m = reRange.exec(name);
            if (m) {
                result = result && (m[1] == null || m[1] == '' || numValue >= parseNumber(m[1])) && (m[2] == null || m[2] == '' || numValue <= parseNumber(m[2]));
            }
        });
        return result;
    }],
    ['validate-alpha', 'Please use letters only (a-z or A-Z) in this field.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[a-zA-Z]+$/.test(v)
    }],
    ['validate-code', 'Please use only letters (a-z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[a-z]+[a-z0-9_]+$/.test(v)
    }],
    ['validate-alphanum', 'Please use only letters (a-z or A-Z) or numbers (0-9) only in this field. No spaces or other characters are allowed.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9]+$/.test(v)
    }],
    ['validate-alphanum-with-spaces', 'Please use only letters (a-z or A-Z), numbers (0-9) or spaces only in this field.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[a-zA-Z0-9 ]+$/.test(v)
    }],
    ['validate-street', 'Please use only letters (a-z or A-Z) or numbers (0-9) or spaces and # only in this field.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[ \w]{3,}([A-Za-z]\.)?([ \w]*\#\d+)?(\r\n| )[ \w]{3,}/.test(v)
    }],
    ['validate-phoneStrict', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
    }],
    ['validate-phoneLax', 'Please enter a valid phone number. For example (123) 456-7890 or 123-456-7890.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^((\d[-. ]?)?((\(\d{3}\))|\d{3}))?[-. ]?\d{3}[-. ]?\d{4}$/.test(v);
    }],
    ['validate-fax', 'Please enter a valid fax number. For example (123) 456-7890 or 123-456-7890.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(v);
    }],
    ['validate-date', 'Please enter a valid date.', function(v) {
        var test = new Date(v);
        return Validation.get('IsEmpty').test(v) || !isNaN(test);
    }],
    ['validate-date-range', 'The From Date value should be less than or equal to the To Date value.', function(v, elm) {
        var m = /\bdate-range-(\w+)-(\w+)\b/.exec(elm.className);
        if (!m || m[2] == 'to' || Validation.get('IsEmpty').test(v)) {
            return true;
        }
        var currentYear = new Date().getFullYear() + '';
        var normalizedTime = function(v) {
            v = v.split(/[.\/]/);
            if (v[2] && v[2].length < 4) {
                v[2] = currentYear.substr(0, v[2].length) + v[2];
            }
            return new Date(v.join('/')).getTime();
        };
        var dependentElements = Element.select(elm.form, '.validate-date-range.date-range-' + m[1] + '-to');
        return !dependentElements.length || Validation.get('IsEmpty').test(dependentElements[0].value) || normalizedTime(v) <= normalizedTime(dependentElements[0].value);
    }],
    ['validate-email', 'Please enter a valid email address. For example johndoe@domain.com.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i.test(v)
    }],
    ['validate-emailSender', 'Please use only visible characters and spaces.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[\S ]+$/.test(v)
    }],
    ['validate-password', 'Please enter 6 or more characters without leading or trailing spaces.', function(v) {
        var pass = v.strip();
        return (!(v.length > 0 && v.length < 6) && v.length == pass.length);
    }],
    ['validate-admin-password', 'Please enter 7 or more characters. Password should contain both numeric and alphabetic characters.', function(v) {
        var pass = v.strip();
        if (0 == pass.length) {
            return true;
        }
        if (!(/[a-z]/i.test(v)) || !(/[0-9]/.test(v))) {
            return false;
        }
        return !(pass.length < 7);
    }],
    ['validate-cpassword', 'Please make sure your passwords match.', function(v) {
        var conf = $('confirmation') ? $('confirmation') : $$('.validate-cpassword')[0];
        var pass = false;
        if ($('password')) {
            pass = $('password');
        }
        var passwordElements = $$('.validate-password');
        for (var i = 0; i < passwordElements.size(); i++) {
            var passwordElement = passwordElements[i];
            if (passwordElement.up('form').id == conf.up('form').id) {
                pass = passwordElement;
            }
        }
        if ($$('.validate-admin-password').size()) {
            pass = $$('.validate-admin-password')[0];
        }
        return (pass.value == conf.value);
    }],
    ['validate-both-passwords', 'Please make sure your passwords match.', function(v, input) {
        var dependentInput = $(input.form[input.name == 'password' ? 'confirmation' : 'password']),
            isEqualValues = input.value == dependentInput.value;
        if (isEqualValues && dependentInput.hasClassName('validation-failed')) {
            Validation.test(this.className, dependentInput);
        }
        return dependentInput.value == '' || isEqualValues;
    }],
    ['validate-url', 'Please enter a valid URL. Protocol is required (http://, https:// or ftp://)', function(v) {
        v = (v || '').replace(/^\s+/, '').replace(/\s+$/, '');
        return Validation.get('IsEmpty').test(v) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(v)
    }],
    ['validate-clean-url', 'Please enter a valid URL. For example http://www.example.com or www.example.com', function(v) {
        return Validation.get('IsEmpty').test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v) || /^(www)((\.[A-Z0-9][A-Z0-9_-]*)+.(com|org|net|dk|at|us|tv|info|uk|co.uk|biz|se)$)(:(\d+))?\/?/i.test(v)
    }],
    ['validate-identifier', 'Please enter a valid URL Key. For example "example-page", "example-page.html" or "anotherlevel/example-page".', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[a-z0-9][a-z0-9_\/-]+(\.[a-z0-9_-]+)?$/.test(v)
    }],
    ['validate-xml-identifier', 'Please enter a valid XML-identifier. For example something_1, block5, id-4.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^[A-Z][A-Z0-9_\/-]*$/i.test(v)
    }],
    ['validate-ssn', 'Please enter a valid social security number. For example 123-45-6789.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^\d{3}-?\d{2}-?\d{4}$/.test(v);
    }],
    ['validate-zip', 'Please enter a valid zip code. For example 90602 or 90602-1234.', function(v) {
        return Validation.get('IsEmpty').test(v) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(v);
    }],
    ['validate-zip-international', 'Please enter a valid zip code.', function(v) {
        return true;
    }],
    ['validate-date-au', 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.', function(v) {
        if (Validation.get('IsEmpty').test(v)) return true;
        var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(v)) return false;
        var d = new Date(v.replace(regex, '$2/$1/$3'));
        return (parseInt(RegExp.$2, 10) == (1 + d.getMonth())) && (parseInt(RegExp.$1, 10) == d.getDate()) && (parseInt(RegExp.$3, 10) == d.getFullYear());
    }],
    ['validate-currency-dollar', 'Please enter a valid $ amount. For example $100.00.', function(v) {
        return Validation.get('IsEmpty').test(v) || /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v)
    }],
    ['validate-one-required', 'Please select one of the above options.', function(v, elm) {
        var p = elm.parentNode;
        var options = p.getElementsByTagName('INPUT');
        return $A(options).any(function(elm) {
            return $F(elm);
        });
    }],
    ['validate-one-required-by-name', 'Please select one of the options.', function(v, elm) {
        var inputs = $$('input[name="' + elm.name.replace(/([\\"])/g, '\\$1') + '"]');
        var error = 1;
        for (var i = 0; i < inputs.length; i++) {
            if ((inputs[i].type == 'checkbox' || inputs[i].type == 'radio') && inputs[i].checked == true) {
                error = 0;
            }
            if (Validation.isOnChange && (inputs[i].type == 'checkbox' || inputs[i].type == 'radio')) {
                Validation.reset(inputs[i]);
            }
        }
        if (error == 0) {
            return true;
        } else {
            return false;
        }
    }],
    ['validate-not-negative-number', 'Please enter a number 0 or greater in this field.', function(v) {
        if (Validation.get('IsEmpty').test(v)) {
            return true;
        }
        v = parseNumber(v);
        return !isNaN(v) && v >= 0;
    }],
    ['validate-zero-or-greater', 'Please enter a number 0 or greater in this field.', function(v) {
        return Validation.get('validate-not-negative-number').test(v);
    }],
    ['validate-greater-than-zero', 'Please enter a number greater than 0 in this field.', function(v) {
        if (Validation.get('IsEmpty').test(v)) {
            return true;
        }
        v = parseNumber(v);
        return !isNaN(v) && v > 0;
    }],
    ['validate-special-price', 'The Special Price is active only when lower than the Actual Price.', function(v) {
        var priceInput = $('price');
        var priceType = $('price_type');
        var priceValue = parseFloat(v);
        if (!priceInput || Validation.get('IsEmpty').test(v) || !Validation.get('validate-number').test(v)) {
            return true;
        }
        if (priceType) {
            return (priceType && priceValue <= 99.99);
        }
        return priceValue < parseFloat($F(priceInput));
    }],
    ['validate-state', 'Please select State/Province.', function(v) {
        return (v != 0 || v == '');
    }],
    ['validate-new-password', 'Please enter 6 or more characters without leading or trailing spaces.', function(v) {
        if (!Validation.get('validate-password').test(v)) return false;
        if (Validation.get('IsEmpty').test(v) && v != '') return false;
        return true;
    }],
    ['validate-cc-number', 'Please enter a valid credit card number.', function(v, elm) {
        var ccTypeContainer = $(elm.id.substr(0, elm.id.indexOf('_cc_number')) + '_cc_type');
        if (ccTypeContainer && typeof Validation.creditCartTypes.get(ccTypeContainer.value) != 'undefined' && Validation.creditCartTypes.get(ccTypeContainer.value)[2] == false) {
            if (!Validation.get('IsEmpty').test(v) && Validation.get('validate-digits').test(v)) {
                return true;
            } else {
                return false;
            }
        }
        return validateCreditCard(v);
    }],
    ['validate-cc-type', 'Credit card number does not match credit card type.', function(v, elm) {
        elm.value = removeDelimiters(elm.value);
        v = removeDelimiters(v);
        var ccTypeContainer = $(elm.id.substr(0, elm.id.indexOf('_cc_number')) + '_cc_type');
        if (!ccTypeContainer) {
            return true;
        }
        var ccType = ccTypeContainer.value;
        if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
            return false;
        }
        if (Validation.creditCartTypes.get(ccType)[0] == false) {
            return true;
        }
        var validationFailure = false;
        Validation.creditCartTypes.each(function(pair) {
            if (pair.key == ccType) {
                if (pair.value[0] && !v.match(pair.value[0])) {
                    validationFailure = true;
                }
                throw $break;
            }
        });
        if (validationFailure) {
            return false;
        }
        if (ccTypeContainer.hasClassName('validation-failed') && Validation.isOnChange) {
            Validation.validate(ccTypeContainer);
        }
        return true;
    }],
    ['validate-cc-type-select', 'Card type does not match credit card number.', function(v, elm) {
        var ccNumberContainer = $(elm.id.substr(0, elm.id.indexOf('_cc_type')) + '_cc_number');
        if (Validation.isOnChange && Validation.get('IsEmpty').test(ccNumberContainer.value)) {
            return true;
        }
        if (Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer)) {
            Validation.validate(ccNumberContainer);
        }
        return Validation.get('validate-cc-type').test(ccNumberContainer.value, ccNumberContainer);
    }],
    ['validate-cc-exp', 'Incorrect credit card expiration date.', function(v, elm) {
        var ccExpMonth = v;
        var ccExpYear = $(elm.id.substr(0, elm.id.indexOf('_expiration')) + '_expiration_yr').value;
        var currentTime = new Date();
        var currentMonth = currentTime.getMonth() + 1;
        var currentYear = currentTime.getFullYear();
        if (ccExpMonth < currentMonth && ccExpYear == currentYear) {
            return false;
        }
        return true;
    }],
    ['validate-cc-cvn', 'Please enter a valid credit card verification number.', function(v, elm) {
        var ccTypeContainer = $(elm.id.substr(0, elm.id.indexOf('_cc_cid')) + '_cc_type');
        if (!ccTypeContainer) {
            return true;
        }
        var ccType = ccTypeContainer.value;
        if (typeof Validation.creditCartTypes.get(ccType) == 'undefined') {
            return false;
        }
        var re = Validation.creditCartTypes.get(ccType)[1];
        if (v.match(re)) {
            return true;
        }
        return false;
    }],
    ['validate-ajax', '', function(v, elm) {
        return true;
    }],
    ['validate-data', 'Please use only letters (a-z or A-Z), numbers (0-9) or underscore(_) in this field, first character should be a letter.', function(v) {
        if (v != '' && v) {
            return /^[A-Za-z]+[A-Za-z0-9_]+$/.test(v);
        }
        return true;
    }],
    ['validate-css-length', 'Please input a valid CSS-length. For example 100px or 77pt or 20em or .5ex or 50%.', function(v) {
        if (v != '' && v) {
            return /^[0-9\.]+(px|pt|em|ex|%)?$/.test(v) && (!(/\..*\./.test(v))) && !(/\.$/.test(v));
        }
        return true;
    }],
    ['validate-length', 'Text length does not satisfy specified text range.', function(v, elm) {
        var reMax = new RegExp(/^maximum-length-[0-9]+$/);
        var reMin = new RegExp(/^minimum-length-[0-9]+$/);
        var result = true;
        $w(elm.className).each(function(name, index) {
            if (name.match(reMax) && result) {
                var length = name.split('-')[2];
                result = (v.length <= length);
            }
            if (name.match(reMin) && result && !Validation.get('IsEmpty').test(v)) {
                var length = name.split('-')[2];
                result = (v.length >= length);
            }
        });
        return result;
    }],
    ['validate-percents', 'Please enter a number lower than 100.', {
        max: 100
    }],
    ['required-file', 'Please select a file', function(v, elm) {
        var result = !Validation.get('IsEmpty').test(v);
        if (result === false) {
            ovId = elm.id + '_value';
            if ($(ovId)) {
                result = !Validation.get('IsEmpty').test($(ovId).value);
            }
        }
        return result;
    }],
    ['validate-cc-ukss', 'Please enter issue number or start date for switch/solo card type.', function(v, elm) {
        var endposition;
        if (elm.id.match(/(.)+_cc_issue$/)) {
            endposition = elm.id.indexOf('_cc_issue');
        } else if (elm.id.match(/(.)+_start_month$/)) {
            endposition = elm.id.indexOf('_start_month');
        } else {
            endposition = elm.id.indexOf('_start_year');
        }
        var prefix = elm.id.substr(0, endposition);
        var ccTypeContainer = $(prefix + '_cc_type');
        if (!ccTypeContainer) {
            return true;
        }
        var ccType = ccTypeContainer.value;
        if (['SS', 'SM', 'SO'].indexOf(ccType) == -1) {
            return true;
        }
        $(prefix + '_cc_issue').advaiceContainer = $(prefix + '_start_month').advaiceContainer = $(prefix + '_start_year').advaiceContainer = $(prefix + '_cc_type_ss_div').down('ul li.adv-container');
        var ccIssue = $(prefix + '_cc_issue').value;
        var ccSMonth = $(prefix + '_start_month').value;
        var ccSYear = $(prefix + '_start_year').value;
        var ccStartDatePresent = (ccSMonth && ccSYear) ? true : false;
        if (!ccStartDatePresent && !ccIssue) {
            return false;
        }
        return true;
    }]
]);

function removeDelimiters(v) {
    v = v.replace(/\s/g, '');
    v = v.replace(/\-/g, '');
    return v;
}

function parseNumber(v) {
    if (typeof v != 'string') {
        return parseFloat(v);
    }
    var isDot = v.indexOf('.');
    var isComa = v.indexOf(',');
    if (isDot != -1 && isComa != -1) {
        if (isComa > isDot) {
            v = v.replace('.', '').replace(',', '.');
        } else {
            v = v.replace(',', '');
        }
    } else if (isComa != -1) {
        v = v.replace(',', '.');
    }
    return parseFloat(v);
}
Validation.creditCartTypes = $H({
    'SO': [new RegExp('^(6334[5-9]([0-9]{11}|[0-9]{13,14}))|(6767([0-9]{12}|[0-9]{14,15}))$'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
    'VI': [new RegExp('^4[0-9]{12}([0-9]{3})?$'), new RegExp('^[0-9]{3}$'), true],
    'MC': [new RegExp('^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$'), new RegExp('^[0-9]{3}$'), true],
    'AE': [new RegExp('^3[47][0-9]{13}$'), new RegExp('^[0-9]{4}$'), true],
    'DI': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3}$'), true],
    'JCB': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3,4}$'), true],
    'DICL': [new RegExp('^(30[0-5][0-9]{13}|3095[0-9]{12}|35(2[8-9][0-9]{12}|[3-8][0-9]{13})|36[0-9]{12}|3[8-9][0-9]{14}|6011(0[0-9]{11}|[2-4][0-9]{11}|74[0-9]{10}|7[7-9][0-9]{10}|8[6-9][0-9]{10}|9[0-9]{11})|62(2(12[6-9][0-9]{10}|1[3-9][0-9]{11}|[2-8][0-9]{12}|9[0-1][0-9]{11}|92[0-5][0-9]{10})|[4-6][0-9]{13}|8[2-8][0-9]{12})|6(4[4-9][0-9]{13}|5[0-9]{14}))$'), new RegExp('^[0-9]{3}$'), true],
    'SM': [new RegExp('(^(5[0678])[0-9]{11,18}$)|(^(6[^05])[0-9]{11,18}$)|(^(601)[^1][0-9]{9,16}$)|(^(6011)[0-9]{9,11}$)|(^(6011)[0-9]{13,16}$)|(^(65)[0-9]{11,13}$)|(^(65)[0-9]{15,18}$)|(^(49030)[2-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49033)[5-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49110)[1-2]([0-9]{10}$|[0-9]{12,13}$))|(^(49117)[4-9]([0-9]{10}$|[0-9]{12,13}$))|(^(49118)[0-2]([0-9]{10}$|[0-9]{12,13}$))|(^(4936)([0-9]{12}$|[0-9]{14,15}$))'), new RegExp('^([0-9]{3}|[0-9]{4})?$'), true],
    'OT': [false, new RegExp('^([0-9]{3}|[0-9]{4})?$'), false]
});
var Builder = {
    NODEMAP: {
        AREA: 'map',
        CAPTION: 'table',
        COL: 'table',
        COLGROUP: 'table',
        LEGEND: 'fieldset',
        OPTGROUP: 'select',
        OPTION: 'select',
        PARAM: 'object',
        TBODY: 'table',
        TD: 'table',
        TFOOT: 'table',
        TH: 'table',
        THEAD: 'table',
        TR: 'table'
    },
    node: function(elementName) {
        elementName = elementName.toUpperCase();
        var parentTag = this.NODEMAP[elementName] || 'div';
        var parentElement = document.createElement(parentTag);
        try {
            parentElement.innerHTML = "<" + elementName + "></" + elementName + ">";
        } catch (e) {}
        var element = parentElement.firstChild || null;
        if (element && (element.tagName.toUpperCase() != elementName))
            element = element.getElementsByTagName(elementName)[0];
        if (!element) element = document.createElement(elementName);
        if (!element) return;
        if (arguments[1])
            if (this._isStringOrNumber(arguments[1]) || (arguments[1] instanceof Array) || arguments[1].tagName) {
                this._children(element, arguments[1]);
            } else {
                var attrs = this._attributes(arguments[1]);
                if (attrs.length) {
                    try {
                        parentElement.innerHTML = "<" + elementName + " " +
                            attrs + "></" + elementName + ">";
                    } catch (e) {}
                    element = parentElement.firstChild || null;
                    if (!element) {
                        element = document.createElement(elementName);
                        for (attr in arguments[1])
                            element[attr == 'class' ? 'className' : attr] = arguments[1][attr];
                    }
                    if (element.tagName.toUpperCase() != elementName)
                        element = parentElement.getElementsByTagName(elementName)[0];
                }
            }
        if (arguments[2])
            this._children(element, arguments[2]);
        return $(element);
    },
    _text: function(text) {
        return document.createTextNode(text);
    },
    ATTR_MAP: {
        'className': 'class',
        'htmlFor': 'for'
    },
    _attributes: function(attributes) {
        var attrs = [];
        for (attribute in attributes)
            attrs.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) + '="' + attributes[attribute].toString().escapeHTML().gsub(/"/, '&quot;') + '"');
        return attrs.join(" ");
    },
    _children: function(element, children) {
        if (children.tagName) {
            element.appendChild(children);
            return;
        }
        if (typeof children == 'object') {
            children.flatten().each(function(e) {
                if (typeof e == 'object')
                    element.appendChild(e);
                else
                if (Builder._isStringOrNumber(e))
                    element.appendChild(Builder._text(e));
            });
        } else
        if (Builder._isStringOrNumber(children))
            element.appendChild(Builder._text(children));
    },
    _isStringOrNumber: function(param) {
        return (typeof param == 'string' || typeof param == 'number');
    },
    build: function(html) {
        var element = this.node('div');
        $(element).update(html.strip());
        return element.down();
    },
    dump: function(scope) {
        if (typeof scope != 'object' && typeof scope != 'function') scope = window;
        var tags = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " + "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " + "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX " + "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P " + "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD " + "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
        tags.each(function(tag) {
            scope[tag] = function() {
                return Builder.node.apply(Builder, [tag].concat($A(arguments)));
            };
        });
    }
};
String.prototype.parseColor = function() {
    var color = '#';
    if (this.slice(0, 4) == 'rgb(') {
        var cols = this.slice(4, this.length - 1).split(',');
        var i = 0;
        do {
            color += parseInt(cols[i]).toColorPart()
        } while (++i < 3);
    } else {
        if (this.slice(0, 1) == '#') {
            if (this.length == 4)
                for (var i = 1; i < 4; i++) color += (this.charAt(i) + this.charAt(i)).toLowerCase();
            if (this.length == 7) color = this.toLowerCase();
        }
    }
    return (color.length == 7 ? color : (arguments[0] || this));
};
Element.collectTextNodes = function(element) {
    return $A($(element).childNodes).collect(function(node) {
        return (node.nodeType == 3 ? node.nodeValue : (node.hasChildNodes() ? Element.collectTextNodes(node) : ''));
    }).flatten().join('');
};
Element.collectTextNodesIgnoreClass = function(element, className) {
    return $A($(element).childNodes).collect(function(node) {
        return (node.nodeType == 3 ? node.nodeValue : ((node.hasChildNodes() && !Element.hasClassName(node, className)) ? Element.collectTextNodesIgnoreClass(node, className) : ''));
    }).flatten().join('');
};
Element.setContentZoom = function(element, percent) {
    element = $(element);
    element.setStyle({
        fontSize: (percent / 100) + 'em'
    });
    if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
    return element;
};
Element.getInlineOpacity = function(element) {
    return $(element).style.opacity || '';
};
Element.forceRerendering = function(element) {
    try {
        element = $(element);
        var n = document.createTextNode(' ');
        element.appendChild(n);
        element.removeChild(n);
    } catch (e) {}
};
var Effect = {
    _elementDoesNotExistError: {
        name: 'ElementDoesNotExistError',
        message: 'The specified DOM element does not exist, but is required for this effect to operate'
    },
    Transitions: {
        linear: Prototype.K,
        sinoidal: function(pos) {
            return (-Math.cos(pos * Math.PI) / 2) + .5;
        },
        reverse: function(pos) {
            return 1 - pos;
        },
        flicker: function(pos) {
            var pos = ((-Math.cos(pos * Math.PI) / 4) + .75) + Math.random() / 4;
            return pos > 1 ? 1 : pos;
        },
        wobble: function(pos) {
            return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + .5;
        },
        pulse: function(pos, pulses) {
            return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
        },
        spring: function(pos) {
            return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
        },
        none: function(pos) {
            return 0;
        },
        full: function(pos) {
            return 1;
        }
    },
    DefaultOptions: {
        duration: 1.0,
        fps: 100,
        sync: false,
        from: 0.0,
        to: 1.0,
        delay: 0.0,
        queue: 'parallel'
    },
    tagifyText: function(element) {
        var tagifyStyle = 'position:relative';
        if (Prototype.Browser.IE) tagifyStyle += ';zoom:1';
        element = $(element);
        $A(element.childNodes).each(function(child) {
            if (child.nodeType == 3) {
                child.nodeValue.toArray().each(function(character) {
                    element.insertBefore(new Element('span', {
                        style: tagifyStyle
                    }).update(character == ' ' ? String.fromCharCode(160) : character), child);
                });
                Element.remove(child);
            }
        });
    },
    multiple: function(element, effect) {
        var elements;
        if (((typeof element == 'object') || Object.isFunction(element)) && (element.length))
            elements = element;
        else
            elements = $(element).childNodes;
        var options = Object.extend({
            speed: 0.1,
            delay: 0.0
        }, arguments[2] || {});
        var masterDelay = options.delay;
        $A(elements).each(function(element, index) {
            new effect(element, Object.extend(options, {
                delay: index * options.speed + masterDelay
            }));
        });
    },
    PAIRS: {
        'slide': ['SlideDown', 'SlideUp'],
        'blind': ['BlindDown', 'BlindUp'],
        'appear': ['Appear', 'Fade']
    },
    toggle: function(element, effect) {
        element = $(element);
        effect = (effect || 'appear').toLowerCase();
        var options = Object.extend({
            queue: {
                position: 'end',
                scope: (element.id || 'global'),
                limit: 1
            }
        }, arguments[2] || {});
        Effect[element.visible() ? Effect.PAIRS[effect][1] : Effect.PAIRS[effect][0]](element, options);
    }
};
Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;
Effect.ScopedQueue = Class.create(Enumerable, {
    initialize: function() {
        this.effects = [];
        this.interval = null;
    },
    _each: function(iterator) {
        this.effects._each(iterator);
    },
    add: function(effect) {
        var timestamp = new Date().getTime();
        var position = Object.isString(effect.options.queue) ? effect.options.queue : effect.options.queue.position;
        switch (position) {
            case 'front':
                this.effects.findAll(function(e) {
                    return e.state == 'idle'
                }).each(function(e) {
                    e.startOn += effect.finishOn;
                    e.finishOn += effect.finishOn;
                });
                break;
            case 'with-last':
                timestamp = this.effects.pluck('startOn').max() || timestamp;
                break;
            case 'end':
                timestamp = this.effects.pluck('finishOn').max() || timestamp;
                break;
        }
        effect.startOn += timestamp;
        effect.finishOn += timestamp;
        if (!effect.options.queue.limit || (this.effects.length < effect.options.queue.limit))
            this.effects.push(effect);
        if (!this.interval)
            this.interval = setInterval(this.loop.bind(this), 15);
    },
    remove: function(effect) {
        this.effects = this.effects.reject(function(e) {
            return e == effect
        });
        if (this.effects.length == 0) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    loop: function() {
        var timePos = new Date().getTime();
        for (var i = 0, len = this.effects.length; i < len; i++)
            this.effects[i] && this.effects[i].loop(timePos);
    }
});
Effect.Queues = {
    instances: $H(),
    get: function(queueName) {
        if (!Object.isString(queueName)) return queueName;
        return this.instances.get(queueName) || this.instances.set(queueName, new Effect.ScopedQueue());
    }
};
Effect.Queue = Effect.Queues.get('global');
Effect.Base = Class.create({
    position: null,
    start: function(options) {
        function codeForEvent(options, eventName) {
            return ((options[eventName + 'Internal'] ? 'this.options.' + eventName + 'Internal(this);' : '') +
                (options[eventName] ? 'this.options.' + eventName + '(this);' : ''));
        }
        if (options && options.transition === false) options.transition = Effect.Transitions.linear;
        this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), options || {});
        this.currentFrame = 0;
        this.state = 'idle';
        this.startOn = this.options.delay * 1000;
        this.finishOn = this.startOn + (this.options.duration * 1000);
        this.fromToDelta = this.options.to - this.options.from;
        this.totalTime = this.finishOn - this.startOn;
        this.totalFrames = this.options.fps * this.options.duration;
        this.render = (function() {
            function dispatch(effect, eventName) {
                if (effect.options[eventName + 'Internal'])
                    effect.options[eventName + 'Internal'](effect);
                if (effect.options[eventName])
                    effect.options[eventName](effect);
            }
            return function(pos) {
                if (this.state === "idle") {
                    this.state = "running";
                    dispatch(this, 'beforeSetup');
                    if (this.setup) this.setup();
                    dispatch(this, 'afterSetup');
                }
                if (this.state === "running") {
                    pos = (this.options.transition(pos) * this.fromToDelta) + this.options.from;
                    this.position = pos;
                    dispatch(this, 'beforeUpdate');
                    if (this.update) this.update(pos);
                    dispatch(this, 'afterUpdate');
                }
            };
        })();
        this.event('beforeStart');
        if (!this.options.sync)
            Effect.Queues.get(Object.isString(this.options.queue) ? 'global' : this.options.queue.scope).add(this);
    },
    loop: function(timePos) {
        if (timePos >= this.startOn) {
            if (timePos >= this.finishOn) {
                this.render(1.0);
                this.cancel();
                this.event('beforeFinish');
                if (this.finish) this.finish();
                this.event('afterFinish');
                return;
            }
            var pos = (timePos - this.startOn) / this.totalTime,
                frame = (pos * this.totalFrames).round();
            if (frame > this.currentFrame) {
                this.render(pos);
                this.currentFrame = frame;
            }
        }
    },
    cancel: function() {
        if (!this.options.sync)
            Effect.Queues.get(Object.isString(this.options.queue) ? 'global' : this.options.queue.scope).remove(this);
        this.state = 'finished';
    },
    event: function(eventName) {
        if (this.options[eventName + 'Internal']) this.options[eventName + 'Internal'](this);
        if (this.options[eventName]) this.options[eventName](this);
    },
    inspect: function() {
        var data = $H();
        for (property in this)
            if (!Object.isFunction(this[property])) data.set(property, this[property]);
        return '#<Effect:' + data.inspect() + ',options:' + $H(this.options).inspect() + '>';
    }
});
Effect.Parallel = Class.create(Effect.Base, {
    initialize: function(effects) {
        this.effects = effects || [];
        this.start(arguments[1]);
    },
    update: function(position) {
        this.effects.invoke('render', position);
    },
    finish: function(position) {
        this.effects.each(function(effect) {
            effect.render(1.0);
            effect.cancel();
            effect.event('beforeFinish');
            if (effect.finish) effect.finish(position);
            effect.event('afterFinish');
        });
    }
});
Effect.Tween = Class.create(Effect.Base, {
    initialize: function(object, from, to) {
        object = Object.isString(object) ? $(object) : object;
        var args = $A(arguments),
            method = args.last(),
            options = args.length == 5 ? args[3] : null;
        this.method = Object.isFunction(method) ? method.bind(object) : Object.isFunction(object[method]) ? object[method].bind(object) : function(value) {
            object[method] = value
        };
        this.start(Object.extend({
            from: from,
            to: to
        }, options || {}));
    },
    update: function(position) {
        this.method(position);
    }
});
Effect.Event = Class.create(Effect.Base, {
    initialize: function() {
        this.start(Object.extend({
            duration: 0
        }, arguments[0] || {}));
    },
    update: Prototype.emptyFunction
});
Effect.Opacity = Class.create(Effect.Base, {
    initialize: function(element) {
        this.element = $(element);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
            this.element.setStyle({
                zoom: 1
            });
        var options = Object.extend({
            from: this.element.getOpacity() || 0.0,
            to: 1.0
        }, arguments[1] || {});
        this.start(options);
    },
    update: function(position) {
        this.element.setOpacity(position);
    }
});
Effect.Move = Class.create(Effect.Base, {
    initialize: function(element) {
        this.element = $(element);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var options = Object.extend({
            x: 0,
            y: 0,
            mode: 'relative'
        }, arguments[1] || {});
        this.start(options);
    },
    setup: function() {
        this.element.makePositioned();
        this.originalLeft = parseFloat(this.element.getStyle('left') || '0');
        this.originalTop = parseFloat(this.element.getStyle('top') || '0');
        if (this.options.mode == 'absolute') {
            this.options.x = this.options.x - this.originalLeft;
            this.options.y = this.options.y - this.originalTop;
        }
    },
    update: function(position) {
        this.element.setStyle({
            left: (this.options.x * position + this.originalLeft).round() + 'px',
            top: (this.options.y * position + this.originalTop).round() + 'px'
        });
    }
});
Effect.MoveBy = function(element, toTop, toLeft) {
    return new Effect.Move(element, Object.extend({
        x: toLeft,
        y: toTop
    }, arguments[3] || {}));
};
Effect.Scale = Class.create(Effect.Base, {
    initialize: function(element, percent) {
        this.element = $(element);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var options = Object.extend({
            scaleX: true,
            scaleY: true,
            scaleContent: true,
            scaleFromCenter: false,
            scaleMode: 'box',
            scaleFrom: 100.0,
            scaleTo: percent
        }, arguments[2] || {});
        this.start(options);
    },
    setup: function() {
        this.restoreAfterFinish = this.options.restoreAfterFinish || false;
        this.elementPositioning = this.element.getStyle('position');
        this.originalStyle = {};
        ['top', 'left', 'width', 'height', 'fontSize'].each(function(k) {
            this.originalStyle[k] = this.element.style[k];
        }.bind(this));
        this.originalTop = this.element.offsetTop;
        this.originalLeft = this.element.offsetLeft;
        var fontSize = this.element.getStyle('font-size') || '100%';
        ['em', 'px', '%', 'pt'].each(function(fontSizeType) {
            if (fontSize.indexOf(fontSizeType) > 0) {
                this.fontSize = parseFloat(fontSize);
                this.fontSizeType = fontSizeType;
            }
        }.bind(this));
        this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100;
        this.dims = null;
        if (this.options.scaleMode == 'box')
            this.dims = [this.element.offsetHeight, this.element.offsetWidth];
        if (/^content/.test(this.options.scaleMode))
            this.dims = [this.element.scrollHeight, this.element.scrollWidth];
        if (!this.dims)
            this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth];
    },
    update: function(position) {
        var currentScale = (this.options.scaleFrom / 100.0) + (this.factor * position);
        if (this.options.scaleContent && this.fontSize)
            this.element.setStyle({
                fontSize: this.fontSize * currentScale + this.fontSizeType
            });
        this.setDimensions(this.dims[0] * currentScale, this.dims[1] * currentScale);
    },
    finish: function(position) {
        if (this.restoreAfterFinish) this.element.setStyle(this.originalStyle);
    },
    setDimensions: function(height, width) {
        var d = {};
        if (this.options.scaleX) d.width = width.round() + 'px';
        if (this.options.scaleY) d.height = height.round() + 'px';
        if (this.options.scaleFromCenter) {
            var topd = (height - this.dims[0]) / 2;
            var leftd = (width - this.dims[1]) / 2;
            if (this.elementPositioning == 'absolute') {
                if (this.options.scaleY) d.top = this.originalTop - topd + 'px';
                if (this.options.scaleX) d.left = this.originalLeft - leftd + 'px';
            } else {
                if (this.options.scaleY) d.top = -topd + 'px';
                if (this.options.scaleX) d.left = -leftd + 'px';
            }
        }
        this.element.setStyle(d);
    }
});
Effect.Highlight = Class.create(Effect.Base, {
    initialize: function(element) {
        this.element = $(element);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var options = Object.extend({
            startcolor: '#ffff99'
        }, arguments[1] || {});
        this.start(options);
    },
    setup: function() {
        if (this.element.getStyle('display') == 'none') {
            this.cancel();
            return;
        }
        this.oldStyle = {};
        if (!this.options.keepBackgroundImage) {
            this.oldStyle.backgroundImage = this.element.getStyle('background-image');
            this.element.setStyle({
                backgroundImage: 'none'
            });
        }
        if (!this.options.endcolor)
            this.options.endcolor = this.element.getStyle('background-color').parseColor('#ffffff');
        if (!this.options.restorecolor)
            this.options.restorecolor = this.element.getStyle('background-color');
        this._base = $R(0, 2).map(function(i) {
            return parseInt(this.options.startcolor.slice(i * 2 + 1, i * 2 + 3), 16)
        }.bind(this));
        this._delta = $R(0, 2).map(function(i) {
            return parseInt(this.options.endcolor.slice(i * 2 + 1, i * 2 + 3), 16) - this._base[i]
        }.bind(this));
    },
    update: function(position) {
        this.element.setStyle({
            backgroundColor: $R(0, 2).inject('#', function(m, v, i) {
                return m + ((this._base[i] + (this._delta[i] * position)).round().toColorPart());
            }.bind(this))
        });
    },
    finish: function() {
        this.element.setStyle(Object.extend(this.oldStyle, {
            backgroundColor: this.options.restorecolor
        }));
    }
});
Effect.ScrollTo = function(element) {
    var options = arguments[1] || {},
        scrollOffsets = document.viewport.getScrollOffsets(),
        elementOffsets = $(element).cumulativeOffset();
    if (options.offset) elementOffsets[1] += options.offset;
    return new Effect.Tween(null, scrollOffsets.top, elementOffsets[1], options, function(p) {
        scrollTo(scrollOffsets.left, p.round());
    });
};
Effect.Fade = function(element) {
    element = $(element);
    var oldOpacity = element.getInlineOpacity();
    var options = Object.extend({
        from: element.getOpacity() || 1.0,
        to: 0.0,
        afterFinishInternal: function(effect) {
            if (effect.options.to != 0) return;
            effect.element.hide().setStyle({
                opacity: oldOpacity
            });
        }
    }, arguments[1] || {});
    return new Effect.Opacity(element, options);
};
Effect.Appear = function(element) {
    element = $(element);
    var options = Object.extend({
        from: (element.getStyle('display') == 'none' ? 0.0 : element.getOpacity() || 0.0),
        to: 1.0,
        afterFinishInternal: function(effect) {
            effect.element.forceRerendering();
        },
        beforeSetup: function(effect) {
            effect.element.setOpacity(effect.options.from).show();
        }
    }, arguments[1] || {});
    return new Effect.Opacity(element, options);
};
Effect.Puff = function(element) {
    element = $(element);
    var oldStyle = {
        opacity: element.getInlineOpacity(),
        position: element.getStyle('position'),
        top: element.style.top,
        left: element.style.left,
        width: element.style.width,
        height: element.style.height
    };
    return new Effect.Parallel([new Effect.Scale(element, 200, {
        sync: true,
        scaleFromCenter: true,
        scaleContent: true,
        restoreAfterFinish: true
    }), new Effect.Opacity(element, {
        sync: true,
        to: 0.0
    })], Object.extend({
        duration: 1.0,
        beforeSetupInternal: function(effect) {
            Position.absolutize(effect.effects[0].element);
        },
        afterFinishInternal: function(effect) {
            effect.effects[0].element.hide().setStyle(oldStyle);
        }
    }, arguments[1] || {}));
};
Effect.BlindUp = function(element) {
    element = $(element);
    element.makeClipping();
    return new Effect.Scale(element, 0, Object.extend({
        scaleContent: false,
        scaleX: false,
        restoreAfterFinish: true,
        afterFinishInternal: function(effect) {
            effect.element.hide().undoClipping();
        }
    }, arguments[1] || {}));
};
Effect.BlindDown = function(element) {
    element = $(element);
    var elementDimensions = element.getDimensions();
    return new Effect.Scale(element, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: 0,
        scaleMode: {
            originalHeight: elementDimensions.height,
            originalWidth: elementDimensions.width
        },
        restoreAfterFinish: true,
        afterSetup: function(effect) {
            effect.element.makeClipping().setStyle({
                height: '0px'
            }).show();
        },
        afterFinishInternal: function(effect) {
            effect.element.undoClipping();
        }
    }, arguments[1] || {}));
};
Effect.SwitchOff = function(element) {
    element = $(element);
    var oldOpacity = element.getInlineOpacity();
    return new Effect.Appear(element, Object.extend({
        duration: 0.4,
        from: 0,
        transition: Effect.Transitions.flicker,
        afterFinishInternal: function(effect) {
            new Effect.Scale(effect.element, 1, {
                duration: 0.3,
                scaleFromCenter: true,
                scaleX: false,
                scaleContent: false,
                restoreAfterFinish: true,
                beforeSetup: function(effect) {
                    effect.element.makePositioned().makeClipping();
                },
                afterFinishInternal: function(effect) {
                    effect.element.hide().undoClipping().undoPositioned().setStyle({
                        opacity: oldOpacity
                    });
                }
            });
        }
    }, arguments[1] || {}));
};
Effect.DropOut = function(element) {
    element = $(element);
    var oldStyle = {
        top: element.getStyle('top'),
        left: element.getStyle('left'),
        opacity: element.getInlineOpacity()
    };
    return new Effect.Parallel([new Effect.Move(element, {
        x: 0,
        y: 100,
        sync: true
    }), new Effect.Opacity(element, {
        sync: true,
        to: 0.0
    })], Object.extend({
        duration: 0.5,
        beforeSetup: function(effect) {
            effect.effects[0].element.makePositioned();
        },
        afterFinishInternal: function(effect) {
            effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);
        }
    }, arguments[1] || {}));
};
Effect.Shake = function(element) {
    element = $(element);
    var options = Object.extend({
        distance: 20,
        duration: 0.5
    }, arguments[1] || {});
    var distance = parseFloat(options.distance);
    var split = parseFloat(options.duration) / 10.0;
    var oldStyle = {
        top: element.getStyle('top'),
        left: element.getStyle('left')
    };
    return new Effect.Move(element, {
        x: distance,
        y: 0,
        duration: split,
        afterFinishInternal: function(effect) {
            new Effect.Move(effect.element, {
                x: -distance * 2,
                y: 0,
                duration: split * 2,
                afterFinishInternal: function(effect) {
                    new Effect.Move(effect.element, {
                        x: distance * 2,
                        y: 0,
                        duration: split * 2,
                        afterFinishInternal: function(effect) {
                            new Effect.Move(effect.element, {
                                x: -distance * 2,
                                y: 0,
                                duration: split * 2,
                                afterFinishInternal: function(effect) {
                                    new Effect.Move(effect.element, {
                                        x: distance * 2,
                                        y: 0,
                                        duration: split * 2,
                                        afterFinishInternal: function(effect) {
                                            new Effect.Move(effect.element, {
                                                x: -distance,
                                                y: 0,
                                                duration: split,
                                                afterFinishInternal: function(effect) {
                                                    effect.element.undoPositioned().setStyle(oldStyle);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
Effect.SlideDown = function(element) {
    element = $(element).cleanWhitespace();
    var oldInnerBottom = element.down().getStyle('bottom');
    var elementDimensions = element.getDimensions();
    return new Effect.Scale(element, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: window.opera ? 0 : 1,
        scaleMode: {
            originalHeight: elementDimensions.height,
            originalWidth: elementDimensions.width
        },
        restoreAfterFinish: true,
        afterSetup: function(effect) {
            effect.element.makePositioned();
            effect.element.down().makePositioned();
            if (window.opera) effect.element.setStyle({
                top: ''
            });
            effect.element.makeClipping().setStyle({
                height: '0px'
            }).show();
        },
        afterUpdateInternal: function(effect) {
            effect.element.down().setStyle({
                bottom: (effect.dims[0] - effect.element.clientHeight) + 'px'
            });
        },
        afterFinishInternal: function(effect) {
            effect.element.undoClipping().undoPositioned();
            effect.element.down().undoPositioned().setStyle({
                bottom: oldInnerBottom
            });
        }
    }, arguments[1] || {}));
};
Effect.SlideUp = function(element) {
    element = $(element).cleanWhitespace();
    var oldInnerBottom = element.down().getStyle('bottom');
    var elementDimensions = element.getDimensions();
    return new Effect.Scale(element, window.opera ? 0 : 1, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleMode: 'box',
        scaleFrom: 100,
        scaleMode: {
            originalHeight: elementDimensions.height,
            originalWidth: elementDimensions.width
        },
        restoreAfterFinish: true,
        afterSetup: function(effect) {
            effect.element.makePositioned();
            effect.element.down().makePositioned();
            if (window.opera) effect.element.setStyle({
                top: ''
            });
            effect.element.makeClipping().show();
        },
        afterUpdateInternal: function(effect) {
            effect.element.down().setStyle({
                bottom: (effect.dims[0] - effect.element.clientHeight) + 'px'
            });
        },
        afterFinishInternal: function(effect) {
            effect.element.hide().undoClipping().undoPositioned();
            effect.element.down().undoPositioned().setStyle({
                bottom: oldInnerBottom
            });
        }
    }, arguments[1] || {}));
};
Effect.Squish = function(element) {
    return new Effect.Scale(element, window.opera ? 1 : 0, {
        restoreAfterFinish: true,
        beforeSetup: function(effect) {
            effect.element.makeClipping();
        },
        afterFinishInternal: function(effect) {
            effect.element.hide().undoClipping();
        }
    });
};
Effect.Grow = function(element) {
    element = $(element);
    var options = Object.extend({
        direction: 'center',
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.full
    }, arguments[1] || {});
    var oldStyle = {
        top: element.style.top,
        left: element.style.left,
        height: element.style.height,
        width: element.style.width,
        opacity: element.getInlineOpacity()
    };
    var dims = element.getDimensions();
    var initialMoveX, initialMoveY;
    var moveX, moveY;
    switch (options.direction) {
        case 'top-left':
            initialMoveX = initialMoveY = moveX = moveY = 0;
            break;
        case 'top-right':
            initialMoveX = dims.width;
            initialMoveY = moveY = 0;
            moveX = -dims.width;
            break;
        case 'bottom-left':
            initialMoveX = moveX = 0;
            initialMoveY = dims.height;
            moveY = -dims.height;
            break;
        case 'bottom-right':
            initialMoveX = dims.width;
            initialMoveY = dims.height;
            moveX = -dims.width;
            moveY = -dims.height;
            break;
        case 'center':
            initialMoveX = dims.width / 2;
            initialMoveY = dims.height / 2;
            moveX = -dims.width / 2;
            moveY = -dims.height / 2;
            break;
    }
    return new Effect.Move(element, {
        x: initialMoveX,
        y: initialMoveY,
        duration: 0.01,
        beforeSetup: function(effect) {
            effect.element.hide().makeClipping().makePositioned();
        },
        afterFinishInternal: function(effect) {
            new Effect.Parallel([new Effect.Opacity(effect.element, {
                sync: true,
                to: 1.0,
                from: 0.0,
                transition: options.opacityTransition
            }), new Effect.Move(effect.element, {
                x: moveX,
                y: moveY,
                sync: true,
                transition: options.moveTransition
            }), new Effect.Scale(effect.element, 100, {
                scaleMode: {
                    originalHeight: dims.height,
                    originalWidth: dims.width
                },
                sync: true,
                scaleFrom: window.opera ? 1 : 0,
                transition: options.scaleTransition,
                restoreAfterFinish: true
            })], Object.extend({
                beforeSetup: function(effect) {
                    effect.effects[0].element.setStyle({
                        height: '0px'
                    }).show();
                },
                afterFinishInternal: function(effect) {
                    effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle);
                }
            }, options));
        }
    });
};
Effect.Shrink = function(element) {
    element = $(element);
    var options = Object.extend({
        direction: 'center',
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.none
    }, arguments[1] || {});
    var oldStyle = {
        top: element.style.top,
        left: element.style.left,
        height: element.style.height,
        width: element.style.width,
        opacity: element.getInlineOpacity()
    };
    var dims = element.getDimensions();
    var moveX, moveY;
    switch (options.direction) {
        case 'top-left':
            moveX = moveY = 0;
            break;
        case 'top-right':
            moveX = dims.width;
            moveY = 0;
            break;
        case 'bottom-left':
            moveX = 0;
            moveY = dims.height;
            break;
        case 'bottom-right':
            moveX = dims.width;
            moveY = dims.height;
            break;
        case 'center':
            moveX = dims.width / 2;
            moveY = dims.height / 2;
            break;
    }
    return new Effect.Parallel([new Effect.Opacity(element, {
        sync: true,
        to: 0.0,
        from: 1.0,
        transition: options.opacityTransition
    }), new Effect.Scale(element, window.opera ? 1 : 0, {
        sync: true,
        transition: options.scaleTransition,
        restoreAfterFinish: true
    }), new Effect.Move(element, {
        x: moveX,
        y: moveY,
        sync: true,
        transition: options.moveTransition
    })], Object.extend({
        beforeStartInternal: function(effect) {
            effect.effects[0].element.makePositioned().makeClipping();
        },
        afterFinishInternal: function(effect) {
            effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle);
        }
    }, options));
};
Effect.Pulsate = function(element) {
    element = $(element);
    var options = arguments[1] || {},
        oldOpacity = element.getInlineOpacity(),
        transition = options.transition || Effect.Transitions.linear,
        reverser = function(pos) {
            return 1 - transition((-Math.cos((pos * (options.pulses || 5) * 2) * Math.PI) / 2) + .5);
        };
    return new Effect.Opacity(element, Object.extend(Object.extend({
        duration: 2.0,
        from: 0,
        afterFinishInternal: function(effect) {
            effect.element.setStyle({
                opacity: oldOpacity
            });
        }
    }, options), {
        transition: reverser
    }));
};
Effect.Fold = function(element) {
    element = $(element);
    var oldStyle = {
        top: element.style.top,
        left: element.style.left,
        width: element.style.width,
        height: element.style.height
    };
    element.makeClipping();
    return new Effect.Scale(element, 5, Object.extend({
        scaleContent: false,
        scaleX: false,
        afterFinishInternal: function(effect) {
            new Effect.Scale(element, 1, {
                scaleContent: false,
                scaleY: false,
                afterFinishInternal: function(effect) {
                    effect.element.hide().undoClipping().setStyle(oldStyle);
                }
            });
        }
    }, arguments[1] || {}));
};
Effect.Morph = Class.create(Effect.Base, {
    initialize: function(element) {
        this.element = $(element);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var options = Object.extend({
            style: {}
        }, arguments[1] || {});
        if (!Object.isString(options.style)) this.style = $H(options.style);
        else {
            if (options.style.include(':'))
                this.style = options.style.parseStyle();
            else {
                this.element.addClassName(options.style);
                this.style = $H(this.element.getStyles());
                this.element.removeClassName(options.style);
                var css = this.element.getStyles();
                this.style = this.style.reject(function(style) {
                    return style.value == css[style.key];
                });
                options.afterFinishInternal = function(effect) {
                    effect.element.addClassName(effect.options.style);
                    effect.transforms.each(function(transform) {
                        effect.element.style[transform.style] = '';
                    });
                };
            }
        }
        this.start(options);
    },
    setup: function() {
        function parseColor(color) {
            if (!color || ['rgba(0, 0, 0, 0)', 'transparent'].include(color)) color = '#ffffff';
            color = color.parseColor();
            return $R(0, 2).map(function(i) {
                return parseInt(color.slice(i * 2 + 1, i * 2 + 3), 16);
            });
        }
        this.transforms = this.style.map(function(pair) {
            var property = pair[0],
                value = pair[1],
                unit = null;
            if (value.parseColor('#zzzzzz') != '#zzzzzz') {
                value = value.parseColor();
                unit = 'color';
            } else if (property == 'opacity') {
                value = parseFloat(value);
                if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout))
                    this.element.setStyle({
                        zoom: 1
                    });
            } else if (Element.CSS_LENGTH.test(value)) {
                var components = value.match(/^([\+\-]?[0-9\.]+)(.*)$/);
                value = parseFloat(components[1]);
                unit = (components.length == 3) ? components[2] : null;
            }
            var originalValue = this.element.getStyle(property);
            return {
                style: property.camelize(),
                originalValue: unit == 'color' ? parseColor(originalValue) : parseFloat(originalValue || 0),
                targetValue: unit == 'color' ? parseColor(value) : value,
                unit: unit
            };
        }.bind(this)).reject(function(transform) {
            return ((transform.originalValue == transform.targetValue) || (transform.unit != 'color' && (isNaN(transform.originalValue) || isNaN(transform.targetValue))));
        });
    },
    update: function(position) {
        var style = {},
            transform, i = this.transforms.length;
        while (i--)
            style[(transform = this.transforms[i]).style] = transform.unit == 'color' ? '#' +
            (Math.round(transform.originalValue[0] +
                (transform.targetValue[0] - transform.originalValue[0]) * position)).toColorPart() +
            (Math.round(transform.originalValue[1] +
                (transform.targetValue[1] - transform.originalValue[1]) * position)).toColorPart() +
            (Math.round(transform.originalValue[2] +
                (transform.targetValue[2] - transform.originalValue[2]) * position)).toColorPart() : (transform.originalValue +
                (transform.targetValue - transform.originalValue) * position).toFixed(3) +
            (transform.unit === null ? '' : transform.unit);
        this.element.setStyle(style, true);
    }
});
Effect.Transform = Class.create({
    initialize: function(tracks) {
        this.tracks = [];
        this.options = arguments[1] || {};
        this.addTracks(tracks);
    },
    addTracks: function(tracks) {
        tracks.each(function(track) {
            track = $H(track);
            var data = track.values().first();
            this.tracks.push($H({
                ids: track.keys().first(),
                effect: Effect.Morph,
                options: {
                    style: data
                }
            }));
        }.bind(this));
        return this;
    },
    play: function() {
        return new Effect.Parallel(this.tracks.map(function(track) {
            var ids = track.get('ids'),
                effect = track.get('effect'),
                options = track.get('options');
            var elements = [$(ids) || $$(ids)].flatten();
            return elements.map(function(e) {
                return new effect(e, Object.extend({
                    sync: true
                }, options))
            });
        }).flatten(), this.options);
    }
});
Element.CSS_PROPERTIES = $w('backgroundColor backgroundPosition borderBottomColor borderBottomStyle ' + 'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth ' + 'borderRightColor borderRightStyle borderRightWidth borderSpacing ' + 'borderTopColor borderTopStyle borderTopWidth bottom clip color ' + 'fontSize fontWeight height left letterSpacing lineHeight ' + 'marginBottom marginLeft marginRight marginTop markerOffset maxHeight ' + 'maxWidth minHeight minWidth opacity outlineColor outlineOffset ' + 'outlineWidth paddingBottom paddingLeft paddingRight paddingTop ' + 'right textIndent top width wordSpacing zIndex');
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.__parseStyleElement = document.createElement('div');
String.prototype.parseStyle = function() {
    var style, styleRules = $H();
    if (Prototype.Browser.WebKit)
        style = new Element('div', {
            style: this
        }).style;
    else {
        String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
        style = String.__parseStyleElement.childNodes[0].style;
    }
    Element.CSS_PROPERTIES.each(function(property) {
        if (style[property]) styleRules.set(property, style[property]);
    });
    if (Prototype.Browser.IE && this.include('opacity'))
        styleRules.set('opacity', this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);
    return styleRules;
};
if (document.defaultView && document.defaultView.getComputedStyle) {
    Element.getStyles = function(element) {
        var css = document.defaultView.getComputedStyle($(element), null);
        return Element.CSS_PROPERTIES.inject({}, function(styles, property) {
            styles[property] = css[property];
            return styles;
        });
    };
} else {
    Element.getStyles = function(element) {
        element = $(element);
        var css = element.currentStyle,
            styles;
        styles = Element.CSS_PROPERTIES.inject({}, function(results, property) {
            results[property] = css[property];
            return results;
        });
        if (!styles.opacity) styles.opacity = element.getOpacity();
        return styles;
    };
}
Effect.Methods = {
    morph: function(element, style) {
        element = $(element);
        new Effect.Morph(element, Object.extend({
            style: style
        }, arguments[2] || {}));
        return element;
    },
    visualEffect: function(element, effect, options) {
        element = $(element);
        var s = effect.dasherize().camelize(),
            klass = s.charAt(0).toUpperCase() + s.substring(1);
        new Effect[klass](element, options);
        return element;
    },
    highlight: function(element, options) {
        element = $(element);
        new Effect.Highlight(element, options);
        return element;
    }
};
$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown ' + 'pulsate shake puff squish switchOff dropOut').each(function(effect) {
    Effect.Methods[effect] = function(element, options) {
        element = $(element);
        Effect[effect.charAt(0).toUpperCase() + effect.substring(1)](element, options);
        return element;
    };
});
$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(function(f) {
    Effect.Methods[f] = Element[f];
});
Element.addMethods(Effect.Methods);
if (Object.isUndefined(Effect))
    throw ("dragdrop.js requires including script.aculo.us' effects.js library");
var Droppables = {
    drops: [],
    remove: function(element) {
        this.drops = this.drops.reject(function(d) {
            return d.element == $(element)
        });
    },
    add: function(element) {
        element = $(element);
        var options = Object.extend({
            greedy: true,
            hoverclass: null,
            tree: false
        }, arguments[1] || {});
        if (options.containment) {
            options._containers = [];
            var containment = options.containment;
            if (Object.isArray(containment)) {
                containment.each(function(c) {
                    options._containers.push($(c))
                });
            } else {
                options._containers.push($(containment));
            }
        }
        if (options.accept) options.accept = [options.accept].flatten();
        Element.makePositioned(element);
        options.element = element;
        this.drops.push(options);
    },
    findDeepestChild: function(drops) {
        deepest = drops[0];
        for (i = 1; i < drops.length; ++i)
            if (Element.isParent(drops[i].element, deepest.element))
                deepest = drops[i];
        return deepest;
    },
    isContained: function(element, drop) {
        var containmentNode;
        if (drop.tree) {
            containmentNode = element.treeNode;
        } else {
            containmentNode = element.parentNode;
        }
        return drop._containers.detect(function(c) {
            return containmentNode == c
        });
    },
    isAffected: function(point, element, drop) {
        return ((drop.element != element) && ((!drop._containers) || this.isContained(element, drop)) && ((!drop.accept) || (Element.classNames(element).detect(function(v) {
            return drop.accept.include(v)
        }))) && Position.within(drop.element, point[0], point[1]));
    },
    deactivate: function(drop) {
        if (drop.hoverclass)
            Element.removeClassName(drop.element, drop.hoverclass);
        this.last_active = null;
    },
    activate: function(drop) {
        if (drop.hoverclass)
            Element.addClassName(drop.element, drop.hoverclass);
        this.last_active = drop;
    },
    show: function(point, element) {
        if (!this.drops.length) return;
        var drop, affected = [];
        this.drops.each(function(drop) {
            if (Droppables.isAffected(point, element, drop))
                affected.push(drop);
        });
        if (affected.length > 0)
            drop = Droppables.findDeepestChild(affected);
        if (this.last_active && this.last_active != drop) this.deactivate(this.last_active);
        if (drop) {
            Position.within(drop.element, point[0], point[1]);
            if (drop.onHover)
                drop.onHover(element, drop.element, Position.overlap(drop.overlap, drop.element));
            if (drop != this.last_active) Droppables.activate(drop);
        }
    },
    fire: function(event, element) {
        if (!this.last_active) return;
        Position.prepare();
        if (this.isAffected([Event.pointerX(event), Event.pointerY(event)], element, this.last_active))
            if (this.last_active.onDrop) {
                this.last_active.onDrop(element, this.last_active.element, event);
                return true;
            }
    },
    reset: function() {
        if (this.last_active)
            this.deactivate(this.last_active);
    }
};
var Draggables = {
    drags: [],
    observers: [],
    register: function(draggable) {
        if (this.drags.length == 0) {
            this.eventMouseUp = this.endDrag.bindAsEventListener(this);
            this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
            this.eventKeypress = this.keyPress.bindAsEventListener(this);
            Event.observe(document, "mouseup", this.eventMouseUp);
            Event.observe(document, "mousemove", this.eventMouseMove);
            Event.observe(document, "keypress", this.eventKeypress);
        }
        this.drags.push(draggable);
    },
    unregister: function(draggable) {
        this.drags = this.drags.reject(function(d) {
            return d == draggable
        });
        if (this.drags.length == 0) {
            Event.stopObserving(document, "mouseup", this.eventMouseUp);
            Event.stopObserving(document, "mousemove", this.eventMouseMove);
            Event.stopObserving(document, "keypress", this.eventKeypress);
        }
    },
    activate: function(draggable) {
        if (draggable.options.delay) {
            this._timeout = setTimeout(function() {
                Draggables._timeout = null;
                window.focus();
                Draggables.activeDraggable = draggable;
            }.bind(this), draggable.options.delay);
        } else {
            window.focus();
            this.activeDraggable = draggable;
        }
    },
    deactivate: function() {
        this.activeDraggable = null;
    },
    updateDrag: function(event) {
        if (!this.activeDraggable) return;
        var pointer = [Event.pointerX(event), Event.pointerY(event)];
        if (this._lastPointer && (this._lastPointer.inspect() == pointer.inspect())) return;
        this._lastPointer = pointer;
        this.activeDraggable.updateDrag(event, pointer);
    },
    endDrag: function(event) {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        if (!this.activeDraggable) return;
        this._lastPointer = null;
        this.activeDraggable.endDrag(event);
        this.activeDraggable = null;
    },
    keyPress: function(event) {
        if (this.activeDraggable)
            this.activeDraggable.keyPress(event);
    },
    addObserver: function(observer) {
        this.observers.push(observer);
        this._cacheObserverCallbacks();
    },
    removeObserver: function(element) {
        this.observers = this.observers.reject(function(o) {
            return o.element == element
        });
        this._cacheObserverCallbacks();
    },
    notify: function(eventName, draggable, event) {
        if (this[eventName + 'Count'] > 0)
            this.observers.each(function(o) {
                if (o[eventName]) o[eventName](eventName, draggable, event);
            });
        if (draggable.options[eventName]) draggable.options[eventName](draggable, event);
    },
    _cacheObserverCallbacks: function() {
        ['onStart', 'onEnd', 'onDrag'].each(function(eventName) {
            Draggables[eventName + 'Count'] = Draggables.observers.select(function(o) {
                return o[eventName];
            }).length;
        });
    }
};
var Draggable = Class.create({
    initialize: function(element) {
        var defaults = {
            handle: false,
            reverteffect: function(element, top_offset, left_offset) {
                var dur = Math.sqrt(Math.abs(top_offset ^ 2) + Math.abs(left_offset ^ 2)) * 0.02;
                new Effect.Move(element, {
                    x: -left_offset,
                    y: -top_offset,
                    duration: dur,
                    queue: {
                        scope: '_draggable',
                        position: 'end'
                    }
                });
            },
            endeffect: function(element) {
                var toOpacity = Object.isNumber(element._opacity) ? element._opacity : 1.0;
                new Effect.Opacity(element, {
                    duration: 0.2,
                    from: 0.7,
                    to: toOpacity,
                    queue: {
                        scope: '_draggable',
                        position: 'end'
                    },
                    afterFinish: function() {
                        Draggable._dragging[element] = false
                    }
                });
            },
            zindex: 1000,
            revert: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            snap: false,
            delay: 0
        };
        if (!arguments[1] || Object.isUndefined(arguments[1].endeffect))
            Object.extend(defaults, {
                starteffect: function(element) {
                    element._opacity = Element.getOpacity(element);
                    Draggable._dragging[element] = true;
                    new Effect.Opacity(element, {
                        duration: 0.2,
                        from: element._opacity,
                        to: 0.7
                    });
                }
            });
        var options = Object.extend(defaults, arguments[1] || {});
        this.element = $(element);
        if (options.handle && Object.isString(options.handle))
            this.handle = this.element.down('.' + options.handle, 0);
        if (!this.handle) this.handle = $(options.handle);
        if (!this.handle) this.handle = this.element;
        if (options.scroll && !options.scroll.scrollTo && !options.scroll.outerHTML) {
            options.scroll = $(options.scroll);
            this._isScrollChild = Element.childOf(this.element, options.scroll);
        }
        Element.makePositioned(this.element);
        this.options = options;
        this.dragging = false;
        this.eventMouseDown = this.initDrag.bindAsEventListener(this);
        Event.observe(this.handle, "mousedown", this.eventMouseDown);
        Draggables.register(this);
    },
    destroy: function() {
        Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
        Draggables.unregister(this);
    },
    currentDelta: function() {
        return ([parseInt(Element.getStyle(this.element, 'left') || '0'), parseInt(Element.getStyle(this.element, 'top') || '0')]);
    },
    initDrag: function(event) {
        if (!Object.isUndefined(Draggable._dragging[this.element]) && Draggable._dragging[this.element]) return;
        if (Event.isLeftClick(event)) {
            var src = Event.element(event);
            if ((tag_name = src.tagName.toUpperCase()) && (tag_name == 'INPUT' || tag_name == 'SELECT' || tag_name == 'OPTION' || tag_name == 'BUTTON' || tag_name == 'TEXTAREA')) return;
            var pointer = [Event.pointerX(event), Event.pointerY(event)];
            var pos = this.element.cumulativeOffset();
            this.offset = [0, 1].map(function(i) {
                return (pointer[i] - pos[i])
            });
            Draggables.activate(this);
            Event.stop(event);
        }
    },
    startDrag: function(event) {
        this.dragging = true;
        if (!this.delta)
            this.delta = this.currentDelta();
        if (this.options.zindex) {
            this.originalZ = parseInt(Element.getStyle(this.element, 'z-index') || 0);
            this.element.style.zIndex = this.options.zindex;
        }
        if (this.options.ghosting) {
            this._clone = this.element.cloneNode(true);
            this._originallyAbsolute = (this.element.getStyle('position') == 'absolute');
            if (!this._originallyAbsolute)
                Position.absolutize(this.element);
            this.element.parentNode.insertBefore(this._clone, this.element);
        }
        if (this.options.scroll) {
            if (this.options.scroll == window) {
                var where = this._getWindowScroll(this.options.scroll);
                this.originalScrollLeft = where.left;
                this.originalScrollTop = where.top;
            } else {
                this.originalScrollLeft = this.options.scroll.scrollLeft;
                this.originalScrollTop = this.options.scroll.scrollTop;
            }
        }
        Draggables.notify('onStart', this, event);
        if (this.options.starteffect) this.options.starteffect(this.element);
    },
    updateDrag: function(event, pointer) {
        if (!this.dragging) this.startDrag(event);
        if (!this.options.quiet) {
            Position.prepare();
            Droppables.show(pointer, this.element);
        }
        Draggables.notify('onDrag', this, event);
        this.draw(pointer);
        if (this.options.change) this.options.change(this);
        if (this.options.scroll) {
            this.stopScrolling();
            var p;
            if (this.options.scroll == window) {
                with(this._getWindowScroll(this.options.scroll)) {
                    p = [left, top, left + width, top + height];
                }
            } else {
                p = Position.page(this.options.scroll).toArray();
                p[0] += this.options.scroll.scrollLeft + Position.deltaX;
                p[1] += this.options.scroll.scrollTop + Position.deltaY;
                p.push(p[0] + this.options.scroll.offsetWidth);
                p.push(p[1] + this.options.scroll.offsetHeight);
            }
            var speed = [0, 0];
            if (pointer[0] < (p[0] + this.options.scrollSensitivity)) speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity);
            if (pointer[1] < (p[1] + this.options.scrollSensitivity)) speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity);
            if (pointer[0] > (p[2] - this.options.scrollSensitivity)) speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity);
            if (pointer[1] > (p[3] - this.options.scrollSensitivity)) speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity);
            this.startScrolling(speed);
        }
        if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
        Event.stop(event);
    },
    finishDrag: function(event, success) {
        this.dragging = false;
        if (this.options.quiet) {
            Position.prepare();
            var pointer = [Event.pointerX(event), Event.pointerY(event)];
            Droppables.show(pointer, this.element);
        }
        if (this.options.ghosting) {
            if (!this._originallyAbsolute)
                Position.relativize(this.element);
            delete this._originallyAbsolute;
            Element.remove(this._clone);
            this._clone = null;
        }
        var dropped = false;
        if (success) {
            dropped = Droppables.fire(event, this.element);
            if (!dropped) dropped = false;
        }
        if (dropped && this.options.onDropped) this.options.onDropped(this.element);
        Draggables.notify('onEnd', this, event);
        var revert = this.options.revert;
        if (revert && Object.isFunction(revert)) revert = revert(this.element);
        var d = this.currentDelta();
        if (revert && this.options.reverteffect) {
            if (dropped == 0 || revert != 'failure')
                this.options.reverteffect(this.element, d[1] - this.delta[1], d[0] - this.delta[0]);
        } else {
            this.delta = d;
        }
        if (this.options.zindex)
            this.element.style.zIndex = this.originalZ;
        if (this.options.endeffect)
            this.options.endeffect(this.element);
        Draggables.deactivate(this);
        Droppables.reset();
    },
    keyPress: function(event) {
        if (event.keyCode != Event.KEY_ESC) return;
        this.finishDrag(event, false);
        Event.stop(event);
    },
    endDrag: function(event) {
        if (!this.dragging) return;
        this.stopScrolling();
        this.finishDrag(event, true);
        Event.stop(event);
    },
    draw: function(point) {
        var pos = this.element.cumulativeOffset();
        if (this.options.ghosting) {
            var r = Position.realOffset(this.element);
            pos[0] += r[0] - Position.deltaX;
            pos[1] += r[1] - Position.deltaY;
        }
        var d = this.currentDelta();
        pos[0] -= d[0];
        pos[1] -= d[1];
        if (this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
            pos[0] -= this.options.scroll.scrollLeft - this.originalScrollLeft;
            pos[1] -= this.options.scroll.scrollTop - this.originalScrollTop;
        }
        var p = [0, 1].map(function(i) {
            return (point[i] - pos[i] - this.offset[i])
        }.bind(this));
        if (this.options.snap) {
            if (Object.isFunction(this.options.snap)) {
                p = this.options.snap(p[0], p[1], this);
            } else {
                if (Object.isArray(this.options.snap)) {
                    p = p.map(function(v, i) {
                        return (v / this.options.snap[i]).round() * this.options.snap[i]
                    }.bind(this));
                } else {
                    p = p.map(function(v) {
                        return (v / this.options.snap).round() * this.options.snap
                    }.bind(this));
                }
            }
        }
        var style = this.element.style;
        if ((!this.options.constraint) || (this.options.constraint == 'horizontal'))
            style.left = p[0] + "px";
        if ((!this.options.constraint) || (this.options.constraint == 'vertical'))
            style.top = p[1] + "px";
        if (style.visibility == "hidden") style.visibility = "";
    },
    stopScrolling: function() {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            Draggables._lastScrollPointer = null;
        }
    },
    startScrolling: function(speed) {
        if (!(speed[0] || speed[1])) return;
        this.scrollSpeed = [speed[0] * this.options.scrollSpeed, speed[1] * this.options.scrollSpeed];
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10);
    },
    scroll: function() {
        var current = new Date();
        var delta = current - this.lastScrolled;
        this.lastScrolled = current;
        if (this.options.scroll == window) {
            with(this._getWindowScroll(this.options.scroll)) {
                if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = delta / 1000;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1]);
                }
            }
        } else {
            this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1000;
            this.options.scroll.scrollTop += this.scrollSpeed[1] * delta / 1000;
        }
        Position.prepare();
        Droppables.show(Draggables._lastPointer, this.element);
        Draggables.notify('onDrag', this);
        if (this._isScrollChild) {
            Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
            Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1000;
            Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1000;
            if (Draggables._lastScrollPointer[0] < 0)
                Draggables._lastScrollPointer[0] = 0;
            if (Draggables._lastScrollPointer[1] < 0)
                Draggables._lastScrollPointer[1] = 0;
            this.draw(Draggables._lastScrollPointer);
        }
        if (this.options.change) this.options.change(this);
    },
    _getWindowScroll: function(w) {
        var T, L, W, H;
        with(w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft;
            } else if (w.document.body) {
                T = body.scrollTop;
                L = body.scrollLeft;
            }
            if (w.innerWidth) {
                W = w.innerWidth;
                H = w.innerHeight;
            } else if (w.document.documentElement && documentElement.clientWidth) {
                W = documentElement.clientWidth;
                H = documentElement.clientHeight;
            } else {
                W = body.offsetWidth;
                H = body.offsetHeight;
            }
        }
        return {
            top: T,
            left: L,
            width: W,
            height: H
        };
    }
});
Draggable._dragging = {};
var SortableObserver = Class.create({
    initialize: function(element, observer) {
        this.element = $(element);
        this.observer = observer;
        this.lastValue = Sortable.serialize(this.element);
    },
    onStart: function() {
        this.lastValue = Sortable.serialize(this.element);
    },
    onEnd: function() {
        Sortable.unmark();
        if (this.lastValue != Sortable.serialize(this.element))
            this.observer(this.element)
    }
});
var Sortable = {
    SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,
    sortables: {},
    _findRootElement: function(element) {
        while (element.tagName.toUpperCase() != "BODY") {
            if (element.id && Sortable.sortables[element.id]) return element;
            element = element.parentNode;
        }
    },
    options: function(element) {
        element = Sortable._findRootElement($(element));
        if (!element) return;
        return Sortable.sortables[element.id];
    },
    destroy: function(element) {
        element = $(element);
        var s = Sortable.sortables[element.id];
        if (s) {
            Draggables.removeObserver(s.element);
            s.droppables.each(function(d) {
                Droppables.remove(d)
            });
            s.draggables.invoke('destroy');
            delete Sortable.sortables[s.element.id];
        }
    },
    create: function(element) {
        element = $(element);
        var options = Object.extend({
            element: element,
            tag: 'li',
            dropOnEmpty: false,
            tree: false,
            treeTag: 'ul',
            overlap: 'vertical',
            constraint: 'vertical',
            containment: element,
            handle: false,
            only: false,
            delay: 0,
            hoverclass: null,
            ghosting: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            format: this.SERIALIZE_RULE,
            elements: false,
            handles: false,
            onChange: Prototype.emptyFunction,
            onUpdate: Prototype.emptyFunction
        }, arguments[1] || {});
        this.destroy(element);
        var options_for_draggable = {
            revert: true,
            quiet: options.quiet,
            scroll: options.scroll,
            scrollSpeed: options.scrollSpeed,
            scrollSensitivity: options.scrollSensitivity,
            delay: options.delay,
            ghosting: options.ghosting,
            constraint: options.constraint,
            handle: options.handle
        };
        if (options.starteffect)
            options_for_draggable.starteffect = options.starteffect;
        if (options.reverteffect)
            options_for_draggable.reverteffect = options.reverteffect;
        else
        if (options.ghosting) options_for_draggable.reverteffect = function(element) {
            element.style.top = 0;
            element.style.left = 0;
        };
        if (options.endeffect)
            options_for_draggable.endeffect = options.endeffect;
        if (options.zindex)
            options_for_draggable.zindex = options.zindex;
        var options_for_droppable = {
            overlap: options.overlap,
            containment: options.containment,
            tree: options.tree,
            hoverclass: options.hoverclass,
            onHover: Sortable.onHover
        };
        var options_for_tree = {
            onHover: Sortable.onEmptyHover,
            overlap: options.overlap,
            containment: options.containment,
            hoverclass: options.hoverclass
        };
        Element.cleanWhitespace(element);
        options.draggables = [];
        options.droppables = [];
        if (options.dropOnEmpty || options.tree) {
            Droppables.add(element, options_for_tree);
            options.droppables.push(element);
        }
        (options.elements || this.findElements(element, options) || []).each(function(e, i) {
            var handle = options.handles ? $(options.handles[i]) : (options.handle ? $(e).select('.' + options.handle)[0] : e);
            options.draggables.push(new Draggable(e, Object.extend(options_for_draggable, {
                handle: handle
            })));
            Droppables.add(e, options_for_droppable);
            if (options.tree) e.treeNode = element;
            options.droppables.push(e);
        });
        if (options.tree) {
            (Sortable.findTreeElements(element, options) || []).each(function(e) {
                Droppables.add(e, options_for_tree);
                e.treeNode = element;
                options.droppables.push(e);
            });
        }
        this.sortables[element.identify()] = options;
        Draggables.addObserver(new SortableObserver(element, options.onUpdate));
    },
    findElements: function(element, options) {
        return Element.findChildren(element, options.only, options.tree ? true : false, options.tag);
    },
    findTreeElements: function(element, options) {
        return Element.findChildren(element, options.only, options.tree ? true : false, options.treeTag);
    },
    onHover: function(element, dropon, overlap) {
        if (Element.isParent(dropon, element)) return;
        if (overlap > .33 && overlap < .66 && Sortable.options(dropon).tree) {
            return;
        } else if (overlap > 0.5) {
            Sortable.mark(dropon, 'before');
            if (dropon.previousSibling != element) {
                var oldParentNode = element.parentNode;
                element.style.visibility = "hidden";
                dropon.parentNode.insertBefore(element, dropon);
                if (dropon.parentNode != oldParentNode)
                    Sortable.options(oldParentNode).onChange(element);
                Sortable.options(dropon.parentNode).onChange(element);
            }
        } else {
            Sortable.mark(dropon, 'after');
            var nextElement = dropon.nextSibling || null;
            if (nextElement != element) {
                var oldParentNode = element.parentNode;
                element.style.visibility = "hidden";
                dropon.parentNode.insertBefore(element, nextElement);
                if (dropon.parentNode != oldParentNode)
                    Sortable.options(oldParentNode).onChange(element);
                Sortable.options(dropon.parentNode).onChange(element);
            }
        }
    },
    onEmptyHover: function(element, dropon, overlap) {
        var oldParentNode = element.parentNode;
        var droponOptions = Sortable.options(dropon);
        if (!Element.isParent(dropon, element)) {
            var index;
            var children = Sortable.findElements(dropon, {
                tag: droponOptions.tag,
                only: droponOptions.only
            });
            var child = null;
            if (children) {
                var offset = Element.offsetSize(dropon, droponOptions.overlap) * (1.0 - overlap);
                for (index = 0; index < children.length; index += 1) {
                    if (offset - Element.offsetSize(children[index], droponOptions.overlap) >= 0) {
                        offset -= Element.offsetSize(children[index], droponOptions.overlap);
                    } else if (offset - (Element.offsetSize(children[index], droponOptions.overlap) / 2) >= 0) {
                        child = index + 1 < children.length ? children[index + 1] : null;
                        break;
                    } else {
                        child = children[index];
                        break;
                    }
                }
            }
            dropon.insertBefore(element, child);
            Sortable.options(oldParentNode).onChange(element);
            droponOptions.onChange(element);
        }
    },
    unmark: function() {
        if (Sortable._marker) Sortable._marker.hide();
    },
    mark: function(dropon, position) {
        var sortable = Sortable.options(dropon.parentNode);
        if (sortable && !sortable.ghosting) return;
        if (!Sortable._marker) {
            Sortable._marker = ($('dropmarker') || Element.extend(document.createElement('DIV'))).hide().addClassName('dropmarker').setStyle({
                position: 'absolute'
            });
            document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);
        }
        var offsets = dropon.cumulativeOffset();
        Sortable._marker.setStyle({
            left: offsets[0] + 'px',
            top: offsets[1] + 'px'
        });
        if (position == 'after')
            if (sortable.overlap == 'horizontal')
                Sortable._marker.setStyle({
                    left: (offsets[0] + dropon.clientWidth) + 'px'
                });
            else
                Sortable._marker.setStyle({
                    top: (offsets[1] + dropon.clientHeight) + 'px'
                });
        Sortable._marker.show();
    },
    _tree: function(element, options, parent) {
        var children = Sortable.findElements(element, options) || [];
        for (var i = 0; i < children.length; ++i) {
            var match = children[i].id.match(options.format);
            if (!match) continue;
            var child = {
                id: encodeURIComponent(match ? match[1] : null),
                element: element,
                parent: parent,
                children: [],
                position: parent.children.length,
                container: $(children[i]).down(options.treeTag)
            };
            if (child.container)
                this._tree(child.container, options, child);
            parent.children.push(child);
        }
        return parent;
    },
    tree: function(element) {
        element = $(element);
        var sortableOptions = this.options(element);
        var options = Object.extend({
            tag: sortableOptions.tag,
            treeTag: sortableOptions.treeTag,
            only: sortableOptions.only,
            name: element.id,
            format: sortableOptions.format
        }, arguments[1] || {});
        var root = {
            id: null,
            parent: null,
            children: [],
            container: element,
            position: 0
        };
        return Sortable._tree(element, options, root);
    },
    _constructIndex: function(node) {
        var index = '';
        do {
            if (node.id) index = '[' + node.position + ']' + index;
        } while ((node = node.parent) != null);
        return index;
    },
    sequence: function(element) {
        element = $(element);
        var options = Object.extend(this.options(element), arguments[1] || {});
        return $(this.findElements(element, options) || []).map(function(item) {
            return item.id.match(options.format) ? item.id.match(options.format)[1] : '';
        });
    },
    setSequence: function(element, new_sequence) {
        element = $(element);
        var options = Object.extend(this.options(element), arguments[2] || {});
        var nodeMap = {};
        this.findElements(element, options).each(function(n) {
            if (n.id.match(options.format))
                nodeMap[n.id.match(options.format)[1]] = [n, n.parentNode];
            n.parentNode.removeChild(n);
        });
        new_sequence.each(function(ident) {
            var n = nodeMap[ident];
            if (n) {
                n[1].appendChild(n[0]);
                delete nodeMap[ident];
            }
        });
    },
    serialize: function(element) {
        element = $(element);
        var options = Object.extend(Sortable.options(element), arguments[1] || {});
        var name = encodeURIComponent((arguments[1] && arguments[1].name) ? arguments[1].name : element.id);
        if (options.tree) {
            return Sortable.tree(element, arguments[1]).children.map(function(item) {
                return [name + Sortable._constructIndex(item) + "[id]=" +
                    encodeURIComponent(item.id)
                ].concat(item.children.map(arguments.callee));
            }).flatten().join('&');
        } else {
            return Sortable.sequence(element, arguments[1]).map(function(item) {
                return name + "[]=" + encodeURIComponent(item);
            }).join('&');
        }
    }
};
Element.isParent = function(child, element) {
    if (!child.parentNode || child == element) return false;
    if (child.parentNode == element) return true;
    return Element.isParent(child.parentNode, element);
};
Element.findChildren = function(element, only, recursive, tagName) {
    if (!element.hasChildNodes()) return null;
    tagName = tagName.toUpperCase();
    if (only) only = [only].flatten();
    var elements = [];
    $A(element.childNodes).each(function(e) {
        if (e.tagName && e.tagName.toUpperCase() == tagName && (!only || (Element.classNames(e).detect(function(v) {
                return only.include(v)
            }))))
            elements.push(e);
        if (recursive) {
            var grandchildren = Element.findChildren(e, only, recursive, tagName);
            if (grandchildren) elements.push(grandchildren);
        }
    });
    return (elements.length > 0 ? elements.flatten() : []);
};
Element.offsetSize = function(element, type) {
    return element['offset' + ((type == 'vertical' || type == 'height') ? 'Height' : 'Width')];
};
if (typeof Effect == 'undefined')
    throw ("controls.js requires including script.aculo.us' effects.js library");
var Autocompleter = {};
Autocompleter.Base = Class.create({
    baseInitialize: function(element, update, options) {
        element = $(element);
        this.element = element;
        this.update = $(update);
        this.hasFocus = false;
        this.changed = false;
        this.active = false;
        this.index = 0;
        this.entryCount = 0;
        this.oldElementValue = this.element.value;
        if (this.setOptions)
            this.setOptions(options);
        else
            this.options = options || {};
        this.options.paramName = this.options.paramName || this.element.name;
        this.options.tokens = this.options.tokens || [];
        this.options.frequency = this.options.frequency || 0.4;
        this.options.minChars = this.options.minChars || 1;
        this.options.onShow = this.options.onShow || function(element, update) {
            if (!update.style.position || update.style.position == 'absolute') {
                update.style.position = 'absolute';
                Position.clone(element, update, {
                    setHeight: false,
                    offsetTop: element.offsetHeight
                });
            }
            Effect.Appear(update, {
                duration: 0.15
            });
        };
        this.options.onHide = this.options.onHide || function(element, update) {
            new Effect.Fade(update, {
                duration: 0.15
            })
        };
        if (typeof(this.options.tokens) == 'string')
            this.options.tokens = new Array(this.options.tokens);
        if (!this.options.tokens.include('\n'))
            this.options.tokens.push('\n');
        this.observer = null;
        this.element.setAttribute('autocomplete', 'off');
        Element.hide(this.update);
        Event.observe(this.element, 'blur', this.onBlur.bindAsEventListener(this));
        Event.observe(this.element, 'keydown', this.onKeyPress.bindAsEventListener(this));
    },
    show: function() {
        if (Element.getStyle(this.update, 'display') == 'none') this.options.onShow(this.element, this.update);
        if (!this.iefix && (Prototype.Browser.IE) && (Element.getStyle(this.update, 'position') == 'absolute')) {
            new Insertion.After(this.update, '<iframe id="' + this.update.id + '_iefix" ' + 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' + 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
            this.iefix = $(this.update.id + '_iefix');
        }
        if (this.iefix) setTimeout(this.fixIEOverlapping.bind(this), 50);
    },
    fixIEOverlapping: function() {
        Position.clone(this.update, this.iefix, {
            setTop: (!this.update.style.height)
        });
        this.iefix.style.zIndex = 1;
        this.update.style.zIndex = 2;
        Element.show(this.iefix);
    },
    hide: function() {
        this.stopIndicator();
        if (Element.getStyle(this.update, 'display') != 'none') this.options.onHide(this.element, this.update);
        if (this.iefix) Element.hide(this.iefix);
    },
    startIndicator: function() {
        if (this.options.indicator) Element.show(this.options.indicator);
    },
    stopIndicator: function() {
        if (this.options.indicator) Element.hide(this.options.indicator);
    },
    onKeyPress: function(event) {
        if (this.active)
            switch (event.keyCode) {
                case Event.KEY_TAB:
                case Event.KEY_RETURN:
                    this.selectEntry();
                    Event.stop(event);
                case Event.KEY_ESC:
                    this.hide();
                    this.active = false;
                    Event.stop(event);
                    return;
                case Event.KEY_LEFT:
                case Event.KEY_RIGHT:
                    return;
                case Event.KEY_UP:
                    this.markPrevious();
                    this.render();
                    Event.stop(event);
                    return;
                case Event.KEY_DOWN:
                    this.markNext();
                    this.render();
                    Event.stop(event);
                    return;
            }
        else
        if (event.keyCode == Event.KEY_TAB || event.keyCode == Event.KEY_RETURN || (Prototype.Browser.WebKit > 0 && event.keyCode == 0)) return;
        this.changed = true;
        this.hasFocus = true;
        if (this.observer) clearTimeout(this.observer);
        this.observer = setTimeout(this.onObserverEvent.bind(this), this.options.frequency * 1000);
    },
    activate: function() {
        this.changed = false;
        this.hasFocus = true;
        this.getUpdatedChoices();
    },
    onHover: function(event) {
        var element = Event.findElement(event, 'LI');
        if (this.index != element.autocompleteIndex) {
            this.index = element.autocompleteIndex;
            this.render();
        }
        Event.stop(event);
    },
    onClick: function(event) {
        var element = Event.findElement(event, 'LI');
        this.index = element.autocompleteIndex;
        this.selectEntry();
        this.hide();
    },
    onBlur: function(event) {
        setTimeout(this.hide.bind(this), 250);
        this.hasFocus = false;
        this.active = false;
    },
    render: function() {
        if (this.entryCount > 0) {
            for (var i = 0; i < this.entryCount; i++)
                this.index == i ? Element.addClassName(this.getEntry(i), "selected") : Element.removeClassName(this.getEntry(i), "selected");
            if (this.hasFocus) {
                this.show();
                this.active = true;
            }
        } else {
            this.active = false;
            this.hide();
        }
    },
    markPrevious: function() {
        if (this.index > 0) this.index--;
        else this.index = this.entryCount - 1;
    },
    markNext: function() {
        if (this.index < this.entryCount - 1) this.index++;
        else this.index = 0;
        this.getEntry(this.index).scrollIntoView(false);
    },
    getEntry: function(index) {
        return this.update.firstChild.childNodes[index];
    },
    getCurrentEntry: function() {
        return this.getEntry(this.index);
    },
    selectEntry: function() {
        this.active = false;
        this.updateElement(this.getCurrentEntry());
    },
    updateElement: function(selectedElement) {
        if (this.options.updateElement) {
            this.options.updateElement(selectedElement);
            return;
        }
        var value = '';
        if (this.options.select) {
            var nodes = $(selectedElement).select('.' + this.options.select) || [];
            if (nodes.length > 0) value = Element.collectTextNodes(nodes[0], this.options.select);
        } else
            value = Element.collectTextNodesIgnoreClass(selectedElement, 'informal');
        var bounds = this.getTokenBounds();
        if (bounds[0] != -1) {
            var newValue = this.element.value.substr(0, bounds[0]);
            var whitespace = this.element.value.substr(bounds[0]).match(/^\s+/);
            if (whitespace)
                newValue += whitespace[0];
            this.element.value = newValue + value + this.element.value.substr(bounds[1]);
        } else {
            this.element.value = value;
        }
        this.oldElementValue = this.element.value;
        this.element.focus();
        if (this.options.afterUpdateElement)
            this.options.afterUpdateElement(this.element, selectedElement);
    },
    updateChoices: function(choices) {
        if (!this.changed && this.hasFocus) {
            this.update.innerHTML = choices;
            Element.cleanWhitespace(this.update);
            Element.cleanWhitespace(this.update.down());
            if (this.update.firstChild && this.update.down().childNodes) {
                this.entryCount = this.update.down().childNodes.length;
                for (var i = 0; i < this.entryCount; i++) {
                    var entry = this.getEntry(i);
                    entry.autocompleteIndex = i;
                    this.addObservers(entry);
                }
            } else {
                this.entryCount = 0;
            }
            this.stopIndicator();
            this.index = 0;
            if (this.entryCount == 1 && this.options.autoSelect) {
                this.selectEntry();
                this.hide();
            } else {
                this.render();
            }
        }
    },
    addObservers: function(element) {
        Event.observe(element, "mouseover", this.onHover.bindAsEventListener(this));
        Event.observe(element, "click", this.onClick.bindAsEventListener(this));
    },
    onObserverEvent: function() {
        this.changed = false;
        this.tokenBounds = null;
        if (this.getToken().length >= this.options.minChars) {
            this.getUpdatedChoices();
        } else {
            this.active = false;
            this.hide();
        }
        this.oldElementValue = this.element.value;
    },
    getToken: function() {
        var bounds = this.getTokenBounds();
        return this.element.value.substring(bounds[0], bounds[1]).strip();
    },
    getTokenBounds: function() {
        if (null != this.tokenBounds) return this.tokenBounds;
        var value = this.element.value;
        if (value.strip().empty()) return [-1, 0];
        var diff = arguments.callee.getFirstDifferencePos(value, this.oldElementValue);
        var offset = (diff == this.oldElementValue.length ? 1 : 0);
        var prevTokenPos = -1,
            nextTokenPos = value.length;
        var tp;
        for (var index = 0, l = this.options.tokens.length; index < l; ++index) {
            tp = value.lastIndexOf(this.options.tokens[index], diff + offset - 1);
            if (tp > prevTokenPos) prevTokenPos = tp;
            tp = value.indexOf(this.options.tokens[index], diff + offset);
            if (-1 != tp && tp < nextTokenPos) nextTokenPos = tp;
        }
        return (this.tokenBounds = [prevTokenPos + 1, nextTokenPos]);
    }
});
Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function(newS, oldS) {
    var boundary = Math.min(newS.length, oldS.length);
    for (var index = 0; index < boundary; ++index)
        if (newS[index] != oldS[index])
            return index;
    return boundary;
};
Ajax.Autocompleter = Class.create(Autocompleter.Base, {
    initialize: function(element, update, url, options) {
        this.baseInitialize(element, update, options);
        this.options.asynchronous = true;
        this.options.onComplete = this.onComplete.bind(this);
        this.options.defaultParams = this.options.parameters || null;
        this.url = url;
    },
    getUpdatedChoices: function() {
        this.startIndicator();
        var entry = encodeURIComponent(this.options.paramName) + '=' +
            encodeURIComponent(this.getToken());
        this.options.parameters = this.options.callback ? this.options.callback(this.element, entry) : entry;
        if (this.options.defaultParams)
            this.options.parameters += '&' + this.options.defaultParams;
        new Ajax.Request(this.url, this.options);
    },
    onComplete: function(request) {
        this.updateChoices(request.responseText);
    }
});
Autocompleter.Local = Class.create(Autocompleter.Base, {
    initialize: function(element, update, array, options) {
        this.baseInitialize(element, update, options);
        this.options.array = array;
    },
    getUpdatedChoices: function() {
        this.updateChoices(this.options.selector(this));
    },
    setOptions: function(options) {
        this.options = Object.extend({
            choices: 10,
            partialSearch: true,
            partialChars: 2,
            ignoreCase: true,
            fullSearch: false,
            selector: function(instance) {
                var ret = [];
                var partial = [];
                var entry = instance.getToken();
                var count = 0;
                for (var i = 0; i < instance.options.array.length && ret.length < instance.options.choices; i++) {
                    var elem = instance.options.array[i];
                    var foundPos = instance.options.ignoreCase ? elem.toLowerCase().indexOf(entry.toLowerCase()) : elem.indexOf(entry);
                    while (foundPos != -1) {
                        if (foundPos == 0 && elem.length != entry.length) {
                            ret.push("<li><strong>" + elem.substr(0, entry.length) + "</strong>" +
                                elem.substr(entry.length) + "</li>");
                            break;
                        } else if (entry.length >= instance.options.partialChars && instance.options.partialSearch && foundPos != -1) {
                            if (instance.options.fullSearch || /\s/.test(elem.substr(foundPos - 1, 1))) {
                                partial.push("<li>" + elem.substr(0, foundPos) + "<strong>" +
                                    elem.substr(foundPos, entry.length) + "</strong>" + elem.substr(foundPos + entry.length) + "</li>");
                                break;
                            }
                        }
                        foundPos = instance.options.ignoreCase ? elem.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) : elem.indexOf(entry, foundPos + 1);
                    }
                }
                if (partial.length)
                    ret = ret.concat(partial.slice(0, instance.options.choices - ret.length));
                return "<ul>" + ret.join('') + "</ul>";
            }
        }, options || {});
    }
});
Field.scrollFreeActivate = function(field) {
    setTimeout(function() {
        Field.activate(field);
    }, 1);
};
Ajax.InPlaceEditor = Class.create({
    initialize: function(element, url, options) {
        this.url = url;
        this.element = element = $(element);
        this.prepareOptions();
        this._controls = {};
        arguments.callee.dealWithDeprecatedOptions(options);
        Object.extend(this.options, options || {});
        if (!this.options.formId && this.element.id) {
            this.options.formId = this.element.id + '-inplaceeditor';
            if ($(this.options.formId))
                this.options.formId = '';
        }
        if (this.options.externalControl)
            this.options.externalControl = $(this.options.externalControl);
        if (!this.options.externalControl)
            this.options.externalControlOnly = false;
        this._originalBackground = this.element.getStyle('background-color') || 'transparent';
        this.element.title = this.options.clickToEditText;
        this._boundCancelHandler = this.handleFormCancellation.bind(this);
        this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this);
        this._boundFailureHandler = this.handleAJAXFailure.bind(this);
        this._boundSubmitHandler = this.handleFormSubmission.bind(this);
        this._boundWrapperHandler = this.wrapUp.bind(this);
        this.registerListeners();
    },
    checkForEscapeOrReturn: function(e) {
        if (!this._editing || e.ctrlKey || e.altKey || e.shiftKey) return;
        if (Event.KEY_ESC == e.keyCode)
            this.handleFormCancellation(e);
        else if (Event.KEY_RETURN == e.keyCode)
            this.handleFormSubmission(e);
    },
    createControl: function(mode, handler, extraClasses) {
        var control = this.options[mode + 'Control'];
        var text = this.options[mode + 'Text'];
        if ('button' == control) {
            var btn = document.createElement('input');
            btn.type = 'submit';
            btn.value = text;
            btn.className = 'editor_' + mode + '_button';
            if ('cancel' == mode)
                btn.onclick = this._boundCancelHandler;
            this._form.appendChild(btn);
            this._controls[mode] = btn;
        } else if ('link' == control) {
            var link = document.createElement('a');
            link.href = '#';
            link.appendChild(document.createTextNode(text));
            link.onclick = 'cancel' == mode ? this._boundCancelHandler : this._boundSubmitHandler;
            link.className = 'editor_' + mode + '_link';
            if (extraClasses)
                link.className += ' ' + extraClasses;
            this._form.appendChild(link);
            this._controls[mode] = link;
        }
    },
    createEditField: function() {
        var text = (this.options.loadTextURL ? this.options.loadingText : this.getText());
        var fld;
        if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
            fld = document.createElement('input');
            fld.type = 'text';
            var size = this.options.size || this.options.cols || 0;
            if (0 < size) fld.size = size;
        } else {
            fld = document.createElement('textarea');
            fld.rows = (1 >= this.options.rows ? this.options.autoRows : this.options.rows);
            fld.cols = this.options.cols || 40;
        }
        fld.name = this.options.paramName;
        fld.value = text;
        fld.className = 'editor_field';
        if (this.options.submitOnBlur)
            fld.onblur = this._boundSubmitHandler;
        this._controls.editor = fld;
        if (this.options.loadTextURL)
            this.loadExternalText();
        this._form.appendChild(this._controls.editor);
    },
    createForm: function() {
        var ipe = this;

        function addText(mode, condition) {
            var text = ipe.options['text' + mode + 'Controls'];
            if (!text || condition === false) return;
            ipe._form.appendChild(document.createTextNode(text));
        };
        this._form = $(document.createElement('form'));
        this._form.id = this.options.formId;
        this._form.addClassName(this.options.formClassName);
        this._form.onsubmit = this._boundSubmitHandler;
        this.createEditField();
        if ('textarea' == this._controls.editor.tagName.toLowerCase())
            this._form.appendChild(document.createElement('br'));
        if (this.options.onFormCustomization)
            this.options.onFormCustomization(this, this._form);
        addText('Before', this.options.okControl || this.options.cancelControl);
        this.createControl('ok', this._boundSubmitHandler);
        addText('Between', this.options.okControl && this.options.cancelControl);
        this.createControl('cancel', this._boundCancelHandler, 'editor_cancel');
        addText('After', this.options.okControl || this.options.cancelControl);
    },
    destroy: function() {
        if (this._oldInnerHTML)
            this.element.innerHTML = this._oldInnerHTML;
        this.leaveEditMode();
        this.unregisterListeners();
    },
    enterEditMode: function(e) {
        if (this._saving || this._editing) return;
        this._editing = true;
        this.triggerCallback('onEnterEditMode');
        if (this.options.externalControl)
            this.options.externalControl.hide();
        this.element.hide();
        this.createForm();
        this.element.parentNode.insertBefore(this._form, this.element);
        if (!this.options.loadTextURL)
            this.postProcessEditField();
        if (e) Event.stop(e);
    },
    enterHover: function(e) {
        if (this.options.hoverClassName)
            this.element.addClassName(this.options.hoverClassName);
        if (this._saving) return;
        this.triggerCallback('onEnterHover');
    },
    getText: function() {
        return this.element.innerHTML.unescapeHTML();
    },
    handleAJAXFailure: function(transport) {
        this.triggerCallback('onFailure', transport);
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML;
            this._oldInnerHTML = null;
        }
    },
    handleFormCancellation: function(e) {
        this.wrapUp();
        if (e) Event.stop(e);
    },
    handleFormSubmission: function(e) {
        var form = this._form;
        var value = $F(this._controls.editor);
        this.prepareSubmission();
        var params = this.options.callback(form, value) || '';
        if (Object.isString(params))
            params = params.toQueryParams();
        params.editorId = this.element.id;
        if (this.options.htmlResponse) {
            var options = Object.extend({
                evalScripts: true
            }, this.options.ajaxOptions);
            Object.extend(options, {
                parameters: params,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Updater({
                success: this.element
            }, this.url, options);
        } else {
            var options = Object.extend({
                method: 'get'
            }, this.options.ajaxOptions);
            Object.extend(options, {
                parameters: params,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Request(this.url, options);
        }
        if (e) Event.stop(e);
    },
    leaveEditMode: function() {
        this.element.removeClassName(this.options.savingClassName);
        this.removeForm();
        this.leaveHover();
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show();
        if (this.options.externalControl)
            this.options.externalControl.show();
        this._saving = false;
        this._editing = false;
        this._oldInnerHTML = null;
        this.triggerCallback('onLeaveEditMode');
    },
    leaveHover: function(e) {
        if (this.options.hoverClassName)
            this.element.removeClassName(this.options.hoverClassName);
        if (this._saving) return;
        this.triggerCallback('onLeaveHover');
    },
    loadExternalText: function() {
        this._form.addClassName(this.options.loadingClassName);
        this._controls.editor.disabled = true;
        var options = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(options, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function(transport) {
                this._form.removeClassName(this.options.loadingClassName);
                var text = transport.responseText;
                if (this.options.stripLoadedTextTags)
                    text = text.stripTags();
                this._controls.editor.value = text;
                this._controls.editor.disabled = false;
                this.postProcessEditField();
            }.bind(this),
            onFailure: this._boundFailureHandler
        });
        new Ajax.Request(this.options.loadTextURL, options);
    },
    postProcessEditField: function() {
        var fpc = this.options.fieldPostCreation;
        if (fpc)
            $(this._controls.editor)['focus' == fpc ? 'focus' : 'activate']();
    },
    prepareOptions: function() {
        this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions);
        Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks);
        [this._extraDefaultOptions].flatten().compact().each(function(defs) {
            Object.extend(this.options, defs);
        }.bind(this));
    },
    prepareSubmission: function() {
        this._saving = true;
        this.removeForm();
        this.leaveHover();
        this.showSaving();
    },
    registerListeners: function() {
        this._listeners = {};
        var listener;
        $H(Ajax.InPlaceEditor.Listeners).each(function(pair) {
            listener = this[pair.value].bind(this);
            this._listeners[pair.key] = listener;
            if (!this.options.externalControlOnly)
                this.element.observe(pair.key, listener);
            if (this.options.externalControl)
                this.options.externalControl.observe(pair.key, listener);
        }.bind(this));
    },
    removeForm: function() {
        if (!this._form) return;
        this._form.remove();
        this._form = null;
        this._controls = {};
    },
    showSaving: function() {
        this._oldInnerHTML = this.element.innerHTML;
        this.element.innerHTML = this.options.savingText;
        this.element.addClassName(this.options.savingClassName);
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show();
    },
    triggerCallback: function(cbName, arg) {
        if ('function' == typeof this.options[cbName]) {
            this.options[cbName](this, arg);
        }
    },
    unregisterListeners: function() {
        $H(this._listeners).each(function(pair) {
            if (!this.options.externalControlOnly)
                this.element.stopObserving(pair.key, pair.value);
            if (this.options.externalControl)
                this.options.externalControl.stopObserving(pair.key, pair.value);
        }.bind(this));
    },
    wrapUp: function(transport) {
        this.leaveEditMode();
        this._boundComplete(transport, this.element);
    }
});
Object.extend(Ajax.InPlaceEditor.prototype, {
    dispose: Ajax.InPlaceEditor.prototype.destroy
});
Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
    initialize: function($super, element, url, options) {
        this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions;
        $super(element, url, options);
    },
    createEditField: function() {
        var list = document.createElement('select');
        list.name = this.options.paramName;
        list.size = 1;
        this._controls.editor = list;
        this._collection = this.options.collection || [];
        if (this.options.loadCollectionURL)
            this.loadCollection();
        else
            this.checkForExternalText();
        this._form.appendChild(this._controls.editor);
    },
    loadCollection: function() {
        this._form.addClassName(this.options.loadingClassName);
        this.showLoadingText(this.options.loadingCollectionText);
        var options = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(options, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function(transport) {
                var js = transport.responseText.strip();
                if (!/^\[.*\]$/.test(js))
                    throw ('Server returned an invalid collection representation.');
                this._collection = eval(js);
                this.checkForExternalText();
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadCollectionURL, options);
    },
    showLoadingText: function(text) {
        this._controls.editor.disabled = true;
        var tempOption = this._controls.editor.firstChild;
        if (!tempOption) {
            tempOption = document.createElement('option');
            tempOption.value = '';
            this._controls.editor.appendChild(tempOption);
            tempOption.selected = true;
        }
        tempOption.update((text || '').stripScripts().stripTags());
    },
    checkForExternalText: function() {
        this._text = this.getText();
        if (this.options.loadTextURL)
            this.loadExternalText();
        else
            this.buildOptionList();
    },
    loadExternalText: function() {
        this.showLoadingText(this.options.loadingText);
        var options = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(options, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function(transport) {
                this._text = transport.responseText.strip();
                this.buildOptionList();
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadTextURL, options);
    },
    buildOptionList: function() {
        this._form.removeClassName(this.options.loadingClassName);
        this._collection = this._collection.map(function(entry) {
            return 2 === entry.length ? entry : [entry, entry].flatten();
        });
        var marker = ('value' in this.options) ? this.options.value : this._text;
        var textFound = this._collection.any(function(entry) {
            return entry[0] == marker;
        }.bind(this));
        this._controls.editor.update('');
        var option;
        this._collection.each(function(entry, index) {
            option = document.createElement('option');
            option.value = entry[0];
            option.selected = textFound ? entry[0] == marker : 0 == index;
            option.appendChild(document.createTextNode(entry[1]));
            this._controls.editor.appendChild(option);
        }.bind(this));
        this._controls.editor.disabled = false;
        Field.scrollFreeActivate(this._controls.editor);
    }
});
Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function(options) {
    if (!options) return;

    function fallback(name, expr) {
        if (name in options || expr === undefined) return;
        options[name] = expr;
    };
    fallback('cancelControl', (options.cancelLink ? 'link' : (options.cancelButton ? 'button' : options.cancelLink == options.cancelButton == false ? false : undefined)));
    fallback('okControl', (options.okLink ? 'link' : (options.okButton ? 'button' : options.okLink == options.okButton == false ? false : undefined)));
    fallback('highlightColor', options.highlightcolor);
    fallback('highlightEndColor', options.highlightendcolor);
};
Object.extend(Ajax.InPlaceEditor, {
    DefaultOptions: {
        ajaxOptions: {},
        autoRows: 3,
        cancelControl: 'link',
        cancelText: 'cancel',
        clickToEditText: 'Click to edit',
        externalControl: null,
        externalControlOnly: false,
        fieldPostCreation: 'activate',
        formClassName: 'inplaceeditor-form',
        formId: null,
        highlightColor: '#ffff99',
        highlightEndColor: '#ffffff',
        hoverClassName: '',
        htmlResponse: true,
        loadingClassName: 'inplaceeditor-loading',
        loadingText: 'Loading...',
        okControl: 'button',
        okText: 'ok',
        paramName: 'value',
        rows: 1,
        savingClassName: 'inplaceeditor-saving',
        savingText: 'Saving...',
        size: 0,
        stripLoadedTextTags: false,
        submitOnBlur: false,
        textAfterControls: '',
        textBeforeControls: '',
        textBetweenControls: ''
    },
    DefaultCallbacks: {
        callback: function(form) {
            return Form.serialize(form);
        },
        onComplete: function(transport, element) {
            new Effect.Highlight(element, {
                startcolor: this.options.highlightColor,
                keepBackgroundImage: true
            });
        },
        onEnterEditMode: null,
        onEnterHover: function(ipe) {
            ipe.element.style.backgroundColor = ipe.options.highlightColor;
            if (ipe._effect)
                ipe._effect.cancel();
        },
        onFailure: function(transport, ipe) {
            alert('Error communication with the server: ' + transport.responseText.stripTags());
        },
        onFormCustomization: null,
        onLeaveEditMode: null,
        onLeaveHover: function(ipe) {
            ipe._effect = new Effect.Highlight(ipe.element, {
                startcolor: ipe.options.highlightColor,
                endcolor: ipe.options.highlightEndColor,
                restorecolor: ipe._originalBackground,
                keepBackgroundImage: true
            });
        }
    },
    Listeners: {
        click: 'enterEditMode',
        keydown: 'checkForEscapeOrReturn',
        mouseover: 'enterHover',
        mouseout: 'leaveHover'
    }
});
Ajax.InPlaceCollectionEditor.DefaultOptions = {
    loadingCollectionText: 'Loading options...'
};
Form.Element.DelayedObserver = Class.create({
    initialize: function(element, delay, callback) {
        this.delay = delay || 0.5;
        this.element = $(element);
        this.callback = callback;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, 'keyup', this.delayedListener.bindAsEventListener(this));
    },
    delayedListener: function(event) {
        if (this.lastValue == $F(this.element)) return;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
        this.lastValue = $F(this.element);
    },
    onTimerEvent: function() {
        this.timer = null;
        this.callback(this.element, $F(this.element));
    }
});
if (!Control) var Control = {};
Control.Slider = Class.create({
    initialize: function(handle, track, options) {
        var slider = this;
        if (Object.isArray(handle)) {
            this.handles = handle.collect(function(e) {
                return $(e)
            });
        } else {
            this.handles = [$(handle)];
        }
        this.track = $(track);
        this.options = options || {};
        this.axis = this.options.axis || 'horizontal';
        this.increment = this.options.increment || 1;
        this.step = parseInt(this.options.step || '1');
        this.range = this.options.range || $R(0, 1);
        this.value = 0;
        this.values = this.handles.map(function() {
            return 0
        });
        this.spans = this.options.spans ? this.options.spans.map(function(s) {
            return $(s)
        }) : false;
        this.options.startSpan = $(this.options.startSpan || null);
        this.options.endSpan = $(this.options.endSpan || null);
        this.restricted = this.options.restricted || false;
        this.maximum = this.options.maximum || this.range.end;
        this.minimum = this.options.minimum || this.range.start;
        this.alignX = parseInt(this.options.alignX || '0');
        this.alignY = parseInt(this.options.alignY || '0');
        this.trackLength = this.maximumOffset() - this.minimumOffset();
        this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""));
        this.active = false;
        this.dragging = false;
        this.disabled = false;
        if (this.options.disabled) this.setDisabled();
        this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
        if (this.allowedValues) {
            this.minimum = this.allowedValues.min();
            this.maximum = this.allowedValues.max();
        }
        this.eventMouseDown = this.startDrag.bindAsEventListener(this);
        this.eventMouseUp = this.endDrag.bindAsEventListener(this);
        this.eventMouseMove = this.update.bindAsEventListener(this);
        this.handles.each(function(h, i) {
            i = slider.handles.length - 1 - i;
            slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue) ? slider.options.sliderValue[i] : slider.options.sliderValue) || slider.range.start), i);
            h.makePositioned().observe("mousedown", slider.eventMouseDown);
        });
        this.track.observe("mousedown", this.eventMouseDown);
        document.observe("mouseup", this.eventMouseUp);
        $(this.track.parentNode.parentNode).observe("mousemove", this.eventMouseMove);
        this.initialized = true;
    },
    dispose: function() {
        var slider = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(this.track.parentNode.parentNode, "mousemove", this.eventMouseMove);
        this.handles.each(function(h) {
            Event.stopObserving(h, "mousedown", slider.eventMouseDown);
        });
    },
    setDisabled: function() {
        this.disabled = true;
        this.track.parentNode.className = this.track.parentNode.className + ' disabled';
    },
    setEnabled: function() {
        this.disabled = false;
    },
    getNearestValue: function(value) {
        if (this.allowedValues) {
            if (value >= this.allowedValues.max()) return (this.allowedValues.max());
            if (value <= this.allowedValues.min()) return (this.allowedValues.min());
            var offset = Math.abs(this.allowedValues[0] - value);
            var newValue = this.allowedValues[0];
            this.allowedValues.each(function(v) {
                var currentOffset = Math.abs(v - value);
                if (currentOffset <= offset) {
                    newValue = v;
                    offset = currentOffset;
                }
            });
            return newValue;
        }
        if (value > this.range.end) return this.range.end;
        if (value < this.range.start) return this.range.start;
        return value;
    },
    setValue: function(sliderValue, handleIdx) {
        if (!this.active) {
            this.activeHandleIdx = handleIdx || 0;
            this.activeHandle = this.handles[this.activeHandleIdx];
            this.updateStyles();
        }
        handleIdx = handleIdx || this.activeHandleIdx || 0;
        if (this.initialized && this.restricted) {
            if ((handleIdx > 0) && (sliderValue < this.values[handleIdx - 1]))
                sliderValue = this.values[handleIdx - 1];
            if ((handleIdx < (this.handles.length - 1)) && (sliderValue > this.values[handleIdx + 1]))
                sliderValue = this.values[handleIdx + 1];
        }
        sliderValue = this.getNearestValue(sliderValue);
        this.values[handleIdx] = sliderValue;
        this.value = this.values[0];
        this.handles[handleIdx].style[this.isVertical() ? 'top' : 'left'] = this.translateToPx(sliderValue);
        this.drawSpans();
        if (!this.dragging || !this.event) this.updateFinished();
    },
    setValueBy: function(delta, handleIdx) {
        this.setValue(this.values[handleIdx || this.activeHandleIdx || 0] + delta, handleIdx || this.activeHandleIdx || 0);
    },
    translateToPx: function(value) {
        return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (value - this.range.start)) + "px";
    },
    translateToValue: function(offset) {
        return ((offset / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start);
    },
    getRange: function(range) {
        var v = this.values.sortBy(Prototype.K);
        range = range || 0;
        return $R(v[range], v[range + 1]);
    },
    minimumOffset: function() {
        return (this.isVertical() ? this.alignY : this.alignX);
    },
    maximumOffset: function() {
        return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (this.track.offsetWidth != 0 ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX);
    },
    isVertical: function() {
        return (this.axis == 'vertical');
    },
    drawSpans: function() {
        var slider = this;
        if (this.spans)
            $R(0, this.spans.length - 1).each(function(r) {
                slider.setSpan(slider.spans[r], slider.getRange(r))
            });
        if (this.options.startSpan)
            this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value));
        if (this.options.endSpan)
            this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum));
    },
    setSpan: function(span, range) {
        if (this.isVertical()) {
            span.style.top = this.translateToPx(range.start);
            span.style.height = this.translateToPx(range.end - range.start + this.range.start);
        } else {
            span.style.left = this.translateToPx(range.start);
            span.style.width = this.translateToPx(range.end - range.start + this.range.start);
        }
    },
    updateStyles: function() {
        this.handles.each(function(h) {
            Element.removeClassName(h, 'selected')
        });
        Element.addClassName(this.activeHandle, 'selected');
    },
    startDrag: function(event) {
        if (Event.isLeftClick(event)) {
            if (!this.disabled) {
                this.active = true;
                var handle = Event.element(event);
                var pointer = [Event.pointerX(event), Event.pointerY(event)];
                var track = handle;
                if (track == this.track) {
                    var offsets = Position.cumulativeOffset(this.track);
                    this.event = event;
                    this.setValue(this.translateToValue((this.isVertical() ? pointer[1] - offsets[1] : pointer[0] - offsets[0]) - (this.handleLength / 2)));
                    var offsets = Position.cumulativeOffset(this.activeHandle);
                    this.offsetX = (pointer[0] - offsets[0]);
                    this.offsetY = (pointer[1] - offsets[1]);
                } else {
                    while ((this.handles.indexOf(handle) == -1) && handle.parentNode)
                        handle = handle.parentNode;
                    if (this.handles.indexOf(handle) != -1) {
                        this.activeHandle = handle;
                        this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
                        this.updateStyles();
                        var offsets = Position.cumulativeOffset(this.activeHandle);
                        this.offsetX = (pointer[0] - offsets[0]);
                        this.offsetY = (pointer[1] - offsets[1]);
                    }
                }
            }
            Event.stop(event);
        }
    },
    update: function(event) {
        if (this.active) {
            if (!this.dragging) this.dragging = true;
            this.draw(event);
            if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
            Event.stop(event);
        }
    },
    draw: function(event) {
        var pointer = [Event.pointerX(event), Event.pointerY(event)];
        var offsets = Position.cumulativeOffset(this.track);
        pointer[0] -= this.offsetX + offsets[0];
        pointer[1] -= this.offsetY + offsets[1];
        this.event = event;
        this.setValue(this.translateToValue(this.isVertical() ? pointer[1] : pointer[0]));
        if (this.initialized && this.options.onSlide)
            this.options.onSlide(this.values.length > 1 ? this.values : this.value, this);
    },
    endDrag: function(event) {
        if (this.active && this.dragging) {
            this.finishDrag(event, true);
            Event.stop(event);
        }
        this.active = false;
        this.dragging = false;
    },
    finishDrag: function(event, success) {
        this.active = false;
        this.dragging = false;
        this.updateFinished();
    },
    updateFinished: function() {
        if (this.initialized && this.options.onChange)
            this.options.onChange(this.values.length > 1 ? this.values : this.value, this);
        this.event = null;
    }
});

function popWin(url, win, para) {
    var win = window.open(url, win, para);
    win.focus();
}

function setLocation(url) {
    window.location.href = encodeURI(url);
}

function setPLocation(url, setFocus) {
    if (setFocus) {
        window.opener.focus();
    }
    window.opener.location.href = encodeURI(url);
}

function setLanguageCode(code, fromCode) {
    var href = window.location.href;
    var after = '',
        dash;
    if (dash = href.match(/\#(.*)$/)) {
        href = href.replace(/\#(.*)$/, '');
        after = dash[0];
    }
    if (href.match(/[?]/)) {
        var re = /([?&]store=)[a-z0-9_]*/;
        if (href.match(re)) {
            href = href.replace(re, '$1' + code);
        } else {
            href += '&store=' + code;
        }
        var re = /([?&]from_store=)[a-z0-9_]*/;
        if (href.match(re)) {
            href = href.replace(re, '');
        }
    } else {
        href += '?store=' + code;
    }
    if (typeof(fromCode) != 'undefined') {
        href += '&from_store=' + fromCode;
    }
    href += after;
    setLocation(href);
}

function decorateGeneric(elements, decorateParams) {
    var allSupportedParams = ['odd', 'even', 'first', 'last'];
    var _decorateParams = {};
    var total = elements.length;
    if (total) {
        if (typeof(decorateParams) == 'undefined') {
            decorateParams = allSupportedParams;
        }
        if (!decorateParams.length) {
            return;
        }
        for (var k in allSupportedParams) {
            _decorateParams[allSupportedParams[k]] = false;
        }
        for (var k in decorateParams) {
            _decorateParams[decorateParams[k]] = true;
        }
        if (_decorateParams.first) {
            Element.addClassName(elements[0], 'first');
        }
        if (_decorateParams.last) {
            Element.addClassName(elements[total - 1], 'last');
        }
        for (var i = 0; i < total; i++) {
            if ((i + 1) % 2 == 0) {
                if (_decorateParams.even) {
                    Element.addClassName(elements[i], 'even');
                }
            } else {
                if (_decorateParams.odd) {
                    Element.addClassName(elements[i], 'odd');
                }
            }
        }
    }
}

function decorateTable(table, options) {
    var table = $(table);
    if (table) {
        var _options = {
            'tbody': false,
            'tbody tr': ['odd', 'even', 'first', 'last'],
            'thead tr': ['first', 'last'],
            'tfoot tr': ['first', 'last'],
            'tr td': ['last']
        };
        if (typeof(options) != 'undefined') {
            for (var k in options) {
                _options[k] = options[k];
            }
        }
        if (_options['tbody']) {
            decorateGeneric(table.select('tbody'), _options['tbody']);
        }
        if (_options['tbody tr']) {
            decorateGeneric(table.select('tbody tr'), _options['tbody tr']);
        }
        if (_options['thead tr']) {
            decorateGeneric(table.select('thead tr'), _options['thead tr']);
        }
        if (_options['tfoot tr']) {
            decorateGeneric(table.select('tfoot tr'), _options['tfoot tr']);
        }
        if (_options['tr td']) {
            var allRows = table.select('tr');
            if (allRows.length) {
                for (var i = 0; i < allRows.length; i++) {
                    decorateGeneric(allRows[i].getElementsByTagName('TD'), _options['tr td']);
                }
            }
        }
    }
}

function decorateList(list, nonRecursive) {
    if ($(list)) {
        if (typeof(nonRecursive) == 'undefined') {
            var items = $(list).select('li');
        } else {
            var items = $(list).childElements();
        }
        decorateGeneric(items, ['odd', 'even', 'last']);
    }
}

function decorateDataList(list) {
    list = $(list);
    if (list) {
        decorateGeneric(list.select('dt'), ['odd', 'even', 'last']);
        decorateGeneric(list.select('dd'), ['odd', 'even', 'last']);
    }
}

function parseSidUrl(baseUrl, urlExt) {
    var sidPos = baseUrl.indexOf('/?SID=');
    var sid = '';
    urlExt = (urlExt != undefined) ? urlExt : '';
    if (sidPos > -1) {
        sid = '?' + baseUrl.substring(sidPos + 2);
        baseUrl = baseUrl.substring(0, sidPos + 1);
    }
    return baseUrl + urlExt + sid;
}

function formatCurrency(price, format, showPlus) {
    var precision = isNaN(format.precision = Math.abs(format.precision)) ? 2 : format.precision;
    var requiredPrecision = isNaN(format.requiredPrecision = Math.abs(format.requiredPrecision)) ? 2 : format.requiredPrecision;
    precision = requiredPrecision;
    var integerRequired = isNaN(format.integerRequired = Math.abs(format.integerRequired)) ? 1 : format.integerRequired;
    var decimalSymbol = format.decimalSymbol == undefined ? "," : format.decimalSymbol;
    var groupSymbol = format.groupSymbol == undefined ? "." : format.groupSymbol;
    var groupLength = format.groupLength == undefined ? 3 : format.groupLength;
    var s = '';
    if (showPlus == undefined || showPlus == true) {
        s = price < 0 ? "-" : (showPlus ? "+" : "");
    } else if (showPlus == false) {
        s = '';
    }
    var i = parseInt(price = Math.abs(+price || 0).toFixed(precision)) + "";
    var pad = (i.length < integerRequired) ? (integerRequired - i.length) : 0;
    while (pad) {
        i = '0' + i;
        pad--;
    }
    j = (j = i.length) > groupLength ? j % groupLength : 0;
    re = new RegExp("(\\d{" + groupLength + "})(?=\\d)", "g");
    var r = (j ? i.substr(0, j) + groupSymbol : "") + i.substr(j).replace(re, "$1" + groupSymbol) + (precision ? decimalSymbol + Math.abs(price - i).toFixed(precision).replace(/-/, 0).slice(2) : "");
    var pattern = '';
    if (format.pattern.indexOf('{sign}') == -1) {
        pattern = s + format.pattern;
    } else {
        pattern = format.pattern.replace('{sign}', s);
    }
    return pattern.replace('%s', r).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

function expandDetails(el, childClass) {
    if (Element.hasClassName(el, 'show-details')) {
        $$(childClass).each(function(item) {
            item.hide();
        });
        Element.removeClassName(el, 'show-details');
    } else {
        $$(childClass).each(function(item) {
            item.show();
        });
        Element.addClassName(el, 'show-details');
    }
}
var isIE = navigator.appVersion.match(/MSIE/) == "MSIE";
if (!window.Varien)
    var Varien = new Object();
Varien.showLoading = function() {
    var loader = $('loading-process');
    loader && loader.show();
};
Varien.hideLoading = function() {
    var loader = $('loading-process');
    loader && loader.hide();
};
Varien.GlobalHandlers = {
    onCreate: function() {
        Varien.showLoading();
    },
    onComplete: function() {
        if (Ajax.activeRequestCount == 0) {
            Varien.hideLoading();
        }
    }
};
Ajax.Responders.register(Varien.GlobalHandlers);
Varien.searchForm = Class.create();
Varien.searchForm.prototype = {
    initialize: function(form, field, emptyText) {
        this.form = $(form);
        this.field = $(field);
        this.emptyText = emptyText;
        Event.observe(this.form, 'submit', this.submit.bind(this));
        Event.observe(this.field, 'focus', this.focus.bind(this));
        Event.observe(this.field, 'blur', this.blur.bind(this));
        this.blur();
    },
    submit: function(event) {
        if (this.field.value == this.emptyText || this.field.value == '') {
            Event.stop(event);
            return false;
        }
        return true;
    },
    focus: function(event) {
        if (this.field.value == this.emptyText) {
            this.field.value = '';
        }
    },
    blur: function(event) {
        if (this.field.value == '') {
            this.field.value = this.emptyText;
        }
    },
    initAutocomplete: function(url, destinationElement) {
        new Ajax.Autocompleter(this.field, destinationElement, url, {
            paramName: this.field.name,
            method: 'get',
            minChars: 2,
            updateElement: this._selectAutocompleteItem.bind(this),
            onShow: function(element, update) {
                if (!update.style.position || update.style.position == 'absolute') {
                    update.style.position = 'absolute';
                    Position.clone(element, update, {
                        setHeight: false,
                        offsetTop: element.offsetHeight
                    });
                }
                Effect.Appear(update, {
                    duration: 0
                });
            }
        });
    },
    _selectAutocompleteItem: function(element) {
        if (element.title) {
            this.field.value = element.title;
        }
        this.form.submit();
    }
};
Varien.Tabs = Class.create();
Varien.Tabs.prototype = {
    initialize: function(selector) {
        var self = this;
        $$(selector + ' a').each(this.initTab.bind(this));
    },
    initTab: function(el) {
        el.href = 'javascript:void(0)';
        if ($(el.parentNode).hasClassName('active')) {
            this.showContent(el);
        }
        el.observe('click', this.showContent.bind(this, el));
    },
    showContent: function(a) {
        var li = $(a.parentNode),
            ul = $(li.parentNode);
        ul.getElementsBySelector('li', 'ol').each(function(el) {
            var contents = $(el.id + '_contents');
            if (el == li) {
                el.addClassName('active');
                contents.show();
            } else {
                el.removeClassName('active');
                contents.hide();
            }
        });
    }
};
Varien.DateElement = Class.create();
Varien.DateElement.prototype = {
    initialize: function(type, content, required, format) {
        if (type == 'id') {
            this.day = $(content + 'day');
            this.month = $(content + 'month');
            this.year = $(content + 'year');
            this.full = $(content + 'full');
            this.advice = $(content + 'date-advice');
        } else if (type == 'container') {
            this.day = content.day;
            this.month = content.month;
            this.year = content.year;
            this.full = content.full;
            this.advice = content.advice;
        } else {
            return;
        }
        this.required = required;
        this.format = format;
        this.day.addClassName('validate-custom');
        this.day.validate = this.validate.bind(this);
        this.month.addClassName('validate-custom');
        this.month.validate = this.validate.bind(this);
        this.year.addClassName('validate-custom');
        this.year.validate = this.validate.bind(this);
        this.setDateRange(false, false);
        this.year.setAttribute('autocomplete', 'off');
        this.advice.hide();
        var date = new Date;
        this.curyear = date.getFullYear();
    },
    validate: function() {
        var error = false,
            day = parseInt(this.day.value, 10) || 0,
            month = parseInt(this.month.value, 10) || 0,
            year = parseInt(this.year.value, 10) || 0;
        if (this.day.value.strip().empty() && this.month.value.strip().empty() && this.year.value.strip().empty()) {
            if (this.required) {
                error = 'This date is a required value.';
            } else {
                this.full.value = '';
            }
        } else if (!day || !month || !year) {
            error = 'Please enter a valid full date';
        } else {
            var date = new Date,
                countDaysInMonth = 0,
                errorType = null;
            date.setYear(year);
            date.setMonth(month - 1);
            date.setDate(32);
            countDaysInMonth = 32 - date.getDate();
            if (!countDaysInMonth || countDaysInMonth > 31) countDaysInMonth = 31;
            if (year < 1900) error = this.errorTextModifier(this.validateDataErrorText);
            if (day < 1 || day > countDaysInMonth) {
                errorType = 'day';
                error = 'Please enter a valid day (1-%d).';
            } else if (month < 1 || month > 12) {
                errorType = 'month';
                error = 'Please enter a valid month (1-12).';
            } else {
                if (day % 10 == day) this.day.value = '0' + day;
                if (month % 10 == month) this.month.value = '0' + month;
                this.full.value = this.format.replace(/%[mb]/i, this.month.value).replace(/%[de]/i, this.day.value).replace(/%y/i, this.year.value);
                var testFull = this.month.value + '/' + this.day.value + '/' + this.year.value;
                var test = new Date(testFull);
                if (isNaN(test)) {
                    error = 'Please enter a valid date.';
                } else {
                    this.setFullDate(test);
                }
            }
            var valueError = false;
            if (!error && !this.validateData()) {
                errorType = this.validateDataErrorType;
                valueError = this.validateDataErrorText;
                error = valueError;
            }
        }
        if (error !== false) {
            try {
                error = Translator.translate(error);
            } catch (e) {}
            if (!valueError) {
                this.advice.innerHTML = error.replace('%d', countDaysInMonth);
            } else {
                this.advice.innerHTML = this.errorTextModifier(error);
            }
            this.advice.show();
            return false;
        }
        this.day.removeClassName('validation-failed');
        this.month.removeClassName('validation-failed');
        this.year.removeClassName('validation-failed');
        this.advice.hide();
        return true;
    },
    validateData: function() {
        var year = this.fullDate.getFullYear();
        return (year >= 1900 && year <= this.curyear);
    },
    validateDataErrorType: 'year',
    validateDataErrorText: 'Please enter a valid year (1900-%d).',
    errorTextModifier: function(text) {
        text = Translator.translate(text);
        return text.replace('%d', this.curyear);
    },
    setDateRange: function(minDate, maxDate) {
        this.minDate = minDate;
        this.maxDate = maxDate;
    },
    setFullDate: function(date) {
        this.fullDate = date;
    }
};
Varien.DOB = Class.create();
Varien.DOB.prototype = {
    initialize: function(selector, required, format) {
        var el = $$(selector)[0];
        var container = {};
        container.day = Element.select(el, '.dob-day input')[0];
        container.month = Element.select(el, '.dob-month input')[0];
        container.year = Element.select(el, '.dob-year input')[0];
        container.full = Element.select(el, '.dob-full input')[0];
        container.advice = Element.select(el, '.validation-advice')[0];
        new Varien.DateElement('container', container, required, format);
    }
};
Varien.dateRangeDate = Class.create();
Varien.dateRangeDate.prototype = Object.extend(new Varien.DateElement(), {
    validateData: function() {
        var validate = true;
        if (this.minDate || this.maxValue) {
            if (this.minDate) {
                this.minDate = new Date(this.minDate);
                this.minDate.setHours(0);
                if (isNaN(this.minDate)) {
                    this.minDate = new Date('1/1/1900');
                }
                validate = validate && (this.fullDate >= this.minDate);
            }
            if (this.maxDate) {
                this.maxDate = new Date(this.maxDate);
                this.minDate.setHours(0);
                if (isNaN(this.maxDate)) {
                    this.maxDate = new Date();
                }
                validate = validate && (this.fullDate <= this.maxDate);
            }
            if (this.maxDate && this.minDate) {
                this.validateDataErrorText = 'Please enter a valid date between %s and %s';
            } else if (this.maxDate) {
                this.validateDataErrorText = 'Please enter a valid date less than or equal to %s';
            } else if (this.minDate) {
                this.validateDataErrorText = 'Please enter a valid date equal to or greater than %s';
            } else {
                this.validateDataErrorText = '';
            }
        }
        return validate;
    },
    validateDataErrorText: 'Date should be between %s and %s',
    errorTextModifier: function(text) {
        if (this.minDate) {
            text = text.sub('%s', this.dateFormat(this.minDate));
        }
        if (this.maxDate) {
            text = text.sub('%s', this.dateFormat(this.maxDate));
        }
        return text;
    },
    dateFormat: function(date) {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }
});
Varien.FileElement = Class.create();
Varien.FileElement.prototype = {
    initialize: function(id) {
        this.fileElement = $(id);
        this.hiddenElement = $(id + '_value');
        this.fileElement.observe('change', this.selectFile.bind(this));
    },
    selectFile: function(event) {
        this.hiddenElement.value = this.fileElement.getValue();
    }
};
Validation.addAllThese([
    ['validate-custom', ' ', function(v, elm) {
        return elm.validate();
    }]
]);

function truncateOptions() {
    $$('.truncated').each(function(element) {
        Event.observe(element, 'mouseover', function() {
            if (element.down('div.truncated_full_value')) {
                element.down('div.truncated_full_value').addClassName('show');
            }
        });
        Event.observe(element, 'mouseout', function() {
            if (element.down('div.truncated_full_value')) {
                element.down('div.truncated_full_value').removeClassName('show');
            }
        });
    });
}
Event.observe(window, 'load', function() {
    truncateOptions();
});
Element.addMethods({
    getInnerText: function(element) {
        element = $(element);
        if (element.innerText && !Prototype.Browser.Opera) {
            return element.innerText;
        }
        return element.innerHTML.stripScripts().unescapeHTML().replace(/[\n\r\s]+/g, ' ').strip();
    }
});

function fireEvent(element, event) {
    if (document.createEvent) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true);
        return element.dispatchEvent(evt);
    } else {
        var evt = document.createEventObject();
        return element.fireEvent('on' + event, evt);
    }
}

function modulo(dividend, divisor) {
    var epsilon = divisor / 10000;
    var remainder = dividend % divisor;
    if (Math.abs(remainder - divisor) < epsilon || Math.abs(remainder) < epsilon) {
        remainder = 0;
    }
    return remainder;
}
if ((typeof Range != "undefined") && !Range.prototype.createContextualFragment) {
    Range.prototype.createContextualFragment = function(html) {
        var frag = document.createDocumentFragment(),
            div = document.createElement("div");
        frag.appendChild(div);
        div.outerHTML = html;
        return frag;
    };
}
VarienForm = Class.create();
VarienForm.prototype = {
    initialize: function(formId, firstFieldFocus) {
        this.form = $(formId);
        if (!this.form) {
            return;
        }
        this.cache = $A();
        this.currLoader = false;
        this.currDataIndex = false;
        this.validator = new Validation(this.form);
        this.elementFocus = this.elementOnFocus.bindAsEventListener(this);
        this.elementBlur = this.elementOnBlur.bindAsEventListener(this);
        this.childLoader = this.onChangeChildLoad.bindAsEventListener(this);
        this.highlightClass = 'highlight';
        this.extraChildParams = '';
        this.firstFieldFocus = firstFieldFocus || false;
        this.bindElements();
        if (this.firstFieldFocus) {
            try {
                Form.Element.focus(Form.findFirstElement(this.form));
            } catch (e) {}
        }
    },
    submit: function(url) {
        if (this.validator && this.validator.validate()) {
            this.form.submit();
        }
        return false;
    },
    bindElements: function() {
        var elements = Form.getElements(this.form);
        for (var row in elements) {
            if (elements[row].id) {
                Event.observe(elements[row], 'focus', this.elementFocus);
                Event.observe(elements[row], 'blur', this.elementBlur);
            }
        }
    },
    elementOnFocus: function(event) {
        var element = Event.findElement(event, 'fieldset');
        if (element) {
            Element.addClassName(element, this.highlightClass);
        }
    },
    elementOnBlur: function(event) {
        var element = Event.findElement(event, 'fieldset');
        if (element) {
            Element.removeClassName(element, this.highlightClass);
        }
    },
    setElementsRelation: function(parent, child, dataUrl, first) {
        if (parent = $(parent)) {
            if (!this.cache[parent.id]) {
                this.cache[parent.id] = $A();
                this.cache[parent.id]['child'] = child;
                this.cache[parent.id]['dataUrl'] = dataUrl;
                this.cache[parent.id]['data'] = $A();
                this.cache[parent.id]['first'] = first || false;
            }
            Event.observe(parent, 'change', this.childLoader);
        }
    },
    onChangeChildLoad: function(event) {
        element = Event.element(event);
        this.elementChildLoad(element);
    },
    elementChildLoad: function(element, callback) {
        this.callback = callback || false;
        if (element.value) {
            this.currLoader = element.id;
            this.currDataIndex = element.value;
            if (this.cache[element.id]['data'][element.value]) {
                this.setDataToChild(this.cache[element.id]['data'][element.value]);
            } else {
                new Ajax.Request(this.cache[this.currLoader]['dataUrl'], {
                    method: 'post',
                    parameters: {
                        "parent": element.value
                    },
                    onComplete: this.reloadChildren.bind(this)
                });
            }
        }
    },
    reloadChildren: function(transport) {
        var data = transport.responseJSON || transport.responseText.evalJSON(true) || {};
        this.cache[this.currLoader]['data'][this.currDataIndex] = data;
        this.setDataToChild(data);
    },
    setDataToChild: function(data) {
        if (data.length) {
            var child = $(this.cache[this.currLoader]['child']);
            if (child) {
                var html = '<select name="' + child.name + '" id="' + child.id + '" class="' + child.className + '" title="' + child.title + '" ' + this.extraChildParams + '>';
                if (this.cache[this.currLoader]['first']) {
                    html += '<option value="">' + this.cache[this.currLoader]['first'] + '</option>';
                }
                for (var i in data) {
                    if (data[i].value) {
                        html += '<option value="' + data[i].value + '"';
                        if (child.value && (child.value == data[i].value || child.value == data[i].label)) {
                            html += ' selected';
                        }
                        html += '>' + data[i].label + '</option>';
                    }
                }
                html += '</select>';
                Element.insert(child, {
                    before: html
                });
                Element.remove(child);
            }
        } else {
            var child = $(this.cache[this.currLoader]['child']);
            if (child) {
                var html = '<input type="text" name="' + child.name + '" id="' + child.id + '" class="' + child.className + '" title="' + child.title + '" ' + this.extraChildParams + '>';
                Element.insert(child, {
                    before: html
                });
                Element.remove(child);
            }
        }
        this.bindElements();
        if (this.callback) {
            this.callback();
        }
    }
};
RegionUpdater = Class.create();
RegionUpdater.prototype = {
    initialize: function(countryEl, regionTextEl, regionSelectEl, regions, disableAction, zipEl) {
        this.countryEl = $(countryEl);
        this.regionTextEl = $(regionTextEl);
        this.regionSelectEl = $(regionSelectEl);
        this.zipEl = $(zipEl);
        this.config = regions['config'];
        delete regions.config;
        this.regions = regions;
        this.disableAction = (typeof disableAction == 'undefined') ? 'hide' : disableAction;
        this.zipOptions = (typeof zipOptions == 'undefined') ? false : zipOptions;
        if (this.regionSelectEl.options.length <= 1) {
            this.update();
        }
        Event.observe(this.countryEl, 'change', this.update.bind(this));
    },
    _checkRegionRequired: function() {
        var label, wildCard;
        var elements = [this.regionTextEl, this.regionSelectEl];
        var that = this;
        if (typeof this.config == 'undefined') {
            return;
        }
        var regionRequired = this.config.regions_required.indexOf(this.countryEl.value) >= 0;
        elements.each(function(currentElement) {
            Validation.reset(currentElement);
            label = $$('label[for="' + currentElement.id + '"]')[0];
            if (label) {
                wildCard = label.down('em') || label.down('span.required');
                if (!that.config.show_all_regions) {
                    if (regionRequired) {
                        label.up().show();
                    } else {
                        label.up().hide();
                    }
                }
            }
            if (label && wildCard) {
                if (!regionRequired) {
                    wildCard.hide();
                    if (label.hasClassName('required')) {
                        label.removeClassName('required');
                    }
                } else if (regionRequired) {
                    wildCard.show();
                    if (!label.hasClassName('required')) {
                        label.addClassName('required');
                    }
                }
            }
            if (!regionRequired) {
                if (currentElement.hasClassName('required-entry')) {
                    currentElement.removeClassName('required-entry');
                }
                if ('select' == currentElement.tagName.toLowerCase() && currentElement.hasClassName('validate-select')) {
                    currentElement.removeClassName('validate-select');
                }
            } else {
                if (!currentElement.hasClassName('required-entry')) {
                    currentElement.addClassName('required-entry');
                }
                if ('select' == currentElement.tagName.toLowerCase() && !currentElement.hasClassName('validate-select')) {
                    currentElement.addClassName('validate-select');
                }
            }
        });
    },
    update: function() {
        if (this.regions[this.countryEl.value]) {
            var i, option, region, def;
            def = this.regionSelectEl.getAttribute('defaultValue');
            if (this.regionTextEl) {
                if (!def) {
                    def = this.regionTextEl.value.toLowerCase();
                }
                this.regionTextEl.value = '';
            }
            this.regionSelectEl.options.length = 1;
            for (regionId in this.regions[this.countryEl.value]) {
                region = this.regions[this.countryEl.value][regionId];
                option = document.createElement('OPTION');
                option.value = regionId;
                option.text = region.name.stripTags();
                option.title = region.name;
                if (this.regionSelectEl.options.add) {
                    this.regionSelectEl.options.add(option);
                } else {
                    this.regionSelectEl.appendChild(option);
                }
                if (regionId == def || (region.name && region.name.toLowerCase() == def) || (region.name && region.code.toLowerCase() == def)) {
                    this.regionSelectEl.value = regionId;
                }
            }
            this.sortSelect();
            if (this.disableAction == 'hide') {
                if (this.regionTextEl) {
                    this.regionTextEl.style.display = 'none';
                }
                this.regionSelectEl.style.display = '';
            } else if (this.disableAction == 'disable') {
                if (this.regionTextEl) {
                    this.regionTextEl.disabled = true;
                }
                this.regionSelectEl.disabled = false;
            }
            this.setMarkDisplay(this.regionSelectEl, true);
        } else {
            this.regionSelectEl.options.length = 1;
            this.sortSelect();
            if (this.disableAction == 'hide') {
                if (this.regionTextEl) {
                    this.regionTextEl.style.display = '';
                }
                this.regionSelectEl.style.display = 'none';
                Validation.reset(this.regionSelectEl);
            } else if (this.disableAction == 'disable') {
                if (this.regionTextEl) {
                    this.regionTextEl.disabled = false;
                }
                this.regionSelectEl.disabled = true;
            } else if (this.disableAction == 'nullify') {
                this.regionSelectEl.options.length = 1;
                this.regionSelectEl.value = '';
                this.regionSelectEl.selectedIndex = 0;
                this.lastCountryId = '';
            }
            this.setMarkDisplay(this.regionSelectEl, false);
        }
        this._checkRegionRequired();
        var zipUpdater = new ZipUpdater(this.countryEl.value, this.zipEl);
        zipUpdater.update();
    },
    setMarkDisplay: function(elem, display) {
        elem = $(elem);
        var labelElement = elem.up(0).down('label > span.required') || elem.up(1).down('label > span.required') || elem.up(0).down('label.required > em') || elem.up(1).down('label.required > em');
        if (labelElement) {
            inputElement = labelElement.up().next('input');
            if (display) {
                labelElement.show();
                if (inputElement) {
                    inputElement.addClassName('required-entry');
                }
            } else {
                labelElement.hide();
                if (inputElement) {
                    inputElement.removeClassName('required-entry');
                }
            }
        }
    },
    sortSelect: function() {
        var elem = this.regionSelectEl;
        var tmpArray = new Array();
        var currentVal = $(elem).value;
        for (var i = 0; i < $(elem).options.length; i++) {
            if (i == 0) {
                continue;
            }
            tmpArray[i - 1] = new Array();
            tmpArray[i - 1][0] = $(elem).options[i].text;
            tmpArray[i - 1][1] = $(elem).options[i].value;
        }
        tmpArray.sort();
        for (var i = 1; i <= tmpArray.length; i++) {
            var op = new Option(tmpArray[i - 1][0], tmpArray[i - 1][1]);
            $(elem).options[i] = op;
        }
        $(elem).value = currentVal;
        return;
    }
};
ZipUpdater = Class.create();
ZipUpdater.prototype = {
    initialize: function(country, zipElement) {
        this.country = country;
        this.zipElement = $(zipElement);
    },
    update: function() {
        if (typeof optionalZipCountries == 'undefined') {
            return false;
        }
        if (this.zipElement != undefined) {
            Validation.reset(this.zipElement);
            this._setPostcodeOptional();
        } else {
            Event.observe(window, "load", this._setPostcodeOptional.bind(this));
        }
    },
    _setPostcodeOptional: function() {
        this.zipElement = $(this.zipElement);
        if (this.zipElement == undefined) {
            return false;
        }
        var label = $$('label[for="' + this.zipElement.id + '"]')[0];
        if (label != undefined) {
            var wildCard = label.down('em') || label.down('span.required');
        }
        if (optionalZipCountries.indexOf(this.country) != -1) {
            while (this.zipElement.hasClassName('required-entry')) {
                this.zipElement.removeClassName('required-entry');
            }
            if (wildCard != undefined) {
                wildCard.hide();
            }
        } else {
            this.zipElement.addClassName('required-entry');
            if (wildCard != undefined) {
                wildCard.show();
            }
        }
    }
};
var mainNav = function() {
    var main = {
        obj_nav: $(arguments[0]) || $("nav"),
        settings: {
            show_delay: 0,
            hide_delay: 0,
            _ie6: /MSIE 6.+Win/.test(navigator.userAgent),
            _ie7: /MSIE 7.+Win/.test(navigator.userAgent)
        },
        init: function(obj, level) {
            obj.lists = obj.childElements();
            obj.lists.each(function(el, ind) {
                main.handlNavElement(el);
                if ((main.settings._ie6 || main.settings._ie7) && level) {
                    main.ieFixZIndex(el, ind, obj.lists.size());
                }
            });
            if (main.settings._ie6 && !level) {
                document.execCommand("BackgroundImageCache", false, true);
            }
        },
        handlNavElement: function(list) {
            if (list !== undefined) {
                list.onmouseover = function() {
                    main.fireNavEvent(this, true);
                };
                list.onmouseout = function() {
                    main.fireNavEvent(this, false);
                };
                if (list.down("ul")) {
                    main.init(list.down("ul"), true);
                }
            }
        },
        ieFixZIndex: function(el, i, l) {
            if (el.tagName.toString().toLowerCase().indexOf("iframe") == -1) {
                el.style.zIndex = l - i;
            } else {
                el.onmouseover = "null";
                el.onmouseout = "null";
            }
        },
        fireNavEvent: function(elm, ev) {
            if (ev) {
                elm.addClassName("over");
                elm.down("a").addClassName("over");
                if (elm.childElements()[1]) {
                    main.show(elm.childElements()[1]);
                }
            } else {
                elm.removeClassName("over");
                elm.down("a").removeClassName("over");
                if (elm.childElements()[1]) {
                    main.hide(elm.childElements()[1]);
                }
            }
        },
        show: function(sub_elm) {
            if (sub_elm.hide_time_id) {
                clearTimeout(sub_elm.hide_time_id);
            }
            sub_elm.show_time_id = setTimeout(function() {
                if (!sub_elm.hasClassName("shown-sub")) {
                    sub_elm.addClassName("shown-sub");
                }
            }, main.settings.show_delay);
        },
        hide: function(sub_elm) {
            if (sub_elm.show_time_id) {
                clearTimeout(sub_elm.show_time_id);
            }
            sub_elm.hide_time_id = setTimeout(function() {
                if (sub_elm.hasClassName("shown-sub")) {
                    sub_elm.removeClassName("shown-sub");
                }
            }, main.settings.hide_delay);
        }
    };
    if (arguments[1]) {
        main.settings = Object.extend(main.settings, arguments[1]);
    }
    if (main.obj_nav) {
        main.init(main.obj_nav, false);
    }
};
document.observe("dom:loaded", function() {
    mainNav("nav", {
        "show_delay": "100",
        "hide_delay": "100"
    });
});
var Translate = Class.create();
Translate.prototype = {
    initialize: function(data) {
        this.data = $H(data);
    },
    translate: function() {
        var args = arguments;
        var text = arguments[0];
        if (this.data.get(text)) {
            return this.data.get(text);
        }
        return text;
    },
    add: function() {
        if (arguments.length > 1) {
            this.data.set(arguments[0], arguments[1]);
        } else if (typeof arguments[0] == 'object') {
            $H(arguments[0]).each(function(pair) {
                this.data.set(pair.key, pair.value);
            }.bind(this));
        }
    }
};
if (!window.Mage) var Mage = {};
Mage.Cookies = {};
Mage.Cookies.expires = null;
Mage.Cookies.path = '/';
Mage.Cookies.domain = null;
Mage.Cookies.secure = false;
Mage.Cookies.set = function(name, value) {
    var argv = arguments;
    var argc = arguments.length;
    var expires = (argc > 2) ? argv[2] : Mage.Cookies.expires;
    var path = (argc > 3) ? argv[3] : Mage.Cookies.path;
    var domain = (argc > 4) ? argv[4] : Mage.Cookies.domain;
    var secure = (argc > 5) ? argv[5] : Mage.Cookies.secure;
    document.cookie = name + "=" + escape(value) +
        ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
        ((path == null) ? "" : ("; path=" + path)) +
        ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
};
Mage.Cookies.get = function(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    var j = 0;
    while (i < clen) {
        j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return Mage.Cookies.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
};
Mage.Cookies.clear = function(name) {
    if (Mage.Cookies.get(name)) {
        document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};
Mage.Cookies.getCookieVal = function(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
};
AjaxKitMain = {
    loadedHtml: {},
    submodules: {},
    submoduleButtons: {},
    loadJsText: [],
    totalLoadedImages: 0,
    jsLoadedQuantity: {},
    jsLoadedFunctionality: {},
    mainObserve: function() {},
    mainDocumentObserve: function() {},
    loadJsObjects: [],
    loadJsObjectsNum: 0,
    addSubmodule: function(name, initf, configf) {
        this.submodules[name] = {
            init: initf,
            config: configf
        };
    },
    initSubmodules: function() {
        if (typeof document.AjaxKitSingleton == "undefined") {
            var self = this;
            document.observe("dom:loaded", function() {
                if (typeof AjaxKitConfig != "undefined") {
                    for (submodule in self.submodules) {
                        self.submodules[submodule].config.config = AjaxKitConfig[submodule];
                        setTimeout(self.submodules[submodule].init, 10);
                    }
                }
            });
            document.onkeydown = function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                    AjaxKitMain.closePopup();
                }
            };
            document.AjaxKitSingleton = true;
        }
    },
    observeReplase: function(to_surrogate) {
        if (to_surrogate) {
            AjaxKitMain.mainObserve = Event.observe;
            AjaxKitMain.mainDocumentObserve = document.observe;
            Event.observe = AjaxKitMain.surrogateObserve;
            document.observe = AjaxKitMain.surrogateDocumentObserve;
        } else {
            Event.observe = AjaxKitMain.mainObserve;
            document.observe = AjaxKitMain.mainDocumentObserve;
        }
    },
    surrogateObserve: function(el, eventName, handler) {
        if ('load' == eventName) {
            var reg = /function\s{0,}\((.*?){0,}\)/gi;
            AjaxKitMain.loadJsText.push({
                el: el,
                eventName: eventName,
                handler: handler
            });
            AjaxKitMain.runLoadJs();
        } else {
            AjaxKitMain.mainObserve(el, eventName, handler);
        }
    },
    surrogateDocumentObserve: function(eventName, el) {
        if ('dom:loaded' == eventName) {
            el();
        } else {
            AjaxKitMain.mainDocumentObserve(eventName, el);
        }
    },
    ajaxProcessor: function(processor, action, values, success_func, asynchronous, url) {
        if ("undefined" == typeof asynchronous) {
            asynchronous = true;
        }
        if ("undefined" == typeof success_func) {
            success_func = function() {};
        }
        values.parent = AjaxKitConfig.main.parent;
        values.parent.url = location.href;
        var parameters = {
            action: action,
            isAjax: 1,
            submodule: processor.submodule,
            values: JSON.stringify(values)
        };
        if ("undefined" == typeof url) {
            url = AjaxKitConfig.main.url;
        } else {
            parameters.useObserver = 1;
        }
        new Ajax.Request(url, {
            method: 'Post',
            asynchronous: asynchronous,
            parameters: parameters,
            onSuccess: function(transport) {
                try {
                    var obj = transport.responseText.evalJSON(true);
                    success_func(obj);
                } catch (e) {}
            }
        });
    },
    appendHtmlJsChilds: function(destination_element, element, is_innerHTML) {
        var self = this;
        if (is_innerHTML) {
            destination_element.innerHTML = element;
            var destination_js_element = destination_element;
        } else {
            destination_element.appendChild(element);
            var destination_js_element = element;
        }
        AjaxKitMain.totalLoadedImages++;
        AjaxKitMain.loadJsText = [];
        destination_element.select('img').each(function(img) {
            AjaxKitMain.totalLoadedImages++;
            if (img.complete) {
                self.loadedImage();
            } else {
                img.onload = function() {
                    self.loadedImage();
                }
                img.onerror = function() {
                    self.loadedImage();
                }
            }
        });
        self.loadedImage();
        this.observeReplase(true);
        this.runJs(destination_js_element);
        this.observeReplase(false);
        destination_element.select('a[href*=/uenc/]')._each(function(el) {
            var reg = /\/uenc\/(.*?)\//gi;
            el.href = el.href.replace(reg, '/uenc/' + AjaxKitConfig.main.uenc + '/');
        });
    },
    runJs: function(conteiner) {
        conteiner.select('script')._each(function(el) {
            if (!el.getAttribute('AjaxKit-Singlton')) {
                var text = el.text;
                var reg = /\/\/\]\]>/gi;
                text = text.replace(reg, ' ');
                var reg = /\/\/<\!\[CDATA\[/gi;
                text = text.replace(reg, ' ');
                ev(text);
                el.setAttribute('AjaxKit-Singlton', 1);
            }
        });
    },
    loadedImage: function() {
        var self = this;
        AjaxKitMain.totalLoadedImages--;
        self.runLoadJs();
    },
    runLoadJs: function() {
        var self = this;
        if (0 == AjaxKitMain.totalLoadedImages) {
            self.loadJsText.each(function(js) {
                try {
                    js.handler.call(js.el, js.eventName, js.el);
                } catch (e) {};
            })
        }
    },
    loadedJsCssTmpName: function(el) {
        if ('script' == el.name) {
            return el.name + '--' + el.attributes.src;
        }
        if ('link' == el.name) {
            return el.name + '--' + el.attributes.href;
        }
        return '';
    },
    loadJsCss: function(json, load_operation_name, onload_obj, onload_method_name) {
        var self = this;
        self.jsLoadedQuantity[load_operation_name] = 1;
        self.jsLoadedFunctionality[load_operation_name] = {
            obj: onload_obj,
            method_name: onload_method_name
        };
        if (!self.loadedHtml[load_operation_name]) {
            $$('head')[0].insertAdjacentHTML('beforeend', json.head_html);
            self.loadedHtml[load_operation_name] = true;
        }
        var all_loaded_base_js_css = {};
        AjaxKitConfig.main.js_css.head_js_css.each(function(loaded_base_js_css) {
            all_loaded_base_js_css[self.loadedJsCssTmpName(loaded_base_js_css)] = true;
        });
        self.loadJsObjects = [];
        self.loadJsObjectsNum = 0;
        json.head_js_css.each(function(js_css) {
            var script = document.createElement(js_css.name);
            var script_select = js_css.name;
            for (attr in js_css.attributes) {
                script.setAttribute(attr, js_css.attributes[attr]);
                script_select += '[' + attr + '=' + js_css.attributes[attr] + ']';
            }
            var tmp_name = self.loadedJsCssTmpName(js_css);
            if ($$(script_select).length == 0 && 'undefined' == typeof all_loaded_base_js_css[tmp_name]) {
                if ('script' == js_css.name) {
                    script.setAttribute("onload", 'AjaxKitMain.jsLoaded(\'' + load_operation_name + '\', this)');
                    script.setAttribute("onerror", 'AjaxKitMain.jsLoaded(\'' + load_operation_name + '\', this)');
                    self.jsLoadedQuantity[load_operation_name]++;
                    self.loadJsObjects.push(script);
                } else {
                    $$('head')[0].appendChild(script);
                }
            }
        });
        AjaxKitMain.jsLoaded(load_operation_name);
    },
    loadJs: function() {
        var self = this;
        if ('undefined' != typeof self.loadJsObjects[self.loadJsObjectsNum]) {
            $$('head')[0].appendChild(self.loadJsObjects[self.loadJsObjectsNum]);
            self.loadJsObjectsNum++;
        }
    },
    jsLoaded: function(operation, js) {
        var self = this;
        self.loadJs();
        if (!self.jsLoadedQuantity[operation]) {
            return false;
        }
        self.jsLoadedQuantity[operation]--;
        if (0 >= self.jsLoadedQuantity[operation]) {
            var obj = self.jsLoadedFunctionality[operation].obj;
            var method_name = self.jsLoadedFunctionality[operation].method_name;
            func = obj[method_name];
            func(obj);
        }
    },
    addHtmlPopup: function(popup_html, reinit, popup_destination) {
        if (!popup_html)
            return;
        if (!popup_destination) {
            popup_destination = $$('body')[0];
        }
        if (undefined == reinit) {
            var reinit = true;
        }
        var self = this;
        self.closePopup();
        var div = document.createElement("div");
        div.id = "AddToCart-popup";
        div.innerHTML = popup_html;
        var click_actions = {
            'close-popup-overlay': {
                click: function(el) {
                    self.closePopup();
                }
            },
            'close-popup': {
                click: function(el) {
                    self.closePopup();
                }
            },
            'rewrite-to-url': {
                click: function(el) {
                    window.location.href = el.getAttribute('data-url');
                }
            },
            'close-popup-timer': {
                onload: function(el) {
                    var sec = parseInt(el.innerHTML) - 1;
                    if (sec <= 0) {
                        return;
                    }
                    var timer_func = function(sec) {
                        sec--
                        if (sec >= 0) {
                            el.innerHTML = sec;
                            if ($('AddToCart-popup')) {
                                setTimeout(timer_func, 1000, sec);
                            }
                        } else {
                            self.closePopup();
                        }
                    }
                    timer_func(sec);
                }
            }
        }
        self.appendHtmlJsChilds(popup_destination, div);
        for (class_name in click_actions) {
            div.select('.' + class_name).each(function(el) {
                if (click_actions[class_name].click) {
                    el.setAttribute('data-action', class_name);
                    Event.observe(el, 'click', function(eve) {
                        var cn = el.getAttribute('data-action');
                        var func = click_actions[cn].click;
                        func(el);
                    });
                }
                if (click_actions[class_name].onload) {
                    var func = click_actions[class_name].onload;
                    func(el);
                }
            });
        }
        if (reinit) {
            AjaxKitMain.reinitSubmodules();
        }
        return div;
    },
    closePopup: function() {
        $$('#AddToCart-popup').invoke('remove');
    },
    resetSidebarBlocks: function(class_name, content, remove_ajax_func, _self) {
        var self = this;
        if (false !== content) {
            if ($$('.block.' + class_name).length > 0) {
                var is_destination_finded = true;
                var tmp_block_div = document.createElement("div");
                tmp_block_div.innerHTML = content;
                var block_cart_html = tmp_block_div.select('.block.' + class_name).length ? tmp_block_div.select('.block.' + class_name)[0].innerHTML : false;
                $$('.block.' + class_name).each(function(el) {
                    if (block_cart_html) {
                        el.innerHTML = block_cart_html;
                        self.runJs(el);
                    } else {
                        el.remove();
                    }
                });
            } else {
                var is_destination_finded = false;
                ['block-cart', 'block-compare', 'ajaxkit-block'].each(function(older_child) {
                    if (!is_destination_finded && $$('.block.' + older_child).length) {
                        $$('.block.' + older_child).each(function(el) {
                            el.insert({
                                'after': content
                            });
                            self.runJs(el);
                        });
                        is_destination_finded = true;
                    }
                });
            }
        }
        $$('.block.' + class_name + ' .btn-remove')._each(function(el) {
            func = function() {
                var data_onclick = ev(el.getAttribute('data-onclick'));
                if (typeof data_onclick == 'boolean' && data_onclick) {
                    parameters = {
                        product: el.href
                    }
                    AjaxKitMain.ajaxProcessor(_self, 'sidebar_remove_btn', parameters, remove_ajax_func);
                }
                return false;
            }
            self.setSingltonClick(el, func)
            if (!el.getAttribute('data-onclick')) {
                el.setAttribute('data-onclick', el.getAttribute('onclick').replace('return', ''));
            }
            el.setAttribute('onclick', 'return false;');
        });
        return is_destination_finded;
    },
    addSubmodules: function(key, obj) {
        AjaxKitMain.submoduleButtons[key] = obj;
        obj.reInit();
    },
    reinitSubmodules: function() {
        for (key in AjaxKitMain.submoduleButtons) {
            var obj = AjaxKitMain.submoduleButtons[key];
            setTimeout(obj.reInit(), 1);
        }
    },
    setSingltonClick: function(el, func) {
        if (!el.hasClassName('AjaxKit-Singlton-Click')) {
            el.addClassName('AjaxKit-Singlton-Click')
            Event.observe(el, 'click', function(eve) {
                func(el);
            });
        }
    },
    setSingltonChange: function(el, func) {
        if (!el.hasClassName('AjaxKit-Singlton-Change')) {
            el.addClassName('AjaxKit-Singlton-Change')
            Event.observe(el, 'change', function(eve) {
                func(el);
            });
        }
    },
    addLoader: function(el) {
        if ($$('.AddToCart-loader').length == 0) {
            var div = document.createElement("div");
            div.addClassName("AddToCart-loader");
            var spans = el.select('span');
            if (spans.length > 0) {
                spans[0].appendChild(div);
            } else {
                el.appendChild(div);
            }
        }
    },
    removeLoader: function(el) {
        el.select('.AddToCart-loader').invoke('remove');
    }
}
var ev = eval;
GeneralAddToCart = {
    config: {},
    thisPage: {},
    submodule: 'add_to_cart',
    jsLoadedQuantity: 0,
    jsLoadedQuantityQuickView: 0,
    isJHtmlLoaded: false,
    productOptions: {},
    loadedQuickViewContent: {},
    quickViewContentContainer: {},
    flyDiv: null,
    init: function() {
        var self = this;
        if (self.thisPage) {
            AjaxKitMain.addSubmodules('GeneralAddToCart', GeneralAddToCart);
            self.updateCartHtml();
        }
    },
    reInit: function() {
        GeneralAddToCart.initAddToCartButtons();
        GeneralAddToCart.initQuickViewButtons();
    },
    initAddToCartButtons: function() {
        var self = this;
        $$(this.config.add_to_cart_btn_selector).each(function(el) {
            var onclickValue = false;
            if (!el.hasClassName('AjaxKit-addtocart-link')) {
                el.addClassName('AjaxKit-addtocart-link');
                if (('product' == self.thisPage || 'wishlist' == self.thisPage) && undefined !== el.up('#product_addtocart_form')) {
                    var form = el.up('#product_addtocart_form');
                    var onclickValue = form.getAttribute('action');
                } else {
                    switch (el.tagName) {
                        case 'A':
                            var onclickValue = el.getAttribute('href');
                            el.setAttribute('href', '#');
                            break;
                        case 'INPUT':
                        case 'BUTTON':
                            var onclickValue = el.getAttribute('onclick');
                            break;
                    }
                }
            }
            if (onclickValue) {
                var reg = /\(\'(.*)\'\)/gi;
                var onclickValueUrl = reg.exec(onclickValue)
                onclickValue = onclickValueUrl ? onclickValueUrl[1] : onclickValue;
                el.setAttribute('onclick', 'return false;');
                el.setAttribute('data-onclick-value', onclickValue);
                Event.observe(el, 'click', function(eve) {
                    form = el.up('#product_addtocart_form');
                    if ('product' == self.thisPage || undefined !== form) {
                        self.addToCartPopupProcessor(this, form);
                    } else {
                        self.addToCartProcessor(this)
                    }
                });
            }
        });
        switch (self.thisPage) {
            case 'wishlist':
                $$('button[onclick^=addAllWItemsToCart], .btn-add')._each(function(el) {
                    if (!el.hasClassName('addAllWItemsToCartBtn')) {
                        Event.observe(el, 'click', function(eve) {
                            AjaxKitMain.addLoader(this);
                            var success_func = function(cart_data) {
                                self.updateWishlist();
                                self.updateCartHtml();
                            }
                            var values = {};
                            values.qty = {};
                            $$('textarea, input')._each(function(qty_el) {
                                if (qty_el.name) {
                                    values[qty_el.name] = qty_el.value;
                                }
                            });
                            AjaxKitMain.ajaxProcessor(self, 'add_wishlist_to_Ñ�art', values, success_func);
                        });
                        el.setAttribute('onclick', 'return false;');
                        el.addClassName('addAllWItemsToCartBtn');
                    }
                });
                break;
        }
    },
    addToCartProcessor: function(el, parameters) {
        var self = this;
        AjaxKitMain.addLoader(el);
        if (undefined == parameters) {
            var parameters = {};
        }
        parameters.product = el.getAttribute('data-onclick-value');
        parameters.pageType = self.thisPage;
        var success_func = function(json) {
            if ('SUCCESS' == json.status) {
                self.hideQuickView();
                if (json.show_options) {
                    self.productOptions.product = el;
                    self.productOptions.popup_html = json.popup_html;
                    AjaxKitMain.loadJsCss(json, 'addToCart', self, 'jsLoaded');
                }
                if (json.added) {
                    AjaxKitMain.closePopup();
                    if (json.popup_html) {
                        AjaxKitMain.addHtmlPopup(json.popup_html);
                    }
                    if (json.update_wishlist) {
                        self.updateWishlist();
                    } else {
                        self.productFlyToCart(el);
                    }
                    var func = function() {
                        self.highlightCart();
                    }
                    self.updateCartHtml(func);
                }
            } else {
                AjaxKitMain.addHtmlPopup(json.popup_html);
            }
            AjaxKitMain.removeLoader(el);
        }
        AjaxKitMain.ajaxProcessor(this, 'add_to_cart', parameters, success_func)
    },
    addToCartPopupProcessor: function(el, parent_form) {
        var self = this;
        if (undefined == parent_form) {
            var parent_form = $('AddToCart-popup');
        }
        var form = new VarienForm(parent_form.id);
        if (form.validator.validate()) {
            var wrappers = parent_form.select('#product-options-wrapper, .product-info-options-wrapper, .product-info-products-groupe, #super-product-table');
            var attributes = {
                '__kit': 1
            };
            if (wrappers.length > 0) {
                wrappers._each(function(wrapper) {
                    var values = wrapper.select('select, input, textarea');
                    values._each(function(attribute) {
                        var field = attribute.name;
                        var attribute_type = attribute.getAttribute('type');
                        if ('checkbox' == attribute_type || 'radio' == attribute_type) {
                            if (attribute.checked) {
                                field = field.replace("[]", "");
                                if ('undefined' == typeof attributes[field]) {
                                    attributes[field] = [];
                                }
                                attributes[field].push(attribute.value);
                            }
                        } else {
                            attributes[field] = attribute.value;
                        }
                    });
                });
            }
            var qty = 0;
            if (parent_form.select('#qty').length > 0) {
                var qty = parent_form.select('#qty')[0].value;
            }
            var related_products_arr = [];
            parent_form.select('.popup-related-products input[name^=related_products]:checked').each(function(checkbox) {
                related_products_arr.push(checkbox.value);
            });
            if ('product' == self.thisPage) {
                $$('.block-related input[name^=related_products]:checked').each(function(checkbox) {
                    related_products_arr.push(checkbox.value);
                });
            }
            self.addToCartProcessor(el, {
                attributes: attributes,
                related_product: related_products_arr,
                qty: qty
            });
        }
    },
    jsLoaded: function() {
        var self = GeneralAddToCart;
        self.jsLoadedQuantity--;
        if (self.productOptions.popup_html) {
            var popup_elements = [];
            var divBottom = AjaxKitMain.addHtmlPopup(self.productOptions.popup_html, false);
            divBottom.select(self.config.add_to_cart_btn_selector).each(function(el) {
                el.addClassName('AjaxKit-addtocart-link');
                el.setAttribute('onclick', 'return false;');
                el.setAttribute('data-onclick-value', self.productOptions.product.getAttribute('data-onclick-value'));
                Event.observe(el, 'click', function(eve) {
                    AjaxKitMain.addLoader(this);
                    self.addToCartPopupProcessor(self.productOptions.product);
                });
            });
            AjaxKitMain.reinitSubmodules();
        }
    },
    updateCartHtml: function(after_update_func) {
        var self = this;
        var reg = /checkout\/cart\//gi;
        var is_checkout_cart = reg.exec(window.location.pathname.substr(1));
        if (this.isInit && 'checkout' == self.thisPage && is_checkout_cart) {
            location.reload();
            return false;
        }
        var success_func = function(cart_data) {
            var tmp_div = document.createElement("div");
            tmp_div.innerHTML = cart_data.top_link_cart_html;
            var header_top_link_cart = $$('.top-link-cart');
            if (null != self.flyDiv) {
                self.flyDiv = header_top_link_cart[0].select('.fly-div')[0].clone(true);
            }
            for (j = 0; j < header_top_link_cart.length; j++) {
                header_top_link_cart[j].innerHTML = tmp_div.select('.top-link-cart')[0].innerHTML;
                AjaxKitMain.runJs(header_top_link_cart[j]);
            }
            if (null != self.flyDiv) {
                header_top_link_cart[0].appendChild(self.flyDiv);
            }
            var sFunc = function(json) {
                self.updateCartHtml();
                AjaxKitMain.addHtmlPopup(json.popup_html);
            }
            AjaxKitMain.resetSidebarBlocks('block-cart', cart_data.cart_sidebar, sFunc, self);
            AjaxKitMain.reinitSubmodules()
            truncateOptions();
            if (after_update_func != undefined) {
                after_update_func();
            }
        }
        AjaxKitMain.ajaxProcessor(this, 'get_Ñ�art_html', {}, success_func);
        return true;
    },
    highlightCart: function() {
        var self = this;
        if ($$(self.config.highlight_cart_selector)) {
            $$(self.config.highlight_cart_selector).invoke('addClassName', 'highlight-cart');
            var removeHighlightFunc = function() {
                $$(self.config.highlight_cart_selector).invoke('removeClassName', 'highlight-cart');
            }
            setTimeout(removeHighlightFunc, 300);
        }
    },
    productFlyToCart: function(el) {
        var self = this;
        var cart = $$(this.config.header_selector + ' .top-link-cart');
        if (!cart.length || !parseInt(this.config.product_image_animation)) {
            return false;
        }
        cart = cart[0];
        var parent_el = el;
        do {
            var parent_el = parent_el.up(1);
            img = parent_el.select('img');
        }
        while (!img)
        if (!img.length) {
            return false;
        }
        img = img[0];
        var bodyTop = $$('body')[0].getBoundingClientRect().top;
        var bodyLeft = $$('body')[0].getBoundingClientRect().left;
        var pTop = img.getBoundingClientRect().top - bodyTop;
        var pLeft = img.getBoundingClientRect().left - bodyLeft;
        var cartTop = cart.getBoundingClientRect().top - bodyTop;
        var cartLeft = cart.getBoundingClientRect().left - bodyLeft;
        var x = pLeft - cartLeft;
        var y = pTop - cartTop;
        var div = document.createElement("div");
        div.style.position = 'absolute';
        div.style.top = y + 'px';
        div.style.left = x + 'px';
        div.addClassName('fly-div');
        var img_clone = img.clone(true);
        div.appendChild(img_clone);
        var width = img.width;
        var height = img.height;
        div.style.width = width + 'px';
        div.style.height = height + 'px';
        cart.appendChild(div);
        self.flyDiv = div;
        var flyFunc = function(i) {
            if (i > 0) {
                i--;
                var new_x = i * x / 100;
                var new_y = i * y / 100;
                self.flyDiv.style.top = new_y + 'px';
                self.flyDiv.style.left = new_x + 'px';
                self.flyDiv.style.width = 290 + 'px';
                self.flyDiv.style.height = 430 + 'px';
                var new_w = i * width / 100;
                var new_h = i * height / 100;
                self.flyDiv.style.width = new_w + 'px';
                self.flyDiv.style.height = new_h + 'px';
                img_clone.style.width = new_w + 'px';
                img_clone.style.height = new_h + 'px';
                setTimeout(flyFunc, 5, i);
            } else {
                self.flyDiv.remove();
                self.flyDiv = null;
            }
        }
        flyFunc(100);
    },
    updateWishlist: function() {
        var self = this;
        var success_func = function(wishlist_data) {
            AjaxKitMain.appendHtmlJsChilds($$('.col-main')[0], wishlist_data.wishlist_html, true);
            self.initAddToCartButtons();
        }
        AjaxKitMain.ajaxProcessor(self, 'get_wishlist_html', {}, success_func);
    },
    initQuickViewButtons: function() {
        var self = this;
        $$('.btn-ajaxkit-quick-view').each(function(el) {
            if (!el.hasClassName('AjaxKit-quick-view-link')) {
                el.addClassName('AjaxKit-quick-view-link');
                Event.observe(el, 'click', function(eve) {
                    if (!el.getAttribute('data-id')) {
                        return;
                    }
                    AjaxKitMain.addLoader(el)
                    var quick_view_container = this.up('.quick-view-container');
                    var quick_view_data_container = quick_view_container.select('.quick-view-data-container');
                    if (quick_view_data_container.length > 0) {
                        quick_view_data_container = quick_view_data_container[0];
                        var prodict_id = el.getAttribute('data-id');
                        var success_func = function(content) {
                            self.quickViewContentContainer.checkout = content.checkout;
                            self.quickViewContentContainer.html = content.popup_html;
                            self.quickViewContentContainer.el = quick_view_data_container;
                            self.quickViewContentContainer.view_container = quick_view_container;
                            self.quickViewContentContainer.prodict_id = prodict_id;
                            AjaxKitMain.loadJsCss(content, 'QuickViewLoader', self, 'initQuickViewJsLoaded');
                            AjaxKitMain.removeLoader(el)
                        }
                        AjaxKitMain.ajaxProcessor(self, 'get_quick_view_html', {
                            id: prodict_id
                        }, success_func);
                    }
                    AjaxKitMain.reinitSubmodules();
                });
            }
        });
    },
    showQuickView: function(quick_view_data_container) {
        quick_view_data_container.style.display = 'block';
    },
    hideQuickView: function() {
        $$('.quick-view-data-container').each(function(el) {
            el.innerHTML = '';
            el.style.display = 'none';
        });
    },
    initQuickViewJsLoaded: function(self) {
        if (self.quickViewContentContainer.el) {
            self.showQuickView(self.quickViewContentContainer.el);
            var popup = AjaxKitMain.addHtmlPopup(self.quickViewContentContainer.html, false, self.quickViewContentContainer.el);
            popup.select('.close-popup, .close-popup-overlay').each(function(el) {
                Event.observe(el, 'click', function(eve) {
                    self.hideQuickView();
                });
            });
            popup.select(self.config.add_to_cart_btn_selector).each(function(el) {
                el.setAttribute('onclick', 'data/product/' + self.quickViewContentContainer.prodict_id)
            });
            AjaxKitMain.reinitSubmodules();
        }
    }
}
AjaxKitMain.addSubmodule("general_add_to_cart", "GeneralAddToCart.init()", GeneralAddToCart);
GeneralAddToLinks = {
    config: {},
    submodule: 'add_to_links',
    init: function() {
        var self = this;
        AjaxKitMain.addSubmodules('GeneralAddToLinks', GeneralAddToLinks);
    },
    reInit: function() {
        if (parseInt(GeneralAddToLinks.config.enabled_add_to_compare)) {
            GeneralAddToLinks.initAddToCompareButtons();
        }
        if (parseInt(GeneralAddToLinks.config.enabled_add_to_wishlist)) {
            GeneralAddToLinks.initAddToWishlistButtons();
        }
    },
    initAddToWishlistButtons: function() {
        var self = this;
        $$('.link-wishlist').each(function(el) {
            var func = function(el) {
                GeneralAddToLinks.addToWishlistProcessor(el);
                return false;
            }
            AjaxKitMain.setSingltonClick(el, func);
            el.setAttribute('onclick', 'return false;');
        });
    },
    initAddToCompareButtons: function() {
        var self = this;
        $$('.link-compare').each(function(el) {
            var func = function(el) {
                GeneralAddToLinks.addToCompareProcessor(el);
                return false;
            }
            AjaxKitMain.setSingltonClick(el, func);
            el.setAttribute('onclick', 'return false;');
        });
    },
    addToCompareProcessor: function(el) {
        var self = this;
        AjaxKitMain.addLoader(el);
        var success_func = function(json) {
            if ('REDIRECT' == json.status) {
                window.location.href = json.redirect_to;
            }
            if (json.popup_html) {
                AjaxKitMain.addHtmlPopup(json.popup_html);
            }
            self.updateCompareList();
            AjaxKitMain.removeLoader(el);
        }
        var parameters = {
            url: el.href
        }
        AjaxKitMain.ajaxProcessor(this, 'add_to_compare', parameters, success_func)
    },
    updateCompareList: function() {
        var self = this;
        var success_func = function(json) {
            var sFunc = function(json) {
                self.updateCompareList();
                if (json.popup_html) {
                    AjaxKitMain.addHtmlPopup(json.popup_html);
                }
            }
            AjaxKitMain.resetSidebarBlocks('block-compare', json.compare_sidebar, sFunc, self);
            self.updateCompareListClearAll();
        }
        var parameters = {}
        AjaxKitMain.ajaxProcessor(this, 'update_compare_list', parameters, success_func)
    },
    updateCompareListClearAll: function() {
        var self = this;
        $$('a[href*=/catalog/product_compare/clear/]').each(function(el) {
            Event.observe(el, 'click', function(eve) {
                var data_onclick = ev(el.getAttribute('data-onclick'));
                if (typeof data_onclick == 'boolean' && data_onclick) {
                    var success_func = function(json) {
                        self.updateCompareList();
                        AjaxKitMain.removeLoader(el);
                    }
                    AjaxKitMain.ajaxProcessor(self, 'sidebar_product_compare_clear_all', {}, success_func);
                }
                return false;
            });
            el.setAttribute('data-onclick', el.getAttribute('onclick').replace('return', ''));
            el.setAttribute('onclick', 'return false;');
        });
    },
    addToWishlistProcessor: function(el, is_reload) {
        var self = this;
        AjaxKitMain.addLoader(el);
        var success_func = function(json) {
            var is_show_popup = true;
            if ('REDIRECT' == json.status) {
                if (!is_reload) {
                    if ("undefined" == typeof GeneralLogin) {
                        window.location.href = json.redirect_to;
                    } else {
                        GeneralLogin.loginClickAction(el, true);
                        is_show_popup = false;
                    }
                }
            }
            if ('RELOAD' == json.status) {
                window.location.reload();
            }
            if (json.popup_html && is_show_popup) {
                AjaxKitMain.addHtmlPopup(json.popup_html);
            }
            AjaxKitMain.removeLoader(el);
            self.updateWishlistList();
        }
        var attributes = {};
        if ($$('form#product_addtocart_form, #AddToCart-popup #ajaxkit-popup-content').length > 0) {
            $$('form#product_addtocart_form, #AddToCart-popup #ajaxkit-popup-content')[0].select('select, input, textarea')._each(function(attribute) {
                var field = attribute.name;
                attributes[field] = attribute.value;
            });
        }
        var parameters = {
            url: el.href,
            attributes: attributes
        };
        AjaxKitMain.ajaxProcessor(this, 'add_to_wishlist', parameters, success_func);
    },
    updateWishlistList: function() {
        var self = this;
        var success_func = function(json) {
            var sFunc = function(sfjson) {
                self.updateWishlistList();
                if (sfjson.popup_html) {
                    AjaxKitMain.addHtmlPopup(sfjson.popup_html);
                }
            }
            AjaxKitMain.resetSidebarBlocks('block-wishlist', json.wishlist_sidebar, sFunc, self);
            if (json.wishlist_header) {
                var header_top_link = $$(self.config.header_selector + ' a[href*=/wishlist/]');
                if (header_top_link.length) {
                    header_top_link[0].up('li').replace(json.wishlist_header);
                }
            }
        }
        var parameters = {}
        AjaxKitMain.ajaxProcessor(this, 'update_wishlist_list', parameters, success_func)
    }
}
AjaxKitMain.addSubmodule("general_add_to_links", "GeneralAddToLinks.init()", GeneralAddToLinks);
GeneralLogin = {
    config: {},
    submodule: 'login',
    login_html: false,
    login_selected_form: '',
    login_wishlist_el: false,
    init: function() {
        this.initLogin();
    },
    initLogin: function() {
        var self = this;
        $$('a[href*=/customer/account/login/]').each(function(el) {
            el.setAttribute('onclick', 'return false;');
            var success_func = function() {
                self.loginClickAction(el);
            }
            AjaxKitMain.setSingltonClick(el, success_func);
        });
        $$('a[href*=/customer/account/logout/]').each(function(el) {
            el.setAttribute('onclick', 'return false;')
            var success_func = function() {
                self.logoutClickAction(el);
            }
            AjaxKitMain.setSingltonClick(el, success_func);
        });
    },
    logoutClickAction: function(el) {
        var self = this;
        AjaxKitMain.addLoader(el);
        var success_func = function(json) {
            self.processingJson(json);
            AjaxKitMain.removeLoader(el);
        }
        AjaxKitMain.ajaxProcessor(GeneralLogin, 'logout', {
            pathname: window.location.pathname
        }, success_func)
    },
    loginClickAction: function(el, is_wishlist_el) {
        var self = this;
        if (!self.login_html) {
            AjaxKitMain.addLoader(el);
            var success_func = function(json) {
                self.login_html = json;
                if (is_wishlist_el) {
                    self.login_wishlist_el = el;
                }
                self.showLoginPopup(is_wishlist_el);
                AjaxKitMain.removeLoader(el);
            }
            AjaxKitMain.ajaxProcessor(GeneralLogin, 'get_login_popup', {
                pathname: window.location.pathname
            }, success_func)
        } else {
            self.showLoginPopup();
        }
    },
    showLoginPopup: function() {
        var self = this;
        AjaxKitMain.loadJsCss(self.login_html, 'LoginPopupLoader', self, 'initLoginPopupJsLoaded');
    },
    initLoginPopupJsLoaded: function() {
        var self = GeneralLogin;
        var form_forgot_password_html_div = document.createElement("div");
        form_forgot_password_html_div.id = 'form_forgot_password_html';
        form_forgot_password_html_div.addClassName('login-popup-tab');
        form_forgot_password_html_div.style.display = 'none';
        form_forgot_password_html_div.innerHTML = self.login_html.form_forgot_password_html;
        var form_login_html_div = document.createElement("div");
        form_login_html_div.id = 'form_login_html';
        form_login_html_div.addClassName('login-popup-tab');
        form_login_html_div.innerHTML = self.login_html.form_login_html;
        var form_register_html_div = document.createElement("div");
        form_register_html_div.id = 'form_register_html';
        form_register_html_div.addClassName('login-popup-tab');
        form_register_html_div.innerHTML = self.login_html.form_register_html;
        form_register_html_div.style.display = 'none';
        var login_buttons_div = document.createElement("div");
        login_buttons_div.id = 'login_buttons';
        login_buttons_div.innerHTML = self.login_html.login_buttons;
        GeneralLogin.login_selected_form = 'form_login_html';
        var div = document.createElement("div");
        div.id = 'AjaxKitMainLoginForms';
        div.appendChild(form_forgot_password_html_div);
        div.appendChild(form_login_html_div);
        div.appendChild(form_register_html_div);
        div.appendChild(login_buttons_div);
        var main_div = document.createElement("div");
        main_div.innerHTML = self.login_html.popup_html;
        main_div.select('#ajaxkit-popup-content')[0].appendChild(div);
        AjaxKitMain.addHtmlPopup(main_div.innerHTML);
        $$('.show_form').each(function(el) {
            Event.observe(el, 'click', function(eve) {
                self.showPopupTab(el);
            });
        });
        $$('.ajaxkit-login-submit-form').each(function(submit_form_btn) {
            Event.observe(submit_form_btn, 'click', function(eve) {
                self.submitForm(this);
            });
        });
    },
    showPopupTab: function(el) {
        var self = this;
        var id = el.getAttribute('data-form-name');
        if ($$('#' + id).length) {
            $$('.login-popup-tab').each(function(el_tab) {
                el_tab.style.display = 'none';
            });
            $(id).style.display = 'block';
        }
        GeneralLogin.login_selected_form = id;
        $$('.show_form').each(function(el_tab) {
            el_tab.style.display = 'block';
        });
        el.style.display = 'none';
    },
    submitForm: function(btn) {
        var self = this;
        var form_id = GeneralLogin.login_selected_form;
        var params = {};
        AjaxKitMain.addLoader(btn);
        params.form_id = form_id;
        params.form_values = {};
        if ($$('#AjaxKitMainLoginForms #' + form_id).length) {
            var is_valid = true
            $$('#AjaxKitMainLoginForms #' + form_id)[0].select('form').each(function(form_el) {
                var form_el_id = form_el.id;
                var form = new VarienForm(form_el_id);
                if (form.validator.validate()) {
                    form_el.select('input, select').each(function(el) {
                        if (undefined != el.name) {
                            if ('checkbox' == el.type) {
                                var value = el.checked ? 1 : 0;
                            } else {
                                var value = el.value;
                            }
                            params.form_values[el.name] = value;
                        }
                    });
                } else {
                    is_valid = false;
                }
            });
            if (is_valid) {
                var success_func = function(json) {
                    self.processingJson(json);
                    AjaxKitMain.removeLoader(btn);
                }
                AjaxKitMain.ajaxProcessor(self, 'processing_user_form', params, success_func);
            } else {
                AjaxKitMain.removeLoader(btn);
            }
        }
    },
    redirectAction: function(url) {
        if (url) {
            window.location.href = url;
        }
        AjaxKitMain.closePopup();
    },
    processingJson: function(json) {
        var self = this;
        if (json.message_error) {
            var html = '';
            if ($$('#AjaxKitMainLoginForms .messages').length) {
                for (i = 0; i < json.message_error.length; i++) {
                    html += '<div class="error-msg">' + json.message_error[i] + '</div>';
                }
            }
            $$('#AjaxKitMainLoginForms .messages').each(function(mel) {
                mel.innerHTML = html;
            });
        } else {
            if (json.popup_html) {
                var popup_bottom = json.popup_bottom ? json.popup_bottom : '';
                AjaxKitMain.addHtmlPopup(json.popup_html + popup_bottom);
            }
            if (json.welcome) {
                $$('.welcome-msg').each(function(welcome_msg_el) {
                    welcome_msg_el.innerHTML = json.welcome;
                });
            }
            if (json.login_header) {
                var header_top_links = $$(self.config.header_selector + ' a[href*=/customer/account/login/], ' + self.config.header_selector + ' a[href*=/customer/account/logout/]');
                if (header_top_links.length) {
                    header_top_links.each(function(link_el) {
                        var a = document.createElement("a");
                        a.title = json.login_header.title;
                        a.innerHTML = json.login_header.label;
                        a.href = json.login_header.url;
                        var parent = link_el.up(0);
                        link_el.remove();
                        parent.appendChild(a);
                    });
                }
                self.initLogin();
            }
            if (self.login_wishlist_el) {
                GeneralAddToLinks.addToWishlistProcessor(self.login_wishlist_el, true);
                self.login_wishlist_el = false;
            } else {
                if (json.redirect_to) {
                    self.redirectAction(json.redirect_to);
                } else {
                    if (json.reload) {
                        location.reload();
                    }
                }
            }
        }
    }
}
AjaxKitMain.addSubmodule("general_login", "GeneralLogin.init()", GeneralLogin);
GeneralToolbar = {
    config: {},
    submodule: 'toolbar',
    loc: window.href,
    historySinglton: false,
    infiniteScrollElement: null,
    infiniteScrollPages: null,
    init: function() {
        AjaxKitMain.addSubmodules('GeneralToolbar', GeneralToolbar);
    },
    reInit: function() {
        var self = this;
        GeneralToolbar.initToolbar();
        if (parseInt(self.config.enable_ajax_infinite_scroll)) {
            GeneralToolbar.initInfiniteScroll();
        }
        GeneralToolbar.onInit();
    },
    onInit: function() {},
    onLoadingStart: function() {},
    onLoadingFinish: function() {},
    onLoadingAutoScroll: function() {},
    onLoadingStaticScroll: function() {},
    onShowStaticScroll: function() {
        var button = document.createElement("button");
        button.setAttribute('type', 'button');
        button.id = 'StaticScrollBtn';
        button.addClassName('button');
        button.innerHTML = '<span><span>Show More Products</span></span>';
        this.infiniteScrollElement.appendChild(button);
    },
    initHistory: function() {
        var self = this;
        if (!self.historySinglton) {
            window.onpopstate = function(event) {
                if (event.state && event.state.ajaxPage) {
                    self.showContent(event.state.ajaxPage, false);
                }
            };
            self.historySinglton = true;
        }
    },
    initToolbar: function() {
        var self = this;
        var aHrefProcessor = function(el) {
            if (!el.getAttribute('data-href')) {
                el.setAttribute('data-href', el.getAttribute('href'));
                el.href = 'javascript:void(0);';
            }
            var func = function(eve) {
                $$('.main-container')[0].up(0).scrollIntoView();
                return self.loadPage(el.getAttribute('data-href'));
            };
            AjaxKitMain.setSingltonClick(el, func);
        }
        if (parseInt(self.config.enable_ajax_toolbar)) {
            $$('.toolbar select').each(function(el) {
                if (!el.hasClassName('AjaxKit-Singlton-Select')) {
                    el.addClassName('AjaxKit-Singlton-Select');
                    el.setAttribute('onchange', 'return GeneralToolbar.loadPage(this.value);');
                }
            });
            $$('.toolbar a').each(function(el) {
                aHrefProcessor(el)
            });
        }
        if (parseInt(self.config.enable_ajax_layered_navigation)) {
            $$('.block.block-layered-nav a').each(function(el) {
                aHrefProcessor(el)
            });
        }
    },
    loadPage: function(url) {
        var self = this;
        self.showContent(url, true);
        self.initHistory();
        return false;
    },
    showContent: function(url, useHistory, params, use_loader) {
        var self = this;
        if (useHistory) {
            self.infiniteScrollPages = null;
        }
        var success_func = function(json) {
            if (json.productsList) {
                var div = document.createElement("div");
                div.innerHTML = json.productsList
                var category_products_new = div.select('.category-products')
                var category_products_old = $$('.category-products')
                if (category_products_new.length && category_products_old.length) {
                    category_products_old[0].innerHTML = '';
                    AjaxKitMain.appendHtmlJsChilds(category_products_old[0], category_products_new[0].innerHTML, true);
                    var scripts = div.select('script');
                    scripts.each(function(el) {
                        if ((el.innerHTML.indexOf("ConfigurableMediaImages") != -1) && (el.innerHTML.match(new RegExp("ConfigurableMediaImages", 'g')).length > 2)) {
                            eval(el.innerHTML);
                            ProductMediaManager.init();
                        };
                        return false;
                    });
                    var div_nav = document.createElement("div");
                    div_nav.innerHTML = json.left_navigation
                    var left_navigation_new = div_nav.select('.block.block-layered-nav')
                    var left_navigation_old = $$('.block.block-layered-nav')
                    if (left_navigation_new.length && left_navigation_old.length) {
                        left_navigation_old[0].innerHTML = '';
                        AjaxKitMain.appendHtmlJsChilds(left_navigation_old[0], left_navigation_new[0].innerHTML, true);
                    }
                    AjaxKitMain.reinitSubmodules();
                    if (useHistory) {
                        history.pushState({
                            ajaxPage: self.loc
                        }, "", url);
                        self.loc = url;
                    }
                    try {
                        ConfigurableSwatchesList.init();
                    } catch (err) {}
                }
            }
            if ('undefined' == typeof use_loader || use_loader) {
                self.onLoadingFinish();
            }
        }
        if ('undefined' == typeof use_loader || use_loader) {
            self.onLoadingStart();
        }
        var post = ('undefined' == typeof params) ? {} : params;
        AjaxKitMain.ajaxProcessor(this, 'getProductListToolbar', post, success_func, true, url)
    },
    initInfiniteScroll: function() {
        var self = this;
        self.getInfiniteScrollPages();
        $$('.toolbar .limiter, .toolbar .pages, .toolbar-bottom').each(function(el) {
            el.style.display = 'none';
        });
        if ($$('.category-products').length && !$('AjaxKit-InfiniteScroll') && self.infiniteScrollPages) {
            self.infiniteScrollElement = document.createElement("div");
            self.infiniteScrollElement.id = 'AjaxKit-InfiniteScroll';
            var category_products = $$('.category-products')[0]
            if (category_products.select('.toolbar-bottom').length) {
                category_products.insertBefore(self.infiniteScrollElement, category_products.select('.toolbar-bottom')[0]);
            } else {
                category_products.appendChild(self.infiniteScrollElement);
            }
            if (self.infiniteScrollPages[0].is_autoscroll) {
                Event.observe(window, 'scroll', function() {
                    var document_dimensions = document.viewport.getDimensions();
                    var InfiniteScroll_dimensions = self.infiniteScrollElement.getBoundingClientRect();
                    if ((document_dimensions.height - InfiniteScroll_dimensions.bottom + parseInt(GeneralToolbar.config.infinite_scroll_buffer)) > 0) {
                        self.loadInfiniteScrollPage();
                    }
                });
            } else {
                Event.stopObserving(window, 'scroll');
                self.onShowStaticScroll();
                if ($('StaticScrollBtn')) {
                    Event.observe($('StaticScrollBtn'), 'click', function() {
                        self.loadInfiniteScrollPage();
                    });
                }
            }
        }
    },
    loadInfiniteScrollPage: function() {
        var self = this;
        if (self.infiniteScrollPages && !self.infiniteScrollElement.hasClassName('InfiniteScroll-loading')) {
            self.infiniteScrollElement.addClassName('InfiniteScroll-loading')
            var url_data = self.infiniteScrollPages[0];
            if (url_data.is_autoscroll) {
                self.onLoadingAutoScroll();
            } else {
                self.onLoadingStaticScroll();
            }
            self.infiniteScrollPages.splice(0, 1);
            if (self.infiniteScrollPages.length < 1) {
                self.infiniteScrollPages = false;
            }
            self.showContent(url_data.url, false, url_data.post, false);
        }
    },
    getInfiniteScrollPages: function() {
        var self = this;
        if (null === self.infiniteScrollPages) {
            if ($$('.toolbar .limiter select').length) {
                var url = $$('.toolbar .limiter select')[0].value;
                var lastPageNum = parseInt($$('.toolbar')[0].getAttribute('data-last-page-num'));
                if (lastPageNum > 1) {
                    self.infiniteScrollPages = [];
                    for (var i = 2; i <= lastPageNum; i++) {
                        var infiniteScrollUrl = {
                            url: url,
                            post: {
                                infinite_scroll: i
                            },
                            is_autoscroll: parseInt(GeneralToolbar.config.infinite_scroll_threshold) >= i
                        };
                        self.infiniteScrollPages.push(infiniteScrollUrl);
                    }
                } else {
                    self.infiniteScrollPages = false;
                }
            }
        }
    }
}
AjaxKitMain.addSubmodule("general_toolbar", "GeneralToolbar.init()", GeneralToolbar);

! function(a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
        if (!a.document) throw new Error("jQuery requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
    var c = [],
        d = c.slice,
        e = c.concat,
        f = c.push,
        g = c.indexOf,
        h = {},
        i = h.toString,
        j = h.hasOwnProperty,
        k = {},
        l = "1.11.2",
        m = function(a, b) {
            return new m.fn.init(a, b)
        },
        n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        o = /^-ms-/,
        p = /-([\da-z])/gi,
        q = function(a, b) {
            return b.toUpperCase()
        };
    m.fn = m.prototype = {
        jquery: l,
        constructor: m,
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this)
        },
        get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
        },
        pushStack: function(a) {
            var b = m.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b
        },
        each: function(a, b) {
            return m.each(this, a, b)
        },
        map: function(a) {
            return this.pushStack(m.map(this, function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(a) {
            var b = this.length,
                c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: f,
        sort: c.sort,
        splice: c.splice
    }, m.extend = m.fn.extend = function() {
        var a, b, c, d, e, f, g = arguments[0] || {},
            h = 1,
            i = arguments.length,
            j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || m.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
            if (null != (e = arguments[h]))
                for (d in e) a = g[d], c = e[d], g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1, f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {}, g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }, m.extend({
        expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(a) {
            throw new Error(a)
        },
        noop: function() {},
        isFunction: function(a) {
            return "function" === m.type(a)
        },
        isArray: Array.isArray || function(a) {
            return "array" === m.type(a)
        },
        isWindow: function(a) {
            return null != a && a == a.window
        },
        isNumeric: function(a) {
            return !m.isArray(a) && a - parseFloat(a) + 1 >= 0
        },
        isEmptyObject: function(a) {
            var b;
            for (b in a) return !1;
            return !0
        },
        isPlainObject: function(a) {
            var b;
            if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a)) return !1;
            try {
                if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) return !1
            } catch (c) {
                return !1
            }
            if (k.ownLast)
                for (b in a) return j.call(a, b);
            for (b in a);
            return void 0 === b || j.call(a, b)
        },
        type: function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
        },
        globalEval: function(b) {
            b && m.trim(b) && (a.execScript || function(b) {
                a.eval.call(a, b)
            })(b)
        },
        camelCase: function(a) {
            return a.replace(o, "ms-").replace(p, q)
        },
        nodeName: function(a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
        },
        each: function(a, b, c) {
            var d, e = 0,
                f = a.length,
                g = r(a);
            if (c) {
                if (g) {
                    for (; f > e; e++)
                        if (d = b.apply(a[e], c), d === !1) break
                } else
                    for (e in a)
                        if (d = b.apply(a[e], c), d === !1) break
            } else if (g) {
                for (; f > e; e++)
                    if (d = b.call(a[e], e, a[e]), d === !1) break
            } else
                for (e in a)
                    if (d = b.call(a[e], e, a[e]), d === !1) break; return a
        },
        trim: function(a) {
            return null == a ? "" : (a + "").replace(n, "")
        },
        makeArray: function(a, b) {
            var c = b || [];
            return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
        },
        inArray: function(a, b, c) {
            var d;
            if (b) {
                if (g) return g.call(b, a, c);
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                    if (c in b && b[c] === a) return c
            }
            return -1
        },
        merge: function(a, b) {
            var c = +b.length,
                d = 0,
                e = a.length;
            while (c > d) a[e++] = b[d++];
            if (c !== c)
                while (void 0 !== b[d]) a[e++] = b[d++];
            return a.length = e, a
        },
        grep: function(a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
            return e
        },
        map: function(a, b, c) {
            var d, f = 0,
                g = a.length,
                h = r(a),
                i = [];
            if (h)
                for (; g > f; f++) d = b(a[f], f, c), null != d && i.push(d);
            else
                for (f in a) d = b(a[f], f, c), null != d && i.push(d);
            return e.apply([], i)
        },
        guid: 1,
        proxy: function(a, b) {
            var c, e, f;
            return "string" == typeof b && (f = a[b], b = a, a = f), m.isFunction(a) ? (c = d.call(arguments, 2), e = function() {
                return a.apply(b || this, c.concat(d.call(arguments)))
            }, e.guid = a.guid = a.guid || m.guid++, e) : void 0
        },
        now: function() {
            return +new Date
        },
        support: k
    }), m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
        h["[object " + b + "]"] = b.toLowerCase()
    });

    function r(a) {
        var b = a.length,
            c = m.type(a);
        return "function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }
    var s = function(a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date,
            v = a.document,
            w = 0,
            x = 0,
            y = hb(),
            z = hb(),
            A = hb(),
            B = function(a, b) {
                return a === b && (l = !0), 0
            },
            C = 1 << 31,
            D = {}.hasOwnProperty,
            E = [],
            F = E.pop,
            G = E.push,
            H = E.push,
            I = E.slice,
            J = function(a, b) {
                for (var c = 0, d = a.length; d > c; c++)
                    if (a[c] === b) return c;
                return -1
            },
            K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            L = "[\\x20\\t\\r\\n\\f]",
            M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            N = M.replace("w", "w#"),
            O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]",
            P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)",
            Q = new RegExp(L + "+", "g"),
            R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g"),
            S = new RegExp("^" + L + "*," + L + "*"),
            T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"),
            U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"),
            V = new RegExp(P),
            W = new RegExp("^" + N + "$"),
            X = {
                ID: new RegExp("^#(" + M + ")"),
                CLASS: new RegExp("^\\.(" + M + ")"),
                TAG: new RegExp("^(" + M.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + O),
                PSEUDO: new RegExp("^" + P),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + K + ")$", "i"),
                needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i")
            },
            Y = /^(?:input|select|textarea|button)$/i,
            Z = /^h\d$/i,
            $ = /^[^{]+\{\s*\[native \w/,
            _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ab = /[+~]/,
            bb = /'|\\/g,
            cb = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)", "ig"),
            db = function(a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            },
            eb = function() {
                m()
            };
        try {
            H.apply(E = I.call(v.childNodes), v.childNodes), E[v.childNodes.length].nodeType
        } catch (fb) {
            H = {
                apply: E.length ? function(a, b) {
                    G.apply(a, I.call(b))
                } : function(a, b) {
                    var c = a.length,
                        d = 0;
                    while (a[c++] = b[d++]);
                    a.length = c - 1
                }
            }
        }

        function gb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], k = b.nodeType, "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k) return d;
            if (!e && p) {
                if (11 !== k && (f = _.exec(a)))
                    if (j = f[1]) {
                        if (9 === k) {
                            if (h = b.getElementById(j), !h || !h.parentNode) return d;
                            if (h.id === j) return d.push(h), d
                        } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) return d.push(h), d
                    } else {
                        if (f[2]) return H.apply(d, b.getElementsByTagName(a)), d;
                        if ((j = f[3]) && c.getElementsByClassName) return H.apply(d, b.getElementsByClassName(j)), d
                    }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u, w = b, x = 1 !== k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
                        while (l--) o[l] = s + rb(o[l]);
                        w = ab.test(a) && pb(b.parentNode) || b, x = o.join(",")
                    }
                    if (x) try {
                        return H.apply(d, w.querySelectorAll(x)), d
                    } catch (y) {} finally {
                        r || b.removeAttribute("id")
                    }
                }
            }
            return i(a.replace(R, "$1"), b, d, e)
        }

        function hb() {
            var a = [];

            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
            }
            return b
        }

        function ib(a) {
            return a[u] = !0, a
        }

        function jb(a) {
            var b = n.createElement("div");
            try {
                return !!a(b)
            } catch (c) {
                return !1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }

        function kb(a, b) {
            var c = a.split("|"),
                e = a.length;
            while (e--) d.attrHandle[c[e]] = b
        }

        function lb(a, b) {
            var c = b && a,
                d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);
            if (d) return d;
            if (c)
                while (c = c.nextSibling)
                    if (c === b) return -1;
            return a ? 1 : -1
        }

        function mb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a
            }
        }

        function nb(a) {
            return function(b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a
            }
        }

        function ob(a) {
            return ib(function(b) {
                return b = +b, ib(function(c, d) {
                    var e, f = a([], c.length, b),
                        g = f.length;
                    while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function pb(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }
        c = gb.support = {}, f = gb.isXML = function(a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1
        }, m = gb.setDocument = function(a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = g.documentElement, e = g.defaultView, e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", eb, !1) : e.attachEvent && e.attachEvent("onunload", eb)), p = !f(g), c.attributes = jb(function(a) {
                return a.className = "i", !a.getAttribute("className")
            }), c.getElementsByTagName = jb(function(a) {
                return a.appendChild(g.createComment("")), !a.getElementsByTagName("*").length
            }), c.getElementsByClassName = $.test(g.getElementsByClassName), c.getById = jb(function(a) {
                return o.appendChild(a).id = u, !g.getElementsByName || !g.getElementsByName(u).length
            }), c.getById ? (d.find.ID = function(a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }, d.filter.ID = function(a) {
                var b = a.replace(cb, db);
                return function(a) {
                    return a.getAttribute("id") === b
                }
            }) : (delete d.find.ID, d.filter.ID = function(a) {
                var b = a.replace(cb, db);
                return function(a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }), d.find.TAG = c.getElementsByTagName ? function(a, b) {
                return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            } : function(a, b) {
                var c, d = [],
                    e = 0,
                    f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++]) 1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }, d.find.CLASS = c.getElementsByClassName && function(a, b) {
                return p ? b.getElementsByClassName(a) : void 0
            }, r = [], q = [], (c.qsa = $.test(g.querySelectorAll)) && (jb(function(a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }), jb(function(a) {
                var b = g.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
            })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && jb(function(a) {
                c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", P)
            }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function(a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a,
                    d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function(a, b) {
                if (b)
                    while (b = b.parentNode)
                        if (b === a) return !0;
                return !1
            }, B = b ? function(a, b) {
                if (a === b) return l = !0, 0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1)
            } : function(a, b) {
                if (a === b) return l = !0, 0;
                var c, d = 0,
                    e = a.parentNode,
                    f = b.parentNode,
                    h = [a],
                    i = [b];
                if (!e || !f) return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;
                if (e === f) return lb(a, b);
                c = a;
                while (c = c.parentNode) h.unshift(c);
                c = b;
                while (c = c.parentNode) i.unshift(c);
                while (h[d] === i[d]) d++;
                return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
            }, g) : n
        }, gb.matches = function(a, b) {
            return gb(a, null, null, b)
        }, gb.matchesSelector = function(a, b) {
            if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) try {
                var d = s.call(a, b);
                if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
            } catch (e) {}
            return gb(b, n, null, [a]).length > 0
        }, gb.contains = function(a, b) {
            return (a.ownerDocument || a) !== n && m(a), t(a, b)
        }, gb.attr = function(a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()],
                f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }, gb.error = function(a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, gb.uniqueSort = function(a) {
            var b, d = [],
                e = 0,
                f = 0;
            if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                while (b = a[f++]) b === a[f] && (e = d.push(f));
                while (e--) a.splice(d[e], 1)
            }
            return k = null, a
        }, e = gb.getText = function(a) {
            var b, c = "",
                d = 0,
                f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent) return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
                } else if (3 === f || 4 === f) return a.nodeValue
            } else
                while (b = a[d++]) c += e(b);
            return c
        }, d = gb.selectors = {
            cacheLength: 50,
            createPseudo: ib,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(a) {
                    return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                },
                CHILD: function(a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || gb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && gb.error(a[0]), a
                },
                PSEUDO: function(a) {
                    var b, c = !a[6] && a[2];
                    return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                }
            },
            filter: {
                TAG: function(a) {
                    var b = a.replace(cb, db).toLowerCase();
                    return "*" === a ? function() {
                        return !0
                    } : function(a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b
                    }
                },
                CLASS: function(a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function(a) {
                        return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
                    })
                },
                ATTR: function(a, b, c) {
                    return function(d) {
                        var e = gb.attr(d, a);
                        return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                    }
                },
                CHILD: function(a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3),
                        g = "last" !== a.slice(-4),
                        h = "of-type" === b;
                    return 1 === d && 0 === e ? function(a) {
                        return !!a.parentNode
                    } : function(b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                            q = b.parentNode,
                            r = h && b.nodeName.toLowerCase(),
                            s = !i && !h;
                        if (q) {
                            if (f) {
                                while (p) {
                                    l = b;
                                    while (l = l[p])
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                    o = p = "only" === a && !o && "nextSibling"
                                }
                                return !0
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                                while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [w, n, m];
                                        break
                                    }
                            } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1];
                            else
                                while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                    if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) break; return m -= e, m === d || m % d === 0 && m / d >= 0
                        }
                    }
                },
                PSEUDO: function(a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || gb.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ib(function(a, c) {
                        var d, f = e(a, b),
                            g = f.length;
                        while (g--) d = J(a, f[g]), a[d] = !(c[d] = f[g])
                    }) : function(a) {
                        return e(a, 0, c)
                    }) : e
                }
            },
            pseudos: {
                not: ib(function(a) {
                    var b = [],
                        c = [],
                        d = h(a.replace(R, "$1"));
                    return d[u] ? ib(function(a, b, c, e) {
                        var f, g = d(a, null, e, []),
                            h = a.length;
                        while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
                    }) : function(a, e, f) {
                        return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop()
                    }
                }),
                has: ib(function(a) {
                    return function(b) {
                        return gb(a, b).length > 0
                    }
                }),
                contains: ib(function(a) {
                    return a = a.replace(cb, db),
                        function(b) {
                            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                        }
                }),
                lang: ib(function(a) {
                    return W.test(a || "") || gb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(),
                        function(b) {
                            var c;
                            do
                                if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                            while ((b = b.parentNode) && 1 === b.nodeType);
                            return !1
                        }
                }),
                target: function(b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id
                },
                root: function(a) {
                    return a === o
                },
                focus: function(a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                },
                enabled: function(a) {
                    return a.disabled === !1
                },
                disabled: function(a) {
                    return a.disabled === !0
                },
                checked: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected
                },
                selected: function(a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                },
                empty: function(a) {
                    for (a = a.firstChild; a; a = a.nextSibling)
                        if (a.nodeType < 6) return !1;
                    return !0
                },
                parent: function(a) {
                    return !d.pseudos.empty(a)
                },
                header: function(a) {
                    return Z.test(a.nodeName)
                },
                input: function(a) {
                    return Y.test(a.nodeName)
                },
                button: function(a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b
                },
                text: function(a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                },
                first: ob(function() {
                    return [0]
                }),
                last: ob(function(a, b) {
                    return [b - 1]
                }),
                eq: ob(function(a, b, c) {
                    return [0 > c ? c + b : c]
                }),
                even: ob(function(a, b) {
                    for (var c = 0; b > c; c += 2) a.push(c);
                    return a
                }),
                odd: ob(function(a, b) {
                    for (var c = 1; b > c; c += 2) a.push(c);
                    return a
                }),
                lt: ob(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                    return a
                }),
                gt: ob(function(a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                    return a
                })
            }
        }, d.pseudos.nth = d.pseudos.eq;
        for (b in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) d.pseudos[b] = mb(b);
        for (b in {
                submit: !0,
                reset: !0
            }) d.pseudos[b] = nb(b);

        function qb() {}
        qb.prototype = d.filters = d.pseudos, d.setFilters = new qb, g = gb.tokenize = function(a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k) return b ? 0 : k.slice(0);
            h = a, i = [], j = d.preFilter;
            while (h) {
                (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({
                    value: c,
                    type: e[0].replace(R, " ")
                }), h = h.slice(c.length));
                for (g in d.filter) !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                    value: c,
                    type: g,
                    matches: e
                }), h = h.slice(c.length));
                if (!c) break
            }
            return b ? h.length : h ? gb.error(a) : z(a, i).slice(0)
        };

        function rb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
            return d
        }

        function sb(a, b, c) {
            var d = b.dir,
                e = c && "parentNode" === d,
                f = x++;
            return b.first ? function(b, c, f) {
                while (b = b[d])
                    if (1 === b.nodeType || e) return a(b, c, f)
            } : function(b, c, g) {
                var h, i, j = [w, f];
                if (g) {
                    while (b = b[d])
                        if ((1 === b.nodeType || e) && a(b, c, g)) return !0
                } else
                    while (b = b[d])
                        if (1 === b.nodeType || e) {
                            if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) return j[2] = h[2];
                            if (i[d] = j, j[2] = a(b, c, g)) return !0
                        }
            }
        }

        function tb(a) {
            return a.length > 1 ? function(b, c, d) {
                var e = a.length;
                while (e--)
                    if (!a[e](b, c, d)) return !1;
                return !0
            } : a[0]
        }

        function ub(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++) gb(a, b[d], c);
            return c
        }

        function vb(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
            return g
        }

        function wb(a, b, c, d, e, f) {
            return d && !d[u] && (d = wb(d)), e && !e[u] && (e = wb(e, f)), ib(function(f, g, h, i) {
                var j, k, l, m = [],
                    n = [],
                    o = g.length,
                    p = f || ub(b || "*", h.nodeType ? [h] : h, []),
                    q = !a || !f && b ? p : vb(p, m, a, h, i),
                    r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) {
                    j = vb(r, n), d(j, [], h, i), k = j.length;
                    while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [], k = r.length;
                            while (k--)(l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--)(l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                    }
                } else r = vb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : H.apply(g, r)
            })
        }

        function xb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sb(function(a) {
                    return a === b
                }, h, !0), l = sb(function(a) {
                    return J(b, a) > -1
                }, h, !0), m = [function(a, c, d) {
                    var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                    return b = null, e
                }]; f > i; i++)
                if (c = d.relative[a[i].type]) m = [sb(tb(m), c)];
                else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                        for (e = ++i; f > e; e++)
                            if (d.relative[a[e].type]) break;
                        return wb(i > 1 && tb(m), i > 1 && rb(a.slice(0, i - 1).concat({
                            value: " " === a[i - 2].type ? "*" : ""
                        })).replace(R, "$1"), c, e > i && xb(a.slice(i, e)), f > e && xb(a = a.slice(e)), f > e && rb(a))
                    }
                    m.push(c)
                }
            return tb(m)
        }

        function yb(a, b) {
            var c = b.length > 0,
                e = a.length > 0,
                f = function(f, g, h, i, k) {
                    var l, m, o, p = 0,
                        q = "0",
                        r = f && [],
                        s = [],
                        t = j,
                        u = f || e && d.find.TAG("*", k),
                        v = w += null == t ? 1 : Math.random() || .1,
                        x = u.length;
                    for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                        if (e && l) {
                            m = 0;
                            while (o = a[m++])
                                if (o(l, g, h)) {
                                    i.push(l);
                                    break
                                }
                            k && (w = v)
                        }
                        c && ((l = !o && l) && p--, f && r.push(l))
                    }
                    if (p += q, c && q !== p) {
                        m = 0;
                        while (o = b[m++]) o(r, s, g, h);
                        if (f) {
                            if (p > 0)
                                while (q--) r[q] || s[q] || (s[q] = F.call(i));
                            s = vb(s)
                        }
                        H.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i)
                    }
                    return k && (w = v, j = t), r
                };
            return c ? ib(f) : f
        }
        return h = gb.compile = function(a, b) {
            var c, d = [],
                e = [],
                f = A[a + " "];
            if (!f) {
                b || (b = g(a)), c = b.length;
                while (c--) f = xb(b[c]), f[u] ? d.push(f) : e.push(f);
                f = A(a, yb(e, d)), f.selector = a
            }
            return f
        }, i = gb.select = function(a, b, e, f) {
            var i, j, k, l, m, n = "function" == typeof a && a,
                o = !f && g(a = n.selector || a);
            if (e = e || [], 1 === o.length) {
                if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                    if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) return e;
                    n && (b = b.parentNode), a = a.slice(j.shift().value.length)
                }
                i = X.needsContext.test(a) ? 0 : j.length;
                while (i--) {
                    if (k = j[i], d.relative[l = k.type]) break;
                    if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && pb(b.parentNode) || b))) {
                        if (j.splice(i, 1), a = f.length && rb(j), !a) return H.apply(e, f), e;
                        break
                    }
                }
            }
            return (n || h(a, o))(f, b, !p, e, ab.test(a) && pb(b.parentNode) || b), e
        }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = jb(function(a) {
            return 1 & a.compareDocumentPosition(n.createElement("div"))
        }), jb(function(a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || kb("type|href|height|width", function(a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), c.attributes && jb(function(a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || kb("value", function(a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }), jb(function(a) {
            return null == a.getAttribute("disabled")
        }) || kb(K, function(a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), gb
    }(a);
    m.find = s, m.expr = s.selectors, m.expr[":"] = m.expr.pseudos, m.unique = s.uniqueSort, m.text = s.getText, m.isXMLDoc = s.isXML, m.contains = s.contains;
    var t = m.expr.match.needsContext,
        u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        v = /^.[^:#\[\.,]*$/;

    function w(a, b, c) {
        if (m.isFunction(b)) return m.grep(a, function(a, d) {
            return !!b.call(a, d, a) !== c
        });
        if (b.nodeType) return m.grep(a, function(a) {
            return a === b !== c
        });
        if ("string" == typeof b) {
            if (v.test(b)) return m.filter(b, a, c);
            b = m.filter(b, a)
        }
        return m.grep(a, function(a) {
            return m.inArray(a, b) >= 0 !== c
        })
    }
    m.filter = function(a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function(a) {
            return 1 === a.nodeType
        }))
    }, m.fn.extend({
        find: function(a) {
            var b, c = [],
                d = this,
                e = d.length;
            if ("string" != typeof a) return this.pushStack(m(a).filter(function() {
                for (b = 0; e > b; b++)
                    if (m.contains(d[b], this)) return !0
            }));
            for (b = 0; e > b; b++) m.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? m.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },
        filter: function(a) {
            return this.pushStack(w(this, a || [], !1))
        },
        not: function(a) {
            return this.pushStack(w(this, a || [], !0))
        },
        is: function(a) {
            return !!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length
        }
    });
    var x, y = a.document,
        z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        A = m.fn.init = function(a, b) {
            var c, d;
            if (!a) return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof m ? b[0] : b, m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)), u.test(c[1]) && m.isPlainObject(b))
                        for (c in b) m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = y.getElementById(c[2]), d && d.parentNode) {
                    if (d.id !== c[2]) return x.find(a);
                    this.length = 1, this[0] = d
                }
                return this.context = y, this.selector = a, this
            }
            return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), m.makeArray(a, this))
        };
    A.prototype = m.fn, x = m(y);
    var B = /^(?:parents|prev(?:Until|All))/,
        C = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    m.extend({
        dir: function(a, b, c) {
            var d = [],
                e = a[b];
            while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c))) 1 === e.nodeType && d.push(e), e = e[b];
            return d
        },
        sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
            return c
        }
    }), m.fn.extend({
        has: function(a) {
            var b, c = m(a, this),
                d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++)
                    if (m.contains(this, c[b])) return !0
            })
        },
        closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? m.unique(f) : f)
        },
        index: function(a) {
            return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(a, b) {
            return this.pushStack(m.unique(m.merge(this.get(), m(a, b))))
        },
        addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }
    });

    function D(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a
    }
    m.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },
        parents: function(a) {
            return m.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return m.dir(a, "parentNode", c)
        },
        next: function(a) {
            return D(a, "nextSibling")
        },
        prev: function(a) {
            return D(a, "previousSibling")
        },
        nextAll: function(a) {
            return m.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return m.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return m.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return m.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return m.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return m.sibling(a.firstChild)
        },
        contents: function(a) {
            return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes)
        }
    }, function(a, b) {
        m.fn[a] = function(c, d) {
            var e = m.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = m.filter(d, e)), this.length > 1 && (C[a] || (e = m.unique(e)), B.test(a) && (e = e.reverse())), this.pushStack(e)
        }
    });
    var E = /\S+/g,
        F = {};

    function G(a) {
        var b = F[a] = {};
        return m.each(a.match(E) || [], function(a, c) {
            b[c] = !0
        }), b
    }
    m.Callbacks = function(a) {
        a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
        var b, c, d, e, f, g, h = [],
            i = !a.once && [],
            j = function(l) {
                for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)
                    if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                        c = !1;
                        break
                    }
                b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
            },
            k = {
                add: function() {
                    if (h) {
                        var d = h.length;
                        ! function f(b) {
                            m.each(b, function(b, c) {
                                var d = m.type(c);
                                "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                            })
                        }(arguments), b ? e = h.length : c && (g = d, j(c))
                    }
                    return this
                },
                remove: function() {
                    return h && m.each(arguments, function(a, c) {
                        var d;
                        while ((d = m.inArray(c, h, d)) > -1) h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
                    }), this
                },
                has: function(a) {
                    return a ? m.inArray(a, h) > -1 : !(!h || !h.length)
                },
                empty: function() {
                    return h = [], e = 0, this
                },
                disable: function() {
                    return h = i = c = void 0, this
                },
                disabled: function() {
                    return !h
                },
                lock: function() {
                    return i = void 0, c || k.disable(), this
                },
                locked: function() {
                    return !i
                },
                fireWith: function(a, c) {
                    return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this
                },
                fire: function() {
                    return k.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!d
                }
            };
        return k
    }, m.extend({
        Deferred: function(a) {
            var b = [
                    ["resolve", "done", m.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", m.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", m.Callbacks("memory")]
                ],
                c = "pending",
                d = {
                    state: function() {
                        return c
                    },
                    always: function() {
                        return e.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var a = arguments;
                        return m.Deferred(function(c) {
                            m.each(b, function(b, f) {
                                var g = m.isFunction(a[b]) && a[b];
                                e[f[1]](function() {
                                    var a = g && g.apply(this, arguments);
                                    a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                })
                            }), a = null
                        }).promise()
                    },
                    promise: function(a) {
                        return null != a ? m.extend(a, d) : d
                    }
                },
                e = {};
            return d.pipe = d.then, m.each(b, function(a, f) {
                var g = f[2],
                    h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },
        when: function(a) {
            var b = 0,
                c = d.call(arguments),
                e = c.length,
                f = 1 !== e || a && m.isFunction(a.promise) ? e : 0,
                g = 1 === f ? a : m.Deferred(),
                h = function(a, b, c) {
                    return function(e) {
                        b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                    }
                },
                i, j, k;
            if (e > 1)
                for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
            return f || g.resolveWith(k, c), g.promise()
        }
    });
    var H;
    m.fn.ready = function(a) {
        return m.ready.promise().done(a), this
    }, m.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(a) {
            a ? m.readyWait++ : m.ready(!0)
        },
        ready: function(a) {
            if (a === !0 ? !--m.readyWait : !m.isReady) {
                if (!y.body) return setTimeout(m.ready);
                m.isReady = !0, a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]), m.fn.triggerHandler && (m(y).triggerHandler("ready"), m(y).off("ready")))
            }
        }
    });

    function I() {
        y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1), a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J), a.detachEvent("onload", J))
    }

    function J() {
        (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(), m.ready())
    }
    m.ready.promise = function(b) {
        if (!H)
            if (H = m.Deferred(), "complete" === y.readyState) setTimeout(m.ready);
            else if (y.addEventListener) y.addEventListener("DOMContentLoaded", J, !1), a.addEventListener("load", J, !1);
        else {
            y.attachEvent("onreadystatechange", J), a.attachEvent("onload", J);
            var c = !1;
            try {
                c = null == a.frameElement && y.documentElement
            } catch (d) {}
            c && c.doScroll && ! function e() {
                if (!m.isReady) {
                    try {
                        c.doScroll("left")
                    } catch (a) {
                        return setTimeout(e, 50)
                    }
                    I(), m.ready()
                }
            }()
        }
        return H.promise(b)
    };
    var K = "undefined",
        L;
    for (L in m(k)) break;
    k.ownLast = "0" !== L, k.inlineBlockNeedsLayout = !1, m(function() {
            var a, b, c, d;
            c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
        }),
        function() {
            var a = y.createElement("div");
            if (null == k.deleteExpando) {
                k.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    k.deleteExpando = !1
                }
            }
            a = null
        }(), m.acceptData = function(a) {
            var b = m.noData[(a.nodeName + " ").toLowerCase()],
                c = +a.nodeType || 1;
            return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
        };
    var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        N = /([A-Z])/g;

    function O(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(N, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c
                } catch (e) {}
                m.data(a, b, c)
            } else c = void 0
        }
        return c
    }

    function P(a) {
        var b;
        for (b in a)
            if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
        return !0
    }

    function Q(a, b, d, e) {
        if (m.acceptData(a)) {
            var f, g, h = m.expando,
                i = a.nodeType,
                j = i ? m.cache : a,
                k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) return k || (k = i ? a[h] = c.pop() || m.guid++ : h), j[k] || (j[k] = i ? {} : {
                toJSON: m.noop
            }), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[m.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[m.camelCase(b)])) : f = g, f
        }
    }

    function R(a, b, c) {
        if (m.acceptData(a)) {
            var d, e, f = a.nodeType,
                g = f ? m.cache : a,
                h = f ? a[m.expando] : m.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                    while (e--) delete d[b[e]];
                    if (c ? !P(d) : !m.isEmptyObject(d)) return
                }(c || (delete g[h].data, P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }
    m.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(a) {
            return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando], !!a && !P(a)
        },
        data: function(a, b, c) {
            return Q(a, b, c)
        },
        removeData: function(a, b) {
            return R(a, b)
        },
        _data: function(a, b, c) {
            return Q(a, b, c, !0)
        },
        _removeData: function(a, b) {
            return R(a, b, !0)
        }
    }), m.fn.extend({
        data: function(a, b) {
            var c, d, e, f = this[0],
                g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = m.data(f), 1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                    c = g.length;
                    while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)), O(f, d, e[d])));
                    m._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                m.data(this, a)
            }) : arguments.length > 1 ? this.each(function() {
                m.data(this, a, b)
            }) : f ? O(f, a, m.data(f, a)) : void 0
        },
        removeData: function(a) {
            return this.each(function() {
                m.removeData(this, a)
            })
        }
    }), m.extend({
        queue: function(a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = m._data(a, b), c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)), d || []) : void 0
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = m.queue(a, b),
                d = c.length,
                e = c.shift(),
                f = m._queueHooks(a, b),
                g = function() {
                    m.dequeue(a, b)
                };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
        },
        _queueHooks: function(a, b) {
            var c = b + "queueHooks";
            return m._data(a, c) || m._data(a, c, {
                empty: m.Callbacks("once memory").add(function() {
                    m._removeData(a, b + "queue"), m._removeData(a, c)
                })
            })
        }
    }), m.fn.extend({
        queue: function(a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                var c = m.queue(this, a, b);
                m._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                m.dequeue(this, a)
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, b) {
            var c, d = 1,
                e = m.Deferred(),
                f = this,
                g = this.length,
                h = function() {
                    --d || e.resolveWith(f, [f])
                };
            "string" != typeof a && (b = a, a = void 0), a = a || "fx";
            while (g--) c = m._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
            return h(), e.promise(b)
        }
    });
    var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        T = ["Top", "Right", "Bottom", "Left"],
        U = function(a, b) {
            return a = b || a, "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a)
        },
        V = m.access = function(a, b, c, d, e, f, g) {
            var h = 0,
                i = a.length,
                j = null == c;
            if ("object" === m.type(c)) {
                e = !0;
                for (h in c) m.access(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, m.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                    return j.call(m(a), c)
                })), b))
                for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        },
        W = /^(?:checkbox|radio)$/i;
    ! function() {
        var a = y.createElement("input"),
            b = y.createElement("div"),
            c = y.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", k.leadingWhitespace = 3 === b.firstChild.nodeType, k.tbody = !b.getElementsByTagName("tbody").length, k.htmlSerialize = !!b.getElementsByTagName("link").length, k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), k.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, k.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
                k.noCloneEvent = !1
            }), b.cloneNode(!0).click()), null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete b.test
            } catch (d) {
                k.deleteExpando = !1
            }
        }
    }(),
    function() {
        var b, c, d = y.createElement("div");
        for (b in {
                submit: !0,
                change: !0,
                focusin: !0
            }) c = "on" + b, (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), k[b + "Bubbles"] = d.attributes[c].expando === !1);
        d = null
    }();
    var X = /^(?:input|select|textarea)$/i,
        Y = /^key/,
        Z = /^(?:mouse|pointer|contextmenu)|click/,
        $ = /^(?:focusinfocus|focusoutblur)$/,
        _ = /^([^.]*)(?:\.(.+)|)$/;

    function ab() {
        return !0
    }

    function bb() {
        return !1
    }

    function cb() {
        try {
            return y.activeElement
        } catch (a) {}
    }
    m.event = {
        global: {},
        add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
            if (r) {
                c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = m.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function(a) {
                    return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments)
                }, k.elem = a), b = (b || "").match(E) || [""], h = b.length;
                while (h--) f = _.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = m.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = m.event.special[o] || {}, l = m.extend({
                    type: o,
                    origType: q,
                    data: d,
                    handler: c,
                    guid: c.guid,
                    selector: e,
                    needsContext: e && m.expr.match.needsContext.test(e),
                    namespace: p.join(".")
                }, i), (n = g[o]) || (n = g[o] = [], n.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? n.splice(n.delegateCount++, 0, l) : n.push(l), m.event.global[o] = !0);
                a = null
            }
        },
        remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
            if (r && (k = r.events)) {
                b = (b || "").match(E) || [""], j = b.length;
                while (j--)
                    if (h = _.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                        l = m.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, n = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = n.length;
                        while (f--) g = n[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1), g.selector && n.delegateCount--, l.remove && l.remove.call(a, g));
                        i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle), delete k[o])
                    } else
                        for (o in k) m.event.remove(a, o + b[j], c, d, !0);
                m.isEmptyObject(k) && (delete r.handle, m._removeData(a, "events"))
            }
        },
        trigger: function(b, c, d, e) {
            var f, g, h, i, k, l, n, o = [d || y],
                p = j.call(b, "type") ? b.type : b,
                q = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = l = d = d || y, 3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[m.expando] ? b : new m.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : m.makeArray(c, [b]), k = m.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                if (!e && !k.noBubble && !m.isWindow(d)) {
                    for (i = k.delegateType || p, $.test(i + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), l = h;
                    l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a)
                }
                n = 0;
                while ((h = o[n++]) && !b.isPropagationStopped()) b.type = n > 1 ? i : k.bindType || p, f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                    l = d[g], l && (d[g] = null), m.event.triggered = p;
                    try {
                        d[p]()
                    } catch (r) {}
                    m.event.triggered = void 0, l && (d[g] = l)
                }
                return b.result
            }
        },
        dispatch: function(a) {
            a = m.event.fix(a);
            var b, c, e, f, g, h = [],
                i = d.call(arguments),
                j = (m._data(this, "events") || {})[a.type] || [],
                k = m.event.special[a.type] || {};
            if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = m.event.handlers.call(this, a, j), b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem, g = 0;
                    while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
                }
                return k.postDispatch && k.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(a, b) {
            var c, d, e, f, g = [],
                h = b.delegateCount,
                i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length), e[c] && e.push(d);
                        e.length && g.push({
                            elem: i,
                            handlers: e
                        })
                    }
            return h < b.length && g.push({
                elem: this,
                handlers: b.slice(h)
            }), g
        },
        fix: function(a) {
            if (a[m.expando]) return a;
            var b, c, d, e = a.type,
                f = a,
                g = this.fixHooks[e];
            g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new m.Event(f), b = d.length;
            while (b--) c = d[b], a[c] = f[c];
            return a.target || (a.target = f.srcElement || y), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(a, b) {
                var c, d, e, f = b.button,
                    g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== cb() && this.focus) try {
                        return this.focus(), !1
                    } catch (a) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === cb() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(a) {
                    return m.nodeName(a.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                }
            }
        },
        simulate: function(a, b, c, d) {
            var e = m.extend(new m.Event, c, {
                type: a,
                isSimulated: !0,
                originalEvent: {}
            });
            d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }
    }, m.removeEvent = y.removeEventListener ? function(a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function(a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === K && (a[d] = null), a.detachEvent(d, c))
    }, m.Event = function(a, b) {
        return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a, b && m.extend(this, b), this.timeStamp = a && a.timeStamp || m.now(), void(this[m.expando] = !0)) : new m.Event(a, b)
    }, m.Event.prototype = {
        isDefaultPrevented: bb,
        isPropagationStopped: bb,
        isImmediatePropagationStopped: bb,
        preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = ab, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },
        stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = ab, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = ab, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
        }
    }, m.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(a, b) {
        m.event.special[a] = {
            delegateType: b,
            bindType: b,
            handle: function(a) {
                var c, d = this,
                    e = a.relatedTarget,
                    f = a.handleObj;
                return (!e || e !== d && !m.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }
        }
    }), k.submitBubbles || (m.event.special.submit = {
        setup: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target,
                    c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
                c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }), m._data(c, "submitBubbles", !0))
            })
        },
        postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0))
        },
        teardown: function() {
            return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit")
        }
    }), k.changeBubbles || (m.event.special.change = {
        setup: function() {
            return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), m.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), m.event.simulate("change", this, a, !0)
            })), !1) : void m.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0)
                }), m._data(b, "changeBubbles", !0))
            })
        },
        handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return m.event.remove(this, "._change"), !X.test(this.nodeName)
        }
    }), k.focusinBubbles || m.each({
        focus: "focusin",
        blur: "focusout"
    }, function(a, b) {
        var c = function(a) {
            m.event.simulate(b, a.target, m.event.fix(a), !0)
        };
        m.event.special[b] = {
            setup: function() {
                var d = this.ownerDocument || this,
                    e = m._data(d, b);
                e || d.addEventListener(a, c, !0), m._data(d, b, (e || 0) + 1)
            },
            teardown: function() {
                var d = this.ownerDocument || this,
                    e = m._data(d, b) - 1;
                e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0), m._removeData(d, b))
            }
        }
    }), m.fn.extend({
        on: function(a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a) this.on(f, b, c, a[f], e);
                return this
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = bb;
            else if (!d) return this;
            return 1 === e && (g = d, d = function(a) {
                return m().off(a), g.apply(this, arguments)
            }, d.guid = g.guid || (g.guid = m.guid++)), this.each(function() {
                m.event.add(this, a, d, c, b)
            })
        },
        one: function(a, b, c, d) {
            return this.on(a, b, c, d, 1)
        },
        off: function(a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) return d = a.handleObj, m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
            if ("object" == typeof a) {
                for (e in a) this.off(e, b, a[e]);
                return this
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = bb), this.each(function() {
                m.event.remove(this, a, c, b)
            })
        },
        trigger: function(a, b) {
            return this.each(function() {
                m.event.trigger(a, b, this)
            })
        },
        triggerHandler: function(a, b) {
            var c = this[0];
            return c ? m.event.trigger(a, b, c, !0) : void 0
        }
    });

    function db(a) {
        var b = eb.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length) c.createElement(b.pop());
        return c
    }
    var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        fb = / jQuery\d+="(?:null|\d+)"/g,
        gb = new RegExp("<(?:" + eb + ")[\\s/>]", "i"),
        hb = /^\s+/,
        ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        jb = /<([\w:]+)/,
        kb = /<tbody/i,
        lb = /<|&#?\w+;/,
        mb = /<(?:script|style|link)/i,
        nb = /checked\s*(?:[^=]|=\s*.checked.)/i,
        ob = /^$|\/(?:java|ecma)script/i,
        pb = /^true\/(.*)/,
        qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        rb = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        sb = db(y),
        tb = sb.appendChild(y.createElement("div"));
    rb.optgroup = rb.option, rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead, rb.th = rb.td;

    function ub(a, b) {
        var c, d, e = 0,
            f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
        if (!f)
            for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
        return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f
    }

    function vb(a) {
        W.test(a.type) && (a.defaultChecked = a.checked)
    }

    function wb(a, b) {
        return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function xb(a) {
        return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type, a
    }

    function yb(a) {
        var b = pb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function zb(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++) m._data(c, "globalEval", !b || m._data(b[d], "globalEval"))
    }

    function Ab(a, b) {
        if (1 === b.nodeType && m.hasData(a)) {
            var c, d, e, f = m._data(a),
                g = m._data(b, f),
                h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)
                    for (d = 0, e = h[c].length; e > d; d++) m.event.add(b, c, h[c][d])
            }
            g.data && (g.data = m.extend({}, g.data))
        }
    }

    function Bb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !k.noCloneEvent && b[m.expando]) {
                e = m._data(b);
                for (d in e.events) m.removeEvent(b, d, e.handle);
                b.removeAttribute(m.expando)
            }
            "script" === c && b.text !== a.text ? (xb(b).text = a.text, yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }
    m.extend({
        clone: function(a, b, c) {
            var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
            if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML, tb.removeChild(f = tb.firstChild)), !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a)))
                for (d = ub(f), h = ub(a), g = 0; null != (e = h[g]); ++g) d[g] && Bb(e, d[g]);
            if (b)
                if (c)
                    for (h = h || ub(a), d = d || ub(f), g = 0; null != (e = h[g]); g++) Ab(e, d[g]);
                else Ab(a, f);
            return d = ub(f, "script"), d.length > 0 && zb(d, !i && ub(a, "script")), d = h = e = null, f
        },
        buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++)
                if (f = a[q], f || 0 === f)
                    if ("object" === m.type(f)) m.merge(p, f.nodeType ? [f] : f);
                    else if (lb.test(f)) {
                h = h || o.appendChild(b.createElement("div")), i = (jb.exec(f) || ["", ""])[1].toLowerCase(), l = rb[i] || rb._default, h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2], e = l[0];
                while (e--) h = h.lastChild;
                if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])), !k.tbody) {
                    f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                    while (e--) m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
                }
                m.merge(p, h.childNodes), h.textContent = "";
                while (h.firstChild) h.removeChild(h.firstChild);
                h = o.lastChild
            } else p.push(b.createTextNode(f));
            h && o.removeChild(h), k.appendChecked || m.grep(ub(p, "input"), vb), q = 0;
            while (f = p[q++])
                if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f), h = ub(o.appendChild(f), "script"), g && zb(h), c)) {
                    e = 0;
                    while (f = h[e++]) ob.test(f.type || "") && c.push(f)
                }
            return h = null, o
        },
        cleanData: function(a, b) {
            for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++)
                if ((b || m.acceptData(d)) && (f = d[i], g = f && j[f])) {
                    if (g.events)
                        for (e in g.events) n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
                    j[f] && (delete j[f], l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null, c.push(f))
                }
        }
    }), m.fn.extend({
        text: function(a) {
            return V(this, function(a) {
                return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a))
            }, null, a, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = wb(this, a);
                    b.appendChild(a)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = wb(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },
        remove: function(a, b) {
            for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || m.cleanData(ub(c)), c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")), c.parentNode.removeChild(c));
            return this
        },
        empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                1 === a.nodeType && m.cleanData(ub(a, !1));
                while (a.firstChild) a.removeChild(a.firstChild);
                a.options && m.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },
        clone: function(a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                return m.clone(this, a, b)
            })
        },
        html: function(a) {
            return V(this, function(a) {
                var b = this[0] || {},
                    c = 0,
                    d = this.length;
                if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0;
                if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(ib, "<$1></$2>");
                    try {
                        for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (m.cleanData(ub(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (e) {}
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function() {
            var a = arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode, m.cleanData(ub(this)), a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, b) {
            a = e.apply([], a);
            var c, d, f, g, h, i, j = 0,
                l = this.length,
                n = this,
                o = l - 1,
                p = a[0],
                q = m.isFunction(p);
            if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p)) return this.each(function(c) {
                var d = n.eq(c);
                q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
            });
            if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
                for (g = m.map(ub(i, "script"), xb), f = g.length; l > j; j++) d = i, j !== o && (d = m.clone(d, !0, !0), f && m.merge(g, ub(d, "script"))), b.call(this[j], d, j);
                if (f)
                    for (h = g[g.length - 1].ownerDocument, m.map(g, yb), j = 0; f > j; j++) d = g[j], ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")));
                i = c = null
            }
            return this
        }
    }), m.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        m.fn[a] = function(a) {
            for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++) c = d === h ? this : this.clone(!0), m(g[d])[b](c), f.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var Cb, Db = {};

    function Eb(b, c) {
        var d, e = m(c.createElement(b)).appendTo(c.body),
            f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
        return e.detach(), f
    }

    function Fb(a) {
        var b = y,
            c = Db[a];
        return c || (c = Eb(a, b), "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Cb[0].contentWindow || Cb[0].contentDocument).document, b.write(), b.close(), c = Eb(a, b), Cb.detach()), Db[a] = c), c
    }! function() {
        var a;
        k.shrinkWrapBlocks = function() {
            if (null != a) return a;
            a = !1;
            var b, c, d;
            return c = y.getElementsByTagName("body")[0], c && c.style ? (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(y.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
        }
    }();
    var Gb = /^margin/,
        Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$", "i"),
        Ib, Jb, Kb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ib = function(b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    }, Jb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)), Hb.test(g) && Gb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
    }) : y.documentElement.currentStyle && (Ib = function(a) {
        return a.currentStyle
    }, Jb = function(a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Hb.test(g) && !Kb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
    });

    function Lb(a, b) {
        return {
            get: function() {
                var c = a();
                if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }
        }
    }! function() {
        var b, c, d, e, f, g, h;
        if (b = y.createElement("div"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = d && d.style) {
            c.cssText = "float:left;opacity:.5", k.opacity = "0.5" === c.opacity, k.cssFloat = !!c.cssFloat, b.style.backgroundClip = "content-box", b.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === b.style.backgroundClip, k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing, m.extend(k, {
                reliableHiddenOffsets: function() {
                    return null == g && i(), g
                },
                boxSizingReliable: function() {
                    return null == f && i(), f
                },
                pixelPosition: function() {
                    return null == e && i(), e
                },
                reliableMarginRight: function() {
                    return null == h && i(), h
                }
            });

            function i() {
                var b, c, d, i;
                c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", e = f = !1, h = !0, a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top, f = "4px" === (a.getComputedStyle(b, null) || {
                    width: "4px"
                }).width, i = b.appendChild(y.createElement("div")), i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", b.style.width = "1px", h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight), b.removeChild(i)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = b.getElementsByTagName("td"), i[0].style.cssText = "margin:0;border:0;padding:0;display:none", g = 0 === i[0].offsetHeight, g && (i[0].style.display = "", i[1].style.display = "none", g = 0 === i[0].offsetHeight), c.removeChild(d))
            }
        }
    }(), m.swap = function(a, b, c, d) {
        var e, f, g = {};
        for (f in b) g[f] = a.style[f], a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b) a.style[f] = g[f];
        return e
    };
    var Mb = /alpha\([^)]*\)/i,
        Nb = /opacity\s*=\s*([^)]*)/,
        Ob = /^(none|table(?!-c[ea]).+)/,
        Pb = new RegExp("^(" + S + ")(.*)$", "i"),
        Qb = new RegExp("^([+-])=(" + S + ")", "i"),
        Rb = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Sb = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Tb = ["Webkit", "O", "Moz", "ms"];

    function Ub(a, b) {
        if (b in a) return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1),
            d = b,
            e = Tb.length;
        while (e--)
            if (b = Tb[e] + c, b in a) return b;
        return d
    }

    function Vb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = m._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d), (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))));
        for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }

    function Wb(a, b, c) {
        var d = Pb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function Xb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += m.css(a, c + T[f], !0, e)), d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)), "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e), "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)));
        return g
    }

    function Yb(a, b, c) {
        var d = !0,
            e = "width" === b ? a.offsetWidth : a.offsetHeight,
            f = Ib(a),
            g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Jb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Hb.test(e)) return e;
            d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }
    m.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = Jb(a, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": k.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = m.camelCase(b),
                    i = a.style;
                if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)), g = m.cssHooks[b] || m.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                    i[b] = c
                } catch (j) {}
            }
        },
        css: function(a, b, c, d) {
            var e, f, g, h = m.camelCase(b);
            return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)), g = m.cssHooks[b] || m.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Jb(a, b, d)), "normal" === f && b in Sb && (f = Sb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || m.isNumeric(e) ? e || 0 : f) : f
        }
    }), m.each(["height", "width"], function(a, b) {
        m.cssHooks[b] = {
            get: function(a, c, d) {
                return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function() {
                    return Yb(a, b, d)
                }) : Yb(a, b, d) : void 0
            },
            set: function(a, c, d) {
                var e = d && Ib(a);
                return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0)
            }
        }
    }), k.opacity || (m.cssHooks.opacity = {
        get: function(a, b) {
            return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e)
        }
    }), m.cssHooks.marginRight = Lb(k.reliableMarginRight, function(a, b) {
        return b ? m.swap(a, {
            display: "inline-block"
        }, Jb, [a, "marginRight"]) : void 0
    }), m.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        m.cssHooks[a + b] = {
            expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }
        }, Gb.test(a) || (m.cssHooks[a + b].set = Wb)
    }), m.fn.extend({
        css: function(a, b) {
            return V(this, function(a, b, c) {
                var d, e, f = {},
                    g = 0;
                if (m.isArray(b)) {
                    for (d = Ib(a), e = b.length; e > g; g++) f[b[g]] = m.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? m.style(a, b, c) : m.css(a, b)
            }, a, b, arguments.length > 1)
        },
        show: function() {
            return Vb(this, !0)
        },
        hide: function() {
            return Vb(this)
        },
        toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                U(this) ? m(this).show() : m(this).hide()
            })
        }
    });

    function Zb(a, b, c, d, e) {
        return new Zb.prototype.init(a, b, c, d, e)
    }
    m.Tween = Zb, Zb.prototype = {
        constructor: Zb,
        init: function(a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (m.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var a = Zb.propHooks[this.prop];
            return a && a.get ? a.get(this) : Zb.propHooks._default.get(this)
        },
        run: function(a) {
            var b, c = Zb.propHooks[this.prop];
            return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Zb.propHooks._default.set(this), this
        }
    }, Zb.prototype.init.prototype = Zb.prototype, Zb.propHooks = {
        _default: {
            get: function(a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
            },
            set: function(a) {
                m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
            }
        }
    }, Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
        set: function(a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
        }
    }, m.easing = {
        linear: function(a) {
            return a
        },
        swing: function(a) {
            return .5 - Math.cos(a * Math.PI) / 2
        }
    }, m.fx = Zb.prototype.init, m.fx.step = {};
    var $b, _b, ac = /^(?:toggle|show|hide)$/,
        bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$", "i"),
        cc = /queueHooks$/,
        dc = [ic],
        ec = {
            "*": [function(a, b) {
                var c = this.createTween(a, b),
                    d = c.cur(),
                    e = bc.exec(b),
                    f = e && e[3] || (m.cssNumber[a] ? "" : "px"),
                    g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a)),
                    h = 1,
                    i = 20;
                if (g && g[3] !== f) {
                    f = f || g[3], e = e || [], g = +d || 1;
                    do h = h || ".5", g /= h, m.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
                }
                return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
            }]
        };

    function fc() {
        return setTimeout(function() {
            $b = void 0
        }), $b = m.now()
    }

    function gc(a, b) {
        var c, d = {
                height: a
            },
            e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = T[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function hc(a, b, c) {
        for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++)
            if (d = e[f].call(c, b, a)) return d
    }

    function ic(a, b, c) {
        var d, e, f, g, h, i, j, l, n = this,
            o = {},
            p = a.style,
            q = a.nodeType && U(a),
            r = m._data(a, "fxshow");
        c.queue || (h = m._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
            h.unqueued || i()
        }), h.unqueued++, n.always(function() {
            n.always(function() {
                h.unqueued--, m.queue(a, "fx").length || h.empty.fire()
            })
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = m.css(a, "display"), l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j, "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", k.shrinkWrapBlocks() || n.always(function() {
            p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2]
        }));
        for (d in b)
            if (e = b[d], ac.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                    if ("show" !== e || !r || void 0 === r[d]) continue;
                    q = !0
                }
                o[d] = r && r[d] || m.style(a, d)
            } else j = void 0;
        if (m.isEmptyObject(o)) "inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j);
        else {
            r ? "hidden" in r && (q = r.hidden) : r = m._data(a, "fxshow", {}), f && (r.hidden = !q), q ? m(a).show() : n.done(function() {
                m(a).hide()
            }), n.done(function() {
                var b;
                m._removeData(a, "fxshow");
                for (b in o) m.style(a, b, o[b])
            });
            for (d in o) g = hc(q ? r[d] : 0, d, n), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }

    function jc(a, b) {
        var c, d, e, f, g;
        for (c in a)
            if (d = m.camelCase(c), e = b[d], f = a[c], m.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = m.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) c in a || (a[c] = f[c], b[c] = e)
            } else b[d] = e
    }

    function kc(a, b, c) {
        var d, e, f = 0,
            g = dc.length,
            h = m.Deferred().always(function() {
                delete i.elem
            }),
            i = function() {
                if (e) return !1;
                for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            },
            j = h.promise({
                elem: a,
                props: m.extend({}, b),
                opts: m.extend(!0, {
                    specialEasing: {}
                }, c),
                originalProperties: b,
                originalOptions: c,
                startTime: $b || fc(),
                duration: c.duration,
                tweens: [],
                createTween: function(b, c) {
                    var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                    return j.tweens.push(d), d
                },
                stop: function(b) {
                    var c = 0,
                        d = b ? j.tweens.length : 0;
                    if (e) return this;
                    for (e = !0; d > c; c++) j.tweens[c].run(1);
                    return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                }
            }),
            k = j.props;
        for (jc(k, j.opts.specialEasing); g > f; f++)
            if (d = dc[f].call(j, a, k, j.opts)) return d;
        return m.map(k, hc, j), m.isFunction(j.opts.start) && j.opts.start.call(a, j), m.fx.timer(m.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }
    m.Animation = m.extend(kc, {
            tweener: function(a, b) {
                m.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
                for (var c, d = 0, e = a.length; e > d; d++) c = a[d], ec[c] = ec[c] || [], ec[c].unshift(b)
            },
            prefilter: function(a, b) {
                b ? dc.unshift(a) : dc.push(a)
            }
        }), m.speed = function(a, b, c) {
            var d = a && "object" == typeof a ? m.extend({}, a) : {
                complete: c || !c && b || m.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !m.isFunction(b) && b
            };
            return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                m.isFunction(d.old) && d.old.call(this), d.queue && m.dequeue(this, d.queue)
            }, d
        }, m.fn.extend({
            fadeTo: function(a, b, c, d) {
                return this.filter(U).css("opacity", 0).show().end().animate({
                    opacity: b
                }, a, c, d)
            },
            animate: function(a, b, c, d) {
                var e = m.isEmptyObject(a),
                    f = m.speed(b, c, d),
                    g = function() {
                        var b = kc(this, m.extend({}, a), f);
                        (e || m._data(this, "finish")) && b.stop(!0)
                    };
                return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
            },
            stop: function(a, b, c) {
                var d = function(a) {
                    var b = a.stop;
                    delete a.stop, b(c)
                };
                return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                    var b = !0,
                        e = null != a && a + "queueHooks",
                        f = m.timers,
                        g = m._data(this);
                    if (e) g[e] && g[e].stop && d(g[e]);
                    else
                        for (e in g) g[e] && g[e].stop && cc.test(e) && d(g[e]);
                    for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                    (b || !c) && m.dequeue(this, a)
                })
            },
            finish: function(a) {
                return a !== !1 && (a = a || "fx"), this.each(function() {
                    var b, c = m._data(this),
                        d = c[a + "queue"],
                        e = c[a + "queueHooks"],
                        f = m.timers,
                        g = d ? d.length : 0;
                    for (c.finish = !0, m.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                    for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                    delete c.finish
                })
            }
        }), m.each(["toggle", "show", "hide"], function(a, b) {
            var c = m.fn[b];
            m.fn[b] = function(a, d, e) {
                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e)
            }
        }), m.each({
            slideDown: gc("show"),
            slideUp: gc("hide"),
            slideToggle: gc("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(a, b) {
            m.fn[a] = function(a, c, d) {
                return this.animate(b, a, c, d)
            }
        }), m.timers = [], m.fx.tick = function() {
            var a, b = m.timers,
                c = 0;
            for ($b = m.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
            b.length || m.fx.stop(), $b = void 0
        }, m.fx.timer = function(a) {
            m.timers.push(a), a() ? m.fx.start() : m.timers.pop()
        }, m.fx.interval = 13, m.fx.start = function() {
            _b || (_b = setInterval(m.fx.tick, m.fx.interval))
        }, m.fx.stop = function() {
            clearInterval(_b), _b = null
        }, m.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, m.fn.delay = function(a, b) {
            return a = m.fx ? m.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        function() {
            var a, b, c, d, e;
            b = y.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = y.createElement("select"), e = c.appendChild(y.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", k.getSetAttribute = "t" !== b.className, k.style = /top/.test(d.getAttribute("style")), k.hrefNormalized = "/a" === d.getAttribute("href"), k.checkOn = !!a.value, k.optSelected = e.selected, k.enctype = !!y.createElement("form").enctype, c.disabled = !0, k.optDisabled = !e.disabled, a = y.createElement("input"), a.setAttribute("value", ""), k.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), k.radioValue = "t" === a.value
        }();
    var lc = /\r/g;
    m.fn.extend({
        val: function(a) {
            var b, c, d, e = this[0]; {
                if (arguments.length) return d = m.isFunction(a), this.each(function(c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function(a) {
                        return null == a ? "" : a + ""
                    })), b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                });
                if (e) return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c)
            }
        }
    }), m.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = m.find.attr(a, "value");
                    return null != b ? b : m.trim(m.text(a))
                }
            },
            select: {
                get: function(a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                        if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
                            if (b = m(c).val(), f) return b;
                            g.push(b)
                        }
                    return g
                },
                set: function(a, b) {
                    var c, d, e = a.options,
                        f = m.makeArray(b),
                        g = e.length;
                    while (g--)
                        if (d = e[g], m.inArray(m.valHooks.option.get(d), f) >= 0) try {
                            d.selected = c = !0
                        } catch (h) {
                            d.scrollHeight
                        } else d.selected = !1;
                    return c || (a.selectedIndex = -1), e
                }
            }
        }
    }), m.each(["radio", "checkbox"], function() {
        m.valHooks[this] = {
            set: function(a, b) {
                return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0
            }
        }, k.checkOn || (m.valHooks[this].get = function(a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var mc, nc, oc = m.expr.attrHandle,
        pc = /^(?:checked|selected)$/i,
        qc = k.getSetAttribute,
        rc = k.input;
    m.fn.extend({
        attr: function(a, b) {
            return V(this, m.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                m.removeAttr(this, a)
            })
        }
    }), m.extend({
        attr: function(a, b, c) {
            var d, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(), d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void m.removeAttr(a, b))
        },
        removeAttr: function(a, b) {
            var c, d, e = 0,
                f = b && b.match(E);
            if (f && 1 === a.nodeType)
                while (c = f[e++]) d = m.propFix[c] || c, m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""), a.removeAttribute(qc ? c : d)
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            }
        }
    }), nc = {
        set: function(a, b, c) {
            return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0, c
        }
    }, m.each(m.expr.match.bool.source.match(/\w+/g), function(a, b) {
        var c = oc[b] || m.find.attr;
        oc[b] = rc && qc || !pc.test(b) ? function(a, b, d) {
            var e, f;
            return d || (f = oc[b], oc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, oc[b] = f), e
        } : function(a, b, c) {
            return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }), rc && qc || (m.attrHooks.value = {
        set: function(a, b, c) {
            return m.nodeName(a, "input") ? void(a.defaultValue = b) : mc && mc.set(a, b, c)
        }
    }), qc || (mc = {
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
        }
    }, oc.id = oc.name = oc.coords = function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }, m.valHooks.button = {
        get: function(a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0
        },
        set: mc.set
    }, m.attrHooks.contenteditable = {
        set: function(a, b, c) {
            mc.set(a, "" === b ? !1 : b, c)
        }
    }, m.each(["width", "height"], function(a, b) {
        m.attrHooks[b] = {
            set: function(a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
            }
        }
    })), k.style || (m.attrHooks.style = {
        get: function(a) {
            return a.style.cssText || void 0
        },
        set: function(a, b) {
            return a.style.cssText = b + ""
        }
    });
    var sc = /^(?:input|select|textarea|button|object)$/i,
        tc = /^(?:a|area)$/i;
    m.fn.extend({
        prop: function(a, b) {
            return V(this, m.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = m.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a]
                } catch (b) {}
            })
        }
    }), m.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(a, b, c) {
            var d, e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !m.isXMLDoc(a), f && (b = m.propFix[b] || b, e = m.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var b = m.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1
                }
            }
        }
    }), k.hrefNormalized || m.each(["href", "src"], function(a, b) {
        m.propHooks[b] = {
            get: function(a) {
                return a.getAttribute(b, 4)
            }
        }
    }), k.optSelected || (m.propHooks.selected = {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }
    }), m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        m.propFix[this.toLowerCase()] = this
    }), k.enctype || (m.propFix.enctype = "encoding");
    var uc = /[\t\r\n\f]/g;
    m.fn.extend({
        addClass: function(a) {
            var b, c, d, e, f, g, h = 0,
                i = this.length,
                j = "string" == typeof a && a;
            if (m.isFunction(a)) return this.each(function(b) {
                m(this).addClass(a.call(this, b, this.className))
            });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
                        f = 0;
                        while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = m.trim(d), c.className !== g && (c.className = g)
                    }
            return this
        },
        removeClass: function(a) {
            var b, c, d, e, f, g, h = 0,
                i = this.length,
                j = 0 === arguments.length || "string" == typeof a && a;
            if (m.isFunction(a)) return this.each(function(b) {
                m(this).removeClass(a.call(this, b, this.className))
            });
            if (j)
                for (b = (a || "").match(E) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
                        f = 0;
                        while (e = b[f++])
                            while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " ");
                        g = a ? m.trim(d) : "", c.className !== g && (c.className = g)
                    }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function(c) {
                m(this).toggleClass(a.call(this, c, this.className, b), b)
            } : function() {
                if ("string" === c) {
                    var b, d = 0,
                        e = m(this),
                        f = a.match(E) || [];
                    while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                } else(c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "")
            })
        },
        hasClass: function(a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0) return !0;
            return !1
        }
    }), m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
        m.fn[b] = function(a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), m.fn.extend({
        hover: function(a, b) {
            return this.mouseenter(a).mouseleave(b || a)
        },
        bind: function(a, b, c) {
            return this.on(a, null, b, c)
        },
        unbind: function(a, b) {
            return this.off(a, null, b)
        },
        delegate: function(a, b, c, d) {
            return this.on(b, a, c, d)
        },
        undelegate: function(a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
        }
    });
    var vc = m.now(),
        wc = /\?/,
        xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    m.parseJSON = function(b) {
        if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
        var c, d = null,
            e = m.trim(b + "");
        return e && !m.trim(e.replace(xc, function(a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
        })) ? Function("return " + e)() : m.error("Invalid JSON: " + b)
    }, m.parseXML = function(b) {
        var c, d;
        if (!b || "string" != typeof b) return null;
        try {
            a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
        } catch (e) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b), c
    };
    var yc, zc, Ac = /#.*$/,
        Bc = /([?&])_=[^&]*/,
        Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Ec = /^(?:GET|HEAD)$/,
        Fc = /^\/\//,
        Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Hc = {},
        Ic = {},
        Jc = "*/".concat("*");
    try {
        zc = location.href
    } catch (Kc) {
        zc = y.createElement("a"), zc.href = "", zc = zc.href
    }
    yc = Gc.exec(zc.toLowerCase()) || [];

    function Lc(a) {
        return function(b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0,
                f = b.toLowerCase().match(E) || [];
            if (m.isFunction(c))
                while (d = f[e++]) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }

    function Mc(a, b, c, d) {
        var e = {},
            f = a === Ic;

        function g(h) {
            var i;
            return e[h] = !0, m.each(a[h] || [], function(a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
            }), i
        }
        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }

    function Nc(a, b) {
        var c, d, e = m.ajaxSettings.flatOptions || {};
        for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && m.extend(!0, a, c), a
    }

    function Oc(a, b, c) {
        var d, e, f, g, h = a.contents,
            i = a.dataTypes;
        while ("*" === i[0]) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)
            for (g in h)
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break
                }
        if (i[0] in c) f = i[0];
        else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }

    function Pc(a, b, c, d) {
        var e, f, g, h, i, j = {},
            k = a.dataTypes.slice();
        if (k[1])
            for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                if ("*" === f) f = i;
                else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g)
                for (e in j)
                    if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                        g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                        break
                    }
            if (g !== !0)
                if (g && a["throws"]) b = g(b);
                else try {
                    b = g(b)
                } catch (l) {
                    return {
                        state: "parsererror",
                        error: g ? l : "No conversion from " + i + " to " + f
                    }
                }
        }
        return {
            state: "success",
            data: b
        }
    }
    m.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: zc,
            type: "GET",
            isLocal: Dc.test(yc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Jc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": m.parseJSON,
                "text xml": m.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(a, b) {
            return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a)
        },
        ajaxPrefilter: Lc(Hc),
        ajaxTransport: Lc(Ic),
        ajax: function(a, b) {
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b),
                l = k.context || k,
                n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event,
                o = m.Deferred(),
                p = m.Callbacks("once memory"),
                q = k.statusCode || {},
                r = {},
                s = {},
                t = 0,
                u = "canceled",
                v = {
                    readyState: 0,
                    getResponseHeader: function(a) {
                        var b;
                        if (2 === t) {
                            if (!j) {
                                j = {};
                                while (b = Cc.exec(f)) j[b[1].toLowerCase()] = b[2]
                            }
                            b = j[a.toLowerCase()]
                        }
                        return null == b ? null : b
                    },
                    getAllResponseHeaders: function() {
                        return 2 === t ? f : null
                    },
                    setRequestHeader: function(a, b) {
                        var c = a.toLowerCase();
                        return t || (a = s[c] = s[c] || a, r[a] = b), this
                    },
                    overrideMimeType: function(a) {
                        return t || (k.mimeType = a), this
                    },
                    statusCode: function(a) {
                        var b;
                        if (a)
                            if (2 > t)
                                for (b in a) q[b] = [q[b], a[b]];
                            else v.always(a[v.status]);
                        return this
                    },
                    abort: function(a) {
                        var b = a || u;
                        return i && i.abort(b), x(0, b), this
                    }
                };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)), Mc(Hc, k, b, v), 2 === t) return v;
            h = m.event && k.global, h && 0 === m.active++ && m.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Ec.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)), k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]), m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
            for (d in k.headers) v.setRequestHeader(d, k.headers[d]);
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
            u = "abort";
            for (d in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) v[d](k[d]);
            if (i = Mc(Ic, k, b, v)) {
                v.readyState = 1, h && n.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function() {
                    v.abort("timeout")
                }, k.timeout));
                try {
                    t = 1, i.send(r, x)
                } catch (w) {
                    if (!(2 > t)) throw w;
                    x(-1, w)
                }
            } else x(-1, "No Transport");

            function x(a, b, c, d) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Oc(k, v, c)), u = Pc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (m.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (m.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (n.trigger("ajaxComplete", [v, k]), --m.active || m.event.trigger("ajaxStop")))
            }
            return v
        },
        getJSON: function(a, b, c) {
            return m.get(a, b, c, "json")
        },
        getScript: function(a, b) {
            return m.get(a, void 0, b, "script")
        }
    }), m.each(["get", "post"], function(a, b) {
        m[b] = function(a, c, d, e) {
            return m.isFunction(c) && (e = e || d, d = c, c = void 0), m.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            })
        }
    }), m._evalUrl = function(a) {
        return m.ajax({
            url: a,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, m.fn.extend({
        wrapAll: function(a) {
            if (m.isFunction(a)) return this.each(function(b) {
                m(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && 1 === a.firstChild.nodeType) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return this.each(m.isFunction(a) ? function(b) {
                m(this).wrapInner(a.call(this, b))
            } : function() {
                var b = m(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = m.isFunction(a);
            return this.each(function(c) {
                m(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
            }).end()
        }
    }), m.expr.filters.hidden = function(a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"))
    }, m.expr.filters.visible = function(a) {
        return !m.expr.filters.hidden(a)
    };
    var Qc = /%20/g,
        Rc = /\[\]$/,
        Sc = /\r?\n/g,
        Tc = /^(?:submit|button|image|reset|file)$/i,
        Uc = /^(?:input|select|textarea|keygen)/i;

    function Vc(a, b, c, d) {
        var e;
        if (m.isArray(b)) m.each(b, function(b, e) {
            c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
        });
        else if (c || "object" !== m.type(b)) d(a, b);
        else
            for (e in b) Vc(a + "[" + e + "]", b[e], c, d)
    }
    m.param = function(a, b) {
        var c, d = [],
            e = function(a, b) {
                b = m.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
        if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional), m.isArray(a) || a.jquery && !m.isPlainObject(a)) m.each(a, function() {
            e(this.name, this.value)
        });
        else
            for (c in a) Vc(c, a[c], b, e);
        return d.join("&").replace(Qc, "+")
    }, m.fn.extend({
        serialize: function() {
            return m.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var a = m.prop(this, "elements");
                return a ? m.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a))
            }).map(function(a, b) {
                var c = m(this).val();
                return null == c ? null : m.isArray(c) ? m.map(c, function(a) {
                    return {
                        name: b.name,
                        value: a.replace(Sc, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(Sc, "\r\n")
                }
            }).get()
        }
    }), m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c()
    } : Zc;
    var Wc = 0,
        Xc = {},
        Yc = m.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var a in Xc) Xc[a](void 0, !0)
    }), k.cors = !!Yc && "withCredentials" in Yc, Yc = k.ajax = !!Yc, Yc && m.ajaxTransport(function(a) {
        if (!a.crossDomain || k.cors) {
            var b;
            return {
                send: function(c, d) {
                    var e, f = a.xhr(),
                        g = ++Wc;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                        for (e in a.xhrFields) f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null), b = function(c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState))
                            if (delete Xc[g], b = void 0, f.onreadystatechange = m.noop, e) 4 !== f.readyState && f.abort();
                            else {
                                j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                try {
                                    i = f.statusText
                                } catch (k) {
                                    i = ""
                                }
                                h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                            }
                        j && d(h, i, j, f.getAllResponseHeaders())
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b()
                },
                abort: function() {
                    b && b(void 0, !0)
                }
            }
        }
    });

    function Zc() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }

    function $c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }
    m.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(a) {
                return m.globalEval(a), a
            }
        }
    }), m.ajaxPrefilter("script", function(a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), m.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var b, c = y.head || m("head")[0] || y.documentElement;
            return {
                send: function(d, e) {
                    b = y.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                    }, c.insertBefore(b, c.firstChild)
                },
                abort: function() {
                    b && b.onload(void 0, !0)
                }
            }
        }
    });
    var _c = [],
        ad = /(=)\?(?=&|$)|\?\?/;
    m.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var a = _c.pop() || m.expando + "_" + vc++;
            return this[a] = !0, a
        }
    }), m.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
            return g || m.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
            g = arguments
        }, d.always(function() {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, _c.push(e)), g && m.isFunction(f) && f(g[0]), g = f = void 0
        }), "script") : void 0
    }), m.parseHTML = function(a, b, c) {
        if (!a || "string" != typeof a) return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || y;
        var d = u.exec(a),
            e = !c && [];
        return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e), e && e.length && m(e).remove(), m.merge([], d.childNodes))
    };
    var bd = m.fn.load;
    m.fn.load = function(a, b, c) {
        if ("string" != typeof a && bd) return bd.apply(this, arguments);
        var d, e, f, g = this,
            h = a.indexOf(" ");
        return h >= 0 && (d = m.trim(a.slice(h, a.length)), a = a.slice(0, h)), m.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && m.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments, g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a)
        }).complete(c && function(a, b) {
            g.each(c, e || [a.responseText, b, a])
        }), this
    }, m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
        m.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), m.expr.filters.animated = function(a) {
        return m.grep(m.timers, function(b) {
            return a === b.elem
        }).length
    };
    var cd = a.document.documentElement;

    function dd(a) {
        return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }
    m.offset = {
        setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = m.css(a, "position"),
                l = m(a),
                n = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = m.css(a, "top"), i = m.css(a, "left"), j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), m.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (n.top = b.top - h.top + g), null != b.left && (n.left = b.left - h.left + e), "using" in b ? b.using.call(a, n) : l.css(n)
        }
    }, m.fn.extend({
        offset: function(a) {
            if (arguments.length) return void 0 === a ? this : this.each(function(b) {
                m.offset.setOffset(this, a, b)
            });
            var b, c, d = {
                    top: 0,
                    left: 0
                },
                e = this[0],
                f = e && e.ownerDocument;
            if (f) return b = f.documentElement, m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()), c = dd(f), {
                top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
            }) : d
        },
        position: function() {
            if (this[0]) {
                var a, b, c = {
                        top: 0,
                        left: 0
                    },
                    d = this[0];
                return "fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), m.nodeName(a[0], "html") || (c = a.offset()), c.top += m.css(a[0], "borderTopWidth", !0), c.left += m.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - m.css(d, "marginTop", !0),
                    left: b.left - c.left - m.css(d, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || cd;
                while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position")) a = a.offsetParent;
                return a || cd
            })
        }
    }), m.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, b) {
        var c = /Y/.test(b);
        m.fn[a] = function(d) {
            return V(this, function(a, d, e) {
                var f = dd(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }), m.each(["top", "left"], function(a, b) {
        m.cssHooks[b] = Lb(k.pixelPosition, function(a, c) {
            return c ? (c = Jb(a, b), Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0
        })
    }), m.each({
        Height: "height",
        Width: "width"
    }, function(a, b) {
        m.each({
            padding: "inner" + a,
            content: b,
            "": "outer" + a
        }, function(c, d) {
            m.fn[d] = function(d, e) {
                var f = arguments.length && (c || "boolean" != typeof d),
                    g = c || (d === !0 || e === !0 ? "margin" : "border");
                return V(this, function(b, c, d) {
                    var e;
                    return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }), m.fn.size = function() {
        return this.length
    }, m.fn.andSelf = m.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return m
    });
    var ed = a.jQuery,
        fd = a.$;
    return m.noConflict = function(b) {
        return a.$ === m && (a.$ = fd), b && a.jQuery === m && (a.jQuery = ed), m
    }, typeof b === K && (a.jQuery = a.$ = m), m
});
jQuery.noConflict();

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
} +

function($) {
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
    }
}(jQuery); + function($) {
    'use strict';

    function transitionEnd() {
        var el = document.createElement('bootstrap')
        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                }
            }
        }
        return false
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }
    $(function() {
        $.support.transition = transitionEnd()
        if (!$.support.transition) return
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })
}(jQuery); + function($) {
    'use strict';
    var dismiss = '[data-dismiss="alert"]'
    var Alert = function(el) {
        $(el).on('click', dismiss, this.close)
    }
    Alert.VERSION = '3.3.1'
    Alert.TRANSITION_DURATION = 150
    Alert.prototype.close = function(e) {
        var $this = $(this)
        var selector = $this.attr('data-target')
        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '')
        }
        var $parent = $(selector)
        if (e) e.preventDefault()
        if (!$parent.length) {
            $parent = $this.closest('.alert')
        }
        $parent.trigger(e = $.Event('close.bs.alert'))
        if (e.isDefaultPrevented()) return
        $parent.removeClass('in')

        function removeElement() {
            $parent.detach().trigger('closed.bs.alert').remove()
        }
        $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement()
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.alert')
            if (!data) $this.data('bs.alert', (data = new Alert(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }
    var old = $.fn.alert
    $.fn.alert = Plugin
    $.fn.alert.Constructor = Alert
    $.fn.alert.noConflict = function() {
        $.fn.alert = old
        return this
    }
    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)
}(jQuery); + function($) {
    'use strict';
    var Button = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Button.DEFAULTS, options)
        this.isLoading = false
    }
    Button.VERSION = '3.3.1'
    Button.DEFAULTS = {
        loadingText: 'loading...'
    }
    Button.prototype.setState = function(state) {
        var d = 'disabled'
        var $el = this.$element
        var val = $el.is('input') ? 'val' : 'html'
        var data = $el.data()
        state = state + 'Text'
        if (data.resetText == null) $el.data('resetText', $el[val]())
        setTimeout($.proxy(function() {
            $el[val](data[state] == null ? this.options[state] : data[state])
            if (state == 'loadingText') {
                this.isLoading = true
                $el.addClass(d).attr(d, d)
            } else if (this.isLoading) {
                this.isLoading = false
                $el.removeClass(d).removeAttr(d)
            }
        }, this), 0)
    }
    Button.prototype.toggle = function() {
        var changed = true
        var $parent = this.$element.closest('[data-toggle="buttons"]')
        if ($parent.length) {
            var $input = this.$element.find('input')
            if ($input.prop('type') == 'radio') {
                if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
                else $parent.find('.active').removeClass('active')
            }
            if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
        } else {
            this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
        }
        if (changed) this.$element.toggleClass('active')
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.button')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.button', (data = new Button(this, options)))
            if (option == 'toggle') data.toggle()
            else if (option) data.setState(option)
        })
    }
    var old = $.fn.button
    $.fn.button = Plugin
    $.fn.button.Constructor = Button
    $.fn.button.noConflict = function() {
        $.fn.button = old
        return this
    }
    $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function(e) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        Plugin.call($btn, 'toggle')
        e.preventDefault()
    }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function(e) {
        $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })
}(jQuery); + function($) {
    'use strict';
    var Carousel = function(element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = this.sliding = this.interval = this.$active = this.$items = null
        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))
        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }
    Carousel.VERSION = '3.3.1'
    Carousel.TRANSITION_DURATION = 600
    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }
    Carousel.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37:
                this.prev();
                break
            case 39:
                this.next();
                break
            default:
                return
        }
        e.preventDefault()
    }
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false)
        this.interval && clearInterval(this.interval)
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
        return this
    }
    Carousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }
    Carousel.prototype.getItemForDirection = function(direction, active) {
        var delta = direction == 'prev' ? -1 : 1
        var activeIndex = this.getItemIndex(active)
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }
    Carousel.prototype.to = function(pos) {
        var that = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))
        if (pos > (this.$items.length - 1) || pos < 0) return
        if (this.sliding) return this.$element.one('slid.bs.carousel', function() {
            that.to(pos)
        })
        if (activeIndex == pos) return this.pause().cycle()
        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true)
        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }
        this.interval = clearInterval(this.interval)
        return this
    }
    Carousel.prototype.next = function() {
        if (this.sliding) return
        return this.slide('next')
    }
    Carousel.prototype.prev = function() {
        if (this.sliding) return
        return this.slide('prev')
    }
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback = type == 'next' ? 'first' : 'last'
        var that = this
        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }
        if ($next.hasClass('active')) return (this.sliding = false)
        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return
        this.sliding = true
        isCycling && this.pause()
        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }
        var slidEvent = $.Event('slid.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth
            $active.addClass(direction)
            $next.addClass(direction)
            $active.one('bsTransitionEnd', function() {
                $next.removeClass([type, direction].join(' ')).addClass('active')
                $active.removeClass(['active', direction].join(' '))
                that.sliding = false
                setTimeout(function() {
                    that.$element.trigger(slidEvent)
                }, 0)
            }).emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }
        isCycling && this.cycle()
        return this
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide
            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }
    var old = $.fn.carousel
    $.fn.carousel = Plugin
    $.fn.carousel.Constructor = Carousel
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old
        return this
    }
    var clickHandler = function(e) {
        var href
        var $this = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''))
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false
        Plugin.call($target, options)
        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }
        e.preventDefault()
    }
    $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)
    $(window).on('load', function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })
}(jQuery); + function($) {
    'use strict';
    var Collapse = function(element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
        this.transitioning = null
        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }
        if (this.options.toggle) this.toggle()
    }
    Collapse.VERSION = '3.3.1'
    Collapse.TRANSITION_DURATION = 350
    Collapse.DEFAULTS = {
        toggle: true,
        trigger: '[data-toggle="collapse"]'
    }
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass('in')) return
        var activesData
        var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')
        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }
        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }
        var dimension = this.dimension()
        this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true)
        this.$trigger.removeClass('collapsed').attr('aria-expanded', true)
        this.transitioning = 1
        var complete = function() {
            this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element.trigger('shown.bs.collapse')
        }
        if (!$.support.transition) return complete.call(this)
        var scrollSize = $.camelCase(['scroll', dimension].join('-'))
        this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass('in')) return
        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        var dimension = this.dimension()
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight
        this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false)
        this.$trigger.addClass('collapsed').attr('aria-expanded', false)
        this.transitioning = 1
        var complete = function() {
            this.transitioning = 0
            this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse')
        }
        if (!$.support.transition) return complete.call(this)
        this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }
    Collapse.prototype.getParent = function() {
        return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function(i, element) {
            var $element = $(element)
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
        }, this)).end()
    }
    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass('in')
        $element.attr('aria-expanded', isOpen)
        $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
        return $(target)
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data && options.toggle && option == 'show') options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.collapse
    $.fn.collapse = Plugin
    $.fn.collapse.Constructor = Collapse
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old
        return this
    }
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
        var $this = $(this)
        if (!$this.attr('data-target')) e.preventDefault()
        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $.extend({}, $this.data(), {
            trigger: this
        })
        Plugin.call($target, option)
    })
}(jQuery); + function($) {
    'use strict';
    var backdrop = '.dropdown-backdrop'
    var toggle = '[data-toggle="dropdown"]'
    var Dropdown = function(element) {
        $(element).on('click.bs.dropdown', this.toggle)
    }
    Dropdown.VERSION = '3.3.1'
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this)
        if ($this.is('.disabled, :disabled')) return
        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')
        clearMenus()
        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
            }
            var relatedTarget = {
                relatedTarget: this
            }
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))
            if (e.isDefaultPrevented()) return
            $this.trigger('focus').attr('aria-expanded', 'true')
            $parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget)
        }
        return false
    }
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return
        var $this = $(this)
        e.preventDefault()
        e.stopPropagation()
        if ($this.is('.disabled, :disabled')) return
        var $parent = getParent($this)
        var isActive = $parent.hasClass('open')
        if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
            if (e.which == 27) $parent.find(toggle).trigger('focus')
            return $this.trigger('click')
        }
        var desc = ' li:not(.divider):visible a'
        var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)
        if (!$items.length) return
        var index = $items.index(e.target)
        if (e.which == 38 && index > 0) index--
            if (e.which == 40 && index < $items.length - 1) index++
                if (!~index) index = 0
        $items.eq(index).trigger('focus')
    }

    function clearMenus(e) {
        if (e && e.which === 3) return
        $(backdrop).remove()
        $(toggle).each(function() {
            var $this = $(this)
            var $parent = getParent($this)
            var relatedTarget = {
                relatedTarget: this
            }
            if (!$parent.hasClass('open')) return
            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
            if (e.isDefaultPrevented()) return
            $this.attr('aria-expanded', 'false')
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target')
        if (!selector) {
            selector = $this.attr('href')
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '')
        }
        var $parent = selector && $(selector)
        return $parent && $parent.length ? $parent : $this.parent()
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.dropdown')
            if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }
    var old = $.fn.dropdown
    $.fn.dropdown = Plugin
    $.fn.dropdown.Constructor = Dropdown
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old
        return this
    }
    $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function(e) {
        e.stopPropagation()
    }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)
}(jQuery); + function($) {
    'use strict';
    var Modal = function(element, options) {
        this.options = options
        this.$body = $(document.body)
        this.$element = $(element)
        this.$backdrop = this.isShown = null
        this.scrollbarWidth = 0
        if (this.options.remote) {
            this.$element.find('.modal-content').load(this.options.remote, $.proxy(function() {
                this.$element.trigger('loaded.bs.modal')
            }, this))
        }
    }
    Modal.VERSION = '3.3.1'
    Modal.TRANSITION_DURATION = 300
    Modal.BACKDROP_TRANSITION_DURATION = 150
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    }
    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget)
    }
    Modal.prototype.show = function(_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', {
            relatedTarget: _relatedTarget
        })
        this.$element.trigger(e)
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true
        this.$body.addClass('modal-open')
        this.escape()
        this.resize()
        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass('fade')
            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body)
            }
            that.$element.show().scrollTop(0)
            if (that.options.backdrop) that.adjustBackdrop()
            that.adjustDialog()
            if (transition) {
                that.$element[0].offsetWidth
            }
            that.$element.addClass('in').attr('aria-hidden', false)
            that.enforceFocus()
            var e = $.Event('shown.bs.modal', {
                relatedTarget: _relatedTarget
            })
            transition ? that.$element.find('.modal-dialog').one('bsTransitionEnd', function() {
                that.$element.trigger('focus').trigger(e)
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e)
        })
    }
    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault()
        e = $.Event('hide.bs.modal')
        this.$element.trigger(e)
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false
        this.escape()
        this.resize()
        $(document).off('focusin.bs.modal')
        this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal')
        $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal()
    }
    Modal.prototype.enforceFocus = function() {
        $(document).off('focusin.bs.modal').on('focusin.bs.modal', $.proxy(function(e) {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.trigger('focus')
            }
        }, this))
    }
    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keydown.dismiss.bs.modal', $.proxy(function(e) {
                e.which == 27 && this.hide()
            }, this))
        } else if (!this.isShown) {
            this.$element.off('keydown.dismiss.bs.modal')
        }
    }
    Modal.prototype.resize = function() {
        if (this.isShown) {
            $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
        } else {
            $(window).off('resize.bs.modal')
        }
    }
    Modal.prototype.hideModal = function() {
        var that = this
        this.$element.hide()
        this.backdrop(function() {
            that.$body.removeClass('modal-open')
            that.resetAdjustments()
            that.$element.trigger('hidden.bs.modal')
        })
    }
    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }
    Modal.prototype.backdrop = function(callback) {
        var that = this
        var animate = this.$element.hasClass('fade') ? 'fade' : ''
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate
            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').prependTo(this.$element).on('click.dismiss.bs.modal', $.proxy(function(e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
            }, this))
            if (doAnimate) this.$backdrop[0].offsetWidth
            this.$backdrop.addClass('in')
            if (!callback) return
            doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')
            var callbackRemove = function() {
                that.removeBackdrop()
                callback && callback()
            }
            $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove()
        } else if (callback) {
            callback()
        }
    }
    Modal.prototype.handleUpdate = function() {
        if (this.options.backdrop) this.adjustBackdrop()
        this.adjustDialog()
    }
    Modal.prototype.adjustBackdrop = function() {
        this.$backdrop.css('height', 0).css('height', this.$element[0].scrollHeight)
    }
    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
        })
    }
    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: '',
            paddingRight: ''
        })
    }
    Modal.prototype.measureScrollbar = function() {
        var scrollDiv = document.createElement('div')
        scrollDiv.className = 'modal-scrollbar-measure'
        this.$body.append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        this.$body[0].removeChild(scrollDiv)
        return scrollbarWidth
    }

    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }
    var old = $.fn.modal
    $.fn.modal = Plugin
    $.fn.modal.Constructor = Modal
    $.fn.modal.noConflict = function() {
        $.fn.modal = old
        return this
    }
    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function(e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')))
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data())
        if ($this.is('a')) e.preventDefault()
        $target.one('show.bs.modal', function(showEvent) {
            if (showEvent.isDefaultPrevented()) return
            $target.one('hidden.bs.modal', function() {
                $this.is(':visible') && $this.trigger('focus')
            })
        })
        Plugin.call($target, option, this)
    })
}(jQuery); + function($) {
    'use strict';
    var Tooltip = function(element, options) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null
        this.init('tooltip', element, options)
    }
    Tooltip.VERSION = '3.3.1'
    Tooltip.TRANSITION_DURATION = 150
    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }
    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options)
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)
        var triggers = this.options.trigger.split(' ')
        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]
            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
                this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }
        this.options.selector ? (this._options = $.extend({}, this.options, {
            trigger: 'manual',
            selector: ''
        })) : this.fixTitle()
    }
    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS
    }
    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)
        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }
        return options
    }
    Tooltip.prototype.getDelegateOptions = function() {
        var options = {}
        var defaults = this.getDefaults()
        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value
        })
        return options
    }
    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type)
        if (self && self.$tip && self.$tip.is(':visible')) {
            self.hoverState = 'in'
            return
        }
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }
        clearTimeout(self.timeout)
        self.hoverState = 'in'
        if (!self.options.delay || !self.options.delay.show) return self.show()
        self.timeout = setTimeout(function() {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }
    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data('bs.' + this.type)
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }
        clearTimeout(self.timeout)
        self.hoverState = 'out'
        if (!self.options.delay || !self.options.delay.hide) return self.hide()
        self.timeout = setTimeout(function() {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }
    Tooltip.prototype.show = function() {
        var e = $.Event('show.bs.' + this.type)
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)
            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this
            var $tip = this.tip()
            var tipId = this.getUID(this.type)
            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)
            if (this.options.animation) $tip.addClass('fade')
            var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement
            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'
            $tip.detach().css({
                top: 0,
                left: 0,
                display: 'block'
            }).addClass(placement).data('bs.' + this.type, this)
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            var pos = this.getPosition()
            var actualWidth = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight
            if (autoPlace) {
                var orgPlacement = placement
                var $container = this.options.container ? $(this.options.container) : this.$element.parent()
                var containerDim = this.getPosition($container)
                placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < containerDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > containerDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < containerDim.left ? 'right' : placement
                $tip.removeClass(orgPlacement).addClass(placement)
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
            this.applyPlacement(calculatedOffset, placement)
            var complete = function() {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null
                if (prevHoverState == 'out') that.leave(that)
            }
            $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()
        }
    }
    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip()
        var width = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)
        if (isNaN(marginTop)) marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0
        offset.top = offset.top + marginTop
        offset.left = offset.left + marginLeft
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)
        $tip.addClass('in')
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight
        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)
        if (delta.left) offset.left += delta.left
        else offset.top += delta.top
        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'
        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }
    Tooltip.prototype.replaceArrow = function(delta, dimension, isHorizontal) {
        this.arrow().css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%').css(isHorizontal ? 'top' : 'left', '')
    }
    Tooltip.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()
        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }
    Tooltip.prototype.hide = function(callback) {
        var that = this
        var $tip = this.tip()
        var e = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element.removeAttr('aria-describedby').trigger('hidden.bs.' + that.type)
            callback && callback()
        }
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip.removeClass('in')
        $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete()
        this.hoverState = null
        return this
    }
    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element
        if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }
    Tooltip.prototype.hasContent = function() {
        return this.getTitle()
    }
    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element
        var el = $element[0]
        var isBody = el.tagName == 'BODY'
        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            elRect = $.extend({}, elRect, {
                width: elRect.right - elRect.left,
                height: elRect.bottom - elRect.top
            })
        }
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : $element.offset()
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        }
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null
        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }
    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'top' ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == 'left' ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        }
    }
    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        }
        if (!this.$viewport) return delta
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) {
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) {
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) {
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }
        return delta
    }
    Tooltip.prototype.getTitle = function() {
        var title
        var $e = this.$element
        var o = this.options
        title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)
        return title
    }
    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }
    Tooltip.prototype.tip = function() {
        return (this.$tip = this.$tip || $(this.options.template))
    }
    Tooltip.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }
    Tooltip.prototype.enable = function() {
        this.enabled = true
    }
    Tooltip.prototype.disable = function() {
        this.enabled = false
    }
    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }
    Tooltip.prototype.toggle = function(e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }
        self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
    Tooltip.prototype.destroy = function() {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function() {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
        })
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option
            var selector = options && options.selector
            if (!data && option == 'destroy') return
            if (selector) {
                if (!data) $this.data('bs.tooltip', (data = {}))
                if (!data[selector]) data[selector] = new Tooltip(this, options)
            } else {
                if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            }
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.tooltip
    $.fn.tooltip = Plugin
    $.fn.tooltip.Constructor = Tooltip
    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old
        return this
    }
}(jQuery); + function($) {
    'use strict';
    var Popover = function(element, options) {
        this.init('popover', element, options)
    }
    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')
    Popover.VERSION = '3.3.1'
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: 'right',
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)
    Popover.prototype.constructor = Popover
    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS
    }
    Popover.prototype.setContent = function() {
        var $tip = this.tip()
        var title = this.getTitle()
        var content = this.getContent()
        $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
        $tip.find('.popover-content').children().detach().end()[this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'](content)
        $tip.removeClass('fade top bottom left right in')
        if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }
    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }
    Popover.prototype.getContent = function() {
        var $e = this.$element
        var o = this.options
        return $e.attr('data-content') || (typeof o.content == 'function' ? o.content.call($e[0]) : o.content)
    }
    Popover.prototype.arrow = function() {
        return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }
    Popover.prototype.tip = function() {
        if (!this.$tip) this.$tip = $(this.options.template)
        return this.$tip
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option
            var selector = options && options.selector
            if (!data && option == 'destroy') return
            if (selector) {
                if (!data) $this.data('bs.popover', (data = {}))
                if (!data[selector]) data[selector] = new Popover(this, options)
            } else {
                if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
            }
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.popover
    $.fn.popover = Plugin
    $.fn.popover.Constructor = Popover
    $.fn.popover.noConflict = function() {
        $.fn.popover = old
        return this
    }
}(jQuery); + function($) {
    'use strict';

    function ScrollSpy(element, options) {
        var process = $.proxy(this.process, this)
        this.$body = $('body')
        this.$scrollElement = $(element).is('body') ? $(window) : $(element)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || '') + ' .nav li > a'
        this.offsets = []
        this.targets = []
        this.activeTarget = null
        this.scrollHeight = 0
        this.$scrollElement.on('scroll.bs.scrollspy', process)
        this.refresh()
        this.process()
    }
    ScrollSpy.VERSION = '3.3.1'
    ScrollSpy.DEFAULTS = {
        offset: 10
    }
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }
    ScrollSpy.prototype.refresh = function() {
        var offsetMethod = 'offset'
        var offsetBase = 0
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = 'position'
            offsetBase = this.$scrollElement.scrollTop()
        }
        this.offsets = []
        this.targets = []
        this.scrollHeight = this.getScrollHeight()
        var self = this
        this.$body.find(this.selector).map(function() {
            var $el = $(this)
            var href = $el.data('target') || $el.attr('href')
            var $href = /^#./.test(href) && $(href)
            return ($href && $href.length && $href.is(':visible') && [
                [$href[offsetMethod]().top + offsetBase, href]
            ]) || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            self.offsets.push(this[0])
            self.targets.push(this[1])
        })
    }
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.getScrollHeight()
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i
        if (this.scrollHeight != scrollHeight) {
            this.refresh()
        }
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
        }
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null
            return this.clear()
        }
        for (i = offsets.length; i--;) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i])
        }
    }
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target
        this.clear()
        var selector = this.selector + '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'
        var active = $(selector).parents('li').addClass('active')
        if (active.parent('.dropdown-menu').length) {
            active = active.closest('li.dropdown').addClass('active')
        }
        active.trigger('activate.bs.scrollspy')
    }
    ScrollSpy.prototype.clear = function() {
        $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active')
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.scrollspy
    $.fn.scrollspy = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old
        return this
    }
    $(window).on('load.bs.scrollspy.data-api', function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this)
            Plugin.call($spy, $spy.data())
        })
    })
}(jQuery); + function($) {
    'use strict';
    var Tab = function(element) {
        this.element = $(element)
    }
    Tab.VERSION = '3.3.1'
    Tab.TRANSITION_DURATION = 150
    Tab.prototype.show = function() {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')
        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '')
        }
        if ($this.parent('li').hasClass('active')) return
        var $previous = $ul.find('.active:last a')
        var hideEvent = $.Event('hide.bs.tab', {
            relatedTarget: $this[0]
        })
        var showEvent = $.Event('show.bs.tab', {
            relatedTarget: $previous[0]
        })
        $previous.trigger(hideEvent)
        $this.trigger(showEvent)
        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return
        var $target = $(selector)
        this.activate($this.closest('li'), $ul)
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: 'hidden.bs.tab',
                relatedTarget: $this[0]
            })
            $this.trigger({
                type: 'shown.bs.tab',
                relatedTarget: $previous[0]
            })
        })
    }
    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback && $.support.transition && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

        function next() {
            $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', false)
            element.addClass('active').find('[data-toggle="tab"]').attr('aria-expanded', true)
            if (transition) {
                element[0].offsetWidth
                element.addClass('in')
            } else {
                element.removeClass('fade')
            }
            if (element.parent('.dropdown-menu')) {
                element.closest('li.dropdown').addClass('active').end().find('[data-toggle="tab"]').attr('aria-expanded', true)
            }
            callback && callback()
        }
        $active.length && transition ? $active.one('bsTransitionEnd', next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next()
        $active.removeClass('in')
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.tab')
            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.tab
    $.fn.tab = Plugin
    $.fn.tab.Constructor = Tab
    $.fn.tab.noConflict = function() {
        $.fn.tab = old
        return this
    }
    var clickHandler = function(e) {
        e.preventDefault()
        Plugin.call($(this), 'show')
    }
    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler).on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)
}(jQuery); + function($) {
    'use strict';
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        this.$target = $(this.options.target).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))
        this.$element = $(element)
        this.affixed = this.unpin = this.pinnedOffset = null
        this.checkPosition()
    }
    Affix.VERSION = '3.3.1'
    Affix.RESET = 'affix affix-top affix-bottom'
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    }
    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        var targetHeight = this.$target.height()
        if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false
        if (this.affixed == 'bottom') {
            if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
            return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
        }
        var initializing = this.affixed == null
        var colliderTop = initializing ? scrollTop : position.top
        var colliderHeight = initializing ? targetHeight : height
        if (offsetTop != null && colliderTop <= offsetTop) return 'top'
        if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'
        return false
    }
    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$target.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1)
    }
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(':visible')) return
        var height = this.$element.height()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        var scrollHeight = $('body').height()
        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)
        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)
        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css('top', '')
            var affixType = 'affix' + (affix ? '-' + affix : '')
            var e = $.Event(affixType + '.bs.affix')
            this.$element.trigger(e)
            if (e.isDefaultPrevented()) return
            this.affixed = affix
            this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
            this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
        }
        if (affix == 'bottom') {
            this.$element.offset({
                top: scrollHeight - height - offsetBottom
            })
        }
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    var old = $.fn.affix
    $.fn.affix = Plugin
    $.fn.affix.Constructor = Affix
    $.fn.affix.noConflict = function() {
        $.fn.affix = old
        return this
    }
    $(window).on('load', function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this)
            var data = $spy.data()
            data.offset = data.offset || {}
            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
            if (data.offsetTop != null) data.offset.top = data.offsetTop
            Plugin.call($spy, data)
        })
    })
}(jQuery);
! function(e) {
    function r() {
        n = !1;
        for (var r = 0; r < i.length; r++) {
            var a = e(i[r]).filter(function() {
                return e(this).is(":appeared")
            });
            if (a.trigger("appear", [a]), t) {
                var o = t.not(a);
                o.trigger("disappear", [o])
            }
            t = a
        }
    }
    var t, i = [],
        a = !1,
        n = !1,
        o = {
            interval: 250,
            force_process: !1
        },
        f = e(window);
    e.expr[":"].appeared = function(r) {
        var t = e(r);
        if (!t.is(":visible")) return !1;
        var i = f.scrollLeft(),
            a = f.scrollTop(),
            n = t.offset(),
            o = n.left,
            p = n.top;
        return p + t.height() >= a && p - (t.data("appear-top-offset") || 0) <= a + f.height() && o + t.width() >= i && o - (t.data("appear-left-offset") || 0) <= i + f.width() ? !0 : !1
    }, e.fn.extend({
        appear: function(t) {
            var f = e.extend({}, o, t || {}),
                p = this.selector || this;
            if (!a) {
                var s = function() {
                    n || (n = !0, setTimeout(r, f.interval))
                };
                e(window).scroll(s).resize(s), a = !0
            }
            return f.force_process && setTimeout(r, f.interval), i.push(p), e(p)
        }
    }), e.extend({
        force_appear: function() {
            return a ? (r(), !0) : !1
        }
    })
}(jQuery);
var AjaxImageLoader = {
    is_retina: null,
    NotUseRetina: 'no_retina',
    UseRetina: 'retina',
    UseRetinaNoCookie: 'retina_no_cookie',
    LazyloadEffect: 'fadeIn',
    ImageCount: 0,
    ImageCountFinished: 0,
    allStart: function() {},
    individualStart: function(this_image) {},
    allSuccess: function() {},
    individualSuccess: function(this_image) {},
    init: function() {
        var self = this;
        jQuery('img.no_ajax_image_loader').each(function() {
            jQuery(this).removeClass('ajax_image_loader').removeClass('lazy_image_loader');
        });
        var ajax_loader_images = jQuery('img.ajax_image_loader');
        if (ajax_loader_images.length > 0) {
            ajax_loader_images.removeClass('lazy_image_loader');
        }
        var ajax_loader_images = jQuery('img.ajax_image_loader, img.lazy_image_loader');
        if (ajax_loader_images.length > 0) {
            self.allStart();
            ajax_loader_images.each(function() {
                var this_image = jQuery(this);
                self.individualStart(this_image);
                self.processingRetina(this_image);
                setTimeout(function() {
                    self.loadImage(this_image)
                }, 1);
                self.ImageCount++
            });
        }
        jQuery('img.lazy_image_loader').appear();
        jQuery('img.lazy_image_loader').on('appear', function(event, appeared_elements) {
            appeared_elements.each(function() {
                image = jQuery(this);
                if (!image.attr('data-showed') && !image.attr('data-img-src')) {
                    self.processingSuccess(image);
                }
            });
        });
    },
    processingRetina: function(image) {
        var self = this;
        var ajax_retina = image.attr('data-ajax_retina');
        if (self.is_retina == null && ajax_retina == 'retina_no_cookie') {
            var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
            self.is_retina = pixelRatio > 1
            if (!jQuery.cookie('retina')) {
                var retina = self.is_retina ? self.UseRetina : self.NotUseRetina;
                jQuery.cookie('retina', retina)
            }
        }
        if (ajax_retina == 'retina') {
            self.is_retina = true;
        }
        var data_srcx2 = image.attr('data-img-srcX2');
        if (self.is_retina && undefined != data_srcx2) {
            image.attr('data-img-src', data_srcx2);
            image.removeAttr('data-img-srcX2');
        }
    },
    loadImage: function(image) {
        var self = this;
        var source = image.attr('data-img-src');
        if (undefined != source) {
            var new_image = new Image();
            new_image.onload = function() {
                image.attr('src', source);
                if (self.is_retina) {
                    var width = new_image.width / 2;
                    image.css('width', width + 'px');
                }
                self.LoadingFinished(image);
            }
            new_image.src = source;
        } else {
            self.LoadingFinished(image);
        }
    },
    LoadingFinished: function(image) {
        var self = this;
        image.removeAttr('data-img-src');
        if (image.hasClass('ajax_image_loader') || image.is(':appeared')) {
            self.processingSuccess(image);
        }
        self.ImageCountFinished++
            if (self.ImageCount == self.ImageCountFinished) {
                self.allSuccess();
            }
    },
    processingSuccess: function(image) {
        image.attr('data-showed', true);
        this.individualSuccess(image);
    }
}

jQuery.noConflict();
(function() {
    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
        r = this,
        o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; e.length > t; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; e.length > t; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return e
    }) : "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this),
    function(e) {
        function t(t) {
            var n = e.event;
            return n.target = n.target || n.srcElement || t, n
        }
        var n = document.documentElement,
            i = function() {};
        n.addEventListener ? i = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : n.attachEvent && (i = function(e, n, i) {
            e[n + i] = i.handleEvent ? function() {
                var n = t(e);
                i.handleEvent.call(i, n)
            } : function() {
                var n = t(e);
                i.call(e, n)
            }, e.attachEvent("on" + n, e[n + i])
        });
        var r = function() {};
        n.removeEventListener ? r = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : n.detachEvent && (r = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var o = {
            bind: i,
            unbind: r
        };
        "function" == typeof define && define.amd ? define("eventie/eventie", o) : e.eventie = o
    }(this),
    function(e, t) {
        "function" == typeof define && define.amd ? define(["eventEmitter/EventEmitter", "eventie/eventie"], function(n, i) {
            return t(e, n, i)
        }) : "object" == typeof exports ? module.exports = t(e, require("eventEmitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
    }(this, function(e, t, n) {
        function i(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function r(e) {
            return "[object Array]" === d.call(e)
        }

        function o(e) {
            var t = [];
            if (r(e)) t = e;
            else if ("number" == typeof e.length)
                for (var n = 0, i = e.length; i > n; n++) t.push(e[n]);
            else t.push(e);
            return t
        }

        function s(e, t, n) {
            if (!(this instanceof s)) return new s(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), a && (this.jqDeferred = new a.Deferred);
            var r = this;
            setTimeout(function() {
                r.check()
            })
        }

        function c(e) {
            this.img = e
        }

        function f(e) {
            this.src = e, v[e] = this
        }
        var a = e.jQuery,
            u = e.console,
            h = u !== void 0,
            d = Object.prototype.toString;
        s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                for (var i = n.querySelectorAll("img"), r = 0, o = i.length; o > r; r++) {
                    var s = i[r];
                    this.addImage(s)
                }
            }
        }, s.prototype.addImage = function(e) {
            var t = new c(e);
            this.images.push(t)
        }, s.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && h && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this,
                n = 0,
                i = this.images.length;
            if (this.hasAnyBroken = !1, !i) return this.complete(), void 0;
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        }, s.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
            })
        }, s.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, a && (a.fn.imagesLoaded = function(e, t) {
            var n = new s(this, e, t);
            return n.jqDeferred.promise(a(this))
        }), c.prototype = new t, c.prototype.check = function() {
            var e = v[this.img.src] || new f(this.img.src);
            if (e.isConfirmed) return this.confirm(e.isLoaded, "cached was confirmed"), void 0;
            if (this.img.complete && void 0 !== this.img.naturalWidth) return this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), void 0;
            var t = this;
            e.on("confirm", function(e, n) {
                return t.confirm(e.isLoaded, n), !0
            }), e.check()
        }, c.prototype.confirm = function(e, t) {
            this.isLoaded = e, this.emit("confirm", this, t)
        };
        var v = {};
        return f.prototype = new t, f.prototype.check = function() {
            if (!this.isChecked) {
                var e = new Image;
                n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
            }
        }, f.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, f.prototype.onload = function(e) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(e)
        }, f.prototype.onerror = function(e) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
        }, f.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        }, f.prototype.unbindProxyEvents = function(e) {
            n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
        }, s
    });

(function(a, b) {
    function h(a, b) {
        var c = a.createElement("p"),
            d = a.getElementsByTagName("head")[0] || a.documentElement;
        return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
    }

    function i() {
        var a = l.elements;
        return typeof a == "string" ? a.split(" ") : a
    }

    function j(a) {
        var b = {},
            c = a.createElement,
            f = a.createDocumentFragment,
            g = f();
        a.createElement = function(a) {
            if (!l.shivMethods) return c(a);
            var f;
            return b[a] ? f = b[a].cloneNode() : e.test(a) ? f = (b[a] = c(a)).cloneNode() : f = c(a), f.canHaveChildren && !d.test(a) ? g.appendChild(f) : f
        }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + i().join().replace(/\w+/g, function(a) {
            return c(a), g.createElement(a), 'c("' + a + '")'
        }) + ");return n}")(l, g)
    }

    function k(a) {
        var b;
        return a.documentShived ? a : (l.shivCSS && !f && (b = !!h(a, "article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}")), g || (b = !j(a)), b && (a.documentShived = b), a)
    }
    var c = a.html5 || {},
        d = /^<|^(?:button|form|map|select|textarea|object|iframe|option|optgroup)$/i,
        e = /^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)$/i,
        f, g;
    (function() {
        var c = b.createElement("a");
        c.innerHTML = "<xyz></xyz>", f = "hidden" in c, f && typeof injectElementWithStyles == "function" && injectElementWithStyles("#modernizr{}", function(b) {
            b.hidden = !0, f = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).display == "none"
        }), g = c.childNodes.length == 1 || function() {
            try {
                b.createElement("a")
            } catch (a) {
                return !0
            }
            var c = b.createDocumentFragment();
            return typeof c.cloneNode == "undefined" || typeof c.createDocumentFragment == "undefined" || typeof c.createElement == "undefined"
        }()
    })();
    var l = {
        elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
        shivCSS: c.shivCSS !== !1,
        shivMethods: c.shivMethods !== !1,
        type: "default",
        shivDocument: k
    };
    a.html5 = l, k(b)
})(this, document)
jQuery.noConflict();
(function($) {
    'use strict';
    $.expr[':'].icontains = function(obj, index, meta) {
        return icontains($(obj).text(), meta[3]);
    };
    $.expr[':'].aicontains = function(obj, index, meta) {
        return icontains($(obj).data('normalizedText') || $(obj).text(), meta[3]);
    };

    function icontains(haystack, needle) {
        return haystack.toUpperCase().indexOf(needle.toUpperCase()) > -1;
    }

    function normalizeToBase(text) {
        var rExps = [{
            re: /[\xC0-\xC6]/g,
            ch: "A"
        }, {
            re: /[\xE0-\xE6]/g,
            ch: "a"
        }, {
            re: /[\xC8-\xCB]/g,
            ch: "E"
        }, {
            re: /[\xE8-\xEB]/g,
            ch: "e"
        }, {
            re: /[\xCC-\xCF]/g,
            ch: "I"
        }, {
            re: /[\xEC-\xEF]/g,
            ch: "i"
        }, {
            re: /[\xD2-\xD6]/g,
            ch: "O"
        }, {
            re: /[\xF2-\xF6]/g,
            ch: "o"
        }, {
            re: /[\xD9-\xDC]/g,
            ch: "U"
        }, {
            re: /[\xF9-\xFC]/g,
            ch: "u"
        }, {
            re: /[\xC7-\xE7]/g,
            ch: "c"
        }, {
            re: /[\xD1]/g,
            ch: "N"
        }, {
            re: /[\xF1]/g,
            ch: "n"
        }];
        $.each(rExps, function() {
            text = text.replace(this.re, this.ch);
        });
        return text;
    }

    function htmlEscape(html) {
        var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        };
        var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
            testRegexp = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g'),
            string = html == null ? '' : '' + html;
        return testRegexp.test(string) ? string.replace(replaceRegexp, function(match) {
            return escapeMap[match];
        }) : string;
    }
    var Selectpicker = function(element, options, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.$newElement = null;
        this.$button = null;
        this.$menu = null;
        this.$lis = null;
        this.options = options;
        if (this.options.title === null) {
            this.options.title = this.$element.attr('title');
        }
        this.val = Selectpicker.prototype.val;
        this.render = Selectpicker.prototype.render;
        this.refresh = Selectpicker.prototype.refresh;
        this.setStyle = Selectpicker.prototype.setStyle;
        this.selectAll = Selectpicker.prototype.selectAll;
        this.deselectAll = Selectpicker.prototype.deselectAll;
        this.destroy = Selectpicker.prototype.remove;
        this.remove = Selectpicker.prototype.remove;
        this.show = Selectpicker.prototype.show;
        this.hide = Selectpicker.prototype.hide;
        this.init();
    };
    Selectpicker.VERSION = '1.6.3';
    Selectpicker.DEFAULTS = {
        noneSelectedText: 'Nothing selected',
        noneResultsText: 'No results match',
        countSelectedText: function(numSelected, numTotal) {
            return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
        },
        maxOptionsText: function(numAll, numGroup) {
            var arr = [];
            arr[0] = (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)';
            arr[1] = (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)';
            return arr;
        },
        selectAllText: 'Select All',
        deselectAllText: 'Deselect All',
        multipleSeparator: ', ',
        style: 'btn-default',
        size: 'auto',
        title: null,
        selectedTextFormat: 'values',
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: true,
        header: false,
        liveSearch: false,
        actionsBox: false,
        iconBase: 'glyphicon',
        tickIcon: 'glyphicon-ok',
        maxOptions: false,
        mobile: false,
        selectOnTab: false,
        dropdownAlignRight: false,
        searchAccentInsensitive: false
    };
    Selectpicker.prototype = {
        constructor: Selectpicker,
        init: function() {
            var that = this,
                id = this.$element.attr('id');
            this.$element.hide();
            this.multiple = this.$element.prop('multiple');
            this.autofocus = this.$element.prop('autofocus');
            this.$newElement = this.createView();
            this.$element.after(this.$newElement);
            this.$menu = this.$newElement.find('> .dropdown-menu');
            this.$button = this.$newElement.find('> button');
            this.$searchbox = this.$newElement.find('input');
            if (this.options.dropdownAlignRight)
                this.$menu.addClass('dropdown-menu-right');
            if (typeof id !== 'undefined') {
                this.$button.attr('data-id', id);
                $('label[for="' + id + '"]').click(function(e) {
                    e.preventDefault();
                    that.$button.focus();
                });
            }
            this.checkDisabled();
            this.clickListener();
            if (this.options.liveSearch) this.liveSearchListener();
            this.render();
            this.liHeight();
            this.setStyle();
            this.setWidth();
            if (this.options.container) this.selectPosition();
            this.$menu.data('this', this);
            this.$newElement.data('this', this);
            if (this.options.mobile) this.mobile();
        },
        createDropdown: function() {
            var multiple = this.multiple ? ' show-tick' : '',
                inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
                autofocus = this.autofocus ? ' autofocus' : '',
                btnSize = this.$element.parents().hasClass('form-group-lg') ? ' btn-lg' : (this.$element.parents().hasClass('form-group-sm') ? ' btn-sm' : '');
            var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
            var searchbox = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="input-block-level form-control" autocomplete="off" /></div>' : '';
            var actionsbox = this.options.actionsBox ? '<div class="bs-actionsbox">' + '<div class="btn-group btn-block">' + '<button class="actions-btn bs-select-all btn btn-sm btn-default">' +
                this.options.selectAllText + '</button>' + '<button class="actions-btn bs-deselect-all btn btn-sm btn-default">' +
                this.options.deselectAllText + '</button>' + '</div>' + '</div>' : '';
            var drop = '<div class="btn-group bootstrap-select clearfix' + multiple + inputGroup + '">' + '<button type="button" class="btn dropdown-toggle selectpicker' + btnSize + '" data-toggle="dropdown"' + autofocus + '>' + '<span class="filter-option pull-left"></span>' + '<span class="caret"></span>' + '</button>' + '<div class="dropdown-menu open">' +
                header +
                searchbox +
                actionsbox + '<ul class="dropdown-menu inner selectpicker" role="menu">' + '</ul>' + '</div>' + '</div>';
            return $(drop);
        },
        createView: function() {
            var $drop = this.createDropdown();
            var $li = this.createLi();
            $drop.find('ul').append($li);
            return $drop;
        },
        reloadLi: function() {
            this.destroyLi();
            var $li = this.createLi();
            this.$menu.find('ul').append($li);
        },
        destroyLi: function() {
            this.$menu.find('li').remove();
        },
        createLi: function() {
            var that = this,
                _li = [],
                optID = 0;
            var generateLI = function(content, index, classes) {
                return '<li' +
                    (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                    (typeof index !== 'undefined' | null === index ? ' data-original-index="' + index + '"' : '') + '>' + content + '</li>';
            };
            var generateA = function(text, classes, inline, optgroup) {
                var normText = normalizeToBase(htmlEscape(text));
                var normText = normText.replace(/\s+/g, " ");
                return '<a tabindex="0"' +
                    (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                    (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
                    (typeof optgroup !== 'undefined' ? 'data-optgroup="' + optgroup + '"' : '') + ' data-normalized-text="' + normText + '"' + '>' + text + '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' + '</a>';
            };
            this.$element.find('option').each(function() {
                var $this = $(this);
                var optionClass = $this.attr('class') || '',
                    inline = $this.attr('style'),
                    text = $this.data('content') ? $this.data('content') : $this.html(),
                    subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="muted text-muted">' + $this.data('subtext') + '</small>' : '',
                    icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                    isDisabled = $this.is(':disabled') || $this.parent().is(':disabled'),
                    index = $this[0].index;
                if (icon !== '' && isDisabled) {
                    icon = '<span>' + icon + '</span>';
                }
                if (!$this.data('content')) {
                    text = icon + '<span class="text">' + text + subtext + '</span>';
                }
                if (that.options.hideDisabled && isDisabled) {
                    return;
                }
                if ($this.parent().is('optgroup') && $this.data('divider') !== true) {
                    if ($this.index() === 0) {
                        optID += 1;
                        var label = $this.parent().attr('label');
                        var labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="muted text-muted">' + $this.parent().data('subtext') + '</small>' : '';
                        var labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';
                        label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';
                        if (index !== 0 && _li.length > 0) {
                            _li.push(generateLI('', null, 'divider'));
                        }
                        _li.push(generateLI(label, null, 'dropdown-header'));
                    }
                    _li.push(generateLI(generateA(text, 'opt ' + optionClass, inline, optID), index));
                } else if ($this.data('divider') === true) {
                    _li.push(generateLI('', index, 'divider'));
                } else if ($this.data('hidden') === true) {
                    _li.push(generateLI(generateA(text, optionClass, inline), index, 'hide is-hidden'));
                } else {
                    _li.push(generateLI(generateA(text, optionClass, inline), index));
                }
            });
            if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
                this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
            }
            return $(_li.join(''));
        },
        findLis: function() {
            if (this.$lis == null) this.$lis = this.$menu.find('li');
            return this.$lis;
        },
        render: function(updateLi) {
            var that = this;
            if (updateLi !== false) {
                this.$element.find('option').each(function(index) {
                    that.setDisabled(index, $(this).is(':disabled') || $(this).parent().is(':disabled'));
                    that.setSelected(index, $(this).is(':selected'));
                });
            }
            this.tabIndex();
            var notDisabled = this.options.hideDisabled ? ':not([disabled])' : '';
            var selectedItems = this.$element.find('option:selected' + notDisabled).map(function() {
                var $this = $(this);
                var icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '';
                var subtext;
                if (that.options.showSubtext && $this.attr('data-subtext') && !that.multiple) {
                    subtext = ' <small class="muted text-muted">' + $this.data('subtext') + '</small>';
                } else {
                    subtext = '';
                }
                if ($this.data('content') && that.options.showContent) {
                    return $this.data('content');
                } else if (typeof $this.attr('title') !== 'undefined') {
                    return $this.attr('title');
                } else {
                    return icon + $this.html() + subtext;
                }
            }).toArray();
            var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);
            var title = title.replace(/\s+/g, "");
            if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
                var max = this.options.selectedTextFormat.split('>');
                if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
                    notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
                    var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                        tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
                    title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
                    title = title.replace(/\s+/g, "");
                }
            }
            this.options.title = this.$element.attr('title');
            if (this.options.selectedTextFormat == 'static') {
                title = this.options.title;
                title = title.replace(/\s+/g, "");
            }
            if (!title) {
                title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
                title = title.replace(/\s+/g, "");
            }
            this.$button.attr('title', htmlEscape(title));
            this.$newElement.find('.filter-option').html(title);
        },
        setStyle: function(style, status) {
            if (this.$element.attr('class')) {
                this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|validate\[.*\]/gi, ''));
            }
            var buttonClass = style ? style : this.options.style;
            if (status == 'add') {
                this.$button.addClass(buttonClass);
            } else if (status == 'remove') {
                this.$button.removeClass(buttonClass);
            } else {
                this.$button.removeClass(this.options.style);
                this.$button.addClass(buttonClass);
            }
        },
        liHeight: function() {
            if (this.options.size === false) return;
            var $selectClone = this.$menu.parent().clone().find('> .dropdown-toggle').prop('autofocus', false).end().appendTo('body'),
                $menuClone = $selectClone.addClass('open').find('> .dropdown-menu'),
                liHeight = $menuClone.find('li').not('.divider').not('.dropdown-header').filter(':visible').children('a').outerHeight(),
                headerHeight = this.options.header ? $menuClone.find('.popover-title').outerHeight() : 0,
                searchHeight = this.options.liveSearch ? $menuClone.find('.bs-searchbox').outerHeight() : 0,
                actionsHeight = this.options.actionsBox ? $menuClone.find('.bs-actionsbox').outerHeight() : 0;
            $selectClone.remove();
            this.$newElement.data('liHeight', liHeight).data('headerHeight', headerHeight).data('searchHeight', searchHeight).data('actionsHeight', actionsHeight);
        },
        setSize: function() {
            this.findLis();
            var that = this,
                menu = this.$menu,
                menuInner = menu.find('.inner'),
                selectHeight = this.$newElement.outerHeight(),
                liHeight = this.$newElement.data('liHeight'),
                headerHeight = this.$newElement.data('headerHeight'),
                searchHeight = this.$newElement.data('searchHeight'),
                actionsHeight = this.$newElement.data('actionsHeight'),
                divHeight = this.$lis.filter('.divider').outerHeight(true),
                menuPadding = parseInt(menu.css('padding-top')) +
                parseInt(menu.css('padding-bottom')) +
                parseInt(menu.css('border-top-width')) +
                parseInt(menu.css('border-bottom-width')),
                notDisabled = this.options.hideDisabled ? ', .disabled' : '',
                $window = $(window),
                menuExtras = menuPadding + parseInt(menu.css('margin-top')) + parseInt(menu.css('margin-bottom')) + 2,
                menuHeight, selectOffsetTop, selectOffsetBot, posVert = function() {
                    selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
                    selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
                };
            posVert();
            if (this.options.header) menu.css('padding-top', 0);
            if (this.options.size == 'auto') {
                var getSize = function() {
                    var minHeight, lisVis = that.$lis.not('.hide');
                    posVert();
                    menuHeight = selectOffsetBot - menuExtras;
                    if (that.options.dropupAuto) {
                        that.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && ((menuHeight - menuExtras) < menu.height()));
                    }
                    if (that.$newElement.hasClass('dropup')) {
                        menuHeight = selectOffsetTop - menuExtras;
                    }
                    if ((lisVis.length + lisVis.filter('.dropdown-header').length) > 3) {
                        minHeight = liHeight * 3 + menuExtras - 2;
                    } else {
                        minHeight = 0;
                    }
                    menu.css({
                        'max-height': menuHeight + 'px',
                        'overflow': 'hidden',
                        'min-height': minHeight + headerHeight + searchHeight + actionsHeight + 'px'
                    });
                    menuInner.css({
                        'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - menuPadding + 'px',
                        'overflow-y': 'auto',
                        'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
                    });
                };
                getSize();
                this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
                $(window).off('resize.getSize').on('resize.getSize', getSize);
                $(window).off('scroll.getSize').on('scroll.getSize', getSize);
            } else if (this.options.size && this.options.size != 'auto' && menu.find('li' + notDisabled).length > this.options.size) {
                var optIndex = this.$lis.not('.divider' + notDisabled).find(' > *').slice(0, this.options.size).last().parent().index();
                var divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
                menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
                if (that.options.dropupAuto) {
                    this.$newElement.toggleClass('dropup', (selectOffsetTop > selectOffsetBot) && (menuHeight < menu.height()));
                }
                menu.css({
                    'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + 'px',
                    'overflow': 'hidden'
                });
                menuInner.css({
                    'max-height': menuHeight - menuPadding + 'px',
                    'overflow-y': 'auto'
                });
            }
        },
        setWidth: function() {
            if (this.options.width == 'auto') {
                this.$menu.css('min-width', '0');
                var selectClone = this.$newElement.clone().appendTo('body');
                var ulWidth = selectClone.find('> .dropdown-menu').css('width');
                var btnWidth = selectClone.css('width', 'auto').find('> button').css('width');
                selectClone.remove();
                this.$newElement.css('width', Math.max(parseInt(ulWidth), parseInt(btnWidth)) + 'px');
            } else if (this.options.width == 'fit') {
                this.$menu.css('min-width', '');
                this.$newElement.css('width', '').addClass('fit-width');
            } else if (this.options.width) {
                this.$menu.css('min-width', '');
                this.$newElement.css('width', this.options.width);
            } else {
                this.$menu.css('min-width', '');
                this.$newElement.css('width', '');
            }
            if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
                this.$newElement.removeClass('fit-width');
            }
        },
        selectPosition: function() {
            var that = this,
                drop = '<div />',
                $drop = $(drop),
                pos, actualHeight, getPlacement = function($element) {
                    $drop.addClass($element.attr('class').replace(/form-control/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
                    pos = $element.offset();
                    actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
                    $drop.css({
                        'top': pos.top + actualHeight,
                        'left': pos.left,
                        'width': $element[0].offsetWidth,
                        'position': 'absolute'
                    });
                };
            this.$newElement.on('click', function() {
                if (that.isDisabled()) {
                    return;
                }
                getPlacement($(this));
                $drop.appendTo(that.options.container);
                $drop.toggleClass('open', !$(this).hasClass('open'));
                $drop.append(that.$menu);
            });
            $(window).resize(function() {
                getPlacement(that.$newElement);
            });
            $(window).on('scroll', function() {
                getPlacement(that.$newElement);
            });
            $('html').on('click', function(e) {
                if ($(e.target).closest(that.$newElement).length < 1) {
                    $drop.removeClass('open');
                }
            });
        },
        setSelected: function(index, selected) {
            this.findLis();
            this.$lis.filter('[data-original-index="' + index + '"]').toggleClass('selected', selected);
        },
        setDisabled: function(index, disabled) {
            this.findLis();
            if (disabled) {
                this.$lis.filter('[data-original-index="' + index + '"]').addClass('disabled').find('a').attr('href', '#').attr('tabindex', -1);
            } else {
                this.$lis.filter('[data-original-index="' + index + '"]').removeClass('disabled').find('a').removeAttr('href').attr('tabindex', 0);
            }
        },
        isDisabled: function() {
            return this.$element.is(':disabled');
        },
        checkDisabled: function() {
            var that = this;
            if (this.isDisabled()) {
                this.$button.addClass('disabled').attr('tabindex', -1);
            } else {
                if (this.$button.hasClass('disabled')) {
                    this.$button.removeClass('disabled');
                }
                if (this.$button.attr('tabindex') == -1) {
                    if (!this.$element.data('tabindex')) this.$button.removeAttr('tabindex');
                }
            }
            this.$button.click(function() {
                return !that.isDisabled();
            });
        },
        tabIndex: function() {
            if (this.$element.is('[tabindex]')) {
                this.$element.data('tabindex', this.$element.attr('tabindex'));
                this.$button.attr('tabindex', this.$element.data('tabindex'));
            }
        },
        clickListener: function() {
            var that = this;
            this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function(e) {
                e.stopPropagation();
            });
            this.$newElement.on('click', function() {
                that.setSize();
                if (!that.options.liveSearch && !that.multiple) {
                    setTimeout(function() {
                        that.$menu.find('.selected a').focus();
                    }, 10);
                }
            });
            this.$menu.on('click', 'li a', function(e) {
                var $this = $(this),
                    clickedIndex = $this.parent().data('originalIndex'),
                    prevValue = that.$element.val(),
                    prevIndex = that.$element.prop('selectedIndex');
                if (that.multiple) {
                    e.stopPropagation();
                }
                e.preventDefault();
                if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                    var $options = that.$element.find('option'),
                        $option = $options.eq(clickedIndex),
                        state = $option.prop('selected'),
                        $optgroup = $option.parent('optgroup'),
                        maxOptions = that.options.maxOptions,
                        maxOptionsGrp = $optgroup.data('maxOptions') || false;
                    if (!that.multiple) {
                        $options.prop('selected', false);
                        $option.prop('selected', true);
                        that.$menu.find('.selected').removeClass('selected');
                        that.setSelected(clickedIndex, true);
                    } else {
                        $option.prop('selected', !state);
                        that.setSelected(clickedIndex, !state);
                        $this.blur();
                        if ((maxOptions !== false) || (maxOptionsGrp !== false)) {
                            var maxReached = maxOptions < $options.filter(':selected').length,
                                maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;
                            if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                                if (maxOptions && maxOptions == 1) {
                                    $options.prop('selected', false);
                                    $option.prop('selected', true);
                                    that.$menu.find('.selected').removeClass('selected');
                                    that.setSelected(clickedIndex, true);
                                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                                    $optgroup.find('option:selected').prop('selected', false);
                                    $option.prop('selected', true);
                                    var optgroupID = $this.data('optgroup');
                                    that.$menu.find('.selected').has('a[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                                    that.setSelected(clickedIndex, true);
                                } else {
                                    var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ? that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                                        maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                                        maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                                        $notify = $('<div class="notify"></div>');
                                    if (maxOptionsArr[2]) {
                                        maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                                        maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                                    }
                                    $option.prop('selected', false);
                                    that.$menu.append($notify);
                                    if (maxOptions && maxReached) {
                                        $notify.append($('<div>' + maxTxt + '</div>'));
                                        that.$element.trigger('maxReached.bs.select');
                                    }
                                    if (maxOptionsGrp && maxReachedGrp) {
                                        $notify.append($('<div>' + maxTxtGrp + '</div>'));
                                        that.$element.trigger('maxReachedGrp.bs.select');
                                    }
                                    setTimeout(function() {
                                        that.setSelected(clickedIndex, false);
                                    }, 10);
                                    $notify.delay(750).fadeOut(300, function() {
                                        $(this).remove();
                                    });
                                }
                            }
                        }
                    }
                    if (!that.multiple) {
                        that.$button.focus();
                    } else if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    }
                    if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                        that.$element.change();
                    }
                }
            });
            this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function(e) {
                if (e.target == this) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!that.options.liveSearch) {
                        that.$button.focus();
                    } else {
                        that.$searchbox.focus();
                    }
                }
            });
            this.$menu.on('click', 'li.divider, li.dropdown-header', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!that.options.liveSearch) {
                    that.$button.focus();
                } else {
                    that.$searchbox.focus();
                }
            });
            this.$menu.on('click', '.popover-title .close', function() {
                that.$button.focus();
            });
            this.$searchbox.on('click', function(e) {
                e.stopPropagation();
            });
            this.$menu.on('click', '.actions-btn', function(e) {
                if (that.options.liveSearch) {
                    that.$searchbox.focus();
                } else {
                    that.$button.focus();
                }
                e.preventDefault();
                e.stopPropagation();
                if ($(this).is('.bs-select-all')) {
                    that.selectAll();
                } else {
                    that.deselectAll();
                }
                that.$element.change();
            });
            this.$element.change(function() {
                that.render(false);
            });
        },
        liveSearchListener: function() {
            var that = this,
                no_results = $('<li class="no-results"></li>');
            this.$newElement.on('click.dropdown.data-api touchstart.dropdown.data-api', function() {
                that.$menu.find('.active').removeClass('active');
                if (!!that.$searchbox.val()) {
                    that.$searchbox.val('');
                    that.$lis.not('.is-hidden').removeClass('hide');
                    if (!!no_results.parent().length) no_results.remove();
                }
                if (!that.multiple) that.$menu.find('.selected').addClass('active');
                setTimeout(function() {
                    that.$searchbox.focus();
                }, 10);
            });
            this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function(e) {
                e.stopPropagation();
            });
            this.$searchbox.on('input propertychange', function() {
                if (that.$searchbox.val()) {
                    if (that.options.searchAccentInsensitive) {
                        that.$lis.not('.is-hidden').removeClass('hide').find('a').not(':aicontains(' + normalizeToBase(that.$searchbox.val()) + ')').parent().addClass('hide');
                    } else {
                        that.$lis.not('.is-hidden').removeClass('hide').find('a').not(':icontains(' + that.$searchbox.val() + ')').parent().addClass('hide');
                    }
                    if (!that.$menu.find('li').filter(':visible:not(.no-results)').length) {
                        if (!!no_results.parent().length) no_results.remove();
                        no_results.html(that.options.noneResultsText + ' "' + htmlEscape(that.$searchbox.val()) + '"').show();
                        that.$menu.find('li').last().after(no_results);
                    } else if (!!no_results.parent().length) {
                        no_results.remove();
                    }
                } else {
                    that.$lis.not('.is-hidden').removeClass('hide');
                    if (!!no_results.parent().length) no_results.remove();
                }
                that.$menu.find('li.active').removeClass('active');
                that.$menu.find('li').filter(':visible:not(.divider)').eq(0).addClass('active').find('a').focus();
                $(this).focus();
            });
        },
        val: function(value) {
            if (typeof value !== 'undefined') {
                this.$element.val(value);
                this.render();
                return this.$element;
            } else {
                return this.$element.val();
            }
        },
        selectAll: function() {
            this.findLis();
            this.$lis.not('.divider').not('.disabled').not('.selected').filter(':visible').find('a').click();
        },
        deselectAll: function() {
            this.findLis();
            this.$lis.not('.divider').not('.disabled').filter('.selected').filter(':visible').find('a').click();
        },
        keydown: function(e) {
            var $this = $(this),
                $parent = ($this.is('input')) ? $this.parent().parent() : $this.parent(),
                $items, that = $parent.data('this'),
                index, next, first, last, prev, nextPrev, prevIndex, isActive, keyCodeMap = {
                    32: ' ',
                    48: '0',
                    49: '1',
                    50: '2',
                    51: '3',
                    52: '4',
                    53: '5',
                    54: '6',
                    55: '7',
                    56: '8',
                    57: '9',
                    59: ';',
                    65: 'a',
                    66: 'b',
                    67: 'c',
                    68: 'd',
                    69: 'e',
                    70: 'f',
                    71: 'g',
                    72: 'h',
                    73: 'i',
                    74: 'j',
                    75: 'k',
                    76: 'l',
                    77: 'm',
                    78: 'n',
                    79: 'o',
                    80: 'p',
                    81: 'q',
                    82: 'r',
                    83: 's',
                    84: 't',
                    85: 'u',
                    86: 'v',
                    87: 'w',
                    88: 'x',
                    89: 'y',
                    90: 'z',
                    96: '0',
                    97: '1',
                    98: '2',
                    99: '3',
                    100: '4',
                    101: '5',
                    102: '6',
                    103: '7',
                    104: '8',
                    105: '9'
                };
            if (that.options.liveSearch) $parent = $this.parent().parent();
            if (that.options.container) $parent = that.$menu;
            $items = $('[role=menu] li a', $parent);
            isActive = that.$menu.parent().hasClass('open');
            if (!isActive && /([0-9]|[A-z])/.test(String.fromCharCode(e.keyCode))) {
                if (!that.options.container) {
                    that.setSize();
                    that.$menu.parent().addClass('open');
                    isActive = true;
                } else {
                    that.$newElement.trigger('click');
                }
                that.$searchbox.focus();
            }
            if (that.options.liveSearch) {
                if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
                    e.preventDefault();
                    that.$menu.parent().removeClass('open');
                    that.$button.focus();
                }
                $items = $('[role=menu] li:not(.divider):not(.dropdown-header):visible', $parent);
                if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
                    if ($items.filter('.active').length === 0) {
                        if (that.options.searchAccentInsensitive) {
                            $items = that.$newElement.find('li').filter(':aicontains(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
                        } else {
                            $items = that.$newElement.find('li').filter(':icontains(' + keyCodeMap[e.keyCode] + ')');
                        }
                    }
                }
            }
            if (!$items.length) return;
            if (/(38|40)/.test(e.keyCode.toString(10))) {
                index = $items.index($items.filter(':focus'));
                first = $items.parent(':not(.disabled):visible').first().index();
                last = $items.parent(':not(.disabled):visible').last().index();
                next = $items.eq(index).parent().nextAll(':not(.disabled):visible').eq(0).index();
                prev = $items.eq(index).parent().prevAll(':not(.disabled):visible').eq(0).index();
                nextPrev = $items.eq(next).parent().prevAll(':not(.disabled):visible').eq(0).index();
                if (that.options.liveSearch) {
                    $items.each(function(i) {
                        if ($(this).is(':not(.disabled)')) {
                            $(this).data('index', i);
                        }
                    });
                    index = $items.index($items.filter('.active'));
                    first = $items.filter(':not(.disabled):visible').first().data('index');
                    last = $items.filter(':not(.disabled):visible').last().data('index');
                    next = $items.eq(index).nextAll(':not(.disabled):visible').eq(0).data('index');
                    prev = $items.eq(index).prevAll(':not(.disabled):visible').eq(0).data('index');
                    nextPrev = $items.eq(next).prevAll(':not(.disabled):visible').eq(0).data('index');
                }
                prevIndex = $this.data('prevIndex');
                if (e.keyCode == 38) {
                    if (that.options.liveSearch) index -= 1;
                    if (index != nextPrev && index > prev) index = prev;
                    if (index < first) index = first;
                    if (index == prevIndex) index = last;
                }
                if (e.keyCode == 40) {
                    if (that.options.liveSearch) index += 1;
                    if (index == -1) index = 0;
                    if (index != nextPrev && index < next) index = next;
                    if (index > last) index = last;
                    if (index == prevIndex) index = first;
                }
                $this.data('prevIndex', index);
                if (!that.options.liveSearch) {
                    $items.eq(index).focus();
                } else {
                    e.preventDefault();
                    if (!$this.is('.dropdown-toggle')) {
                        $items.removeClass('active');
                        $items.eq(index).addClass('active').find('a').focus();
                        $this.focus();
                    }
                }
            } else if (!$this.is('input')) {
                var keyIndex = [],
                    count, prevKey;
                $items.each(function() {
                    if ($(this).parent().is(':not(.disabled)')) {
                        if ($.trim($(this).text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                            keyIndex.push($(this).parent().index());
                        }
                    }
                });
                count = $(document).data('keycount');
                count++;
                $(document).data('keycount', count);
                prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);
                if (prevKey != keyCodeMap[e.keyCode]) {
                    count = 1;
                    $(document).data('keycount', count);
                } else if (count >= keyIndex.length) {
                    $(document).data('keycount', 0);
                    if (count > keyIndex.length) count = 1;
                }
                $items.eq(keyIndex[count - 1]).focus();
            }
            if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
                if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
                if (!that.options.liveSearch) {
                    $(':focus').click();
                } else if (!/(32)/.test(e.keyCode.toString(10))) {
                    that.$menu.find('.active a').click();
                    $this.focus();
                }
                $(document).data('keycount', 0);
            }
            if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
                that.$menu.parent().removeClass('open');
                that.$button.focus();
            }
        },
        mobile: function() {
            this.$element.addClass('mobile-device').appendTo(this.$newElement);
            if (this.options.container) this.$menu.hide();
        },
        refresh: function() {
            this.$lis = null;
            this.reloadLi();
            this.render();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();
        },
        update: function() {
            this.reloadLi();
            this.setWidth();
            this.setStyle();
            this.checkDisabled();
            this.liHeight();
        },
        hide: function() {
            this.$newElement.hide();
        },
        show: function() {
            this.$newElement.show();
        },
        remove: function() {
            this.$newElement.remove();
            this.$element.remove();
        }
    };

    function Plugin(option, event) {
        var args = arguments;
        var _option = option,
            option = args[0],
            event = args[1];
        [].shift.apply(args);
        if (typeof option == 'undefined') {
            option = _option;
        }
        var value;
        var chain = this.each(function() {
            var $this = $(this);
            if ($this.is('select')) {
                var data = $this.data('selectpicker'),
                    options = typeof option == 'object' && option;
                if (!data) {
                    var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
                    $this.data('selectpicker', (data = new Selectpicker(this, config, event)));
                } else if (options) {
                    for (var i in options) {
                        if (options.hasOwnProperty(i)) {
                            data.options[i] = options[i];
                        }
                    }
                }
                if (typeof option == 'string') {
                    if (data[option] instanceof Function) {
                        value = data[option].apply(data, args);
                    } else {
                        value = data.options[option];
                    }
                }
            }
        });
        if (typeof value !== 'undefined') {
            return value;
        } else {
            return chain;
        }
    }
    var old = $.fn.selectpicker;
    $.fn.selectpicker = Plugin;
    $.fn.selectpicker.Constructor = Selectpicker;
    $.fn.selectpicker.noConflict = function() {
        $.fn.selectpicker = old;
        return this;
    };
    $(document).data('keycount', 0).on('keydown', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bs-searchbox input', Selectpicker.prototype.keydown).on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role=menu], .bs-searchbox input', function(e) {
        e.stopPropagation();
    });
    $(window).on('load.bs.select.data-api', function() {
        $('.selectpicker').each(function() {
            var $selectpicker = $(this);
            Plugin.call($selectpicker, $selectpicker.data());
        })
    });
})(jQuery);
productTimer = {
    init: function(secondsDiff, id) {
        daysHolder = jQuery('.timer-' + id + ' .days span');
        hoursHolder = jQuery('.timer-' + id + ' .hours span');
        minutesHolder = jQuery('.timer-' + id + ' .minutes span');
        secondsHolder = jQuery('.timer-' + id + ' .seconds span');
        var firstLoad = true;
        productTimer.timer(secondsDiff, daysHolder, hoursHolder, minutesHolder, secondsHolder, firstLoad);
        setTimeout(function() {
            jQuery('.timer-box').css('display', 'inline-block');
        }, 1100);
    },
    timer: function(secondsDiff, daysHolder, hoursHolder, minutesHolder, secondsHolder, firstLoad) {
        setTimeout(function() {
            days = Math.floor(secondsDiff / 86400);
            hours = Math.floor((secondsDiff / 3600) % 24);
            minutes = Math.floor((secondsDiff / 60) % 60);
            seconds = secondsDiff % 60;
            secondsHolder.html(seconds);
            if (secondsHolder.text().length == 1) {
                secondsHolder.html('0' + seconds);
            } else if (secondsHolder.text()[0] != 0) {
                secondsHolder.html(seconds);
            }
            if (firstLoad == true) {
                daysHolder.html(days);
                hoursHolder.html(hours);
                minutesHolder.html(minutes);
                if (minutesHolder.text().length == 1) {
                    minutesHolder.html('0' + minutes);
                }
                if (hoursHolder.text().length == 1) {
                    hoursHolder.html('0' + hours);
                }
                if (daysHolder.text().length == 1) {
                    daysHolder.html('0' + days);
                }
                firstLoad = false;
            }
            if (seconds >= 59) {
                if (minutesHolder.text().length == 1 || minutesHolder.text()[0] == 0 && minutesHolder.text() != 00) {
                    minutesHolder.html('0' + minutes);
                } else {
                    minutesHolder.html(minutes);
                }
                if (hoursHolder.text().length == 1 || hoursHolder.text()[0] == 0 && hoursHolder.text() != 00) {
                    hoursHolder.html('0' + hours);
                } else {
                    hoursHolder.html(hours);
                }
                if (daysHolder.text().length == 1 || daysHolder.text()[0] == 0 && daysHolder.text() != 00) {
                    daysHolder.html('0' + days);
                } else {
                    daysHolder.html(days);
                }
            }
            secondsDiff--;
            productTimer.timer(secondsDiff, daysHolder, hoursHolder, minutesHolder, secondsHolder, firstLoad);
        }, 1000);
    }
}
jQuery.noConflict();
if (Prototype.BrowserFeatures.ElementExtensions) {
    var disablePrototypeJS = function(method, pluginsToDisable) {
            var handler = function(event) {
                event.target[method] = undefined;
                setTimeout(function() {
                    delete event.target[method];
                }, 0);
            };
            pluginsToDisable.each(function(plugin) {
                jQuery(window).on(method + '.bs.' + plugin, handler);
            });
        },
        pluginsToDisable = ['collapse', 'dropdown', 'modal', 'tooltip', 'popover', 'tab'];
    disablePrototypeJS('show', pluginsToDisable);
    disablePrototypeJS('hide', pluginsToDisable);
}
jQuery(document).ready(function($) {
    $('.bs-example-tooltips').children().each(function() {
        $(this).tooltip();
    });
    $('.bs-example-popovers').children().each(function() {
        $(this).popover();
    });
});

function topCartListener(e) {
    var touch = e.touches[0];
    if (jQuery(touch.target).parents('.topCartContent').length == 0 && jQuery(touch.target).parents('.cart-button').length == 0 && !jQuery(touch.target).hasClass('cart-button')) {
        jQuery('.top-cart .block-title').removeClass('active');
        jQuery('.topCartContent').slideUp(500).removeClass('active');
        document.removeEventListener('touchstart', topCartListener, false);
    }
}

function topCart(isOnHover) {
    jQuery('header.header').each(function() {
        var thisHeader = jQuery(this);

        function standardMode() {
            thisHeader.find('.top-cart .block-title').off().on('click', function(event) {
                event.stopPropagation();
                jQuery(this).toggleClass('active');
                jQuery(this).next('.topCartContent').slideToggle(500).toggleClass('active');
                document.addEventListener('touchstart', topCartListener, false);
                jQuery(document).on('click.cartEvent', function(e) {
                    if (jQuery(e.target).parents('.topCartContent').length == 0) {
                        thisHeader.find('.top-cart .block-title').removeClass('active');
                        thisHeader.find('.topCartContent').slideUp(500).removeClass('active');
                        jQuery(document).off('click.cartEvent');
                    }
                });
            });
            thisHeader.find('.top-cart').off().on('mouseenter', function(event) {
                event.stopPropagation();
                jQuery(this).find('.block-title').addClass('hover');
            });
            thisHeader.find('.top-cart').on('mouseleave', function(event) {
                event.stopPropagation();
                jQuery(this).find('.block-title').removeClass('hover');
            });
        }
        if (isOnHover) {
            if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i))) {
                standardMode();
            } else {
                thisHeader.find('.top-cart').off().on('mouseenter mouseleave', function(event) {
                    event.stopPropagation();
                    jQuery(this).find('.block-title').toggleClass('active');
                    thisHeader.find('.topCartContent').stop().slideToggle(500).toggleClass('active');
                });
            }
        } else {
            standardMode();
        }
    });
}

function labelsHeight() {
    jQuery('.label-type-1 .label-new, .label-type-1 .label-sale').each(function() {
        labelNewWidth = jQuery(this).outerWidth();
        if (jQuery(this).parents('.label-type-1').length) {
            if (jQuery(this).hasClass('percentage')) {
                lineHeight = labelNewWidth - labelNewWidth * 0.22;
            } else {
                lineHeight = labelNewWidth;
            }
        } else {
            lineHeight = labelNewWidth;
        }
        jQuery(this).css({
            'height': labelNewWidth,
            'line-height': lineHeight + 'px'
        });
    });
}

function productImageSize() {
    if (jQuery('.product-image-zoom').length) {
        productImage = jQuery('.product-image-zoom #image');
        productImage.parent().animate({
            'height': productImage.height()
        }, 100, function() {
            productImage.addClass('loaded')
        }).parent().removeClass('loading');
        productImage.animate({
            'opacity': 1
        }, 100);
    }
}

function WideMenuTop() {
    if (jQuery(document.body).width() > 767) {
        setTimeout(function() {
            if (!jQuery('#header').hasClass('header-15')) {
                jQuery('.nav-wide li .menu-wrapper').each(function() {
                    WideMenuItemHeight = jQuery(this).parent().height();
                    WideMenuItemPos = jQuery(this).parent().position().top;
                    jQuery(this).css('top', (WideMenuItemHeight + WideMenuItemPos));
                });
            } else {
                jQuery('.nav-wide li .menu-wrapper, ul.topmenu:not(.nav-wide) li.level-top > ul').each(function() {
                    WideMenuItemPos = jQuery(this).parent().position().top;
                    jQuery(this).css('top', WideMenuItemPos);
                });
            }
        }, 100)
    } else {
        jQuery('.nav-wide li .menu-wrapper').css('top', 'auto');
    }
}

function header24Logo() {
    if (jQuery('#header.header-24').length) {
        var logo = jQuery('.logo-wrapper');
        logoClone = logo.clone().removeClass('clearfix');
        var logoClone = logoClone.wrap("<li class='item-logo level-top'></li>");
        var position = jQuery("#header.header-24 ul.topmenu li").length - 1;
        var i = 0;
        jQuery('#header.header-24 ul.topmenu li').each(function() {
            if (i == Math.floor(position / 2)) {
                jQuery(this).after(logoClone.parent());
            }
            i++;
        });
    }
}

function header24Logoswitcher() {
    if (jQuery('#header.header-24').length) {
        var logo = jQuery('.logo-wrapper');
        var logoMenu = jQuery('.topmenu .logo-wrapper');
        if (jQuery(document.body).width() > 1009) {
            logo.hide();
            logoMenu.show().parents('div.topmenu').show().animate({
                'opacity': 1
            }, 800);
        } else {
            logo.show().animate({
                'opacity': 1
            }, 800);
            logoMenu.hide();
        }
    }
}

function WideVerticalMenu() {
    if (jQuery('#header .vertical-menu-wrapper.default-open').length) {
        menuWrapper = jQuery('#header .vertical-menu-wrapper');
        if (jQuery('.home-sidebar.left').length) {
            leftSidebar = jQuery('.home-sidebar.left');
            if (jQuery(document.body).width() > 977) {
                sidebarPosition = menuWrapper.outerHeight();
                if (jQuery('.breadcrumbs-wrapper').length && !jQuery('.breadcrumbs-wrapper').hasClass('type-2') && !jQuery('.breadcrumbs-wrapper').hasClass('type-3')) {
                    jQuery('.breadcrumbs-inner').css('padding-left', menuWrapper.outerWidth() + 20);
                }
                jQuery('.vertical-menu-wrapper li.level1').each(function() {
                    if (jQuery(this).children('ul.level1').length) {
                        jQuery(this).addClass('parent');
                    }
                });
                leftSidebar.css('padding-top', sidebarPosition);
                menuWrapper.show();
            } else {
                menuWrapper.attr('style', '');
                leftSidebar.attr('style', '');
            }
        } else {
            menuWrapper.attr('style', '');
            jQuery('.vertical-menu-wrapper li.level1').each(function() {
                if (jQuery(this).children('ul.level1').length) {
                    jQuery(this).addClass('parent');
                }
            });
        }
    }
}
jQuery(window).load(function() {
    WideVerticalMenu();
    if (jQuery('body').hasClass('totop-button')) {
        (function($) {
            $.fn.UItoTop = function(options) {
                var defaults = {
                    min: 200,
                    inDelay: 600,
                    outDelay: 400,
                    containerID: 'toTop',
                    containerHoverID: 'toTopHover',
                    scrollSpeed: 1200,
                    easingType: 'linear'
                };
                var settings = $.extend(defaults, options);
                var containerIDhash = '#' + settings.containerID;
                var containerHoverIDHash = '#' + settings.containerHoverID;
                $('body').append('<a href="#" id="' + settings.containerID + '"></a>');
                $(containerIDhash).hide().click(function() {
                    $('html, body').animate({
                        scrollTop: 0
                    }, settings.scrollSpeed, settings.easingType);
                    $('#' + settings.containerHoverID, this).stop().animate({
                        'opacity': 0
                    }, settings.inDelay, settings.easingType);
                    return false;
                }).prepend('<span id="' + settings.containerHoverID + '"><i class="fa fa-angle-up"></i></span>')
                $(window).scroll(function() {
                    var sd = $(window).scrollTop();
                    if (typeof document.body.style.maxHeight === "undefined") {
                        $(containerIDhash).css({
                            'position': 'absolute',
                            'top': $(window).scrollTop() + $(window).height() - 50
                        });
                    }
                    if (sd > settings.min)
                        $(containerIDhash).fadeIn(settings.inDelay);
                    else
                        $(containerIDhash).fadeOut(settings.Outdelay);
                });
            };
        })(jQuery);
        jQuery().UItoTop();
    }

    function headerCustomer() {
        if (jQuery('#header .customer-name').length) {
            var custName = jQuery('#header .customer-name-wrapper');
            jQuery('#header .links').hide();
            jQuery('header#header .customer-name').removeClass('open');
            jQuery('header#header .customer-name + .links').slideUp(500);
            jQuery('header#header .links li').each(function() {
                jQuery(this).find('a').prepend('<i class="fa fa-circle" />').append('<span class="hover-divider" />');
            });

            function headerCustomerListener(e) {
                var touch = e.touches[0];
                if (jQuery(touch.target).parents('header#header .customer-name + .links').length == 0 && !jQuery(touch.target).hasClass('customer-name') && !jQuery(touch.target).parents('.customer-name').length) {
                    jQuery('header#header .customer-name').removeClass('open');
                    jQuery('header#header .customer-name + .links').slideUp(500);
                    document.removeEventListener('touchstart', headerCustomerListener, false);
                }
            }
            custName.parent().off().on('mouseenter', function(event) {
                event.stopPropagation();
                jQuery(this).children().addClass('hover');
            });
            custName.parent().on('mouseleave', function(event) {
                event.stopPropagation();
                jQuery(this).children().removeClass('hover');
            });
            custName.off().on('click', function(event) {
                event.stopPropagation();
                jQuery(this).toggleClass('open');
                var linksTop = custName.position().top + custName.outerHeight(true);
                jQuery('#header .links').slideToggle().css('top', linksTop);
                document.addEventListener('touchstart', headerCustomerListener, false);
                jQuery(document).on('click.headerCustomerEvent', function(e) {
                    if (jQuery(e.target).parents('header#header ul.links').length == 0) {
                        jQuery('header#header .customer-name').removeClass('open');
                        jQuery('header#header .customer-name + .links').slideUp(500);
                        jQuery(document).off('click.headerCustomerEvent');
                    }
                });
            });
        }
    }
    if (jQuery('.twitter-timeline').length) {
        jQuery('.twitter-timeline').contents().find('head').append('<style>body{color: #aaa} body .p-author .profile .p-name{color: #fff}</style>');
    }
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        jQuery('body').addClass('mobile-device');
        var mobileDevice = true;
    } else if (!navigator.userAgent.match(/Android/i)) {
        var mobileDevice = false;
    }
    var responsiveflag = false;
    var topSelectFlag = false;
    var menu_type = jQuery('#nav').attr('class');

    function mobile_menu(mode) {
        switch (mode) {
            case 'animate':
                if (!jQuery('div.topmenu').hasClass('mobile')) {
                    jQuery("div.topmenu").addClass('mobile');
                    jQuery('div.topmenu > ul').slideUp('fast');
                    if (jQuery('.lines-button').length) {
                        menuButton = jQuery('.lines-button');
                        menuButton.addClass('mobile');
                    } else {
                        menuButton = jQuery('.menu-button');
                    }
                    if (menuButton.length) {
                        menuButton.removeClass('active close');
                        var isActiveMenu = false;
                        var isMenuAnimation = false;
                        var isTouch = false;
                        if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i))) {
                            var isTouch = true;
                        }

                        function callEvent(event) {
                            event.stopPropagation();
                            if (isActiveMenu == false && !isMenuAnimation) {
                                menuButton.addClass('active close');
                                jQuery(this).addClass('active');
                                isMenuAnimation = true;
                                jQuery('div.topmenu').addClass('in');
                                jQuery('div.topmenu > ul').slideDown('medium', function() {
                                    isMenuAnimation = false;
                                });
                                isActiveMenu = true;
                                if (isTouch) {
                                    document.addEventListener('touchstart', mobMenuListener, false);
                                } else {
                                    jQuery(document).on('click.mobMenuEvent', function(e) {
                                        if (jQuery(e.target).parents('div.topmenu.mobile').length == 0) {
                                            closeMenu();
                                            document.removeEventListener('touchstart', mobMenuListener, false);
                                            jQuery(document).off('click.mobMenuEvent');
                                        }
                                    });
                                }
                            } else if (!isMenuAnimation) {
                                closeMenu();
                            }
                        }
                        if (!isTouch) {
                            menuButton.on('click.menu', function(event) {
                                callEvent(event);
                            });
                        } else {
                            if (jQuery('.lines-button').length) {
                                document.getElementsByClassName('lines-button')[0].addEventListener('touchstart', callEvent, false);
                            } else {
                                document.getElementsByClassName('menu-button')[0].addEventListener('touchstart', callEvent, false);
                            }
                        }

                        function closeMenu(eventSet) {
                            menuButton.removeClass('active close');
                            isMenuAnimation = true;
                            jQuery('div.topmenu').removeClass('in');
                            jQuery('div.topmenu > ul').slideUp('medium', function() {
                                isMenuAnimation = false;
                                isActiveMenu = false;
                            });
                            document.removeEventListener('touchstart', mobMenuListener, false);
                        }

                        function mobMenuListener(e) {
                            var touch = e.touches[0];
                            if (jQuery(touch.target).parents('div.topmenu.mobile').length == 0 && jQuery(touch.target).parents('.menu-button').length == 0 && !jQuery(touch.target).hasClass('menu-button')) {
                                closeMenu();
                            }
                        }
                    }
                    jQuery('div.topmenu > ul a').each(function() {
                        if (jQuery(this).next('ul').length || jQuery(this).next('div.menu-wrapper, div.vertical-menu-wrapper').length) {
                            jQuery(this).before('<span class="menu-item-button"><i class="fa fa-plus"></i><i class="fa fa-minus"></i></span>')
                            jQuery(this).next('ul').slideUp('fast');
                            jQuery(this).prev('.menu-item-button').on('click', function() {
                                jQuery(this).toggleClass('active');
                                jQuery(this).nextAll('ul, div.menu-wrapper, div.vertical-menu-wrapper').slideToggle('medium');
                            });
                        }
                    });
                }
                break;
            default:
                jQuery('div.topmenu').removeClass('mobile');
                jQuery('div.topmenu ul').attr('style', '');
                jQuery('.menu-button').off();
                jQuery('.lines-button').removeClass('mobile');
                jQuery('.menu-item-button').remove();
                if (!jQuery('.lines-button').hasClass('mobile')) {
                    jQuery('.lines-button').on('click', function() {
                        jQuery(this).toggleClass('close');
                        jQuery('.menu-block').toggleClass('open');
                        if (!jQuery('.menu-block').hasClass('open')) {
                            setTimeout(function() {
                                jQuery('.menu-block').attr('style', '').find('row').css('width', '1200px');
                            }, 500);
                        } else {
                            setTimeout(function() {
                                jQuery('.menu-block').css('overflow', 'visible').find('row').css('width', 'auto');
                            }, 500);
                        }
                    });
                }
        }
    }

    function backgroundWrapper() {
        if (jQuery('.background-wrapper').length) {
            jQuery('.background-wrapper').each(function() {
                var thisBg = jQuery(this);
                if (jQuery(document.body).width() < 768) {
                    thisBg.attr('style', '');
                    if (thisBg.parent().hasClass('text-banner') || thisBg.find('.text-banner').length) {
                        bgHeight = thisBg.parent().outerHeight();
                        thisBg.parent().css('height', bgHeight - 2);
                    }
                    if (jQuery('body').hasClass('boxed-layout')) {
                        bodyWidth = thisBg.parents('.container').outerWidth();
                        bgLeft = (bodyWidth - thisBg.parents('.container').width()) / 2;
                    } else {
                        bgLeft = thisBg.parent().offset().left;
                        bodyWidth = jQuery(document.body).width();
                    }
                    if (thisBg.data('bgColor')) {
                        bgColor = thisBg.data('bgColor');
                        thisBg.css('background-color', bgColor);
                    }
                    if (jQuery('body').hasClass('rtl')) {
                        setTimeout(function() {
                            thisBg.css({
                                'position': 'absolute',
                                'right': -bgLeft,
                                'width': bodyWidth
                            }).parent().css('position', 'relative');
                        }, 300);
                    } else {
                        setTimeout(function() {
                            thisBg.css({
                                'position': 'absolute',
                                'left': -bgLeft,
                                'width': bodyWidth
                            }).parent().css('position', 'relative');
                        }, 300);
                    }
                } else {
                    thisBg.attr('style', '');
                    if (jQuery('body').hasClass('boxed-layout')) {
                        bodyWidth = thisBg.parents('.container').outerWidth();
                        bgLeft = (bodyWidth - thisBg.parents('.container').width()) / 2;
                    } else {
                        bgLeft = thisBg.parent().offset().left;
                        bodyWidth = jQuery(document.body).width();
                    }
                    if (jQuery('body').hasClass('rtl')) {
                        thisBg.css({
                            'position': 'absolute',
                            'right': -bgLeft,
                            'width': bodyWidth
                        }).parent().css('position', 'relative');
                    } else {
                        thisBg.css({
                            'position': 'absolute',
                            'left': -bgLeft,
                            'width': bodyWidth
                        }).parent().css('position', 'relative');
                    }
                    if (thisBg.data('bgColor')) {
                        bgColor = thisBg.data('bgColor');
                        thisBg.css('background-color', bgColor);
                    }
                    if (thisBg.parent().hasClass('text-banner') || thisBg.find('.text-banner').length) {
                        bgHeight = thisBg.children().innerHeight();
                        thisBg.parent().css('height', bgHeight - 2);
                    }
                }
                if (thisBg.parent().hasClass('parallax-banners-wrapper')) {
                    jQuery('.parallax-banners-wrapper').each(function() {
                        block = jQuery(this).find('.text-banner');
                        var wrapper = jQuery(this);
                        var fullHeight = 0;
                        var imgCount = block.size();
                        var currentIndex = 0;
                        block.each(function() {
                            imgUrl = jQuery(this).css('background-image').replace(/url\(|\)|\"/ig, '');
                            if (imgUrl.indexOf('none') == -1) {
                                img = new Image;
                                img.src = imgUrl;
                                img.setAttribute("name", jQuery(this).attr('id'));
                                img.onload = function() {
                                    imgName = '#' + jQuery(this).attr('name');
                                    if (wrapper.data('fullscreen')) {
                                        windowHeight = document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
                                        jQuery(imgName).css({
                                            'height': windowHeight + 'px',
                                            'background-size': '100% 100%'
                                        });
                                        fullHeight += windowHeight;
                                    } else {
                                        jQuery(imgName).css('height', this.height + 'px');
                                        jQuery(imgName).css('height', (this.height - 200) + 'px');
                                        fullHeight += this.height - 200;
                                    }
                                    wrapper.css('height', fullHeight);
                                    currentIndex++;
                                    if (!jQuery('body').hasClass('mobile-device')) {
                                        if (currentIndex == imgCount) {
                                            if (jQuery(document.body).width() > 1278) {
                                                jQuery('#parallax-banner-1').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-2').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-3').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-4').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-5').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-6').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-7').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-8').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-9').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-10').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-11').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-12').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-13').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-14').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-15').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-16').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-17').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-18').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-19').parallax("60%", 0.7, false);
                                                jQuery('#parallax-banner-20').parallax("60%", 0.7, false);
                                            } else if (jQuery(document.body).width() > 977) {
                                                jQuery('#parallax-banner-1').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-2').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-3').parallax("60%", 0.9, false);
                                                jQuery('#parallax-banner-4').parallax("60%", 0.85, false);
                                                jQuery('#parallax-banner-5').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-6').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-7').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-8').parallax("60%", 0.9, false);
                                                jQuery('#parallax-banner-9').parallax("60%", 0.85, false);
                                                jQuery('#parallax-banner-10').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-11').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-12').parallax("60%", 0.9, false);
                                                jQuery('#parallax-banner-13').parallax("60%", 0.85, false);
                                                jQuery('#parallax-banner-14').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-15').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-16').parallax("60%", 0.9, false);
                                                jQuery('#parallax-banner-17').parallax("60%", 0.85, false);
                                                jQuery('#parallax-banner-18').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-19').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-20').parallax("60%", 0.9, false);
                                            } else if (jQuery(document.body).width() > 767) {
                                                jQuery('#parallax-banner-1').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-2').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-3').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-4').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-5').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-6').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-7').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-8').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-9').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-10').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-11').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-12').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-13').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-14').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-15').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-16').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-17').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-18').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-19').parallax("60%", 0.8, false);
                                                jQuery('#parallax-banner-20').parallax("60%", 0.8, false);
                                            } else {
                                                jQuery('#parallax-banner-1').parallax("30%", 0.5, true);
                                                jQuery('#parallax-banner-2').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-3').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-4').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-5').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-6').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-7').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-8').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-9').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-10').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-11').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-12').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-13').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-14').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-15').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-16').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-17').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-18').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-19').parallax("60%", 0.1, false);
                                                jQuery('#parallax-banner-20').parallax("60%", 0.1, false);
                                            }
                                        }
                                    }
                                }
                            }
                            bannerText = jQuery(this).find('.banner-content');
                            if (bannerText.data('top')) {
                                bannerText.css('top', bannerText.data('top'));
                            }
                            if (bannerText.data('left')) {
                                if (!bannerText.data('right')) {
                                    bannerText.css({
                                        'left': bannerText.data('left'),
                                        'right': 'auto'
                                    });
                                } else {
                                    bannerText.css('left', bannerText.data('left'));
                                }
                            }
                            if (bannerText.data('right')) {
                                if (!bannerText.data('left')) {
                                    bannerText.css({
                                        'right': bannerText.data('right'),
                                        'left': 'auto'
                                    });
                                } else {
                                    bannerText.css('right', bannerText.data('right'));
                                }
                            }
                        });
                    });
                    jQuery(window).scroll(function() {
                        jQuery('.parallax-banners-wrapper').each(function() {
                            block = jQuery(this).find('.text-banner');
                            block.each(function() {
                                var imagePos = jQuery(this).offset().top;
                                var topOfWindow = jQuery(window).scrollTop();
                                if (imagePos < topOfWindow + 600) {
                                    jQuery(this).addClass("slideup");
                                } else {
                                    jQuery(this).removeClass("slideup");
                                }
                            });
                        });
                    });
                    setTimeout(function() {
                        jQuery('#parallax-loading').fadeOut(200);
                    }, 1000);
                }
                thisBg.animate({
                    'opacity': 1
                }, 200)
            });
        }
    }

    function verticalHeader() {
        if (jQuery('#header').hasClass('header-15')) {
            windowHeight = jQuery(window).height();
            jQuery('.vertical-header').css('height', windowHeight).children('.custom-block').animate({
                'opacity': 1
            });
            if (jQuery(document.body).width() > 1007 && jQuery(document.body).width() <= 1374) {
                jQuery('.menu-button').off().on('click', function() {
                    jQuery('.topmenu').slideToggle().toggleClass('active');
                });
            }
            if (jQuery(document.body).width() <= 1007) {
                footerHeight = jQuery('.custom-block').outerHeight();
                jQuery('.content-wrapper').css('padding-bottom', footerHeight);
            } else {
                jQuery('.content-wrapper').attr('style', '');
            }
        }
    }

    function landscapeMenuButton() {
        if (jQuery('#header').hasClass('header-7') && jQuery('#header .menu-button').css('display') == 'block') {
            if (jQuery(document.body).width() > 1007 && jQuery(document.body).width() <= 1374) {
                jQuery('.menu-button').each(function() {
                    jQuery(this).parent().off().on('click', jQuery(this), function() {
                        header = jQuery(this).parents('header');
                        headerHeight = header.outerHeight();
                        jQuery(this).next('.navbar-collapse').find('.navbar-nav').css('top', headerHeight).slideToggle();
                    });
                });
            } else {
                jQuery('.navbar-collapse .navbar-nav').css({
                    'display': 'block',
                    'top': 'auto'
                });
            }
        }
    }
    if (jQuery('.product-tabs-widget').length) {
        function productTabs() {
            jQuery('ul.product-tabs').off().on('click', 'li:not(.current)', function() {
                jQuery(this).addClass('current').siblings().removeClass('current').parents('div.product-tabs-widget').find('div.product-tabs-box').eq(jQuery(this).index()).fadeIn(800).addClass('visible').siblings('div.product-tabs-box').hide().removeClass('visible');
                labelsHeight();
            });
            jQuery('.product-tabs-widget').each(function() {
                listHeight = jQuery(this).find('.product-tabs').outerHeight(true);
                if (jQuery(this).hasClass('top-buttons')) {
                    if (jQuery(this).find('.widget-title').length) {
                        if (jQuery(document.body).width() < 767) {
                            titleHeight = jQuery(this).find('.widget-title').innerHeight();
                            blockTopIndent = parseFloat(jQuery(this).css('padding-top'));
                            jQuery(this).find('.product-tabs').css('top', titleHeight + blockTopIndent + listHeight / 2 + 5)
                        } else {
                            jQuery(this).find('.product-tabs').attr('style', '');
                        }
                    }
                    jQuery(this).css('padding-top', listHeight);
                } else {
                    jQuery(this).css('padding-bottom', listHeight);
                }
            });
        }
        productTabs();
        jQuery(window).resize(function() {
            productTabs();
        });
    }

    function pageNotFound() {
        if (jQuery('.not-found-bg').data('bgimg')) {
            var bgImg = jQuery('.not-found-bg').data('bgimg');
            jQuery('.not-found-bg').attr('style', bgImg);
        }
    }

    function replacingClass() {
        if (jQuery(document.body).width() < 480) {
            mobile_menu('animate');
        }
        if (jQuery(document.body).width() > 479 && jQuery(document.body).width() < 768) {
            mobile_menu('animate');
        }
        if (jQuery(document.body).width() > 767 && jQuery(document.body).width() <= 1007) {
            mobile_menu('animate');
        }
        if (jQuery(document.body).width() > 1007 && jQuery(document.body).width() <= 1374) {
            mobile_menu('reset');
        }
        if (jQuery(document.body).width() > 1374) {
            mobile_menu('reset');
        }
    }
    headerCustomer();
    productImageSize();
    labelsHeight();
    replacingClass();
    backgroundWrapper();
    WideMenuTop();
    verticalHeader();
    landscapeMenuButton();
    pageNotFound();
    header24Logo();
    header24Logoswitcher();
    jQuery(window).resize(function() {
        headerCustomer();
        productImageSize();
        labelsHeight();
        replacingClass();
        backgroundWrapper();
        WideMenuTop();
        verticalHeader();
        landscapeMenuButton();
        header24Logoswitcher();
        WideVerticalMenu();
    });
    window.addEventListener("orientationchange", function() {
        landscapeMenuButton();
    }, false);
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)) || (navigator.userAgent.match(/Android/i))) {
        var mobileDevice = true;
    } else {
        var mobileDevice = false;
    }
    if (jQuery('.nav-wide').length) {
        jQuery('.nav-wide li.level-top').mouseenter(function() {
            jQuery(this).addClass('over');
            if (mobileDevice == true) {
                document.addEventListener('touchstart', wideMenuListener, false);
            }
        });
        jQuery('.nav-wide li.level-top').mouseleave(function() {
            jQuery(this).removeClass('over');
        });

        function wideMenuListener(e) {
            var touch = e.touches[0];
            if (jQuery(touch.target).parents('div.menu-wrapper').length == 0) {
                jQuery('.nav-wide li.level-top').removeClass('over');
                document.removeEventListener('touchstart', wideMenuListener, false);
            }
        }
        columnsWidth = function(columnsCount, currentGroupe) {
            if (currentGroupe.size() > 1) {
                currentGroupe.each(function() {
                    jQuery(this).css('width', (100 / currentGroupe.size()) + '%');
                });
            } else {
                currentGroupe.css('width', (100 / columnsCount) + '%');
            }
        }
        jQuery('.nav-wide .menu-wrapper').each(function() {
            columnsCount = jQuery(this).data('columns');
            items = jQuery(this).find('ul.level0 > li');
            groupsCount = items.size() / columnsCount;
            ratio = 1;
            for (i = 0; i < groupsCount; i++) {
                currentGroupe = items.slice((i * columnsCount), (columnsCount * ratio));
                columnsWidth(columnsCount, currentGroupe);
                ratio++;
            }
        });
        elements = jQuery('.nav-wide .menu-wrapper.default-menu ul.level0 li');
        if (elements.length) {
            elements.on('mouseenter mouseleave', function() {
                if (!jQuery('.nav-container').hasClass('mobile')) {
                    jQuery(this).children('ul').toggle();
                }
            });
            jQuery(window).resize(function() {
                if (!jQuery('.nav-container').hasClass('mobile')) {
                    elements.find('ul').hide();
                }
            });
            elements.each(function() {
                if (jQuery(this).children('ul').length) {
                    jQuery(this).addClass('parent');
                }
            });
            items = [];
            jQuery('.nav-wide li.level0').each(function() {
                if (jQuery(this).children('.default-menu').length) {
                    items.push(jQuery(this));
                }
            });
            jQuery(items).each(function() {
                jQuery(this).on('mouseenter mouseleave', function() {
                    if (jQuery(this).hasClass('over')) {
                        if (!jQuery('#header').hasClass('header-15')) {
                            if (!jQuery('body').hasClass('rtl')) {
                                jQuery(this).children('.default-menu').css({
                                    'top': jQuery(this).position().top + jQuery(this).height(),
                                    'left': jQuery(this).position().left
                                });
                            } else {
                                jQuery(this).children('.default-menu').css({
                                    'top': jQuery(this).position().top + jQuery(this).height(),
                                    'left': jQuery(this).position().left - (jQuery(this).children('.default-menu').width() - jQuery(this).width())
                                });
                            }
                        } else {
                            if (!jQuery('body').hasClass('rtl')) {
                                jQuery(this).children('.default-menu').css({
                                    'top': jQuery(this).position().top,
                                    'left': jQuery(this).position().left
                                });
                            } else {
                                jQuery(this).children('.default-menu').css({
                                    'top': jQuery(this).position().top,
                                    'left': jQuery(this).position().left - (jQuery(this).children('.default-menu').width() - jQuery(this).width())
                                });
                            }
                        }
                    } else {
                        jQuery(this).children('.default-menu').css('left', '-10000px');
                    }
                });
            });
        }
    }
});
jQuery(document).ready(function() {
    jQuery('.language-currency-block').on('click', function() {
        jQuery('.language-currency-block').toggleClass('open');
        jQuery('.language-currency-dropdown').slideToggle();
    });
    var isApple = false;
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
        isApple = true;

        function stickyPosition(clear) {
            items = jQuery('header.header, .backstretch');
            if (clear == false) {
                topIndent = jQuery(window).scrollTop();
                items.css({
                    'position': 'absolute',
                    'top': topIndent
                });
            } else {
                items.css({
                    'position': 'fixed',
                    'top': '0'
                });
            }
        }
        jQuery('.sticky-search header#sticky-header .form-search input').on('focusin focusout', function() {
            jQuery(this).toggleClass('focus');
            if (jQuery('header.header').hasClass('floating')) {
                if (jQuery(this).hasClass('focus')) {
                    setTimeout(function() {
                        stickyPosition(false);
                    }, 500);
                } else {
                    stickyPosition(true);
                }
            }
        });
    }
    if (jQuery('#sticky-header').length) {
        var headerHeight = jQuery('#header').height();
        var isDynamic = false;
        if (jQuery('#header .rev_slider').length) {
            isDynamic = true;
        }
        sticky = jQuery('#sticky-header');
        jQuery(window).on('scroll', function() {
            if (jQuery(document.body).width() > 977) {
                if (isDynamic) {
                    headerHeight = jQuery('#header').height();
                }
                if (!isApple) {
                    heightParam = headerHeight;
                } else {
                    heightParam = headerHeight * 2;
                }
                if (jQuery(this).scrollTop() >= heightParam) {
                    sticky.slideDown(100);
                    WideMenuTop();
                }
                if (jQuery(this).scrollTop() < headerHeight) {
                    sticky.hide();
                    WideMenuTop();
                }
            }
        });
    }
    jQuery('.header .search-button').each(function() {
        jQuery(this).off().on('click', function() {
            jQuery(this).next('.indent').slideToggle(300);
        });
    });
    jQuery(document).on('click', '*[data-toggle="lightbox"]:not([data-gallery="navigateTo"])', function(event) {
        event.preventDefault();
        jQuery(this).ekkoLightbox();
    });
    jQuery(document).delegate('*[data-gallery="navigateTo"]', 'click', function(event) {
        event.preventDefault();
        return jQuery(this).ekkoLightbox({
            onShown: function() {
                var a = this.modal_content.find('.modal-footer a');
                if (a.length > 0) {
                    a.click(function(e) {
                        e.preventDefault();
                        this.navigateTo(2);
                    }.bind(this));
                }
            }
        });
    });
    jQuery('.nav a.level-top').each(function() {});
    jQuery('ul.topmenu ul li').each(function() {
        if (jQuery(this).parents('.menu-wrapper:not(.default-menu)').length == 0) {
            if (jQuery(this).find('a i').length == 0) {
                jQuery(this).find('a span').before('<i class="fa fa-circle" />');
            }
        }
    });
    if (jQuery('.header .links').length && !jQuery('.menu-block .links').hasClass('default-links')) {
        linkLogin = jQuery('.header .links:not(.default-links) li a.top-link-login');
        if (!linkLogin.find('.fa.fa-key').length) {
            linkLogin.prepend('<i class="fa fa-key" />');
            linkLogin.off().on('mouseenter', function(event) {
                event.stopPropagation();
                jQuery(this).parent().addClass('hover');
            });
            linkLogin.on('mouseleave', function(event) {
                event.stopPropagation();
                jQuery(this).parent().removeClass('hover');
            });
        }
    }
    if (jQuery('.toolbar-bottom .pager .pages').length == 0 || jQuery('.products-list li.item.type-2').length) {
        jQuery('.toolbar-bottom').addClass('no-border');
    }
    if (jQuery('.footer-links-button').length) {
        jQuery('.footer-links-button').on('click', function() {
            jQuery(this).toggleClass('active').parent().find('ul').slideToggle(300);
        });
    }
    if (jQuery('.custom-block .mobile-button').length) {
        jQuery('.custom-block .mobile-button').click(function() {
            if (jQuery('.custom-block .indent').hasClass('active')) {
                jQuery(this).prev('.indent').removeClass('active').animate({
                    'opacity': 0,
                    'z-index': '-1',
                    'height': '0'
                });
            } else {
                jQuery(this).prev('.indent').addClass('active').animate({
                    'opacity': 1,
                    'z-index': '999',
                    'height': '100%'
                });
            }
        });
    }
    $$(".nav").each(function(this_nav) {
        new mainNav(this_nav, {
            "show_delay": "100",
            "hide_delay": "100"
        });
    });
    if (jQuery('body').hasClass('header-with-image') && jQuery('.catalog-product-view .product-buttons').length) {
        jQuery('.product-buttons').appendTo(jQuery('.breadcrumbs-inner'));
    }

    function toolbarPagination() {
        if (jQuery('.toolbar .pager .pages').length == 0 || jQuery('.toolbar .pager .pages').css('display') == 'none') {
            jQuery('.toolbar').addClass('no-pagination');
        }
    }
    toolbarPagination();

    function listingBanner() {
        if (jQuery('.listing-banner').length) {
            var mode = jQuery('.listing-banner').data('mode');
            var position = jQuery('.listing-banner').data('position');
            banner1 = jQuery('.listing-banner');
            banner = banner1.clone();
            banner = banner.wrap("<li class='item listing-banner-wrapper'></li>");
            banner.parent().hide();
            switch (mode) {
                case 'grid':
                    if (jQuery('.category-products .products-grid').length) {
                        banner.parent().show();
                        jQuery('.products-grid li.item:nth-of-type(' + (position - 1) + ')').after(banner.parent());
                    }
                    break;
                case 'list':
                    if (jQuery('.category-products .products-list').length) {
                        banner.parent().show();
                        jQuery('.products-list li.item:nth-of-type(' + (position - 1) + ')').after(banner.parent());
                    }
                    break;
            }
        }
    }
    listingBanner();
    if ('undefined' != typeof GeneralToolbar) {
        GeneralToolbar.onLoadingStart = function() {
            jQuery('#toolbar-loading').show();
        }
        GeneralToolbar.onLoadingFinish = function() {
            jQuery('#toolbar-loading').hide();
            toolbarPagination();
            listingBanner();
        }
        GeneralToolbar.onInit = function() {
            jQuery('.selectpicker').selectpicker('refresh');
            toolbarPagination();
            if ('undefined' != typeof ConfigurableSwatchesList) {
                ConfigurableSwatchesList.init();
            }
        }
        GeneralToolbar.onLoadingAutoScroll = function() {
            jQuery('#AjaxKit-InfiniteScroll').html(jQuery('.infinite-scroll-elements .infinite-scroll-loader'));
        }
        GeneralToolbar.onLoadingStaticScroll = function() {
            jQuery('#AjaxKit-InfiniteScroll').html(jQuery('.infinite-scroll-elements .infinite-scroll-loader'));
        }
        GeneralToolbar.onShowStaticScroll = function() {
            jQuery('#AjaxKit-InfiniteScroll').html(jQuery('.infinite-scroll-elements .infinite-scroll-button'));
        }
    } else {
        if ('undefined' != typeof ConfigurableSwatchesList) {
            jQuery(document).on('configurable-media-images-init', function() {
                ConfigurableSwatchesList.init();
            });
        }
    }
    if (typeof(AjaxImageLoader) !== 'undefined') {
        AjaxImageLoader.individualStart = function(this_image) {
            this_image.closest('.product-image').addClass('loading');
        };
        AjaxImageLoader.individualSuccess = function(this_image) {
            this_image.closest('.product-image').removeClass('loading');
        };
        AjaxImageLoader.init();
    }
});

function appendFont(href) {
    var link = document.createElement('link');
    link.href = href;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
}

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }
    var config = $.cookie = function(key, value, options) {
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }
            return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
        }
        var result = key ? undefined : {};
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            if (key && key === name) {
                result = read(cookie, value);
                break;
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }
        return result;
    };
    config.defaults = {};
    $.removeCookie = function(key, options) {
        if ($.cookie(key) !== undefined) {
            $.cookie(key, '', $.extend({}, options, {
                expires: -1
            }));
            return true;
        }
        return false;
    };
}));
(function() {
    "use strict";
    var $, EkkoLightbox;
    $ = jQuery;
    EkkoLightbox = function(element, options) {
        var content, footer, header, _this = this;
        this.options = $.extend({
            title: null,
            footer: null,
            remote: null
        }, $.fn.ekkoLightbox.defaults, options || {});
        this.$element = $(element);
        content = '';
        this.modal_id = this.options.modal_id ? this.options.modal_id : 'ekkoLightbox-' + Math.floor((Math.random() * 1000) + 1);
        header = '<div class="modal-header"' + (this.options.title || this.options.always_show_close ? '' : ' style="display:none"') + '><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + (this.options.title || "&nbsp;") + '</h4></div>';
        footer = '<div class="modal-footer"' + (this.options.footer ? '' : ' style="display:none"') + '>' + this.options.footer + '</div>';
        $(document.body).append('<div id="' + this.modal_id + '" class="ekko-lightbox modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content">' + header + '<div class="modal-body"><div class="ekko-lightbox-container"><div></div></div></div>' + footer + '</div></div></div>').css('padding-right', 0);
        this.modal = $('#' + this.modal_id);
        this.modal_dialog = this.modal.find('.modal-dialog').first();
        this.modal_content = this.modal.find('.modal-content').first();
        this.modal_body = this.modal.find('.modal-body').first();
        this.lightbox_container = this.modal_body.find('.ekko-lightbox-container').first();
        this.lightbox_body = this.lightbox_container.find('> div:first-child').first();
        this.modal_arrows = null;
        this.border = {
            top: parseFloat(this.modal_dialog.css('border-top-width')) + parseFloat(this.modal_content.css('border-top-width')) + parseFloat(this.modal_body.css('border-top-width')),
            right: parseFloat(this.modal_dialog.css('border-right-width')) + parseFloat(this.modal_content.css('border-right-width')) + parseFloat(this.modal_body.css('border-right-width')),
            bottom: parseFloat(this.modal_dialog.css('border-bottom-width')) + parseFloat(this.modal_content.css('border-bottom-width')) + parseFloat(this.modal_body.css('border-bottom-width')),
            left: parseFloat(this.modal_dialog.css('border-left-width')) + parseFloat(this.modal_content.css('border-left-width')) + parseFloat(this.modal_body.css('border-left-width'))
        };
        this.padding = {
            top: parseFloat(this.modal_dialog.css('padding-top')) + parseFloat(this.modal_content.css('padding-top')) + parseFloat(this.modal_body.css('padding-top')),
            right: parseFloat(this.modal_dialog.css('padding-right')) + parseFloat(this.modal_content.css('padding-right')) + parseFloat(this.modal_body.css('padding-right')),
            bottom: parseFloat(this.modal_dialog.css('padding-bottom')) + parseFloat(this.modal_content.css('padding-bottom')) + parseFloat(this.modal_body.css('padding-bottom')),
            left: parseFloat(this.modal_dialog.css('padding-left')) + parseFloat(this.modal_content.css('padding-left')) + parseFloat(this.modal_body.css('padding-left'))
        };
        this.modal.on('show.bs.modal', this.options.onShow.bind(this)).on('shown.bs.modal', function() {
            _this.modal_shown();
            return _this.options.onShown.call(_this);
        }).on('hide.bs.modal', this.options.onHide.bind(this)).on('hidden.bs.modal', function() {
            if (_this.gallery) {
                $(document).off('keydown.ekkoLightbox');
            }
            _this.modal.remove();
            return _this.options.onHidden.call(_this);
        }).modal('show', options);
        return this.modal;
    };
    EkkoLightbox.prototype = {
        modal_shown: function() {
            var video_id, _this = this;
            if (!this.options.remote) {
                return this.error('No remote target given');
            } else {
                this.gallery = this.$element.data('gallery');
                if (this.gallery) {
                    if (this.options.gallery_parent_selector === 'document.body' || this.options.gallery_parent_selector === '') {
                        this.gallery_items = $(document.body).find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
                    } else {
                        this.gallery_items = this.$element.parents(this.options.gallery_parent_selector).first().find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
                    }
                    this.gallery_index = this.gallery_items.index(this.$element);
                    $(document).on('keydown.ekkoLightbox', this.navigate.bind(this));
                    if (this.options.directional_arrows && this.gallery_items.length > 1) {
                        this.lightbox_container.prepend('<div class="ekko-lightbox-nav-overlay"><a href="#" class="prev">' + this.strip_stops(this.options.left_arrow_class) + '</a><a href="#" class="next">' + this.strip_stops(this.options.right_arrow_class) + '</a></div>');
                        this.modal_arrows = this.lightbox_container.find('div.ekko-lightbox-nav-overlay').first();
                        this.lightbox_container.find('a.prev').on('click', function(event) {
                            event.preventDefault();
                            return _this.navigate_left();
                        });
                        this.lightbox_container.find('a.next').on('click', function(event) {
                            event.preventDefault();
                            return _this.navigate_right();
                        });
                    }
                }
                if (this.options.type) {
                    if (this.options.type === 'image') {
                        return this.preloadImage(this.options.remote, true);
                    } else if (this.options.type === 'youtube' && (video_id = this.getYoutubeId(this.options.remote))) {
                        return this.showYoutubeVideo(video_id);
                    } else if (this.options.type === 'vimeo') {
                        return this.showVimeoVideo(this.options.remote);
                    } else if (this.options.type === 'instagram') {
                        return this.showInstagramVideo(this.options.remote);
                    } else if (this.options.type === 'url') {
                        return this.showInstagramVideo(this.options.remote);
                    } else {
                        return this.error("Could not detect remote target type. Force the type using data-type=\"image|youtube|vimeo|url\"");
                    }
                } else {
                    return this.detectRemoteType(this.options.remote);
                }
            }
        },
        strip_stops: function(str) {
            return str.replace(/\./g, '');
        },
        strip_spaces: function(str) {
            return str.replace(/\s/g, '');
        },
        isImage: function(str) {
            return str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },
        isSwf: function(str) {
            return str.match(/\.(swf)((\?|#).*)?$/i);
        },
        getYoutubeId: function(str) {
            var match;
            match = str.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
            if (match && match[2].length === 11) {
                return match[2];
            } else {
                return false;
            }
        },
        getVimeoId: function(str) {
            if (str.indexOf('vimeo') > 0) {
                return str;
            } else {
                return false;
            }
        },
        getInstagramId: function(str) {
            if (str.indexOf('instagram') > 0) {
                return str;
            } else {
                return false;
            }
        },
        navigate: function(event) {
            event = event || window.event;
            if (event.keyCode === 39 || event.keyCode === 37) {
                if (event.keyCode === 39) {
                    return this.navigate_right();
                } else if (event.keyCode === 37) {
                    return this.navigate_left();
                }
            }
        },
        navigateTo: function(index) {
            var next, src;
            if (index < 0 || index > this.gallery_items.length - 1) {
                return this;
            }
            this.gallery_index = index;
            this.options.onNavigate.call(this, this.gallery_index);
            this.$element = $(this.gallery_items.get(this.gallery_index));
            this.updateTitleAndFooter();
            src = this.$element.attr('data-remote') || this.$element.attr('href');
            this.detectRemoteType(src, this.$element.attr('data-type') || false);
            if (this.gallery_index + 1 < this.gallery_items.length) {
                next = $(this.gallery_items.get(this.gallery_index + 1), false);
                src = next.attr('data-remote') || next.attr('href');
                if (next.attr('data-type') === 'image' || this.isImage(src)) {
                    return this.preloadImage(src, false);
                }
            }
        },
        navigate_left: function() {
            if (this.gallery_items.length === 1) {
                return;
            }
            if (this.gallery_index === 0) {
                this.gallery_index = this.gallery_items.length - 1;
            } else {
                this.gallery_index--;
            }
            this.options.onNavigate.call(this, 'left', this.gallery_index);
            return this.navigateTo(this.gallery_index);
        },
        navigate_right: function() {
            if (this.gallery_items.length === 1) {
                return;
            }
            if (this.gallery_index === this.gallery_items.length - 1) {
                this.gallery_index = 0;
            } else {
                this.gallery_index++;
            }
            this.options.onNavigate.call(this, 'right', this.gallery_index);
            return this.navigateTo(this.gallery_index);
        },
        detectRemoteType: function(src, type) {
            var video_id;
            if (type === 'image' || this.isImage(src)) {
                this.options.type = 'image';
                return this.preloadImage(src, true);
            } else if (type === 'youtube' || (video_id = this.getYoutubeId(src))) {
                this.options.type = 'youtube';
                return this.showYoutubeVideo(video_id);
            } else if (type === 'vimeo' || (video_id = this.getVimeoId(src))) {
                this.options.type = 'vimeo';
                return this.showVimeoVideo(video_id);
            } else if (type === 'instagram' || (video_id = this.getInstagramId(src))) {
                this.options.type = 'instagram';
                return this.showInstagramVideo(video_id);
            } else if (type === 'url' || (video_id = this.getInstagramId(src))) {
                this.options.type = 'instagram';
                return this.showInstagramVideo(video_id);
            } else {
                this.options.type = 'url';
                return this.loadRemoteContent(src);
            }
        },
        updateTitleAndFooter: function() {
            var caption, footer, header, title;
            header = this.modal_content.find('.modal-header');
            footer = this.modal_content.find('.modal-footer');
            title = this.$element.data('title') || "";
            caption = this.$element.data('footer') || "";
            if (title || this.options.always_show_close) {
                header.css('display', '').find('.modal-title').html(title || "&nbsp;");
            } else {
                header.css('display', 'none');
            }
            if (caption) {
                footer.css('display', '').html(caption);
            } else {
                footer.css('display', 'none');
            }
            return this;
        },
        showLoading: function() {
            this.lightbox_body.html('<div class="modal-loading">Loading..</div>');
            return this;
        },
        showYoutubeVideo: function(id) {
            var aspectRatio, height, width;
            aspectRatio = 560 / 315;
            width = this.$element.data('width') || 560;
            width = this.checkDimensions(width);
            height = width / aspectRatio;
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + id + '?badge=0&autoplay=1&html5=1" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        showVimeoVideo: function(id) {
            var aspectRatio, height, width;
            aspectRatio = 500 / 281;
            width = this.$element.data('width') || 560;
            width = this.checkDimensions(width);
            height = width / aspectRatio;
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + height + '" src="' + id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        showInstagramVideo: function(id) {
            var width;
            width = this.$element.data('width') || 612;
            width = this.checkDimensions(width);
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + width + '" src="' + this.addTrailingSlash(id) + 'embed/" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        loadRemoteContent: function(url) {
            var disableExternalCheck, width, _this = this;
            width = this.$element.data('width') || 560;
            this.resize(width);
            disableExternalCheck = this.$element.data('disableExternalCheck') || false;
            if (!disableExternalCheck && !this.isExternal(url)) {
                this.lightbox_body.load(url, $.proxy(function() {
                    return _this.$element.trigger('loaded.bs.modal');
                }));
            } else {
                this.lightbox_body.html('<iframe width="' + width + '" height="' + width + '" src="' + url + '" frameborder="0" allowfullscreen></iframe>');
                this.options.onContentLoaded.call(this);
            }
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'block');
            }
        },
        isExternal: function(url) {
            var match;
            match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
            if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) {
                return true;
            }
            if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + {
                    "http:": 80,
                    "https:": 443
                }[location.protocol] + ")?$"), "") !== location.host) {
                return true;
            }
            return false;
        },
        error: function(message) {
            this.lightbox_body.html(message);
            return this;
        },
        preloadImage: function(src, onLoadShowImage) {
            var img, _this = this;
            img = new Image();
            if ((onLoadShowImage == null) || onLoadShowImage === true) {
                img.onload = function() {
                    var image;
                    image = $('<img />');
                    image.attr('src', img.src);
                    image.addClass('img-responsive');
                    _this.lightbox_body.html(image);
                    if (_this.modal_arrows) {
                        _this.modal_arrows.css('display', 'block');
                    }
                    _this.resize(img.width);
                    return _this.options.onContentLoaded.call(_this);
                };
                img.onerror = function() {
                    return _this.error('Failed to load image: ' + src);
                };
            }
            img.src = src;
            return img;
        },
        resize: function(width) {
            var thisElem = this;
            var ratio;
            var windowHeight;
            var width_total;
            var headerHeight;
            var footerHeight;
            var modalMargin;

            function imageResize() {
                width_total = width + thisElem.border.left + thisElem.padding.left + thisElem.padding.right + thisElem.border.right;
                ratio = thisElem.lightbox_container.find('img').width() / thisElem.lightbox_container.find('img').height();
                headerHeight = thisElem.modal_dialog.find('.modal-header').outerHeight();
                footerHeight = thisElem.modal_dialog.find('.modal-footer').outerHeight();
                modalMargin = parseFloat(thisElem.modal_dialog.css('margin-top'));
                windowHeight = $(window).height() - (headerHeight + footerHeight + (modalMargin * 2));
                thisElem.modal_dialog.find('img').css({
                    'height': windowHeight,
                    'max-width': (windowHeight - (thisElem.border.left + thisElem.padding.left + thisElem.padding.right + thisElem.border.right)) * ratio
                });
                thisElem.modal_dialog.css('width', 'auto').css('max-width', windowHeight * ratio);
                if ($(document.body).width() > 768) {
                    if (thisElem.modal_dialog.find('img').width() > 200) {
                        thisElem.modal_dialog.find('img').css({
                            'height': windowHeight,
                            'max-width': windowHeight * ratio
                        });
                        thisElem.modal_dialog.css('width', 'auto').css('max-width', (windowHeight * ratio) + thisElem.border.left + thisElem.padding.left + thisElem.padding.right + thisElem.border.right);
                    } else {
                        thisElem.modal_dialog.find('img').css({
                            'max-width': 200,
                            'height': 200 / ratio
                        });
                        thisElem.modal_dialog.css('width', 'auto').css('max-width', (200 / ratio) + thisElem.border.left + thisElem.padding.left + thisElem.padding.right + thisElem.border.right);
                    }
                } else {
                    thisElem.modal_dialog.find('img').attr('style', '');
                    thisElem.modal_dialog.css('width', 'auto').css('max-width', width_total);
                }
                thisElem.lightbox_container.find('a').css('padding-top', function() {
                    return $(this).parent().height() / 2;
                });
                return this;
            }
            imageResize();
            $(window).resize(function() {
                imageResize();
            });
        },
        checkDimensions: function(width) {
            var body_width, width_total;
            width_total = width + this.border.left + this.padding.left + this.padding.right + this.border.right;
            body_width = document.body.clientWidth;
            if (width_total > body_width) {
                width = this.modal_body.width();
            }
            return width;
        },
        close: function() {
            return this.modal.modal('hide');
        },
        addTrailingSlash: function(url) {
            if (url.substr(-1) !== '/') {
                url += '/';
            }
            return url;
        }
    };
    $.fn.ekkoLightbox = function(options) {
        return this.each(function() {
            var $this;
            $this = $(this);
            options = $.extend({
                remote: $this.attr('data-remote') || $this.attr('href'),
                gallery_parent_selector: $this.attr('data-parent'),
                type: $this.attr('data-type')
            }, options, $this.data());
            new EkkoLightbox(this, options);
            return this;
        });
    };
    $.fn.ekkoLightbox.defaults = {
        gallery_parent_selector: '*:not(.row)',
        left_arrow_class: '<i class="fa fa-angle-left"></i>',
        right_arrow_class: '<i class="fa fa-angle-right"></i>',
        directional_arrows: true,
        type: null,
        always_show_close: true,
        onShow: function() {},
        onShown: function() {},
        onHide: function() {},
        onHidden: function() {},
        onNavigate: function() {},
        onContentLoaded: function() {}
    };
}).call(this);
if (typeof Object.create !== "function") {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function($, window, document) {
    var Carousel = {
        init: function(options, el) {
            var base = this;
            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarousel.options, base.$elem.data(), options);
            base.userOptions = options;
            base.loadContent();
        },
        loadContent: function() {
            var base = this,
                url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }
            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }
            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },
        logIn: function() {
            var base = this;
            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));
            base.$elem.css({
                opacity: 0
            });
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },
        setVars: function() {
            var base = this;
            if (base.$elem.children().length === 0) {
                return false;
            }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },
        onStartup: function() {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();
            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();
            base.$elem.find(".owl-wrapper").css("display", "block");
            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }
        },
        eachMoveUpdate: function() {
            var base = this;
            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();
            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },
        updateVars: function() {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },
        reload: function() {
            var base = this;
            window.setTimeout(function() {
                base.updateVars();
            }, 0);
        },
        watchVisibility: function() {
            var base = this;
            if (base.$elem.is(":visible") === false) {
                base.$elem.css({
                    opacity: 0
                });
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function() {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({
                        opacity: 1
                    }, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },
        wrapItems: function() {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">");
            base.$elem.find(".owl-wrapper li.item").addClass('owl-item');
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },
        baseClass: function() {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);
            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }
            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },
        updateItems: function() {
            var base = this,
                width, i;
            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }
            width = $(base.options.responsiveBaseWidth).width();
            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                base.options.itemsCustom.sort(function(a, b) {
                    return a[0] - b[0];
                });
                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }
            } else {
                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }
                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }
                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }
                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }
                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },
        response: function() {
            var base = this,
                smallDelay, lastWindowWidth;
            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();
            base.resizer = function() {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function() {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },
        updatePosition: function() {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },
        appendItemsSizes: function() {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;
            base.$owlItems.each(function(index) {
                var $this = $(this);
                $this.css({
                    "width": base.itemWidth
                }).data("owl-item", Number(index));
                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },
        appendWrapperSizes: function() {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;
            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },
        calculateAll: function() {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },
        calculateWidth: function() {
            var base = this;
            base.itemWidth = Math.round(base.$elem.width() / base.options.items);
        },
        max: function() {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth) - base.options.items * base.itemWidth) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },
        min: function() {
            return 0;
        },
        loops: function() {
            var base = this,
                prev = 0,
                elWidth = 0,
                i, item, roundPageNum;
            base.positionsInArray = [0];
            base.pagesInArray = [];
            for (i = 0; i < base.itemsAmount; i += 1) {
                elWidth += base.itemWidth;
                base.positionsInArray.push(-elWidth);
                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },
        buildControls: function() {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },
        buildButtons: function() {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);
            base.buttonPrev = $("<div/>", {
                "class": "owl-prev",
                "html": base.options.navigationText[0] || ""
            });
            base.buttonNext = $("<div/>", {
                "class": "owl-next",
                "html": base.options.navigationText[1] || ""
            });
            buttonsWrapper.append(base.buttonPrev).append(base.buttonNext);
            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function(event) {
                event.preventDefault();
            });
            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function(event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },
        buildPagination: function() {
            var base = this;
            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);
            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function(event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },
        updatePagination: function() {
            var base = this,
                counter, lastPage, lastItem, i, paginationButton, paginationButtonInner;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.html("");
            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;
            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class": "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);
                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);
                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination: function() {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function() {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper.find(".owl-page").removeClass("active");
                    $(this).addClass("active");
                }
            });
        },
        checkNavigation: function() {
            var base = this;
            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },
        updateControls: function() {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },
        destroyControls: function() {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },
        next: function(speed) {
            var base = this;
            if (base.isTransition) {
                return false;
            }
            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },
        prev: function(speed) {
            var base = this;
            if (base.isTransition) {
                return false;
            }
            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },
        goTo: function(position, speed, drag) {
            var base = this,
                goToPixel;
            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];
            if (base.browser.support3d === true) {
                base.isCss3Finish = false;
                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);
                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function() {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },
        jumpTo: function(position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },
        afterGo: function() {
            var base = this;
            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);
            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();
                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }
            }
            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },
        stop: function() {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },
        checkAp: function() {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },
        play: function() {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function() {
                base.next(true);
            }, base.options.autoPlay);
        },
        swapSpeed: function(action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },
        addCssSpeed: function(speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },
        removeTransition: function() {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },
        doTranslate: function(pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },
        transition3d: function(value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },
        css2move: function(value) {
            var base = this;
            base.$owlWrapper.css({
                "left": value
            });
        },
        css2slide: function(value, speed) {
            var base = this;
            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left": value
            }, {
                duration: speed || base.options.slideSpeed,
                complete: function() {
                    base.isCssFinish = true;
                }
            });
        },
        checkBrowser: function() {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex, asSupport, support3d, isTouch;
            tempElem.style.cssText = "  -moz-transform:" + translate3D + "; -ms-transform:" + translate3D + "; -o-transform:" + translate3D + "; -webkit-transform:" + translate3D + "; transform:" + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);
            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;
            base.browser = {
                "support3d": support3d,
                "isTouch": isTouch
            };
        },
        moveEvents: function() {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },
        eventTypes: function() {
            var base = this,
                types = ["s", "e", "x"];
            base.ev_types = {};
            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = ["touchstart.owl mousedown.owl", "touchmove.owl mousemove.owl", "touchend.owl touchcancel.owl mouseup.owl"];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = ["touchstart.owl", "touchmove.owl", "touchend.owl touchcancel.owl"];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = ["mousedown.owl", "mousemove.owl", "mouseup.owl"];
            }
            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },
        disabledEvents: function() {
            var base = this;
            base.$elem.on("dragstart.owl", function(event) {
                event.preventDefault();
            });
            base.$elem.on("mousedown.disableTextSelect", function(e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },
        gestures: function() {
            var base = this,
                locals = {
                    offsetX: 0,
                    offsetY: 0,
                    baseElWidth: 0,
                    relativePos: 0,
                    position: null,
                    minSwipe: null,
                    maxSwipe: null,
                    sliding: null,
                    dargging: null,
                    targetElement: null
                };
            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x: event.touches[0].pageX,
                        y: event.touches[0].pageY
                    };
                }
                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x: event.pageX,
                            y: event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x: event.clientX,
                            y: event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;
                if (ev.which === 3) {
                    return false;
                }
                if (base.itemsAmount <= base.options.items) {
                    return;
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }
                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }
                base.newPosX = 0;
                base.newRelativeX = 0;
                $(this).css(base.removeTransition());
                position = $(this).position();
                locals.relativePos = position.left;
                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;
                swapEvents("on");
                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe, maxSwipe;
                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;
                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }
                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }
                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false) {
                    $(document).off("touchmove.owl");
                }
                minSwipe = function() {
                    return base.newRelativeX / 5;
                };
                maxSwipe = function() {
                    return base.maximumPixels + base.newRelativeX / 5;
                };
                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition, handlers, owlStopEvent;
                ev.target = ev.target || ev.srcElement;
                locals.dragging = false;
                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }
                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }
                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function(ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },
        getNewPosition: function() {
            var base = this,
                newPosition = base.closestItem();
            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem: function() {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;
            $.each(array, function(i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },
        moveDirection: function() {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },
        customEvents: function() {
            var base = this;
            base.$elem.on("owl.next", function() {
                base.next();
            });
            base.$elem.on("owl.prev", function() {
                base.prev();
            });
            base.$elem.on("owl.play", function(event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function() {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function(event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function(event, item) {
                base.jumpTo(item);
            });
        },
        stopOnHover: function() {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function() {
                    base.stop();
                });
                base.$elem.on("mouseout", function() {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },
        lazyLoad: function() {
            var base = this,
                i, $item, itemNumber, $lazyImg, follow;
            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);
                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }
                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");
                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },
        lazyPreload: function($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;
            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(600);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }
            checkLazyImage();
        },
        autoHeight: function() {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function() {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) {
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", "");
                }
            }
            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },
        completeImg: function(img) {
            var naturalWidthType;
            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },
        onVisibleItems: function() {
            var base = this,
                i;
            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }
            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);
                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },
        transitionTypes: function(className) {
            var base = this;
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },
        singleItemTransition: function() {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';
            base.isTransition = true;
            base.$owlWrapper.addClass('owl-origin').css({
                "-webkit-transform-origin": origin + "px",
                "-moz-perspective-origin": origin + "px",
                "perspective-origin": origin + "px"
            });

            function transStyles(prevPos) {
                return {
                    "position": "relative",
                    "left": prevPos + "px"
                };
            }
            $prevItem.css(transStyles(prevPos, 10)).addClass(outClass).on(animEnd, function() {
                base.endPrev = true;
                $prevItem.off(animEnd);
                base.clearTransStyle($prevItem, outClass);
            });
            $currentItem.addClass(inClass).on(animEnd, function() {
                base.endCurrent = true;
                $currentItem.off(animEnd);
                base.clearTransStyle($currentItem, inClass);
            });
        },
        clearTransStyle: function(item, classToRemove) {
            var base = this;
            item.css({
                "position": "",
                "left": ""
            }).removeClass(classToRemove);
            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },
        owlStatus: function() {
            var base = this;
            base.owl = {
                "userOptions": base.userOptions,
                "baseElement": base.$elem,
                "userItems": base.$userItems,
                "owlItems": base.$owlItems,
                "currentItem": base.currentItem,
                "prevItem": base.prevItem,
                "visibleItems": base.visibleItems,
                "isTouch": base.browser.isTouch,
                "browser": base.browser,
                "dragDirection": base.dragDirection
            };
        },
        clearEvents: function() {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },
        unWrap: function() {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem.attr("style", base.$elem.data("owl-originalStyles") || "").attr("class", base.$elem.data("owl-originalClasses"));
        },
        destroy: function() {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },
        reinit: function(newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },
        addItem: function(htmlString, targetPosition) {
            var base = this,
                position;
            if (!htmlString) {
                return false;
            }
            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }
            base.setVars();
        },
        removeItem: function(targetPosition) {
            var base = this,
                position;
            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }
    };
    $.fn.owlCarousel = function(options) {
        return this.each(function() {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarousel", carousel);
        });
    };
    $.fn.owlCarousel.options = {
        items: 5,
        itemsCustom: false,
        itemsDesktop: [1199, 4],
        itemsDesktopSmall: [979, 3],
        itemsTablet: [768, 2],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        itemsScaleUp: false,
        slideSpeed: 200,
        paginationSpeed: 800,
        rewindSpeed: 1000,
        autoPlay: false,
        stopOnHover: false,
        navigation: false,
        navigationText: ["prev", "next"],
        rewindNav: true,
        scrollPerPage: false,
        pagination: true,
        paginationNumbers: false,
        responsive: true,
        responsiveRefreshRate: 200,
        responsiveBaseWidth: window,
        baseClass: "owl-carousel",
        theme: "owl-theme",
        lazyLoad: false,
        lazyFollow: true,
        lazyEffect: "fade",
        autoHeight: false,
        jsonPath: false,
        jsonSuccess: false,
        dragBeforeAnimFinish: true,
        mouseDrag: true,
        touchDrag: true,
        addClassActive: false,
        transitionStyle: false,
        beforeUpdate: false,
        afterUpdate: false,
        beforeInit: false,
        afterInit: false,
        beforeMove: false,
        afterMove: false,
        afterAction: false,
        startDragging: false,
        afterLazyLoad: false
    };
}(jQuery, window, document));