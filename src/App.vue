<script>
const default_layout = "admin";
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  }
};
</script>

<template>
  <div id="app">
    <component :is="layout">
      <router-view></router-view>
      <vue-progress-bar></vue-progress-bar>
      <status-notification></status-notification>
    </component>
  </div>
</template>

<style lang="scss">
@import url("./assets/styles/main.scss");
</style>
