<template>
  <div id="promoter-target">
    <breadcrumb title="Dashboard" subtitle="Promoter Target" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="activeTab">
              <!-- <b-tab-item label="Monthly">
                <TargetPromoterMonthlyData :promoters="promoters" />
              </b-tab-item> -->
              <b-tab-item label="Weekly">
                <TargetPromoterWeeklyData :promoters="promoters" />
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

import TargetPromoterWeeklyData from "./promoter_weekly";
import { GET_ACTIVE_PROMOTERS_LIST_REQUEST } from "../../store/modules/staff/actions";

export default {
  name: "TargetPromoterData",
  components: {
    breadcrumb: breadcrumb,
    TargetPromoterWeeklyData: TargetPromoterWeeklyData
  },
  computed: {},
  data() {
    return {
      activeTab: 0,
      promoters: []
    };
  },
  methods: {
    getPromoters() {
      this.$store.dispatch(GET_ACTIVE_PROMOTERS_LIST_REQUEST).then(res => {
        if (res.resultCode === 0) {
          this.promoters = res.content;
        }
      });
    }
  },
  mounted() {
    this.getPromoters();
  }
};
</script>
