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


export default VideoRefer;