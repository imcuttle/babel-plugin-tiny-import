const fs = require('fs');
const nps = require('path');
const babel = require('babel-core')
const babylon = require('babylon')

const src = fs.readFileSync('../fixture/warpped-import.js').toString();
const ast = babylon.parse(src, {
    sourceType: 'module'
});

const ret = babel.transformFromAst(ast, null, {
    presets: [
        // 'es2015'
    ],
    plugins: [
        [nps.join(__dirname, '../lib/plugins/tiny-import.js'), {
            test: /^@befe\/wrap$/,
            moduleMapper: nps.join(__dirname, '../fixture/wrap.js'),// 'lib',
            easyModuleMapper: {
                // `true` means that opt.moduleMapper will be regarded as filename
                enable: true,
                watch: true,
                basename: false,
            },
        }],
    ]
});


console.log(ret.code);

fs.writeFileSync('./tiny-import-ast.json', JSON.stringify(ret.ast, null, 2))