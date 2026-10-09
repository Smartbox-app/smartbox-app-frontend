const ts = require('typescript');

/** @type {import('@jest/transform').SyncTransformer} */
module.exports = {
  process(sourceText, sourcePath) {
    const { outputText } = ts.transpileModule(sourceText, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        isolatedModules: true,
        jsx: ts.JsxEmit.React,
      },
      fileName: sourcePath,
    });

    return { code: outputText };
  },
};
