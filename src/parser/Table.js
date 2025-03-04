"use strict";
exports.__esModule = true;
exports.Table = void 0;
var utils_1 = require("./utils");
var Table = /** @class */ (function () {
    function Table(initialiser) {
        this.numValues = [undefined];
        this.strValues = {};
        this.keys = [];
        this.values = [];
        this.metatable = null;
        if (initialiser === undefined)
            return;
        if (typeof initialiser === 'function') {
            initialiser(this);
            return;
        }
        if (Array.isArray(initialiser)) {
            this.insert.apply(this, initialiser);
            return;
        }
        for (var key in initialiser) {
            if (utils_1.hasOwnProperty(initialiser, key)) {
                var value = initialiser[key];
                if (value === null)
                    value = undefined;
                this.set(key, value);
            }
        }
        var proto = Object.getPrototypeOf(initialiser);
        Object.getOwnPropertyNames(proto).forEach((method) => {
            if (typeof initialiser[method] === "function" && method !== "constructor") {
                this.set(method, initialiser[method].bind(initialiser));
            }
        });
    }
    Table.prototype.get = function (key) {
        var value = this.rawget(key);
        if (value === undefined && this.metatable) {
            var mm = this.metatable.get('__index');
            if (mm instanceof Table) {
                return mm.get(key);
            }
            if (typeof mm === 'function') {
                var v = mm.call(undefined, this, key);
                return v instanceof Array ? v[0] : v;
            }
        }
        return value;
    };
    Table.prototype.rawget = function (key) {
        switch (typeof key) {
            case 'string':
                if (utils_1.hasOwnProperty(this.strValues, key)) {
                    return this.strValues[key];
                }
                break;
            case 'number':
                if (key > 0 && key % 1 === 0) {
                    return this.numValues[key];
                }
        }
        var index = this.keys.indexOf(utils_1.tostring(key));
        return index === -1 ? undefined : this.values[index];
    };
    Table.prototype.getMetaMethod = function (name) {
        return this.metatable && this.metatable.rawget(name);
    };
    Table.prototype.set = function (key, value) {
        var mm = this.metatable && this.metatable.get('__newindex');
        if (mm) {
            var oldValue = this.rawget(key);
            if (oldValue === undefined) {
                if (mm instanceof Table) {
                    return mm.set(key, value);
                }
                if (typeof mm === 'function') {
                    return mm(this, key, value);
                }
            }
        }
        this.rawset(key, value);
    };
    Table.prototype.setFn = function (key) {
        var _this = this;
        return function (v) { return _this.set(key, v); };
    };
    Table.prototype.rawset = function (key, value) {
        switch (typeof key) {
            case 'string':
                this.strValues[key] = value;
                return;
            case 'number':
                if (key > 0 && key % 1 === 0) {
                    this.numValues[key] = value;
                    return;
                }
        }
        var K = utils_1.tostring(key);
        var index = this.keys.indexOf(K);
        if (index > -1) {
            this.values[index] = value;
            return;
        }
        this.values[this.keys.length] = value;
        this.keys.push(K);
    };
    Table.prototype.insert = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.numValues).push.apply(_a, values);
    };
    Table.prototype.toObject = function () {
        var outputAsArray = Object.keys(this.strValues).length === 0 && this.getn() > 0;
        var result = outputAsArray ? [] : {};
        for (var i = 1; i < this.numValues.length; i++) {
            var propValue = this.numValues[i];
            var value = propValue instanceof Table ? propValue.toObject() : propValue;
            if (outputAsArray) {
                var res = result;
                res[i - 1] = value;
            }
            else {
                var res = result;
                res[String(i - 1)] = value;
            }
        }
        for (var key in this.strValues) {
            if (utils_1.hasOwnProperty(this.strValues, key)) {
                var propValue = this.strValues[key];
                var value = propValue instanceof Table ? propValue.toObject() : propValue;
                var res = result;
                res[key] = value;
            }
        }
        return result;
    };
    Table.prototype.getn = function () {
        var vals = this.numValues;
        var keys = [];
        for (var i in vals) {
            if (utils_1.hasOwnProperty(vals, i)) {
                keys[i] = true;
            }
        }
        var j = 0;
        while (keys[j + 1]) {
            j += 1;
        }
        // Following translated from ltable.c (http://www.lua.org/source/5.3/ltable.c.html)
        if (j > 0 && vals[j] === undefined) {
            /* there is a boundary in the array part: (binary) search for it */
            var i = 0;
            while (j - i > 1) {
                var m = Math.floor((i + j) / 2);
                if (vals[m] === undefined) {
                    j = m;
                }
                else {
                    i = m;
                }
            }
            return i;
        }
        return j;
    };
    return Table;
}());
exports.Table = Table;
