const kofiWidgetOverlayConfig = {
    'floating-chat.core.pageId': '',
    'floating-chat.core.closer': '<svg height="0px" width="15px"><line x1="2" y1="8" x2="13" y2="18" style="stroke:#000; stroke-width:3" /><line x1="13" y1="8" x2="2" y2="18" style="stroke:#000; stroke-width:3" /></svg>',
    'floating-chat.core.position.bottom-left': 'position: fixed; bottom: 50px; left: 10px; width: 160px; height: 65px;',
    'floating-chat.cssId': '',
    'floating-chat.notice.text': 'ko-fi.com/%HANDLE%',
    'floating-chat.donatebutton.image': 'https://storage.ko-fi.com/cdn/cup-border.png',
    'floating-chat.donateButton.background-color': '#00b9fe',
    'floating-chat.donateButton.text': 'Support me',
    'floating-chat.donateButton.text-color': '#fff',
    'floating-chat.stylesheets': '["https://fonts.googleapis.com/css?family=Nunito:400,700,800&display=swap"]',
};

var kofiWidgetOverlayFloatingChatBuilder = kofiWidgetOverlayFloatingChatBuilder || function (config, _utils) {
    const _configManager = _utils.getConfigManager(config);
    const _myType = 'floating-chat';
    const _topContainerWrapClass = 'floatingchat-container-wrap';
    const _topMobiContainerWrapClass = 'floatingchat-container-wrap-mobi';
    var widgetPageLoadInitiatedStates = [];
    var closeButtonActionBlocked = false;

    function getButtonId() {
        return `${_configManager.getValue(_myType, 'cssId')}-donate-button`;
    }

    function getContainerFrameId() {
        return 'kofi-wo-container' + _configManager.getValue(_myType, 'cssId');
    }

    function getMobiContainerFrameId() {
        return 'kofi-wo-container-mobi' + _configManager.getValue(_myType, 'cssId');
    }

    function getButtonImageId() {
        return `${_configManager.getValue(_myType, 'cssId')}-donate-button-image`
    };

    function createButtonContainerIframe(iframeId, mainStyleSheetFile) {
        var htmlBody = getHtml();
        var buttonBody = '<html>' +
            '<head>' +
            `<link rel="preconnect" href="https://ko-fi.com/">` +
            `<link rel="dns-prefetch" href="https://ko-fi.com/">` +
            `<link rel="preconnect" href="https://storage.ko-fi.com/">` +
            `<link rel="dns-prefetch" href="https://storage.ko-fi.com/">` +
            `<link href="${mainStyleSheetFile}" rel="stylesheet" type="text/css" />` +
            `</head>` +
            `<body style="margin: 0; position: absolute; bottom: 0;">${htmlBody}</body>` +
            '</html>';
        var iframeContainerElement = document.getElementById(iframeId).contentDocument;
        var iframe = document.getElementById(iframeId);
        var _timer = setInterval(function () {
            var doc = iframe.contentDocument || iframe.contentWindow;
            if (doc && doc.readyState == 'complete') {
                clearInterval(_timer);
                var parentWrapper = document.getElementsByClassName(_topContainerWrapClass)[0];
                var mobiParentWrapper = document.getElementsByClassName(_topMobiContainerWrapClass)[0];
                parentWrapper.style = 'z-index:10000;';
                mobiParentWrapper.style = 'z-index:10000;';
                iframe.style = '';
            }
        }, 300);
        iframeContainerElement.write(buttonBody);
        iframeContainerElement.close();
        return iframeContainerElement;
    };

    function attachDonateButton(iframeContainerElement, iframeId, selectors, heightLimits) {
        const donateButton = iframeContainerElement.getElementById(`${getButtonId()}`);
        donateButton.addEventListener('click', function () {
            if (donateButton.classList.contains("closed")) {
                activateKofiIframe(iframeId, selectors, heightLimits);
            } else if (!closeButtonActionBlocked) {
                var popupId = _configManager.getValue(_myType, 'cssId') + `-${selectors.popupId}`;
                var popup = document.getElementById(popupId);
                closePopup(popup, donateButton);
            }
        });
        return donateButton;
    };

    var write = function (parentElementId) {
        var docHead = document.head;
        if (!docHead) {
            docHead = document.createElement('head');
            document.prepend(docHead);
        }
        var iframeId = getContainerFrameId();
        var mobiIframeId = getMobiContainerFrameId();
        var iframeHtml = `<div class="${_topContainerWrapClass}" style="height: 0px; transition: all 0.3s ease 0s; opacity:0;">` +
            `<iframe class="floatingchat-container" style="height: 0px; transition: all 0.6s ease 0s; opacity:0;" id="${iframeId}"></iframe>` +
            '</div>' +
            `<div class="${_topMobiContainerWrapClass}" style="height: 0px; transition: all 0.6s ease 0s; opacity:0;">` +
            `<iframe class="floatingchat-container-mobi" style="height: 0px; transition: all 0.6s ease 0s; opacity:0;" id="${mobiIframeId}"></iframe>` +
            '</div>';
        var existingPlaceHolder = document.getElementById(parentElementId);
        existingPlaceHolder.innerHTML = iframeHtml;
        var iframeContainerElement = createButtonContainerIframe(iframeId, 'https://storage.ko-fi.com/cdn/scripts/floating-chat-main.css');
        var mobiIframeContainerElement = createButtonContainerIframe(mobiIframeId, 'https://storage.ko-fi.com/cdn/scripts/floating-chat-main.css');
        _utils.loadStyleSheet('https://storage.ko-fi.com/cdn/scripts/floating-chat-wrapper.css', document);
        var styleSheetsValue = _configManager.getValue(_myType, 'stylesheets');
        if ('' !== styleSheetsValue) {
            styleSheets = JSON.parse(styleSheetsValue);
            styleSheets.forEach(stylesheetRef => {
                _utils.loadStyleSheet(stylesheetRef, document);
                _utils.loadStyleSheet(stylesheetRef, iframeContainerElement);
                _utils.loadStyleSheet(stylesheetRef, mobiIframeContainerElement);
            });
        }
        var desktopDonateButton = attachDonateButton(iframeContainerElement, iframeId, { popupId: 'kofi-popup-iframe', popupIframeContainerIdSuffix: 'popup-iframe-container' }, { maxHeight: 690, minHeight: 400, });
        widgetPageLoadInitiatedStates.push([desktopDonateButton, false]);
        var mobileDonateButton = attachDonateButton(mobiIframeContainerElement, mobiIframeId, { popupId: 'kofi-popup-iframe-mobi', popupIframeContainerIdSuffix: 'popup-iframe-container-mobi' }, { maxHeight: 690, minHeight: 350 });
        widgetPageLoadInitiatedStates.push([mobileDonateButton, false]);
        insertPopupHtmlIntoBody(desktopDonateButton, { popupId: 'kofi-popup-iframe', popupClass: 'floating-chat-kofi-popup-iframe', noticeClass: 'floating-chat-kofi-popup-iframe-notice', closerClass: 'floating-chat-kofi-popup-iframe-closer', popupIframeContainerClass: 'floating-chat-kofi-popup-iframe-container', popupIframeContainerIdSuffix: 'popup-iframe-container', popuupKofiIframeHeightOffset: 42 }, parentElementId);
        insertPopupHtmlIntoBody(mobileDonateButton, { popupId: 'kofi-popup-iframe-mobi', popupClass: 'floating-chat-kofi-popup-iframe-mobi', noticeClass: 'floating-chat-kofi-popup-iframe-notice-mobi', closerClass: 'floating-chat-kofi-popup-iframe-closer-mobi', popupIframeContainerClass: 'floating-chat-kofi-popup-iframe-container-mobi', popupIframeContainerIdSuffix: 'popup-iframe-container-mobi', popuupKofiIframeHeightOffset: 100 }, parentElementId);
    };

    function activateKofiIframe(iframeId, selectors, heightLimits) {
        var iframeContainerElement = document.getElementById(iframeId).contentDocument;
        const donateButton = iframeContainerElement.getElementById(`${getButtonId()}`);
        const kofiIframeState = donateButton.classList.contains('closed') ? 'open' : 'close';
        toggleKofiIframe(iframeId, kofiIframeState, donateButton, selectors, heightLimits);
    };

    function updateClass(element, oldClass, newClass) {
        if (oldClass !== '') {
            element.classList.remove(oldClass);
        }
        if (newClass !== '') {
            element.classList.add(newClass);
        }
    };

    function slidePopupOpen(popup, finalHeight) {
        popup.style = `z-index:10000;width:328px!important;height: ${finalHeight}px!important; transition: height 0.5s ease, opacity 0.3s linear; opacity:1;`;
        document.getElementsByClassName("floating-chat-kofi-popup-iframe-closer")[0].style = 'z-index:10000;display:block;opacity:1;transition:opacity 0.3s linear, opacity 0.3s linear 0.3s; width: 328px!important;height: ${finalHeight + 2}px!important;opacity:1;margin-left:0!important;margin-top:-1px!important;overflow:hidden;';
    };

    function closePopup(popup, donateButton) {
        var closeButton = donateButton.closest('.floatingchat-container-wrap').find('.floatingchat-container');
        var onCloseClick = closeButton.closest('.floatingchat-container');
        onCloseClick.find('style="z-index:10000;opacity:1;transition:opacity 0.3s linear,opacity 0.3s linear 0.3s; width: 328px!important;height: 0px!important;opacity:0;margin-left:0!important;margin-top:0!important;overflow:hidden;');
        closeButton.closest('.floatingchat-container-wrap-mobi').css({'z-index': 10000});
        closeButton.closest('.floatingchat-container-wrap-mobi').removeClass('floatingchat-container-wrap-mobi');
