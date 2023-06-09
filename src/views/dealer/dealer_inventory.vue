<template>
  <div id="dealer_inventory">
    <breadcrumb title="Dashboard" subtitle="Dealer Inventory" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-12 d-flex align-items-center">
                <div class="w-100">
                  <Multiselect
                    v-model="dealerSelected"
                    v-validate="'required'"
                    name="Dealer"
                    :open-direction="'bottom'"
                    :loading="!dealerList"
                    :disabled="!dealerList"
                    track-by="id"
                    label="dealerName"
                    placeholder="Select Dealer"
                    :options="dealerList"
                    :searchable="true"
                    :allow-empty="false"
                    @input="getDealerStockList"
                  ></Multiselect>
                  <span class="invalid-field mt-2">{{
                    errors.first("Dealer")
                  }}</span>
                  <span
                    v-if="dealerListErrors.dealer"
                    class="invalid-field mt-2"
                  >
                    {{ dealerListErrors.dealer }}
                  </span>
                </div>
                <div class="ml-4">
                  <button
                    :disabled="
                      dealerSelected.length <= 0 ||
                        dealerStockDownloadContent.length <= 0
                    "
                    type="button"
                    class="btn btn-xs btn-primary"
                    @click="downloadDealerList"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <VueBootstrap4Table
                  :classes="classes"
                  :rows="dealerStockList"
                  :columns="columns"
                  :config="config"
                  :total-rows="dealerStockList.length"
                  @on-change-query="onChangeQuery"
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
                    <div class="bold-text">No Dealer Inventory Data Found!</div>
                  </template>

                  <template slot="edit" slot-scope="props">
                    <div>
                      <button
                        :disabled="!props.row.productSkuId"
                        class="btn btn-warning btn-xs"
                        @click.prevent="
                          inventoryHistory(props.row.productSkuId)
                        "
                      >
                        View
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
    <BModal
      ref="inventory-history-modal"
      size="lg"
      hide-footer
      title="Inventory History"
    >
      <div class="row mb-4">
        <div class="col-12">
          <div class="w-100">
            <Multiselect
              v-model="dealerStockMonthlySelected.year"
              name="Year"
              :open-direction="'bottom'"
              :loading="!dealerStockMonthlySelected"
              :disabled="!dealerStockMonthlySelected"
              placeholder="Select Year"
              :options="yearsArray"
              :searchable="true"
              :allow-empty="false"
              @input="getDealerStockMonthly"
            ></Multiselect>
          </div>
        </div>
      </div>
      <div>
        <VueBootstrap4Table
          :classes="classes"
          :rows="dealerStockMonthlyList"
          :columns="dealerStockMonthlyColumns"
          :config="config"
          :total-rows="dealerStockMonthlyList.length"
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
            <div class="bold-text">No Inventory History Data Found!</div>
          </template>
        </VueBootstrap4Table>
      </div>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import Multiselect from "vue-multiselect";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  DEALER_LIST_REQUEST,
  DEALER_STOCK_LIST_REQUEST,
  DEALER_STOCK_LIST_MONTHLY_REQUEST,
  DEALER_STOCK_LIST_DOWNLOAD_REQUEST
} from "../../store/modules/dealer/actions";
import moment from "moment";
export default {
  name: "DealerSellInventory",
  components: {
    breadcrumb,
    Multiselect,
    VueBootstrap4Table,
    BModal
  },
  computed: {
    yearsArray() {
      const thisYear = this.currentYear - 1;
      const yearList = [];
      for (let i = 0; i <= 7; i++) {
        let yr = thisYear + i;
        yearList.push(yr);
      }
      return yearList;
    }
  },
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
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
          name: "productFamily",
          label: "Product Family",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "mtmNumber",
          label: "MTM Number",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "balance",
          label: "Balance",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "edit",
          label: "Action",
          row_text_alignment: "text-center",
          column_text_alignment: "text-center"
        }
      ],
      dealerStockMonthlyColumns: [
        {
          name: "month",
          label: "Month",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "openingStock",
          label: "Opening Stock",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "sellIn",
          label: "Sell In",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "sellOut",
          label: "Sell Out",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "closingStock",
          label: "Closing Stock",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      dealerList: [],
      dealerSelected: [],
      dealerListErrors: {},
      dealerStockList: [],
      dealerStockMonthlyList: [],
      dealerStockMonthlySelected: {
        productSkuId: null,
        dealerId: null,
        year: ""
      },
      currentYear: new Date().getFullYear(),
      dealerStockDownloadContent: [],
      tHeader: [
        "Balance",
        "Closing Stock",
        "Dealer Name",
        "Month",
        "MTM Number",
        "Opening Stock",
        "Product Family",
        "Sell In",
        "Sell Out",
        "Year"
      ],
      tValue: [
        "balance",
        "closingStock",
        "dealerName",
        "month",
        "mtmNumber",
        "openingStock",
        "productFamily",
        "sellIn",
        "sellOut",
        "year"
      ]
    };
  },
  methods: {
    async getDealers() {
      const res = await this.$store.dispatch(
        DEALER_LIST_REQUEST,
        this.$store.getters.getCountryId
      );
      if (res.resultCode == 0) {
        this.dealerList = res.content;
      }
    },
    async getDealerStockList(selectedItem) {
      const id = selectedItem.id;
      const res = await this.$store.dispatch(DEALER_STOCK_LIST_REQUEST, {
        dealerId: id
      });
      if (res.resultCode == 0) {
        this.dealerStockList = res.content;
      }
      const res2 = await this.$store.dispatch(
        DEALER_STOCK_LIST_DOWNLOAD_REQUEST,
        {
          dealerId: this.dealerSelected.id
        }
      );
      if (res2.resultCode == 0) {
        this.dealerStockDownloadContent = res2.content;
      }
    },
    async getDealerStockMonthly() {
      const res = await this.$store.dispatch(
        DEALER_STOCK_LIST_MONTHLY_REQUEST,
        this.dealerStockMonthlySelected
      );
      if (res.resultCode == 0) {
        this.dealerStockMonthlyList = res.content;
      }
    },
    downloadDealerList() {
      const date = `Downloaded Date: ${moment(new Date()).format(
        "YYYY-MM-DD"
      )}`;
      const dealerName = `Dealer Name: ${this.dealerSelected.dealerName}`;

      const sheetInfoArray = [{ firstCol: dealerName }, { firstCol: date }];
      const data = this.dealerStockDownloadContent.map(item => {
        for (var i = 0; i < this.tHeader.length; i++) {
          item[this.tHeader[i]] = item[this.tValue[i]];
          delete item[this.tValue[i]];
        }
        return item;
      });

      let ws = null;

      if (date && dealerName) {
        ws = XLSX.utils.json_to_sheet(sheetInfoArray, { skipHeader: true });
        XLSX.utils.sheet_add_json(ws, data, { origin: "A3" });
      } else {
        ws = XLSX.utils.json_to_sheet(data);
      }

      const wb = XLSX.utils.book_new();
      const wopts = { bookType: "xlsx", bookSST: false, type: "array" };
      wb.SheetNames.push("lnvSheet");
      wb.Sheets["lnvSheet"] = ws;

      const wbout = XLSX.write(wb, wopts);

      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `Dealer ${this.dealerSelected.dealerName} Inventory - ${moment(
          new Date()
        ).format("YYYY-MM-DD")}.xlsx`
      );
    },
    inventoryHistory(data) {
      this.dealerStockMonthlySelected.productSkuId = data;
      this.dealerStockMonthlySelected.dealerId = this.dealerSelected.id;
      this.dealerStockMonthlySelected.year = "";
      this.dealerStockMonthlyList = [];
      this.$refs["inventory-history-modal"].toggle();
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  },
  mounted() {
    this.getDealers();
  }
};
</script>

<style></style>
