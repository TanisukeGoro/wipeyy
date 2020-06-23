<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="index"
      class="d-flex"
      :style="{ backgroundColor: `${linkedTabId === item.tabId ? '#a6d06f' : ''}` }"
    >
      <div
        class="img-cover"
        :style="{
          backgroundImage: `linear-gradient(${item.backgroundColor}, ${item.backgroundColor}), url('${item.img}')`,
          color: item.color
        }"
      >
        <div class="ml-20 pointer" @click="openTab(item)">
          <h3>
            <svg-base :icon-color="item.color"><open-tab /></svg-base>{{ item.title }}
          </h3>
          <img class="icon" :src="item.favicon" />
          <div class="site">{{ item.siteName }}</div>
        </div>
        <div class="ml-20" @click="linkTabId(item.tabId)">
          {{ linkedTabId === item.tabId ? 'この動画をリンク中です' : 'この動画をリンクする' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as imgClient from './utils/imgRenderClient'
import ExtensionService from './utils/ExtensionService'
import openTab from './icon/openTab.vue'
import SvgBase from './icon/SvgBase.vue'

export default {
  components: {
    SvgBase,
    openTab
  },
  data() {
    return {
      message: 'Hello Vue!',
      items: [],
      openTabIcon: ExtensionService.getResourceUrl('./icon/open-tab.png'),
      linkedTabId: ''
    }
  },
  created() {
    // this.bindVideoReferrer();
    const self = this
    chrome.storage.local.get(['linkedTabId'], function(result) {
      console.log('tabId :>>', result)
      self.linkedTabId = result.linkedTabId
    })
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
    },
    linkTabId(id) {
      console.log('id :>>', id)
      const self = this
      chrome.storage.local.set({ linkedTabId: id }, function() {
        self.linkedTabId = id
      })
    }
  }
}
</script>

<style>
.d-flex {
  padding: 3px;
  border-radius: 5px;
  display: flex;
  height: 150px;
  /* margin-bottom: 10px; */
}

.img-cover {
  background-size: 100%;
  width: 100%;
  background-position: center;
}
.title {
  width: 300px;
}
.ml-20 {
  margin-left: 20px;
}
h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}
.pointer {
  cursor: pointer;
}

p.siteest3:before {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  background-size: contain;
}
.site {
  vertical-align: middle;
  display: inline;
}
.icon {
  vertical-align: middle;
  height: 16px;
}
svg {
  height: 1rem;
  width: 1rem;
  vertical-align: text-bottom;
}
</style>
