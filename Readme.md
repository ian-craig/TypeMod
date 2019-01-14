# TypeMod

This is currently an experiment to better understand how the TypeScript compiler can be used for codemods which need to understand types and references.

- Use the language service to do tasks like find references or rename locations
- Modify the TypeScript AST directly and format back to source code

## How to use

Clone, npm install, and then simply run

`npm run cli`

This runs `src/main.ts` and passes in the TS project in `./example`.