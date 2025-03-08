/**
 * Chrome拡張機能のi18n APIをラップする簡単なユーティリティ
 */
export const getMessage = (messageName, ...args) => {
  return chrome.i18n.getMessage(messageName, ...args)
}

export default {
  getMessage
}
