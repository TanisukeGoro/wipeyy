const video = document.getElementsByTagName('video');

//  get current page URL
const currURL = window.location.toString();
const dotInstallURL = 'https://dotinstall.com/lessons/';

// ドットインストールを開いているか判定してページ読み込み時の動作
if (currURL.indexOf(dotInstallURL) === 0) {
    // Auto play the video
    if (video.length) {
        video[0].muted = false;
        const pipPromise = video[0].requestPictureInPicture();
        if (pipPromise !== null) {
            pipPromise.catch(() => { video[0].requestPictureInPicture(); })
        }
        // chrome.storage.sync.get(["pipbtn"], function(btnState) {
        //     btnState.pipbtn && video[0].requestPictureInPicture();
        // });
        video[0].play();
    };
}
// videoがあるページで所定のイベントを定義
if (video.length) {
    chrome.runtime.onMessage.addListener(function(request) {
        // run "picture In picture", when clicking the pip button.
        // When pip button again, became end the "picture in picture."
        if (request.pipbtn) {
            video[0].requestPictureInPicture();
        } else {
            document.exitPictureInPicture();
        }
    });

    video[0].addEventListener('ended', function() {
        // chrome.strageの状態を取得
        chrome.storage.sync.get(["cntbtn", "cnpbtn"], function(btnState) {
            // もし、連続再生がTrueなら次のページをクリック
            btnState.cnpbtn && document.querySelector('#lesson-complete-button').click();
            btnState.cntbtn && document.querySelector('#go_to_next_video').click();
        });
    });
}








// window.onload は別にいらないのかもしれない。
window.onload = function() {}

// chrome.runtime.onMessage.addListener(function(request) {
//     const video = document.getElementsByTagName('video');
//     video[0].requestPictureInPicture();
//     console.log(request)
// // });


// let test = () => {
//     console.log('aa');
// }

// var actualCode = 'function onytplayerStateChange() {' +
//     '    console.log("The state of the player has changed");' +
//     '}';

// var script = document.createElement('script');
// script.textContent = actualCode;
// (document.head || document.documentElement).appendChild(script);
// script.parentNode.removeChild(script);
// https://www.winhelponline.com/blog/disable-autoplay-video-google-chrome-flags/
// 上記のサイトを参照すると
// chrome:flags/#autoplay-policy
// においてAutoplay policyの項目を"No user gesture is required."
// とすればAuto-playが実行できるようになる。
// 拡張機能を追加する際にユーザーの認証の元、自動的に変更が可能になるようにするといい？
// いつでも元に戻せるように設定画面にわかりやすくトグルボタンを配置しておく必要がある。
// const videoReference = document.getElementById('video');
// const togglePipButton = document.getElementById('pipButton');
// const togglePlaybutton = document.getElementById('playButton');

// // const playClickDiv = document.getElementById('playClickDiv');




// /**
//  * Unmuted the active video
//  * @function unmuted 
//  */
// const unmuted = () => videoReference.muted = false;

// /** 
//  * Pley the active video
//  * @function goPlay 
//  */
// const goPlay = () => videoReference.play();

// /**
//  * Pause the active video
//  * @function goPause
//  */
// const goPause = () => videoReference.pause();

// /**
//  * 
//  * @function getNextVideoLink
//  * @retruns VideoLink as String 
//  */
// const getNextVideoLink = () => {

// }






// window.onload = () => {
//         unmuted();
//         // Checking supported the "picture in picture"  in this browser
//         !document.pictureInPictureEnabled || video.disablePictureInPicture ?
//             (togglePipButton.hidden, alert('このブラウザではPIPがサポートされていません!')) : console.log();




//         // the active video is plaied, when click the play button.
//         togglePlaybutton.addEventListener('click', async function() {
//             try {
//                 if (video.paused)
//                     await goPlay();
//                 else
//                     await goPause();

//             } catch (error) {
//                 console.log(`> Error! : ${error}`);
//             } finally {

//             }
//         });

//         togglePlaybutton.click();




//         // Note that this can happen if user clicked the "Toggle Picture-in-Picture"
//         // button but also if user clicked some browser context menu or if
//         // Picture-in-Picture was triggered automatically for instance.

//         // define window obj
//         let pipWindow;
//         // pipを検知してpipwindowサイズを取得する
//         video.addEventListener('enterpictureinpicture', (event) => {
//             console.log('Video entered Picture-in-Picture');

//             pipWindow = event.pictureInPictureWindow;
//             console.log(`Window size is ${pipWindow.width}x${pipWindow.height}`);
//             // pipwindowサイズの変更を検知して、サイズを出力
//             pipWindow.addEventListener('resize', onPipWindowResize);
//         });

//         video.addEventListener('leavepictureinpicture', () => {
//             console.log('Video left Picture-in-Picture');
//             pipWindow.removeEventListener('resize', onPipWindowResize);
//         });

//         function onPipWindowResize() {
//             console.log(`> Window size changed to ${pipWindow.width}x${pipWindow.height}`);
//         }


//         video.addEventListener('play', () => {
//             togglePlaybutton.innerHTML = '<i class="far fa-pause-circle"></i> Stop'
//         });
//         video.addEventListener('pause', () => {
//             togglePlaybutton.innerHTML = '<i class="far fa-play-circle"></i> Play'
//         });


// video.addEventListener('ended', () => {
//     video.src = "https://player.vimeo.com/external/270306379.hd.mp4?s=c07d6e9c154f8c190caeb596c574258f466d57af&profile_id=174&oauth2_token_id=56271471"
//         // 完了ボタンを押して
//         // 次の動画へ
//         // リロード
// });

//         // video.addEventListener('keydown', function(e) {
//         //     console.log(e.keyCode);
//         //     console.log(e.which);
//         // });
//     }
//     // get key vaind
//     // video.addEventListener('enterpictureinpicture', () => {
//     //     button.textContent = 'Exit Picture-in-Picture';
//     // });
//     // video.addEventListener('leavepictureinpicture', () => {
//     //     button.textContent = 'Enter Picture-in-Picture';
//     // });