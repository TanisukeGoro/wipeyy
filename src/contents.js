import ExtensionService from './utils/ExtensionService'
import VideoRefer from './utils/VideoRefer'

// ① background => contents_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.sendCommand !== '' && request.sendCommand !== undefined) {
    console.log('request.sendCommand :>>', request.sendCommand)
    operationVideo(request.sendCommand)
    return sendResponse({ message: `response ${request.sendCommand}` })
  }
  if (request.call === 'hello') {
    return sendResponse({ message: 'response hello' })
  }
  if (request.call === 'getVideos') {
    return sendResponse({ message: getVideos(), id: request.id })
  }
  if (request.call === 'hasVideo') {
    return sendResponse({ message: hasVideoTags(), id: request.id })
  }
  if (request.call === 'querySelector') {
    const dom = document.querySelector(request.selector) || ''
    const html = dom !== '' ? dom.innerHTML : ''
    return sendResponse({ message: html })
  }
})

const hasVideoTags = () => document.querySelectorAll('video').length
const getVideos = () => 'ビデオ'

// コマンドを受け付けて、それに対してビデオの操作を実現する
const operationVideo = (operationCommand, responseStatus = true) => {
  ExtensionService.log('operationCommand')
  ExtensionService.log(operationCommand)
  // videoタグを探索しておく。
  const isVideoElems = Array.from(document.querySelectorAll('video'))
    .filter(video => video.readyState != 0)
    .filter(video => video.disablePictureInPicture == false)
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0]
      const v2Rect = v1.getClientRects()[0]
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height
    })

  if (isVideoElems.length === 0) return false

  const isVideoElem = isVideoElems[0]
  console.log('isVideoElem :>>', isVideoElem)
  const videoElem = new VideoRefer(isVideoElem)

  switch (operationCommand) {
    case 'pip-switch':
      console.log(videoElem.pipStatus)
      videoElem.pipStatus ? videoElem.stopPicInPic() : videoElem.goPicInPic()
      return responseStatus ? { farewell: `pip status : ${videoElem.pipStatus}` } : videoElem.goPlay()
    case 'play-pause':
      !isVideoElem.paused ? videoElem.stopPlay() : videoElem.goPlay()
      return responseStatus && { farewell: `play status : ${videoElem.playStatus}` }
    case 'previous-10sec':
      videoElem.backTenSec()
      return responseStatus && { farewell: 'back status : isDone' }
    case 'skip-10sec':
      videoElem.skipTenSec()
      return responseStatus && { farewell: 'skip status : isDone' }
    case 'auto-play':
      return videoElem.goPlay()
    default:
      return { farewell: 'operation is nothing' }
  }
}
