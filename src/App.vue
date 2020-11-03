<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="d-flex">
      <div class="browser-view" :style="{ backgroundColor: `${linkedTabId === item.tabId ? '#a6d06f' : ''}` }">
        <div class="menu-bar">
          <div class="col-left">
            <button class="dot delete-tab" @click="deleteTab(item)">
              <svg-base class="btn-svg" width="9" height="9" :icon-name="$i18n('L000003')"
                ><close icon-color="#000"
              /></svg-base>
            </button>
            <button class="dot minimize-tab">
              <svg-base class="btn-svg" width="9" height="9"><minimize icon-color="#000"/></svg-base>
            </button>
            <button class="dot open-tab" @click="openTab(item)">
              <svg-base class="btn-svg" width="9" height="9"><open-tab icon-color="#000"/></svg-base>
            </button>
            <img :src="item.favicon" alt="" class="favicon" />
          </div>
          <div class="col-middle">
            <p class="search-box">{{ item.url }}</p>
          </div>
          <div class="col-right">
            <svg-base><settings /></svg-base>
          </div>
        </div>
        <div class="container" :style="{ color: item.color }">
          <div class="media-artwork">
            <img :src="item.img" alt="" />
          </div>
          <div class="content">
            <h3>{{ item.title }}</h3>
            <div class="ml-20" @click="linkTabId(item.tabId)">
              {{ linkedTabId === item.tabId ? $i18n('L000002') : $i18n('L000001') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as imgClient from './utils/imgRenderClient'
import ExtensionService from './utils/ExtensionService'
import OpenTab from './components/icon/openTab.vue'
import Close from './components/icon/close.vue'
import Minimize from './components/icon/minimize.vue'
import Settings from './components/icon/settings.vue'
import SvgBase from './components/SvgBase.vue'

export default {
  components: {
    SvgBase,
    Settings,
    OpenTab,
    Close,
    Minimize
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
    chrome.storage.onChanged.addListener(function(changes) {
      for (var key in changes) {
        var storageChange = changes[key]
        if (key === 'bindVideoReferrer') self.items = storageChange.newValue
      }
    })
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
    deleteTab(item) {
      chrome.tabs.remove(item.tabId)
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
/* * {
  border: solid 0.1px red;
} */
.browser-view {
  width: 315px;
  height: 200px;
  border: solid #707070 0.5px;
}

.menu-bar {
  display: flex;
  background-color: #aaa;
  height: 32px;
  width: 100%;
}
.col-left {
  display: flex;
}

.col-middle {
  flex-grow: 2;
}

.col-right {
}

.dot {
  height: 15px;
  width: 15px;
  margin-top: 8px;
  margin-left: 5px;
  padding: 0;
  background-color: #bbb;
  border-radius: 50%;
  border: solid #707070 1px;
  display: inline-block;
}

.dot:focus {
  outline: none; /** FIXME: use focus-visible ? */
}

.btn-svg {
  margin-top: 2px;
  opacity: 0;
}

.col-left:hover .btn-svg {
  opacity: 1;
}

.favicon {
  vertical-align: middle;
  margin: 8px 5px;
  height: 15px;
}

.delete-tab {
  background-color: #ed594a;
}

.minimize-tab {
  background-color: #fdd800;
}

.open-tab {
  background-color: #5ac05a;
}

.search-box {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  width: 200px;
  background-color: #fff;
  padding-right: 10px;
  padding: 4px 10px 4px 4px;
  margin-top: 4px;
  border: solid #707070 1px;
}

.d-flex {
  padding: 6px 12px;
  /* border-radius: 5px; */
  display: flex;
  /* height: 180px; */
  /* margin-bottom: 10px; */
}

.container {
  position: relative;
  width: 315px;
  padding: 6px 0;
}

.media-artwork {
  z-index: 0;
  text-align: center;
}

.media-artwork img {
  object-fit: cover;
  margin: auto;
  width: 285px;
  height: 150px;
}

.content {
  position: absolute;
  z-index: 20;
  top: 10px;
  left: 30px;
}

.content h3 {
  width: 260px;
  margin: 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
