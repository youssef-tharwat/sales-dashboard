<template>
  <div v-if="hasLoaded && !isLoading" class="row w-100">
    <!-- Geo chart -->
    <div
      id="geoDatContainer"
      class="col-lg-6 border d-flex align-items-center justify-content-center"
    >
      <div>
        <div id="toolTipContainer" class="border position-absolute d-none"></div>
        <div id="geoDataInfoContainer" class="border p-1 overflow-scroll position-absolute">
          <ul class="mb-0 d-flex">
            <li>
              <ul class="mr-2">
                <li><strong>Country</strong></li>
                <li v-for="(data, index) in dashboardData.heatMapTableData" :key="index">
                  <span>{{ data.country }}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul class="mr-2 text-right">
                <li><strong>Actual</strong></li>
                <li v-for="(data, index) in dashboardData.heatMapTableData" :key="index">
                  <span>{{ data.actual }}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul class="mr-2 text-right">
                <li><strong>Target</strong></li>
                <li v-for="(data, index) in dashboardData.heatMapTableData" :key="index">
                  <span>{{ data.target }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div id="geoHeatMapTitle" class="position-absolute">
          <span>
            <strong>{{ dashboardData.sOHeatMap.name }}</strong>
          </span>
        </div>
        <div>
          <geo-chart
            :cap.sync="isCap"
            :data.sync="dashboardData.sOHeatMap.data"
            :region.sync="sOHeatMapRegion"
          ></geo-chart>
        </div>
      </div>
    </div>

    <div class="col-lg-6 float-left border">
      <div class="mt-4 ml-2 mb-4 mb-4">
        <span>
          <strong>{{ dashboardData.actualSOBySubRegion.name }}</strong>
        </span>
      </div>
      <stacked-bar-chart
        id="actualsubRegionLowerSection"
        :got-lower-section="true"
        :data.sync="dashboardData.actualSOBySubRegion.data"
        lower-section-id="subRegionLowerSection"
        title=""
        chart-left="150"
        :max-characters="20"
      ></stacked-bar-chart>
      <div id="subRegionLowerSection"></div>
    </div>

    <!-- /Geo chart -->

    <!-- SO Charts(3) -->
    <div class="col-lg-12 p-0 ">
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.promoterSOPerformance.name }}</strong>
          </span>
        </div>
        <!-- <combo-bar-chart
          :data.sync="dashboardData.actualVsTarget.data"
          :title="''"
          :is-stacked.sync="isCap"
        ></combo-bar-chart> -->
        <combo-bar-chart
          :data.sync="dashboardData.promoterSOPerformance.data"
          :title="''"
        ></combo-bar-chart>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{
              dashboardData["sOPerformanceByPromoter/Salesperson/DealerVsTarget"]["name"]
            }}</strong>
          </span>
        </div>
        <combo-bar-chart
          :data.sync="dashboardData['sOPerformanceByPromoter/Salesperson/DealerVsTarget']['data']"
          :title="''"
          :is-stacked="true"
        ></combo-bar-chart>
      </div>
      <!-- <div class="col-lg-12 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.promoterSOPerformance.name }}</strong>
          </span>
        </div>
        <combo-bar-chart
          :data.sync="dashboardData.promoterSOPerformance.data"
          :title="''"
        ></combo-bar-chart>
      </div> -->
    </div>
    <!-- /SO Charts(3) -->

    <!-- Product Performance Charts(2) -->
    <div class="col-lg-12 border ">
      <div class="mt-4 ml-2 mb-4 d-flex align-items-center">
        <div class="mr-4">
          <span>
            <strong>{{ dashboardData.productPerformanceByCategory.name }}</strong>
          </span>
        </div>
        <div class="mr-4">
          <Multiselect
            ref="catbcs"
            v-model="productFilters.catbcsSelected"
            :searchable="false"
            :options="catbcsOptions"
            label="name"
            track-by="value"
            :loading="!catbcsOptions"
            :allow-empty="false"
            :show-labels="false"
            @input="getDashboardData"
          ></Multiselect>
        </div>
        <div>
          <Multiselect
            ref="catws"
            v-model="productFilters.catwsSelected"
            :searchable="false"
            :options="catwsOptions"
            label="name"
            track-by="value"
            :loading="!catwsOptions"
            :allow-empty="false"
            :show-labels="false"
            @input="getDashboardData"
          ></Multiselect>
        </div>
      </div>
      <div>
        <stacked-bar-chart
          id="actualproductPerformanceByCategoryLowerSection"
          :got-lower-section="true"
          :is-stacked="true"
          :data.sync="dashboardData.productPerformanceByCategory.data"
          title=""
          :product-filters.sync="productFilters"
          lower-section-id="productPerformanceByCategoryLowerSection"
          chart-left="10%"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="productPerformanceByCategoryLowerSection"></div>
      </div>
      <div class="mt-4">
        <b-tabs
          v-model="productPerformanceByCategoryActiveLegendTab"
          position="is-centered"
          size="is-small"
        >
          <b-tab-item
            v-for="(legend, index) in dashboardData.productPerformanceByCategory.customLegend"
            :key="index"
            :label="legend.category"
          >
            <b-taglist class="pt-3 pb-5">
              <b-tag
                v-for="(name, index2) in legend.productNames"
                :key="index2"
                size="is-medium"
                type="is-white"
                :style="`background: ${name.color}`"
                class="mr-2"
              >
                {{ name.name }}
              </b-tag>
            </b-taglist>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <div class="col-lg-12 border ">
      <div class="mt-4 ml-2 mb-4 d-flex align-items-center">
        <div class="mr-4">
          <span>
            <strong>{{ dashboardData.productPerformanceByComponent.name }}</strong>
          </span>
        </div>
        <div class="mr-4">
          <Multiselect
            ref="cmpbcs"
            v-model="productFilters.cmpbcsSelected"
            :searchable="false"
            :options="cmpbcsOptions"
            label="name"
            track-by="value"
            :loading="!cmpbcsOptions"
            :allow-empty="false"
            :show-labels="false"
            @input="getDashboardData"
          ></Multiselect>
        </div>
        <div class="mr-4">
          <Multiselect
            ref="cmps"
            v-model="productFilters.cmpsSelected"
            :searchable="false"
            :options="cmpsOptions"
            label="name"
            track-by="value"
            :loading="!cmpsOptions"
            :allow-empty="false"
            :show-labels="false"
            @input="getDashboardData"
          ></Multiselect>
        </div>
        <div>
          <Multiselect
            ref="cmpws"
            v-model="productFilters.cmpwsSelected"
            :searchable="false"
            :options="cmpwsOptions"
            label="name"
            track-by="value"
            :loading="!cmpwsOptions"
            :allow-empty="false"
            :show-labels="false"
            @input="getDashboardData"
          ></Multiselect>
        </div>
      </div>
      <div>
        <stacked-bar-chart
          id="actualproductPerformanceByComponentLowerSection"
          :got-lower-section="true"
          :is-stacked="true"
          :data.sync="dashboardData.productPerformanceByComponent.data"
          title=""
          :product-filters.sync="productFilters"
          lower-section-id="productPerformanceByComponentLowerSection"
          chart-left="10%"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="productPerformanceByComponentLowerSection"></div>
      </div>
      <div class="mt-4">
        <b-tabs
          v-model="productPerformanceByComponentActiveLegendTab"
          position="is-centered"
          size="is-small"
        >
          <b-tab-item
            v-for="(legend, index) in dashboardData.productPerformanceByComponent.customLegend"
            :key="index"
            :label="legend.category"
          >
            <b-taglist class="pt-3 pb-5">
              <b-tag
                v-for="(name, index2) in legend.productNames"
                :key="index2"
                size="is-medium"
                type="is-white"
                :style="`background: ${name.color}`"
              >
                {{ name.name }}
              </b-tag>
            </b-taglist>
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
    <!-- /Product Performance Charts(2) -->

    <!-- Performance Charts(3) -->
    <div class="col-lg-12 p-0">
      <div class="col-lg-6 float-left border ">
        <div class="mt-4 ml-2 mb-4 mb-4">
          <span>
            <strong>{{ dashboardData.dealersPerformance.name }}</strong>
          </span>
        </div>

        <stacked-bar-chart
          id="actualtop10dealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.dealersPerformance.data"
          title=""
          lower-section-id="top10dealersLowerSection"
          chart-left="160"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="top10dealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border ">
        <div class="mt-4 ml-2 mb-4 mb-4">
          <span>
            <strong>{{ dashboardData.outletsPerformance.name }}</strong>
          </span>
        </div>

        <stacked-bar-chart
          id="actualtop10outletsLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.outletsPerformance.data"
          lower-section-id="top10outletsLowerSection"
          title=""
          chart-left="160"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="top10outletsLowerSection"></div>
      </div>
      <div class="col-lg-12 float-left border ">
        <div class="mt-4 ml-2 mb-4 mb-4">
          <span>
            <strong>{{ dashboardData.promoterPerformance.name }}</strong>
          </span>
        </div>
        <!-- <bar-chart
          id="actualpromoterSOPerformanceLowerSection"
          :data.sync="dashboardData.promoterSOPerformance.data"
          :title="''"
          color="#b07aa1"
          :cap.sync="isCap"
          :percent="true"
          :max-height="true"
          lower-section-id="promoterSOPerformanceLowerSection"
          chart-left="160"
          :max-characters="20"
        ></bar-chart> -->
        <stacked-bar-chart
          id="actualpromoterPerformanceLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.promoterPerformance.data"
          lower-section-id="promoterPerformanceLowerSection"
          title=""
          chart-left="160"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="promoterPerformanceLowerSection"></div>
      </div>
    </div>
    <!-- /Performance Charts(3) -->

    <!-- Top 10 Dealers' Charts(8) -->
    <div class="col-lg-12 p-0  mt-4">
      <h4>Top Dealers</h4>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.malaysia.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualmytopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.malaysia.data"
          title=""
          chart-left="160"
          lower-section-id="mytopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="mytopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.indonesia.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualidtopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.indonesia.data"
          title=""
          chart-left="160"
          lower-section-id="idtopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="idtopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.philippines.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualphtopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.philippines.data"
          title=""
          chart-left="160"
          lower-section-id="phtopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="phtopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.thailand.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualthtopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.thailand.data"
          title=""
          chart-left="160"
          lower-section-id="thtopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="thtopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.singapore.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualsgtopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.singapore.data"
          title=""
          chart-left="160"
          lower-section-id="sgtopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="sgtopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.taiwan.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualtwtopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.taiwan.data"
          title=""
          chart-left="160"
          lower-section-id="twtopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="twtopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.vietnam.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualvntopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.vietnam.data"
          title=""
          chart-left="160"
          lower-section-id="vntopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="vntopdealersLowerSection"></div>
      </div>
      <div class="col-lg-6 float-left border">
        <div class="mt-4 ml-2 mb-4">
          <span>
            <strong>{{ dashboardData.hongKong.name }}</strong>
          </span>
        </div>
        <stacked-bar-chart
          id="actualhktopdealersLowerSection"
          :got-lower-section="true"
          :data.sync="dashboardData.hongKong.data"
          title=""
          chart-left="160"
          lower-section-id="hktopdealersLowerSection"
          :max-characters="20"
        ></stacked-bar-chart>
        <div id="hktopdealersLowerSection"></div>
      </div>
    </div>
    <!-- /Top 10 Dealers' Charts(8) -->
  </div>
