'use strict';
'use client';

import { ThemeConfig } from 'antd/es/config-provider';

export const theme = {
    token: {
        colorText: "white",
        colorTextSecondary: "#9A9BA2",
        colorBgBase: "black",
        fontSize: 14,
        fontSizeSM: 12,
        fontSizeLG: 18,
        fontSizeXL: 24,
        fontSizeHeading1: 24,
        fontSizeHeading2: 22,
        fontSizeHeading3: 20,
        fontSizeHeading4: 18,
        fontSizeHeading5: 16,
        fontWeightStrong: 700,
    },
    components: {
        Tooltip: {
            colorBgSpotlight: '#343539',
            borderRadius: 8,
            boxShadowSecondary: '0 4px 28px 0 rgba(0, 0, 0, 0.6)',
        },
    },
} satisfies ThemeConfig;

// todo: скорее всего это временный костыль, разберусь с тематикой и оставлю один объект для тем
export const themeBase = {
    token: {
        /** $gray850 */
        bgColorFirstly: "#25262A",
        /** $gray900 */
        bgColorSecondary: "#181719",
        /** orange-600 */
        borderFieldColor: "#CC4A17",
        fontSize20: 20,
    },
};
