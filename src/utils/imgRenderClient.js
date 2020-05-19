const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

export const hslToRgb = hsl => {
  const h = hsl[0],
    s = hsl[1],
    l = hsl[2]
  let r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [r * 255, g * 255, b * 255]
}

export const rgbToHsl = rgb => {
  const r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  //  convert hsl
  let h,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const delta = max - min
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / delta + 2
        break
      case b:
        h = (r - g) / delta + 4
        break
    }
    h /= 6
  }
  return [h, s, l]
}

export const averageColorByImage = src => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = src
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0.1 * img.width, 0.1 * img.height, 0.9 * img.width, 0.9 * img.height)
      let rgba = [0, 0, 0, 0]

      imageData.data.forEach((v, i) => {
        rgba[i % 4] = rgba[i % 4] + v
      })
      const r = rgba[0] / (img.width * img.height)
      const g = rgba[1] / (img.width * img.height)
      const b = rgba[2] / (img.width * img.height)
      resolve([r, g, b])
    }
    img.onerror = e => reject(e)
  })
}
/**
 * TODO: 本当は背景色からの透過を考慮しないと行けない
 * @param {String} rgba rgba(x,x,x,a)
 */
export const rgba2hex = rgba => {
  const rgb = rgba.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i) // rgba()を分離
  let alpha = ((rgb && rgb[4]) || '1').trim() // a がなければ 1 を設定
  let hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
      (rgb[2] | (1 << 8)).toString(16).slice(1) +
      (rgb[3] | (1 << 8)).toString(16).slice(1)
    : rgba

  // multiply before convert to HEX
  alpha = ((alpha * 255) | (1 << 8)).toString(16).slice(1) // 透過計算
  hex = '#' + hex + alpha

  return hex
}

export const generatefontColor = rgb => {
  let hsl = rgbToHsl(rgb)
  return cssRGB(hslToRgb([hsl[0], hsl[1], hsl[2] >= 0.5 ? 0.2 : 0.8]))
}
export const cssRGB = rgb => {
  return `rgb(${rgb.map(code => Math.floor(code)).join(',')})`
}
export const cssRGBa = (rgb, oppacity) => {
  return `rgba(${rgb.map(code => Math.floor(code)).join(',')}, ${oppacity})`
}
