"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.LuaError = void 0;
var LuaError = /** @class */ (function (_super) {
    __extends(LuaError, _super);
    function LuaError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    LuaError.prototype.toString = function () {
        return "LuaError: " + this.message;
    };
    return LuaError;
}(Error));
exports.LuaError = LuaError;
