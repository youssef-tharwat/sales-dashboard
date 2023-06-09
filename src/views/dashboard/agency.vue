<template>
  <div id="agency-dashboard">
    <breadcrumb title="Dashboard" subtitle="Agency Dashboard" />
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
  name: "AgencyDashboard",
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
