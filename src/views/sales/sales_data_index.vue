<template>
  <div id="sales-data">
    <breadcrumb title="Dashboard" subtitle="Sales Validation" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="activeTab">
              <b-tab-item label="Sales Validation">
                <salesData />
              </b-tab-item>
              <!-- <b-tab-item label="Summary">
                <salesDataSummary />
              </b-tab-item>-->
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import salesData from "./sales_data";

export default {
  name: "SalesDataIndex",
  components: {
    breadcrumb: breadcrumb,
    salesData: salesData
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
