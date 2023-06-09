<template>
  <div id="bulk-upload">
    <breadcrumb title="Dashboard" subtitle="Bulk Upload" />

    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-7">
                  <label class="text-label">Select Period</label>
                  <br />
                  <DateRangePicker
                    ref="picker"
                    v-model="dateRange"
                    :opens="datePicker.opens"
                    :locale-data="{ firstDay: 1, format: 'YYYY-MM-DD' }"
                    :min-date="datePicker.minDate"
                    :max-date="datePicker.maxDate"
                    :single-date-picker="datePicker.singleDatePicker"
                    :time-picker="datePicker.timePicker"
                    :time-picker24hour="datePicker.timePicker24Hour"
                    :show-week-numbers="datePicker.showWeekNumbers"
                    :show-dropdowns="datePicker.showDropdowns"
                    :auto-apply="datePicker.autoApply"
                    :linked-calendars="datePicker.linkedCalendars"
                    :date-format="datePicker.dateFormat"
                    :ranges="datePicker.ranges"
                    @update="updateDateValues"
                  >
                    <div
                      slot="input"
                      slot-scope="picker"
                      style="width: 100%; float: left;"
                    >
                      <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                        {{ formatDate(picker.endDate) }}</span>
                    </div>
                  </DateRangePicker>
                </div>
                <div class="col-lg-3">
                  <div class="form-group flex-grow-1">
                    <br />
                    <button
                      type="button"
                      class="btn btn-primary pull-left"
                      @click="doSearch()"
                    >
                      <i class="fa fa-search"></i> SEARCH
                    </button>
                  </div>
                </div>
                <div class="col-lg-2">
                  <div class="form-group flex-grow-1">
                    <br />
                    <button
                      v-if="canUpload"
                      class="btn btn-primary pull-right"
                      @click="toggleModal(null)"
                    >
                      <i class="fa fa-upload"></i> Upload
                    </button>
                  </div>
                </div>

                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="salesList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getBulkSaleList"
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
                      <div class="bold-text">No Sales Found!</div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="upload_info" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{
                          formatDate(props.row.uploadDate)
                        }}</span>
                        <br />
                        <span>{{ props.row.name }}</span>
                        <br />
                        <span class="bold-text">{{
                          props.row.outletName
                        }}</span>
                        <br />
                        <span>{{ props.row.fileName }}</span>
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div class="inner-buttons float-left">
                        <button
                          class="btn btn-primary"
                          @click="doDownload(props.row)"
                        >
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

    <BModal
      ref="bulk-upload-modal"
      size="lg"
      hide-footer
      title="Bulk Upload Submission"
    >
      <BulkSaleUpload :close-modal="toggleModal" />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import BulkSaleUpload from "../../components/sales/upload_form";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { Message } from "element-ui";
import { convertDateFormat } from "../../utils/helpers";
// import downloadexcel from "vue-json-excel";
import {
  GET_BULK_SALE_REQUEST,
  DOWNLOAD_BULK_SALE_REQUEST
} from "../../store/modules/sales/actions";
import { BModal } from "bootstrap-vue";
import { export_json_to_excel } from "../../utils/Export2Excel";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
const today = new Date();

export default {
  name: "BulkSalePage",
  components: {
    breadcrumb: breadcrumb,
    BulkSaleUpload: BulkSaleUpload,
    VueBootstrap4Table: VueBootstrap4Table,
    DateRangePicker: DateRangePicker,
    BModal: BModal
  },
  computed: {},
  data() {
    return {
      excel_fields: {
        Serial_Number: "serial",
        Invoice_Date: "invoiceDate",
        Invoice_No: "invoiceNumber"
      },
      dateRange: {
        startDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth(), 1),
          "YYYY-MM-DD"
        ),
        endDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          "YYYY-MM-DD"
        )
      },
      datePicker: {
        opens: "center",
        // minDate: "2019-08-01",
        // maxDate: "2019-12-31",
        singleDatePicker: false,
        timePicker24Hour: false,
        showWeekNumbers: false,
        showDropdowns: false,
        timePicker: false,
        autoApply: false,
        ranges: false
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Bulk Sale",
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
          visibility: false,
          sort: true,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "upload_info",
          label: "Upload Info"
        },
        {
          name: "totalLine",
          label: "Total Line",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "matched",
          label: "Matched",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "duplicate",
          label: "Duplicate",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "unknown",
          label: "Unknown",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletName",
          label: "Outlet Name",
          visibility: false
        },
        {
          name: "name",
          label: "Dealer Name",
          visibility: false
        },
        {
          name: "fileName",
          label: "File Name",
          visibility: false
        },
        {
          name: "Action",
          label: "Result",
          render: value => {
            return this.actionButtons(value);
          }
        }
      ],
      total: 0,
      salesList: [],
      downloadData: [],
      canUpload: true
    };
  },
  methods: {
    toggleModal() {
      this.$refs["bulk-upload-modal"].toggle("#toggle-btn");
    },
    updateDateValues() {},
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getBulkSaleList();
    },
    getBulkSaleList() {
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");

      const pdata = {
        startDate: startDate,
        endDate: endDate
      };
      if (startDate !== "Invalid date" && endDate !== "Invalid date") {
        this.$store.dispatch(GET_BULK_SALE_REQUEST, pdata).then(res => {
          if (res.content && res.resultCode === 0) {
            this.salesList = res.content;
            this.total = this.salesList.length;
          }
        });
      } else {
        Message({
          message: "Invalid date selection.",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    doSearch() {
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");

      if (startDate !== "Invalid date" && endDate !== "Invalid date") {
        this.getBulkSaleList();
      } else {
        Message({
          message: "Invalid date selection.",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    async doDownload(row) {
      let pdata = {
        id: row.id
      };
      this.$store.dispatch(DOWNLOAD_BULK_SALE_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          // return res.content;
          this.exportExcel(res.content, row);
        }
      });
    },
    exportExcel(exdata, row) {
      const tHeader = [
        "Serial Number",
        "Invoice Date",
        "Invoice No",
        "Result",
        "Remark"
      ];
      const filterVal = [
        "serial",
        "invoiceDate",
        "invoiceNumber",
        "result",
        "remark"
      ];
      const data = this.formatJson(filterVal, exdata);
      const fileName = "bulkSalesExport-" + row.id;
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "bulkSales",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "DD-MM-YYYY");
          } else {
            return v[j];
          }
        })
      );
    },
    formatDate: function(date) {
      return convertDateFormat(date, "DD-MM-YYYY");
    }
  },
  mounted() {
    this.getBulkSaleList();
  },
  created() {
    // this.getBulkSaleList();
  }
};
</script>
