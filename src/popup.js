// ボタンをクリックした瞬間はそのページで動画をみたい可能性が高いので
// current page のvideoタグを探索すること
import Vue from 'vue'


const newVue = option => new Vue(option)
document.addEventListener('DOMContentLoaded', () => {
  newVue({
    el: '#app',
    data() {
      return {
        message: "Hello Vue!",
        items: [],
      };
    },
    mounted() {
      // this.bindVideoReferrer();
      const self = this;
      chrome.storage.local.get(["bindVideoReferrer"], function (result) {
        self.items = result.bindVideoReferrer;
        // TODO: setする部分リファクタできそう
        self.items.forEach((item, index) => {
          if (item.img === '' || item.img === undefined) {
            self.$set(self.items[index], 'backgroundColor', self.cssRGB([233, 233, 233]))
            self.$set(self.items[index], 'color', self.generatefontColor([255, 255, 255]))
            return
          }
          console.log(item.img);
          self
            .averageColorByImage(item.img)
            .then((i) => {
              self.$set(self.items[index], 'backgroundColor', self.cssRGBa(i, 0.8))
              self.$set(self.items[index], 'color', self.generatefontColor(i))
            })
            .catch((e) => {
              console.log(e);
              self.$set(self.items[index], 'backgroundColor', self.cssRGB([233, 233, 233]))
              self.$set(self.items[index], 'color', self.generatefontColor([255, 255, 255]))
            });
        });
        console.log('self.items :>> ', self.items);
      });
       
    },
    methods: {
      allTabsQuery(callback) {
        return chrome.tabs.query({}, callback);
      },
      tabsSendMessage(id, message, callback) {
        return chrome.tabs.sendMessage.apply(chrome, arguments);
      },
      bindVideoReferrer() {
        let self = this;
        chrome.storage.local.get(["bindVideoReferrer"], function (result) {
          self.items = result.bindVideoReferrer;
        });
      },
      averageColorByImage(src) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        return new Promise((resolve, reject) => {
          img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(
              0.1 * img.width,
              0.1 * img.height,
              0.9 * img.width,
              0.9 * img.height
            );
            let rgba = [0, 0, 0, 0];
  
            imageData.data.forEach((v, i) => {
              rgba[i % 4] = rgba[i % 4] + v;
            });
            const r = rgba[0] / (img.width * img.height);
            const g = rgba[1] / (img.width * img.height);
            const b = rgba[2] / (img.width * img.height);
            resolve([r, g, b]);
          };
          img.onerror = (e) => reject(e);
        });
      },
      rgbToHsl(rgb) {
        const r = rgb[0] / 255,
              g = rgb[1] / 255,
              b = rgb[2] / 255;
        const max = Math.max(r, g, b),
              min = Math.min(r, g, b);
        //  convert hsl
        let h, s, l = (max + min) / 2;
  
        if (max == min) {
          h = s = 0; // achromatic
        } else {
          const delta = max - min;
          s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
          switch (max) {
            case r:
              h = (g - b) / delta + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / delta + 2;
              break;
            case b:
              h = (r - g) / delta + 4;
              break;
          }
          h /= 6;
        }
        return [h, s, l];
      },
      hslToRgb(hsl) {
        const h = hsl[0],
          s = hsl[1],
          l = hsl[2];
        let r, g, b;
  
        if (s == 0) {
          r = g = b = l; // achromatic
        } else {
          function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          }
          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1 / 3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255];
      },
      generatefontColor(rgb) {
        let hsl = this.rgbToHsl(rgb);
        return this.cssRGB(
          this.hslToRgb([hsl[0], hsl[1], hsl[2] >= 0.5 ? 0.2 : 0.8])
        );
      },
      cssRGB(rgb) {
        return `rgb(${rgb.map((code) => Math.floor(code)).join(",")})`;
      },
      cssRGBa(rgb, oppacity) {
        return `rgba(${rgb
          .map((code) => Math.floor(code))
          .join(",")}, ${oppacity})`;
      },
    },
  });
  
})
