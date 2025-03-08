import { useState, useEffect } from 'react';
import SvgBase from './components/SvgBase';
import Close from './components/icon/Close';
import Minimize from './components/icon/Minimize';
import OpenTab from './components/icon/OpenTab';
import Settings from './components/icon/Settings';
import ExtensionService from './utils/ExtensionService';
import * as imgClient from './utils/imgRenderClient';
import { getMessage } from './utils/i18n';

import './App.css';

const App = () => {
    const [items, setItems] = useState([]);
    const [linkedTabId, setLinkedTabId] = useState('');

    useEffect(() => {
        // 保存されたタブIDをロード
        chrome.storage.local.get(['linkedTabId'], function (result) {
            console.log('tabId :>>', result);
            setLinkedTabId(result.linkedTabId || '');
        });

        // ビデオタブリストをロード
        chrome.storage.local.get(['bindVideoReferrer'], function (result) {
            const videoItems = result.bindVideoReferrer || [];
            setItems(videoItems);

            // タブの存在確認と背景色の設定
            chrome.tabs.query({}, function (tabs) {
                // 存在しないタブがあるか検索
                const nilTabIds = videoItems
                    .map(tab => tab.tabId)
                    .filter(n => tabs.map(tab => tab.id).indexOf(n) === -1);

                // 存在しないタブは削除
                if (nilTabIds && nilTabIds.length) {
                    const filteredItems = videoItems.filter(item => !nilTabIds.includes(item.tabId));
                    setItems(filteredItems);
                    chrome.storage.local.set({ bindVideoReferrer: filteredItems });
                }

                // 各動画の背景色と文字色を設定
                const updatedItems = [...videoItems];
                videoItems.forEach((item, index) => {
                    if (item.img === '' || item.img === undefined) {
                        updatedItems[index] = {
                            ...updatedItems[index],
                            backgroundColor: imgClient.cssRGB([233, 233, 233]),
                            color: imgClient.generatefontColor([255, 255, 255]),
                        };
                    } else {
                        imgClient
                            .averageColorByImage(item.img)
                            .then(color => {
                                const fontColor = imgClient.rgba2hex(imgClient.generatefontColor(color));
                                ExtensionService.log(fontColor);
                                updatedItems[index] = {
                                    ...updatedItems[index],
                                    backgroundColor: imgClient.cssRGBa(color, 0.8),
                                    color: fontColor,
                                };
                                setItems([...updatedItems]);
                            })
                            .catch(e => {
                                ExtensionService.log(e);
                                updatedItems[index] = {
                                    ...updatedItems[index],
                                    backgroundColor: imgClient.cssRGB([233, 233, 233]),
                                    color: imgClient.generatefontColor([255, 255, 255]),
                                };
                                setItems([...updatedItems]);
                            });
                    }
                });
            });
        });

        // ストレージの変更を監視
        const storageListener = changes => {
            for (const key in changes) {
                const storageChange = changes[key];
                if (key === 'bindVideoReferrer') {
                    setItems(storageChange.newValue || []);
                }
            }
        };

        chrome.storage.onChanged.addListener(storageListener);

        // クリーンアップ関数
        return () => {
            chrome.storage.onChanged.removeListener(storageListener);
        };
    }, []);

    // タブを開く処理
    const openTab = item => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
            if (tab[0].windowId === item.windowId) {
                chrome.tabs.update(item.tabId, { active: true });
            }
        });
        chrome.windows.update(item.windowId, { focused: true }, function () {
            chrome.tabs.update(item.tabId, { active: true });
        });
    };

    // タブを削除する処理
    const deleteTab = item => {
        chrome.tabs.remove(item.tabId);
    };

    // タブIDをリンクする処理
    const linkTabId = id => {
        chrome.storage.local.set({ linkedTabId: id }, function () {
            setLinkedTabId(id);
        });
    };

    return (
        <div>
            {items.map((item, index) => (
                <div key={index} className="d-flex">
                    <div
                        className="browser-view"
                        style={{ backgroundColor: linkedTabId === item.tabId ? '#a6d06f' : '' }}
                    >
                        <div className="menu-bar">
                            <div className="col-left">
                                <button className="dot delete-tab" onClick={() => deleteTab(item)}>
                                    <SvgBase className="btn-svg" width={9} height={9}>
                                        <Close iconColor="#000" />
                                    </SvgBase>
                                </button>
                                <button className="dot minimize-tab">
                                    <SvgBase className="btn-svg" width={9} height={9}>
                                        <Minimize iconColor="#000" />
                                    </SvgBase>
                                </button>
                                <button className="dot open-tab" onClick={() => openTab(item)}>
                                    <SvgBase className="btn-svg" width={9} height={9}>
                                        <OpenTab iconColor="#000" />
                                    </SvgBase>
                                </button>
                                <img src={item.favicon} alt="" className="favicon" />
                            </div>
                            <div className="col-middle">
                                <p className="search-box">{item.url}</p>
                            </div>
                            <div className="col-right">
                                <SvgBase>
                                    <Settings />
                                </SvgBase>
                            </div>
                        </div>
                        <div className="container" style={{ color: item.color }}>
                            <div className="media-artwork">
                                <img src={item.img} alt="" />
                            </div>
                            <div className="content">
                                <h3>{item.title}</h3>
                                <div className="ml-20" onClick={() => linkTabId(item.tabId)}>
                                    {linkedTabId === item.tabId ? getMessage('L000002') : getMessage('L000001')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default App;
