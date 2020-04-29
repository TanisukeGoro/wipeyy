import ExtensionService from './utils/ExtensionService'
import VideoRefer from './utils/VideoRefer'


const currURL = window.location.toString();
const dotInstallURL = "https://dotinstall.com/lessons/";
// ポップアップのボタンのクリックに対してpipをスイッチするようにする。
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  ExtensionService.log('request start')
  ExtensionService.log(request)
  ExtensionService.log('request end')
  
  // run "picture In picture", when clicking the pip button.
  // When pip button again, became end the "picture in picture."
  if (request.sendCommand === "clickPipBtn") {
    operationVideo('pip-switch');
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
  ExtensionService.log('operationCommand')
  ExtensionService.log(operationCommand)
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
      console.log(videoElem.pipStatus)
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


