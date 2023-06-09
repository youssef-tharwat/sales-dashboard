<template>
  <div id="sales-data">
    <div class="row">
      <div class="col-lg-12">
        <div>
          <div>
            <div class>
              <div class="row">
                <div v-if="isRegionAdmin" class="col-lg-4">
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('sd_title_country')"
                    ></label>
                    <Multiselect
                      ref="multiselect-country"
                      v-model="search.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      :loading="getCountriesIsLoading"
                      @input="doSearch()"
                    ></Multiselect>
                  </div>
                </div>

                <div
                  :class="{
                    'col-lg-6': !isRegionAdmin,
                    'col-lg-5': isRegionAdmin
                  }"
                >
                  <label
                    class="text-label"
                    v-text="$ml.get('sd_title_period')"
                  ></label>
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
                    @update="
                      updateDateValues();
                      doSearch();
                    "
                  >
                    <div slot="input" slot-scope="picker">
                      <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                        {{ formatDate(picker.endDate) }}</span>
                    </div>
                  </DateRangePicker>
                </div>

                <div v-if="!isRegionAdmin" class="col-lg-3">
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('sd_title_status')"
                    ></label>
                    <Multiselect
                      ref="multiselect-status"
                      v-model="search.status"
                      placeholder="Select Status"
                      :searchable="true"
                      :options="statusList"
                      label="text"
                      track-by="id"
                      select-label
                      deselect-label
                      :loading="getStatusListIsLoading"
                      @input="doSearch()"
                    ></Multiselect>
                  </div>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="salesList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="doSearch"
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
                        v-text="$ml.get('no_sales_data_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span
                        @click="
                          (props.row.checkStatus == null ||
                            props.row.statusId === reSubmissionId ||
                            isAdminAndFailedStatus(props.row.checkStatus)) &&
                            canEdit
                            ? toggleEditModal(props.row)
                            : ''
                        "
                      >{{ props.row.id }}</span>
                    </template>

                    <template slot="staffName" slot-scope="props">
                      <div class="inner-data">
                        <i v-if="props.row.staffId" class="fa fa-id-card-o"></i>
                        {{ props.row.staffId }}
                        <br />
                        <i v-if="props.row.staffName" class="fa fa-id-card"></i>
                        {{ props.row.staffName }}
                        <br />
                        <span>
                          <i v-if="props.row.staffRole" class="fa fa-user"></i>
                          {{ props.row.staffRole }}
                        </span>
                      </div>
                    </template>

                    <template slot="outletName" slot-scope="props">
                      <div class="inner-data">
                        <i
                          v-if="props.row.outletName"
                          class="fa fa-building-o"
                        ></i>
                        {{ props.row.outletName }}
                        <br />
                        <i
                          v-if="props.row.outletAddress"
                          class="fa fa-map-marker"
                        ></i>
                        {{ props.row.outletAddress }}
                      </div>
                    </template>

                    <template slot="dealerName" slot-scope="props">
                      <div class="inner-data">
                        <span>{{ props.row.dealerName }}</span>
                        <br />
                        <span>{{ props.row.lppCode }}</span>
                      </div>
                    </template>

                    <template slot="productName" slot-scope="props">
                      <div class="inner-data">
                        <i v-if="props.row.serialNo" class="fa fa-barcode"></i>
                        {{ props.row.serialNo }}
                        <br />
                        <i
                          v-if="props.row.productName"
                          class="fa fa-laptop"
                        ></i>
                        {{ props.row.productName }}
                        <br />
                        <i v-if="props.row.productSku" class="fa fa-bars"></i>
                        {{ props.row.productSku }}
                      </div>
                    </template>

                    <template slot="invoiceNumber" slot-scope="props">
                      <div class="inner-data">
                        <i
                          v-if="props.row.invoiceNumber"
                          class="fa fa-bars"
                        ></i>
                        {{ props.row.invoiceNumber }}
                        <br />
                        <i
                          v-if="props.row.invoiceDate"
                          class="fa fa-calendar"
                        ></i>
                        {{ formatDate(props.row.invoiceDate) }}
                      </div>
                    </template>

                    <template slot="invoiceImageUrl" slot-scope="props">
                      <div v-viewer class="media-img-container mr-3">
                        <img
                          class="img-fluid media-img square-img"
                          alt="Invoice"
                          :src="
                            props.row.invoiceImage1Url
                              ? props.row.invoiceImage1Url
                              : defaultImage
                          "
                          @error="replaceImageByDefault"
                        />
                        <img
                          v-if="props.row.invoiceImage2Url"
                          style="display:none"
                          class="img-fluid media-img square-img"
                          alt="Invoice"
                          :src="
                            props.row.invoiceImage2Url
                              ? props.row.invoiceImage2Url
                              : defaultImage
                          "
                          @error="replaceImageByDefault"
                        />
                        <img
                          v-if="props.row.invoiceImage3Url"
                          style="display:none"
                          class="img-fluid media-img square-img"
                          alt="Invoice"
                          :src="
                            props.row.invoiceImage3Url
                              ? props.row.invoiceImage3Url
                              : defaultImage
                          "
                          @error="replaceImageByDefault"
                        />
                        <img
                          v-if="props.row.invoiceImage4Url"
                          style="display:none"
                          class="img-fluid media-img square-img"
                          alt="Invoice"
                          :src="
                            props.row.invoiceImage4Url
                              ? props.row.invoiceImage4Url
                              : defaultImage
                          "
                          @error="replaceImageByDefault"
                        />
                        <img
                          v-if="props.row.invoiceImage5Url"
                          style="display:none"
                          class="img-fluid media-img square-img"
                          alt="Invoice"
                          :src="
                            props.row.invoiceImage5Url
                              ? props.row.invoiceImage5Url
                              : defaultImage
                          "
                          @error="replaceImageByDefault"
                        />
                      </div>
                    </template>

                    <template slot="submissionDate" slot-scope="props">
                      <div class="inner-data">
                        {{ formatDate(props.row.submissionDate) }}
                      </div>
                    </template>

                    <template slot="reasonStringList" slot-scope="props">
                      <div class="inner-data">
                        <p
                          v-for="(reason, index) in props.row.reasonStringList"
                          :key="index"
                        >
                          {{ reason }}
                          <!-- <br /> -->
                        </p>
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div
                        class="inner-buttons btn-group float-right"
                        role="group"
                      >
                        <button
                          v-if="
                            props.row.checkStatus == null ||
                              props.row.statusId === reSubmissionId ||
                              isAdminAndFailedStatus(props.row.checkStatus)
                          "
                          type="button"
                          class="btn btn-info"
                          @click="doChangeStatus(props.row, 1)"
                        >
                          <i class="fa fa-check color-info"></i>APPROVE
                        </button>
                        <button
                          v-if="
                            props.row.checkStatus == null ||
                              props.row.statusId === reSubmissionId ||
                              isAdminAndFailedStatus(props.row.checkStatus)
                          "
                          type="button"
                          class="btn btn-warning"
                          @click="toggleRejectModal(props.row)"
                        >
                          <i class="fa fa-times color-warning"></i>REJECT
                        </button>
                        <!-- Commented out requested by fabian -->
                        <!-- <button
                          v-if="(props.row.checkStatus == null || props.row.statusId === reSubmissionId
                          || isAdminAndFailedStatus(props.row.checkStatus) ) && canEdit"
                          type="button"
                          @click="toggleEditModal(props.row) "
                          class="btn btn-primary"
                        >
                          <i class="fa fa-pencil color-primary"></i>EDIT
                        </button>-->
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

    <BModal ref="reject-modal" size="md" hide-footer title="Sale Reject">
      <form @submit.prevent="handleRejectSubmit">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group flex-grow-1">
              <label class="text-label">Failed Reason*</label>
              <Multiselect
                ref="multiselect"
                v-model="form.failedReason"
                placeholder="Select Reason"
                :searchable="true"
                :options="failedReasons"
                :multiple="true"
                label="text"
                track-by="id"
                :hide-selected="true"
                :clear-on-select="false"
                :close-on-select="false"
              ></Multiselect>
              <span v-if="formErrors.failedReason" class="invalid-field">{{
                formErrors.failedReason
              }}</span>
            </div>
          </div>
          <!-- <div class="col-lg-12">
            <div class="form-group flex-grow-1">
              <label class="text-label">Remarks</label>
              <textarea v-model="form.remarks" rows="3" class="form-control" />
              <span v-if="formErrors.remarks" class="invalid-field">{{formErrors.remarks}}</span>
            </div>
          </div>-->
        </div>
        <div class="row">
          <div class="col-lg-12">
            <button type="submit" class="btn btn-secondary pull-right">
              Submit
            </button>
          </div>
        </div>
      </form>
    </BModal>

    <!-- Edit Invoice details -->
    <BModal ref="edit-modal" size="md" hide-footer title="Edit Sale">
      <form @submit.prevent="handleSalesEditSubmit">
        <div class="row">
          <div class="col-lg-12">
            <div class="form-group flex-grow-1">
              <label class="text-label">Invoice Number</label>
              <span class="required-star">*</span>
              <input
                id="invoiceNumber"
                v-model="sale.invoiceNumber"
                name="invoiceNumber"
                type="text"
                class="form-control"
                placeholder
              />
              <span v-if="formErrors.invoiceNumber" class="invalid-field">{{
                formErrors.invoiceNumber
              }}</span>
            </div>
            <div class="form-group flex-grow-1">
              <label class="text-label">Invoice Date</label>
              <span class="required-star">*</span>
              <Datepicker
                v-model="sale.invoiceDate"
                :disabled-dates="disabledDates"
                input-class="form-control"
                name="invoiceDate"
              ></Datepicker>
              <span v-if="formErrors.invoiceDate" class="invalid-field">{{
                formErrors.invoiceDate
              }}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <button type="submit" class="btn btn-secondary pull-right">
              Update
            </button>
          </div>
        </div>
      </form>
    </BModal>
  </div>
