'use strict';
'use client';

import React from 'react';

type IconProps= {
    icon: string,
    className?: string,
    style?: React.CSSProperties
};

const IconFontawesome: React.FC<IconProps> = ({ icon, style, className }) => {
    return (
        <i className={`${className} fa ${icon}`} style={style} aria-hidden="true"></i>
    );
};

export default IconFontawesome;
