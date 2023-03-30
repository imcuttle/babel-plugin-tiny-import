const fs = require('fs');
const nps = require('path');
const babel = require('@babel/core')
const babylon = require('@babel/parser')

const src = fs.readFileSync('../fixture/ts/ts-import.ts').toString();
const ast = babylon.parse(src, {
    sourceType: 'module',
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
    ]
});

const ret = babel.transformFromAst(ast, null, {
    presets: [
        // 'es2015'
    ],
    plugins: [
        [nps.join(__dirname, '../lib/plugins/tiny-import.js'), {
            test: /^@ecom\/robin($|\/index)/,
            // actualTest: '@befe/wrap/v2',
            moduleMapper: nps.join(__dirname, '../fixture/ts.ts'),// 'lib',
            // moduleMapper: '',
            easyModuleMapper: {
                // `true` means that opt.moduleMapper will be regarded as filename
                // enable: false,
                enable: true,
                watch: true,
                basename: '@ecom/robin',
            },
        }],
    ]
});


console.log(ret.code);

// fs.writeFileSync('./tiny-import-ast.json', JSON.stringify(ret.ast, null, 2))