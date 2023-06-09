<template>
  <div id="sales-data">
    <div class="row">
      <div class="col-lg-12">
        <div>
          <div>
            <div class>
              <div class="row">
                <div
                  :class="{
                    'col-lg-6': !isRegionAdmin,
                    'col-lg-3': isRegionAdmin
                  }"
                >
                  <label class="text-label">Date Range</label>
                  <select
                    id="year"
                    v-model="selectedYear"
                    class="form-control"
                    @change="onYearChange($event)"
                  >
                    <option v-for="(year, index) of yearList" :key="index">
                      {{
                        year
                      }}
                    </option>
                  </select>
                </div>

                <div v-if="isRegionAdmin" class="col-lg-3">
                  <div class="form-group flex-grow-1">
                    <label class="text-label">Country</label>
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
                      :loading="isCountriesLoading"
                    ></Multiselect>
                  </div>
                </div>

                <div class="col-lg-3">
                  <div class="form-group flex-grow-1">
                    <br />
                    <button
                      type="button"
                      class="btn btn-primary btn-lg pull-right"
                      @click="doSearch()"
                    >
                      <i class="fa fa-search"></i> SEARCH
                    </button>
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
                      <div class="bold-text">No Sales Data Found!</div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="staffName" slot-scope="props">
                      <div class="inner-data">
                        <i v-if="props.row.staffId" class="fa fa-id-card-o"></i>
                        {{ props.row.staffId }}
                        <br />
                        <i v-if="props.row.staffName" class="fa fa-id-card"></i>
                        {{ props.row.staffName }}
                        <br />
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
                      <div v-viewer class="images clearfix">
                        <img
                          class="profile-pic"
                          alt="Invoice"
                          :src="
                            props.cell_value ? props.cell_value : defaultImage
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
                :loading="isReasonsLoading"
                select-label
                deselect-label
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
  </div>
</template>

<script>
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import { GET_SALES_DATA_REQUEST } from "../../store/modules/sales/actions";
import { Message } from "element-ui";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import Multiselect from "vue-multiselect";
import "viewerjs/dist/viewer.css";

export default {
  name: "SalesDataSummary",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,

    BModal: BModal,
    Multiselect: Multiselect
  },
  computed: {},
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
          label: "No Validated",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "submissionMessage",
          label: "Resubmission Message",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "resubmissionPending",
          label: "Resubmission Pending for validation",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
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
      isRegionAdmin: false,
      isDealer: false,
      countries: [],
      /* eslint-disable no-dupe-keys */
      // eslint-disable-next-line vue/no-dupe-keys
      search: {
        status: {}
      },
      countryId: null,
      yearList: [],
      selectedYear: 0,
      isCountriesLoading: false,
      isReasonsLoading: false
    };
  },
  methods: {
    setDefaultData() {
      if (!this.selectedYear) {
        this.selectedYear = new Date().getFullYear();
      }
    },
    onYearChange() {
      // eslint-disable-next-line no-undef
      this.getSalesDataList(tdata);
    },
    updateDateValues() {},
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getSalesDataList();
    },
    getSalesDataList() {
      let pData = {
        year: this.selectedYear
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
        }
      });
    },
    doSearch() {
      this.getSalesDataList();
    },
    doDownload() {},

    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
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
    setYears() {
      const year = new Date().getFullYear() - 3;
      for (let i = 0; i <= 6; i++) {
        let yr = year + i;
        this.yearList.push(yr);
      }

      return this.yearList;
    }
  },
  mounted() {
    this.setYears();
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isDealer = this.$store.getters.isDealer;
    this.getSalesDataList();
  },
  created() {
    // this.getSalesDataList();
  }
};
</script>
