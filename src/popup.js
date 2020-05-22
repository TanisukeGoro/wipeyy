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
        openTabIcon: ExtensionService.getResourceUrl('./icon/open-tab.png'),
        openTabColor: '#fff'
      }
    },
    mounted() {
      // this.bindVideoReferrer();
      const self = this
      chrome.storage.local.get(['bindVideoReferrer'], function(result) {
        self.items = result.bindVideoReferrer
        // TODO: setする部分リファクタできそう
        self.items.forEach((item, index) => {
          if (item.img === '' || item.img === undefined) {
            self.$set(self.items[index], 'backgroundColor', imgClient.cssRGB([233, 233, 233]))
            self.$set(self.items[index], 'color', imgClient.generatefontColor([255, 255, 255]))
            return
          }
          ExtensionService.log(item.img)
          imgClient
            .averageColorByImage(item.img)
            .then(i => {
              const color = imgClient.generatefontColor(i)
              ExtensionService.log(color)
              self.openTabColor = imgClient.rgba2hex(color)
              self.$set(self.items[index], 'backgroundColor', imgClient.cssRGBa(i, 0.8))
              self.$set(self.items[index], 'color', color)
            })
            .catch(e => {
              ExtensionService.log(e)
              self.$set(self.items[index], 'backgroundColor', imgClient.cssRGB([233, 233, 233]))
              self.$set(self.items[index], 'color', imgClient.generatefontColor([255, 255, 255]))
            })
        })
        ExtensionService.log(self.items)
      })
    },
    methods: {
      openTab(item) {
        // TODO: null check

        chrome.windows.update(item.windowId, { focused: true }, function() {
          chrome.tabs.update(item.tabId, { active: true })
        })
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
