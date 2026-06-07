// ==UserScript==
// @name         black theme
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  better for your eyes
// @author       osuka
// @match        https://pekora.zip/*
// @match        https://*.pekora.zip/*
// @match        https://www.pekora.zip/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const BACKGROUND_IMAGE = 'https://files.catbox.moe/8xgsyq.png';

    const CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * {
            font-family: 'Poppins', sans-serif !important;
            color: #ffffff !important;
        }

        /* ---- BACKGROUND via html::before so nothing can cover it ---- */
        html {
            background: #000000 !important;
        }

        html::before {
            content: '' !important;
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background-image: url('${BACKGROUND_IMAGE}') !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            z-index: -9999 !important;
            pointer-events: none !important;
        }

        /* Kill the site's body background */
        body {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
        }

        /* ---- TRANSPARENT WRAPPERS so bg shows through ---- */
        #__next,
        #__next > div,
        #__next > div > div,
        [class*="main-0-2-"],
        [class*="main-0-"][class*="-null"],
        [class*="container-0-2-"],
        [class*="container-d3-"],
        [class*="container_container_"],
        [class*="homeContainer-"],
        [class*="skyScraperLeft-"],
        [class*="skyScraperRight-"],
        [class*="alertBg-"],
        [class*="wrapper-0-2-"],
        [class*="pageWrapper"],
        [class*="contentWrapper"],
        [class*="pageContent"] {
            background: transparent !important;
            background-color: transparent !important;
        }

        /* ---- SEARCH BAR ---- */
        input[type="search"],
        input[placeholder="Search"],
        [class*="searchInput"],
        header input,
        nav input {
            background-color: #111111 !important;
            color: #ffffff !important;
            border: 1px solid #333333 !important;
        }

        /* ---- BLACK UI ELEMENTS ---- */
        .card,
        [class*="card-"],
        [class*="sideBar-"],
        [class*="sideRow"],
        [class*="innerSection"],
        [class*="manageRequestCard"],
        [class*="shoutBg"],
        [class*="modalWrapper"],
        [class*="tableHead"],
        [class*="expandedCol"],
        [class*="assetContainerCard"],
        nav, header,
        [class*="navbar"],
        [class*="footer"],
        [class*="dropdown"],
        [class*="panel-"],
        [class*="sidebar"] {
            background-color: #0a0a0a !important;
            background: #0a0a0a !important;
        }

        /* ---- BORDERS ---- */
        .card,
        [class*="card-"],
        [class*="manageRequestCard"],
        [class*="innerSection"],
        [class*="modalWrapper"] {
            border: 1px solid #222222 !important;
        }

        /* ---- BUTTONS ---- */
        [class*="button-"][class*="-0-2-"],
        [class*="newBuyButton"],
        button[class*="actionBtn"],
        button[type="submit"][class*="btn"] {
            color: #ffffff !important;
            border: 1px solid #333 !important;
            background: #111111 !important;
        }

        [class*="ignoreButton"] {
            color: #ffffff !important;
            border: 1px solid #333 !important;
            background: #0a0a0a !important;
        }

        /* ---- INPUTS ---- */
        input, textarea, select,
        [class*="input-"] {
            background-color: #111111 !important;
            border: 1px solid #333 !important;
            color: #ffffff !important;
        }

        /* ---- IMAGES ---- */
        [class*="image-"][class*="-0-2-"] {
            border-radius: 50% !important;
            vertical-align: bottom !important;
            background-color: #0a0a0a !important;
        }

        .flex.ps-4.pe-4.pt-4.pb-4 > [class*="image-"].pt-0,
        .flex.ps-4.pe-4.pt-4.pb-4 [class*="image-"].pt-0,
        [class*="image-"].pt-0 {
            background-color: transparent !important;
            background: none !important;
            border-radius: 0 !important;
        }

        body[data-inventory-page] [class*="image-"],
        body[data-trades-page] img,
        body[data-trades-page] [class*="image-"] {
            background: none !important;
            background-color: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
        }

        /* ---- TABLE ---- */
        [class*="tableHeadBorder"] { border: 2px solid #1a1a1a !important; }
        [class*="tableHead"] {
            background: #0a0a0a !important;
            border-top: 1px solid #1a1a1a !important;
        }

        /* ---- LINKS ---- */
        a[href*="/users/"][href*="/profile"] {
            color: #aaaaaa !important;
        }

        /* ---- MISC ---- */
        .card {
            border-bottom-left-radius: 0 !important;
            border-bottom-right-radius: 0 !important;
        }

        body[data-catalog-page] img {
            border-color: transparent !important;
        }
    `;

    function injectCSS() {
        const target = document.head || document.documentElement;
        if (target && !document.getElementById('pekora-dynamic-styles')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'pekora-dynamic-styles';
            styleTag.textContent = CSS;
            target.insertBefore(styleTag, target.firstChild);
            return true;
        }
        return false;
    }

    // Nuke the site's inline body background completely
    function stripBodyBg() {
        if (!document.body) return;
        document.body.setAttribute('style',
            document.body.getAttribute('style')
                ? document.body.getAttribute('style').replace(/background[^;]*;?/gi, '')
                : ''
        );
        document.body.style.setProperty('background', 'transparent', 'important');
        document.body.style.setProperty('background-color', 'transparent', 'important');
        document.body.style.setProperty('background-image', 'none', 'important');
    }

    injectCSS();

    let attempts = 0;
    const injectInterval = setInterval(() => {
        if (injectCSS() || attempts++ > 30) clearInterval(injectInterval);
    }, 100);

    setInterval(stripBodyBg, 500);
    window.addEventListener('load', stripBodyBg);

    let currentURL = window.location.href;

    function updatePageFlags() {
        if (!document.body) return;
        const path = window.location.pathname.toLowerCase();
        const href = window.location.href;

        document.body.removeAttribute('data-friends-page');
        document.body.removeAttribute('data-catalog-page');
        document.body.removeAttribute('data-trades-page');
        document.body.removeAttribute('data-inventory-page');

        if (href.includes('/friends#!friends')) document.body.setAttribute('data-friends-page', 'true');
        if (path === '/catalog') document.body.setAttribute('data-catalog-page', 'true');
        if (path.includes('/my/trades')) document.body.setAttribute('data-trades-page', 'true');
        if (path.includes('/inventory')) document.body.setAttribute('data-inventory-page', 'true');
    }

    function checkURLChange() {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            setTimeout(updatePageFlags, 50);
            setTimeout(updatePageFlags, 300);
            setTimeout(injectCSS, 50);
            setTimeout(stripBodyBg, 100);
        }
    }

    setInterval(checkURLChange, 200);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(...args) { originalPushState.apply(this, args); setTimeout(checkURLChange, 0); };
    history.replaceState = function(...args) { originalReplaceState.apply(this, args); setTimeout(checkURLChange, 0); };
    window.addEventListener('popstate', checkURLChange);
    window.addEventListener('hashchange', checkURLChange);

    function init() {
        if (document.body) {
            updatePageFlags();
            stripBodyBg();
            startObserver();
        } else {
            setTimeout(init, 10);
        }
    }

    function startObserver() {
        const styleObserver = new MutationObserver(() => {
            styleObserver.disconnect();
            stripBodyBg();
            styleObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
        });
        styleObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });

        const domObserver = new MutationObserver(() => {
            updatePageFlags();
        });
        domObserver.observe(document.body, { childList: true, subtree: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => {
        injectCSS();
        updatePageFlags();
        stripBodyBg();
    });
})();
