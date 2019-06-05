// global argment
let videoElem = '';
//  get current page URL
const currURL = window.location.toString();
const dotInstallURL = 'https://dotinstall.com/lessons/';


window.onload = function() {
    const isVideoElem = document.querySelector('video');
    //  if there page has video element, then create video operation class.
    if (isVideoElem !== null) videoElem = new VideoRefer(isVideoElem);

    // ドットインストールを開いているか判定してページ読み込み時の動作
    if (currURL.indexOf(dotInstallURL) === 0) {
        // Auto play the videoReference
        if (videoElem !== null) {
            videoElem.unMuted();
            chrome.storage.local.get(["pipbtn"], function(btnState) {
                btnState.pipbtn && goPicInPic();
            });
            videoElem.goPlay();

            // chrome.runtime.onMessage.addListener(function(request) {
            //     // run "picture In picture", when clicking the pip button.
            //     // When pip button again, became end the "picture in picture."
            //     console.log(request);
            //     console.log(videoElem.pipStatus);
            //     (videoElem.pipStatus) ? videoElem.goPicInPic(): videoElem.stopPicInPic();
            //     return true;
            // });


        };
    };

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log('get message');
            switch (request.greeting) {
                case 'pip-switch':
                    (videoElem.pipStatus) ? videoElem.stopPicInPic(): videoElem.goPicInPic();
                    sendResponse({ farewell: `pip status : ${videoElem.pipStatus}` });
                    break;
                case 'play-pause':
                    (videoElem.playStatus) ? videoElem.stopPlay(): videoElem.goPlay();
                    sendResponse({ farewell: `play status : ${videoElem.playStatus}` });
                    break;
                case 'previous-10sec':
                    console.log('previous');
                    videoElem.backTenSec();
                    sendResponse({ farewell: "back status : isDone" });
                    break;
                case 'skip-10sec':
                    console.log('skip');
                    videoElem.skipTenSec();
                    sendResponse({ farewell: "skip status : isDone" });
                    break;

                default:
                    break;
            }
            return true
        });

}


/**
 * video controller
 * @class VideoRefer
 * @argument elem video element
 */
class VideoRefer {
    constructor(elem) {
        this.videoReference = elem;
        this.pipStatus = false;
        this.VideoBind();
        this.VideoAttached();
    };
    /**
     * Unmuted the active video
     * @function unMuted 
     */
    unMuted = () => this.videoReference.muted = false;

    /**
     * muted the active video
     * @function muted 
     */
    muted = () => this.videoReference.muted = true;

    /** 
     * Pley the active video
     * @function goPlay 
     */
    goPlay = () => this.videoReference.play()
        .then(() => this.playStatus = true)
        .catch(() => console.error(' 再生されませんでした '));

    /**
     * Pause the active video
     * @function stopPlay
     */
    stopPlay = () => this.videoReference.pause()
        .then(() => this.playStatus = false)
        .catch(() => console.error(' 停止されませんでした '));

    /**
     * activate picture in picture
     * @function goPicInPic
     */
    goPicInPic = () => this.videoReference.requestPictureInPicture()
        .then(() => this.pipStatus = true)
        .catch(() => console.error(' Go PIP が実行されませんでした。'));

    /**
     * unactivate picture in picture
     * @function stopPicInPic
     */
    stopPicInPic = () => document.exitPictureInPicture()
        .then(() => this.pipStatus = false)
        .catch(() => console.error(' Stop PIP が実行されませんでした。'));

    /**
     * 
     */
    skipTenSec = () => this.videoReference.currentTime += 10;

    /**
     * 
     */
    backTenSec = () => this.videoReference.currentTime -= 10;

    /**
     * 
     */
    VideoAttached = () => {
        let listener = this.videoReference;
        // 動画が終了した時に実行されるイベント
        listener.addEventListener('ended', function() {
            // chrome.strageの状態を取得
            chrome.storage.local.get(["cntbtn", "cnpbtn"], function(btnState) {
                // もし、連続再生がTrueなら次のページをクリック
                btnState.cnpbtn && document.querySelector('#lesson-complete-button').click();
                btnState.cntbtn && document.querySelector('#go_to_next_video').click();
            });
        });

        listener.addEventListener('play', function() {
            this.playStatus = true;
        });
        listener.addEventListener('stop', function() {
            this.playStatus = false;
        });
    }

    /**
     *
     */
    VideoBind = () => {
        (document.pictureInPictureElement === null) ? this.pipStatus = false: this.pipStatus = true;
    }

}












// https://www.winhelponline.com/blog/disable-autoplay-video-google-chrome-flags/
// 上記のサイトを参照すると
// chrome:flags/#autoplay-policy
// においてAutoplay policyの項目を"No user gesture is required."
// とすればAuto-playが実行できるようになる。


// window.onload = () => {
//     unmuted();
//     // Checking supported the "picture in picture"  in this browser
//     !document.pictureInPictureEnabled || video.disablePictureInPicture ?
//         (togglePipButton.hidden, alert('このブラウザではPIPがサポートされていません!')) : console.log();
//     // the active video is plaied, when click the play button.
//     togglePlaybutton.addEventListener('click', async function() {
//         try {
//             if (video.paused)
//                 await goPlay();
//             else
//                 await goPause();

//         } catch (error) {
//             console.log(`> Error! : ${error}`);
//         } finally {

//         }
//     });

//     togglePlaybutton.click();


// Note that this can happen if user clicked the "Toggle Picture-in-Picture"
// button but also if user clicked some browser context menu or if
// Picture-in-Picture was triggered automatically for instance.

//     // define window obj
//     let pipWindow;
//     // pipを検知してpipwindowサイズを取得する
//     video.addEventListener('enterpictureinpicture', (event) => {
//         console.log('Video entered Picture-in-Picture');

//         pipWindow = event.pictureInPictureWindow;
//         console.log(`Window size is ${pipWindow.width}x${pipWindow.height}`);
//         // pipwindowサイズの変更を検知して、サイズを出力
//         pipWindow.addEventListener('resize', onPipWindowResize);
//     });

//     video.addEventListener('leavepictureinpicture', () => {
//         console.log('Video left Picture-in-Picture');
//         pipWindow.removeEventListener('resize', onPipWindowResize);
//     });

//     function onPipWindowResize() {
//         console.log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
//     }
// }