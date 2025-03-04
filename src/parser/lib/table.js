"use strict";
exports.__esModule = true;
exports.libTable = void 0;
var Table_1 = require("../Table");
var utils_1 = require("../utils");
var LuaError_1 = require("../LuaError");
function getn(table) {
    var TABLE = utils_1.coerceArgToTable(table, 'getn', 1);
    return TABLE.getn();
}
/**
 * Given a list where all elements are strings or numbers, returns the string list[i]..sep..list[i+1] ··· sep..list[j].
 * The default value for sep is the empty string, the default for i is 1, and the default for j is #list.
 * If i is greater than j, returns the empty string.
 */
function concat(table, sep, i, j) {
    if (sep === void 0) { sep = ''; }
    if (i === void 0) { i = 1; }
    var TABLE = utils_1.coerceArgToTable(table, 'concat', 1);
    var SEP = utils_1.coerceArgToString(sep, 'concat', 2);
    var I = utils_1.coerceArgToNumber(i, 'concat', 3);
    var J = j === undefined ? maxn(TABLE) : utils_1.coerceArgToNumber(j, 'concat', 4);
    return []
        .concat(TABLE.numValues)
        .splice(I, J - I + 1)
        .join(SEP);
}
/**
 * Inserts element value at position pos in list, shifting up the elements list[pos], list[pos+1], ···, list[#list].
 * The default value for pos is #list+1, so that a call table.insert(t,x) inserts x at the end of list t.
 */
function insert(table, pos, value) {
    var TABLE = utils_1.coerceArgToTable(table, 'insert', 1);
    var POS = value === undefined ? TABLE.numValues.length : utils_1.coerceArgToNumber(pos, 'insert', 2);
    var VALUE = value === undefined ? pos : value;
    TABLE.numValues.splice(POS, 0, undefined);
    TABLE.set(POS, VALUE);
}
function maxn(table) {
    var TABLE = utils_1.coerceArgToTable(table, 'maxn', 1);
    return TABLE.numValues.length - 1;
}
/**
 * Moves elements from table a1 to table a2, performing the equivalent to the following multiple assignment:
 *
 *      `a2[t],··· = a1[f],···,a1[e].`
 *
 * The default for a2 is a1.
 * The destination range can overlap with the source range.
 * The number of elements to be moved must fit in a Lua integer.
 *
 * Returns the destination table a2.
 */
function move(a1, f, e, t, a2) {
    var A1 = utils_1.coerceArgToTable(a1, 'move', 1);
    var F = utils_1.coerceArgToNumber(f, 'move', 2);
    var E = utils_1.coerceArgToNumber(e, 'move', 3);
    var T = utils_1.coerceArgToNumber(t, 'move', 4);
    var A2 = a2 === undefined ? A1 : utils_1.coerceArgToTable(a2, 'move', 5);
    if (E >= F) {
        if (F <= 0 && E >= Number.MAX_SAFE_INTEGER + F)
            throw new LuaError_1.LuaError('too many elements to move');
        var n = E - F + 1; // number of elements to movea
        if (T > Number.MAX_SAFE_INTEGER - n + 1)
            throw new LuaError_1.LuaError('destination wrap around');
        if (T > E || T <= F || A2 !== A1) {
            for (var i = 0; i < n; i++) {
                var v = A1.get(F + i);
                A2.set(T + i, v);
            }
        }
        else {
            for (var i = n - 1; i >= 0; i--) {
                var v = A1.get(F + i);
                A2.set(T + i, v);
            }
        }
    }
    return A2;
}
/**
 * Returns a new table with all arguments stored into keys 1, 2, etc. and with a field "n" with the total number of arguments.
 * Note that the resulting table may not be a sequence.
 */
function pack() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var table = new Table_1.Table(args);
    table.rawset('n', args.length);
    return table;
}
/**
 * Removes from list the element at position pos, returning the value of the removed element.
 * When pos is an integer between 1 and #list, it shifts down the elements list[pos+1], list[pos+2], ···, list[#list] and
 * erases element list[#list]; The index pos can also be 0 when #list is 0, or #list + 1;
 * in those cases, the function erases the element list[pos].
 *
 * The default value for pos is #list, so that a call table.remove(l) removes the last element of list l.
 */
function remove(table, pos) {
    var TABLE = utils_1.coerceArgToTable(table, 'remove', 1);
    var max = TABLE.getn();
    var POS = pos === undefined ? max : utils_1.coerceArgToNumber(pos, 'remove', 2);
    if (POS > max || POS < 0) {
        return;
    }
    var vals = TABLE.numValues;
    var result = vals.splice(POS, 1)[0];
    var i = POS;
    while (i < max && vals[i] === undefined) {
        delete vals[i];
        i += 1;
    }
    return result;
}
/**
 * Sorts list elements in a given order, in-place, from list[1] to list[#list].
 * If comp is given, then it must be a function that receives two list elements and
 * returns true when the first element must come before the second in the final order
 * (so that, after the sort, i < j implies not comp(list[j],list[i])).
 * If comp is not given, then the standard Lua operator < is used instead.
 *
 * Note that the comp function must define a strict partial order over the elements in the list;
 * that is, it must be asymmetric and transitive. Otherwise, no valid sort may be possible.
 *
 * The sort algorithm is not stable: elements considered equal by the given order may have
 * their relative positions changed by the sort.
 */
function sort(table, comp) {
    var TABLE = utils_1.coerceArgToTable(table, 'sort', 1);
    var sortFunc;
    if (comp) {
        var COMP_1 = utils_1.coerceArgToFunction(comp, 'sort', 2);
        sortFunc = function (a, b) { return (utils_1.coerceToBoolean(COMP_1(a, b)[0]) ? -1 : 1); };
    }
    else {
        sortFunc = function (a, b) { return (a < b ? -1 : 1); };
    }
    var arr = TABLE.numValues;
    arr.shift();
    arr.sort(sortFunc).unshift(undefined);
}
/**
 * Returns the elements from the given list. This function is equivalent to
 *
 *      `return list[i], list[i+1], ···, list[j]`
 *
 * By default, i is 1 and j is #list.
 */
function unpack(table, i, j) {
    var TABLE = utils_1.coerceArgToTable(table, 'unpack', 1);
    var I = i === undefined ? 1 : utils_1.coerceArgToNumber(i, 'unpack', 2);
    var J = j === undefined ? TABLE.getn() : utils_1.coerceArgToNumber(j, 'unpack', 3);
    return TABLE.numValues.slice(I, J + 1);
}
var libTable = new Table_1.Table({
    getn: getn,
    concat: concat,
    insert: insert,
    maxn: maxn,
    move: move,
    pack: pack,
    remove: remove,
    sort: sort,
    unpack: unpack
});
exports.libTable = libTable;
