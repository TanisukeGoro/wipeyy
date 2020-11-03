<template>
  <svg :viewBox="viewBox" :aria-labelledby="iconName" role="presentation" :style="{ width: width, height: height }">
    <title :id="iconName" lang="en">{{ iconName }}</title>
    <g :fill="iconColor">
      <slot :icon-color="iconColor" />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    viewBox: { type: String, default: '0 0 24 24' },
    iconName: { type: String, default: '' },
    width: { type: [Number, String], default: 18 },
    height: { type: [Number, String], default: 18 },
    iconColor: { type: String, default: 'currentColor' }
  },
  mounted() {
    console.log('this.iconColor :>>', this.iconColor)
  }
}
</script>

<style scoped>
svg {
  vertical-align: text-top;
}
</style>
