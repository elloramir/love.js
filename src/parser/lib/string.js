"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.metatable = exports.libString = void 0;
var printj_1 = require("printj");
var Table_1 = require("../Table");
var LuaError_1 = require("../LuaError");
var utils_1 = require("../utils");
var ROSETTA_STONE = {
    '([^a-zA-Z0-9%(])-': '$1*?',
    '([^%])-([^a-zA-Z0-9?])': '$1*?$2',
    '([^%])\\.': '$1[\\s\\S]',
    '(.)-$': '$1*?',
    '%a': '[a-zA-Z]',
    '%A': '[^a-zA-Z]',
    '%c': '[\x00-\x1f]',
    '%C': '[^\x00-\x1f]',
    '%d': '\\d',
    '%D': '[^d]',
    '%l': '[a-z]',
    '%L': '[^a-z]',
    '%p': '[.,"\'?!;:#$%&()*+-/<>=@\\[\\]\\\\^_{}|~]',
    '%P': '[^.,"\'?!;:#$%&()*+-/<>=@\\[\\]\\\\^_{}|~]',
    '%s': '[ \\t\\n\\f\\v\\r]',
    '%S': '[^ \t\n\f\v\r]',
    '%u': '[A-Z]',
    '%U': '[^A-Z]',
    '%w': '[a-zA-Z0-9]',
    '%W': '[^a-zA-Z0-9]',
    '%x': '[a-fA-F0-9]',
    '%X': '[^a-fA-F0-9]',
    '%([^a-zA-Z])': '\\$1'
};
function translatePattern(pattern) {
    // TODO Add support for balanced character matching (not sure this is easily achieveable).
    // Replace single backslash with double backslashes
    var tPattern = pattern.replace(/\\/g, '\\\\');
    for (var i in ROSETTA_STONE) {
        if (utils_1.hasOwnProperty(ROSETTA_STONE, i)) {
            tPattern = tPattern.replace(new RegExp(i, 'g'), ROSETTA_STONE[i]);
        }
    }
    var nestingLevel = 0;
    for (var i = 0, l = tPattern.length; i < l; i++) {
        if (i && tPattern.substr(i - 1, 1) === '\\') {
            continue;
        }
        // Remove nested square brackets caused by substitutions
        var character = tPattern.substr(i, 1);
        if (character === '[' || character === ']') {
            if (character === ']') {
                nestingLevel -= 1;
            }
            if (nestingLevel > 0) {
                tPattern = tPattern.substr(0, i) + tPattern.substr(i + 1);
                i -= 1;
                l -= 1;
            }
            if (character === '[') {
                nestingLevel += 1;
            }
        }
    }
    return tPattern;
}
/**
 * Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j].
 * The default value for i is 1; the default value for j is i.
 * These indices are corrected following the same rules of function string.sub.
 *
 * Numeric codes are not necessarily portable across platforms.
 */
function byte(s, i, j) {
    var S = utils_1.coerceArgToString(s, 'byte', 1);
    var I = i === undefined ? 1 : utils_1.coerceArgToNumber(i, 'byte', 2);
    var J = j === undefined ? I : utils_1.coerceArgToNumber(j, 'byte', 3);
    return S.substring(I - 1, J)
        .split('')
        .map(function (c) { return c.charCodeAt(0); });
}
/**
 * Receives zero or more integers. Returns a string with length equal to the number of arguments,
 * in which each character has the internal numeric code equal to its corresponding argument.
 *
 * Numeric codes are not necessarily portable across platforms.
 */
function char() {
    var bytes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        bytes[_i] = arguments[_i];
    }
    return bytes
        .map(function (b, i) {
        var B = utils_1.coerceArgToNumber(b, 'char', i);
        return String.fromCharCode(B);
    })
        .join('');
}
/**
 * Looks for the first match of pattern (see §6.4.1) in the string s. If it finds a match, then find returns
 * the indices of s where this occurrence starts and ends; otherwise, it returns nil.
 * A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.
 * A value of true as a fourth, optional argument plain turns off the pattern matching facilities,
 * so the function does a plain "find substring" operation, with no characters in pattern being considered magic.
 * Note that if plain is given, then init must be given as well.
 *
 * If the pattern has captures, then in a successful match the captured values are also returned, after the two indices.
 */
