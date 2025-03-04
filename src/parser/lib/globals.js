"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.createG = exports.tostring = void 0;
var parser_1 = require("../parser");
var Table_1 = require("../Table");
var LuaError_1 = require("../LuaError");
var utils_1 = require("../utils");
exports.tostring = utils_1.tostring;
var string_1 = require("./string");
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function ipairsIterator(table, index) {
    if (index === undefined) {
        throw new LuaError_1.LuaError('Bad argument #2 to ipairs() iterator');
    }
    var nextIndex = index + 1;
    var numValues = table.numValues;
    if (!numValues[nextIndex] || numValues[nextIndex] === undefined)
        return undefined;
    return [nextIndex, numValues[nextIndex]];
}
var _VERSION = 'Lua 5.3';
function assert(v, m) {
    if (utils_1.coerceToBoolean(v))
        return [v, m];
    var msg = m === undefined ? 'Assertion failed!' : utils_1.coerceArgToString(m, 'assert', 2);
    throw new LuaError_1.LuaError(msg);
}
function collectgarbage() {
    // noop
    return [];
}
function error(message) {
    var msg = utils_1.coerceArgToString(message, 'error', 1);
    throw new LuaError_1.LuaError(msg);
}
/**
 * If object does not have a metatable, returns nil.
 * Otherwise, if the object's metatable has a __metatable field, returns the associated value.
 * Otherwise, returns the metatable of the given object.
 */
function getmetatable(table) {
    if (table instanceof Table_1.Table && table.metatable) {
        var mm = table.metatable.rawget('__metatable');
        return mm ? mm : table.metatable;
    }
    if (typeof table === 'string') {
        return string_1.metatable;
    }
}
/**
 * Returns three values (an iterator function, the table t, and 0) so that the construction
 *
 *      `for i,v in ipairs(t) do body end`
 *
 * will iterate over the key–value pairs (1,t[1]), (2,t[2]), ..., up to the first nil value.
 */
function ipairs(t) {
    var table = utils_1.coerceArgToTable(t, 'ipairs', 1);
    var mm = table.getMetaMethod('__pairs') || table.getMetaMethod('__ipairs');
    return mm ? mm(table).slice(0, 3) : [ipairsIterator, table, 0];
}
/**
 * Allows a program to traverse all fields of a table.
 * Its first argument is a table and its second argument is an index in this table.
 * next returns the next index of the table and its associated value.
 * When called with nil as its second argument, next returns an initial index and its associated value.
 * When called with the last index, or with nil in an empty table, next returns nil.
 * If the second argument is absent, then it is interpreted as nil.
 * In particular, you can use next(t) to check whether a table is empty.
 *
 * The order in which the indices are enumerated is not specified, even for numeric indices.
 * (To traverse a table in numerical order, use a numerical for.)
 *
 * The behavior of next is undefined if, during the traversal, you assign any value to a non-existent field in the table.
 * You may however modify existing fields. In particular, you may clear existing fields.
 */
function next(table, index) {
    var TABLE = utils_1.coerceArgToTable(table, 'next', 1);
    // SLOOOOOOOW...
    var found = index === undefined;
    if (found || (typeof index === 'number' && index > 0)) {
        var numValues = TABLE.numValues;
        var keys = Object.keys(numValues);
        var i = 1;
        if (!found) {
            var I = keys.indexOf("" + index);
            if (I >= 0) {
                found = true;
                i += I;
            }
        }
        if (found) {
            for (i; keys[i] !== undefined; i++) {
                var key = Number(keys[i]);
                var value = numValues[key];
                if (value !== undefined)
                    return [key, value];
            }
        }
    }
    for (var i in TABLE.strValues) {
        if (utils_1.hasOwnProperty(TABLE.strValues, i)) {
            if (!found) {
                if (i === index)
                    found = true;
            }
            else if (TABLE.strValues[i] !== undefined) {
                return [i, TABLE.strValues[i]];
            }
        }
    }
    for (var i in TABLE.keys) {
        if (utils_1.hasOwnProperty(TABLE.keys, i)) {
            var key = TABLE.keys[i];
            if (!found) {
                if (key === index)
                    found = true;
            }
            else if (TABLE.values[i] !== undefined) {
                return [key, TABLE.values[i]];
            }
        }
    }
}
/**
 * If t has a metamethod __pairs, calls it with t as argument and returns the first three results from the call.
 *
 * Otherwise, returns three values: the next function, the table t, and nil, so that the construction
 *
 *      `for k,v in pairs(t) do body end`
 *
 * will iterate over all key–value pairs of table t.
 *
 * See function next for the caveats of modifying the table during its traversal.
 */
