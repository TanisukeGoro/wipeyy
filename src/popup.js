// ボタンをクリックした瞬間はそのページで動画をみたい可能性が高いので
// current page のvideoタグを探索すること
import Vue from 'vue'
import App from './App.vue'
import i18n from 'vue-plugin-webextension-i18n'
Vue.use(i18n)

const newVue = option => new Vue(option)
document.addEventListener('DOMContentLoaded', () => {
  newVue({
    render: h => h(App)
  }).$mount('#app')
})
