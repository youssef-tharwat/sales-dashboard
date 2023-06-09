<template>
  <div id="generate-incentve-payable-file">
    <breadcrumb title="Dashboard" subtitle="Generate Incentive Payable" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class>
              <div class="row">
                <div class="col-lg-4">
                  <label
                    class="text-label"
                    v-text="$ml.get('title_year')"
                  ></label>
                  <Multiselect
                    ref="multiselect-nyr"
                    v-model="selectedYear"
                    placeholder="Select Year"
                    :searchable="true"
                    :options="yearList"
                    label="text"
                    track-by="id"
                    select-label
                    deselect-label
                    @input="onYearChange"
                  ></Multiselect>

                  <!-- <select
                    v-model="selectedYear"
                    @change="onYearChange($event)"
                    id="year"
                    class="form-control"
                  >
                    <option v-for="(year, index) of yearList" :key="index">{{year}}</option>
                  </select>-->
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="payableList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getPayableDataList()"
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
                      <div
                        v-if="!isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('no_payout_data_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.month }}</span>
                    </template>
                    <template slot="month" slot-scope="props">
                      <div class="inner-data">
                        {{
                          formatDateToMonth(
                            props.row.year + "-" + props.row.month + "-01"
                          )
                        }}
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div
                        class="inner-buttons btn-group float-right"
                        role="group"
                      >
                        <button
                          v-if="props.row.downloadLink !== null"
                          type="button"
                          class="btn btn-info"
                          @click="downloadFile(props.row)"
                        >
                          <i class="fa fa-excel color-info"></i>DOWNLOAD
                        </button>
                        <!-- change v-if="props.row.readyToGenerate" to true for Generate button. Temporary use as requested by Fabian -->
                        <span
                          v-if="props.row.downloadLink !== null"
                          id="date-remarks"
                          class="generate-date"
                        >{{ props.row.remarks }}</span>
                        <button
                          v-if="isProduction ? props.row.readyToGenerate : true"
                          type="button"
                          class="btn btn-warning"
                          @click="generateIncentiveFile(props.row)"
                        >
                          <i class="fa fa-download color-warning"></i>GENERATE
                        </button>
                        <!-- v-if="props.row.bonusIncentiveNotreadyList.length > 0" -->
                        <button
                          v-if="false"
                          type="button"
                          class="btn btn-warning"
                          @click="viewDetails(props.row)"
                        >
                          <i class="fa fa-eye color-warning"></i>VIEW DETAILS
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

    <!-- View -->
    <BModal ref="incentive-view-modal" size="lg" hide-footer title="Details">
      <div class="row">
        <div class="col-lg-12">
          <div
            v-for="(row, index1) of selectedIncentiveRow"
            :key="index1"
            class="form-group flex-grow-1"
          >
            <label class="text-label">Name: {{ row.name }}</label>
            <br />
            <label class="text-label">Type: {{ row.type }}</label>
            <br />
            <label class="text-label">Period: {{ row.period }}</label>
            <br />
            <label class="text-label">
              Generation of payable file is pending for:
              <b
                v-for="(pendingMonth, index2) of row.pendingMonths"
                :key="index2"
              >
                <b>{{
                     formatDateToMonth(
                       pendingMonth.year + "-" + pendingMonth.month + "-01"
                     )
                   }}
                  {{ " " }}</b>
              </b>

              <!-- <b>{{selectedIncentiveRow.name}}</b> -->
            </label>
            <br />
          </div>
        </div>
      </div>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import { convertDateFormat, urlValidate } from "../../utils/helpers";
import { Message } from "element-ui";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";

import { BModal } from "bootstrap-vue";
import Multiselect from "vue-multiselect";

import {
  GET_PAYOUT_BY_YEAR_REQUEST,
  INCENTIVE_PAYABLE_GENERATE_REQUEST
} from "../../store/modules/incentive/action";

export default {
  name: "SalesDataSummary",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    BModal: BModal,
    Multiselect: Multiselect
  },
  computed: {
    isProduction() {
      return process.env.NODE_ENV == "production";
    }
  },
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Sales Data",
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
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default,
        },
        {
          name: "month",
          label: "Month",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "totalSubmission",
          label: "Total Submission",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "validated",
          label: "Validated",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "noValidated",
          label: "Not Validated",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "resubmissionMessage",
          label: "Resubmission Message",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "resubmissionPendingValidation",
          label: "Resubmission Pending for validation",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      payableList: [],
      isRegionAdmin: false,
      isDealer: false,
      countries: [],
      search: {
        status: {}
      },
      countryId: null,
      yearList: [],
      selectedYear: {
        id: new Date().getFullYear(),
        text: new Date().getFullYear()
      },
      month: new Date().getMonth(),
      selectedIncentiveRow: [],
      isDataLoading: false
    };
  },
  methods: {
    downloadFile(row) {
      if (urlValidate(row.downloadLink)) {
        let fileLink = row.downloadLink;
        var win = window.open(fileLink, "_blank");
        win.focus();
      } else {
        return Message({
          message: " Incentive file not found",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    generateIncentiveFile(row) {
      let d = new Date(row.year + "-" + row.month + "-01");
      let incYear = d.getFullYear();
      let incMonth = d.getMonth() + 1;
      let pData = {
        typeId: null,
        month: incMonth,
        year: incYear
      };

      this.$store
        .dispatch(INCENTIVE_PAYABLE_GENERATE_REQUEST, pData)
        .then(res => {
          if (res.resultCode === 0) {
            // this.incentiveData = res.content;

            Message({
              message: "File created.",
              type: "success",
              duration: 5 * 1000
            });

            this.payableList.filter(function(elem) {
              if (row.month === elem.month) {
                elem.downloadLink = res.content.fileLink;
                elem.readyToGenerate = false;
              }

              return elem;
            });
          } else {
            Message({
              message: "File creation failed..",
              type: "error",
              duration: 5 * 1000
            });
          }
        });
    },
    viewDetails(row) {
      this.selectedIncentiveRow = row.bonusIncentiveNotreadyList;
      this.$refs["incentive-view-modal"].toggle("#toggle-btn");
    },
    onYearChange() {
      this.getPayableDataList();
    },
    updateDateValues() {},
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getPayableDataList();
    },
    getPayableDataList() {
      let pData = {
        year: this.selectedYear.id
      };
      this.payableList = [];
      this.isDataLoading = true;
      this.$store.dispatch(GET_PAYOUT_BY_YEAR_REQUEST, pData).then(res => {
        if (res.content && res.resultCode === 0) {
          if (res.content.length <= 0) {
            Message({
              message: "No Payable Data Found!",
              type: "error",
              duration: 5 * 1000
            });
          }
          this.payableList = res.content;
          this.sorting();
          this.total = this.payableList.length;
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doDownload() {},
    sorting() {
      this.payableList.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    },
    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
    },
    formatDateToMonth: function(date) {
      return convertDateFormat(date, "MMMM YYYY");
    },
    getDataRowByName(arr, name) {
      let c = arr.filter(function(elem) {
        if (elem.text.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    setYears() {
      const yearRange = this.selectedYear.id - 3;
      for (let i = 0; i <= 6; i++) {
        let yr = yearRange + i;
        // this.yearList.push(yr);
        this.yearList.push({ id: yr, text: yr });
      }
      return this.yearList;
    }
  },
  mounted() {
    this.setYears();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isDealer = this.$store.getters.isDealer;
    this.getPayableDataList();
  }
};
</script>
