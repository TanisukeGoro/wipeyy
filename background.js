var pipconfig
var cntconfig
var cnpconfig
chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
});

window.addEventListener('keydown', function(e) {
    console.log('keydown');
});
//  init set data
chrome.storage.sync.set({ pipbtn: false }, function() {});
chrome.storage.sync.set({ cntbtn: false }, function() {});
chrome.storage.sync.set({ cnpbtn: false }, function() {});

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