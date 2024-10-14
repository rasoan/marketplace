/* eslint-disable no-magic-numbers */
// todo: В бек и фронт репозиториях 2 одинаковых eslint.config,
//   вынести это в detools и оттуда импортнуть в оба репозитория,
//   что бы не было копипасты.

module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [ "@typescript-eslint", "prettier", "unicorn" ],
    extends: [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        // https://eslint.org/docs/latest/rules/
        'eslint:recommended',
        // https://github.com/eslint-community/eslint-plugin-promise?tab=readme-ov-file#rules
        'plugin:promise/recommended',
        // https://github.com/sindresorhus/eslint-plugin-unicorn?tab=readme-ov-file#rules
        'plugin:unicorn/recommended',
    ],
    rules: {
        'no-unused-vars': 'off',
        // "no-unused-vars": [
        //     "error",
        //     {"ignoreRestSiblings": true, "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_"},
        // ],
        "@typescript-eslint/no-unused-vars": [ "error" ],
        "spaced-comment": 0,

        "prettier/prettier": 0,

        "array-callback-return": [
            "error",
            {
                "allowImplicit": true,
                "checkForEach": true,
            },
        ],
        // todo: https://eslint.org/docs/latest/rules/no-await-in-loop
        // "no-await-in-loop": "error",
        "no-promise-executor-return": "error",
        "no-constructor-return": "error",
        // https://eslint.org/docs/latest/rules/no-unreachable-loop
        "no-unreachable-loop": "error",
        // https://eslint.org/docs/latest/rules/require-atomic-updates
        "require-atomic-updates": "error",
        // https://eslint.org/docs/latest/rules/no-self-compare
        "no-self-compare": "error",
        /** [Disallow use of this in contexts where the value of this is undefined](https://eslint.org/docs/latest/rules/no-invalid-this) */
        "no-invalid-this": "error",
        /** [Disallow assignment operators in conditional expressions](https://eslint.org/docs/latest/rules/no-cond-assign) */
        "no-cond-assign": "error",
        /** [Disallow using an async function as a Promise executor](https://eslint.org/docs/latest/rules/no-async-promise-executor) */
        "no-async-promise-executor": "error",
        /** [Disallow control characters in regular expressions](https://eslint.org/docs/latest/rules/no-control-regex) */
        "no-control-regex": "error",
        /** [Disallow duplicate arguments in function definitions](https://eslint.org/docs/latest/rules/no-dupe-args) */
        "no-dupe-args": "error",
        /** [Disallow duplicate conditions in if-else-if chains](https://eslint.org/docs/latest/rules/no-dupe-else-if) */
        "no-dupe-else-if": "error",
        /** [Disallow duplicate case labels](https://eslint.org/docs/latest/rules/no-duplicate-case) */
        "no-duplicate-case": "error",
        /** [Disallow duplicate module imports](https://eslint.org/docs/latest/rules/no-duplicate-imports) */
        "no-duplicate-imports": "error",
        // todo: Это правило требует обновления ESLint
        // /** [This rule warns the assignments, increments, and decrements of imported bindings.](https://eslint.org/docs/latest/rules/no-import-assign) */
        // "no-import-assign": "error",
        /** [Disallow irregular whitespace](https://eslint.org/docs/latest/rules/no-irregular-whitespace) */
        "no-irregular-whitespace": "error",
        // note: Может быть понадобиться
        // /** [Disallow literal numbers that lose precision](https://eslint.org/docs/latest/rules/no-loss-of-precision) */
        // "no-loss-of-precision": "error",
        /** [Disallow template literal placeholder syntax in regular strings](https://eslint.org/docs/latest/rules/no-template-curly-in-string) */
        "no-template-curly-in-string": "error",
        /** [Disallow the use of undeclared variables unless mentioned in `\/*global *\/` comments](https://eslint.org/docs/latest/rules/no-undef) */
        "no-undef": "error",
        /** [Disallow unmodified loop conditions](https://eslint.org/docs/latest/rules/no-unmodified-loop-condition) */
        "no-unmodified-loop-condition": "error",
        /** [Disallow control flow statements in finally blocks](https://eslint.org/docs/latest/rules/no-unsafe-finally) */
        "no-unsafe-finally": "error",
        /** [Disallow negating the left operand of relational operators](https://eslint.org/docs/latest/rules/no-unsafe-negation) */
        "no-unsafe-negation": "error",
        // todo: Это правило требует обновления ESLint
        // /** [Disallow use of optional chaining in contexts where the undefined value is not allowed](https://eslint.org/docs/latest/rules/no-unsafe-optional-chaining) */
        // "no-unsafe-optional-chaining": "error",
        // todo: Это правило требует обновления ESLint
        // /** [Disallow variable assignments when the value is not used(https://eslint.org/docs/latest/rules/no-useless-assignment) */
        // "no-useless-assignment": "error",
        /** [Require calls to isNaN() when checking for NaN](https://eslint.org/docs/latest/rules/use-isnan) */
        "use-isnan": "error",
        /** [Enforce comparing typeof expressions against valid strings](https://eslint.org/docs/latest/rules/valid-typeof) */
        "valid-typeof": "error",
        // todo: Это правило требует обновления ESLint
        // /** [Enforce default clauses in switch statements to be last](https://eslint.org/docs/latest/rules/default-case-last) */
        // "default-case-last": "error",
        // todo: Это правило требует обновления ESLint
        // /** [Require grouped accessor pairs in object literals and classes](Require grouped accessor pairs in object literals and classes) */
        // "grouped-accessor-pairs": "error",
        /** [Enforce variables to be declared either together or separately in functions](https://eslint.org/docs/latest/rules/one-var) */
        "one-var": ["error", "never"],
        // note: Это правило делает совсем не то, что нам нужно.
        // /** [Require or disallow an empty line after variable declarations](https://eslint.org/docs/latest/rules/newline-after-var) */
        // "newline-after-var": [ "error", "never" ],
        // note: Это правило делает совсем не то, что нам нужно. Оно не ругается на код: `let a = 1; let b = 2;`
        // /** [Require or disallow newlines around variable declarations]https://eslint.org/docs/latest/rules/one-var-declaration-per-line) */
        // "one-var-declaration-per-line": [ "error", "always" ],
        /** [Enforce consistent linebreak style for operators](https://eslint.org/docs/latest/rules/operator-linebreak) */
        "operator-linebreak": ["error", "before", {
            "overrides": {
                "=": "after",
                "+=": "after",
            },
        }],

        // /**
        //  * [Enforce a maximum cyclomatic complexity allowed in a program](https://eslint.org/docs/latest/rules/complexity)
        //  *
        //  * К сожалению, это правило считает "сложность" неправильно. Например, для type guards будет очень высокая "сложность",
        //  *  хотя там просто последовательно проверяется объект.
        //  *
        //  * Поэтому, я отключаю это правило и продолжаем искать другое, которое будет более адекватно считать "сложность",
        //  *  т.е. считать только "вложенную сложность" (количество вхоложенных if/for и т.д.).
        //  */
        // "complexity": [
        //     "warn",
        //     { "max": 4 },
        // ],
        // Это правило будет периодически мешать, но полезность от него больше, чем неудобства.
        // https://eslint.org/docs/latest/rules/class-methods-use-this
        "class-methods-use-this": "error",
        // todo: Это правило требует обновления ESLint
        // "no-constant-binary-expression": "error",

        "no-debugger": "warn",

        // Я остановился на "func-name-matching" на странице https://eslint.org/docs/latest/rules/, при рассмотрении
        //  выключенных по-умолчанию правил.

        "no-magic-numbers": [
            "error",
            {
                // todo: Разрешить такое использование -1
                //   - let startIndex = -1;
                //   - str.slice(-1 * endBorder)
                "ignore": [
                    // Нужно игнорировать 0 всегда.
                    // Нужно игнорировать 1 для:
                    // - `Math.floor(value + 1)`
                    // - `groups[groups.length - 1]`
                    0, 1,
                ],
                "detectObjects": false,
                "enforceConst": true,
                "ignoreArrayIndexes": true,
                "ignoreDefaultValues": true,
            },
        ],
        "no-throw-literal": "error",
        "no-trailing-spaces": [
            "error",
            {
                "ignoreComments": true,
            },
        ],

        /** [Enforce "for" loop update clause moving the counter in the right direction](https://eslint.org/docs/latest/rules/for-direction) */
        "for-direction": "error",

        // https://eslint.org/docs/latest/rules/padded-blocks#rule-details
        "padded-blocks": [
            "error",
            {
                "blocks": "never",
            },
            {
                "allowSingleLineBlocks": true,
            },
        ],
        "no-multiple-empty-lines": [
            "warn",
            {
                "max": 1,
                "maxBOF": 1,
                "maxEOF": 1,
            },
        ],
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "always",
            {
                // `variable != null` is allowed
                "null": "ignore",
            },
        ],
        // Выключил это правило, т.к. eslint считает, что в ESModule (в том числе в ts-файлах) не должно быть 'use strict'
        "strict": 0,
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "objects": "always-multiline",
                "imports": "always-multiline",
                "exports": "always-multiline",
                "functions": "ignore",
            },
        ],
        // https://eslint.org/docs/latest/rules/comma-spacing
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true,
            },
        ],
        "camelcase": 0,
        "import/imports-first": 0,
        "import/newline-after-import": 0,
        "import/no-dynamic-require": 0,
        "import/no-extraneous-dependencies": 0,
        "import/no-named-as-default": 0,
        "import/no-unresolved": 0,
        "import/no-webpack-loader-syntax": 0,
        "import/prefer-default-export": 0,
        "indent": [
            2,
            4,
            {
                "SwitchCase": 1,
                "ignoreComments": true,
                "flatTernaryExpressions": true,
                "ObjectExpression": 1,
                "ArrayExpression": 1,
                "FunctionExpression": {
                    "body": 1,
                    "parameters": 1,
                },
                "CallExpression": {
                    "arguments": 1,
                },
            },
        ],
        "jsx-a11y/aria-props": 0,
        "jsx-a11y/heading-has-content": 0,
        "jsx-a11y/label-has-for": 0,
        "jsx-a11y/mouse-events-have-key-events": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/role-has-required-aria-props": 0,
        "jsx-a11y/role-supports-aria-props": 0,
        "arrow-body-style": 0,
        "max-len": 0,
        "newline-per-chained-call": 0,
        "no-confusing-arrow": 0,
        "no-console": 0,
        "no-plusplus": 0,
        "no-void": 0,
        "no-continue": 0,
        "no-underscore-dangle": 0,
        "no-use-before-define": 0,
        "no-useless-escape": 0,
        "no-nested-ternary": 0,
        "no-shadow": 0,
        "no-param-reassign": 0,
        "func-names": 0,
        "prefer-arrow-callback": 0,
        "prefer-template": 0,
        "prefer-destructuring": 0,
        "prefer-const": [
            "error",
            {
                "destructuring": "all",
            },
        ],

        // https://eslint.org/docs/latest/rules/no-extra-boolean-cast
        // Выключил, потому что нет ничего плохого в написании `if (!!item) {}`
        "no-extra-boolean-cast": 0,

        "require-yield": 0,
        //https://eslint.org/docs/latest/rules/brace-style
        "brace-style": [
            "warn",
            "stroustrup",
            {
                "allowSingleLine": true,
            },
        ],
        //https://eslint.org/docs/latest/rules/default-param-last
        "default-param-last": ["error"],
        // https://eslint.org/docs/latest/rules/semi
        "semi": [
            "error",
            "always",
        ],

        // https://eslint.org/docs/latest/rules/key-spacing
        "key-spacing": "error",
        // https://eslint.org/docs/latest/rules/keyword-spacing
        "keyword-spacing": [
            "error",
            {
                "after": true,
            },
        ],
        /** [Enforce consistent brace style for all control statements](https://eslint.org/docs/latest/rules/curly) */
        "curly": 'error',
        // https://eslint.org/docs/latest/rules/arrow-spacing
        "arrow-spacing": ["error", {"before": true, "after": true}],
        // https://eslint.org/docs/latest/rules/space-before-blocks
        "space-before-blocks": ["error", {"functions": "always", "keywords": "always", "classes": "always"}],
        // https://eslint.org/docs/latest/rules/generator-star-spacing
        "generator-star-spacing": ["error", "before"],
        // https://eslint.org/docs/latest/rules/space-before-function-paren
        "space-before-function-paren": [
            "warn",
            {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always",
            },
        ],
        //https://eslint.org/docs/latest/rules/space-infix-ops
        "space-infix-ops": [
            "warn",
            {
                "int32Hint": false,
            },
        ],
        //https://eslint.org/docs/latest/rules/space-in-parens
        "space-in-parens": [
            "warn",
            "never",
        ],
        //https://eslint.org/docs/latest/rules/object-curly-spacing
        "object-curly-spacing": [
            "warn",
            "always",
        ],
        //https://eslint.org/docs/latest/rules/array-bracket-spacing
        "array-bracket-spacing": [
            "warn",
            "always",
        ],
        //https://eslint.org/docs/latest/rules/padding-line-between-statements
        "padding-line-between-statements": [
            "warn",
            {
                "blankLine": "always",
                "prev": "*",
                "next": [
                    "return", "break", "class", "continue", "do", "for", "if", "switch", "throw", "try", "while", "with",
                ],
            },
            {
                "blankLine": "always",
                "prev": "block-like",
                "next": "*",
            },
            {
                "blankLine": "always",
                "prev": ["const", "let", "var"],
                "next": "*",
            },
            {
                "blankLine": "always",
                "prev": "*",
                "next": ["const", "let", "var"],
            },
            {
                "blankLine": "any",
                "prev": ["const", "let", "var"],
                "next": ["const", "let", "var"],
            },
            {
                "blankLine": "any",
                "prev": "if",
                "next": "if",
            },
            {
                "blankLine": "any",
                "prev": "block-like",
                "next": "block-like",
            },
        ],
        // https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/no-nesting.md
        "promise/no-nesting": 0,
        // https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/avoid-new.md
        "promise/avoid-new": 0,
        // https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/prefer-await-to-then.md
        "promise/prefer-await-to-then": 0,
        // https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/prefer-await-to-callbacks.md
        "promise/prefer-await-to-callbacks": 0,
        // Отключил, потому что в некоторых местах это правило глючит.
        // Пример файла в котором это правило неправильно срабатывает: cfagentpage2/src/stores/CallsStore.js
        // todo: Попробовать включить его в будущем и пробежаться по кодовой базе, посмотреть как это правило работает.
        // https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/always-return.md
        "promise/always-return": 0,

        /**
         * TODO: С этим правилом сейчас приходиться мериться, т.к. в большинсве случаев оно работает правильно.
         *  Кроме того случая, когда на НУЖЕН index: тут заменять на `for (const [index, element] of array.entries())`
         *  это ПОЛНЫЙ БРЕД. Нужно заменять на `for (let index = 0, len = array.length; index < len; index++)` если внутри
         *  блока `for` используется `index` и на `for-of` если не используется.
         *  В идеале - написать собственное правило, вместо этого невминяемого.
         */
        "unicorn/no-array-for-each": "error",
        // todo: Аналогично "unicorn/no-array-for-each", заменять на `for-of`, только если index не используется.
        //  Выключил, т.к. это правило только сводит с толку. Лучше своё написать.
        "unicorn/no-for-loop": 0,

        // TODO: Есть сейчас проблема с правилом "unicorn/consistent-destructuring", оно не детектит обращение к методам объекта:
        //  this._onEventEmitterEvent.bind(this, event);
        //  Это правило хочет, чтобы код выше был деструктуирован, хотя это НЕ ННУЖНО, т.к. после этого код будет смотреться как говно.
        //  Дополнительно, хотелось бы, чтобы правило не срабатывало на кейсы, когда обращение идёт к одному свойству.
        // Если это правило будет только мешать, его можно выключить
        // - Ещё один кейс, когда "unicorn/consistent-destructuring" хочет сделать только хуже:
        //   ```
        //   const {
        //     _id = queueItem.id,
        //   } = queueItem;
        //   ```
        //    В данном случае, queueItem.id читается только если `_id === undefined`, а "unicorn/consistent-destructuring" хочет
        //     чтобы свойство "id" было сначала деструктурировано из "queueItem".
        // - Кейс, когда это правило неправильно определяет, что объект уже подвергался деструктурезации и ошибочно требудт
        //   деструктуризации свойства:
        //   ```
        //   const cols = [ { index: 1 }, { index: 2 }, { index: 3 }, { index: 1 } ];
        //   const [ col ] = cols;
        //   const { index } = col;
        //   const duplicate = cols.find(col => col.index === index);
        //   ```
        //    В данном случае, при автоматическом исправлении код ломается, т.к. последняя строчка заменяется на
        //     `const duplicate = cols.find(col => index === index);`
        //
        // Отключил это правило т.е. оно ОЧЕНЬ забаговано, (хоть оно и ОЧЕНЬ полезно).
        // Если это правило будет включено, то нужно отключать его авто-фикс, т.к. он может ломать логику кода.
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md
        "unicorn/consistent-destructuring": 0,

        // Отключил "unicorn/no-lonely-if", потому что с ним не удобно писать код, который в будущем планируется расширяться.
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md
        "unicorn/no-lonely-if": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/better-regex.md
        "unicorn/better-regex": "warn",
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/catch-error-name.md
        "unicorn/catch-error-name": [
            "error",
            {
                "ignore": [
                    "^error\\d*$",
                    "_error",
                    "err",
                ],
            },
        ],
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-function-scoping.md
        "unicorn/consistent-function-scoping": [
            "warn",
            {
                "checkArrowFunctions": false,
                //todo: В этом правиле есть недостаток: оно срабатывает для FunctionExpression:
                // `const func = function(){}` - если этот блок находиться в другой функции, то правило сработает, хотя НЕ ДОЛЖНО.
            },
        ],
        // todo: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md,
        // todo: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/expiring-todo-comments.md
        // todo: Убрать "unicorn/no-unsafe-regex", использовать вместо неё [eslint-plugin-security/detect-unsafe-regex](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-unsafe-regex.md)
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unsafe-regex.md
        "unicorn/no-unsafe-regex": "error",
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prevent-abbreviations.md
        "unicorn/prevent-abbreviations": [
            "warn",
            {// https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/rules/shared/abbreviations.js
                "allowList": {
                    "getInitialProps": true,
                },
                "replacements": {
                    "cmd": {
                        "command": true,
                    },
                    "errCb": {
                        "handleError": true,
                    },
                    "fn": {
                        "function": false,
                        "func": true,
                    },
                    "buf": {
                        "buffer": true,
                    },
                    "arg": false,
                    "acc": false,
                    "attr": false,
                    "btn": false,
                    "db": false,
                    "dev": false,
                    "dest": false,
                    "val": false,
                    "func": false,
                    "obj": false,
                    "param": false,
                    "params": false,
                    "prop": false,
                    "props": false,
                    "i": false,
                    "j": false,
                    "len": false,
                    "str": false,
                    "src": false,
                    "num": false,
                    "mod": false,
                    "doc": false,
                    "docs": false,
                    "err": false,
                    "args": false,
                    "prev": false,
                    "env": false,
                    "lib": false,
                    "ext": false,
                    "dir": false,
                    "tmp": false,
                    "temp": false,
                    "sep": false,
                    "var": false,
                    "vars": false,
                    "ref": false,
                    "conf": false,
                },
                "ignore": [
                    "Args$",
                    "Fn$",
                    "^func_",
                    "func",
                    "elem$",
                    // /^\$\S+El$/.test('$mainEl') === true
                    "^\\$\\S+El$",
                    "^KEY_",
                    "^eId",
                    "^_eId",
                    "_eId$",
                    "_vars$",
                    // ExecCmd, execCmd
                    "xecCmd$",
                ],
            },
        ],

        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-spread.md
        "unicorn/prefer-spread": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md
        "unicorn/prefer-module": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
        "unicorn/filename-case": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/new-for-builtins.md
        "unicorn/new-for-builtins": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-null.md
        "unicorn/no-null": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md
        "unicorn/no-new-array": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md
        "unicorn/no-array-callback-reference": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unreadable-array-destructuring.md
        "unicorn/no-unreadable-array-destructuring": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-reduce.md
        "unicorn/no-array-reduce": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-object-from-entries.md
        "unicorn/prefer-object-from-entries": 0,
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-slice.md
        "unicorn/prefer-string-slice": 0,
        // Отключил "prefer-ternary" потому что, оно предлагает рефакторить код, который при if/else лучше смотриться.
        // Например:
        /*
        if (typeof DOMException !== 'undefined') {
            // In WEB `signal.reason.code == DOMException.ABORT_ERR`
            return 20; // DOMException.ABORT_ERR
        }
        else {
          // Mimic nodejs ABORT_ERR `signal.reason.code == 'ABORT_ERR'`
          return 'ABORT_ERR';
        }
        */
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md
        "unicorn/prefer-ternary": 0,
        // Отключил "no-nested-ternary" потому что, очень хочеться писать конструкции типа:
        /*
        const type = value === 1 ? 'type_1'
            : value === 2 ? 'type_2'
            : value === 3 ? 'type_3'
        ;
        */
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-nested-ternary.md
        "unicorn/no-nested-ternary": 0,
        // Отключил "prefer-switch" потому что, в есть случаи, когда код написанный на if/else лучше читается чем switch/case
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-switch.md
        "unicorn/prefer-switch": 0,
        // Отключил "unicorn/prefer-math-trunc", потому что, он ошибочно предлагает заменить `1 << 0` на Math.trunc в `const enum`.
        // Пример:
        // const enum MODES {
        //   red = 1 << 0,
        // }
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-math-trunc.md
        "unicorn/prefer-math-trunc": 0,
        // Для js-файлов "unicorn/import-style" выключен
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-style.md
        "unicorn/import-style": 0,
        // Для js-файлов "unicorn/numeric-separators-style" выключен
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md
        "unicorn/numeric-separators-style": 0,
        // Для js-файлов "unicorn/prefer-optional-catch-binding" выключен
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-optional-catch-binding.md
        "unicorn/prefer-optional-catch-binding": 0,
    },
    "overrides": [
        {
            "files": ["*.d.ts"],
            "rules": {
                "no-magic-numbers": "off",
            }
        },
    ]
};
