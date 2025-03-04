"use strict";
exports.__esModule = true;
exports.getLibOS = void 0;
var Table_1 = require("../Table");
var utils_1 = require("../utils");
var LuaError_1 = require("../LuaError");
var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DATE_FORMAT_HANDLERS = {
    '%': function () { return '%'; },
    Y: function (date, utc) { return "" + (utc ? date.getUTCFullYear() : date.getFullYear()); },
    y: function (date, utc) { return DATE_FORMAT_HANDLERS.Y(date, utc).substr(-2); },
    b: function (date, utc) { return DATE_FORMAT_HANDLERS.B(date, utc).substr(0, 3); },
    B: function (date, utc) { return MONTHS[utc ? date.getUTCMonth() : date.getMonth()]; },
    m: function (date, utc) { return ("0" + ((utc ? date.getUTCMonth() : date.getMonth()) + 1)).substr(-2); },
    U: function (date, utc) { return getWeekOfYear(date, 0, utc); },
    W: function (date, utc) { return getWeekOfYear(date, 1, utc); },
    j: function (date, utc) {
        var result = utc ? date.getUTCDate() : date.getDate();
        var month = utc ? date.getUTCMonth() : date.getMonth();
        var year = utc ? date.getUTCFullYear() : date.getFullYear();
        result += DAYS_IN_MONTH.slice(0, month).reduce(function (sum, n) { return sum + n; }, 0);
        if (month > 1 && year % 4 === 0) {
            result += 1;
        }
        return ("00" + result).substr(-3);
    },
    d: function (date, utc) { return ("0" + (utc ? date.getUTCDate() : date.getDate())).substr(-2); },
    a: function (date, utc) { return DATE_FORMAT_HANDLERS.A(date, utc).substr(0, 3); },
    A: function (date, utc) { return DAYS[utc ? date.getUTCDay() : date.getDay()]; },
    w: function (date, utc) { return "" + (utc ? date.getUTCDay() : date.getDay()); },
    H: function (date, utc) { return ("0" + (utc ? date.getUTCHours() : date.getHours())).substr(-2); },
    I: function (date, utc) { return ("0" + ((utc ? date.getUTCHours() : date.getHours()) % 12 || 12)).substr(-2); },
    M: function (date, utc) { return ("0" + (utc ? date.getUTCMinutes() : date.getMinutes())).substr(-2); },
    S: function (date, utc) { return ("0" + (utc ? date.getUTCSeconds() : date.getSeconds())).substr(-2); },
    c: function (date, utc) { return date.toLocaleString(undefined, utc ? { timeZone: 'UTC' } : undefined); },
    x: function (date, utc) {
        var m = DATE_FORMAT_HANDLERS.m(date, utc);
        var d = DATE_FORMAT_HANDLERS.d(date, utc);
        var y = DATE_FORMAT_HANDLERS.y(date, utc);
        return m + "/" + d + "/" + y;
    },
    X: function (date, utc) {
        var h = DATE_FORMAT_HANDLERS.H(date, utc);
        var m = DATE_FORMAT_HANDLERS.M(date, utc);
        var s = DATE_FORMAT_HANDLERS.S(date, utc);
        return h + ":" + m + ":" + s;
    },
    p: function (date, utc) { return ((utc ? date.getUTCHours() : date.getHours()) < 12 ? 'AM' : 'PM'); },
    Z: function (date, utc) {
        if (utc)
            return 'UTC';
        var match = date.toString().match(/[A-Z][A-Z][A-Z]/);
        return match ? match[0] : '';
    }
};
function isDST(date) {
    var year = date.getFullYear();
    var jan = new Date(year, 0);
    // ASSUMPTION: If the time offset of the date is the same as it would be in January of the same year, DST is not in effect.
    return date.getTimezoneOffset() !== jan.getTimezoneOffset();
}
function getWeekOfYear(date, firstDay, utc) {
    var dayOfYear = parseInt(DATE_FORMAT_HANDLERS.j(date, utc), 10);
    var jan1 = new Date(date.getFullYear(), 0, 1, 12);
    var offset = (8 - (utc ? jan1.getUTCDay() : jan1.getDay()) + firstDay) % 7;
    return ("0" + (Math.floor((dayOfYear - offset) / 7) + 1)).substr(-2);
}
function date(input, time) {
    if (input === void 0) { input = '%c'; }
    var utc = input.substr(0, 1) === '!';
    var string = utc ? input.substr(1) : input;
    var date = new Date();
    if (time) {
        date.setTime(time * 1000);
    }
    if (string === '*t') {
        return new Table_1.Table({
            year: parseInt(DATE_FORMAT_HANDLERS.Y(date, utc), 10),
            month: parseInt(DATE_FORMAT_HANDLERS.m(date, utc), 10),
            day: parseInt(DATE_FORMAT_HANDLERS.d(date, utc), 10),
            hour: parseInt(DATE_FORMAT_HANDLERS.H(date, utc), 10),
            min: parseInt(DATE_FORMAT_HANDLERS.M(date, utc), 10),
            sec: parseInt(DATE_FORMAT_HANDLERS.S(date, utc), 10),
            wday: parseInt(DATE_FORMAT_HANDLERS.w(date, utc), 10) + 1,
            yday: parseInt(DATE_FORMAT_HANDLERS.j(date, utc), 10),
            isdst: isDST(date)
        });
    }
    return string.replace(/%[%YybBmUWjdaAwHIMScxXpZ]/g, function (f) { return DATE_FORMAT_HANDLERS[f[1]](date, utc); });
}
function setlocale(locale) {
    if (locale === void 0) { locale = 'C'; }
    if (locale === 'C')
        return 'C';
    // TODO: implement fully
}
function time(table) {
    var now = Math.round(Date.now() / 1000);
    if (!table)
        return now;
    var year = table.rawget('year');
    var month = table.rawget('month');
    var day = table.rawget('day');
    var hour = table.rawget('hour') || 12;
    var min = table.rawget('min');
    var sec = table.rawget('sec');
    // const isdst = table.rawget('isdst') as boolean
    if (year)
        now += year * 31557600;
    if (month)
        now += month * 2629800;
    if (day)
        now += day * 86400;
    if (hour)
        now += hour * 3600;
    if (min)
        now += min * 60;
    if (sec)
        now += sec;
    return now;
}
function difftime(t2, t1) {
    var T2 = utils_1.coerceArgToNumber(t2, 'difftime', 1);
    var T1 = utils_1.coerceArgToNumber(t1, 'difftime', 2);
    return T2 - T1;
}
var getLibOS = function (cfg) {
    function exit(code) {
        if (!cfg.osExit)
            throw new LuaError_1.LuaError('os.exit requires the config.osExit function');
        var CODE = 0;
        if (typeof code === 'boolean' && code === false)
            CODE = 1;
        else if (typeof code === 'number')
            CODE = code;
        cfg.osExit(CODE);
    }
    return new Table_1.Table({
        date: date,
        exit: exit,
        setlocale: setlocale,
        time: time,
        difftime: difftime
    });
};
exports.getLibOS = getLibOS;
