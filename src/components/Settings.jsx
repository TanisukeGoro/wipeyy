import { useState, useEffect } from 'react';
import { getMessage } from '../utils/i18n';
import BackIcon from './icon/Back';
import SvgBase from './SvgBase';

const Settings = ({ onBack }) => {
    const [theme, setTheme] = useState('light');
    const [currentTheme, setCurrentTheme] = useState('light'); // 実際に適用するテーマ
    const [autoLinkEnabled, setAutoLinkEnabled] = useState(false);
    
    useEffect(() => {
        // 設定をロード
        chrome.storage.local.get(['theme', 'autoLinkEnabled'], (result) => {
            const savedTheme = result.theme || 'light';
            setTheme(savedTheme);
            
            // システムテーマの場合は、システムの設定に合わせる
            if (savedTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setCurrentTheme(prefersDark ? 'dark' : 'light');
            } else {
                setCurrentTheme(savedTheme);
            }
            
            setAutoLinkEnabled(result.autoLinkEnabled || false);
        });
        
        // システムのテーマ変更を監視
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (theme === 'system') {
                setCurrentTheme(e.matches ? 'dark' : 'light');
            }
        };
        
        // ストレージの変更を監視
        const storageListener = changes => {
            if (changes.theme) {
                const newTheme = changes.theme.newValue;
                setTheme(newTheme);
                
                if (newTheme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setCurrentTheme(prefersDark ? 'dark' : 'light');
                } else {
                    setCurrentTheme(newTheme);
                }
            }
            
            if (changes.autoLinkEnabled) {
                setAutoLinkEnabled(changes.autoLinkEnabled.newValue);
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        chrome.storage.onChanged.addListener(storageListener);
        
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            chrome.storage.onChanged.removeListener(storageListener);
        };
    }, [theme]);
    
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setCurrentTheme(prefersDark ? 'dark' : 'light');
        } else {
            setCurrentTheme(newTheme);
        }
        
        chrome.storage.local.set({ theme: newTheme });
    };
    
    const handleAutoLinkChange = (e) => {
        setAutoLinkEnabled(e.target.checked);
        chrome.storage.local.set({ autoLinkEnabled: e.target.checked });
    };
    
    return (
        <div data-theme={currentTheme} className="min-h-screen bg-base-200 p-4">
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
                    <p className="text-sm text-base-content opacity-70 mt-1">
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