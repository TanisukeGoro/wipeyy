$elm = elem => document.querySelector(elem);

const pipbutton = $elm('#pipButton');
const continuosbutton = $elm('#continuosButton');
const autoCoplibutton = $elm('#autoCopliButton');

const operationBtn = (obj, boolBtn) => boolBtn ? obj.setAttribute('checked', "") : obj.checked = false;

window.onload = function() {

    pipbutton.addEventListener('click', function() {
        checkboxStatus();
        sendMsg = { sendCommand: 'clickPipBtn' };
        // contents scriptにpipBtnを実行するようにメッセージを送信する
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, sendMsg)
            });
    }, false);
    continuosbutton.addEventListener('click', function() {
        checkboxStatus()
    });
    autoCoplibutton.addEventListener('click', function() {
        checkboxStatus()
    });

    chrome.storage.local.get(["pipbtn", "cntbtn", "cnpbtn"], function(btnState) {
        operationBtn(pipbutton, btnState.pipbtn);
        operationBtn(continuosbutton, btnState.cntbtn);
        operationBtn(autoCoplibutton, btnState.cnpbtn);
    });
}

const checkboxStatus = () => {
    let pipBtn = pipbutton.checked;
    let cntBtn = continuosbutton.checked;
    let cnpBtn = autoCoplibutton.checked;
    let sendJSON = {
        "pipbtn": pipBtn,
        "cntbtn": cntBtn,
        "cnpbtn": cnpBtn
    };
    // Update the chrome storage
    chrome.storage.local.set({ pipbtn: pipBtn }, function() {});
    chrome.storage.local.set({ cntbtn: cntBtn }, function() {});
    chrome.storage.local.set({ cnpbtn: cnpBtn }, function() {});

    // if chacking the button, this send message from popup.js to contents.js




    console.log(sendJSON);
    //  background.jsにメッセージを送信
    // const sendJson = { "firstName": "Peter", "lastName": "Jones" }
    // chrome.runtime.sendMessage(sendJSON,
    //     function(response) {
    //         console.log(response);
    //     }

    // );

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