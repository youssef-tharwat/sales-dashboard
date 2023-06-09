<template>
  <div id="regional-dashboard">
    <regional-breadcrumb title="Dashboard" subtitle="Regional Dashboard" />
    <div class="d-flex flex-column">
      <div class="row lnv-main-card">
        <div class="col-lg-12">
          <div class="card rounded-0">
            <div class="card-body">
              <b-tabs v-model="activeTab">
                <div
                  class="d-flex flex-wrap align-items-center justify-content-end mt-3 ml-3 mr-3 mb-1 "
                >
                  <div class="ml-4 mb-3 mt-1">
                    <Multiselect
                      ref="country"
                      v-model="filters.countrySelected"
                      :searchable="false"
                      :options="countryOptions"
                      label="name"
                      track-by="value"
                      :loading="!countryOptions"
                      :allow-empty="false"
                      :show-labels="false"
                    ></Multiselect>
                  </div>
                  <div class="ml-4 mb-3 mt-1">
                    <Multiselect
                      ref="year"
                      v-model="filters.yearSelected"
                      :searchable="false"
                      :options="yearOptions"
                      label="name"
                      track-by="value"
                      :loading="!yearOptions"
                      :allow-empty="false"
                      :show-labels="false"
                    ></Multiselect>
                  </div>
                  <div v-if="activeTab === 1" class="ml-4 mb-3 mt-1">
                    <Multiselect
                      ref="quarter"
                      v-model="filters.quarterSelected"
                      :searchable="false"
                      :options="quarterOptions"
                      label="name"
                      track-by="value"
                      :loading="!quarterOptions"
                      :allow-empty="false"
                      :show-labels="false"
                    ></Multiselect>
                  </div>
                  <div class="ml-4 mb-3 mt-1">
                    <Multiselect
                      ref="unit"
                      v-model="filters.unitSelected"
                      :searchable="false"
                      :options="unitOptions"
                      label="name"
                      track-by="value"
                      :loading="!unitOptions"
                      :allow-empty="false"
                      :show-labels="false"
                    ></Multiselect>
                  </div>
                  <div class="ml-4 mb-3 mt-1">
                    <Multiselect
                      ref="currency"
                      v-model="filters.currencySelected"
                      :searchable="false"
                      :options="currencyOptions"
                      label="name"
                      track-by="value"
                      :loading="!currencyOptions"
                      :allow-empty="false"
                      :disabled="!unitCheck || isCap"
                      :show-labels="false"
                    ></Multiselect>
                  </div>
                </div>
                <div class="d-none d-xl-flex mt-3 ml-3 mr-3 mb-1 justify-content-center">
                  <div class="card rounded-0 border-primary w-100 mb-0">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        {{ topRowData ? topRowData.totalDealers : 0 }}
                      </div>
                      <div class="text-primary h5 mb-3 whitespace-no-wrap">
                        Total Dealers
                      </div>
                    </div>
                  </div>
                  <div class="card rounded-0 border-primary w-100 mb-0 ml-3">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        <span>$</span>
                        {{ abbreviateNumber(topRowData ? topRowData.totalIncentivePaid : 0) }}
                      </div>
                      <div class="text-primary h5 mb-3 whitespace-no-wrap">
                        Total Incentive Paid
                      </div>
                    </div>
                  </div>
                  <div class="card rounded-0 border-primary w-100 mb-0 ml-3">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        {{ abbreviateNumber(topRowData ? topRowData.totalPromoters : 0, true) }}
                      </div>
                      <div class="text-primary h5 mb-3 whitespace-no-wrap">
                        Total Promoters
                      </div>
                    </div>
                  </div>
                  <div class="card rounded-0 border-primary w-100 mb-0 ml-3">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        <span>$</span>
                        {{ abbreviateNumber(topRowData ? topRowData.totalSalesAmount : 0) }}
                      </div>
                      <div class="text-primary h5 mb-3 whitespace-no-wrap">
                        Total Sales Amount
                      </div>
                      <div class="text-primary h4 whitespace-no-wrap">
                        Target: ${{
                          abbreviateNumber(topRowData ? topRowData.salesAmountTarget : 0)
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="card rounded-0 border-primary w-100 mb-0 ml-3">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        {{ abbreviateNumber(topRowData ? topRowData.totalSalesUnit : 0, true) }}
                      </div>
                      <div class="text-primary h5 mb-3 whitespace-no-wrap">
                        Total Sales Unit
                      </div>
                      <div class="text-primary h4 whitespace-no-wrap">
                        Target:
                        {{ abbreviateNumber(topRowData ? topRowData.salesUnitTarget : 0, true) }}
                      </div>
                    </div>
                  </div>
                  <div class="card rounded-0 border-primary w-100 mb-0 ml-3">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        {{
                          abbreviateNumber(topRowData ? topRowData.totalPendingApproval : 0, true)
                        }}
                      </div>
                      <div class="text-primary h5 mb-3">
                        Total Pending Approval
                      </div>
                    </div>
                  </div>
                </div>
                <b-tab-item label="Year to Date">
                  <RegionalYearToDate
                    v-if="activeTab === 0"
                    :filters.sync="filters"
                    :country.sync="countrySelectedComputed"
                  ></RegionalYearToDate>
                </b-tab-item>
                <b-tab-item label="Quarter">
                  <RegionalQuarter
                    v-if="activeTab === 1"
                    :filters.sync="filters"
                    :country.sync="countrySelectedComputed"
                  ></RegionalQuarter>
                </b-tab-item>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import { DASHBOARD_TOP_ROW_DATA_GET } from "@/store/modules/dashboard/actions";
import { DASHBOARD_TOP_FILTERS_GET } from "../../store/modules/dashboard/actions";
import Multiselect from "vue-multiselect";
import RegionalQuarter from "./regional_quarter";
import RegionalYearToDate from "./regional_year";

export default {
  name: "Regional",
  components: {
    "regional-breadcrumb": breadcrumb,
    RegionalQuarter,
    RegionalYearToDate,
    Multiselect
  },
  computed: {
    unitCheck() {
      return this.filters.unitSelected.value == "amount";
    },
    topRowData() {
      return this.$store.getters.dashboardData.topRowData;
    },
    isCap() {
      return this.filters.countrySelected.value == "CAP";
    },
    countrySelectedComputed() {
      return this.$store.getters.topFilterCountryData;
    },
    quarterFilters() {
      if (this.filters.quarterSelected) {
        return this.filters;
      } else {
        let tempFilters = this.filters;
        tempFilters.quarterSelected = { name: "Q4", value: "Q4" };
        return tempFilters;
      }
    }
  },
  data() {
    return {
      url: "",
      urlParameters:
        "iframeSizedToWindow=true&:embed=y&:display_count=no&:showAppBanner=false&:showVizHome=no&:toolbar=no",
      ticket: "",
      renderComponent: true,
      activeTab: 1,
      yearOptions: [],
      quarterOptions: [],
      unitOptions: [],
      currencyOptions: [],
      countryOptions: [],
      filters: {
        countrySelected: this.$store.getters.topFilterCountryData,
        yearSelected: { name: "FY2021", value: "FY2021" },
        quarterSelected: { name: "Q1", value: "Q1" },
        unitSelected: { name: "Unit", value: "unit" },
        currencySelected: { name: "USD", value: "usd" }
      }
    };
  },
  methods: {
    abbreviateNumber(number) {
      if (number) {
        let SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
        // what tier? (determines SI symbol)
        let tier = (Math.log10(number) / 3) | 0;

        // if zero, we don't need a suffix
        if (tier == 0) return number;

        // get suffix and determine scale
        let suffix = SI_SYMBOL[tier];
        let scale = Math.pow(10, tier * 3);

        // scale the number
        let scaled = number / scale;

        // format number and add suffix
        return scaled.toFixed(2) + suffix;
      } else {
        return 0;
      }
    },
    async getTopRowData() {
      const userType = await this.$store.getters.getUserRole;
      const res = await this.$store.dispatch(DASHBOARD_TOP_ROW_DATA_GET, {
        type: userType.toUpperCase()
      });
      this.topRowData = res.content;
    },
    forceRerenderTableau() {
      this.renderComponent = false;
      this.tableauLogin();
      this.$nextTick(() => {
        this.renderComponent = true;
      });
    },
    async getFilters() {
      const res = await this.$store.dispatch(DASHBOARD_TOP_FILTERS_GET);
      if (res.content) {
        this.yearOptions = await res.content.fiscalYearDropdown;
        this.countryOptions = await res.content.countryDropdown;
        this.quarterOptions = await res.content.quarterDropdown;
        this.currencyOptions = await res.content.currencyDropdown;
        this.unitOptions = await res.content.typeDropdown;
      }
    }
  },
  mounted() {
    this.getFilters();
  }
};
</script>
<style lang="scss">
#regional-dashboard {
  .card {
    box-shadow: none !important;
  }
  .card:hover {
    box-shadow: none !important;
  }
  .page-titles {
    margin-bottom: 0;
  }
  .tabs li {
    padding: 0 0.5em;
  }
  .tab-content {
    padding: 0;
    .tab-item {
      display: flex;
      justify-content: center;
      height: auto !important;
      align-items: center;
    }
  }
  .tableau {
    iframe {
      width: 100%;
      height: 300vh;
      border: none;
      .tab-toolbar {
        display: none !important;
      }
    }
  }
  .multiselect__option--selected:after {
    display: none;
  }
  .multiselect__input,
  .multiselect__single {
    background: inherit;
  }
  .multiselect {
    min-width: 7em;
  }
}
</style>
