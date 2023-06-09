<template>
  <div class="error-content">
    <div class="card mb-0">
      <div class="card-body text-center">
        <h1
          class="error-text permission-denied-text text-primary"
          v-text="$ml.get('error_permission_denied')"
        ></h1>
        <p v-text="$ml.get('error_permission_denied_subtext')"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
