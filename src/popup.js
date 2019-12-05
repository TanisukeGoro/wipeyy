$elm = elem => document.querySelector(elem);

const pipbutton = $elm("#pipButton");
const continuosbutton = $elm("#continuosButton");
const autoCoplibutton = $elm("#autoCopliButton");

document.addEventListener("DOMContentLoaded", () => {
  // Translation
  document.querySelectorAll("[data-translate]").forEach(element => {
    const text = element.getAttribute("data-translate");
    element.innerHTML = chrome.i18n.getMessage(text);
  });

  // Title
  chrome.storage.local.get("latestTabId", function(tabId){
    setVideoTitle(tabId)
  });

  // Option page
  document.querySelector('.js-link-go-to-settings').addEventListener(
    'click',
    (e) => {
      chrome.tabs.create({
        // url: 'chrome://extensions/?options=' + chrome.runtime.id
        url: 'chrome://extensions/shortcuts'
      });
    }
  )
});

/**
 * setting attribute for btn object
 * @param {object} obj btn object
 * @param {boolean} boolBtn Button status
 */
const operationBtn = (obj, boolBtn) =>
  boolBtn ? obj.setAttribute("checked", "") : (obj.checked = false);

window.onload = function() {
  // check pip status
  chrome.runtime.sendMessage({ query: "check-pip-status" }, function(response) {
    console.log(response);
  });

  pipbutton.addEventListener("click",function() {
      checkboxStatus();
      sendMsg = { sendCommand: "clickPipBtn" };
      // contents scriptにpipBtnを実行するようにメッセージを送信する
      chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, sendMsg);
      });
      $elm("#link-video-title").textContent = document.title
    },
    false
  );

  continuosbutton.addEventListener("click", function() {
    checkboxStatus();
  });

  autoCoplibutton.addEventListener("click", function() {
    checkboxStatus();
  });

  chrome.storage.local.get(["pipbtn", "cntbtn", "cnpbtn"], function(btnState) {
    operationBtn(pipbutton, btnState.pipbtn);
    operationBtn(continuosbutton, btnState.cntbtn);
    operationBtn(autoCoplibutton, btnState.cnpbtn);
  });
};

const checkboxStatus = () => {
  let pipBtn = pipbutton.checked;
  let cntBtn = continuosbutton.checked;
  let cnpBtn = autoCoplibutton.checked;
  let sendJSON = {
    pipbtn: pipBtn,
    cntbtn: cntBtn,
    cnpbtn: cnpBtn
  };
  // Update the chrome storage
  chrome.storage.local.set({ pipbtn: pipBtn }, function() {});
  chrome.storage.local.set({ cntbtn: cntBtn }, function() {});
  chrome.storage.local.set({ cnpbtn: cnpBtn }, function() {});

  // if chacking the button, this send message from popup.js to contents.js

  // console.log(sendJSON);
  //  background.jsにメッセージを送信
  // const sendJson = { "firstName": "Peter", "lastName": "Jones" }
  // chrome.runtime.sendMessage(sendJSON,
  //     function(response) {
  //         console.log(response);
  //     }

  // );
};

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

let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let panel = this.nextElementSibling.nextElementSibling;
    if (panel.style.maxHeight) {
      document.querySelector(".text__btn").innerText = "▶︎";
      panel.style.maxHeight = null;
    } else {
      document.querySelector(".text__btn").innerText = "▼";
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
/**
 * タブのIDからリンクしているタイトルをセットする
 * @param {number} tabId タブのID
 */
function setVideoTitle(tabId){
    if (typeof tabId.latestTabId === "number") {
        chrome.tabs.get(tabId.latestTabId, function(tab) {
          try {
            $elm("#link-video-title").textContent = tab.title;
          } catch (error) {
            if (error.name === "TypeError") {
              chrome.storage.local.set({ latestTabId: 0, pipbtn: false });
              operationBtn(pipbutton, false)
            }
          }
        });
      }
}