</template>

<script>
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import Datepicker from "vuejs-datepicker";
import {
  GET_SALES_DATA_REQUEST,
  UPDATE_SALES_DATA_REQUEST
} from "../../store/modules/sales/actions";
import { Message } from "element-ui";
import {
  SALES_STATUS_LIST_REQUEST,
  SERIAL_TYPE_LIST_REQUEST,
  CHECK_STATUS_REQUEST,
  FAILED_REASON_REQUEST,
  COUNTRY_LIST_REQUEST
} from "../../store/modules/utility/actions";
import default_image from "../../assets/default_image.jpg";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import Multiselect from "vue-multiselect";
import "viewerjs/dist/viewer.css";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_CLOSE
} from "../../store/modules/ui/actions";

const today = new Date();
export default {
  name: "SalesData",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,
    DateRangePicker: DateRangePicker,
    BModal: BModal,
    Multiselect: Multiselect,
    Datepicker: Datepicker
  },
  computed: {
    isReSubmissionStatus() {
      if (this.search.status.id == 87) {
        return true;
      } else {
        return false;
      }
    },
    isRegionAdmin() {
      return this.$store.getters.isRegionAdmin;
    },
    isCountryAdmin() {
      return this.$store.getters.isCountryAdmin;
    },
    isCountryAdminMalaysia() {
      const role = this.$store.getters.isCountryAdmin;
      const country = this.$store.getters.getCountryCode;
      return role && country === "MY";
    },
    isDealer() {
      return this.$store.getters.isDealer;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isAgency() {
      return this.$store.getters.isAgency;
    },
    isChecker() {
      return this.$store.getters.isChecker;
    }
  },
  data() {
    return {
      defaultImage: default_image,
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
      disabledDates: {},
      datePicker: {
        opens: "right",
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
          label: "Sales ID",
          sort: true
          // visibility: false
        },
        {
          name: "staffName",
          label: "Staff Name",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "staffId",
          label: "Staff Id",
          visibility: false
        },
        {
          name: "outletName",
          label: "Outlet Info",
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "productName",
          label: "Product Info",
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "invoiceNumber",
          label: "Invoice Info",
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "submissionDate",
          label: "Submission Date",
          sort: true,
          width: "13%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default,
        },
        {
          name: "invoiceImageUrl",
          label: "Invoice Image",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "serialStatus",
          label: "Serial No. Status", //Serial Status
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "checkStatus",
          label: "Validation", //Check Status
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "reasonStringList",
          label: "Reason",
          width: "12%",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletAddress",
          label: "Outlet Address",
          visibility: false
        },
        {
          name: "serialNo",
          label: "Serial No",
          visibility: false
        },
        {
          name: "productSku",
          label: "Product Sku",
          visibility: false
        },
        {
          name: "invoiceDate",
          label: "Invoice Date",
          visibility: false
        }
      ],
      total: 0,
      salesList: [],
      statusList: [],
      serialTypes: [],
      search: {
        serialType: 88
      },
      checkStatuses: [],
      failedReasons: [],
      formErrors: [],
      form: {},
      sale: {},
      reasonNote: "",
      countries: [],
      /* eslint-disable no-dupe-keys */
      // eslint-disable-next-line vue/no-dupe-keys
      search: {
        status: { id: 82, text: "NEW" }
      },
      countryId: null,
      canApprove: false,
      canReject: false,
      canEdit: false,
      getCountriesIsLoading: false,
      getStatusListIsLoading: false,
      reSubmissionId: 87,
      isDataLoading: false
    };
  },
  methods: {
    toggleRejectModal(row) {
      this.sale = row;
      this.$refs["reject-modal"].toggle("#toggle-btn");
    },
    toggleEditModal(row) {
      this.sale = row;
      this.$refs["edit-modal"].toggle("#toggle-btn");
    },
    updateDateValues() {},
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getSalesDataList();
    },
    getSalesDataList() {
      this.isDataLoading = true;
      this.salesList = [];
      if (this.isRegionAdmin && !this.countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");
      // eslint-disable-next-line no-unused-vars
      let sId = this.getDataRowByName(this.statusList, "All");
      let pData = {
        startDate: startDate,
        endDate: endDate,
        statusId: this.search.status ? this.search.status.id : 82,
        serialNumberTypeId: this.search.serialType
          ? this.search.serialType
          : 88,
        countryId: this.search.countryId ? this.search.countryId.id : null
      };

      this.$store.dispatch(GET_SALES_DATA_REQUEST, pData).then(res => {
        if (res.content && res.resultCode === 0) {
          if (res.content.length <= 0) {
            Message({
              message: "No Sales Data Found!",
              type: "error",
              duration: 5 * 1000
            });
          }
          this.salesList = res.content;
          this.total = this.salesList.length;
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getSalesDataList();
    },
    doDownload() {},
    handleSalesEditSubmit() {
      this.formErrors = {};

      if (!this.sale.invoiceDate) {
        this.formErrors.invoiceDate = "Invoice date is required.";
      } else if (!this.sale.invoiceNumber) {
        this.formErrors.invoiceNumber = "Invoice number is required.";
      } else {
        this.$store.dispatch(NOTIFICATION_REQUEST, {
          message: "Submitting..."
        });

        this.formErrors = {};
        let pData = {
          id: this.sale.id,
          invoiceDate: this.formatDate(this.sale.invoiceDate, "YYYY-MM-DD"),
          invoiceNumber: this.sale.invoiceNumber
        };
        this.$store.dispatch(UPDATE_SALES_DATA_REQUEST, pData).then(res => {
          if (res.resultCode === 0) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Sale Successfully Updated."
            });

            this.getSalesDataList();
            this.$refs["edit-modal"].toggle("#toggle-btn");
          } else {
            this.$store.dispatch(NOTIFICATION_CLOSE, {
              message: ""
            });
          }
        });
      }
    },
    handleRejectSubmit() {
      this.formErrors = {};
      let error = 0;

      if (!this.form.failedReason) {
        this.formErrors.failedReason = "Reason is required.";
        error++;
      } else {
        if (this.form.failedReason.length <= 0) {
          this.formErrors.failedReason = "Reason is required.";
          error++;
        }
      }

      if (error) {
        return false;
      } else {
        this.doChangeStatus(this.sale, 0);
      }
    },
    doChangeStatus(row, status) {
      let pData = {};
      // alert(staus === 1);
      if (status === 1) {
        let statusId = 90;
        this.form.remarks = "";
        pData = {
          id: row.id,
          checkStatusId: statusId,
          reasonId: null,
          remarks: this.form.remarks
        };

        this.$buefy.dialog.confirm({
          message:
            status == 1
              ? "Do you want to <b class='red-heighlighted'>approve</b> this record"
              : "Do you want to <b class='red-heighlighted'>reject</b> this record",
          onConfirm: () => {
            this.$store.dispatch(UPDATE_SALES_DATA_REQUEST, pData).then(res => {
              if (res.resultCode === 0) {
                this.getSalesDataList();
                Message({
                  message: status == 1 ? "Approved." : "Rejected.",
                  type: "success",
                  duration: 5 * 1000
                });
              }
            });
          }
        });
      } else {
        let statusId = 91; // this.checkStatuses.
        let reasonIds = [];
        // alert(this.form.remarks);
        this.form.failedReason.forEach(reason => {
          reasonIds.push(reason.id);
        });

        pData = {
          id: row.id,
          checkStatusId: statusId,
          reasonId: reasonIds,
          remarks: this.form.remarks
        };

        this.$buefy.dialog.confirm({
          message:
            status == 1
              ? "Do you want to approve this record"
              : "Do you want to reject this record",
          onConfirm: () => {
            // pData.remarks = value;
            this.$store.dispatch(UPDATE_SALES_DATA_REQUEST, pData).then(res => {
              if (res.resultCode === 0) {
                this.getSalesDataList();
                this.sale = {};
                this.$refs["reject-modal"].toggle("#toggle-btn");

                Message({
                  message: status == 1 ? "Approved." : "Rejected.",
                  type: "success",
                  duration: 5 * 1000
                });
              }
            });
          }
        });
      }
      // let pData = {};
    },
    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
    },
    getStatusList() {
      this.getStatusListIsLoading = true;
      this.$store.dispatch(SALES_STATUS_LIST_REQUEST).then(res => {
        if (res.resultCode === 0) {
          this.statusList = res.content;

          this.search.status = this.getDataRowByName(this.statusList, "New");
          // alert(JSON.stringify(this.search.status));
        }
        this.getStatusListIsLoading = false;
      });
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
    getSerialTypes() {
      this.$store.dispatch(SERIAL_TYPE_LIST_REQUEST).then(res => {
        if (res.resultCode === 0) {
          this.serialTypes = res.content;
        }
      });
    },
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    getCheckStatus() {
      this.$store.dispatch(CHECK_STATUS_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.checkStatuses = res.content;
        }
      });
    },
    getFailedReasons() {
      this.$store.dispatch(FAILED_REASON_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.failedReasons = res.content;
        }
      });
    },
    getCountries() {
      this.getCountriesIsLoading = true;
      this.$store.dispatch(COUNTRY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.countries = res.content;
        }
        this.getCountriesIsLoading = false;
      });
    },
    isAdminAndFailedStatus(status) {
      if (
        (this.isAdmin || this.isCountryAdminMalaysia) &&
        status === "FAILED"
      ) {
        return true;
      }
    },
    userRoleAdjustments() {
      if (
        this.isCountryAdmin ||
        this.isAgency ||
        this.isAdmin ||
        this.isChecker
      ) {
        this.canApprove = true;
        this.canReject = true;

        this.columns.splice(4, 0, {
          name: "dealerName",
          label: "Dealer Info",
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        });
        this.columns.push({
          name: "Action",
          label: "Action",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        });
      } else if (this.isDealer) {
        this.canApprove = false;
        this.canReject = false;
      } else {
        this.canApprove = false;
        this.canReject = false;
      }

      if (this.isAdmin || this.isChecker || this.isCountryAdminMalaysia) {
        this.canEdit = true;
      }
    }
  },
  mounted() {
    this.userRoleAdjustments();
    this.getStatusList();
    this.getSerialTypes();
    this.getFailedReasons();
    this.getCheckStatus();

    this.getCountries();

    if (!this.isRegionAdmin) {
      this.getSalesDataList();
    }
  }
};
</script>
