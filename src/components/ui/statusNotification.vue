<template>
  <div v-if="statusNotification.show" class="notices is-bottom">
    <div class="snackbar is-bottom-right" :class="statusNotification.type">
      <div class="text d-flex align-items-baseline">
        <div :class="statusNotification.isLoading ? 'mb-3 mr-4' : ''">
          {{ statusNotification.message }}
        </div>
        <div v-if="statusNotification.isLoading" class="d-flex">
          <SpringSpinner :size="25" color="#ff1d5e" />
        </div>
      </div>
      <div
        v-if="!statusNotification.indefinite"
        class="action"
        :class="statusNotification.type"
        @click="closeNotification()"
      >
        <button class="button text-white rounded">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import { NOTIFICATION_CLOSE } from "../../store/modules/ui/actions";
import { SpringSpinner } from "epic-spinners";
export default {
  name: "StatusNotification",
  components: {
    SpringSpinner
  },
  computed: {
    statusNotification() {
      return this.$store.getters.statusNotification;
    }
  },
  methods: {
    closeNotification() {
      this.$store.dispatch(NOTIFICATION_CLOSE);
    }
  },
  mounted() {
    let timer = this.$store.getters.statusNotification.timer;
    if (timer) {
      setInterval(() => {
        this.closeNotification();
      }, timer);
    }
  }
};
</script>

<style scoped>
.notices {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1060;
}
.is-success {
  background: #23d160 !important;
}
.is-danger {
  background: #ff3860 !important;
}
</style>
