import { useState, useEffect } from 'react';
import { getMessage } from '../utils/i18n';
import SvgBase from './SvgBase';
import BackIcon from './icon/Back';

const HowToUse = ({ onBack }) => {
    const [currentTheme, setCurrentTheme] = useState('light');
    
    useEffect(() => {
        // テーマ設定をロード
        chrome.storage.local.get(['theme'], (result) => {
            const savedTheme = result.theme || 'light';
            
            // システムテーマの場合は、システムの設定に合わせる
            if (savedTheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setCurrentTheme(prefersDark ? 'dark' : 'light');
            } else {
                setCurrentTheme(savedTheme);
            }
        });
        
        // システムのテーマ変更を監視
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            chrome.storage.local.get(['theme'], (result) => {
                if (result.theme === 'system') {
                    setCurrentTheme(e.matches ? 'dark' : 'light');
                }
            });
        };
        
        mediaQuery.addEventListener('change', handleChange);
        
        // ストレージの変更を監視
        const storageListener = changes => {
            if (changes.theme) {
                const newTheme = changes.theme.newValue;
                if (newTheme === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    setCurrentTheme(prefersDark ? 'dark' : 'light');
                } else {
                    setCurrentTheme(newTheme);
                }
            }
        };
        
        chrome.storage.onChanged.addListener(storageListener);
        
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            chrome.storage.onChanged.removeListener(storageListener);
        };
    }, []);
    
    return (
        <div data-theme={currentTheme} className="min-h-screen bg-base-200 p-4">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="btn btn-ghost btn-sm mr-2">
                    <SvgBase width={18} height={18}>
                        <BackIcon />
                    </SvgBase>
                </button>
                <h1 className="text-xl font-bold text-primary">{getMessage('howToUse')}</h1>
            </div>
            
            <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-lg font-semibold mb-4">{getMessage('gettingStarted')}</h2>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">1. {getMessage('findVideo')}</h3>
                    <p className="text-sm text-base-content">
                        {getMessage('findVideoDescription')}
                    </p>
                    <div className="mt-2 bg-base-200 p-3 rounded-lg">
                        <img src="../icon/icon_eye.png" alt="Wipeyy Icon" className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs text-center text-base-content opacity-80">{getMessage('iconAppears')}</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">2. {getMessage('saveVideo')}</h3>
                    <p className="text-sm text-base-content">
                        {getMessage('saveVideoDescription')}
                    </p>
                </div>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">3. {getMessage('accessVideos')}</h3>
                    <p className="text-sm text-base-content">
                        {getMessage('accessVideosDescription')}
                    </p>
                </div>
                
                <div>
                    <h3 className="font-medium mb-2">4. {getMessage('linkVideos')}</h3>
                    <p className="text-sm text-base-content">
                        {getMessage('linkVideosDescription')}
                    </p>
                </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl p-6 mt-4">
                <h2 className="text-lg font-semibold mb-4">{getMessage('tips')}</h2>
                
                <div className="mb-4">
                    <h3 className="font-medium mb-2">{getMessage('keyboardShortcuts')}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="col-span-1 font-semibold">Alt + W</div>
                        <div className="col-span-1 text-base-content">{getMessage('togglePopup')}</div>
                        
                        <div className="col-span-1 font-semibold">Alt + S</div>
                        <div className="col-span-1 text-base-content">{getMessage('saveCurrentVideo')}</div>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-medium mb-2">{getMessage('multipleWindows')}</h3>
                    <p className="text-sm text-base-content">
                        {getMessage('multipleWindowsDescription')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HowToUse;