function pairs(t) {
    var table = utils_1.coerceArgToTable(t, 'pairs', 1);
    var mm = table.getMetaMethod('__pairs');
    return mm ? mm(table).slice(0, 3) : [next, table, undefined];
}
/**
 * Calls function f with the given arguments in protected mode.
 * This means that any error inside f is not propagated;
 * instead, pcall catches the error and returns a status code.
 * Its first result is the status code (a boolean), which is true if the call succeeds without errors.
 * In such case, pcall also returns all results from the call, after this first result.
 * In case of any error, pcall returns false plus the error message.
 */
function pcall(f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (typeof f !== 'function') {
        throw new LuaError_1.LuaError('Attempt to call non-function');
    }
    try {
        return __spreadArrays([true], f.apply(void 0, args));
    }
    catch (e) {
        return [false, e && e.toString()];
    }
}
/**
 * Checks whether v1 is equal to v2, without invoking the __eq metamethod. Returns a boolean.
 */
function rawequal(v1, v2) {
    return v1 === v2;
}
/**
 * Gets the real value of table[index], without invoking the __index metamethod.
 * table must be a table; index may be any value.
 */
function rawget(table, index) {
    var TABLE = utils_1.coerceArgToTable(table, 'rawget', 1);
    return TABLE.rawget(index);
}
/**
 * Returns the length of the object v, which must be a table or a string, without invoking the __len metamethod.
 * Returns an integer.
 */
function rawlen(v) {
    if (v instanceof Table_1.Table)
        return v.getn();
    if (typeof v === 'string')
        return v.length;
    throw new LuaError_1.LuaError('attempt to get length of an unsupported value');
}
/**
 * Sets the real value of table[index] to value, without invoking the __newindex metamethod.
 * table must be a table, index any value different from nil and NaN, and value any Lua value.
 *
 * This function returns table.
 */
function rawset(table, index, value) {
    var TABLE = utils_1.coerceArgToTable(table, 'rawset', 1);
    if (index === undefined)
        throw new LuaError_1.LuaError('table index is nil');
    TABLE.rawset(index, value);
    return TABLE;
}
/**
 * If index is a number, returns all arguments after argument number index;
 * a negative number indexes from the end (-1 is the last argument).
 * Otherwise, index must be the string "#", and select returns the total number of extra arguments it received.
 */
function select(index) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (index === '#') {
        return args.length;
    }
    if (typeof index === 'number') {
        var pos = utils_1.posrelat(Math.trunc(index), args.length);
        return args.slice(pos - 1);
    }
    throw new LuaError_1.LuaError("bad argument #1 to 'select' (number expected, got " + utils_1.type(index) + ")");
}
/**
 * Sets the metatable for the given table.
 * (To change the metatable of other types from Lua code,you must use the debug library (§6.10).)
 * If metatable is nil, removes the metatable of the given table.
 * If the original metatable has a __metatable field, raises an error.
 *
 * This function returns table.
 */
function setmetatable(table, metatable) {
    var TABLE = utils_1.coerceArgToTable(table, 'setmetatable', 1);
    if (TABLE.metatable && TABLE.metatable.rawget('__metatable')) {
        throw new LuaError_1.LuaError('cannot change a protected metatable');
    }
    TABLE.metatable = metatable === null || metatable === undefined ? null : utils_1.coerceArgToTable(metatable, 'setmetatable', 2);
    return TABLE;
}
/**
 * When called with no base, tonumber tries to convert its argument to a number.
 * If the argument is already a number or a string convertible to a number,
 * then tonumber returns this number; otherwise, it returns nil.
 *
 * The conversion of strings can result in integers or floats,
 * according to the lexical conventions of Lua (see §3.1).
 * (The string may have leading and trailing spaces and a sign.)
 *
 * When called with base, then e must be a string to be interpreted as an integer numeral in that base.
 * The base may be any integer between 2 and 36, inclusive.
 * In bases above 10, the letter 'A' (in either upper or lower case) represents 10,
 * 'B' represents 11, and so forth, with 'Z' representing 35.
 * If the string e is not a valid numeral in the given base, the function returns nil.
 */
