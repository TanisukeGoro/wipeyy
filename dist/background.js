let pipconfig
let cntconfig
let cnpconfig

// background.js -> contents.jsへ
chrome.commands.onCommand.addListener(function(command) {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // アクティブなタブ tabs[0] のcontent scriptsにメッセージを送信
        chrome.storage.local.get("latestTabId", function(tabId) {
            // タブのチェック
            chrome.tabs.get(tabId.latestTabId, function() {
                if (chrome.runtime.lastError) {
                    tabId.latestTabId = tabs[0].id
                }
            });
            chrome.tabs.sendMessage(tabId.latestTabId, { sendCommand: command }, function(response) {
                console.log(response.farewell);
            });

        });

    });
    return 0;
});

chrome.runtime.onMessage.addListener(
    function(message, sender, respons) {
        switch (message.query) {
            case 'get-Tab-Id':
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.storage.local.set({ latestTabId: tabs[0].id }, function() {});
                });
                respons("Hello");
                break;
            case 'check-pip-status':
                
                respons("return check-pip-status");
                break;

            default:
                break;
        }
        // 引数に値を入れて返す感じ？
        return true;
    });