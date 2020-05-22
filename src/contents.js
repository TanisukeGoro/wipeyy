// ① background => contents_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  if (request.call == 'hello') {
    return sendResponse({ farewell: 'response hello' })
  }
  if (request.call == 'getVideos') {
    return sendResponse({ farewell: getVideos(), id: request.id })
  }
  if (request.call == 'hasVideo') {
    return sendResponse({ farewell: hasVideoTags(), id: request.id })
  }
})

const hasVideoTags = () => document.querySelectorAll('video').length
