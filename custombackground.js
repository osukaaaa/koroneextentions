// ==UserScript==
// @name         custom background for korone
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  replaces the background color into a gif,jpg,png,etc!
// @author       osuka
// @match        https://pekora.zip/*
// @match        https://*.pekora.zip/*
// @match        https://www.pekora.zip/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const BG_URL = 'https://files.catbox.moe/86a0cf.gif';

    const BG_SIZE       = 'cover';
    const BG_POSITION   = 'center';
    const BG_REPEAT     = 'no-repeat';
    const BG_ATTACHMENT = 'fixed';
    const BG_BLEND_MODE = 'normal';
    const OVERLAY_OPACITY = 0;

    function applyBackground(dataUrl) {
        GM_addStyle(`
            html, body {
                background-color: transparent !important;
                background-image: url("${dataUrl}") !important;
                background-size: ${BG_SIZE} !important;
                background-position: ${BG_POSITION} !important;
                background-repeat: ${BG_REPEAT} !important;
                background-attachment: ${BG_ATTACHMENT} !important;
                background-blend-mode: ${BG_BLEND_MODE} !important;
            }

        * {
            color: white !important;
            font-weight: bold !important;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8) !important;
        }

        div, section, aside, article, main, header, footer, nav,
        [class*="panel"], [class*="card"], [class*="container"],
        [class*="section"], [class*="box"], [class*="block"],
        [class*="wrap"], [class*="inner"], [class*="content"],
        [class*="bg"], [class*="background"] {
            background-color: transparent !important;
            background: transparent !important;
            box-shadow: none !important;
        }

            body::before {
                content: '';
                display: ${OVERLAY_OPACITY > 0 ? 'block' : 'none'};
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, ${OVERLAY_OPACITY});
                pointer-events: none;
                z-index: 0;
            }
        `);
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: BG_URL,
        responseType: 'blob',
        onload: function (res) {
            const blob = res.response;
            const reader = new FileReader();
            reader.onloadend = () => applyBackground(reader.result);
            reader.readAsDataURL(blob);
        },
        onerror: function () {
            applyBackground(BG_URL);
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const strip = (el) => {
            if (!el || !el.style) return;
            el.style.removeProperty('background');
            el.style.removeProperty('background-color');
            el.style.removeProperty('background-image');
        };

        strip(document.documentElement);
        strip(document.body);

        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (
                    m.type === 'attributes' &&
                    m.attributeName === 'style' &&
                    (m.target === document.body || m.target === document.documentElement)
                ) {
                    strip(m.target);
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true, subtree: false });
        observer.observe(document.body, { attributes: true, subtree: false });
    });

})();
