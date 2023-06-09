<template>
  <div id="dealer-incentive-entitlement">
    <breadcrumb title="Dashboard" subtitle="Dealer Incentive Entitlement" />

    <div class="row lnv-main-card">
      <div class="col-12 top-selection">
        <div
          v-for="(inc, index) in dealerIncentive"
          :key="'B' + index"
          class="border-primary card col-2 float-left"
          scope="col"
          :class="{ active: index === selectedIdx }"
          @click="changeIncentive(index)"
        >
          <div class="card-body p-3 text-center">
            <div
              class="h3 mb-1"
              :class="{
                'text-primary': index === selectedIdx,
                'text-success': index != selectedIdx
              }"
            >
              <span>{{ inc.currency }}</span> {{ inc.totalPayout }}
            </div>
            <div class="h4">{{ convertMonth(inc.month) }} {{ inc.year }}</div>
            <div class="h6">Total Incentive Payout</div>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row mb-2">
                <div v-if="dealerIncentive[selectedIdx].fileUrl" class="col-lg-12">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="downloadFile(dealerIncentive[selectedIdx])"
                  >
                    <i class="fa fa-file-excel-o mr-2"></i>
                    <span> Download Payment Advice</span>
                  </button>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="incentiveList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getDealerIncentiveList"
                  >
                    <template slot="sort-asc-icon">
                      <i class="mdi mdi-sort-ascending"></i>
                    </template>
                    <template slot="sort-desc-icon">
                      <i class="mdi mdi-sort-descending"></i>
                    </template>
                    <template slot="no-sort-icon">
                      <i class="mdi mdi-sort-variant"></i>
                    </template>
                    <template slot="empty-results">
                      <div class="bold-text">No Dealer Incentives Found!</div>
                    </template>

                    <template slot="startDate" slot-scope="props">
                      {{ props.row.startDate }} to {{ props.row.endDate }}
                    </template>

                    <template slot="view" slot-scope="props">
                      <div v-if="props.row.fileUrl !== null" class="inner-buttons float-left">
                        <button class="btn btn-primary" @click="downloadFile(props.row)">
                          <i class="fa fa-download"></i>
                          Download
                        </button>
                      </div>
                    </template>
                  </VueBootstrap4Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { convertDateFormat, urlValidate } from "../../utils/helpers";
import { Message } from "element-ui";
import { DEALER_INCENTIVE_LIST_REQUEST } from "../../store/modules/dealer/actions";

export default {
  name: "DealerIncentiveEntitlement",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table
  },
  computed: {},
  data: function() {
    return {
      dealerIncentive: [],
      incentiveList: [],
      selectedIdx: 0,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Dealer Incentive Entitlement",
        card_mode: false,
        show_refresh_button: true,
        show_reset_button: false,
        num_of_visibile_pagination_buttons: 5,
        per_page_options: [10, 25, 50, 100],
        per_page: 10,
        preservePageOnDataChange: true,
        pagination: true,
        pagination_info: true,
        multi_column_sort: false,
        global_search: {
          placeholder: "Search keyword",
          visibility: true,
          case_sensitive: false
        },
        highlight_row_hover_color: "grey"
      },
      queryParams: {
        sort: [],
        filters: [],
        global_search: "",
        per_page: 10,
        page: 1
      },
      classes: {
        tableWrapper: "table-responsive",
        table: {
          "table table-bordered": true,
          "table-bordered": function() {
            return true;
          }
        },
        row: {},
        cell: {}
      },
      columns: [
        {
          name: "id",
          label: "CID",
          sort: true,
          width: "8%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "incentiveName",
          label: "Incentive Program Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalUnit",
          label: "Total Unit",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalPayable",
          label: "Total Incentive Payable",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "startDate",
          label: "Start Date - End Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "view",
          label: "Action",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0
    };
  },
  methods: {
    async getDealerIncentiveList() {
      const res = await this.$store.dispatch(DEALER_INCENTIVE_LIST_REQUEST);
      if (res.resultCode === 0) {
        this.dealerIncentive = await res.content;
        this.incentiveList = await res.content[this.selectedIdx].incentiveList;
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerIncentiveList();
    },
    changeIncentive(idx) {
      this.selectedIdx = idx;
      this.incentiveList = this.dealerIncentive[idx].incentiveList;
    },
    convertMonth(m) {
      let mm = m > 9 ? "" + m : "0" + m;
      return convertDateFormat(mm, "MMM");
    },
    downloadFile(row) {
      // console.log(row);
      if (urlValidate(row.fileUrl)) {
        let fileLink = row.fileUrl;
        var win = window.open(fileLink, "_blank");
        win.focus();
      } else {
        return Message({
          message: "File not found",
          type: "error",
          duration: 5 * 1000
        });
      }
    }
  },
  mounted() {
    this.getDealerIncentiveList();
  }
};
</script>

<style lang="scss">
.top-selection {
  .card {
    max-width: 16%;
    margin-left: 0.25%;
    margin-right: 0.25%;
    cursor: pointer;

    &.active {
      box-shadow: 0 2rem 2rem rgba(0, 0, 0, 0.1);
      background-color: #fff6f6;
    }
  }
}
</style>
