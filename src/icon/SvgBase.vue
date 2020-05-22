<template>
  <svg :viewBox="viewBox" :aria-labelledby="iconName" role="presentation">
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'open-tab'
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    width: {
      type: [Number, String],
      default: 30
    },
    height: {
      type: [Number, String],
      default: 30
    },
    iconColor: {
      type: String,
      default: '#fff'
    }
  },
  computed: {
    viewBox() {
      return `${this.x} ${this.y} ${this.width} ${this.height}`
    }
  },
  watch: {
    x() {
      console.log('this.ｘ :>>', this.ｘ)
    }
  }
}
</script>
