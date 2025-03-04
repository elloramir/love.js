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
exports.parse = void 0;
var luaparse_1 = require("luaparse");
var isBlock = function (node) {
    return node.type === 'IfClause' ||
        node.type === 'ElseifClause' ||
        node.type === 'ElseClause' ||
        node.type === 'WhileStatement' ||
        node.type === 'DoStatement' ||
        node.type === 'RepeatStatement' ||
        node.type === 'FunctionDeclaration' ||
        node.type === 'ForNumericStatement' ||
        node.type === 'ForGenericStatement' ||
        node.type === 'Chunk';
};
var MemExpr = /** @class */ (function (_super) {
    __extends(MemExpr, _super);
    function MemExpr(base, property) {
        var _this = _super.call(this) || this;
        _this.base = base;
        _this.property = property;
        return _this;
    }
    MemExpr.prototype.get = function () {
        return "__lua.get(" + this.base + ", " + this.property + ")";
    };
    MemExpr.prototype.set = function (value) {
        return this.base + ".set(" + this.property + ", " + value + ")";
    };
    MemExpr.prototype.setFn = function () {
        return this.base + ".setFn(" + this.property + ")";
    };
    MemExpr.prototype.toString = function () {
        return this.get();
    };
    MemExpr.prototype.valueOf = function () {
        return this.get();
    };
    return MemExpr;
}(String));
var UNI_OP_MAP = {
    not: 'not',
    '-': 'unm',
    '~': 'bnot',
    '#': 'len'
};
var BIN_OP_MAP = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '%': 'mod',
    '^': 'pow',
    '/': 'div',
    '//': 'idiv',
    '&': 'band',
    '|': 'bor',
    '~': 'bxor',
    '<<': 'shl',
    '>>': 'shr',
    '..': 'concat',
    '~=': 'neq',
    '==': 'eq',
    '<': 'lt',
    '<=': 'le',
    '>': 'gt',
    '>=': 'ge'
};
var generate = function (node) {
    switch (node.type) {
        case 'LabelStatement': {
            return "case '" + node.label.name + "': label = undefined";
        }
        case 'BreakStatement': {
            return 'break';
        }
        case 'GotoStatement': {
            return "label = '" + node.label.name + "'; continue";
        }
        case 'ReturnStatement': {
            var args = parseExpressions(node.arguments);
            return "return " + args;
        }
        case 'IfStatement': {
            var clauses = node.clauses.map(function (clause) { return generate(clause); });
            return clauses.join(' else ');
        }
        case 'IfClause':
        case 'ElseifClause': {
            var condition = expression(node.condition);
            var body = parseBody(node);
            return "if (__lua.bool(" + condition + ")) {\n" + body + "\n}";
        }
        case 'ElseClause': {
            var body = parseBody(node);
            return "{\n" + body + "\n}";
        }
        case 'WhileStatement': {
            var condition = expression(node.condition);
            var body = parseBody(node);
            return "while(" + condition + ") {\n" + body + "\n}";
        }
        case 'DoStatement': {
            var body = parseBody(node);
            return "\n" + body + "\n";
        }
        case 'RepeatStatement': {
            var condition = expression(node.condition);
            var body = parseBody(node);
            return "do {\n" + body + "\n} while (!(" + condition + "))";
        }
        case 'LocalStatement': {
            return parseAssignments(node);
        }
        case 'AssignmentStatement': {
            return parseAssignments(node);
        }
        case 'CallStatement': {
            return generate(node.expression);
        }
        case 'FunctionDeclaration': {
            var getFuncDef = function (params) {
                var paramStr = params.join(';\n');
                var body = parseBody(node, paramStr);
                var argsStr = params.length === 0 ? '' : '...args';
                var returnStr = node.body.findIndex(function (node) { return node.type === 'ReturnStatement'; }) === -1 ? '\nreturn []' : '';
                return "(" + argsStr + ") => {\n" + body + returnStr + "\n}";
            };
            var params = node.parameters.map(function (param) {
                if (param.type === 'VarargLiteral') {
                    return "$" + nodeToScope.get(param) + ".setVarargs(args)";
                }
                return "$" + nodeToScope.get(param) + ".setLocal('" + param.name + "', args.shift())";
            });
            // anonymous function
            if (node.identifier === null)
                return getFuncDef(params);
            if (node.identifier.type === 'Identifier') {
                var scope = nodeToScope.get(node.identifier);
                var setStr = node.isLocal ? 'setLocal' : 'set';
                return "$" + scope + "." + setStr + "('" + node.identifier.name + "', " + getFuncDef(params) + ")";
            }
            var identifier = generate(node.identifier);
            if (node.identifier.indexer === ':') {
                params.unshift("$" + nodeToScope.get(node) + ".setLocal('self', args.shift())");
            }
            return identifier.set(getFuncDef(params));
        }
        case 'ForNumericStatement': {
            var varName = node.variable.name;
            var start = expression(node.start);
            var end = expression(node.end);
            var step = node.step === null ? 1 : expression(node.step);
            var init = "let " + varName + " = " + start + ", end = " + end + ", step = " + step;
            var cond = "step > 0 ? " + varName + " <= end : " + varName + " >= end";
            var after = varName + " += step";
            var varInit = "$" + nodeToScope.get(node.variable) + ".setLocal('" + varName + "', " + varName + ");";
            var body = parseBody(node, varInit);
            return "for (" + init + "; " + cond + "; " + after + ") {\n" + body + "\n}";
        }
        case 'ForGenericStatement': {
            var iterators = parseExpressions(node.iterators);
            var variables = node.variables
                .map(function (variable, index) {
                return "$" + nodeToScope.get(variable) + ".setLocal('" + variable.name + "', res[" + index + "])";
            })
                .join(';\n');
            var body = parseBody(node, variables);
            return "for (let [iterator, table, next] = " + iterators + ", res = __lua.call(iterator, table, next); res[0] !== undefined; res = __lua.call(iterator, table, res[0])) {\n" + body + "\n}";
        }
        case 'Chunk': {
            var body = parseBody(node);
            return "'use strict'\nconst $0 = __lua.globalScope\nlet vars\nlet vals\nlet label\n\n" + body;
        }
        case 'Identifier': {
            return "$" + nodeToScope.get(node) + ".get('" + node.name + "')";
        }
        case 'StringLiteral': {
            var S = node.value
                .replace(/([^\\])?\\(\d{1,3})/g, function (_, pre, dec) { return "" + (pre || '') + String.fromCharCode(dec); })
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`');
            return "`" + S + "`";
        }
        case 'NumericLiteral': {
            return node.value.toString();
        }
        case 'BooleanLiteral': {
            return node.value ? 'true' : 'false';
        }
        case 'NilLiteral': {
            return 'undefined';
        }
        case 'VarargLiteral': {
            return "$" + nodeToScope.get(node) + ".getVarargs()";
        }
        // inside TableConstructorExpression
        // case 'TableKey': {}
        // case 'TableKeyString': {}
        // case 'TableValue': {}
        case 'TableConstructorExpression': {
            if (node.fields.length === 0)
                return 'new __lua.Table()';
            var fields = node.fields
                .map(function (field, index, arr) {
                if (field.type === 'TableKey') {
                    return "t.rawset(" + generate(field.key) + ", " + expression(field.value) + ")";
                }
                if (field.type === 'TableKeyString') {
                    return "t.rawset('" + field.key.name + "', " + expression(field.value) + ")";
                }
                if (field.type === 'TableValue') {
                    if (index === arr.length - 1 && ExpressionReturnsArray(field.value)) {
                        return "t.insert(..." + generate(field.value) + ")";
                    }
                    return "t.insert(" + expression(field.value) + ")";
                }
            })
                .join(';\n');
            return "new __lua.Table(t => {\n" + fields + "\n})";
        }
        case 'UnaryExpression': {
            var operator = UNI_OP_MAP[node.operator];
            var argument = expression(node.argument);
            if (!operator) {
                throw new Error("Unhandled unary operator: " + node.operator);
            }
            return "__lua." + operator + "(" + argument + ")";
        }
        case 'BinaryExpression': {
            var left = expression(node.left);
            var right = expression(node.right);
            var operator = BIN_OP_MAP[node.operator];
            if (!operator) {
                throw new Error("Unhandled binary operator: " + node.operator);
            }
            return "__lua." + operator + "(" + left + ", " + right + ")";
        }
        case 'LogicalExpression': {
            var left = expression(node.left);
            var right = expression(node.right);
            var operator = node.operator;
            if (operator === 'and') {
                return "__lua.and(" + left + "," + right + ")";
            }
            if (operator === 'or') {
                return "__lua.or(" + left + "," + right + ")";
            }
            throw new Error("Unhandled logical operator: " + node.operator);
        }
        case 'MemberExpression': {
            var base = expression(node.base);
            return new MemExpr(base, "'" + node.identifier.name + "'");
        }
        case 'IndexExpression': {
            var base = expression(node.base);
            var index = expression(node.index);
            return new MemExpr(base, index);
        }
        case 'CallExpression':
        case 'TableCallExpression':
        case 'StringCallExpression': {
            var functionName = expression(node.base);
            var args = node.type === 'CallExpression'
                ? parseExpressionList(node.arguments).join(', ')
                : expression(node.type === 'TableCallExpression' ? node.arguments : node.argument);
            if (functionName instanceof MemExpr && node.base.type === 'MemberExpression' && node.base.indexer === ':') {
                return "__lua.call(" + functionName + ", " + functionName.base + ", " + args + ")";
            }
            return "__lua.call(" + functionName + ", " + args + ")";
        }
        default:
            throw new Error("No generator found for: " + node.type);
    }
};
var parseBody = function (node, header) {
    if (header === void 0) { header = ''; }
    var scope = nodeToScope.get(node);
    var scopeDef = scope === undefined ? '' : "const $" + scope + " = $" + scopeToParentScope.get(scope) + ".extend();";
    var body = node.body.map(function (statement) { return generate(statement); }).join(';\n');
    var goto = nodeToGoto.get(node);
    if (goto === undefined)
        return scopeDef + "\n" + header + "\n" + body;
    var gotoHeader = "L" + goto + ": do { switch(label) { case undefined:";
    var gotoParent = gotoToParentGoto.get(goto);
    var def = gotoParent === undefined ? '' : "break; default: continue L" + gotoParent + "\n";
    var footer = def + "} } while (label)";
    return scopeDef + "\n" + gotoHeader + "\n" + header + "\n" + body + "\n" + footer;
};
var expression = function (node) {
    var v = generate(node);
    if (ExpressionReturnsArray(node))
        return v + "[0]";
    return v;
};
var parseExpressions = function (expressions) {
    // return the `array` directly instead of `[...array]`
    if (expressions.length === 1 && ExpressionReturnsArray(expressions[0])) {
        return generate(expressions[0]);
    }
    return "[" + parseExpressionList(expressions).join(', ') + "]";
};
var parseExpressionList = function (expressions) {
    return expressions.map(function (node, index, arr) {
        var value = generate(node);
        if (ExpressionReturnsArray(node)) {
            return index === arr.length - 1 ? "..." + value : value + "[0]";
        }
        return value;
    });
};
var parseAssignments = function (node) {
    var lines = [];
    var valFns = [];
    var useTempVar = node.variables.length > 1 && node.init.length > 0 && !node.init.every(isLiteral);
    for (var i = 0; i < node.variables.length; i++) {
        var K = node.variables[i];
        var V = node.init[i];
        var initStr = 
        // eslint-disable-next-line no-nested-ternary
        useTempVar ? "vars[" + i + "]" : V === undefined ? 'undefined' : expression(V);
        if (K.type === 'Identifier') {
            var setStr = node.type === 'LocalStatement' ? 'setLocal' : 'set';
            lines.push("$" + nodeToScope.get(K) + "." + setStr + "('" + K.name + "', " + initStr + ")");
        }
        else {
            var name_1 = generate(K);
            if (useTempVar) {
                lines.push("vals[" + valFns.length + "](" + initStr + ")");
                valFns.push(name_1.setFn());
            }
            else {
                lines.push(name_1.set(initStr));
            }
        }
    }
    // push remaining CallExpressions
    for (var i = node.variables.length; i < node.init.length; i++) {
        var init = node.init[i];
        if (isCallExpression(init)) {
            lines.push(generate(init));
        }
    }
    if (useTempVar) {
        lines.unshift("vars = " + parseExpressions(node.init));
        if (valFns.length > 0) {
            lines.unshift("vals = [" + valFns.join(', ') + "]");
        }
    }
    return lines.join(';\n');
};
var isCallExpression = function (node) {
    return node.type === 'CallExpression' || node.type === 'StringCallExpression' || node.type === 'TableCallExpression';
};
var ExpressionReturnsArray = function (node) {
    return isCallExpression(node) || node.type === 'VarargLiteral';
};
var isLiteral = function (node) {
    return (node.type === 'StringLiteral' ||
        node.type === 'NumericLiteral' ||
        node.type === 'BooleanLiteral' ||
        node.type === 'NilLiteral' ||
        node.type === 'TableConstructorExpression');
};
var checkGoto = function (ast) {
    var gotoInfo = [];
    var gotoScope = 0;
    var gotoScopeMap = new Map();
    var getNextGotoScope = (function () {
        var id = 0;
        return function () {
            id += 1;
            return id;
        };
    })();
    var check = function (node) {
        if (isBlock(node)) {
            createGotoScope();
            var _loop_2 = function (i) {
                var n = node.body[i];
                switch (n.type) {
                    case 'LocalStatement': {
                        gotoInfo.push({
                            type: 'local',
                            name: n.variables[0].name,
                            scope: gotoScope
                        });
                        break;
                    }
                    case 'LabelStatement': {
                        if (gotoInfo.find(function (node) { return node.type === 'label' && node.name === n.label.name && node.scope === gotoScope; })) {
                            throw new Error("label '" + n.label.name + "' already defined");
                        }
                        gotoInfo.push({
                            type: 'label',
                            name: n.label.name,
                            scope: gotoScope,
                            last: node.type !== 'RepeatStatement' &&
                                node.body.slice(i).every(function (n) { return n.type === 'LabelStatement'; })
                        });
                        break;
                    }
                    case 'GotoStatement': {
                        gotoInfo.push({
                            type: 'goto',
                            name: n.label.name,
                            scope: gotoScope
                        });
                        break;
                    }
                    case 'IfStatement': {
                        n.clauses.forEach(function (n) { return check(n); });
                        break;
                    }
                    default: {
                        check(n);
                    }
                }
            };
            for (var i = 0; i < node.body.length; i++) {
                _loop_2(i);
            }
            destroyGotoScope();
        }
    };
    check(ast);
    function createGotoScope() {
        var parent = gotoScope;
        gotoScope = getNextGotoScope();
        gotoScopeMap.set(gotoScope, parent);
    }
    function destroyGotoScope() {
        gotoScope = gotoScopeMap.get(gotoScope);
    }
    var _loop_1 = function (i) {
        var goto = gotoInfo[i];
        if (goto.type === 'goto') {
            var label_1 = gotoInfo
                .filter(function (node) { return node.type === 'label' && node.name === goto.name && node.scope <= goto.scope; })
                .sort(function (a, b) { return Math.abs(goto.scope - a.scope) - Math.abs(goto.scope - b.scope); })[0];
            if (!label_1) {
                throw new Error("no visible label '" + goto.name + "' for <goto>");
            }
            var labelI = gotoInfo.findIndex(function (n) { return n === label_1; });
            if (labelI > i) {
                var locals = gotoInfo
                    .slice(i, labelI)
                    .filter(function (node) { return node.type === 'local' && node.scope === label_1.scope; });
                if (!label_1.last && locals.length > 0) {
                    throw new Error("<goto " + goto.name + "> jumps into the scope of local '" + locals[0].name + "'");
                }
            }
        }
    };
    for (var i = 0; i < gotoInfo.length; i++) {
        _loop_1(i);
    }
};
var visitNode = function (node, visitProp, nextScope, isNewScope, nextGoto) {
    var VP = function (node, partOfBlock) {
        if (partOfBlock === void 0) { partOfBlock = true; }
        if (!node)
            return;
        var S = partOfBlock === false && isNewScope ? scopeToParentScope.get(nextScope) : nextScope;
        if (Array.isArray(node)) {
            node.forEach(function (n) { return visitProp(n, S, nextGoto); });
        }
        else {
            visitProp(node, S, nextGoto);
        }
    };
    switch (node.type) {
        case 'LocalStatement':
        case 'AssignmentStatement':
            VP(node.variables);
            VP(node.init);
            break;
        case 'UnaryExpression':
            VP(node.argument);
            break;
        case 'BinaryExpression':
        case 'LogicalExpression':
            VP(node.left);
            VP(node.right);
            break;
        case 'FunctionDeclaration':
            VP(node.identifier, false);
            VP(node.parameters);
            VP(node.body);
            break;
        case 'ForGenericStatement':
            VP(node.variables);
            VP(node.iterators, false);
            VP(node.body);
            break;
        case 'IfClause':
        case 'ElseifClause':
        case 'WhileStatement':
        case 'RepeatStatement':
            VP(node.condition, false);
        /* fall through */
        case 'Chunk':
        case 'ElseClause':
        case 'DoStatement':
            VP(node.body);
            // VK(node.globals)
            // VK(node.comments)
            break;
        case 'ForNumericStatement':
            VP(node.variable);
            VP(node.start, false);
            VP(node.end, false);
            VP(node.step, false);
            VP(node.body);
            break;
        case 'ReturnStatement':
            VP(node.arguments);
            break;
        case 'IfStatement':
            VP(node.clauses);
            break;
        case 'MemberExpression':
            VP(node.base);
            VP(node.identifier);
            break;
        case 'IndexExpression':
            VP(node.base);
            VP(node.index);
            break;
        case 'LabelStatement':
            VP(node.label);
            break;
        case 'CallStatement':
            VP(node.expression);
            break;
        case 'GotoStatement':
            VP(node.label);
            break;
        case 'TableConstructorExpression':
            VP(node.fields);
            break;
        case 'TableKey':
        case 'TableKeyString':
            VP(node.key);
        /* fall through */
        case 'TableValue':
            VP(node.value);
            break;
        case 'CallExpression':
            VP(node.base);
            VP(node.arguments);
            break;
        case 'TableCallExpression':
            VP(node.base);
            VP(node.arguments);
            break;
        case 'StringCallExpression':
            VP(node.base);
            VP(node.argument);
        //     break
        // case 'Identifier':
        // case 'NumericLiteral':
        // case 'BooleanLiteral':
        // case 'StringLiteral':
        // case 'NilLiteral':
        // case 'VarargLiteral':
        // case 'BreakStatement':
        // case 'Comment':
        //     break
        // default:
        //     throw new Error(`Unhandled ${node.type}`)
    }
};
var scopeToParentScope = new Map();
var nodeToScope = new Map();
var gotoToParentGoto = new Map();
var nodeToGoto = new Map();
var setExtraInfo = function (ast) {
    var scopeID = 0;
    var gotoID = 0;
    var visitProp = function (node, prevScope, prevGoto) {
        var nextScope = prevScope;
        var nextGoto = prevGoto;
        if (isBlock(node)) {
            // set scope info
            if (node.body.findIndex(function (n) { return n.type === 'LocalStatement' || (n.type === 'FunctionDeclaration' && n.isLocal); }) !== -1 ||
                (node.type === 'FunctionDeclaration' &&
                    (node.parameters.length > 0 || (node.identifier && node.identifier.type === 'MemberExpression'))) ||
                node.type === 'ForNumericStatement' ||
                node.type === 'ForGenericStatement') {
                scopeID += 1;
                nextScope = scopeID;
                nodeToScope.set(node, scopeID);
                scopeToParentScope.set(scopeID, prevScope);
            }
            // set goto info
            if (node.body.findIndex(function (s) { return s.type === 'LabelStatement' || s.type === 'GotoStatement'; }) !== -1) {
                nextGoto = gotoID;
                nodeToGoto.set(node, gotoID);
                if (node.type !== 'Chunk' && node.type !== 'FunctionDeclaration') {
                    gotoToParentGoto.set(gotoID, prevGoto);
                }
                gotoID += 1;
            }
        }
        // set scope info
        else if (node.type === 'Identifier' || node.type === 'VarargLiteral') {
            nodeToScope.set(node, prevScope);
        }
        visitNode(node, visitProp, nextScope, prevScope !== nextScope, nextGoto);
    };
    visitProp(ast, scopeID, gotoID);
};
var parse = function (data) {
    var ast = luaparse_1.parse(data.replace(/^#.*/, ''), {
        scope: false,
        comments: false,
        luaVersion: '5.3',
        encodingMode: 'x-user-defined'
    });
    checkGoto(ast);
    setExtraInfo(ast);
    return generate(ast).toString();
};
exports.parse = parse;
