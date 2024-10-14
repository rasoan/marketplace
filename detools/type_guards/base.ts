import { displayValueForTypeGuard } from './type_guards_utils';

export function isDefined<T>(value: T | unknown | null | undefined): value is NonNullable<T>;

// note: При переходе на TypeScript 5+ `extends string` и `extends number` должны быть без надобности, а вот с `extends {}` нужно тестировать.
export function isDefined<T extends string, U extends T & string>(value: T | unknown | null | undefined, expectedOneOf: U[]): value is U;
export function isDefined<T extends number, U extends T & number>(value: T | unknown | null | undefined, expectedOneOf: U[]): value is U;
// Warning: this overwrite SHOULD BE without ` | unknown` in "value"
export function isDefined<T extends {}, U extends T & {}>(value: T | null | undefined, expectedOneOf: U[]): value is U;

export function isDefined<T extends string, U extends T & string>(value: T | unknown | null | undefined, expected: U): value is U;
export function isDefined<T extends number, U extends T & number>(value: T | unknown | null | undefined, expected: U): value is U;
// Warning: this overwrite SHOULD BE without ` | unknown` in "value"
export function isDefined<T extends {}, U extends T & {}>(value: T | null | undefined, expected: U): value is U;

export function isDefined<T>(value: T | unknown | null | undefined, expected: T): value is NonNullable<T>;
export function isDefined<T extends {}>(value: T | undefined, expected?: NonNullable<T> | NonNullable<T>[]): value is NonNullable<T> {
  return value != null
    && (expected != null
        ? Array.isArray(expected)
          ? expected.includes(value as NonNullable<T>)
          : expected === value
        : true
    )
    ;
}

export function assertIsDefined<T>(value: T | null | undefined, messageError: string, options?: { errorCallback?: () => void }): asserts value is NonNullable<T> {
  const {
    errorCallback,
  } = options || {};

  if (!isDefined(value)) {
    if (errorCallback) {
      errorCallback();
    }

    throw new TypeError(messageError);
  }
}

const _Number_isNaN = Number.isNaN;

/**
 * Check if {@link value} is `number` and not `NaN`.
 *
 * Note: Infinity is allowed.
 *
 * @see Use {@link import('./numbers.ts').isNumber} to check number more accurate.
 */
export function isNumberType<T extends number>(value: T | unknown, expected?: T): value is T;
// Warning: Эта перегрузка нужна для того, чтобы работали suggestions
// Warning: this overwrite SHOULD BE without ` | unknown` in "value"
export function isNumberType<T extends {}>(value: T | null | undefined, expected?: T): value is T;
/**
 * Check if {@link value} is `number` and not `NaN`.
 *
 * Note: Infinity is allowed.
 *
 * @see Use {@link import('./numbers.ts').isNumber} to check number more accurate.
 */
export function isNumberType(value: number | unknown, expected?: number, options?: {
  isPositiveCheck?: boolean;
}): value is number {
  return typeof value === 'number'
    && !_Number_isNaN(value)
    && (expected != null ? value === expected : true)
    && (options?.isPositiveCheck ? value >= 0 : true)
    ;
}

export function assertIsNumberType(value: number | unknown, options?: {
  isPositiveCheck?: boolean;
}): asserts value is number {
  const type = typeof value;

  if (!isNumberType(value)) {
    throw new TypeError(`value should be number, but ${displayValueForTypeGuard(value, type)} found!`);
  }
}
