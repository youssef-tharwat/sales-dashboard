<template>
  <div id="outlet-dashboard">
    <breadcrumb title="Dashboard" subtitle="Outlet Dashboard" />
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
  name: "OutletDashboard",
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
