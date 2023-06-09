<template>
  <GChart
    class="bar-chart"
    :class="{ cap: maxHeight }"
    type="BarChart"
    :data="barData"
    :options="barOption"
    :events="chartEvents"
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
    cap: { type: Boolean, default: false },
    maxHeight: { type: Boolean, default: false },
    numberOfChartsPerRow: { type: Number, default: 2 },
    percent: { type: Boolean, default: false },
    lowerSectionId: { type: String, default: "" },
    chartLeft: { type: String, default: "0%" },
    maxCharacters: { type: Number, default: 10 }
  },
  computed: {
    chartAreaHeight() {
      return this.barData.length * 20;
    },
    chartHeight() {
      if (this.maxHeight) {
        return this.chartAreaHeight + 80;
      } else {
        return this.chartAreaHeight + 40;
      }
    },
    chartAreaWidth() {
      let chartAreaWidth = 0;
      if (this.numberOfChartsPerRow == 2) {
        chartAreaWidth = "100%";
      } else {
        chartAreaWidth = "40%";
      }
      return chartAreaWidth;
    },
    chartWidth() {
      let chartWidth = 0;
      if (this.numberOfChartsPerRow == 2) {
        chartWidth = 600;
      } else {
        chartWidth = 500;
      }
      return chartWidth;
    }
  },
  data() {
    return {
      barIsCap: this.cap,
      barData: this.data,
      barOption: {},
      windowWidth: 0,
      chartEvents: {
        ready: () => {
          this.chartsFormatting();
        }
      }
    };
  },
  watch: {
    data: {
      deep: true,
      async handler(newValue) {
        this.barData = await newValue;
        GChart.methods.drawChart();
      }
    },
    cap: {
      deep: true,
      async handler(newValue) {
        this.barIsCap = await newValue;
        await this.changeBarChartStructure();
        GChart.methods.drawChart();
      }
    }
  },
  methods: {
    async chartsFormatting() {
      /* eslint-disable no-undef */
      $(document).ready(async () => {
        // Removing excess letters from Y-Axis
        this.windowWidth = await window.innerWidth;

        // const maxCharacters = await this.getMaximumCharacter(this.windowWidth);

        let array = null;

        if (this.lowerSectionId) {
          array = await $(`#actual${this.lowerSectionId}  g`);
        } else {
          array = await $(".bar-chart g");
        }

        for (var i = 0; i < array.length; i++) {
          var logicalname = array[i].logicalname;
          var text = $(array[i].children[0]);
          if (
            logicalname != null &&
            logicalname.indexOf("vAxis") == 0 &&
            logicalname.indexOf("label") > 0
          ) {
            if (text.text().length > this.maxCharacters) {
              text.text(text.text().substring(0, this.maxCharacters) + "...");
            }
            text.css("font-size", "1.2rem");
          }
        }

        // Fixing X-Axis to bar chart while scrolling

        if (this.maxHeight) {
          const chart = await $(`#actual${this.lowerSectionId}`);
          $(`#${this.lowerSectionId}`)[0].innerHTML = chart.html();
          $(`#${this.lowerSectionId}`).css("position", "inherit");
          $(`#${this.lowerSectionId} > div`).css("position", "initial");
          $(`#${this.lowerSectionId}  > div > div:nth-child(1)`).addClass("stackedLowerBar");

          if (chart[0].scrollHeight <= chart.height()) {
            $(`#${this.lowerSectionId}`).hide();
          } else {
            chart.scroll(() => {
              if (chart[0].offsetHeight + chart[0].scrollTop >= chart[0].scrollHeight - 15) {
                $(`#${this.lowerSectionId}`).hide();
              } else {
                $(`#${this.lowerSectionId}`).show();
              }
            });
          }
        }
      });
    },
    changeBarChartStructure() {
      if (this.cap && this.maxHeight) {
        this.barOption = {
          chartArea: { width: "100%", left: this.chartLeft, height: this.chartAreaHeight },
          fontSize: 12,
          title: this.title,
          height: this.chartHeight,
          width: "100%",
          colors: ["#4e79a7"],
          legend: { position: "none" },
          vAxis: {
            slantedText: true,
            textStyle: {
              fontSize: 2
            }
          }
        };
      } else {
        this.barOption = {
          chartArea: {
            width: "100%",
            top: "1%",
            left: this.chartLeft,
            height: this.chartAreaHeight
          },
          title: this.title,
          colors: ["#4e79a7"],
          legend: { position: "none" },
          fontSize: 12,
          orientation: "vertical",
          height: this.chartHeight,
          width: "100%",
          vAxis: {
            slantedText: true,
            textStyle: {
              fontSize: 2
            }
          },
          hAxis: {}
        };
      }
      this.getxAxisFormat();
    },
    getMaximumCharacter(width) {
      if (this.maxHeight) {
        if (width >= 2000) {
          return 23;
        } else if (width >= 1600) {
          return 20;
        } else {
          return 20;
        }
      } else {
        if (width >= 2000) {
          return 16;
        } else if (width >= 1600) {
          return 13;
        } else {
          return 10;
        }
      }
    },
    getxAxisFormat() {
      if (this.percent) {
        this.barOption.hAxis = { baseline: 0, title: "Percent %" };
        GChart.methods.drawChart();
      } else {
        this.barOption.hAxis = { baseline: 0 };
      }
    }
  },
  mounted() {
    this.changeBarChartStructure();
  }
};
</script>
<style lang="scss">
.bar-chart {
  width: 100%;
  height: 20em;
}
.cap {
  overflow-y: scroll !important;
  overflow-x: hidden !important;
}
.stackedLowerBar {
  position: absolute !important;
  bottom: 4px;
}
</style>