function find(s, pattern, init, plain) {
    var S = utils_1.coerceArgToString(s, 'find', 1);
    var P = utils_1.coerceArgToString(pattern, 'find', 2);
    var INIT = init === undefined ? 1 : utils_1.coerceArgToNumber(init, 'find', 3);
    var PLAIN = plain === undefined ? false : utils_1.coerceArgToNumber(plain, 'find', 4);
    // Regex
    if (!PLAIN) {
        var regex = new RegExp(translatePattern(P));
        var index_1 = S.substr(INIT - 1).search(regex);
        if (index_1 < 0)
            return;
        var match_1 = S.substr(INIT - 1).match(regex);
        var result = [index_1 + INIT, index_1 + INIT + match_1[0].length - 1];
        match_1.shift();
        return __spreadArrays(result, match_1);
    }
    // Plain
    var index = S.indexOf(P, INIT - 1);
    return index === -1 ? undefined : [index + 1, index + P.length];
}
function format(formatstring) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // Pattern with all constraints:
    // /%%|%([-+ #0]{0,5})?(\d{0,2})?(?:\.(\d{0,2}))?([AEGXacdefgioqsux])/g
    var PATTERN = /%%|%([-+ #0]*)?(\d*)?(?:\.(\d*))?(.)/g;
    var i = -1;
    return formatstring.replace(PATTERN, function (format, flags, width, precision, modifier) {
        if (format === '%%')
            return '%';
        if (!modifier.match(/[AEGXacdefgioqsux]/)) {
            throw new LuaError_1.LuaError("invalid option '%" + format + "' to 'format'");
        }
        if (flags && flags.length > 5) {
            throw new LuaError_1.LuaError("invalid format (repeated flags)");
        }
        if (width && width.length > 2) {
            throw new LuaError_1.LuaError("invalid format (width too long)");
        }
        if (precision && precision.length > 2) {
            throw new LuaError_1.LuaError("invalid format (precision too long)");
        }
        i += 1;
        var arg = args[i];
        if (arg === undefined) {
            throw new LuaError_1.LuaError("bad argument #" + i + " to 'format' (no value)");
        }
        if (/A|a|E|e|f|G|g/.test(modifier)) {
            return printj_1.sprintf(format, utils_1.coerceArgToNumber(arg, 'format', i));
        }
        if (/c|d|i|o|u|X|x/.test(modifier)) {
            return printj_1.sprintf(format, utils_1.coerceArgToNumber(arg, 'format', i));
        }
        if (modifier === 'q') {
            return "\"" + arg.replace(/([\n"])/g, '\\$1') + "\"";
        }
        if (modifier === 's') {
            return printj_1.sprintf(format, utils_1.tostring(arg));
        }
        return printj_1.sprintf(format, arg);
    });
}
/**
 * Returns an iterator function that, each time it is called, returns the next captures from pattern (see §6.4.1)
 * over the string s. If pattern specifies no captures, then the whole match is produced in each call.
 */
function gmatch(s, pattern) {
    var S = utils_1.coerceArgToString(s, 'gmatch', 1);
    var P = translatePattern(utils_1.coerceArgToString(pattern, 'gmatch', 2));
    var reg = new RegExp(P, 'g');
    var matches = S.match(reg);
    return function () {
        var match = matches.shift();
        if (match === undefined)
            return [];
        var groups = new RegExp(P).exec(match);
        groups.shift();
        return groups.length ? groups : [match];
    };
}
/**
 * Returns a copy of s in which all (or the first n, if given) occurrences of the pattern (see §6.4.1)
 * have been replaced by a replacement string specified by repl, which can be a string, a table, or a function.
 * gsub also returns, as its second value, the total number of matches that occurred.
 * The name gsub comes from Global SUBstitution.
 *
 * If repl is a string, then its value is used for replacement. The character % works as an escape character:
 * any sequence in repl of the form %d, with d between 1 and 9, stands for the value of the d-th captured substring.
 * The sequence %0 stands for the whole match. The sequence %% stands for a single %.
 *
 * If repl is a table, then the table is queried for every match, using the first capture as the key.
 *
 * If repl is a function, then this function is called every time a match occurs,
 * with all captured substrings passed as arguments, in order.
 *
 * In any case, if the pattern specifies no captures, then it behaves as if the whole pattern was inside a capture.
 *
 * If the value returned by the table query or by the function call is a string or a number,
 * then it is used as the replacement string; otherwise, if it is false or nil, then there is no replacement
 * (that is, the original match is kept in the string).
 */
function gsub(s, pattern, repl, n) {
    var S = utils_1.coerceArgToString(s, 'gsub', 1);
    var N = n === undefined ? Infinity : utils_1.coerceArgToNumber(n, 'gsub', 3);
    var P = translatePattern(utils_1.coerceArgToString(pattern, 'gsub', 2));
    var REPL = (function () {
        if (typeof repl === 'function')
            return function (strs) {
                var ret = repl(strs[0])[0];
                return ret === undefined ? strs[0] : ret;
            };
        if (repl instanceof Table_1.Table)
            return function (strs) { return repl.get(strs[0]).toString(); };
        return function (strs) { return ("" + repl).replace(/%([0-9])/g, function (_, i) { return strs[i]; }); };
    })();
    var result = '';
    var count = 0;
    var match;
    var lastMatch;
    while (count < N && S && (match = S.match(P))) {
        var prefix = 
        // eslint-disable-next-line no-nested-ternary
        match[0].length > 0 ? S.substr(0, match.index) : lastMatch === undefined ? '' : S.substr(0, 1);
        lastMatch = match[0];
        result += "" + prefix + REPL(match);
        S = S.substr(("" + prefix + lastMatch).length);
        count += 1;
    }
    return "" + result + S;
}
/**
 * Receives a string and returns its length. The empty string "" has length 0.
 * Embedded zeros are counted, so "a\000bc\000" has length 5.
 */
function len(s) {
    var str = utils_1.coerceArgToString(s, 'len', 1);
    return str.length;
}
/**
 * Receives a string and returns a copy of this string with all uppercase letters changed to lowercase.
 * All other characters are left unchanged.
 * The definition of what an uppercase letter is depends on the current locale.
 */
function lower(s) {
    var str = utils_1.coerceArgToString(s, 'lower', 1);
    return str.toLowerCase();
}
/**
 * Looks for the first match of pattern (see §6.4.1) in the string s.
 * If it finds one, then match returns the captures from the pattern; otherwise it returns nil.
 * If pattern specifies no captures, then the whole match is returned.
 * A third, optional numeric argument init specifies where to start the search; its default value is 1 and can be negative.
 */
function match(s, pattern, init) {
    if (init === void 0) { init = 0; }
    var str = utils_1.coerceArgToString(s, 'match', 1);
    var patt = utils_1.coerceArgToString(pattern, 'match', 2);
    var ini = utils_1.coerceArgToNumber(init, 'match', 3);
    str = str.substr(ini);
    var matches = str.match(new RegExp(translatePattern(patt)));
    if (!matches) {
        return;
    }
    else if (!matches[1]) {
        return matches[0];
    }
    matches.shift();
    return matches;
}
/**
 * Returns a string that is the concatenation of n copies of the string s separated by the string sep.
 * The default value for sep is the empty string (that is, no separator).
 * Returns the empty string if n is not positive.
 */
function rep(s, n, sep) {
    var str = utils_1.coerceArgToString(s, 'rep', 1);
    var num = utils_1.coerceArgToNumber(n, 'rep', 2);
    var SEP = sep === undefined ? '' : utils_1.coerceArgToString(sep, 'rep', 3);
    return Array(num)
        .fill(str)
        .join(SEP);
}
/** Returns a string that is the string s reversed. */
function reverse(s) {
    var str = utils_1.coerceArgToString(s, 'reverse', 1);
    return str
        .split('')
        .reverse()
        .join('');
}
/**
 * Returns the substring of s that starts at i and continues until j; i and j can be negative.
 * If j is absent, then it is assumed to be equal to -1 (which is the same as the string length).
 * In particular, the call string.sub(s,1,j) returns a prefix of s with length j, and string.sub(s, -i)
 * (for a positive j) returns a suffix of s with length i.
 *
 * If, after the translation of negative indices, i is less than 1, it is corrected to 1. If j is greater than
 * the string length, it is corrected to that length. If, after these corrections, i is greater than j,
 * the function returns the empty string.
 */
function sub(s, i, j) {
    if (i === void 0) { i = 1; }
    if (j === void 0) { j = -1; }
    var S = utils_1.coerceArgToString(s, 'sub', 1);
    var start = utils_1.posrelat(utils_1.coerceArgToNumber(i, 'sub', 2), S.length);
    var end = utils_1.posrelat(utils_1.coerceArgToNumber(j, 'sub', 3), S.length);
    if (start < 1)
        start = 1;
    if (end > S.length)
        end = S.length;
    if (start <= end)
        return S.substr(start - 1, end - start + 1);
    return '';
}
/**
 * Receives a string and returns a copy of this string with all lowercase letters changed to uppercase.
 * All other characters are left unchanged.
 * The definition of what a lowercase letter is depends on the current locale.
 */
function upper(s) {
    var S = utils_1.coerceArgToString(s, 'upper', 1);
    return S.toUpperCase();
}
var libString = new Table_1.Table({
    byte: byte,
    char: char,
    find: find,
    format: format,
    gmatch: gmatch,
    gsub: gsub,
    len: len,
    lower: lower,
    match: match,
    rep: rep,
    reverse: reverse,
    sub: sub,
    upper: upper
});
exports.libString = libString;
var metatable = new Table_1.Table({ __index: libString });
exports.metatable = metatable;
