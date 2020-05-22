// ボタンをクリックした瞬間はそのページで動画をみたい可能性が高いので
// current page のvideoタグを探索すること
import Vue from 'vue'
import * as imgClient from './utils/imgRenderClient'
import ExtensionService from './utils/ExtensionService'
import openTab from './icon/openTab.vue'
import SvgBase from './icon/SvgBase.vue'

const newVue = option => new Vue(option)
document.addEventListener('DOMContentLoaded', () => {
  newVue({
    el: '#app',
    components: {
      SvgBase,
      openTab
    },
    data() {
      return {
        message: 'Hello Vue!',
        items: [],
        openTabIcon: ExtensionService.getResourceUrl('./icon/open-tab.png')
      }
    },
    created() {
      // this.bindVideoReferrer();
      const self = this
      chrome.storage.local.get(['bindVideoReferrer'], function(result) {
        self.items = result.bindVideoReferrer

        chrome.tabs.query({}, function(tabs) {
          // 存在しないタブがあるか検索
          const nilTabIds = self.items
            .map(tab => tab.tabId)
            .filter(n => {
              if (tabs.map(tab => tab.id).indexOf(n) === -1) return true
            })
          // 存在しないタブは削除
          // TODO: backgroundのタブを削除したところのコードと同じためまとめたい
          if (nilTabIds && nilTabIds.length) {
            nilTabIds.forEach(nilTab => {
              self.items.splice(self.tabIdindexOf(self.items, nilTab), 1)
              chrome.storage.local.set({ bindVideoReferrer: self.items }, function() {
                console.log('set self.items :>> ', self.items)
              })
            })
          }
          // 各動画の背景色と文字色を検索
          // TODO: setする部分リファクタできそう
          self.items.forEach((item, index) => {
            if (item.img === '' || item.img === undefined) {
              self.$set(self.items[index], 'backgroundColor', imgClient.cssRGB([233, 233, 233]))
              self.$set(self.items[index], 'color', imgClient.generatefontColor([255, 255, 255]))
              return
            }
            imgClient
              .averageColorByImage(item.img)
              .then(i => {
                const color = imgClient.rgba2hex(imgClient.generatefontColor(i))
                ExtensionService.log(color)
                self.$set(self.items[index], 'backgroundColor', imgClient.cssRGBa(i, 0.8))
                self.$set(self.items[index], 'color', color)
              })
              .catch(e => {
                ExtensionService.log(e)
                self.$set(self.items[index], 'backgroundColor', imgClient.cssRGB([233, 233, 233]))
                self.$set(self.items[index], 'color', imgClient.generatefontColor([255, 255, 255]))
              })
          })
        })
      })
    },
    methods: {
      openTab(item) {
        // TODO: null check
        chrome.tabs.query({ active: true, currentWindow: true }, function(tab) {
          if (tab[0].windowId == item.windowId) chrome.tabs.update(item.tabId, { active: true })
          return !0
        })
        chrome.windows.update(item.windowId, { focused: true }, function() {
          chrome.tabs.update(item.tabId, { active: true })
        })
      },
      tabIdindexOf: function(jsonObject, value) {
        return jsonObject.map(json => json.tabId).indexOf(value)
      },
      allTabsQuery(callback) {
        return chrome.tabs.query({}, callback)
      },
      bindVideoReferrer() {
        let self = this
        chrome.storage.local.get(['bindVideoReferrer'], function(result) {
          self.items = result.bindVideoReferrer
        })
      }
    }
  })
})
