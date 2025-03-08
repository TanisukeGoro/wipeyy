import { useState, useEffect } from 'react';
import { getMessage } from '../utils/i18n';
import BackIcon from './icon/Back';
import SvgBase from './SvgBase';

const Settings = ({ onBack }) => {
    const [theme, setTheme] = useState('light');
    const [autoLinkEnabled, setAutoLinkEnabled] = useState(false);
    
    useEffect(() => {
        // 設定をロード
        chrome.storage.local.get(['theme', 'autoLinkEnabled'], (result) => {
            if (result.theme) setTheme(result.theme);
            setAutoLinkEnabled(result.autoLinkEnabled || false);
        });
    }, []);
    
    const saveSettings = () => {
        chrome.storage.local.set({
            theme,
            autoLinkEnabled
        }, () => {
            // 保存完了時の処理
        });
    };
    
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        chrome.storage.local.set({ theme: newTheme });
    };
    
    const handleAutoLinkChange = (e) => {
        setAutoLinkEnabled(e.target.checked);
        chrome.storage.local.set({ autoLinkEnabled: e.target.checked });
    };
    
    return (
        <div className="min-h-screen bg-base-200 p-4">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="btn btn-ghost btn-sm mr-2">
                    <SvgBase width={18} height={18}>
                        <BackIcon />
                    </SvgBase>
                </button>
                <h1 className="text-xl font-bold text-primary">{getMessage('settings')}</h1>
            </div>
            
            <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4">{getMessage('appearance')}</h2>
                <div className="form-control mb-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">{getMessage('theme')}</span>
                        <div className="flex gap-2">
                            <button 
                                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleThemeChange('light')}
                            >
                                ☀️ {getMessage('light')}
                            </button>
                            <button 
                                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleThemeChange('dark')}
                            >
                                🌙 {getMessage('dark')}
                            </button>
                            <button 
                                className={`btn btn-sm ${theme === 'system' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleThemeChange('system')}
                            >
                                💻 {getMessage('system')}
                            </button>
                        </div>
                    </label>
                </div>
                
                <h2 className="text-lg font-semibold my-4">{getMessage('behavior')}</h2>
                <div className="form-control">
                    <label className="label cursor-pointer">
                        <span className="label-text">{getMessage('autoLinkVideos')}</span>
                        <input 
                            type="checkbox" 
                            className="toggle toggle-primary" 
                            checked={autoLinkEnabled}
                            onChange={handleAutoLinkChange}
                        />
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                        {getMessage('autoLinkDescription')}
                    </p>
                </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl p-6 mt-4">
                <h2 className="text-lg font-semibold mb-2">{getMessage('about')}</h2>
                <p className="text-sm">Wipeyy v1.0.0</p>
                <div className="mt-4">
                    <a href="https://github.com/TanisukeGoro/wipeyy" target="_blank" rel="noreferrer" className="link link-primary">
                        GitHub
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Settings;