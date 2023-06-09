<template>
  <div id="dealer_sell_out">
    <breadcrumb title="Dashboard" subtitle="Dealer Sell Out" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-4">
              <div class="col-12 d-flex align-items-center">
                <div class="w-100">
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
                    @update="getSalesOut"
                  >
                    <div
                      slot="input"
                      slot-scope="picker"
                      style="min-width: 310px; width: 100%; float: left;"
                    >
                      <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                        {{ formatDate(picker.endDate) }}</span>
                    </div>
                  </DateRangePicker>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-12 d-flex align-items-center justify-content-end">
                <div>
                  <button
                    type="button"
                    :disabled="!dataList"
                    class="btn btn-sm btn-primary"
                    @click="dealerSalesInModalToggle"
                  >
                    <i class="fa fa-upload"></i> Upload
                  </button>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <VueBootstrap4Table
                  :classes="classes"
                  :rows="dataList"
                  :columns="columns"
                  :config="config"
                  :total-rows="dataList.length"
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
                    <div class="bold-text">No Dealer Sell Out Data Found!</div>
                  </template>

                  <template slot="edit" slot-scope="props">
                    <div>
                      <button
                        class="btn btn-warning btn-xs"
                        @click.prevent="
                          dealerSellOutViewModalToggle(
                            props.row.salesSellOutList
                          )
                        "
                      >
                        View
                      </button>
                      <button
                        class="btn btn-primary btn-xs"
                        :disabled="props.row.salesSellOutList.length <= 0"
                        @click.prevent="
                          doDownload(
                            props.row.fileName,
                            props.row.salesSellOutList
                          )
                        "
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
    <BModal
      id="dealer-sell-out-upload"
      ref="dealer-sell-out-upload"
      size="lg"
      hide-footer
      title="Dealer Sell Out Upload"
    >
      <div class="row">
        <div class="col-lg-12 d-flex flex-column">
          <div>
            <label class="text-label">Dealer Sell Out File*</label>
          </div>
          <div class="d-flex">
            <div class="d-flex flex-column w-100">
              <div class="d-flex align-items-center">
                <div class="w-100">
                  <div class="w-100 d-flex align-items-center">
                    <div class="w-100">
                      <BFormFile
                        id="file"
                        ref="file"
                        v-model="fileUpload"
                        v-validate="'required'"
                        name="file"
                        accept=".xlsx"
                        size="lg"
                        class="cursor-pointer"
                        @change="handleFileUpload($event)"
                      ></BFormFile>
                    </div>
                    <div class="ml-4">
                      <button
                        type="button"
                        class="btn btn-primary btn-xs"
                        @click="resetUploadedFile()"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  <div class="mt-3">
                    <span class="invalid-field">{{
                      errors.first("file")
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <button
                  type="button"
                  class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                  @click="doExport()"
                >
                  Dealer Sell Out template
                  <i class="fa fa-info-circle fa-lg" aria-hidden="true"></i>
                </button>
                <p class="text-muted">
                  Please upload the Mtm number and LPP Code available in the
                  system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button
          type="btn"
          class="btn btn-primary btn-sm"
          @click.prevent="handleSubmit"
        >
          Confirm
        </button>
      </div>
    </BModal>
    <BModal
      ref="dealer-sell-out-view"
      size="lg"
      hide-footer
      title="dealer-sell-out-view"
    >
      <div>
        <VueBootstrap4Table
          :classes="classes"
          :rows="salesSellOutListSelected"
          :columns="dealerSellOutPreviewColumns"
          :config="config"
          :total-rows="salesSellOutListSelected.length"
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
            <div class="bold-text">No Dealer Sell Out Selected!</div>
          </template>
        </VueBootstrap4Table>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button
          type="btn"
          class="btn btn-primary btn-sm"
          @click="dealerSellOutViewModalToggle"
        >
          Close
        </button>
      </div>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import { BModal, BFormFile } from "bootstrap-vue";
import { convertDateFormat } from "../../utils/helpers";
import XLSX from "xlsx";
import { export_json_to_excel } from "../../utils/Export2Excel";

import {
  DEALER_SELL_OUT_LIST_REQUEST,
  DEALER_SELL_OUT_ADD_REQUEST
} from "../../store/modules/dealer/actions";

import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  name: "DealerSellOut",
  components: {
    breadcrumb,
    VueBootstrap4Table,
    BModal,
    BFormFile,
    DateRangePicker
  },
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Dealer Sales In",
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
          sort: true,
          visibility: false,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "fileName",
          label: "File Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalLine",
          label: "Total Line",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "uploadDate",
          label: "Upload Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "status",
          label: "Status",
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
      dealerSellOutPreviewColumns: [
        {
          name: "lppCode",
          label: "LPP Code",
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
          name: "quantity",
          label: "Quantity",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "remarks",
          label: "Remarks",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      dataList: [],
      salesSellOutListSelected: [],
      dateRange: {
        startDate: convertDateFormat(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          "YYYY-MM-DD"
        ),
        endDate: convertDateFormat(
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
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
        autoApply: true,
        ranges: false,
        dateFormate: "YYYY-MM-DD"
      },
      fileUpload: [],
      search: {},
      sellOut: {
        fileName: "",
        salesSellOutList: []
      },
      sellOutErrors: {},
      tHeader: ["Outlet Code", "MTM Number", "Quantity"],
      filterVal: ["outletCode", "mtmNumber", "quantity"]
    };
  },
  methods: {
    async getSalesOut() {
      this.dateRange.startDate = convertDateFormat(
        this.dateRange.startDate,
        "YYYY-MM-DD"
      );
      this.dateRange.endDate = convertDateFormat(
        this.dateRange.endDate,
        "YYYY-MM-DD"
      );
      const res = await this.$store.dispatch(
        DEALER_SELL_OUT_LIST_REQUEST,
        this.dateRange
      );
      if (res.resultCode == 0) {
        this.dataList = res.content;
      }
    },
    formatDate: function(date) {
      return convertDateFormat(String(date), "YYYY-MM-DD");
    },
    handleSubmit() {
      this.$validator.validateAll().then(result => {
        if (result && Object.keys(this.sellOutErrors).length === 0) {
          this.$store
            .dispatch(DEALER_SELL_OUT_ADD_REQUEST, this.sellOut)
            .then(res => {
              if (res.resultCode === 0) {
                this.dealerSalesInModalToggle();
                this.getSalesOut();
                this.$store.dispatch(NOTIFICATION_SUCCESS, {
                  message: "Dealer Sell Out Added Successfully",
                  timeOut: true
                });
              }
            });
        }
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(btoa(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    handleFileUpload(event) {
      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Validating file..."
      });

      const file = event.target.files[0];

      // Validating file upload extension
      if (this.checkUploadType(file.name)) {
        this.getBase64(file).then(data => {
          var workbook = XLSX.read(data, { type: "base64" });
          var first_sheet_name = workbook.SheetNames[0];

          // Get worksheet
          let worksheet = workbook.Sheets[first_sheet_name];
          const sheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          //Validating file upload columns
          if (sheet.length > 0) {
            if (this.checkFileHeaders(Object.keys(sheet[0]))) {
              this.dataAdjustmentsAfterUpload(sheet, file.name);
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "File validation completed successfully",
                timeOut: true
              });
            } else {
              this.$store.dispatch(NOTIFICATION_ERROR, {
                message:
                  "File format incorrect. Please use provided incentive list template"
              });
            }
          } else {
            this.$store.dispatch(NOTIFICATION_ERROR, {
              message: "No data in file!"
            });
          }
        });
      }
    },
    checkFileHeaders(headers) {
      // Normalizing column heads for comparison
      const formattedHeaders = JSON.stringify(headers);
      const formattedTheader = JSON.stringify(this.tHeader);
      return formattedHeaders === formattedTheader;
    },
    checkUploadType(fileName) {
      if (fileName) {
        let filename = fileName.split(".").pop();
        if (filename === "xlsx") {
          delete this.sellOutErrors.file;
          return true;
        } else {
          this.sellOutErrors.file = "File type must be .xlsx";
          return false;
        }
      }
    },
    dataAdjustmentsAfterUpload(sheet, name) {
      let formattedArrayParams = sheet.map(item => {
        return {
          outletCode: item["Outlet Code"],
          mtmNumber: item["MTM Number"],
          quantity: item["Quantity"]
        };
      });
      this.sellOut.salesSellOutList = formattedArrayParams;
      this.sellOut.fileName = name;
    },
    resetUploadedFile() {
      this.$refs["file"].reset();
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
    },
    doExport() {
      const data = "";
      const fileName = "dealer sell out template";
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: fileName,
        sheetName: fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    doDownload(name, salesSellOutList) {
      let data = this.formatJson(this.filterVal, salesSellOutList);
      const fileName = name;
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: fileName,
        sheetName: fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    dealerSalesInModalToggle() {
      this.$refs["dealer-sell-out-upload"].toggle();
    },
    dealerSellOutViewModalToggle(data) {
      if (Array.isArray(data)) {
        this.salesSellOutListSelected = data;
      }
      this.$refs["dealer-sell-out-view"].toggle();
    }
  },
  mounted() {
    this.getSalesOut();
  }
};
</script>

<style></style>
