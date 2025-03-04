"use strict";
exports.__esModule = true;
exports.Scope = void 0;
var utils_1 = require("./utils");
var Scope = /** @class */ (function () {
    function Scope(variables) {
        if (variables === void 0) { variables = {}; }
        this._variables = variables;
    }
    Scope.prototype.get = function (key) {
        return this._variables[key];
    };
    Scope.prototype.set = function (key, value) {
        if (utils_1.hasOwnProperty(this._variables, key) || !this.parent) {
            this.setLocal(key, value);
        }
        else {
            this.parent.set(key, value);
        }
    };
    Scope.prototype.setLocal = function (key, value) {
        this._variables[key] = value;
    };
    Scope.prototype.setVarargs = function (args) {
        this._varargs = args;
    };
    Scope.prototype.getVarargs = function () {
        return this._varargs || (this.parent && this.parent.getVarargs()) || [];
    };
    Scope.prototype.extend = function () {
        var innerVars = Object.create(this._variables);
        var scope = new Scope(innerVars);
        scope.parent = this;
        return scope;
    };
    return Scope;
}());
exports.Scope = Scope;
