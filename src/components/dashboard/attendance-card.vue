<template>
  <div :class="color" class="card attendance-card">
    <div class="card-body">
      <div class="stat-widget-two">
        <div class="media">
          <div class="media-body text-center">
            <span class="att-title">{{ title }}</span>
            <h2 class="mt-0 mb-1 text-info">{{ total }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: "" },
    total: { type: String, default: "" },
    color: { type: String, default: "" }
  }
};
</script>

<style></style>
