<template>
  <div id="promoter-leader-target">
    <breadcrumb title="Dashboard" subtitle="Promoter Leader Target" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="activeTab">
              <!-- <b-tab-item label="Monthly">

              </b-tab-item> -->
              <b-tab-item label="Weekly">
                <TargetLeaderPromoterWeeklyData :leaders="leaderList" />
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
import TargetLeaderPromoterWeeklyData from "./promoter_leader_weekly";
import { GET_STAFF_LIST_REQUEST } from "../../store/modules/staff/actions";

export default {
  name: "TargetPromoterLeaderData",
  components: {
    breadcrumb: breadcrumb,
    TargetLeaderPromoterWeeklyData: TargetLeaderPromoterWeeklyData
  },
  computed: {},
  data() {
    return {
      activeTab: 0,
      leaderList: []
    };
  },
  methods: {
    getLeaderList() {
      let pdata = { type: "leaders" };
      this.$store.dispatch(GET_STAFF_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.leaderList = res.content;
        }
      });
    }
  },
  mounted() {
    this.getLeaderList();
  }
};
</script>
