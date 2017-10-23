
var babel = require('babel-core');
var t = require('babel-core').types;
var utils = require('./utils');
var nps = require('path');

function resolve(path, basename) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + path);
    }
    var trimmedPath = path.trim();
    if (trimmedPath.startsWith('/')) {
        return path;
    }
    if (basename && trimmedPath.startsWith('.')) {
        return nps.join(basename, path);
    }

    return path;
}

var visitor = {
    ExportNamedDeclaration(path, obj) {
        var node = path.node;
        var map = obj.map;
        var moduleName = resolve(node.source.value, obj.basename);

        path.traverse({
            ExportDefaultSpecifier(path) {
                map[path.node.exported.name] = {
                    moduleName: moduleName,
                    ref: 'default'
                };
            },
            ExportSpecifier(path) {
                if (path.node.local.name === 'default') {
                    map[path.node.exported.name] = {
                        moduleName: moduleName,
                        ref: 'default'
                    };
                }
                else {
                    map[path.node.exported.name] = {
                        moduleName: moduleName,
                        // only allow one depth.
                        ref: path.node.local.name
                    };
                }
            }
        })
    },
    AssignmentExpression(path, obj) {
        var node = path.node;
        var map = obj.map;

        if (
            node.operator === '='
            && t.isMemberExpression(node.left)
            && (
                t.isIdentifier(node.left.object, {name: 'exports'}) ||
                (t.isMemberExpression(node.left.object)
                    && t.isIdentifier(node.left.object.object, {name: 'module'})
                    && t.isIdentifier(node.left.object.property, {name: 'exports'})
                )
            )
            && t.isIdentifier(node.left.property)
            && utils.isRequireNode(node.right)
        ) {
            var key = node.left.property.name;
            var moduleName = resolve(node.right.arguments[0].value, obj.basename);

            map[key] = moduleName
        }
    }
};

function getEasyModuleMapper(codeOrAST, opts) {
    var opt = {
        ast: true,
        babelrc: false,
        code: false
    };
    var ret;
    if (typeof codeOrAST === 'string') {
        ret = babel.transform(codeOrAST, opt);
    } else {
        ret = babel.transformFromAST(codeOrAST, opt);
    }

    var obj = Object.assign({map: {}}, opts);
    babel.traverse(ret.ast, visitor, void 0, obj);

    return obj.map;
}

module.exports = getEasyModuleMapper;
