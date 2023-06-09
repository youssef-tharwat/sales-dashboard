<template>
  <div id="check-serial">
    <breadcrumb title="Dashboard" subtitle="Check Serial Number" />

    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class>
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group flex-grow-1">
                    <label
                      class="text-label"
                      v-text="$ml.get('title_serial_number')"
                    ></label>
                    <input
                      id="serial"
                      v-model="search.serial"
                      type="text"
                      class="form-control"
                      @keyup="doSearch()"
                    />
                  </div>
                </div>
                <div v-if="serialData.country == null" class="col-lg-12">
                  <!-- <p>NOTE: Below Serial information show when Serial not Found and does not belong to other country</p> -->
                  <p>
                    Serial : {{ serialData.serialNo }}
                    <br />
                    MTM Number : {{ serialData.modelName }}
                    <br />
                    Product Family : {{ serialData.familyName }}
                    <br />
                    Added Date : {{ formatDate(serialData.addedDate) }}
                    <br />
                    Status : {{ serialData.status }}
                    <br />
                    Upload from file : {{ serialData.uploadFromFile }}
                    <br />
                    Paid to : {{ serialData.paidTo }}
                    <br />
                    Outlet : {{ serialData.outlet }}
                    <br />
                    Distributor : {{ serialData.distributor }}
                  </p>
                </div>
                <div v-else-if="serialData.country !== null" class="col-lg-12">
                  <p>
                    Serial : {{ serialData.serialNo }}
                    <br />
                    MTM Number : {{ serialData.modelName }}
                    <br />
                    Product Family : {{ serialData.familyName }}
                    <br />
                    Country Name : {{ serialData.country }}
                  </p>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="submissionList"
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
                        class="bold-text"
                        v-text="$ml.get('no_data_found')"
                      ></div>
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
                      </div>
                      <!-- <img
                        class="profile-pic pic-circle zoom-image"
                        alt="Invoice"
                        :src="props.cell_value?props.cell_value:defaultImage"
                        @error="replaceImageByDefault"
                      />-->
                    </template>

                    <template slot="submissionDate" slot-scope="props">
                      <div class="inner-data">
                        {{ formatDate(props.row.submissionDate) }}
                      </div>
                    </template>
                    <template slot="invoiceDate" slot-scope="props">
                      <div class="inner-data">
                        {{ formatDate(props.row.invoiceDate) }}
                      </div>
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div class="inner-buttons float-left">
                        <button
                          v-if="props.row.checkStatus == null"
                          type="button"
                          class="btn btn-rounded btn-info"
                          @click="doChangeStatus(props.row, 1)"
                        >
                          <span class="btn-icon-left text-info">
                            <i class="fa fa-check color-info"></i> </span>APPROVE
                        </button>
                        <button
                          v-if="props.row.checkStatus == null"
                          type="button"
                          class="btn btn-rounded btn-warning"
                          @click="toggleRejectModal(props.row)"
                        >
                          <span class="btn-icon-left text-warning">
                            <i class="fa fa-times color-warning"></i> </span>REJECT
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
import { convertDateFormat } from "../../utils/helpers";
import { CHECK_SERIAL_REQUEST } from "../../store/modules/sales/actions";
import default_image from "../../assets/default_image.jpg";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
export default {
  name: "CheckSerialNumber",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table
  },
  computed: {},
  data() {
    return {
      defaultImage: default_image,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Serial Data",
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
          name: "staffName",
          label: "Staff Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerName",
          label: "Dealer Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletName",
          label: "Outlet Name",
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
          name: "invoiceDate",
          label: "Invoice Date",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "serialStatus",
          label: "Status",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      serialData: {},
      submissionList: [],
      search: {},
      showErrorInfo: false
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
    },
    getSerialDataList() {
      this.showErrorInfo = false;
      let pData = {
        serial: this.search.serial
      };

      if (this.search.serial.length >= 8) {
        this.$store.dispatch(CHECK_SERIAL_REQUEST, pData).then(res => {
          this.submissionList = [];
          if (res.content && res.resultCode === 0) {
            this.serialData = res.content;
            this.submissionList = res.content.submissionList;
            this.total = this.submissionList.length;
          }
        });
      }
    },
    doSearch() {
      this.getSerialDataList();
    },
    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD hh:mm A");
    },
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    }
  },
  mounted() {},
  created() {}
};
</script>
