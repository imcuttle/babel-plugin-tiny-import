/**
 * @file: tiny-import
 * @author: cong
 */

var t = require('@babel/core').types;
var fs = require('fs');
var nps = require('path');
var objectHash = require('object-hash');
var utils = require('../utils');
var easyModuleMapper = require('../easy-module-mapper');

function match(rule, value) {
    if (rule instanceof RegExp) {
        return rule.test(value);
    }
    if (typeof rule === 'string') {
        return value === rule;
    }
    if (typeof rule === 'function') {
        return !!rule(value);
    }
    throw new TypeError('match function: the rule `' + rule + "` isn't typeof (RegExp|String|Function)");
}

var getImportedExportVisitor = {
    ExportSpecifier(path, map) {
        if (t.isIdentifier(path.node.exported)) {
            map[path.node.local.name] = {
                value: t.isIdentifier(path.node.exported) ? path.node.exported.name : path.node.local.name,
                selfPath: path,
            };
        }
    },
    ImportSpecifier(path, map) {
        if (t.isIdentifier(path.node.imported)) {
            map[path.node.local.name] = {
                value: t.isIdentifier(path.node.imported) ? path.node.imported.name : path.node.local.name,
                selfPath: path
            };
        }
        return;
    },
};

function isEmpty(map) {
    if (!map) return true;
    if (!Object.keys(map).length) return true;
}

function split(src, map) {
    for (var key in map) {
        if (map.hasOwnProperty(key) && src.hasOwnProperty(key)) {
            delete src[key];
        }
    }
    return src;
}

function assertModuleMapper(mapper) {
    if (typeof mapper !== 'function' && typeof mapper !== 'object' && typeof mapper !== 'string') {
        throw new TypeError('the mapper: `' + mapper + "` isn't typeof (Object|Function|String)");
    }
}

function packModuleMapper(moduleMapper) {
    assertModuleMapper(moduleMapper);

    if (typeof moduleMapper !== 'function') {
        moduleMapper = (function (moduleMapper) {
            return typeof moduleMapper === 'object'
                ? function (imported, moduleName) {
                    return moduleMapper[imported];
                }
                : function (imported, moduleName) {
                    return (
                        moduleName.replace(/\/*$/, '/') +
                        (moduleMapper && moduleMapper.trim() ? moduleMapper.trim().replace(/^\/*(.*?)\/*$/, '$1/') : '') +
                        imported.replace(/^\/*/, '')
                    );
                };
        })(moduleMapper);
    }
    return moduleMapper;
}

function getImportOrExportDeclarationMultipleNodes(map, {
    moduleMapper, moduleName, state, isImport = true
}) {
    var ignoreMap = state.ignoreMap;
    moduleMapper = packModuleMapper(moduleMapper);

    return Object.keys(map).map(function (local) {
        var obj = map[local];
        var imported = obj.value;
        var selfPath = obj.selfPath;
        var ret = moduleMapper(imported, moduleName);
        if (!ret) {
            ignoreMap[local] = true;
            return {
                ...selfPath.parentPath.node,
                specifiers: [selfPath.node]
            }
        }
        const exportKind = ret.exportKind;
        const node = isImport ? t.importDeclaration(
            [
                !ret.ref || ret.ref === 'default'
                    ? t.importDefaultSpecifier(t.identifier(local))
                    : t.importSpecifier(t.identifier(local), t.identifier(ret.ref)),
            ],
            t.stringLiteral(typeof ret === 'string' ? ret : ret.moduleName),
        ) : t.exportNamedDeclaration(
            null, [
                !ret.ref || ret.ref === 'default'
                    ? t.exportDefaultSpecifier(t.identifier(local))
                    : t.exportSpecifier(t.identifier(local), t.identifier(ret.ref)),
            ],
            t.stringLiteral(typeof ret === 'string' ? ret : ret.moduleName),
        );
        if (exportKind === 'type') {
            node[isImport ? 'importKind' : 'exportKind'] = 'type';
        }
        return node;
    });
}

var data = new Map();

