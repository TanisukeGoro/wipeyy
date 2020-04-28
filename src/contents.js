const currURL = window.location.toString();
const dotInstallURL = "https://dotinstall.com/lessons/";
// ポップアップのボタンのクリックに対してpipをスイッチするようにする。
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // run "picture In picture", when clicking the pip button.
  // When pip button again, became end the "picture in picture."
  if (request.sendCommand === "clickPipBtn") {
    operationVideo("pip-switch");
    return sendResponse({ farewell: `pip status : ${videoElem.pipStatus}` });
  }

  operationVideo(request.sendCommand);
  return sendResponse({farewell: `executed command :${request.sendCommand}`})
  
});


window.onload = function() {
  // 状態を確認してpipを自動スタート
  chrome.storage.local.get(["pipbtn"], function(btnState) {
    btnState.pipbtn
      ? operationVideo("pip-switch", false)
      : operationVideo("auto-play");
  });
};

// コマンドを受け付けて、それに対してビデオの操作を実現する
const operationVideo = (operationCommand, responseStatus = true) => {
  // videoタグを探索しておく。
  const isVideoElems = Array.from(document.querySelectorAll("video"))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0];
      const v2Rect = v1.getClientRects()[0];
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
    });

  
  if (isVideoElems.length === 0) return false;

  const isVideoElem = isVideoElems[0];
  console.log('isVideoElem :>>', isVideoElem)
  videoElem = new VideoRefer(isVideoElem);

  switch (operationCommand) {
    case "pip-switch":
      videoElem.pipStatus ? videoElem.stopPicInPic() : videoElem.goPicInPic();
      return responseStatus
        ? { farewell: `pip status : ${videoElem.pipStatus}` }
        : videoElem.goPlay();
    case "play-pause":
      !isVideoElem.paused ? videoElem.stopPlay() : videoElem.goPlay();
      return responseStatus && { farewell: `play status : ${videoElem.playStatus}` };
    case "previous-10sec":
      videoElem.backTenSec();
      return responseStatus && { farewell: "back status : isDone" };
    case "skip-10sec":
      videoElem.skipTenSec();
      return responseStatus && { farewell: "skip status : isDone" };
    case "auto-play":
      return videoElem.goPlay();
    default:
      return { farewell: "operation is nothing"}
  }
};

// Auto play the videoReference
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
  }

  /**
   * change chrome strage status
   * @function changeChromeStorage
   */
  changeChromeStorage = status => {
    this.pipStatus = status;
    chrome.storage.local.set({ pipbtn: status }, function() {});
  };

  /**
   * Unmuted the active video
   * @function unMuted
   */
  unMuted = () => (this.videoReference.muted = false);

  /**
   * muted the active video
   * @function muted
   */
  muted = () => (this.videoReference.muted = true);

  /**
   * Pley the active video
   * @function goPlay
   */
  goPlay = () =>
    this.videoReference
      .play()
      .then(() => (this.playStatus = true))
      .catch(() => console.error(" 再生されませんでした "));

  /**
   * Pause the active video
   * @function stopPlay
   */
  stopPlay = () => this.videoReference.pause();
  // .then(() => this.playStatus = false)
  // .catch(() => console.error(' 停止されませんでした '));

  /**
   * activate picture in picture
   * @function goPicInPic
   */
  goPicInPic = () =>
    // document.querySelector('video').requestPictureInPicture();
    this.videoReference
      .requestPictureInPicture()
      .then(() => this.changeChromeStorage(true))
      .catch(e => console.error(" Go PIP が実行されませんでした。", e));

  /**
   * unactivate picture in picture
   * @function stopPicInPic
   */
  stopPicInPic = () =>
    // document.exitPictureInPicture();
    document
      .exitPictureInPicture()
      .then(() => this.changeChromeStorage(false))
      .catch(e => console.error(" Stop PIP が実行されませんでした。", e));

  /**
   *
   */
  skipTenSec = () => (this.videoReference.currentTime += 10);

  /**
   *
   */
  backTenSec = () => (this.videoReference.currentTime -= 10);

  /**
   *
   */
  VideoAttached = () => {
    let listener = this.videoReference;
    // 動画が終了した時に実行されるイベント
    listener.addEventListener("ended", function() {
      // ドットインストールを開いているか判定してページ読み込み時の動作
      if (currURL.indexOf(dotInstallURL) === 0) {
        // chrome.storageの状態を取得
        chrome.storage.local.get(["cntbtn", "cnpbtn"], function(btnState) {
          // もし、連続再生がTrueなら次のページをクリック
          let cnpbtnTxt = document.querySelector("#completeButtonLabel")
            .textContent;
          btnState.cnpbtn &&
            cnpbtnTxt.trim() == "完了" &&
            document.querySelector("#lesson-complete-button").click();
          btnState.cntbtn &&
            document.querySelector("#go_to_next_video").click();
        });
      }
    });

    listener.addEventListener("play", function() {
      this.playStatus = true;
    });
    listener.addEventListener("stop", function() {
      this.playStatus = false;
    });
  };

  /**
   *
   */
  VideoBind = () => {
    document.pictureInPictureElement === null
      ? (this.pipStatus = false)
      : (this.pipStatus = true);
  };
}
