<template>
  <div id="outlet-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Outlet Management"
      sub-sub-title="Outlet Details"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div
                  class="col-lg-12 add-employee-button d-flex align-items-center"
                >
                  <b-field class="mr-auto" grouped group-multiline>
                    <div
                      class="control clickable"
                      @click="filterList('normal')"
                    >
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Outlets</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ outletList.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div
                      class="control clickable"
                      @click="filterList('active')"
                    >
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Active</b-tag>
                        <b-tag type="is-success" size="is-large">
                          <strong>{{ outletListActive.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div
                      class="control clickable"
                      @click="filterList('deactivated')"
                    >
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">
                          Deactivated
                        </b-tag>
                        <b-tag type="is-danger" size="is-large">
                          <strong>{{ outletListDeactivate.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control clickable" @click="filterList('noPic')">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">No PIC</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ outletListNoPic.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <button
                    v-if="canAdd"
                    class="btn btn-sm btn-primary"
                    @click="toggleModal({})"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_outlet_title')"></span>
                  </button>
                  <!-- <download-excel
                    :data="outletList"
                    :fields="excel_fields"
                    class="btn btn-sm btn-primary"
                    type="xls"
                    name="outlets.xls"
                  >
                    <i class="fa fa-file-excel-o"></i> Export to Excel
                  </download-excel>-->

                  <button
                    v-if="canExport"
                    class="btn btn-sm btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-file-excel-o"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
                  </button>

                  <!-- <button class="btn btn-sm btn-primary" @click="toggleUploadModal">
                    <i class="fa fa-upload"></i> Upload Outlet
                  </button>-->
                </div>
              </div>
              <br />

              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="filterState"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getOutletList"
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
                        v-text="$ml.get('no_outlet_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="name" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.name }}</span>
                        <br />
                        <span>{{ props.row.dealerCode }}</span>
                        <br />
                        <span v-if="props.row.dealerOutletCode">{{
                          props.row.dealerOutletCode
                        }}</span>
                        <br v-if="props.row.dealerOutletCode" />
                        <span v-if="props.row.address">
                          <i class="fa fa-map-marker"></i>
                          {{ " " }} {{ props.row.address }}
                        </span>
                      </div>
                    </template>

                    <template slot="dealerCode" slot-scope="props">
                      <div class="inner-data">
                        <b>{{ props.row.dealerCode }}</b>
                      </div>
                    </template>

                    <template slot="outletCode" slot-scope="props">
                      <div
                        v-if="!isPromoLeader"
                        class="inner-data align-center link"
                        @click="toggleQrModal(props.row)"
                      >
                        <i class="fa fa-qrcode barcode-icon"></i>
                        <!-- <qr-code class="qr-code" :text="props.row.dealerCode"></qr-code> -->
                      </div>
                    </template>

                    <template slot="picName" slot-scope="props">
                      <b>{{ props.row.picName }}</b>
                      <br />
                      <span v-if="props.row.picEmail">
                        <i class="fa fa-envelope-o"></i>
                        {{ " " }}{{ props.row.picEmail }}
                      </span>
                    </template>

                    <template slot="dealerName" slot-scope="props">
                      <b>{{ props.row.dealerName }}</b>
                      <br />
                      <span>{{ props.row.lppCode }}</span>
                    </template>

                    <template slot="status" slot-scope="props">
                      <!-- <span>{{props.row.status }}</span> -->
                      <!-- <span
                        class="label label-rounded label-success"
                        v-if="props.row.status ==='ACTIVE'"
                        v-text="$ml.get('active_status_text')"
                      >></span>
                      <span
                        class="label label-rounded label-danger"
                        v-if="props.row.status ==='DEACTIVATED'"
                        v-text="$ml.get('deactive_status_text')"
                      >></span>-->
                      <lnvStatusTextBox :status="props.row.status" />
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div
                        class="inner-buttons btn-group float-right"
                        role="group"
                      >
                        <button
                          v-if="canEdit"
                          class="btn btn-warning btn-xs"
                          @click="toggleModal(props.row)"
                        >
                          <i class="fa fa-edit"></i>
                          <span v-text="$ml.get('button_edit_text')">></span>
                        </button>
                        <button
                          v-if="canChangeStatus"
                          class="btn btn-danger btn-xs"
                          @click="doChangeStatus(props.row)"
                        >
                          <i class="fa fa-exchange"></i>
                          <span v-text="$ml.get('button_status_text')">></span>
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

    <BModal ref="outlet-modal" size="lg" hide-footer :title="outletFormTitle">
      <outletForm
        :close-modal="toggleModal"
        :selected-outlet="outlet"
        :load-data="getOutletList"
      />
    </BModal>

    <BModal ref="upload-modal" size="xl" hide-footer title="Upload">
      <excelUploadForm
        :close-modal="toggleUploadModal"
        :validations="validateFields"
        :sample-file="sampleFile"
        :content="content"
        :set-post-data="setPostData"
        :show-data-list="true"
        :submit-button-text="'Submit'"
        :get-upload-file="getUploadFile"
        :file-columns="fileColumnStructure"
      />
    </BModal>

    <BModal ref="outlet-qr-modal" size="md" hide-footer title="QR CODE">
      <qr-code class="qr-code-lg" :text="selectedDealerCode"></qr-code>
    </BModal>
  </div>
</template>

<script>
import Message from "element-ui";
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import outletForm from "../../components/outlets/outlet_form";
import { BModal } from "bootstrap-vue";

import {
  OUTLET_LIST_REQUEST,
  OUTLET_PIC_LIST_REQUEST,
  OUTLET_POST_REQUEST,
  OUTLET_BULK_UPLOAD_REQUEST
} from "../../store/modules/outlet/actions";
import excelUploadForm from "../../components/excel_upload/index";
import { export_json_to_excel } from "../../utils/Export2Excel";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { DEALER_LIST_REQUEST } from "../../store/modules/dealer/actions";
import { convertDateFormat } from "../../utils/helpers";
import {
  STATE_LIST_REQUEST,
  CATEGORY_LIST_REQUEST
} from "../../store/modules/utility/actions";
import "viewerjs/dist/viewer.css";
import lnvStatusTextBox from "../../components/ui/statusTextBox";

export default {
  name: "OutletsPage",
  components: {
    breadcrumb: breadcrumb,
    outletForm: outletForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.outletList;
      } else if (this.activeList) {
        return this.outletListActive;
      } else if (this.deactivatedList) {
        return this.outletListDeactivate;
      } else if (this.noPicList) {
        return this.outletListNoPic;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      outletFormTitle: "Add Outlet",
      sampleFile: "outletUploadFile.xlsx",
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      excel_fields: {
        No: "id",
        Outlet_name: "name",
        Address: "address",
        PIC: "pic_name",
        PIC_Email: "email"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Outlets",
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
          visibility: false
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        // {
        //   name: "dealerCode",
        //   label: "Outlet Code",
        //   sort: true,
        //   width: "10%",
        //   row_text_alignment: "text-left",
        //   column_text_alignment: "text-left"
        // },
        {
          name: "name",
          label: "Outlet Info",
          sort: true,
          width: "17%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "address",
          label: "Address",
          visibility: false
        },
        {
          name: "picEmail",
          label: "PIC Email",
          visibility: false
        }
      ],
      fileColumnStructure: [
        "Outlet Name",
        "Dealer Name",
        "Category",
        "State",
        "Area",
        "Postcode",
        "Address",
        "PIC Name"
      ],
      total: 0,
      outletList: [],
      outletListActive: [],
      outletListDeactivate: [],
      outletListNoPic: [],
      outlet: {},
      postOutletData: [],
      dealers: [],
      states: [],
      categories: [],
      picList: [],
      isPicOutlet: false,
      selectedDealerCode: "",
      canAdd: false,
      canEdit: false,
      canUpload: false,
      canView: false,
      canExport: false,
      isPromoLeader: false,
      canChangeStatus: false,
      isDealer: false,
      isCountryAdmin: false,
      isDataLoading: false,
      normal: true,
      activeList: false,
      deactivatedList: false,
      noPicList: false,
      isAgency: false
    };
  },
  methods: {
    showModal() {
      this.$refs["outlet-modal"].show();
    },
    hideModal() {
      this.$refs["outlet-modal"].hide();
    },
    toggleQrModal(row) {
      this.selectedDealerCode = row.dealerCode;
      this.$refs["outlet-qr-modal"].toggle("#toggle-btn");
    },
    toggleModal(row) {
      if (row) {
        this.outlet = row;
        if (row.id) {
          this.outletFormTitle = "Update Outlet";
        } else {
          this.outletFormTitle = "Add Outlet";
        }
      } else {
        this.outlet = {};
        this.outletFormTitle = "Add Outlet";
      }
      this.$refs["outlet-modal"].toggle("#toggle-btn");
    },
    toggleUploadModal() {
      this.getDealers();
      this.getStates();
      this.getCategories();
      this.getPicList();
      this.$refs["upload-modal"].toggle("#toggle-btn2");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getOutletList();
    },
    getOutletList() {
      this.total = 0;
      this.outletList = [];
      this.isDataLoading = true;
      this.$store.dispatch(OUTLET_LIST_REQUEST, {}).then(res => {
        if (res.content && res.resultCode === 0) {
          this.outletList = res.content;
          this.total = this.outletList.length;
          this.getStats();
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doDelete(row) {
      window.alert("deleting item ID" + JSON.stringify(row));
    },
    doEdit(row) {
      this.outletFormTitle = "Update Outlet";
      this.outlet = row;
      this.toggleModal();
    },
    doChangeStatus(row) {
      this.$buefy.dialog.confirm({
        message:
          row.status == "ACTIVE"
            ? "Do you want to <b class='red-heighlighted'>deactivete</b> " +
              row.name
            : "Do you want to <b class='red-heighlighted'>activete</b> " +
              row.name,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
          row.change_status = true;
          this.$store.dispatch(OUTLET_POST_REQUEST, row).then(() => {
            this.getOutletList();
            Message({
              message:
                row.status == "ACTIVE"
                  ? "Outlet Deactivated."
                  : "Outlet Activated.",
              type: "success",
              duration: 5 * 1000
            });
          });
        }
      });
    },
    doDeactivate() {},
    doActivate() {},
    doExport() {
      let tHeader = [];
      let filterVal = [];

      if (this.isDealer) {
        tHeader = [
          "Outlet Code",
          "Outlet Name",
          "Category",
          "Address",
          "Region",
          "State",
          "Area",
          "Postcode",
          "PIC Name",
          "Status"
        ];
        filterVal = [
          "dealerCode",
          "name",
          "type",
          "address",
          "region",
          "state",
          "area",
          "postCode",
          "picName",
          "status"
        ];
      } else if (this.isPicOutlet) {
        tHeader = [
          "Outlet Code",
          "Outlet Name",
          "Category",
          "Address",
          "Region",
          "State",
          "Area",
          "Postcode",
          "PIC Name",
          "Status"
        ];
        filterVal = [
          "dealerCode",
          "name",
          "type",
          "address",
          "region",
          "state",
          "area",
          "postCode",
          "picName",
          "status"
        ];
      } else if (this.isCountryAdmin || this.isAgency) {
        tHeader = [
          "Outlet Code",
          "Outlet Name",
          "Category",
          "Address",
          "LPP Code",
          "Dealer Name",
          "Country",
          "Region",
          "State",
          "Area",
          "Postcode",
          "Status"
        ];
        filterVal = [
          "dealerCode",
          "name",
          "type",
          "address",
          "lppCode",
          "dealerName",
          "country",
          "region",
          "state",
          "area",
          "postCode",
          "status"
        ];
      } else {
        tHeader = [
          "Outlet Code",
          "Outlet Name",
          "Address",
          "LPP Code",
          "Dealer Name",
          "Category",
          "State",
          "Area",
          "Postcode",
          "Country",
          "PIC Name",
          "Status"
        ];
        filterVal = [
          "dealerCode",
          "name",
          "address",
          "lppCode",
          "dealerName",
          "type",
          "state",
          "area",
          "postCode",
          "country",
          "picName",
          "status"
        ];
      }

      const data = this.formatJson(filterVal, this.outletList);
      const fileName = "dealerOutlet";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "dealerOutlets",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
          } else if (j === "status") {
            return v[j] === "ACTIVE" ? "Active" : "Deactive";
          } else {
            return v[j];
          }
        })
      );
    },
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      switch (field) {
        case "Outlet Name":
          isValid = true;
          break;
        case "Dealer Name":
          isValid = this.isValidDealer(value);
          break;
        case "Category":
          isValid = this.isValidCategory(value);
          break;
        case "State":
          isValid = this.isValidState(value);
          break;
        case "Area":
          isValid = true;
          break;
        case "Postcode":
          isValid = true;
          break;
        case "Address":
          isValid = true;
          break;
        case "PIC Name":
          isValid = this.isValidPic(value);
          break;
        default:
          isValid = true;
          break;
      }

      if (!isValid) {
        value = '<span class="invalid-field">' + value + "</span>";
      }

      return {
        value: value,
        valid: isValid
      };
    },
    isValidDealer(name) {
      let dealer = this.dealers.filter(function(elem) {
        if (elem.dealerName.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (dealer[0]) {
        return dealer[0];
      } else {
        return false;
      }
    },
    isValidCategory(name) {
      let cat = this.categories.filter(function(elem) {
        // alert(elem.text.toLowerCase());
        if (elem.text.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (cat[0]) {
        return cat[0];
      } else {
        return false;
      }
    },
    isValidState(name) {
      let state = this.states.filter(function(elem) {
        if (elem.text.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (state[0]) {
        return state[0];
      } else {
        return false;
      }
    },
    isValidPic(name) {
      if (!name) {
        return true;
      }
      let pic = this.picList.filter(function(elem) {
        if (elem.picName.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (pic[0]) {
        return pic[0];
      } else {
        return false;
      }
    },
    setPostData(pdata) {
      let tdata = [];

      pdata.forEach(row => {
        let dealerId = this.isValidDealer(row[1]);
        let catId = this.isValidCategory(row[2]);
        let stateId = this.isValidState([row[3]]);
        let picId = this.isValidPic(row[7]);

        if (!dealerId) {
          Message({
            message: "Invalid dealer (" + row[1] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!catId) {
          Message({
            message: "Invalid type (" + row[2] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!stateId) {
          Message({
            message: "Invalid state (" + row[3] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!picId) {
          Message({
            message: "Invalid PIC (" + row[7] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else {
          tdata.push({
            name: row[0],
            dealerId: dealerId,
            typeId: catId.id,
            stateId: stateId,
            area: row[4],
            postCode: row[5],
            address: row[6],
            outletPicId: picId,
            longitude: "",
            latitude: "",
            ownerAccId: 8,
            statusType: "ACTIVE"
          });
        }
      });

      this.postOutletData = tdata;
      if (this.postOutletData.length > 0) {
        this.submitOutletData();
      }
    },
    submitOutletData() {
      let pdata = {};
      pdata = this.postOutletData;
      this.$store.dispatch(OUTLET_BULK_UPLOAD_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getOutletList();
          this.toggleUploadModal();
          return Message({
            message: "Outlets Successfully Added.",
            type: "success",
            duration: 5 * 1000
          });
        }
      });
    },
    getUploadFile() {},
    getDealers() {
      this.$store.dispatch(DEALER_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.dealers = res.content;
        }
      });
    },
    getStates() {
      const countryId = this.$store.getters.getCountryId;
      // alert(contryId);
      this.$store
        .dispatch(STATE_LIST_REQUEST, { countryId: countryId })
        .then(res => {
          if (res.resultCode === 0) {
            this.states = res.content;
          }
        });
    },
    getCategories() {
      this.$store.dispatch(CATEGORY_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.categories = res.content;
        }

        // this.categories = [
        //   {
        //     id: 23,
        //     text: "Sample Type"
        //   }
        // ];
      });
    },
    getPicList() {
      this.$store.dispatch(OUTLET_PIC_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.picList = res.content;
        }
      });
    },
    getStats() {
      this.outletListActive = [];
      this.outletListDeactivate = [];
      this.outletListNoPic = [];

      this.outletListActive = this.outletList.filter(list => {
        if (list.status == "ACTIVE") {
          return list;
        }
      });

      this.outletListDeactivate = this.outletList.filter(list => {
        if (list.status == "DEACTIVATED") {
          return list;
        }
      });

      this.outletListNoPic = this.outletList.filter(list => {
        if (list.picName && list.picEmail) {
          return list;
        }
      });
    },
    filterList(list) {
      if (list == "normal") {
        this.normal = true;
        this.activeList = false;
        this.deactivatedList = false;
        this.noPicList = false;
      } else if (list == "active") {
        this.normal = false;
        this.activeList = true;
        this.deactivatedList = false;
        this.noPicList = false;
      } else if (list == "deactivated") {
        this.normal = false;
        this.activeList = false;
        this.deactivatedList = true;
        this.noPicList = false;
      } else if (list == "noPic") {
        this.normal = false;
        this.activeList = false;
        this.deactivatedList = false;
        this.noPicList = true;
      }
    }
  },
  mounted() {
    this.isPromoLeader = this.$store.getters.isPromoLeader;
    this.isDealer = this.$store.getters.isDealer;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.isPicOutlet = this.$store.getters.isPicOutlet;
    this.isAgency = this.$store.getters.isAgency;

    if (this.isPromoLeader) {
      this.canAdd = false;
      this.canEdit = false;
      this.canUpload = false;
      this.canView = false;
      this.canExport = false;
      this.canChangeStatus = false;

      this.columns.push({
        name: "status",
        label: "Status",
        sort: true,
        width: "5%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    } else if (this.isDealer) {
      this.canAdd = false;
      this.canEdit = true;
      this.canUpload = false;
      this.canView = true;
      this.canExport = true;
      this.canChangeStatus = true;
      this.columns.push({
        name: "status",
        label: "Status",
        sort: true,
        width: "5%",
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
    } else if (this.isPicOutlet) {
      this.canAdd = false;
      this.canEdit = true;
      this.canUpload = false;
      this.canView = false;
      this.canExport = true;
      this.canChangeStatus = true;

      this.columns.push({
        name: "status",
        label: "Status",
        sort: true,
        width: "5%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
      // this.columns.push({
      //   name: "Action",
      //   label: "Action",
      //   width: "10%",
      //   row_text_alignment: "text-left",
      //   column_text_alignment: "text-left"
      // });
    } else {
      this.canAdd = true;
      this.canEdit = true;
      this.canUpload = true;
      this.canView = true;
      this.canExport = true;
      this.canChangeStatus = true;
      this.columns.push({
        name: "status",
        label: "Status",
        sort: true,
        width: "5%",
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
    }

    if (!this.isDealer && !this.isPicOutlet) {
      // this.columns.splice(2, 0, {
      //   name: "lppCode",
      //   label: "Dealer LPP Code",
      //   sort: true,
      //   width: "10%",
      //   row_text_alignment: "text-left",
      //   column_text_alignment: "text-left"
      // });

      this.columns.splice(2, 0, {
        name: "dealerName",
        label: "Dealer Info",
        sort: true,
        width: "15%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    if (!this.isPromoLeader && !this.isPicOutlet) {
      this.columns.splice(4, 0, {
        name: "picName",
        label: "PIC",
        sort: true,
        width: "15%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });

      this.columns.splice(5, 0, {
        name: "outletCode",
        label: "SCAN",
        sort: true,
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    if (this.isPicOutlet) {
      this.columns.splice(2, 0, {
        name: "outletCode",
        label: "SCAN",
        sort: true,
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    this.getOutletList();
  },
  created() {
    // this.getoutletPicList();
  }
};
</script>

<style scoped>
.barcode-icon {
  font-size: 3em;
}
</style>
