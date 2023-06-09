<template>
  <div id="salesp-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Staff Management"
      sub-sub-title="Salesperson"
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
                        <b-tag type="is-dark" size="is-large">
                          Salesperson
                        </b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ salespList.length }}</strong>
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
                          <strong>{{ salespListActive.length }}</strong>
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
                          <strong>{{ salespListDeactivated.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <button
                    v-if="canAdd"
                    class="btn btn-sm btn-primary"
                    @click="toggleModal()"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_salesperson_title')"></span>
                  </button>
                  <button
                    v-if="canDownload"
                    class="btn btn-sm btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-file-excel-o"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
                  </button>
                  <button
                    v-if="canUpload"
                    class="btn btn-sm btn-primary"
                    @click="toggleUploadModal"
                  >
                    <i class="fa fa-upload"></i>
                    <span v-text="$ml.get('button_upload_text')"></span>
                  </button>
                </div>

                <div v-if="isRegionAdmin" class="col-lg-12">
                  <br />
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
                    @refresh-data="getSalespersonsList"
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
                        v-text="$ml.get('no_salesperson_found')"
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
                        <i class="fa fa-venus-mars"></i>
                        {{ getGenderName(props.row.genderId) }}
                        <br />
                        <span v-if="props.row.icNumber">
                          <i class="fa fa-id-card-o"></i>
                          {{ props.row.icNumber }}
                          <br />
                        </span>
                        <span v-if="props.row.phoneNumber">
                          <i class="fa fa-phone-square"></i>
                          {{ props.row.phoneNumber }}
                          <br />
                        </span>
                        <span v-if="props.row.email">
                          <i class="fa fa-envelope-o"></i>
                          {{ props.row.email }}
                        </span>
                      </div>
                    </template>

                    <template slot="imageUrl" slot-scope="props">
                      <div v-viewer class="media-img-container mr-3">
                        <img
                          class="img-fluid media-img"
                          :src="
                            props.cell_value ? props.cell_value : defaultImage
                          "
                          alt="Salesperson"
                          @error="replaceImageByDefault"
                        />
                      </div>
                    </template>
                    <template slot="joinedDate" slot-scope="props">
                      <span>{{ dateFormat(props.row.joinedDate) }}</span>
                    </template>

                    <template slot="dealerName" slot-scope="props">
                      <div class="inner-data">
                        <span>{{ props.row.dealerName }}</span>
                        <br />
                        <span>{{ props.row.lppCode }}</span>
                      </div>
                    </template>

                    <template slot="outletName" slot-scope="props">
                      <div class="inner-data">
                        <span>{{ props.row.outletName }}</span>
                        <br />
                        <span>{{ props.row.dealerCode }}</span>
                        <br />
                        <span>{{ props.row.outletAddress }}</span>
                      </div>
                    </template>

                    <template slot="status" slot-scope="props">
                      <!-- <span v-if="!props.row.status">DEACTIVE</span>
                      <span v-if="props.row.status">ACTIVE</span>-->
                      <!-- <span
                        class="label label-rounded label-success"
                        v-if="props.row.status"
                        v-text="$ml.get('active_status_text')"
                      ></span>
                      <span
                        class="label label-rounded label-danger"
                        v-if="!props.row.status"
                        v-text="$ml.get('deactive_status_text')"
                      ></span>-->
                      <lnvStatusTextBox :active="props.row.status" />
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
                          <span v-text="$ml.get('button_edit_text')"></span>
                        </button>
                        <button
                          v-if="canView"
                          class="btn btn-info btn-xs"
                          @click="toggleModal(props.row, 1)"
                        >
                          <i class="fa fa-eye"></i>
                          <span v-text="$ml.get('button_view_text')"></span>
                        </button>

                        <button
                          v-if="canEdit"
                          class="btn btn-danger btn-xs"
                          @click="doChangeStatus(props.row)"
                        >
                          <i class="fa fa-exchange"></i>
                          <span v-text="$ml.get('button_status_text')"></span>
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

    <BModal ref="salesp-modal" size="lg" hide-footer :title="setFormTitle">
      <salespersonForm
        :close-modal="toggleModal"
        :salesp-selected="salesp"
        :load-data="getSalespersonsList"
        :can-view="canView"
        :can-edit="canEdit"
        :currect-action="currectAction"
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
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import salespersonForm from "../../components/staff/salesperson_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import default_image from "../../assets/default_image.jpg";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import {
  GET_STAFF_LIST_REQUEST,
  POST_STAFF_REQUEST
} from "../../store/modules/staff/actions";
import excelUploadForm from "../../components/excel_upload/index";
import "viewerjs/dist/viewer.css";

import {
  phoneValidate,
  emailValidate,
  nameValidate
} from "../../utils/helpers";
import {
  GENDER_LIST_REQUEST,
  BANK_LIST_REQUEST,
  COUNTRY_LIST_REQUEST
} from "../../store/modules/utility/actions";
import { OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";
import { export_json_to_excel } from "../../utils/Export2Excel";
import Multiselect from "vue-multiselect";
import { convertDateFormat } from "../../utils/helpers";
import lnvStatusTextBox from "../../components/ui/statusTextBox";

export default {
  name: "SalespersonStaff",
  components: {
    breadcrumb: breadcrumb,
    salespersonForm: salespersonForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.salespList;
      } else if (this.activeList) {
        return this.salespListActive;
      } else if (this.deactivatedList) {
        return this.salespListDeactivated;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      defaultImage: default_image,
      sampleFile: "salespersonUpload",
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      excel_fields: {
        No: "id",
        Staff_name: "name",
        Email: "productGroupId",
        Contact_number: "productSubGroupId"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Salesperson",
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
      columns: [],
      fileColumnStructure: [
        "Name",
        "Email",
        "Phone Number",
        "IC/ID Number",
        "Gender",
        "Outlet Code",
        "Bank Name",
        "Bank Account Number"
      ],
      total: 0,
      salespList: [],
      salespListActive: [],
      salespListDeactivated: [],
      salesp: {},
      postSalesPData: [],
      genders: [],
      banks: [],
      isRegionAdmin: false,
      isCountryAdmin: false,
      countries: [],
      search: {},
      countryId: null,
      canAdd: false,
      canUpload: false,
      canDownload: false,
      canDelete: false,
      canEdit: false,
      canView: false,
      setFormTitle: "Add Salesperson",
      currectAction: false,
      isDealer: false,
      isPicOutlet: false,
      isCountriesLoading: false,
      isDataLoading: false,
      normal: true,
      activeList: false,
      deactivatedList: false,
      isAgency: false
    };
  },
  methods: {
    showModal() {
      this.salesp = {};
      this.$refs["salesp-modal"].show();
    },
    hideModal() {
      this.salesp = {};
      this.$refs["salesp-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        if (view) {
          this.setFormTitle = "View Salesperson";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit Salesperson";
          this.currectAction = "edit";
        }
        this.salesp = row;
      } else {
        this.setFormTitle = "Add Salesperson";
        this.currectAction = "edit";
        this.salesp = {};
      }

      this.$refs["salesp-modal"].toggle("#toggle-btn");
    },
    toggleUploadModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn2");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getSalespersonsList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getSalespersonsList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getSalespersonsList();
    },
    getSalespersonsList() {
      this.salespList = [];
      this.isDataLoading = true;

      if (this.isRegionAdmin && !this.countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }

      let pdata = { type: "salespersons" };
      if (this.countryId) {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(GET_STAFF_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.salespList = res.content;
          this.total = this.salespList.length;
          this.getStats();
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    doEdit(row) {
      this.salesp = row;
      this.$refs["salesp-modal"].toggle("#toggle-btn");
    },
    doChangeStatus(row) {
      this.$buefy.dialog.confirm({
        message: row.status
          ? "Do you want to <b class='red-heighlighted'>deactivete</b> " +
            row.name
          : "Do you want to <b class='red-heighlighted'>activete</b> " +
            row.name,
        onConfirm: () => {
          let pdata = {};
          pdata.data = {};
          pdata.staffId = row.id;
          pdata.data.id = row.id;
          pdata.data.status = !row.status;
          pdata.type = "salespersons";

          this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
            if (res.resultCode === 0) {
              this.getSalespersonsList();
              return Message({
                message: row.status
                  ? "Salesperson Deactivated."
                  : "Salesperson Activated.",
                type: "success",
                duration: 5 * 1000
              });
            }
          });
        }
      });
    },
    doDelete(row) {
      this.$buefy.dialog.confirm({
        message: "Do you want to delete " + row.name,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
        }
      });
    },
    doExport() {
      let tHeader = [];
      let filterVal = [];
      if (this.isDealer || this.isPicOutlet) {
        tHeader = [
          "Name",
          "Email",
          "Outlet Code",
          "Outlet Name",
          "Phone Number",
          "IC/ID Number",
          "Gender",
          "Bank Name",
          "Bank Account Number",
          "Status"
        ];

        filterVal = [
          "name",
          "email",
          "dealerCode",
          "outletName",
          "phoneNumber",
          "icNumber",
          "genderName",
          "bankName",
          "bankAccount",
          "status"
        ];
      } else {
        tHeader = [
          "Name",
          "Email",
          "Outlet Code",
          "Outlet Name",
          "Dealer LPP Code",
          "Dealer Name",
          "Phone Number",
          "IC/ID Number",
          "Gender",
          "Bank Name",
          "Bank Account Number",
          "Status"
        ];

        filterVal = [
          "name",
          "email",
          "dealerCode",
          "outletName",
          "lppCode",
          "dealerName",
          "phoneNumber",
          "icNumber",
          "genderName",
          "bankName",
          "bankAccount",
          "status"
        ];
      }
      const data = this.formatJson(filterVal, this.salespList);
      const fileName = "salespersons";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "salespersons",
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
            return v[j] ? "Active" : "Deactive";
          } else {
            return v[j];
          }
        })
      );
    },
    dateFormat(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
    },
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      let gender = this.getGenderIdByName(value);
      let bank = this.getBankIdByName(value);
      let outlet = this.getOutletIdByName(value);
      switch (field) {
        case "Name":
          isValid = nameValidate(value);
          break;
        case "Email":
          isValid = emailValidate(value);
          break;
        case "Phone Number":
          isValid = phoneValidate(value);
          break;
        case "IC/ID Number":
          isValid = true;
          break;
        case "Gender":
          if (gender) {
            isValid = true;
          }
          break;
        case "Outlet Code":
          if (outlet) {
            isValid = true;
          }
          break;
        case "Bank Name":
          if (bank) {
            isValid = true;
          }
          break;
        case "Bank Account Number":
          isValid = true;
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
    setPostData(pdata) {
      let tdata = [];

      pdata.forEach(row => {
        let outletId = this.getOutletIdByName(row[5]);
        let genderId = this.getGenderIdByName(row[4]);

        if (!genderId) {
          Message({
            message: "Invalid gender (" + row[4] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!outletId) {
          Message({
            message: "Invalid outlet code (" + row[4] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else {
          tdata.push({
            name: row[0],
            email: row[1],
            phoneNumber: row[2],
            icNumber: row[3],
            outletId: outletId,
            genderId: genderId,
            bankId: row[6],
            bankAccount: row[7]
          });
        }
      });

      this.postSalesPData = tdata;
      if (this.postSalesPData.length > 0) {
        this.submitSalesPData();
      }
    },
    submitSalesPData() {
      let pdata = {};
      pdata.type = "salespersons";
      pdata.data = this.postSalesPData;
      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getSalespersonsList();
          this.toggleUploadModal();
          return Message({
            message: "Salespersons Successfully Added.",
            type: "success",
            duration: 5 * 1000
          });
        }
      });
    },
    getUploadFile() {},
    getGenders() {
      this.$store.dispatch(GENDER_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.genders = res.content;
        }
      });
    },
    getBanks() {
      let pdata = { countryCode: this.$store.getters.getCountryCode };
      this.$store.dispatch(BANK_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.banks = res.content;
        }
      });
    },
    getOutlets() {
      this.$store.dispatch(OUTLET_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.outlets = res.content;
          // console.log(this.outlets);
        }
      });
    },
    getGenderName(id) {
      let gender = this.genders.filter(function(elem) {
        if (elem.id == id) return elem;
      });
      if (gender[0]) {
        return gender[0].text;
      } else {
        return "";
      }
    },
    getGenderIdByName(name) {
      let gender = this.genders.filter(function(elem) {
        if (elem.text.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (gender[0]) {
        return gender[0].id;
      } else {
        return false;
      }
    },
    getBankIdByName(name) {
      let bank = this.banks.filter(function(elem) {
        if (elem.text.toLowerCase() === name.toLowerCase()) return elem;
      });
      if (bank[0]) {
        return bank[0].id;
      } else {
        return false;
      }
    },
    getOutletIdByName(code) {
      if (code) {
        let outlet = this.outlets.filter(function(elem) {
          if (elem.dealerCode === code) return elem;
        });
        if (outlet[0]) {
          return outlet[0].id;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    getOutletIdByCode() {
      // alert(code);
      return false;
      // if (code) {
      //   let outlet = this.outlets.filter(function(elem) {
      //     if (elem.code === code) return elem;
      //   });
      //   if (outlet[0]) {
      //     return outlet[0].id;
      //   } else {
      //     return false;
      //   }
      // } else {
      //   return false;
      // }
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
    getStats() {
      this.salespListActive = [];
      this.salespListDeactivated = [];

      this.salespListActive = this.salespList.filter(list => {
        if (list.status) {
          return list;
        }
      });
      this.salespListDeactivated = this.salespList.filter(list => {
        if (!list.status) {
          return list;
        }
      });
    },
    filterList(list) {
      if (list == "normal") {
        this.normal = true;
        this.activeList = false;
        this.deactivatedList = false;
      } else if (list == "active") {
        this.normal = false;
        this.activeList = true;
        this.deactivatedList = false;
      } else if (list == "deactivated") {
        this.normal = false;
        this.activeList = false;
        this.deactivatedList = true;
      }
    }
  },
  mounted() {
    this.getGenders();
    this.getBanks();
    this.getOutlets();
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;
    this.isDealer = this.$store.getters.isDealer;
    this.isPicOutlet = this.$store.getters.isPicOutlet;
    this.isAgency = this.$store.getters.isAgency;

    if (this.isDealer) {
      this.columns = this.columns = [
        {
          name: "id",
          label: "No",
          width: "5%",
          sort: true,
          visibility: false
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "imageUrl",
          label: "Photo",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Staff Info",
          sort: true,
          width: "20%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerName",
          label: "Dealer Info",
          sort: true,
          width: "20%",
          visibility: false,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletName",
          label: "Outlet Info",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletAddress",
          label: "outletAddress",
          visibility: false
        },
        {
          name: "joinedDate",
          label: "Joined Date",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "email",
          label: "Email",
          visibility: false
        },
        {
          name: "icNumber",
          label: "IC Number",
          visibility: false
        },
        {
          name: "genderName",
          label: "Gender Name",
          visibility: false
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          visibility: false
        },
        {
          name: "lppCode",
          label: "Lpp Code",
          visibility: false
        },
        {
          name: "dealerCode",
          label: "Outlet Code",
          visibility: false
        },
        {
          name: "status",
          label: "Status",
          width: "5%",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ];
    } else {
      this.columns = this.columns = [
        {
          name: "id",
          label: "No",
          width: "5%",
          sort: true,
          visibility: false
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "imageUrl",
          label: "Photo",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Staff Info",
          sort: true,
          width: "20%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerName",
          label: "Dealer Info",
          sort: true,
          width: "20%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletName",
          label: "Outlet Info",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "outletAddress",
          label: "outletAddress",
          visibility: false
        },
        {
          name: "joinedDate",
          label: "Joined Date",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "email",
          label: "Email",
          visibility: false
        },
        {
          name: "icNumber",
          label: "IC Number",
          visibility: false
        },
        {
          name: "genderName",
          label: "Gender Name",
          visibility: false
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          visibility: false
        },
        {
          name: "lppCode",
          label: "Lpp Code",
          visibility: false
        },
        {
          name: "dealerCode",
          label: "Outlet Code",
          visibility: false
        },
        {
          name: "status",
          label: "Status",
          width: "5%",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ];
    }

    if (this.isRegionAdmin) {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = false;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = true;

      this.columns.push({
        name: "Action",
        label: "Action",
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    } else if (this.isCountryAdmin || this.isAgency) {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = true;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = false;
    } else {
      this.canAdd = true;
      this.canUpload = false;
      this.canDownload = true;
      this.canEdit = true;
      this.canDelete = true;
      this.canView = false;

      this.columns.push({
        name: "Action",
        label: "Action",
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }

    if (!this.isRegionAdmin) {
      this.getSalespersonsList();
    }

    // alert(this.canView);
  },
  created() {
    // this.getSalespersonsList();
  }
};
</script>
