<template>
  <GChart
    style="height:350px"
    type="ComboChart"
    :data="comboData"
    :options="isStacked ? comboOptions2 : comboOptions"
  />
</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  components: {
    GChart
  },
  props: {
    data: { type: Array, default: () => [] },
    title: { type: String, default: "" },
    color: { type: String, default: "" },
    isStacked: { type: Boolean, default: false }
  },
  computed: {},
  data() {
    return {
      comboData: this.data,
      comboOptions: {
        title: this.title,
        seriesType: "bars",
        series: {
          0: { color: "#4e79a7" },
          1: { type: "line", color: "#edc948" }
        },
        legend: { position: "bottom", alignment: "start" },
        chartArea: { left: "10%", width: "100%" },
        fontSize: 12
      },
      comboOptions2: {
        title: this.title,
        seriesType: "bars",
        isStacked: true,
        series: {},
        legend: { position: "bottom", alignment: "start" },
        chartArea: { left: "10%", width: "100%" },
        fontSize: 12
      }
    };
  },
  watch: {
    data: {
      deep: true,
      async handler(newValue) {
        this.comboData = await newValue;
        GChart.methods.drawChart();
      }
    },
    isStacked: {
      deep: true,
      async handler() {
        GChart.methods.drawChart();
      }
    }
  },
  methods: {},
  mounted() {
    if (this.isStacked) {
      this.comboOptions2.series[this.comboData[0].length - 2] = { type: "line", color: "#edc948" };
    }
  }
};
</script>
