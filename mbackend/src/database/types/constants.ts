export enum DataBaseCurrencyType {
    Rub = "RUB",
    Usd = "USD",
    Uah = "UAH",
    Kzt = "KZT",
}

export enum DataBaseStatus {
    InProgress = "IN_PROGRESS",
    Error = "ERROR",
    Success = "SUCCESS",
}

export enum DataBaseTransactionProgress {
    CreatingBill = "CREATING_BILL",
    PayingBill = "PAYING_BILL",
    PayingClient = "PAYING_CLIENT",
    Success = "SUCCESS",
}

export enum DataBaseTransactionErrorReasonCode {
    PayGatewayInput = "PAY_GATEWAY_INPUT",
    PayGatewayOutput = "PAY_GATEWAY_OUTPUT",
    ApiExchangeRate = "API_EXCHANGE_RATE",
    Backend = "BACKEND",
    Database = "DATABASE",
    Client = "CLIENT",
    Unkonwn = "UNKNOWN",
}

export enum DataBaseErrorCode {
    RequestTimeout = "REQUEST_TIMEOUT",
    ClientTimeout = "CLIENT_TIMEOUT",
    Unknown = "UNKNOWN",
}

/*
// todo: GPT отдал, позже глянуть, какие из этих ошибок нам пригодятся и добавить их в таблицу "error_code"
const ErrorCodes = {
    // Общие ошибки
    UNKNOWN: 'UNKNOWN',                           // Неизвестная ошибка.
    INVALID_INPUT: 'INVALID_INPUT',               // Неверные входные данные.
    UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION', // Операция не поддерживается.
    OPERATION_FAILED: 'OPERATION_FAILED',         // Операция не выполнена.
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',           // Функциональность не реализована.
    RESOURCE_BUSY: 'RESOURCE_BUSY',               // Ресурс занят.

    // Ошибки сети и сервера
    REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',           // Истечение времени ожидания запроса.
    CLIENT_TIMEOUT: 'CLIENT_TIMEOUT',             // Истечение времени ожидания на стороне клиента.
    NETWORK_ERROR: 'NETWORK_ERROR',               // Ошибка сети.
    SERVER_ERROR: 'SERVER_ERROR',                 // Ошибка на стороне сервера.
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',   // Сервис временно недоступен.
    GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',           // Время ожидания шлюза истекло.
    DNS_RESOLUTION_FAILED: 'DNS_RESOLUTION_FAILED', // Ошибка разрешения DNS.
    CONNECTION_REFUSED: 'CONNECTION_REFUSED',     // Соединение отклонено сервером.
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',   // Превышен лимит запросов.

    // Ошибки безопасности и авторизации
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED', // Ошибка аутентификации пользователя.
    PERMISSION_DENIED: 'PERMISSION_DENIED',       // Отказ в доступе из-за недостатка прав.
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',               // Токен аутентификации истек.
    ACCESS_REVOKED: 'ACCESS_REVOKED',             // Доступ был отозван.
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',             // Учетная запись заблокирована.
    SESSION_EXPIRED: 'SESSION_EXPIRED',           // Сессия истекла.

    // Ошибки файловой системы
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',             // Файл не найден.
    FILE_READ_ERROR: 'FILE_READ_ERROR',           // Ошибка чтения файла.
    FILE_WRITE_ERROR: 'FILE_WRITE_ERROR',         // Ошибка записи файла.
    DIRECTORY_NOT_FOUND: 'DIRECTORY_NOT_FOUND',   // Каталог не найден.
    DISK_FULL: 'DISK_FULL',                       // Диск переполнен.
    PERMISSION_ERROR: 'PERMISSION_ERROR',         // Ошибка прав доступа к файлу.

    // Ошибки базы данных
    DATABASE_ERROR: 'DATABASE_ERROR',             // Общая ошибка базы данных.
    CONNECTION_LOST: 'CONNECTION_LOST',           // Потеряно соединение с базой данных.
    QUERY_FAILED: 'QUERY_FAILED',                 // Запрос к базе данных не выполнен.
    TRANSACTION_FAILED: 'TRANSACTION_FAILED',     // Ошибка транзакции.
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',           // Дублирующаяся запись в базе данных.
    CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION', // Нарушение ограничения базы данных.

    // Ошибки API и HTTP
    BAD_REQUEST: 'BAD_REQUEST',                   // Неверный запрос.
    UNAUTHORIZED: 'UNAUTHORIZED',                 // Неавторизованное действие.
    FORBIDDEN: 'FORBIDDEN',                       // Запрещенное действие.
    NOT_FOUND: 'NOT_FOUND',                       // Ресурс не найден.
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',     // Метод запроса не разрешен.
    CONFLICT: 'CONFLICT',                         // Конфликт данных (например, при обновлении ресурса).
    PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',       // Слишком большой запрос.
    UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE', // Неподдерживаемый формат данных.
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',       // Слишком много запросов (обычно связано с лимитами API).

    // Ошибки валидации
    VALIDATION_ERROR: 'VALIDATION_ERROR',         // Ошибка валидации данных.
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD', // Отсутствует обязательное поле.
    INVALID_FORMAT: 'INVALID_FORMAT',             // Неверный формат данных.
    OUT_OF_RANGE: 'OUT_OF_RANGE',                 // Значение выходит за пределы допустимого диапазона.
    TYPE_MISMATCH: 'TYPE_MISMATCH',               // Несоответствие типа данных.

    // Ошибки работы с сессиями и кэшем
    CACHE_MISS: 'CACHE_MISS',                     // Кэш пропущен (данные не найдены).
    CACHE_WRITE_ERROR: 'CACHE_WRITE_ERROR',       // Ошибка записи в кэш.
    SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',       // Сессия не найдена.
    SESSION_STORAGE_ERROR: 'SESSION_STORAGE_ERROR', // Ошибка хранилища сессий.
    INVALID_SESSION_TOKEN: 'INVALID_SESSION_TOKEN', // Неверный токен сессии.

    // Ошибки интеграций и внешних сервисов
    THIRD_PARTY_SERVICE_ERROR: 'THIRD_PARTY_SERVICE_ERROR', // Ошибка стороннего сервиса.
    INTEGRATION_FAILURE: 'INTEGRATION_FAILURE',   // Ошибка интеграции со сторонним сервисом.
    TIMEOUT_REACHED: 'TIMEOUT_REACHED',           // Превышено время ожидания от стороннего сервиса.
    SERVICE_DEPRECATED: 'SERVICE_DEPRECATED',     // Сервис устарел и больше не поддерживается.

    // Специфичные пользовательские ошибки
    INVALID_USER_STATE: 'INVALID_USER_STATE',     // Некорректное состояние пользователя.
    USER_NOT_FOUND: 'USER_NOT_FOUND',             // Пользователь не найден.
    EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS', // Этот email уже существует в системе.
    INVALID_PASSWORD: 'INVALID_PASSWORD',         // Неверный пароль.
    PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',       // Пароль слишком слабый.
    USERNAME_TAKEN: 'USERNAME_TAKEN',             // Имя пользователя уже занято.

    // Ошибки конфигурации и среды
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',   // Ошибка конфигурации.
    ENVIRONMENT_VARIABLE_MISSING: 'ENVIRONMENT_VARIABLE_MISSING', // Отсутствует переменная среды.
    DEPENDENCY_MISSING: 'DEPENDENCY_MISSING',     // Необходимая зависимость отсутствует.
    FEATURE_DISABLED: 'FEATURE_DISABLED',         // Функционал отключен в текущей среде.

    // Ошибки времени выполнения
    RUNTIME_ERROR: 'RUNTIME_ERROR',               // Ошибка времени выполнения.
    MEMORY_LEAK: 'MEMORY_LEAK',                   // Утечка памяти.
    STACK_OVERFLOW: 'STACK_OVERFLOW',             // Переполнение стека.
    NULL_POINTER_EXCEPTION: 'NULL_POINTER_EXCEPTION', // Обращение к null-переменной.
};
*/
