<template>
  <div id="country-target">
    <breadcrumb title="Dashboard" subtitle="Country Target" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="activeTab">
              <!-- <b-tab-item label="Monthly">
                <TargetCountryMonthlyData />
              </b-tab-item>-->
              <b-tab-item label="Weekly">
                <TargetCountryWeeklyData />
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
import TargetCountryWeeklyData from "./country_weekly";

export default {
  name: "TargetCountryData",
  components: {
    breadcrumb: breadcrumb,
    TargetCountryWeeklyData: TargetCountryWeeklyData
  },
  computed: {},
  data() {
    return {
      activeTab: 0
    };
  },
  methods: {},
  mounted() {}
};
</script>
