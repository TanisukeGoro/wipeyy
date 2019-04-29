window.onload = function() {
    const pipbutton = document.querySelector('#pipButton');
    const continuosbutton = document.querySelector('#continuosButton');
    const autoCoplibotton = document.querySelector('#autoCopliBotton');
    const operationBtn = (obj, boolBtn) => boolBtn ? obj.click() : obj.checked = false;
    pipbutton.addEventListener('click', function() {
        checkboxStatus();
    }, false);
    continuosbutton.addEventListener('click', function() {
        checkboxStatus()
    });
    autoCoplibotton.addEventListener('click', function() {
        checkboxStatus()
    });

    chrome.storage.sync.get(["pipbtn", "cntbtn", "cnpbtn"], function(btnState) {
        operationBtn(pipbutton, btnState.pipbtn);
        operationBtn(continuosbutton, btnState.cntbtn);
        operationBtn(autoCoplibotton, btnState.cnpbtn);

    });

    // document.getElementById('pipButton').addEventListener('checked', function() {
    //     console.log('kfkfkf')
    // })
}

const checkboxStatus = () => {

    let pipBtn = document.querySelector('#pipButton').checked;
    let cntBtn = document.querySelector('#continuosButton').checked;
    let cnpBtn = document.querySelector('#autoCopliBotton').checked;
    let sendJSON = {
        "pipbtn": pipBtn,
        "cntbtn": cntBtn,
        "cnpbtn": cnpBtn
    };

    console.log("こんにちは！");
    // Update the chrome storage
    chrome.storage.sync.set({ pipbtn: pipBtn }, function() {});
    chrome.storage.sync.set({ cntbtn: cntBtn }, function() {});
    chrome.storage.sync.set({ cnpbtn: cnpBtn }, function() {});

    // if chacking the button, this send message from popup.js to contents.js
    chrome.tabs.query({ currentWindow: true, active: true },
        function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, sendJSON)
        });

    console.log(sendJSON);
    //  background.jsにメッセージを送信
    // const sendJson = { "firstName": "Peter", "lastName": "Jones" }
    chrome.runtime.sendMessage(sendJSON,
        function(response) {
            console.log(response);
        }

    );

}


// // backgroundで受け取った値をコンソールに表示
// function logBackgroundValue() {
//     var test = chrome.extension.getBackgroundPage();

//     // console.log(chrome.extension.getBackgroundPage());
//     return;
// }

// // 現在アクティブなタブにデータを送信
// function sendToContents() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id,
//             JSON.stringify({ contents: "test value from popup" }),
//             function(response) {});
//     });
// }

// document.getElementById('log').addEventListener('click', logBackgroundValue);
// document.getElementById('send').addEventListener('click', sendToContents);