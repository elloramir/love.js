"use strict";
exports.__esModule = true;
exports.libMath = void 0;
var Table_1 = require("../Table");
var utils_1 = require("../utils");
var maxinteger = Number.MAX_SAFE_INTEGER;
var mininteger = Number.MIN_SAFE_INTEGER;
var huge = Infinity;
var pi = Math.PI;
var randomSeed = 1;
function getRandom() {
    randomSeed = (16807 * randomSeed) % 2147483647;
    return randomSeed / 2147483647;
}
function abs(x) {
    var X = utils_1.coerceArgToNumber(x, 'abs', 1);
    return Math.abs(X);
}
function acos(x) {
    var X = utils_1.coerceArgToNumber(x, 'acos', 1);
    return Math.acos(X);
}
function asin(x) {
    var X = utils_1.coerceArgToNumber(x, 'asin', 1);
    return Math.asin(X);
}
function atan(y, x) {
    var Y = utils_1.coerceArgToNumber(y, 'atan', 1);
    var X = x === undefined ? 1 : utils_1.coerceArgToNumber(x, 'atan', 2);
    return Math.atan2(Y, X);
}
function atan2(y, x) {
    return atan(y, x);
}
function ceil(x) {
    var X = utils_1.coerceArgToNumber(x, 'ceil', 1);
    return Math.ceil(X);
}
function cos(x) {
    var X = utils_1.coerceArgToNumber(x, 'cos', 1);
    return Math.cos(X);
}
function cosh(x) {
    var X = utils_1.coerceArgToNumber(x, 'cosh', 1);
    return (exp(X) + exp(-X)) / 2;
}
function deg(x) {
    var X = utils_1.coerceArgToNumber(x, 'deg', 1);
    return (X * 180) / Math.PI;
}
function exp(x) {
    var X = utils_1.coerceArgToNumber(x, 'exp', 1);
    return Math.exp(X);
}
function floor(x) {
    var X = utils_1.coerceArgToNumber(x, 'floor', 1);
    return Math.floor(X);
}
function fmod(x, y) {
    var X = utils_1.coerceArgToNumber(x, 'fmod', 1);
    var Y = utils_1.coerceArgToNumber(y, 'fmod', 2);
    return X % Y;
}
function frexp(x) {
    var X = utils_1.coerceArgToNumber(x, 'frexp', 1);
    if (X === 0) {
        return [0, 0];
    }
    var delta = X > 0 ? 1 : -1;
    X *= delta;
    var exponent = Math.floor(Math.log(X) / Math.log(2)) + 1;
    var mantissa = X / Math.pow(2, exponent);
    return [mantissa * delta, exponent];
}
function ldexp(m, e) {
    var M = utils_1.coerceArgToNumber(m, 'ldexp', 1);
    var E = utils_1.coerceArgToNumber(e, 'ldexp', 2);
    return M * Math.pow(2, E);
}
function log(x, base) {
    var X = utils_1.coerceArgToNumber(x, 'log', 1);
    if (base === undefined) {
        return Math.log(X);
    }
    else {
        var B = utils_1.coerceArgToNumber(base, 'log', 2);
        return Math.log(X) / Math.log(B);
    }
}
function log10(x) {
    var X = utils_1.coerceArgToNumber(x, 'log10', 1);
    // v5.2: warn ('math.log10 is deprecated. Use math.log with 10 as its second argument instead.');
    return Math.log(X) / Math.log(10);
}
function max() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var ARGS = args.map(function (n, i) { return utils_1.coerceArgToNumber(n, 'max', i + 1); });
    return Math.max.apply(Math, ARGS);
}
function min() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var ARGS = args.map(function (n, i) { return utils_1.coerceArgToNumber(n, 'min', i + 1); });
    return Math.min.apply(Math, ARGS);
}
function modf(x) {
    var X = utils_1.coerceArgToNumber(x, 'modf', 1);
    var intValue = Math.floor(X);
    var mantissa = X - intValue;
    return [intValue, mantissa];
}
function pow(x, y) {
    var X = utils_1.coerceArgToNumber(x, 'pow', 1);
    var Y = utils_1.coerceArgToNumber(y, 'pow', 2);
    return Math.pow(X, Y);
}
function rad(x) {
    var X = utils_1.coerceArgToNumber(x, 'rad', 1);
    return (Math.PI / 180) * X;
}
function random(min, max) {
    if (min === undefined && max === undefined)
        return getRandom();
    var firstArg = utils_1.coerceArgToNumber(min, 'random', 1);
    var MIN = max === undefined ? 1 : firstArg;
    var MAX = max === undefined ? firstArg : utils_1.coerceArgToNumber(max, 'random', 2);
    if (MIN > MAX)
        throw new Error("bad argument #2 to 'random' (interval is empty)");
    return Math.floor(getRandom() * (MAX - MIN + 1) + MIN);
}
function randomseed(x) {
    randomSeed = utils_1.coerceArgToNumber(x, 'randomseed', 1);
}
function sin(x) {
    var X = utils_1.coerceArgToNumber(x, 'sin', 1);
    return Math.sin(X);
}
function sinh(x) {
    var X = utils_1.coerceArgToNumber(x, 'sinh', 1);
    return (exp(X) - exp(-X)) / 2;
}
function sqrt(x) {
    var X = utils_1.coerceArgToNumber(x, 'sqrt', 1);
    return Math.sqrt(X);
}
function tan(x) {
    var X = utils_1.coerceArgToNumber(x, 'tan', 1);
    return Math.tan(X);
}
function tanh(x) {
    var X = utils_1.coerceArgToNumber(x, 'tanh', 1);
    return (exp(X) - exp(-X)) / (exp(X) + exp(-X));
}
function tointeger(x) {
    var X = utils_1.coerceToNumber(x);
    if (X === undefined)
        return undefined;
    return Math.floor(X);
}
function type(x) {
    var X = utils_1.coerceToNumber(x);
    if (X === undefined)
        return undefined;
    if (tointeger(X) === X)
        return 'integer';
    return 'float';
}
function ult(m, n) {
    var M = utils_1.coerceArgToNumber(m, 'ult', 1);
    var N = utils_1.coerceArgToNumber(n, 'ult', 2);
    var toUnsigned = function (n) { return n >>> 0; };
    return toUnsigned(M) < toUnsigned(N);
}
var libMath = new Table_1.Table({
    abs: abs,
    acos: acos,
    asin: asin,
    atan: atan,
    atan2: atan2,
    ceil: ceil,
    cos: cos,
    cosh: cosh,
    deg: deg,
    exp: exp,
    floor: floor,
    fmod: fmod,
    frexp: frexp,
    huge: huge,
    ldexp: ldexp,
    log: log,
    log10: log10,
    max: max,
    min: min,
    maxinteger: maxinteger,
    mininteger: mininteger,
    modf: modf,
    pi: pi,
    pow: pow,
    rad: rad,
    random: random,
    randomseed: randomseed,
    sin: sin,
    sinh: sinh,
    sqrt: sqrt,
    tan: tan,
    tanh: tanh,
    tointeger: tointeger,
    type: type,
    ult: ult
});
exports.libMath = libMath;
