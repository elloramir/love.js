"use strict";
exports.__esModule = true;
exports.getLibPackage = void 0;
var Table_1 = require("../Table");
var utils_1 = require("../utils");
var LuaError_1 = require("../LuaError");
var getLibPackage = function (execModule, cfg) {
    var LUA_DIRSEP = '/';
    var LUA_PATH_SEP = ';';
    var LUA_PATH_MARK = '?';
    var LUA_EXEC_DIR = '!';
    var LUA_IGMARK = '-';
    var LUA_PATH = cfg.LUA_PATH;
    var config = [LUA_DIRSEP, LUA_PATH_SEP, LUA_PATH_MARK, LUA_EXEC_DIR, LUA_IGMARK].join('\n');
    var loaded = new Table_1.Table();
    var preload = new Table_1.Table();
    var searchpath = function (name, path, sep, rep) {
        if (!cfg.fileExists) {
            throw new LuaError_1.LuaError('package.searchpath requires the config.fileExists function');
        }
        var NAME = utils_1.coerceArgToString(name, 'searchpath', 1);
        var PATH = utils_1.coerceArgToString(path, 'searchpath', 2);
        var SEP = sep === undefined ? '.' : utils_1.coerceArgToString(sep, 'searchpath', 3);
        var REP = rep === undefined ? '/' : utils_1.coerceArgToString(rep, 'searchpath', 4);
        NAME = NAME.replace(SEP, REP);
        var paths = PATH.split(';').map(function (template) { return template.replace('?', NAME); });
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var path_1 = paths_1[_i];
            if (cfg.fileExists(path_1))
                return path_1;
        }
        return [undefined, "The following files don't exist: " + paths.join(' ')];
    };
    var searchers = new Table_1.Table([
        function (moduleName) {
            var res = preload.rawget(moduleName);
            if (res === undefined) {
                return [undefined];
            }
            return [res];
        },
        function (moduleName) {
            var res = searchpath(moduleName, libPackage.rawget('path'));
            if (Array.isArray(res) && res[0] === undefined) {
                return [res[1]];
            }
            if (!cfg.loadFile) {
                throw new LuaError_1.LuaError('package.searchers requires the config.loadFile function');
            }
            return [function (moduleName, path) { return execModule(cfg.loadFile(path), moduleName); }, res];
        }
    ]);
    function _require(modname) {
        var MODNAME = utils_1.coerceArgToString(modname, 'require', 1);
        var module = loaded.rawget(MODNAME);
        if (module)
            return module;
        var searcherFns = searchers.numValues.filter(function (fn) { return !!fn; });
        for (var _i = 0, searcherFns_1 = searcherFns; _i < searcherFns_1.length; _i++) {
            var searcher = searcherFns_1[_i];
            var res = searcher(MODNAME);
            if (res[0] !== undefined && typeof res[0] !== 'string') {
                var loader = res[0];
                var result = loader(MODNAME, res[1]);
                var module_1 = result === undefined ? true : result;
                loaded.rawset(MODNAME, module_1);
                return module_1;
            }
        }
        throw new LuaError_1.LuaError("Module '" + MODNAME + "' not found!");
    }
    var libPackage = new Table_1.Table({
        path: LUA_PATH,
        config: config,
        loaded: loaded,
        preload: preload,
        searchers: searchers,
        searchpath: searchpath
    });
    return { libPackage: libPackage, _require: _require };
};
exports.getLibPackage = getLibPackage;
