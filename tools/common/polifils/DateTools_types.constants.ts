// noinspection JSUnusedGlobalSymbols

export const enum TIME {
    MILLISECONDS = 1,
    SECONDS = 1000,
    MINUTES = 60 * SECONDS,
    HOURS = 60 * MINUTES,
    DAYS = 24 * HOURS,
    WEEKS = 7 * DAYS,
    // average amount of days
    MONTHS = 30 * DAYS,
    // average amount of days
    YEARS = 365 * DAYS,

    SECONDS_2 = SECONDS * 2,
    SECONDS_5 = SECONDS * 5,
    SECONDS_10 = SECONDS * 10,
    SECONDS_15 = SECONDS * 15,
    SECONDS_20 = SECONDS * 20,
    SECONDS_30 = SECONDS * 30,
    SECONDS_45 = SECONDS * 45,

    MINUTES_2 = MINUTES * 2,
    MINUTES_5 = MINUTES * 5,
    MINUTES_10 = MINUTES * 10,
    MINUTES_15 = MINUTES * 15,
    MINUTES_30 = MINUTES * 30,
    MINUTES_45 = MINUTES * 45,

    HOURS_2 = HOURS * 2,
    HOURS_4 = HOURS * 4,
    HOURS_8 = HOURS * 8,
    HOURS_12 = HOURS * 12,
    HOURS_16 = HOURS * 16,
    HOURS_20 = HOURS * 20,

    WEEKS_2 = WEEKS * 2,
}

export const enum TIME_UNIT_BORDERS {
    _0_ = 0,
    _59_ = 59,

    FIRST_HOUR = _0_,
    FIRST_MINUTE = _0_,
    FIRST_SECOND = _0_,
    FIRST_MILLISECONDS = _0_,

    LAST_HOUR = 23,
    LAST_MINUTE = _59_,
    LAST_SECOND = _59_,
    LAST_MILLISECONDS = 999,
}

export const enum DURATION_FORMATTING {
    /**
     * `{ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }`
     */
    timeDefault = 10,
    /**
     * `{ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, fractionalSecondDigits: 3 }`
     */
    timeDefaultWithMS = 11,
    /**
     * `{ minute: '2-digit', second: '2-digit', hour12: false }`
     */
    timeWithoutHours = 20,
    /**
     * `{ minute: '2-digit', second: '2-digit', hour12: false, fractionalSecondDigits: 3 }`
     */
    timeWithoutHoursWithMS = 21,
}

// todo: Возможно, `namespace DateTools` будет переименован в `namespace DateTime` или `namespace DateTimeTypes`
export namespace DateTools {
    export type Hours =
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
        | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23
    ;
    type From_0_To_59 =
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
        | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
        | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
        | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39
        | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49
        | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59
    ;
    export type Minutes = From_0_To_59;
    export type Seconds = From_0_To_59;

    export interface HoursAndMinutes {
        hours: Hours;// from 0 to 23
        minutes: Minutes;// from 0 to 59
        isNegative?: boolean;
    }
}
