'use strict';

import { NextResponse, NextRequest } from 'next/server';

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const currentHostName = request.headers.get("host");

    // Skip public files
    if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) {
        return;
    }

    const subdomain = getValidSubdomain(currentHostName);

    if (currentHostName) {
        if (subdomain) {
            url.pathname = `/${subdomain}${url.pathname}`;

            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

const getValidSubdomain = (host?: string | null) => {
    // todo: здесь достаточно костыльно получаем поддомен, эту функцию покрыть тестами и написать более надёжный код
    const [ subdomain, domain ] = host?.replace(".net", "").split('.') || [];

    // Если domain не вычислился, то subdomain и есть domain а значит subdomain не существует
    // ["steam", "localhost" ] или [ "localhost" ]
    if (domain) {
        return subdomain;
    }
};
