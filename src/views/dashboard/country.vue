<template>
  <div id="country-dashboard">
    <country-breadcrumb
      title="Dashboard"
      :subtitle="
        !country ? `Country ${this.$store.getters.getCountryCode} Dashboard` : `Country Dashboard`
      "
    />
    <div class="d-flex flex-column">
      <div class="d-flex d-xl-none justify-content-center">
        <div class="card mt-3 ml-3 mr-3 mb-1 rounded-0 border-primary w-100">
          <div class="card-body w-100 p-4">
            <b-tabs position="is-centered" class="block w-100">
              <b-tab-item label="TD">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      {{ topRowData ? topRowData.totalDealers : 0 }}
                    </div>
                    <div class="text-primary h5 whitespace-no-wrap">
                      Total Dealers
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="TIP">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      <span>$</span>
                      {{ abbreviateNumber(topRowData ? topRowData.totalIncentivePaid : 0) }}
                    </div>
                    <div class="text-primary h5 whitespace-no-wrap">
                      Total Incentive Paid
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="TP">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      {{ abbreviateNumber(topRowData ? topRowData.totalPromoters : 0, true) }}
                    </div>
                    <div class="text-primary h5 whitespace-no-wrap">
                      Total Promoters
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="TSA">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      <span>$</span>
                      {{ abbreviateNumber(topRowData ? topRowData.totalSalesAmount : 0) }}
                    </div>
                    <div class="text-primary h5 whitespace-no-wrap">
                      Total Sales Amount
                    </div>
                    <div class="text-primary h4 whitespace-no-wrap">
                      Target: ${{ abbreviateNumber(topRowData ? topRowData.salesAmountTarget : 0) }}
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="TSU">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      {{ abbreviateNumber(topRowData ? topRowData.totalSalesUnit : 0, true) }}
                    </div>
                    <div class="text-primary h5 whitespace-no-wrap">
                      Total Sales Unit
                    </div>
                    <div class="text-primary h4 whitespace-no-wrap">
                      Target:
                      {{ abbreviateNumber(topRowData ? topRowData.salesUnitTarget : 0, true) }}
                    </div>
                  </div>
                </div>
              </b-tab-item>
              <b-tab-item label="TSPA">
                <div class="m-3 rounded-0 border-primary">
                  <div
                    class="text-center d-flex align-items-center justify-content-center flex-column"
                  >
                    <div class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap">
                      {{ abbreviateNumber(topRowData ? topRowData.totalPendingApproval : 0, true) }}
                    </div>
                    <div class="text-primary h5 mb-3">
                      Total Salesperson Pending Approval
                    </div>
                  </div>
                </div>
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
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
                </div>
                <div class="d-none d-xl-flex mt-3 ml-3 mr-3 mb-1 justify-content-center">
                  <div class="card rounded-0 border-primary w-100 mb-0">
                    <div
                      class="card-body text-center p-4 d-flex align-items-center justify-content-center flex-column"
                    >
                      <div
                        class="text-success font-weight-normal display-5 mb-1 whitespace-no-wrap"
                      >
                        {{ abbreviateNumber(topRowData ? topRowData.totalDealers : 0, true) }}
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
                  <CountryYearToDate
                    v-if="activeTab === 0"
                    :filters.sync="filters"
                    :country.sync="countrySelectedComputed"
                  ></CountryYearToDate>
                </b-tab-item>
                <b-tab-item label="Quarter">
                  <CountryQuarter
                    v-if="activeTab === 1"
                    :filters.sync="quarterFilters"
                    :country.sync="countrySelectedComputed"
                  ></CountryQuarter>
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
import { CDASHBOARD_TOP_FILTERS_GET } from "../../store/modules/dashboard/actions";
import Multiselect from "vue-multiselect";
import CountryQuarter from "./country_quarter";
import CountryYearToDate from "./country_year";

export default {
  name: "Country",
  components: {
    "country-breadcrumb": breadcrumb,
    CountryQuarter,
    CountryYearToDate,
    Multiselect
  },
  computed: {
    country() {
      const id = this.$store.getters.getUserRole;
      if (id == "Regional") {
        return true;
      }
      return false;
    },
    unitCheck() {
      return this.filters.unitSelected.value == "amount";
    },
    topRowData() {
      return this.$store.getters.dashboardData.topRowData;
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
      ticket: "",
      activeTab: 1,
      yearOptions: [],
      quarterOptions: [],
      unitOptions: [],
      currencyOptions: [],
      filters: {
        countrySelected: this.$store.getters.getCountryCode,
        yearSelected: { name: "FY2021", value: "FY2021" },
        quarterSelected: { name: "Q1", value: "Q1" },
        unitSelected: { name: "Unit", value: "unit" },
        currencySelected: { name: "Local", value: "local" }
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
    async getFilters() {
      const res = await this.$store.dispatch(CDASHBOARD_TOP_FILTERS_GET);
      if (res.content) {
        this.yearOptions = await res.content.fiscalYearDropdown;
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
#country-dashboard {
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
