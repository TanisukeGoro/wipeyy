// ボタンをクリックした瞬間はそのページで動画をみたい可能性が高いので
// current page のvideoタグを探索すること
import Vue from 'vue'
import App from './App.vue'

const newVue = option => new Vue(option)
document.addEventListener('DOMContentLoaded', () => {
  newVue({
    render: h => h(App)
  }).$mount('#app')
})
