var t = require('babel-types')

var utils = module.exports;

utils.isRequireNode = function (node) {
    return (
        t.isCallExpression(node)
        && t.isIdentifier(node.callee, {name: 'require'})
        && node.arguments.length
        && t.isStringLiteral(node.arguments[0])
    )
};