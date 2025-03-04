"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {z
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.utils = exports.LuaError = exports.Table = exports.createEnv = void 0;
// /* eslint-disable import/order */
// /* eslint-disable import/no-duplicates */
var Scope_1 = require("./Scope");
var globals_1 = require("./lib/globals");
var operators_1 = require("./operators");
var Table_1 = require("./Table");
exports.Table = Table_1.Table;
var LuaError_1 = require("./LuaError");
exports.LuaError = LuaError_1.LuaError;
var math_1 = require("./lib/math");
var table_1 = require("./lib/table");
var string_1 = require("./lib/string");
var os_1 = require("./lib/os");
var package_1 = require("./lib/package");
var utils_1 = require("./utils");
var parser_1 = require("./parser");
var call = function (f) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (f instanceof Function)
        return utils_1.ensureArray(f.apply(void 0, args));
    var mm = f instanceof Table_1.Table && f.getMetaMethod('__call');
    if (mm)
        return utils_1.ensureArray(mm.apply(void 0, __spreadArrays([f], args)));
    throw new LuaError_1.LuaError("attempt to call an uncallable type");
};
var stringTable = new Table_1.Table();
stringTable.metatable = string_1.metatable;
var get = function (t, v) {
    if (t instanceof Table_1.Table)
        return t.get(v);
    if (typeof t === 'string')
        return stringTable.get(v);
    throw new LuaError_1.LuaError(`no table or metatable found for given type ${t}.${v}`);
};
var execChunk = function (_G, chunk, chunkName) {
    var exec = new Function('__lua', chunk);
    var globalScope = new Scope_1.Scope(_G.strValues).extend();
    if (chunkName)
        globalScope.setVarargs([chunkName]);
    var res = exec(__assign(__assign({ globalScope: globalScope }, operators_1.operators), { Table: Table_1.Table,
        call: call,
        get: get }));
    return res === undefined ? [undefined] : res;
};
function createEnv(config) {
    if (config === void 0) { config = {}; }
    var cfg = __assign({ LUA_PATH: './?.lua', stdin: '', stdout: console.log }, config);
    var _G = globals_1.createG(cfg, execChunk);
    var _a = package_1.getLibPackage(function (content, moduleName) { return execChunk(_G, parser_1.parse(content), moduleName)[0]; }, cfg), libPackage = _a.libPackage, _require = _a._require;
    var loaded = libPackage.get('loaded');
    var loadLib = function (name, value) {
        _G.rawset(name, value);
        loaded.rawset(name, value);
    };
    loadLib('_G', _G);
    loadLib('package', libPackage);
    loadLib('math', math_1.libMath);
    loadLib('table', table_1.libTable);
    loadLib('string', string_1.libString);
    loadLib('os', os_1.getLibOS(cfg));
    _G.rawset('require', _require);
    var parse = function (code) {
        var script = parser_1.parse(code);
        return {
            exec: function () { return execChunk(_G, script)[0]; }
        };
    };
    var parseFile = function (filename) {
        if (!cfg.fileExists)
            throw new LuaError_1.LuaError('parseFile requires the config.fileExists function');
        if (!cfg.loadFile)
            throw new LuaError_1.LuaError('parseFile requires the config.loadFile function');
        if (!cfg.fileExists(filename))
            throw new LuaError_1.LuaError('file not found');
        return parse(cfg.loadFile(filename));
    };
    return {
        parse: parse,
        parseFile: parseFile,
        loadLib: loadLib
    };
}
exports.createEnv = createEnv;
// eslint-disable-next-line import/first
var utils = require("./utils");
exports.utils = utils;
