<template>
  <div id="product-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Download"
      sub-sub-title="Unknown Serial Number"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12">
                  <div class="row">
                    <div class="col-9">
                      <div class="row">
                        <div v-if="isRegionAdmin" class="col-lg-5">
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
                              @input="getserialList()"
                            ></Multiselect>
                          </div>
                        </div>
                        <div
                          :class="{
                            'col-lg-10': !isRegionAdmin,
                            'col-lg-5': isRegionAdmin
                          }"
                        >
                          <label class="text-label">Select Period (NOTE: Based on Invoice Date)</label>
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
                              getserialList();
                            "
                          >
                            <div slot="input" slot-scope="picker">
                              <span v-if="picker.startDate && picker.endDate">{{ formatDate(picker.startDate) }} to
                                {{ formatDate(picker.endDate) }}</span>
                            </div>
                          </DateRangePicker>
                        </div>
                      </div>
                    </div>
                    <div class="ml-auto d-flex align-items-center">
                      <button
                        v-if="canDownload"
                        class="btn btn-card btn-primary"
                        @click="downloadData"
                      >
                        <i class="fa fa-download"></i> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <br />

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="serialList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getserialList"
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
                      <div class="bold-text">No Serials Found!</div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="outletName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">
                          <i class="fa fa-building-o"></i>
                          {{ " " }}{{ props.row.outletName }}
                        </span>
                        <br />
                        <span>
                          <i class="fa fa-map-marker"></i>
                          {{ " " }} {{ props.row.outletAddress }}
                        </span>
                      </div>
                    </template>
                    <template slot="productName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">
                          <i class="fa fa-barcode"></i>
                          {{ " " }} {{ props.row.serialNo }}
                        </span>
                        <br />
                        <span>
                          <i class="fa fa-laptop"></i>
                          {{ " " }} {{ props.row.productName }}
                        </span>
                        <br />
                        <span>
                          <i class="fa fa-bars"></i>
                          {{ " " }} {{ props.row.productSku }}
                        </span>
                      </div>
                    </template>

                    <template slot="submissionDate" slot-scope="props">
                      <div class="inner-data">
                        <span>{{
                          formatDateTime(props.row.submissionDate)
                        }}</span>
                      </div>
                    </template>

                    <template slot="invoiceNumber" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">
                          <i class="fa fa-file-text-o"></i>
                          {{ " " }} {{ props.row.invoiceNumber }}
                        </span>
                        <br />
                        <span>
                          <i class="fa fa-calendar"></i>
                          {{ " " }} {{ formatDate(props.row.invoiceDate) }}
                        </span>
                      </div>
                    </template>

                    <!-- <template slot="invoiceImageUrl" slot-scope="props">
                      <img
                        class="profile-pic pic-circle zoom-image"
                        alt="Invoice"
                        :src="props.cell_value?props.cell_value:defaultImage"
                        @error="replaceImageByDefault"
                      />
                    </template>-->

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
import { Message } from "element-ui";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { UNKNOWN_SERIAL_REQUEST } from "../../store/modules/sales/actions";
import DateRangePicker from "../../components/ui/vue2-daterange-picker";
import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import default_image from "../../assets/default_image.jpg";
import { export_json_to_excel } from "../../utils/Export2Excel";
import Multiselect from "vue-multiselect";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";

const today = new Date();

