<template>
  <div
    id="no-data-card"
    :class="classes"
    class="d-flex align-items-center justify-content-center flex-column"
  >
    <div class="mb-2"><i class="fa fa-warning fa-5x text-danger"></i></div>
    <div>
      <h2>No data!</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoDataCard",

  props: {
    classes: { type: String, default: "" }
  }
};
</script>

<style>
#no-data-card {
  height: 350px;
}
</style>
