<template>
  <GChart
    id="chartDiv"
    ref="chartDiv"
    type="GeoChart"
    :options="geoOptions"
    :data="geoData"
    :events="chartEvents"
    @ready="chartZooming"
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
    region: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      geoData: this.data,

      geoOptions: {
        region: this.region,
        resolution: "countries",
        colorAxis: { colors: ["#ca5363", "#f79b6e", "#f3d983", "#4e9265"] },
        backgroundColor: "#ffffff",
        datalessRegionColor: "#ffffff",
        defaultColor: "#ffffff",
        keepAspectRatio: false,
        enableRegionInteractivity: true,
        tooltip: {
          textStyle: { fontSize: 9 }
        },
        legend: {
          textStyle: { fontSize: this.region === "142" ? 6 : 12 }
        },
        displayMode: "auto"
      },
      countryLabels: [],
      chartEvents: {
        ready: () => {
          /* eslint-disable no-undef */
          this.addCountryLabels();
          this.fixLegend();

          $("#geoDatContainer").mousemove(async () => {
            this.fixLegend();
            if ($("#chartDiv .google-visualization-tooltip").length == 1) {
              await $("#toolTipContainer").removeClass("d-none");
              const toolTip = await $("#chartDiv .google-visualization-tooltip");
              let toolTipContent = "";
              toolTipContent = await toolTip[0].innerHTML;
              // console.log(toolTipContent);
              $("#toolTipContainer")[0].innerHTML = await toolTipContent;
              this.fixLegend();
            } else {
              $("#chartDiv .country-label").mouseleave(() => {
                $("#toolTipContainer").addClass("d-none");
              });
            }
          });

          $("#chartDiv .country-label").mousemove(async e => {
            await $("#toolTipContainer").removeClass("d-none");
            const selected = await e.target.innerHTML;
            let selectedData = [];
            this.geoData.forEach(function(data) {
              if (data[0] == selected) {
                selectedData = [...data];
              }
            });
            let toolTipContent = `
              <g><text font-weight="bold">${selected}</text></g>
              <g>
              	<text font-weight="bold">${this.addCommaSeparator(selectedData[2], false)}</text>
              </g>
            `;
            // console.log(toolTipContent);
            $("#toolTipContainer")[0].innerHTML = await toolTipContent;
          });

          if (this.geoOptions.region == "142") {
            $("#geoDatContainer").click(() => {
              if ($("#chartDiv .google-visualization-tooltip").length == 1) {
                const countryIdHovered = $(
                  "#chartDiv .google-visualization-tooltip > g:nth-child(2)"
                ).text();
                this.fixLegend();
                this.countrySelected(countryIdHovered);
              }
            });
            this.countryLabels.forEach(country => {
              $(`#${country.name}-label`).click(() => {
                this.countrySelected(country.name);
              });
            });
          } else {
            $("#geoDatContainer").off("click");
          }
          $("#geoDatContainer").mouseleave(() => {
            $("#toolTipContainer").addClass("d-none");
            this.fixLegend();
          });
        }
      }
    };
  },
  watch: {
    data: {
      deep: true,
      async handler(newValue) {
        this.geoData = await newValue;
        GChart.methods.drawChart();
      }
    },
    region: {
      deep: true,
      async handler(newValue) {
        newValue
          ? (this.geoOptions.region = await newValue)
          : (this.geoOptions.region = await "142");
        await GChart.methods.drawChart();
        this.chartZooming();
      }
    }
  },
  methods: {
    chartZooming() {
      /* eslint-disable no-undef */
      $(document).ready(async () => {
        if (this.geoOptions.region !== "142") {
          $("#chartDiv").removeClass("chartDivCap");
          $("#chartDiv").addClass("chartDivCountry");
        } else {
          $("#chartDiv").removeClass("chartDivCountry");
          $("#chartDiv").addClass("chartDivCap");
          this.fixLegend();
        }
      });
    },
    countrySelected(country) {
      this.$store.commit("DASHBOARD_COUNTRY_FILTER_SET", {
        name: country,
        value: country
      });
    },
    parseSVG(s) {
      var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + s + "</svg>";
      var frag = document.createDocumentFragment();
      while (div.firstChild.firstChild) frag.appendChild(div.firstChild.firstChild);
      return frag;
    },
    addCountryLabels() {
      this.countryLabels = [];
      if (this.region === "142") {
        this.countryLabels.push(
          { name: "MY", x: "327.683157", y: "270.881986" },
          { name: "ID", x: "327.683157", y: "291.881986" },
          { name: "VN", x: "350.68315744058015", y: "228.881985928951" },
          { name: "HK", x: "373.4", y: "194.881986" },
          { name: "TW", x: "399.683157", y: "189.881986" },
          { name: "TH", x: "322.4", y: "221.881986" },
          { name: "PH", x: "400.4", y: "221.881986" },
          { name: "SG", x: "333.683157", y: "279.881986" }
        );
      } else if (this.region === "MY") {
        this.countryLabels.push({ name: "MY", x: "400.4", y: "212.881986", fontSize: "12" });
      } else if (this.region === "ID") {
        this.countryLabels.push({ name: "ID", x: "228.4", y: "164.881986", fontSize: "12" });
      } else if (this.region === "VN") {
        this.countryLabels.push({ name: "VN", x: "316.4", y: "272.881986", fontSize: "12" });
      } else if (this.region === "HK") {
        this.countryLabels.push({ name: "HK", x: "275.4", y: "130.881986", fontSize: "12" });
      } else if (this.region === "TW") {
        this.countryLabels.push({ name: "TW", x: "333.4", y: "211.881986", fontSize: "12" });
      } else if (this.region === "TH") {
        this.countryLabels.push({ name: "TH", x: "273.4", y: "136.881986", fontSize: "12" });
      } else if (this.region === "PH") {
        this.countryLabels.push({ name: "PH", x: "344.4", y: "272.881986", fontSize: "12" });
      } else if (this.region === "SG") {
        this.countryLabels.push({ name: "SG", x: "250.4", y: "151.881986", fontSize: "12" });
      }
      const countryLabelsArray = this.countryLabels.map(ele => {
        return `<g><text text-anchor="middle" x="${ele.x}" y="${
          ele.y
        }" font-family="Arial" class="country-label" font-size="${
          ele.fontSize ? ele.fontSize : "6"
        }" stroke="none" stroke-width="0" fill="black" id="${ele.name}-label"
        >${ele.name}</text></g>`;
      });

      const countryLabels = `<g>${countryLabelsArray}</g>`;

      document
        .querySelector(
          "#chartDiv > div > div:nth-child(1) > div > svg > g:nth-child(2) > g:nth-child(2)"
        )
        .appendChild(this.parseSVG(countryLabels));
    },
    fixLegend() {
      // define an offset to move the legend by
      var offset = {
        x: 235,
        y: 6
      };
      // get the legend elements
      var rect = document.querySelector("#chartDiv svg > g:nth-child(2) > g:nth-child(3)");

      // move the legend
      if (this.region === "142") {
        rect.setAttribute("transform", "translate(" + offset.x + ", " + offset.y + ")");
      } else {
        rect.setAttribute("transform", "translate(" + (offset.x - 235) + ", " + offset.y + ")");
      }
    },
    addCommaSeparator(number, person) {
      if (!person) {
        if (number) {
          const rawNumber = number;
          return rawNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
          return 0;
        }
      } else {
        return number;
      }
    }
  }
};
</script>
<style lang="scss">
#chartDiv {
  .google-visualization-tooltip {
    visibility: hidden !important;
  }
  text {
    cursor: pointer;
  }
}
.chartDivCap {
  zoom: 1.3;
  transform: scale3d(1.6, 1.8, 1.6);
  transform-style: preserve-3d;
  transform-origin: 45em 26em;
}
.chartDivCountry {
  height: 350px;
}
</style>
