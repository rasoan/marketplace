'use strict';

export function displayValueForTypeGuard(value: unknown): string;
export function displayValueForTypeGuard(value: unknown, options?: displayValueForTypeGuard.Options): string;
export function displayValueForTypeGuard(value: unknown, type: string, options?: displayValueForTypeGuard.Options): string;
export function displayValueForTypeGuard(value: unknown, type: displayValueForTypeGuard.Options | string = typeof value, options?: displayValueForTypeGuard.Options) {
    if (typeof type === 'object') {
        options = type;
        type = typeof value;
    }
    else if (!type) {
        type = typeof value;
    }

    const valuePrefix = options?.valuePrefix ?? 'value ';

    if (value === null
        || value === void 0
        || type === 'boolean'
        || (type === 'number' && (
            Number.isNaN(value)
            || !Number.isFinite(value)
        ))
    ) {
        // Для этих типов данных всегда показываем значение, даже если `isDisplayValue === false`
        return `${valuePrefix}${value}`;
    }

    const isDisplayValue = options?.isDisplayValue ?? true;
    const isDisplayType = options?.isDisplayType ?? true;

    if (isDisplayValue) {
        const isDisplayArray = options?.isDisplayArray ?? false;
        const displayValue = primitiveValueToStringForTypeGuard(value, void 0, { isDisplayArray });

        if (!isDisplayType) {
            return `${valuePrefix}${displayValue}`;
        }

        return `${valuePrefix}of type "${type}"${displayValue ? ` (${displayValue})` : ''}`;
    }

    return `value of type "${type}"`;
}

export namespace displayValueForTypeGuard {
    export type Options = {
        isDisplayValue?: boolean,
        isDisplayType?: boolean,
        isDisplayArray?: boolean,
        valuePrefix?: string,
    };
}

const _Object_prototype_toString = Object.prototype.toString;

export function primitiveValueToStringForTypeGuard(value: unknown, type = typeof value, options?: {
    isDisplayArray?: boolean,
}): string {
    if (type === 'string') {
        const stringValue = value as string;

        if (stringValue.length > 102) {
            return `"${stringValue.substring(0, 100)}..."`;
        }

        return `"${value}"`;
    }
    else if (type === 'bigint') {
        return `${value}n`;
    }
    else if (type === 'object') {
        if (Array.isArray(value)) {
            if (options?.isDisplayArray) {
                return `[${value.map(item => primitiveValueToStringForTypeGuard(item)).join(', ')}]`;
            }

            return `Array(${value.length})`;
        }

        const objectString = _Object_prototype_toString.call(value);

        if (objectString === '[object Object]') {
            // default string
            return '';
        }

        return objectString;
    }

    // note: Тут и ниже должно быть именно `String(value)` для того, чтобы приводить Symbol к строке
    return String(value);
}
