// ① background => contents_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
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
