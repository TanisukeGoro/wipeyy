/*eslint no-unused-vars:*/
/**
 * Browser specific functions
 */
const ExtensionService = {
  /**
   * Send message to Extension background page
   * @param message
   * @param callback
   * @returns {*}
   */
  sendMessage: function(message, callback) {
    return chrome.runtime.sendMessage.apply(chrome, arguments)
  },

  tabsSendMessage: function(id, message, callback) {
    return chrome.tabs.sendMessage.apply(chrome, arguments)
  },

  getResourceUrl: function(resourceName) {
    return chrome.extension.getURL.apply(chrome, arguments)
  },

  /**
   * Get a tab that is already open
   * @param {Function} callback callback
   */
  allTabsQuery: function(callback) {
    return chrome.tabs.query({}, callback)
  },

  // こういうのcallbackが遅れてくるのでちゃんと返却されない
  currentTabQuery: function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(response) {
      console.log(response)
      return response[0]
    })
  },

  getLocalizedMessage: function(messageName) {
    //console.log("getLocalizedMessage", messageName);
    return chrome.i18n.getMessage.apply(chrome, arguments)
  },

  getChromeLocalStorage: function(key, callback) {
    return chrome.storage.local.get(key, callback)
  },

  setChromeLocalStorage: function(object, callback) {
    return chrome.storage.local.set(object, callback)
  },

  log: function(message) {
    const appDetailes = chrome.runtime.getManifest()
    let application = 'wipeyy '
    application += appDetailes.hasOwnProperty('version') && `[v${appDetailes.version}]`
    console.info(application, ':>> ', message)
  },
  /**
   * Incoming message from Extension background page
   */
  onMessage: {
    addListener: function(func) {
      chrome.runtime.onMessage.addListener.apply(chrome.runtime.onMessage, arguments)
    }
  }
}

export default ExtensionService
