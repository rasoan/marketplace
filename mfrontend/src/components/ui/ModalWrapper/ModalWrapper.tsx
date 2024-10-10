'use strict';
'use client';

import { ReactNode } from 'react';

interface ModalWrapperProps {
    children: ReactNode;
}

export default function ModalWrapper({ children }: ModalWrapperProps) {
    return (
        <>
            {children}
        </>
    );
}