</template>

<script>
import geoChart from "../../components/dashboard/geo-chart";
import stackedbarChart from "../../components/dashboard/stacked-bar-chart";
import comboChart from "../../components/dashboard/combo-chart";
import Multiselect from "vue-multiselect";

import {
  REGIONAL_DASHBOARD_DATA_GET,
  DASHBOARD_PRODUCT_FILTERS_GET,
  DASHBOARD_COMPONENT_FILTERS_GET
} from "../../store/modules/dashboard/actions";

export default {
  name: "RegionalQuarter",
  components: {
    "geo-chart": geoChart,
    "stacked-bar-chart": stackedbarChart,
    "combo-bar-chart": comboChart,
    Multiselect
  },
  props: {
    filters: { type: Object, default: () => {} },
    country: { type: Object, default: () => {} }
  },
  computed: {
    hasLoaded() {
      const dashboardData = Object.keys(this.dashboardData).length !== 0;

      const localFilters = Object.keys(this.localFilters).length !== 0;
      const productFilters = Object.keys(this.productFilters).length !== 0;

      const catbcsOptions = Object.keys(this.catbcsOptions).length !== 0;
      const catwsOptions = Object.keys(this.catwsOptions).length !== 0;
      const cmpbcsOptions = Object.keys(this.cmpbcsOptions).length !== 0;
      const cmpsOptions = Object.keys(this.cmpsOptions).length !== 0;
      const cmpwsOptions = Object.keys(this.cmpwsOptions).length !== 0;

      if (
        dashboardData &&
        localFilters &&
        productFilters &&
        catbcsOptions &&
        catwsOptions &&
        cmpbcsOptions &&
        cmpsOptions &&
        cmpwsOptions
      ) {
        this.$Progress.finish();
        return true;
      }
      return false;
    },
    sOHeatMapRegion() {
      return this.dashboardData.sOHeatMap.data.length == 2
        ? this.dashboardData.sOHeatMap.data[1][0]
        : "142";
    },
    isCap() {
      return this.dashboardData.sOHeatMap.data.length == 2 ? false : true;
    }
  },
  data() {
    return {
      isLoading: true,
      dashboardData: {},
      catbcsOptions: [],
      catwsOptions: [],
      cmpbcsOptions: [],
      cmpsOptions: [],
      cmpwsOptions: [],
      productFilters: {
        cmpsSelected: { name: "CPU", value: "CPU" },
        cmpbcsSelected: { name: "MOB", value: "MOB" },
        cmpwsSelected: { name: "ALL", value: "" },
        catbcsSelected: { name: "MOB", value: "MOB" },
        catwsSelected: { name: "ALL", value: "" }
      },
      localFilters: this.filters,
      productPerformanceByCategoryActiveLegendTab: 0,
      productPerformanceByComponentActiveLegendTab: 0
    };
  },
  watch: {
    filters: {
      deep: true,
      async handler(newValue) {
        this.filters = await newValue;
        await this.getDashboardData();
      }
    },
    country: {
      deep: true,
      async handler(newValue) {
        this.localFilters.countrySelected = await newValue;
        this.getDashboardData();
      }
    }
  },
  methods: {
    async getDashboardData() {
      if (!this.filters.quarterSelected) {
        this.filters.quarterSelected = await { name: "Q1", value: "Q1" };
      }
      this.isLoading = true;
      await this.$store.dispatch(REGIONAL_DASHBOARD_DATA_GET, {
        grouping: "quarterly",
        filters: this.localFilters,
        productFilters: this.productFilters
      });
      this.dashboardData = this.$store.getters.dashboardData;
      this.isLoading = false;
    },
    async getProductPerformanceDropDowns() {
      const res = await this.$store.dispatch(DASHBOARD_PRODUCT_FILTERS_GET);
      this.catbcsOptions = await res.content.brandCode;
      this.catwsOptions = await res.content.week;
    },
    async getComponentPerformanceDropDowns() {
      const res = await this.$store.dispatch(DASHBOARD_COMPONENT_FILTERS_GET);
      this.cmpbcsOptions = await res.content.brandCode;
      this.cmpsOptions = await res.content.componentCode;
      this.cmpwsOptions = await res.content.week;
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
  },
  mounted() {
    this.isLoading = true;
    this.getProductPerformanceDropDowns();
    this.getComponentPerformanceDropDowns();
    this.getDashboardData();
    this.isLoading = false;
  }
};
</script>
<style lang="scss">
#geoDatContainer {
  overflow: hidden;
  #geoDataInfoContainer {
    background: white;
    height: fit-content;
    width: fit-content;
    z-index: 1;
    right: 0;
    bottom: 0;
    li {
      font-size: 1rem;
    }
  }
  #toolTipContainer {
    g {
      display: flex;
      align-items: center;
      text:first-child {
        margin-right: 0.5em;
        font-weight: bold;
        font-size: 12px;
      }
    }
    z-index: 1;
    background: white;
    border: solid 1px #bdbdbd;
    border-radius: 2px;
    background-color: white;
    box-shadow: 0px 2px 2px 0px rgba(204, 204, 204, 0.6);
    font-size: 12px;
    padding: 0.5em 1em;
    -moz-box-shadow: 0px 2px 2px 0px rgba(204, 204, 204, 0.6);
    -webkit-box-shadow: 0px 2px 2px 0px rgba(204, 204, 204, 0.6);
    position: absolute;
    top: 0;
    right: 0;
  }
  #geoHeatMapTitle {
    z-index: 1;
    left: 0;
    margin-left: 1em;
    margin-top: 1em;
  }
}
#subRegionLowerSection,
#promoterPerformanceLowerSection,
#top10subRegionLowerSection,
#top10dealersLowerSection,
#top10outletsLowerSection,
#productPerformanceByCategoryLowerSection,
#productPerformanceByComponentLowerSection,
#mytopdealersLowerSection,
#idtopdealersLowerSection,
#phtopdealersLowerSection,
#thtopdealersLowerSection,
#sgtopdealersLowerSection,
#twtopdealersLowerSection,
#vntopdealersLowerSection,
#hktopdealersLowerSection {
  position: relative;
  overflow: hidden;
  height: 40px;
}
#actualsubRegionLowerSection {
  height: 350px;
}
</style>
