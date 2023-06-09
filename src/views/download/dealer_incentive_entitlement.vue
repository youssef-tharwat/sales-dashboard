<template>
  <div id="dealer-incentive-entitlement">
    <breadcrumb title="Dashboard" subtitle="Dealer Incentive Entitlement" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-3">
                <div class="form-group flex-grow-1">
                  <label class="text-label">Year</label>
                  <select
                    id="year"
                    v-model="selectedYear"
                    class="form-control"
                    @change="onYearChange($event)"
                  >
                    <option v-for="(year, index) of yearList" :key="index">
                      {{
                        year
                      }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <b-tabs v-model="activeTab">
              <b-tab-item label="Normal Incentive">
                <NormalIncentiveEntitlement :selected-year="selectedYear" />
              </b-tab-item>
              <b-tab-item label="Dealer Incentive">
                <DealerIncentiveEntitlement :selected-year="selectedYear" />
              </b-tab-item>
              <b-tab-item label="Bonus Incentive">
                <BonusIncentiveEntitlement :selected-year="selectedYear" />
              </b-tab-item>
              <b-tab-item label="Target Incentive">
                <TargetIncentiveEntitlement :selected-year="selectedYear" />
              </b-tab-item>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import BonusIncentiveEntitlement from "./incentive_entitlement/bonus_incentive";
import NormalIncentiveEntitlement from "./incentive_entitlement/normal_incentive";
import TargetIncentiveEntitlement from "./incentive_entitlement/target_incentive";
import DealerIncentiveEntitlement from "./incentive_entitlement/dealer_incentive";

export default {
  name: "IncentiveEntitlement",
  components: {
    breadcrumb: breadcrumb,
    DealerIncentiveEntitlement: DealerIncentiveEntitlement,
    BonusIncentiveEntitlement: BonusIncentiveEntitlement,
    TargetIncentiveEntitlement: TargetIncentiveEntitlement,
    NormalIncentiveEntitlement: NormalIncentiveEntitlement
  },
  computed: {},
  data() {
    return {
      activeTab: 0,
      selectedYear: null,
      yearList: []
    };
  },
  methods: {
    setDefaultData() {
      if (!this.selectedYear) {
        this.selectedYear = new Date().getFullYear().toString();
      }
    },
    onYearChange() {
      this.selectedYear = this.selectedYear.toString();
    },
    setYears() {
      const year = new Date().getFullYear() - 3;
      for (let i = 0; i <= 6; i++) {
        let yr = year + i;
        this.yearList.push(yr);
      }

      return this.yearList;
    }
  },
  mounted() {
    this.setYears();
    this.setDefaultData();
  }
};
</script>
