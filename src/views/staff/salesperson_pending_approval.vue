<template>
  <div id="pending-list">
    <breadcrumb title="Dashboard" subtitle="Pending Approval" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div v-if="isRegionAdmin" class="col-lg-12">
                  <div class="row">
                    <div class="col-lg-12">
                      <Multiselect
                        ref="multiselect"
                        v-model="search.countryId"
                        placeholder="Select Country"
                        :searchable="true"
                        :options="countries"
                        label="text"
                        track-by="id"
                        select-label
                        deselect-label
                        :loading="isCountriesLoading"
                        @input="
                          onChangeCountry();
                          doSearch();
                        "
                      ></Multiselect>
                    </div>
                  </div>
                </div>

                <div class="col-lg-12 add-employee-button">
                  <button
                    v-if="canDownload"
                    class="btn btn-sm btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-file-excel-o"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
                  </button>
                </div>
              </div>
              <br />

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="pendingList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getSalespersonList"
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
                        v-text="$ml.get('no_pending_approvals_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>
                    <template slot="status" slot-scope="props">
                      <lnvStatusTextBox :status="props.cell_value" />
                      <!-- <span
                        v-if="props.cell_value == 'Pending'"
                        class="label label-rounded label-warning"
                      >{{props.cell_value }}</span>
                      <span
                        v-if="props.cell_value == 'Approved'"
                        class="label label-rounded label-success"
                      >{{props.cell_value }}</span>
                      <span
                        v-if="props.cell_value == 'Rejected'"
                        class="label label-rounded label-danger"
                      >{{props.cell_value }}</span>-->
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="remarks" slot-scope="props">
                      <span>
                        <!-- eslint-disable vue/no-v-html  -->
                        <p v-html="props.row.remarks"></p>
                      </span>
                    </template>

                    <template slot="dealer" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.dealer }}</span>
                        <br />
                        <span>{{ props.row.lppCode }}</span>
                      </div>
                    </template>

                    <template slot="outlet" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.outlet }}</span>
                        <br />
                        <span>{{ props.row.outletCode }}</span>
                        <br />
                        <span>{{ props.row.outletAddress }}</span>
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div class="inner-buttons float-left">
                        <button
                          v-if="props.row.status == 'Pending' && canApproved"
                          type="button"
                          class="btn btn-info"
                          @click="doApproveReject(props.row, 1)"
                        >
                          <i class="fa fa-check color-info"></i>Approve
                        </button>

                        <button
                          v-if="props.row.status == 'Pending' && canReject"
                          type="button"
                          class="btn btn-warning"
                          @click="doApproveReject(props.row, 0)"
                        >
                          <i class="fa fa-times color-warning"></i>Reject
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
import {
  PENDING_SALESP_LIST_REQUEST,
  PENDING_SALESP_STATUS_REQUEST
} from "../../store/modules/staff/actions";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import { export_json_to_excel } from "../../utils/Export2Excel";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import { EventBus } from "@/utils/EventBus";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";
import { convertDateFormat } from "../../utils/helpers";
import timeStampToDate from "../../utils/TimeStampToDate";

export default {
  name: "SalespersonPage",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {},
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Pending Approvals",
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
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          sort: true
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "name",
          label: "Name",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "remarks",
          label: "Description",
          sort: true,
          width: "25%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "requestDateFormatted",
          label: "Request Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outlet",
          label: "Outlet Info",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletAddress",
          label: "Outlet Address",
          visibility: false
        },
        {
          name: "actionBy",
          label: "Action By",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "status",
          label: "Status",
          width: "8%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      pendingList: [],
      salesp: {},
      isRegionAdmin: false,
      countries: [],
      search: {},
      countryId: null,
      canApproved: false,
      canReject: false,
      canDownload: false,
      isPicOutlet: false,
      isCountriesLoading: false,
      isDataLoading: false,
      isAgency: false
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getSalespersonList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getSalespersonList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getSalespersonList();
    },
    getSalespersonList() {
      this.isDataLoading = true;
      let pdata = {};
      this.pendingList = [];
      if (this.isRegionAdmin && !this.countryId) {
        this.$store.dispatch(NOTIFICATION_ERROR, {
          message: "Select a country"
        });
      }
      if (this.countryId) {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(PENDING_SALESP_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          const formattedContent = [...res.content];
          this.pendingList = formattedContent.map(el => {
            el.requestDateFormatted = timeStampToDate(el.requestDate);
            return el;
          });
          this.total = this.pendingList.length;
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doApproveReject(row, status) {
      //this.$buefy.toast.open("User confirmed")
      this.$buefy.dialog.confirm({
        message: "Continue on this task?",
        onConfirm: () => {
          const data = {
            id: row.id,
            action: status
          };
          this.$store.dispatch(NOTIFICATION_REQUEST, {
            message: "Submitting..."
          });

          this.$store
            .dispatch(PENDING_SALESP_STATUS_REQUEST, data)
            .then(res => {
              if (res.resultCode === 0) {
                this.getSalespersonList();
                if (status === 1) {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: "Successfully Approved."
                  });
                } else {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: "Successfully Rejected."
                  });
                }
                EventBus.$emit("getUnreadData", 1);
              }
            });
        }
      });
    },
    getCountries() {
      this.isCountriesLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;
          this.isCountriesLoading = false;
        } else {
          this.isCountriesLoading = false;
        }
      });
    },
    doExport() {
      const tHeader = [
        "Name",
        "User Role",
        "Description",
        "LPP Code",
        "Dealer Name",
        "Outlet Code",
        "Outlet Name",
        "Outlet Address",
        "Status",
        "Approved/Rejected By"
      ];
      const filterVal = [
        "name",
        "userRole",
        "remarks",
        "lppCode",
        "dealerName",
        "outletCode",
        "outletName",
        "outletAddress",
        "status",
        "actionBy"
      ];
      const data = this.formatJson(filterVal, this.pendingList);
      const fileName = "salespersonPendingApprovals";
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
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.isPicOutlet = this.$store.getters.isPicOutlet;
    this.isAgency = this.$store.getters.isAgency;

    if (this.isRegionAdmin) {
      this.canApproved = false;
      this.canReject = false;
    } else if (this.isCountryAdmin || this.isAgency) {
      this.canApproved = false;
      this.canReject = false;
      this.canDownload = true;
    } else if (this.isPicOutlet) {
      this.canApproved = false;
      this.canReject = false;
    } else {
      this.canApproved = true;
      this.canReject = true;

      this.columns.push({
        name: "Action",
        label: "Action",
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    if (!this.isRegionAdmin) {
      this.getSalespersonList();
    }

    if (!this.isPicOutlet) {
      this.columns.splice(3, 0, {
        name: "dealer",
        label: "Dealer Info",
        sort: true,
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }
  }
};
</script>
