const babel = require('@babel/core')
const nps = require('path')

const fixture = (file) => nps.resolve(__dirname, 'fixture', file)

const transformFile = (file, {easyModuleMapper} = {}) => {
    return babel.transformFileSync(fixture(file), {
        configFile:false,
        babelrc: false,
        parserOpts: {
            plugins: [
                'typescript'
            ]
        },
        plugins: [
            [require.resolve('../index'), {
                test: /^comps$/, // RegExp | Function | String
                moduleMapper: fixture('components-wrapper.ts'), // {} | string | (imported, moduleName) => moduleName | {moduleName: string, ref: string},
                easyModuleMapper: {
                    resolvePackageAsAbsolute: true,
                    // `true` means that opt.moduleMapper will be regarded as filename
                    enable: true,
                    // watch the opt.moduleMapper file's change.
                    watch: true,
                    // the basename of opt.moduleMapper file's *Relative Module*.
                    basename: 'comps', // true | false | string
                    ...easyModuleMapper
                }
            }]
        ]
    }).code
}

describe('babel-plugin-tiny-import', function () {
    it('resolve relative path', function () {
        expect(transformFile(fixture('consumer-relative.ts'))).toMatchInlineSnapshot(`
"import { AProps } from "comps/components/a";
import A from "comps/components/a";
import B from "comps/components/b";
import C from "comps/components/c";
import D from "comps/components/d";
import E from "comps/components/e";
import F from "comps/components/f";
import type { AType } from "comps/components/a";
import type { NotFound } from 'comps';
import { B as X } from './components-wrapper';"
`)
    });
    it('resolve package path', function () {
        expect(transformFile(fixture('consumer-package.ts'))).toMatchInlineSnapshot(`
"export DPkg from "./node_modules/d/main.ts";
export EPkg from "./node_modules/e/main.js";
export FPkg from "./node_modules/f/main.js";
export { NotFound } from 'comps';
export var a = 2;
import E from 'e';"
`)
    });
    it('resolve package path 2', function () {
        expect(transformFile(fixture('consumer-package.ts'), {
  easyModuleMapper: {
    resolvePackageAsAbsolute: {
      packageFilter: (pkg) => {
        return {
          ...pkg,
          main: pkg.browser || pkg.module || pkg.main
        };
      }
    }
  }
})).toMatchInlineSnapshot(`
"export DPkg from "./node_modules/d/main.ts";
export EPkg from "./node_modules/e/main.es.js";
export FPkg from "./node_modules/f/main.browser.js";
export { NotFound } from 'comps';
export var a = 2;
import E from 'e';"
`)
    });
    it('resolve package path 3', function () {
        expect(transformFile(fixture('consumer-package.ts'), {
  easyModuleMapper: { resolvePackageAsAbsolute: false }
})).toMatchInlineSnapshot(`
"export DPkg from "d";
export EPkg from "e";
export FPkg from "f";
export { NotFound } from 'comps';
export var a = 2;
import E from 'e';"
`)
    });
})
