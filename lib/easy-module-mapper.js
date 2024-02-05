
var babel = require('@babel/core');
var t = require('@babel/core').types;
var utils = require('./utils');
var nps = require('path');
var resolveSync = require('resolve/sync');

function resolve(path, opts = {}) {
    if (typeof path !== 'string') {
        throw new TypeError('Path must be a string. Received ' + path);
    }
    const { basename, resolve, resolvePackageAsAbsolute, filename } = opts
    if (typeof resolve === 'function') {
        return resolve(path, opts);
    }

    var trimmedPath = path.trim();
    if (trimmedPath.startsWith('/')) {
        return path;
    }
    if (basename && trimmedPath.startsWith('.')) {
        return nps.join(basename, path);
    }

    if (resolvePackageAsAbsolute) {
        return resolveSync(path, {
            filename,
            basedir: filename ? nps.dirname(filename): undefined,
            ...(typeof resolvePackageAsAbsolute === 'object' ? resolvePackageAsAbsolute : {})
        })
    }

    return path;
}

var visitor = {
    ExportNamedDeclaration(path, obj) {
        var node = path.node;
        var map = obj.map;
        var moduleName = resolve(node.source.value, obj);

        path.traverse({
            ExportDefaultSpecifier(path) {
                map[path.node.exported.name] = {
                    moduleName: moduleName,
                    ref: 'default'
                };
            },
            ExportSpecifier(path) {
                const exportKind = path.parentPath && path.parentPath.node && path.parentPath.node.exportKind;
                if (path.node.local.name === 'default') {
                    map[path.node.exported.name] = {
                        exportKind,
                        moduleName: moduleName,
                        ref: 'default'
                    };
                }
                else {
                    map[path.node.exported.name] = {
                        exportKind,
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

function getEasyModuleMapper(codeOrAST, opts, transformOpts) {
    var opt = {
        ast: true,
        babelrc: false,
        filename: opts.filename,
        code: false,
        ...transformOpts,
        parserOpts: {
            plugins: [
                'jsx',
                // 'flow',
                'typescript',
                'asyncGenerators',
                'bigInt',
                'classProperties',
                'classPrivateProperties',
                'classPrivateMethods',
                'decorators-legacy',
                'doExpressions',
                'dynamicImport',
                'exportDefaultFrom',
                'exportNamespaceFrom',
                'functionBind',
                'functionSent',
                'importMeta',
                'logicalAssignment',
                'nullishCoalescingOperator',
                'numericSeparator',
                'objectRestSpread',
                'optionalCatchBinding',
                'optionalChaining',
                'partialApplication',
                // 'pipelineOperator',
                'throwExpressions',
                'topLevelAwait'
            ],
            ...(transformOpts ? transformOpts.parserOpts || {} : {})
        },
    };
    var ret;
    if (typeof codeOrAST === 'string') {
        ret = babel.transformSync(codeOrAST, opt);
    } else {
        ret = babel.transformFromAstSync(codeOrAST, '', opt);
    }

    var obj = Object.assign({map: {}}, opts);
    babel.traverse(ret.ast, visitor, void 0, obj);

    return obj.map;
}

module.exports = getEasyModuleMapper;