export default {
  name: "ProductsPage",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    DateRangePicker,
    Multiselect: Multiselect
  },
  computed: {},
  data() {
    return {
      canDownload: false,
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
      excel_fields: {
        No: "id",
        Family_Name: "name",
        Brand: "productGroupId",
        Series: "productSubGroupId",
        Product_Type: "deviceType"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Serials",
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
          label: "ID",
          sort: true,
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "staffName",
          label: "Staff Information",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletName",
          label: "Outlet Information",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "productName",
          label: "Product Information",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "invoiceNumber",
          label: "Invoice Information",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "submissionDate",
          label: "Submission Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "invoiceImageUrl",
          label: "Invoice Image",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "serialStatus",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          label: "Serial Status"
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
      serialList: [],
      productGroups: [],
      productSubGroups: [],
      product: {},
      search: {
        serialType: 89
      },
      isRegionAdmin: false,
      isCountryAdmin: false,
      countries: [],
      isCountriesLoading: false
    };
  },
  methods: {
    updateDateValues() {},
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getserialList();
    },
    getserialList() {
      this.serialList = [];
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");
      let countryId = this.search.countryId ? this.search.countryId.id : null;

      if (this.isRegionAdmin) {
        if (!this.search.countryId) {
          return Message({
            message: "Select a country",
            type: "error",
            duration: 5 * 1000
          });
        }
      }

      let pData = {
        startDate: startDate,
        endDate: endDate,
        serialNumberTypeId: this.search.serialType
          ? this.search.serialType
          : 89,
        countryId: countryId
      };

      this.$store.dispatch(UNKNOWN_SERIAL_REQUEST, pData).then(res => {
        if (res.content && res.resultCode === 0) {
          this.serialList = res.content;
        }
      });
    },
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    downloadData() {
      this.serialList = [];
      let startDate = convertDateFormat(this.dateRange.startDate, "YYYY-MM-DD");
      let endDate = convertDateFormat(this.dateRange.endDate, "YYYY-MM-DD");
      let countryId = this.search.countryId ? this.search.countryId.id : null;

      if (this.isRegionAdmin) {
        if (!this.search.countryId) {
          return Message({
            message: "Select a country",
            type: "error",
            duration: 5 * 1000
          });
        }
      }

      let pData = {
        startDate: startDate,
        endDate: endDate,
        serialNumberTypeId: this.search.serialType
          ? this.search.serialType
          : 89,
        countryId: countryId
      };

      this.$store.dispatch(UNKNOWN_SERIAL_REQUEST, pData).then(res => {
        if (res.content && res.resultCode === 0) {
          this.serialList = res.content;
          this.doExport(this.serialList, pData);
        }
      });
    },
    doExport(exdata, post) {
      const tHeader = [
        "Staff Name",
        "Outlet Name",
        "Outlet Address",
        "Serial Number",
        "Product SKU",
        "Product Name",
        "Invoice No",
        "Invoice Date",
        "Serial Status",
        "Submission Date"
      ];
      const filterVal = [
        "staffName",
        "outletName",
        "outletAddress",
        "serialNo",
        "productSku",
        "productName",
        "invoiceNumber",
        "invoiceDate",
        "serialStatus",
        "submissionDate"
      ];
      const data = this.formatJson(filterVal, exdata);
      const fileName = "unknwonSerials-" + post.startDate + "-" + post.endDate;

      if (exdata.length <= 0) {
        Message({
          message: "No sales data found on selected period!",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        export_json_to_excel({
          header: tHeader,
          data,
          filename: fileName,
          sheetName: "Sheet 1",
          autoWidth: true,
          bookType: "xlsx"
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            if (v[j] !== null) {
              return convertDateFormat(v[j], "YYYY-MM-DD");
            }
            return v[j];
          }
          if (j === "submissionDate") {
            if (v[j] !== null) {
              return convertDateFormat(v[j], "YYYY-MM-DD hh:mm A");
            }
            return v[j];
          } else {
            return v[j];
          }
        })
      );
    },
    formatDate: function(date) {
      //   return new Date(date); // new Date(strtotime(date), "YYYY-mm-dd hh:ii:ss A");
      return convertDateFormat(date, "YYYY-MM-DD");
      // return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    },
    formatDateTime: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD hh:mm A");
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
    }
  },
  mounted() {
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;

    if (this.isRegionAdmin || this.isCountryAdmin) {
      this.canDownload = true;
    } else {
      this.canDownload = false;
    }

    if (!this.isRegionAdmin) {
      this.getserialList();
    }
  },
  created() {
    // this.getserialList();
  }
};
</script>
