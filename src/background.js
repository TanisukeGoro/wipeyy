let GLOBAL_VIDEO_REFERER = [];

const sendMessage = function (message, callback) {
  return chrome.runtime.sendMessage.apply(chrome, arguments);
};

const getResourceUrl = function (resourceName) {
  return chrome.extension.getURL.apply(chrome, arguments);
};

const getLocalizedMessage = function (messageName) {
  return chrome.i18n.getMessage.apply(chrome, arguments);
};
const tabsSendMessage = function (id, message, callback) {
  return chrome.tabs.sendMessage.apply(chrome, arguments);
};

const allTabsQuery = function (callback) {
  return chrome.tabs.query({}, callback);
};

const getChromeLocalStorage = function (key, callback) {
  return chrome.storage.local.get(key, callback);
};

const setChromeLocalStorage = function (object, callback) {
  return chrome.storage.local.set(object, callback);
};

const bindVideoReferrer = function () {
  let videoReferrer = {};
  chrome.storage.local.get(["bindVideoReferrer"], function (obj) {
    videoReferrer = obj;
  });
  console.log(videoReferrer);
  return videoReferrer;
};

// 重複したJsonのindexが前の方を排除する
const removeDuplicates = function (jsonObject, searchKey) {
  let obj = {};
  return Object.keys(
    jsonObject.reverse().reduce((prev, next) => {
      if (!obj[next[searchKey]]) obj[next[searchKey]] = next;
      return obj;
    }, obj)
  ).map((i) => obj[i]);
};

const tabIdindexOf = function(jsonObject, value){
  return jsonObject.map(json => json.tabId).indexOf(value)
}


const querySiteDomain = function(url) { 
  url = new URL(url)
  return host = url.host.replace(/www\./, '')
}

const queryThumbnailUrl = function(url) {
  url = new URL(url)
  host = url.host

  if (host.includes('.youtube.')) {
    videoId = url.searchParams.get('v')
    return `https://img.youtube.com/vi/${videoId}/0.jpg`
  }
  // どのサイトのURLなのかを判定
  // youtubeならvideo id からurlを生成
  // amazonならcontents_scriptに命令を出してDOMからカバー画像URLを取得
  // 
  return ""
}

const bindVideoInfo = function (tabId, changeInfo, tab) { 
  return { 
    tabId,
    windowId: tab.windowId,
    title: tab.title,
    siteName: querySiteDomain(tab.url),
    url: tab.url,
    favicon: tab.favIconUrl,
    img: queryThumbnailUrl(tab.url),
    audiable: false 
  }
 }

/**
 * Incoming message from Extension background page
 */
const addListener = function (func) {
  chrome.runtime.onMessage.addListener.apply(
    chrome.runtime.onMessage,
    arguments
  );
};

const indexTab = function (tabId, changeInfo, tab) { 
  chrome.storage.local.get(["bindVideoReferrer"], function (result) {
    let videos = result.bindVideoReferrer;
    if (videos === undefined || videos.length === 0) {
      videos = [bindVideoInfo(tabId, changeInfo, tab)];
    } else {
      videos.push(bindVideoInfo(tabId, changeInfo, tab));
    }
    videos = removeDuplicates(videos, "tabId");
    chrome.storage.local.set({ bindVideoReferrer: videos }, function () {
      console.log("set videos :>> ", videos);
    });
  });
 }


////////////////////////////////////////////////////////////////////////

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log("tab :>> ", tab);
  if (changeInfo.hasOwnProperty("status")) {
    console.log("changeInfo.status :>> ", changeInfo.status);
    // 読み込んだらVideoタグをカウントしてインデックスをする
    chrome.tabs.sendMessage(tabId, { type: "getDoc" }, async function (doc) {
      console.log("doc :>> ", doc);
      if (Number(doc) > 0) {
        indexTab(tabId, changeInfo, tab)
      }
    });
    // もし動画が存在する場合は情報をstorageに渡す
  }
  if (tab.hasOwnProperty("audible")) {
    // 音声の再生停止
    console.log('changeInfo :>> ', changeInfo);
    console.log(tab.audible ? "再生 :>> " : "停止 :>> ", tab.title);
    tab.audible && indexTab(tabId, changeInfo, tab)
    // 音声の再生あって、インデックスされていない場合はインデックスを開始する
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, isWindowClosing) {
  console.log("tabId :>> ", tabId);
  console.log("isWindowClosing :>> ", isWindowClosing);
  chrome.storage.local.get(["bindVideoReferrer"], function (result) {
    let videos = result.bindVideoReferrer
    console.log('get videos :>> ', videos);
    if (videos !== undefined || videos.length !== 0) {
      tabIdIndex = tabIdindexOf(videos, tabId)
      if (tabIdIndex < 0 ) return false;
      videos.splice(tabIdindexOf(videos, tabId), 1)
      videos = removeDuplicates(videos, "tabId");
      chrome.storage.local.set({ bindVideoReferrer: videos }, function () {
        console.log("set videos :>> ", videos);
      }); 
    }
  });
  // タブの削除の処理
  // もしトラック中のタブが存在するのであれば、storageから削除する
});


// TODO: メモ
// indexTab => トラッキングを開始するためにchrome.storageに追加
// removeIndexTab => トラッキングを解除するためにchrome.storageから削除
// 動画視聴中に検索画面から他のページに遷移した際にどうするか？


