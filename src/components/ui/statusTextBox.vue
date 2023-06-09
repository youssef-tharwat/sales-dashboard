<template>
  <div class="status_text_box">
    <span
      v-if="status === 'ACTIVE' && !active"
      class="label label-rounded label-success"
      v-text="$ml.get('active_status_text')"
    ></span>
    <span
      v-if="status === 'DEACTIVATED' && !active"
      class="label label-rounded label-danger"
      v-text="$ml.get('deactive_status_text')"
    ></span>

    <span
      v-if="status === 'Pending' && !active"
      class="label label-rounded label-warning"
      v-text="$ml.get('pending_status_text')"
    ></span>

    <span
      v-if="status === 'Approved' && !active"
      class="label label-rounded label-success"
      v-text="$ml.get('approve_status_text')"
    ></span>

    <span
      v-if="status === 'Rejected' && !active"
      class="label label-rounded label-danger"
      v-text="$ml.get('rejected_status_text')"
    ></span>

    <span
      v-if="active && !status"
      class="label label-rounded label-success"
      v-text="$ml.get('active_status_text')"
    ></span>
    <span
      v-if="!active && !status"
      class="label label-rounded label-danger"
      v-text="$ml.get('deactive_status_text')"
    ></span>
  </div>
</template>

<script>
export default {
  name: "LnvStatusTextBox",
  props: {
    status: { type: String, default: "" },
    active: { type: Boolean, default: false }
  },
  computed: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.status_text_box {
  width: 80px !important;
}

.status_text_box span {
  color: #ffffff !important;
}
</style>