function tinyImport(babel) {
    return {
        pre(path) {
            this.ignoreMap = {};
            // this.localModules = {};
        },
        visitor: {
            Program: {
                enter(path, state) {
                    var opts = state.opts;
                    if (typeof opts.moduleMapper === 'string' && opts.easyModuleMapper && opts.easyModuleMapper.enable) {
                        var stat = fs.statSync(opts.moduleMapper);
                        var basename =
                            (opts.easyModuleMapper.basename == null ||
                                (typeof opts.easyModuleMapper.basename !== 'string' && opts.easyModuleMapper.basename))
                                ? nps.dirname(opts.moduleMapper)
                                : opts.easyModuleMapper.basename;

                        const item = data.get(opts.moduleMapper) || { mtime: null, mapper: null };
                        const inputDep = { ...opts.easyModuleMapper, basename: basename, filename: opts.moduleMapper };
                        data.set(`${opts.moduleMapper}-${objectHash(inputDep)}`, item)
                        if (!item.mtime) {
                            item.mapper = easyModuleMapper(
                                fs.readFileSync(opts.moduleMapper).toString(),
                                inputDep,
                                opts.easyModuleMapper.transformOpts,
                            );
                            item.mtime = stat.mtime;
                        } else if (opts.easyModuleMapper.watch && item.mtime.getTime() !== stat.mtime.getTime()) {
                            item.mapper = easyModuleMapper(
                                fs.readFileSync(opts.moduleMapper).toString(),
                                inputDep,
                                opts.easyModuleMapper.transformOpts,
                            );
                            item.mtime = stat.mtime;
                        }
                        opts.moduleMapper = item.mapper;
                    }
                },
                exit() {

                }
                /*exit(path, state) {
                            var localModules = this.localModules;
                            path.traverse({
                                Identifier(path) {
                                    var grantParent = path.parentPath && path.parentPath.parentPath;
                                    var matchedNode = null;
                                    var localModule = localModules[path.node.name];

                                    if (localModule) {
                                        if (grantParent) {
                                            if (t.isImportDeclaration(grantParent.node)
                                                || t.isVariableDeclaration(grantParent.node)
                                                || t.isVariableDeclarator(grantParent.node)
                                            ) {
                                                matchedNode = path.parentPath.node;
                                            } else if (
                                                t.isObjectPattern(grantParent.node)
                                                && t.isVariableDeclarator(grantParent.parentPath.node)
                                            ) {
                                                matchedNode = grantParent.parentPath.node;
                                            }

                                            if (matchedNode) {
                                                localModule.matchedNode = matchedNode;
                                                localModule.unused = true;
                                                return;
                                            }
                                        }

                                        localModule.unused = false;
                                    }
                                }
                            });


                            Object.keys(localModules).map(function (name) {
                                var localModule = localModules[name];
                                if (!localModule.unused) {
                                    console.log(localModule.value);
                                }
                            });
                        }*/
            },
            ImportDeclaration(path, state) {
                if (!match(state.opts.test, path.node.source.value) || state.opts.moduleMapper == null) return;
                var map = {};
                path.traverse(getImportedExportVisitor, map);

                if (!isEmpty(split(map, this.ignoreMap))) {
                    path.replaceWithMultiple(
                        getImportOrExportDeclarationMultipleNodes(map, {
                            moduleMapper: state.opts.moduleMapper,
                            moduleName: path.node.source.value,
                            state: this,
                        }),
                    );
                }
            },
            ExportNamedDeclaration(path, state) {
                if (!match(state.opts.test, path.node.source.value) || state.opts.moduleMapper == null) return;
                var map = {};
                path.traverse(getImportedExportVisitor, map);

                if (!isEmpty(split(map, this.ignoreMap))) {
                    path.replaceWithMultiple(
                        getImportOrExportDeclarationMultipleNodes(map, {
                            moduleMapper: state.opts.moduleMapper, moduleName: path.node.source.value, state: this,
                            isImport: false
                        }),
                    );
                }
            },

            VariableDeclaration(path, state) {
                // var localModules = this.localModules;

                // es2015 matched this
                path.traverse(
                    {
                        VariableDeclarator(path, state) {
                            var node = path.node;
                            if (
                                state.opts.moduleMapper != null &&
                                t.isObjectPattern(node.id) &&
                                node.id.properties.length &&
                                utils.isRequireNode(node.init) &&
                                match(state.opts.test, node.init.arguments[0].value)
                            ) {
                                var list = node.id.properties.map(function (prop) {
                                    return {
                                        self: node,
                                        local: prop.value.name,
                                        imported: prop.key.name,
                                    };
                                });
                                var moduleMapper = packModuleMapper(state.opts.moduleMapper);
                                var moduleName = node.init.arguments[0].value;
                                var restArguments = node.init.arguments.slice(1);

                                /*if (state.opts.dangerouslyRemoveUnuseImport) {
                                                var map = list.reduce(function (obj, item) {
                                                    obj[item.local] = {
                                                        value: item.local,
                                                        self: item.self
                                                    };
                                                    return obj;
                                                }, {});
                                            }*/

                                path.replaceWithMultiple(
                                    list.map(function (obj) {
                                        var ret = moduleMapper(obj.imported, moduleName);

                                        var callExpression = t.callExpression(
                                            node.init.callee,
                                            [t.stringLiteral(typeof ret === 'string' ? ret : ret ? ret.moduleName : moduleName)].concat(
                                                restArguments,
                                            ),
                                        );

                                        if (!ret) {
                                            return obj.self;
                                        }

                                        return t.VariableDeclarator(
                                            t.identifier(obj.local),
                                            !ret.ref ? callExpression : t.memberExpression(callExpression, t.identifier(ret.ref)),
                                        );
                                    }),
                                );
                            }
                        },
                    },
                    state,
                );
            },
        }
    };
}

module.exports = tinyImport;
