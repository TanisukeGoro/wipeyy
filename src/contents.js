import ExtensionService from './utils/ExtensionService';
import VideoRefer from './utils/VideoRefer';

// background => contents_script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.sendCommand && request.sendCommand !== '') {
        console.log('request.sendCommand :>>', request.sendCommand);
        const result = operationVideo(request.sendCommand);
        return sendResponse({ message: `response ${request.sendCommand}`, farewell: result?.farewell });
    }

    if (request.call === 'hello') {
        return sendResponse({ message: 'response hello' });
    }

    if (request.call === 'getVideos') {
        return sendResponse({ message: getVideos(), id: request.id });
    }

    if (request.call === 'hasVideo') {
        return sendResponse({ message: hasVideoTags(), id: request.id });
    }

    if (request.call === 'querySelector') {
        const dom = document.querySelector(request.selector) || '';
        const html = dom !== '' ? dom.innerHTML : '';
        return sendResponse({ message: html });
    }
});

const hasVideoTags = () => document.querySelectorAll('video').length;
const getVideos = () => 'ビデオ';

// 適切なvideo要素を取得する
const getVideoElem = elements => {
    if (window.location.host.includes('amazon')) {
        return Array.from(elements).find(
            node => node.getAttribute('src') && node.getAttribute('src').includes('amazon.co.jp')
        );
    } else {
        return elements[0];
    }
};

// コマンドを受け付けて、それに対してビデオの操作を実現する
const operationVideo = (operationCommand, responseStatus = true) => {
    ExtensionService.log('operationCommand');
    ExtensionService.log(operationCommand);

    // videoタグを探索
    const isVideoElems = Array.from(document.querySelectorAll('video'))
        .filter(video => video.readyState != 0)
        .filter(video => video.disablePictureInPicture == false)
        .sort((v1, v2) => {
            const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
            const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
            return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
        });

    if (isVideoElems.length === 0) return false;

    const isVideoElem = getVideoElem(isVideoElems);
    console.log('isVideoElem :>>', isVideoElem);

    if (!isVideoElem) return false;

    const videoElem = new VideoRefer(isVideoElem);

    switch (operationCommand) {
        case 'pip-switch':
            console.log(videoElem.pipStatus);
            videoElem.pipStatus ? videoElem.stopPicInPic() : videoElem.goPicInPic();
            return responseStatus ? { farewell: `pip status : ${videoElem.pipStatus}` } : videoElem.goPlay();
        case 'play-pause':
            !isVideoElem.paused ? videoElem.stopPlay() : videoElem.goPlay();
            return responseStatus && { farewell: `play status : ${videoElem.playStatus}` };
        case 'previous-10sec':
            videoElem.backTenSec();
            return responseStatus && { farewell: 'back status : isDone' };
        case 'skip-10sec':
            videoElem.skipTenSec();
            return responseStatus && { farewell: 'skip status : isDone' };
        case 'auto-play':
            return videoElem.goPlay();
        default:
            return { farewell: 'operation is nothing' };
    }
};
