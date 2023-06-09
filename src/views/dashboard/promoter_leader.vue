<template>
  <div id="pleader-dashboard">
    <breadcrumb title="Dashboard" subtitle="Promoter Leader Dashboard" />
    <!-- breadcrumb -->
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  }
};

export default {
  name: "PromoLeaderDashboard",
  components: {
    breadcrumb: breadcrumb
  },
  computed: {},
  data() {
    return {
      options
    };
  },
  methods: {},
  mounted() {},
  created() {}
};
</script>
