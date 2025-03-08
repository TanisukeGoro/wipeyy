import { getMessage } from '../utils/i18n';
import SvgBase from './SvgBase';
import BackIcon from './icon/Back';

const HowToUse = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-base-200 p-4">
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
                    <p className="text-sm">
                        {getMessage('findVideoDescription')}
                    </p>
                    <div className="mt-2 bg-base-200 p-3 rounded-lg">
                        <img src="/src/icon/icon_eye.png" alt="Wipeyy Icon" className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs text-center">{getMessage('iconAppears')}</p>
                    </div>
                </div>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">2. {getMessage('saveVideo')}</h3>
                    <p className="text-sm">
                        {getMessage('saveVideoDescription')}
                    </p>
                </div>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">3. {getMessage('accessVideos')}</h3>
                    <p className="text-sm">
                        {getMessage('accessVideosDescription')}
                    </p>
                </div>
                
                <div>
                    <h3 className="font-medium mb-2">4. {getMessage('linkVideos')}</h3>
                    <p className="text-sm">
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
                        <div className="col-span-1">{getMessage('togglePopup')}</div>
                        
                        <div className="col-span-1 font-semibold">Alt + S</div>
                        <div className="col-span-1">{getMessage('saveCurrentVideo')}</div>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-medium mb-2">{getMessage('multipleWindows')}</h3>
                    <p className="text-sm">
                        {getMessage('multipleWindowsDescription')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HowToUse;