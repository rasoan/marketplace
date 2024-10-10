"use strict";

const gtmScriptText = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KRVZ3R4T');`;

const gtmIframe = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KRVZ3R4T" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

export function insertGTMIntoHTML() {
    const scriptId = 'gtm-script';
    const noScriptId = 'gtm-iframe';

    const existingScript = document.querySelector(`#${scriptId}`);
    const existingNoScript = document.querySelector(`#${noScriptId}`);

    if (existingScript && existingNoScript) {
        return; // Код уже добавлен
    }

    {
        const gtmScript = document.createElement('script');

        gtmScript.id = scriptId;
        gtmScript.innerHTML = gtmScriptText;

        document.body.insertAdjacentElement('afterbegin', gtmScript);
    }

    {
        const noscript = document.createElement('noscript');

        noscript.id = noScriptId;
        noscript.innerHTML = gtmIframe;

        document.body.insertAdjacentElement('afterbegin', noscript);
    }
}
