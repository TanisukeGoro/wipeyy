// ① background => contents_script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request)
  if (request.greeting == "hello") {
    return sendResponse({farewell: "response hello"})
  };
  if (request.call == "getVideos") {
    return sendResponse({farewell: getVideos(), id: request.id})
  };
});

const hasVideoTags = () => document.querySelectorAll('video').length

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getDoc') {
    return sendResponse(hasVideoTags());
  }
});