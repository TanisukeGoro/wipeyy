<template>
  <svg width="24" height="24">
    <rect width="24" height="24" fill="none" rx="0" ry="0" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M21.4 9.80005H2.6C2.27 9.80005 2 10.07 2 10.4V13.6C2 13.93 2.27 14.2 2.6 14.2H21.4C21.73 14.2 22 13.93 22 13.6V10.4C22 10.07 21.73 9.80005 21.4 9.80005Z"
      :fill="iconColor"
    />
  </svg>
</template>

<script>
export default {
  props: {
    iconName: {
      type: String,
      default: 'settings'
    },
    width: {
      type: [Number, String],
      default: 16
    },
    height: {
      type: [Number, String],
      default: 16
    },
    iconColor: {
      type: String,
      default: '#fff'
    }
  }
}
</script>
