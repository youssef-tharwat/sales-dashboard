<template>
  <div class="footer">
    <div class="copyright">
      <p>
        Powered by
        <a href="http://globalline.my" target="_blank">Global Line Networks</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer {
  z-index: 90;
}
</style>
