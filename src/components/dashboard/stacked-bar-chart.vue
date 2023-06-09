<template>
  <GChart
    class="stacked-bar-chart"
    :class="{ gotLowerSection: gotLowerSection }"
    type="BarChart"
    :data="stackedbarData"
    :options="stackedbarOption"
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
    isStacked: { type: Boolean, default: false },
    productFilters: { type: Object, default: () => {} },
    gotLowerSection: { type: Boolean, default: false },
    lowerSectionId: { type: String, default: "" },
    chartLeft: { type: String, default: "0%" },
    maxCharacters: { type: Number, default: 10 }
  },
  computed: {
    chartAreaHeight() {
      return this.stackedbarData.length * 20;
    },
    chartHeight() {
      return this.chartAreaHeight + 80;
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
      stackedbarData: this.data,
      stackedbarOption: {},
      chartEvents: {
        ready: () => {
          if (this.gotLowerSection) {
            this.chartsFormatting();
          }
        }
      }
    };
  },
  watch: {
    data: {
      deep: true,
      async handler(newValue) {
        this.stackedbarData = await newValue;
        await this.formatData();
        await this.changeBarChartStructure();
        GChart.methods.drawChart();
      }
    },
    productFilters: {
      deep: true,
      async handler() {
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

        const maxCharacters = this.maxCharacters;

        const array = await $(".stacked-bar-chart g");

        for (var i = 0; i < array.length; i++) {
          var logicalname = array[i].logicalname;
          var text = $(array[i].children[0]);
          if (
            logicalname != null &&
            logicalname.indexOf("vAxis") == 0 &&
            logicalname.indexOf("label") > 0
          ) {
            if (text.text().length > maxCharacters) {
              text.text(text.text().substring(0, maxCharacters) + "...");
            }
            text.css("font-size", "1.2rem");
          }
        }

        // Fixing X-Axis to bar chart while scrolling
        const chart = await $(`#actual${this.lowerSectionId}`);
        $(`#${this.lowerSectionId}`)[0].innerHTML = chart.html();
        $(`#${this.lowerSectionId} > div`).css("position", "initial");
        $(`#${this.lowerSectionId}  > div > div:nth-child(1)`).addClass("stackedLowerBar");

        if (chart[0].scrollHeight <= chart.height()) {
          $(`#${this.lowerSectionId}`).css("opacity", 0);
        } else {
          chart.scroll(() => {
            if (chart[0].offsetHeight + chart[0].scrollTop >= chart[0].scrollHeight - 20) {
              $(`#${this.lowerSectionId}`).css("opacity", 0);
            } else {
              $(`#${this.lowerSectionId}`).css("opacity", 1);
            }
          });
        }
      });
    },
    async formatData() {
      const sData = this.stackedbarData;
      this.stackedbarData = await sData.map(data => {
        return data.map(value => {
          let type = typeof value;
          // console.log(type);
          if (type === "number") {
            return parseInt(parseFloat(value).toFixed(0));
          } else return value;
        });
      });
    },
    changeBarChartStructure() {
      if (this.gotLowerSection && !this.isStacked) {
        this.stackedbarOption = {
          title: this.title,
          height: this.chartHeight,
          chartArea: { width: "90%", left: this.chartLeft, height: this.chartAreaHeight },
          legend: { position: "bottom", maxLines: 3 },
          vAxis: {
            slantedText: true,
            textStyle: {
              fontSize: 2
            }
          },
          isStacked: true,
          fontSize: 12,
          colors: ["#4E79A7", "#F28E2B", "#9ACD32"]
        };
      } else if (!this.isStacked) {
        this.stackedbarOption = {
          title: this.title,
          height: this.chartHeight,
          chartArea: { width: "85%", left: this.chartLeft, height: this.chartAreaHeight },
          legend: { position: "none", maxLines: 3 },
          isStacked: true,
          vAxis: {
            slantedText: true,
            textStyle: {
              fontSize: 2
            }
          },
          fontSize: 12,
          colors: ["#4E79A7", "#F28E2B", "#9ACD32"]
        };
      } else {
        this.stackedbarOption = {
          title: this.title,
          height: this.chartHeight,
          chartArea: { width: "85%", left: this.chartLeft, height: this.chartAreaHeight },
          legend: { position: "none", maxLines: 3 },
          isStacked: true,
          vAxis: {
            slantedText: true,
            textStyle: {
              fontSize: 2
            }
          },
          fontSize: 12,
          colors: [
            "#f28e2b",
            "#59a14f",
            "#a0cbe8",
            "#4e79a7",
            "#d7b5a6",
            "#9d7660",
            "#d4a6c8",
            "#b07aa1",
            "#fabfd2",
            "#d37295",
            "#bab0ac",
            "#79706e",
            "#86bcb5",
            "#499894",
            "#8cd17d",
            "#f1ce63",
            "#b6992d"
          ]
        };
      }

      //formatting numbers
      this.formatData();
    },
    getMaximumCharacter(width) {
      if (width >= 2000) {
        return 16;
      } else if (width >= 1600) {
        return 13;
      } else {
        return 10;
      }
    }
  },
  mounted() {
    this.changeBarChartStructure();
  }
};
</script>
<style lang="scss">
.stacked-bar-chart {
  width: 100%;
  height: 20em;
}
.gotLowerSection {
  overflow-y: scroll !important;
  overflow-x: hidden !important;
  width: 100%;
  // height: 20em;
  height: 16em;
}
.stackedLowerBar {
  position: absolute !important;
  bottom: 4px;
}
</style>
