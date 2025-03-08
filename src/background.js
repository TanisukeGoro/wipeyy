// 重複したJsonのindexが前の方を排除する
const removeDuplicates = function(jsonObject, searchKey) {
    let obj = {};
    return Object.keys(
        jsonObject.reverse().reduce((prev, next) => {
            if (!obj[next[searchKey]]) obj[next[searchKey]] = next;
            return obj;
        }, obj)
    ).map(i => obj[i]);
};

const tabIdIndexOf = function(jsonObject, value) {
    return jsonObject.map(json => json.tabId).indexOf(value);
};

const updateVideoRefer = function(tabId, key, value) {
    chrome.storage.local.get(['bindVideoReferrer'], function(result) {
        let videos = result.bindVideoReferrer;
        if (videos !== undefined && videos.length !== 0) {
            let tabIdIndex = tabIdIndexOf(videos, tabId);
            if (tabIdIndex < 0) return false;
            videos[tabIdIndex][key] = value;
            chrome.storage.local.set({ bindVideoReferrer: videos }, function() {
                console.log('set videos :>> ', videos);
            });
        }
    });
};

const querySiteDomain = function(url) {
    return new URL(url).host.replace(/www\./, '');
};

const queryThumbnailUrl = function(url, tabId) {
    const _url = new URL(url);
    const host = _url.host;
    console.log('queryThumbnail host :>>', host);

    if (host.includes('.youtube.')) {
        const videoId = _url.searchParams.get('v');
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }

    if (host.includes('amazon.')) {
        chrome.tabs.sendMessage(tabId, { call: 'querySelector', selector: '._3AaXaE' }, function(response) {
            if (response && response.message !== '') {
                const dom = document.createElement('div');
                dom.innerHTML = response.message;
                console.log('dom..src :>>', dom.querySelector('img').src);
                // ここでアップデートする関数を用意しておく
                updateVideoRefer(tabId, 'img', dom.querySelector('img').src);
            }
        });
    }

    if (host.includes('soundcloud.com')) {
        chrome.tabs.sendMessage(
            tabId,
            { call: 'querySelector', selector: '.playbackSoundBadge a.sc-media-image' },
            function(response) {
                if (response && response.message !== '') {
                    const dom = document.createElement('div');
                    dom.innerHTML = response.message;
                    console.log(dom.querySelector('span.sc-artwork'));
                    let img = dom.querySelector('span.sc-artwork').style.backgroundImage.match(/url\("(.*)"\)/)[1];
                    img = img.replace(/t120x120/g, 't500x500');
                    // ここでアップデートする関数を用意しておく
                    updateVideoRefer(tabId, 'img', img);
                }
            }
        );
    }

    return '';
};

const bindVideoInfo = function(tabId, changeInfo, tab) {
    return {
        tabId,
        windowId: tab.windowId,
        title: tab.title,
        siteName: querySiteDomain(tab.url),
        url: tab.url,
        favicon: tab.favIconUrl,
        img: queryThumbnailUrl(tab.url, tabId),
        audiable: false,
    };
};

const indexTab = function(tabId, changeInfo, tab) {
    chrome.storage.local.get(['bindVideoReferrer', 'autoLinkEnabled'], function(result) {
        let videos = result.bindVideoReferrer || [];
        if (videos.length === 0) {
            videos = [bindVideoInfo(tabId, changeInfo, tab)];
        } else {
            videos.push(bindVideoInfo(tabId, changeInfo, tab));
        }
        videos = removeDuplicates(videos, 'tabId');
        chrome.storage.local.set({ bindVideoReferrer: videos }, function() {
            console.log('set videos :>> ', videos);
            
            // 自動リンク機能が有効で、新しく検出された動画があれば自動的にリンク
            const autoLinkEnabled = result.autoLinkEnabled || false;
            if (autoLinkEnabled) {
                chrome.storage.local.set({ linkedTabId: tabId }, function() {
                    console.log('Auto-linked tab ID :>> ', tabId);
                });
            }
        });
    });
};

// タブの更新イベントリスナー
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log('tab :>> ', tab);
    if ('status' in changeInfo) {
        console.log('changeInfo.status :>> ', changeInfo.status);
        // 読み込んだらVideoタグをカウントしてインデックスをする
        chrome.tabs.sendMessage(tabId, { call: 'hasVideo' }, function(response) {
            if (response && response.message > 0) {
                indexTab(tabId, changeInfo, tab);
            }
        });
    }

    if ('audible' in tab) {
        // 音声の再生停止
        console.log('changeInfo :>> ', changeInfo);
        console.log(tab.audible ? '再生 :>> ' : '停止 :>> ', tab.title);
        tab.audible && indexTab(tabId, changeInfo, tab);
    }
});

// タブの削除イベントリスナー
chrome.tabs.onRemoved.addListener(function(tabId, isWindowClosing) {
    console.log('tabId :>> ', tabId);
    console.log('isWindowClosing :>> ', isWindowClosing);
    chrome.storage.local.get(['bindVideoReferrer'], function(result) {
        let videos = result.bindVideoReferrer;
        console.log('get videos :>> ', videos);
        if (videos && videos.length !== 0) {
            let tabIdIndex = tabIdIndexOf(videos, tabId);
            if (tabIdIndex < 0) return false;
            videos.splice(tabIdIndex, 1);
            videos = removeDuplicates(videos, 'tabId');
            chrome.storage.local.set({ bindVideoReferrer: videos }, function() {
                console.log('set videos :>> ', videos);
            });
        }
    });
});

// コマンドのイベントリスナー
chrome.commands.onCommand.addListener(function(command) {
    console.log('command :>>', command);
    chrome.storage.local.get(['linkedTabId'], function(result) {
        // タブのチェック
        const tabId = result.linkedTabId;
        if (tabId) {
            chrome.tabs.sendMessage(tabId, { sendCommand: command }, function(response) {
                try {
                    console.log(response && response.farewell);
                } catch (error) {
                    console.error('エラー:', error);
                }
            });
        }
    });
});
