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
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // テーマの設定
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');

        // 保存されたタブIDをロード
        chrome.storage.local.get(['linkedTabId'], function(result) {
            console.log('tabId :>>', result);
            setLinkedTabId(result.linkedTabId || '');
        });

        // ビデオタブリストをロード
        chrome.storage.local.get(['bindVideoReferrer'], function(result) {
            const videoItems = result.bindVideoReferrer || [];
            setItems(videoItems);

            // タブの存在確認と背景色の設定
            chrome.tabs.query({}, function(tabs) {
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
        chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
            if (tab[0].windowId === item.windowId) {
                chrome.tabs.update(item.tabId, { active: true });
            }
        });
        chrome.windows.update(item.windowId, { focused: true }, function() {
            chrome.tabs.update(item.tabId, { active: true });
        });
    };

    // タブを削除する処理
    const deleteTab = item => {
        chrome.tabs.remove(item.tabId);
    };

    // タブIDをリンクする処理
    const linkTabId = id => {
        chrome.storage.local.set({ linkedTabId: id }, function() {
            setLinkedTabId(id);
        });
    };

    // テーマを切り替える処理
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div data-theme={theme} className="min-h-screen bg-base-200 p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-primary">Wipeyy</h1>
                <button onClick={toggleTheme} className="btn btn-sm btn-circle btn-ghost">
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {items.length === 0 ? (
                    <div className="card bg-base-100 shadow-xl p-6 text-center">
                        <h3 className="font-semibold">保存されたビデオがありません</h3>
                        <p className="text-sm mt-2">ビデオを視聴中にWipeyyを使ってビデオを保存してください</p>
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div
                            key={index}
                            className={`card bg-base-100 shadow-xl overflow-hidden video-card ${
                                linkedTabId === item.tabId ? 'linked' : ''
                            }`}
                        >
                            <div className="browser-bar">
                                <div className="browser-bar-buttons">
                                    <button
                                        className="btn-close"
                                        onClick={() => deleteTab(item)}
                                        aria-label="タブを閉じる"
                                    >
                                        <SvgBase className="opacity-0 group-hover:opacity-100" width={7} height={7}>
                                            <Close iconColor="#fff" />
                                        </SvgBase>
                                    </button>
                                    <button className="btn-minimize" aria-label="最小化">
                                        <SvgBase className="opacity-0 group-hover:opacity-100" width={7} height={7}>
                                            <Minimize iconColor="#000" />
                                        </SvgBase>
                                    </button>
                                    <button className="btn-open" onClick={() => openTab(item)} aria-label="タブを開く">
                                        <SvgBase className="opacity-0 group-hover:opacity-100" width={7} height={7}>
                                            <OpenTab iconColor="#fff" />
                                        </SvgBase>
                                    </button>
                                </div>

                                <div className="favicon-container">
                                    {item.favicon && <img src={item.favicon} alt="" className="w-4 h-4" />}
                                </div>

                                <div className="url-display">{item.url}</div>

                                <button className="btn btn-circle btn-xs btn-ghost">
                                    <SvgBase width={14} height={14}>
                                        <Settings />
                                    </SvgBase>
                                </button>
                            </div>

                            <figure className="relative">
                                {item.img ? (
                                    <img src={item.img} alt={item.title} className="card-image" />
                                ) : (
                                    <div className="card-image bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">画像なし</span>
                                    </div>
                                )}
                            </figure>

                            <div
                                className="card-body p-4"
                                style={{ backgroundColor: item.backgroundColor, color: item.color }}
                            >
                                <h2 className="card-title">{item.title || 'タイトルなし'}</h2>

                                <div className="card-actions justify-end mt-2">
                                    <button onClick={() => linkTabId(item.tabId)} className="link-button">
                                        {linkedTabId === item.tabId ? getMessage('L000002') : getMessage('L000001')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
