<template>
  <div id="dealer-incentive-entitlement">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="dealerIncentiveList"
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
            <div class="bold-text">No Incentive Found!</div>
          </template>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.id }}</span>
          </template>

          <template slot="Download" slot-scope="props">
            <div class="inner-buttons btn-group float-right" role="group">
              <button
                class="btn btn-warning btn-xs"
                @click="doExport(props.row)"
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
import { export_json_to_excel } from "../../../utils/Export2Excel";
import VueBootstrap4Table from "../../../components/ui/VueBootstrap4Table";
import { convertDateFormat } from "../../../utils/helpers";

export default {
  name: "DealerIncentiveEntitlement",
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
        card_title: "Dealer Entitlements",
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
          sort: true,
          visibility: false,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "month",
          label: "Month",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "potentialIncentive",
          label: "Potential Incentive",
          sort: true,
          width: "30%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "payOutIncentive",
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
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      dealerIncentiveList: []
    };
  },
  watch: {
    selectedYear: function(valNew, valOld) {
      if (valOld != null) {
        if (valNew !== valOld) {
          this.yearSelected = valNew;
          this.getDealerIncentiveList();
        }
      }
    }
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerIncentiveList();
    },
    getDealerIncentiveList() {
      //   this.$store.dispatch(OUTLET_LIST_REQUEST, {}).then(res => {
      //     if (res.content && res.resultCode === 0) {
      //       this.bonusIncentiveList = res.content;
      //       this.total = this.bonusIncentiveList.length;
      //     }
      //   });
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
      const fileName = "dealerIncentiveEntitlement";
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
    this.getDealerIncentiveList();
  },
  created() {}
};
</script>
