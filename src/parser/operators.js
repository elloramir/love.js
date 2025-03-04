"use strict";
exports.__esModule = true;
exports.operators = void 0;
var Table_1 = require("./Table");
var utils_1 = require("./utils");
var LuaError_1 = require("./LuaError");
var binaryArithmetic = function (left, right, metaMethodName, callback) {
    var mm = (left instanceof Table_1.Table && left.getMetaMethod(metaMethodName)) ||
        (right instanceof Table_1.Table && right.getMetaMethod(metaMethodName));
    if (mm)
        return mm(left, right)[0];
    var L = utils_1.coerceToNumber(left, 'attempt to perform arithmetic on a %type value');
    var R = utils_1.coerceToNumber(right, 'attempt to perform arithmetic on a %type value');
    return callback(L, R);
};
var binaryBooleanArithmetic = function (left, right, metaMethodName, callback) {
    if ((typeof left === 'string' && typeof right === 'string') ||
        (typeof left === 'number' && typeof right === 'number')) {
        return callback(left, right);
    }
    return binaryArithmetic(left, right, metaMethodName, callback);
};
// extra
var bool = function (value) { return utils_1.coerceToBoolean(value); };
// logical
var and = function (l, r) { return utils_1.coerceToBoolean(l) ? r : l; };
var or = function (l, r) { return utils_1.coerceToBoolean(l) ? l : r; };
// unary
var not = function (value) { return !bool(value); };
var unm = function (value) {
    var mm = value instanceof Table_1.Table && value.getMetaMethod('__unm');
    if (mm)
        return mm(value)[0];
    return -1 * utils_1.coerceToNumber(value, 'attempt to perform arithmetic on a %type value');
};
var bnot = function (value) {
    var mm = value instanceof Table_1.Table && value.getMetaMethod('__bnot');
    if (mm)
        return mm(value)[0];
    return ~utils_1.coerceToNumber(value, 'attempt to perform arithmetic on a %type value');
};
var len = function (value) {
    if (value instanceof Table_1.Table) {
        var mm = value.getMetaMethod('__len');
        if (mm)
            return mm(value)[0];
        return value.getn();
    }
    if (typeof value === 'string')
        return value.length;
    throw new LuaError_1.LuaError('attempt to get length of an unsupported value');
    // if (typeof value === 'object') {
    //     let length = 0
    //     for (const key in value) {
    //         if (hasOwnProperty(value, key)) {
    //             length += 1
    //         }
    //     }
    //     return length
    // }
};
// binary
var add = function (left, right) { return binaryArithmetic(left, right, '__add', function (l, r) { return l + r; }); };
var sub = function (left, right) { return binaryArithmetic(left, right, '__sub', function (l, r) { return l - r; }); };
var mul = function (left, right) { return binaryArithmetic(left, right, '__mul', function (l, r) { return l * r; }); };
var mod = function (left, right) {
    return binaryArithmetic(left, right, '__mod', function (l, r) {
        if (r === 0 || r === -Infinity || r === Infinity || isNaN(l) || isNaN(r))
            return NaN;
        var absR = Math.abs(r);
        var result = Math.abs(l) % absR;
        if (l * r < 0)
            result = absR - result;
        if (r < 0)
            result *= -1;
        return result;
    });
};
var pow = function (left, right) { return binaryArithmetic(left, right, '__pow', Math.pow); };
var div = function (left, right) {
    return binaryArithmetic(left, right, '__div', function (l, r) {
        if (r === undefined)
            throw new LuaError_1.LuaError('attempt to perform arithmetic on a nil value');
        return l / r;
    });
};
var idiv = function (left, right) {
    return binaryArithmetic(left, right, '__idiv', function (l, r) {
        if (r === undefined)
            throw new LuaError_1.LuaError('attempt to perform arithmetic on a nil value');
        return Math.floor(l / r);
    });
};
var band = function (left, right) { return binaryArithmetic(left, right, '__band', function (l, r) { return l & r; }); };
var bor = function (left, right) { return binaryArithmetic(left, right, '__bor', function (l, r) { return l | r; }); };
var bxor = function (left, right) { return binaryArithmetic(left, right, '__bxor', function (l, r) { return l ^ r; }); };
var shl = function (left, right) { return binaryArithmetic(left, right, '__shl', function (l, r) { return l << r; }); };
var shr = function (left, right) { return binaryArithmetic(left, right, '__shr', function (l, r) { return l >> r; }); };
var concat = function (left, right) {
    var mm = (left instanceof Table_1.Table && left.getMetaMethod('__concat')) ||
        (right instanceof Table_1.Table && right.getMetaMethod('__concat'));
    if (mm)
        return mm(left, right)[0];
    var L = utils_1.coerceToString(left, 'attempt to concatenate a %type value');
    var R = utils_1.coerceToString(right, 'attempt to concatenate a %type value');
    return "" + L + R;
};
var neq = function (left, right) { return !eq(left, right); };
var eq = function (left, right) {
    var mm = right !== left &&
        left instanceof Table_1.Table &&
        right instanceof Table_1.Table &&
        left.metatable === right.metatable &&
        left.getMetaMethod('__eq');
    if (mm)
        return !!mm(left, right)[0];
    return left === right;
};
var lt = function (left, right) { return binaryBooleanArithmetic(left, right, '__lt', function (l, r) { return l < r; }); };
var le = function (left, right) { return binaryBooleanArithmetic(left, right, '__le', function (l, r) { return l <= r; }); };
var gt = function (left, right) { return !le(left, right); };
var ge = function (left, right) { return !lt(left, right); };
var operators = {
    bool: bool,
    and: and,
    or: or,
    not: not,
    unm: unm,
    bnot: bnot,
    len: len,
    add: add,
    sub: sub,
    mul: mul,
    mod: mod,
    pow: pow,
    div: div,
    idiv: idiv,
    band: band,
    bor: bor,
    bxor: bxor,
    shl: shl,
    shr: shr,
    concat: concat,
    neq: neq,
    eq: eq,
    lt: lt,
    le: le,
    gt: gt,
    ge: ge
};
exports.operators = operators;
