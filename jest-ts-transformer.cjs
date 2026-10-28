const ts = require('typescript');

/** Rewrite Vite `import.meta.env` for CJS Jest. */
const rewriteImportMeta = (sourceText) =>
  sourceText
    .replace(
      /import\.meta\.env\.DEV\b/g,
      '(process.env.NODE_ENV !== "production")',
    )
    .replace(
      /import\.meta\.env\.PROD\b/g,
      '(process.env.NODE_ENV === "production")',
    )
    .replace(
      /import\.meta\.env\.MODE\b/g,
      '(process.env.NODE_ENV || "test")',
    )
    .replace(/import\.meta\.env\.SSR\b/g, 'false')
    .replace(/import\.meta\.env\.(\w+)/g, 'process.env.$1')
    .replace(/import\.meta\.env\b/g, '(process.env)')
    .replace(/import\.meta\b/g, '({ env: process.env, url: "" })');

const skipString = (code, start) => {
  const quote = code[start];
  let i = start + 1;
  while (i < code.length) {
    if (code[i] === '\\') {
      i += 2;
      continue;
    }
    if (code[i] === quote) return i + 1;
    i += 1;
  }
  return code.length;
};

/**
 * ts.transpileModule leaves `require()` above `jest.mock()`, so mocks never
 * apply. Move top-level jest.mock/unmock calls before requires.
 */
const hoistJestMocks = (code) => {
  const mocks = [];
  let result = '';
  let i = 0;

  while (i < code.length) {
    const atLineStart =
      i === 0 || code[i - 1] === '\n' || code[i - 1] === ';';
    const match = atLineStart
      ? code
          .slice(i)
          .match(
            /^[ \t]*jest\.(?:mock|unmock|deepUnmock|disableAutomock|enableAutomock)\(/,
          )
      : null;

    if (!match) {
      result += code[i];
      i += 1;
      continue;
    }

    const start = i;
    i += match[0].length;
    let depth = 1;
    while (i < code.length && depth > 0) {
      const ch = code[i];
      if (ch === '"' || ch === "'" || ch === '`') {
        i = skipString(code, i);
        continue;
      }
      if (ch === '(') depth += 1;
      if (ch === ')') depth -= 1;
      i += 1;
    }
    if (code[i] === ';') i += 1;
    while (code[i] === ' ' || code[i] === '\t' || code[i] === '\n') i += 1;

    mocks.push(code.slice(start, i).trim());
  }

  if (mocks.length === 0) return code;

  const block = `${mocks.join('\n')}\n`;
  if (result.startsWith('"use strict";')) {
    return result.replace('"use strict";', `"use strict";\n${block}`);
  }
  return block + result;
};

/** @type {import('@jest/transform').SyncTransformer} */
module.exports = {
  process(sourceText, sourcePath) {
    const { outputText } = ts.transpileModule(rewriteImportMeta(sourceText), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2019,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        isolatedModules: true,
        downlevelIteration: true,
        jsx: ts.JsxEmit.React,
      },
      fileName: sourcePath,
    });

    return { code: hoistJestMocks(outputText) };
  },
};
