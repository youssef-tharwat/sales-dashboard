<template>
  <div id="notification">
    <a class="link">
      <span v-if="type == '1'" class="mr-3 avatar-icon bg-success-lighten-2">
        <i class="fa fa-check"></i>
      </span>
      <div class="notification-content">
        <div class="notification-heading">{{ from }}</div>
        <span class="notification-text">{{ title }}</span>
        <small class="notification-timestamp">{{ time }}</small>
      </div>
    </a>
    <span class="notify-close">
      <i class="ti-close"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    type: { type: String, default: "" },
    from: { type: String, default: "" },
    time: { type: String, default: "" }
  }
};
</script>

<style></style>