function tonumber(e, base) {
    var E = utils_1.coerceToString(e).trim();
    var BASE = base === undefined ? 10 : utils_1.coerceArgToNumber(base, 'tonumber', 2);
    if (BASE !== 10 && E === 'nil') {
        throw new LuaError_1.LuaError("bad argument #1 to 'tonumber' (string expected, got nil)");
    }
    if (BASE < 2 || BASE > 36) {
        throw new LuaError_1.LuaError("bad argument #2 to 'tonumber' (base out of range)");
    }
    if (E === '')
        return;
    if (BASE === 10)
        return utils_1.coerceToNumber(E);
    var pattern = new RegExp("^" + (BASE === 16 ? '(0x)?' : '') + "[" + CHARS.substr(0, BASE) + "]*$", 'gi');
    if (!pattern.test(E))
        return; // Invalid
    return parseInt(E, BASE);
}
/**
 * This function is similar to pcall, except that it sets a new message handler msgh.
 */
function xpcall(f, msgh) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (typeof f !== 'function' || typeof msgh !== 'function') {
        throw new LuaError_1.LuaError('Attempt to call non-function');
    }
    try {
        return __spreadArrays([true], f.apply(void 0, args));
    }
    catch (e) {
        return [false, msgh(e)[0]];
    }
}
function createG(cfg, execChunk) {
    function print() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var output = args.map(function (arg) { return utils_1.tostring(arg); }).join('\t');
        cfg.stdout(output);
    }
    function load(chunk, _chunkname, _mode, env) {
        var C = '';
        if (chunk instanceof Function) {
            var ret = ' ';
            while (ret !== '' && ret !== undefined) {
                C += ret;
                ret = chunk()[0];
            }
        }
        else {
            C = utils_1.coerceArgToString(chunk, 'load', 1);
        }
        var parsed;
        try {
            parsed = parser_1.parse(C);
        }
        catch (e) {
            return [undefined, e.message];
        }
        return function () { return execChunk(env || _G, parsed); };
    }
    function dofile(filename) {
        var res = loadfile(filename);
        if (Array.isArray(res) && res[0] === undefined) {
            throw new LuaError_1.LuaError(res[1]);
        }
        var exec = res;
        return exec();
    }
    function loadfile(filename, mode, env) {
        var FILENAME = filename === undefined ? cfg.stdin : utils_1.coerceArgToString(filename, 'loadfile', 1);
        if (!cfg.fileExists) {
            throw new LuaError_1.LuaError('loadfile requires the config.fileExists function');
        }
        if (!cfg.fileExists(FILENAME))
            return [undefined, 'file not found'];
        if (!cfg.loadFile) {
            throw new LuaError_1.LuaError('loadfile requires the config.loadFile function');
        }
        return load(cfg.loadFile(FILENAME), FILENAME, mode, env);
    }
    var _G = new Table_1.Table({
        _VERSION: _VERSION,
        assert: assert,
        dofile: dofile,
        collectgarbage: collectgarbage,
        error: error,
        getmetatable: getmetatable,
        ipairs: ipairs,
        load: load,
        loadfile: loadfile,
        next: next,
        pairs: pairs,
        pcall: pcall,
        print: print,
        rawequal: rawequal,
        rawget: rawget,
        rawlen: rawlen,
        rawset: rawset,
        select: select,
        setmetatable: setmetatable,
        tonumber: tonumber,
        tostring: utils_1.tostring,
        type: utils_1.type,
        xpcall: xpcall
    });
    return _G;
}
exports.createG = createG;
