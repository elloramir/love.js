"use strict";
exports.__esModule = true;
exports.hasOwnProperty = exports.ensureArray = exports.coerceArgToFunction = exports.coerceArgToTable = exports.coerceArgToString = exports.coerceArgToNumber = exports.coerceToString = exports.coerceToNumber = exports.coerceToBoolean = exports.posrelat = exports.tostring = exports.type = void 0;
var LuaError_1 = require("./LuaError");
var Table_1 = require("./Table");
/** Pattern to identify a float string value that can validly be converted to a number in Lua */
var FLOATING_POINT_PATTERN = /^[-+]?[0-9]*\.?([0-9]+([eE][-+]?[0-9]+)?)?$/;
/** Pattern to identify a hex string value that can validly be converted to a number in Lua */
var HEXIDECIMAL_CONSTANT_PATTERN = /^(-)?0x([0-9a-fA-F]*)\.?([0-9a-fA-F]*)$/;
function type(v) {
    var t = typeof v;
    switch (t) {
        case 'undefined':
            return 'nil';
        case 'number':
        case 'string':
        case 'boolean':
        case 'function':
            return t;
        case 'object':
            if (v instanceof Table_1.Table)
                return 'table';
            if (v instanceof Function)
                return 'function';
    }
}
exports.type = type;
function tostring(v) {
    if (v instanceof Table_1.Table) {
        var mm = v.getMetaMethod('__tostring');
        if (mm)
            return mm(v)[0];
        return valToStr(v, 'table: 0x');
    }
    if (v instanceof Function) {
        return valToStr(v, 'function: 0x');
    }
    return coerceToString(v);
    function valToStr(v, prefix) {
        var s = v.toString();
        if (s.indexOf(prefix) > -1)
            return s;
        var str = prefix + Math.floor(Math.random() * 0xffffffff).toString(16);
        v.toString = function () { return str; };
        return str;
    }
}
exports.tostring = tostring;
/* translate a relative string position: negative means back from end */
function posrelat(pos, len) {
    if (pos >= 0)
        return pos;
    if (-pos > len)
        return 0;
    return len + pos + 1;
}
exports.posrelat = posrelat;
/**
 * Thows an error with the type of a variable included in the message
 * @param {Object} val The value whise type is to be inspected.
 * @param {String} errorMessage The error message to throw.
 * @throws {LuaError}
 */
function throwCoerceError(val, errorMessage) {
    if (!errorMessage)
        return undefined;
    throw new LuaError_1.LuaError(("" + errorMessage).replace(/%type/gi, type(val)));
}
/**
 * Coerces a value from its current type to a boolean in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @returns {Boolean} The converted value.
 */
function coerceToBoolean(val) {
    return !(val === false || val === undefined);
}
exports.coerceToBoolean = coerceToBoolean;
/**
 * Coerces a value from its current type to a number in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @param {String} [errorMessage] The error message to throw if the conversion fails.
 * @returns {Number} The converted value.
 */
function coerceToNumber(val, errorMessage) {
    if (typeof val === 'number')
        return val;
    switch (val) {
        case undefined:
            return undefined;
        case 'inf':
            return Infinity;
        case '-inf':
            return -Infinity;
        case 'nan':
            return NaN;
    }
    var V = "" + val;
    if (V.match(FLOATING_POINT_PATTERN)) {
        return parseFloat(V);
    }
    var match = V.match(HEXIDECIMAL_CONSTANT_PATTERN);
    if (match) {
        var sign = match[1], exponent = match[2], mantissa = match[3];
        var n = parseInt(exponent, 16) || 0;
        if (mantissa)
            n += parseInt(mantissa, 16) / Math.pow(16, mantissa.length);
        if (sign)
            n *= -1;
        return n;
    }
    if (errorMessage === undefined)
        return undefined;
    throwCoerceError(val, errorMessage);
}
exports.coerceToNumber = coerceToNumber;
/**
 * Coerces a value from its current type to a string in the same manner as Lua.
 * @param {Object} val The value to be converted.
 * @param {String} [errorMessage] The error message to throw if the conversion fails.
 * @returns {String} The converted value.
 */
function coerceToString(val, errorMessage) {
    if (typeof val === 'string')
        return val;
    switch (val) {
        case undefined:
        case null:
            return 'nil';
        case Infinity:
            return 'inf';
        case -Infinity:
            return '-inf';
    }
    if (typeof val === 'number') {
        return Number.isNaN(val) ? 'nan' : "" + val;
    }
    if (typeof val === 'boolean') {
        return "" + val;
    }
    if (errorMessage === undefined)
        return 'nil';
    throwCoerceError(val, errorMessage);
}
exports.coerceToString = coerceToString;
function coerceArg(value, coerceFunc, typ, funcName, index) {
    return coerceFunc(value, "bad argument #" + index + " to '" + funcName + "' (" + typ + " expected, got %type)");
}
function coerceArgToNumber(value, funcName, index) {
    return coerceArg(value, coerceToNumber, 'number', funcName, index);
}
exports.coerceArgToNumber = coerceArgToNumber;
function coerceArgToString(value, funcName, index) {
    return coerceArg(value, coerceToString, 'string', funcName, index);
}
exports.coerceArgToString = coerceArgToString;
function coerceArgToTable(value, funcName, index) {
    if (value instanceof Table_1.Table) {
        return value;
    }
    else {
        var typ = type(value);
        throw new LuaError_1.LuaError("bad argument #" + index + " to '" + funcName + "' (table expected, got " + typ + ")");
    }
}
exports.coerceArgToTable = coerceArgToTable;
function coerceArgToFunction(value, funcName, index) {
    if (value instanceof Function) {
        return value;
    }
    else {
        var typ = type(value);
        throw new LuaError_1.LuaError("bad argument #" + index + " to '" + funcName + "' (function expected, got " + typ + ")");
    }
}
exports.coerceArgToFunction = coerceArgToFunction;
var ensureArray = function (value) { return (value instanceof Array ? value : [value]); };
exports.ensureArray = ensureArray;
var hasOwnProperty = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
exports.hasOwnProperty = hasOwnProperty;
