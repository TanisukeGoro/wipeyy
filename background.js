var pipconfig
var cntconfig
var cnpconfig
chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // アクティブなタブ tabs[0] のcontent scriptsにメッセージを送信
        chrome.tabs.sendMessage(tabs[0].id, { greeting: command }, function(response) {
            console.log(response.farewell);
        });
    });
});


window.addEventListener('keydown', function(e) {
    console.log('keydown');
});
//  init set data
// chrome.storage.local.set({ pipbtn: false }, function() {});
// chrome.storage.local.set({ cntbtn: false }, function() {});
// chrome.storage.local.set({ cnpbtn: false }, function() {});

chrome.runtime.onMessage.addListener(
    function(message, sender, respons) {
        console.log(message.pipbtn, message.cntbtn, message.cnpbtn);
        pipconfig = message.pipbtn;
        cntconfig = message.cntBtn;
        cnpconfig = message.cnpBtn;
        // 引数に値を入れて返す感じ？
        respons("こんにちは");
        return true;
    });