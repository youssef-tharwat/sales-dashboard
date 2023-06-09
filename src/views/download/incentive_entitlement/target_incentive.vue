<template>
  <div id="target-incentive-entitlement">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="targetIncentiveList"
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getTargetIncentiveList"
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
            <div class="bold-text">No Incentive Found!</div>
          </template>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.id }}</span>
          </template>

          <template slot="Download" slot-scope="props">
            <div class="inner-buttons btn-group float-right" role="group">
              <button
                v-if="props.row.fileUrl"
                class="btn btn-warning btn-xs"
                @click="doDownload(props.row)"
              >
                <i class="fa fa-download"></i> Download
              </button>
            </div>
          </template>
        </VueBootstrap4Table>
      </div>
    </div>
  </div>
</template>

<script>
import Message from "element-ui";
import { export_json_to_excel } from "../../../utils/Export2Excel";
import VueBootstrap4Table from "../../../components/ui/VueBootstrap4Table";
import { convertDateFormat, urlValidate } from "../../../utils/helpers";
import { DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST } from "../../../store/modules/download/actions";

export default {
  name: "TargetIncentiveEntitlement",
  components: {
    VueBootstrap4Table: VueBootstrap4Table
  },
  props: {
    selectedYear: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      yearSelected: this.selectedYear,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Target Entitlements",
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
          label: "No",
          width: "5%",
          visibility: false,
          sort: true,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "duration",
          label: "Month",
          sort: true,
          width: "30%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "potentialReward",
          label: "Potential Incentive",
          sort: true,
          width: "30%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "payoutReward",
          label: "Pay-Out Incentive",
          sort: true,
          width: "30%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Download",
          label: "Download",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      targetIncentiveList: []
    };
  },
  watch: {
    selectedYear: function(valNew, valOld) {
      if (valOld != null) {
        if (valNew !== valOld) {
          this.yearSelected = valNew;
          this.getTargetIncentiveList();
        }
      }
    }
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getTargetIncentiveList();
    },
    getTargetIncentiveList() {
      if (!this.yearSelected) {
        this.yearSelected = new Date().getFullYear();
      }

      let pdata = {};
      pdata.appAccountId = this.$store.getters.getUserId;
      pdata.year = this.yearSelected;

      this.$store
        .dispatch(DOWNLOAD_TARGET_INCENTIVE_ENTITLEMENT_REQUEST, pdata)
        .then(res => {
          if (res.content && res.resultCode === 0) {
            // alert("a");
            this.targetIncentiveList = res.content;
            this.total = this.targetIncentiveList.length;
          }
        });
    },
    doDownload(row) {
      if (urlValidate(row.fileUrl)) {
        let fileLink = row.fileUrl;
        var win = window.open(fileLink, "_blank");
        win.focus();
      } else {
        return Message({
          message: " Target Incentive file not found",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    doExport() {
      const tHeader = [
        "Outlet Name",
        "Dealer Name",
        "Category",
        "State",
        "Area",
        "Postcode",
        "Address",
        "PIC Name"
      ];
      const filterVal = [
        "name",
        "dealerName",
        "type",
        "state",
        "area",
        "postCode",
        "address",
        "picName"
      ];
      const data = this.formatJson(filterVal, this.bonusIncentiveList);
      const fileName = "targetIncentiveEntitlement";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "sheet1",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
          } else {
            return v[j];
          }
        })
      );
    }
  },
  mounted() {
    this.getTargetIncentiveList();
  },
  created() {}
};
</script>
