<template>
  <div id="promoter-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Staff Management"
      sub-sub-title="Promoter"
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
                        <b-tag type="is-dark" size="is-large">Promoters</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ promoterList.length }}</strong>
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
                          <strong>{{ promoterListActive.length }}</strong>
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
                          <strong>{{ promoterListDeactivated.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <button
                    v-if="canAdd"
                    class="btn btn-sm btn-primary"
                    @click="toggleModal(null)"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_promoter_title')"></span>
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
                    :columns="isLeader ? columnsLeader : columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getPromoterList"
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
                        v-text="$ml.get('no_promoter_found')"
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
                        <span v-if="props.row.promoterTypeId">
                          {{ props.row.promoterTypeName }}
                          <br />
                        </span>
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
                          alt="Promoter"
                          @error="replaceImageByDefault"
                        />
                      </div>
                    </template>

                    <template slot="status" slot-scope="props">
                      <!-- <span v-if="!props.row.status">DEACTIVE</span>
                      <span v-if="props.row.status">ACTIVE</span>-->
                      <lnvStatusTextBox :active="props.row.status" />
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
                          class="btn btn-info btn-xs btn-xs"
                          @click="loadOutlets(props.row)"
                        >
                          Outlets ({{ props.row.promoterOutlets.length }})
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

    <BModal ref="promoter-modal" size="lg" hide-footer :title="setFormTitle">
      <promoterForm
        :close-modal="toggleModal"
        :promoter-selected="promoter"
        :load-data="getPromoterList"
        :can-edit="canEdit"
        :can-view="canView"
        :currect-action="currectAction"
      />
    </BModal>

    <BModal
      ref="outlet-modal"
      size="lg"
      hide-footer
      :title="assignedOutletTitle"
    >
      <PromoterOutlets
        :close-modal="toggleOutletModal"
        :promoter-selected="promoter"
        :load-data="getPromoterList"
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
        :file-columns="
          isLeader ? fileColumnStructureLeader : fileColumnStructure
        "
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import promoterForm from "../../components/staff/promoter_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import default_image from "../../assets/default_image.jpg";
import {
  phoneValidate,
  emailValidate,
  nameValidate
} from "../../utils/helpers";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { export_json_to_excel } from "../../utils/Export2Excel";

import {
  GET_STAFF_LIST_REQUEST,
  POST_STAFF_REQUEST
} from "../../store/modules/staff/actions";
import excelUploadForm from "../../components/excel_upload/index";
import {
  GENDER_LIST_REQUEST,
  COUNTRY_LIST_REQUEST,
  PROMOTER_TYPE_LIST_REQUEST
} from "../../store/modules/utility/actions";
import PromoterOutlets from "../../components/staff/promoter_outlets";
import Multiselect from "vue-multiselect";
import "viewerjs/dist/viewer.css";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import { convertDateFormat } from "../../utils/helpers";
import { NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "PromoterStaff",
  components: {
    breadcrumb: breadcrumb,
    promoterForm: promoterForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm,
    PromoterOutlets: PromoterOutlets,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.promoterList;
      } else if (this.activeList) {
        return this.promoterListActive;
      } else if (this.deactivatedList) {
        return this.promoterListDeactivated;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      defaultImage: default_image,
      sampleFile: "promoterUpload",
      content:
        "Your EXCEL data file should contain all the columns specific to the operation you are performing. The sample EXCEL file has most of the columns required for the operation. Do not edit the colunm labels in the sample file and make sure the file extasion is .xlsx file.",
      excel_fields: {
        No: "id",
        Promoter_Name: "name",
        Email: "email",
        Contact_Number: "phoneNumber",
        IcId_Number: "icNumber",
        Leader_Email: "promoterLeaderEmail"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Promoter",
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
          width: "40%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "promoterLeaderEmail",
          label: "Leader Email",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "status",
          label: "Status",
          sort: true,
          width: "5%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
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
        }
      ],
      columnsLeader: [
        {
          name: "id",
          label: "No",
          visibility: false,
          sort: true
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "imageUrl",
          label: "Photo"
        },
        {
          name: "name",
          label: "Staff Info"
        },
        {
          name: "status",
          label: "Status",
          sort: true,
          width: "5%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      fileColumnStructure: [
        "Name",
        "Email",
        "Phone Number",
        "IC/ID Number",
        "Gender",
        "Promoter Leader Email"
      ],
      fileColumnStructureLeader: [
        "Name",
        "Email",
        "Phone Number",
        "IC/ID Number",
        "Gender"
      ],
      total: 0,
      promoterList: [],
      promoterListActive: [],
      promoterTypes: [],
      promoterListDeactivated: [],
      promoter: {},
      genders: [],
      promoLeaders: [],
      postPromoterData: [],
      userRole: "",
      isLeader: false,
      canAdd: false,
      canUpload: false,
      canDownload: false,
      canDelete: false,
      canEdit: false,
      canView: false,
      isRegionAdmin: false,
      countries: [],
      search: {},
      countryId: null,
      setFormTitle: "Add Promoter",
      currectAction: false,
      assignedOutletTitle: "Assign Outlet",
      isCountriesLoading: false,
      isDataLoading: false,
      normal: true,
      activeList: false,
      deactivatedList: false
    };
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    loadColumns() {
      return this.columns;
    },
    showModal() {
      this.promoter = {};
      this.$refs["promoter-modal"].show();
    },
    hideModal() {
      this.promoter = {};
      this.$refs["promoter-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        if (view) {
          this.setFormTitle = "View Promoter";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit Promoter";
          this.currectAction = "edit";
        }
        this.promoter = row;
      } else {
        this.setFormTitle = "Add Promoter";
        this.currectAction = "edit";
        this.promoter = {};
      }

      this.$refs["promoter-modal"].toggle("#toggle-btn");
    },
    toggleUploadModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn2");
    },
    toggleOutletModal() {
      this.$refs["outlet-modal"].toggle("#toggle-btn3");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getPromoterList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getPromoterList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getPromoterList();
    },
    getPromoterList() {
      let pdata = { type: "promoters" };
      this.isDataLoading = true;

      this.promoterList = [];
      if (this.isRegionAdmin && !this.countryId) {
        return Message({
          message: "Select a country",
          type: "error",
          duration: 5 * 1000
        });
      }

      if (this.countryId) {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(GET_STAFF_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.promoterList = res.content;
          this.total = this.promoterList.length;
          this.getStats();
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doEdit(row) {
      this.promoter = row;
      this.$refs["promoter-modal"].toggle("#toggle-btn");
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
          pdata.type = "promoters";

          this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
            if (res.resultCode === 0) {
              this.getPromoterList();
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: row.status
                  ? "Promoter Deactivated."
                  : "Promoter Activated.",
                timeOut: true
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
      const tHeader = [
        "Name",
        "Email",
        "Phone Number",
        "IC/ID Number",
        "Gender",
        "Promoter Type",
        "Promoter Leader Email",
        "Status"
      ];
      const filterVal = [
        "name",
        "email",
        "phoneNumber",
        "icNumber",
        "genderName",
        "promoterTypeName",
        "promoterLeaderEmail",
        "status"
      ];
      const data = this.formatJson(filterVal, this.promoterList);
      const fileName = "promoters";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "promoter",
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
    validateFields(value, field) {
      //   return true;
      let isValid = false;
      let gender = this.getGenderIdByName(value);
      let leader = this.getLeaderIdByEmail(value);
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
        case "Promoter Leader Email":
          if (leader) {
            isValid = true;
          }
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
        let leaderId = this.getLeaderIdByEmail(row[5]);
        let genderId = this.getGenderIdByName(row[4]);

        if (!genderId) {
          Message({
            message: "Invalid gender (" + row[4] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else if (!leaderId) {
          Message({
            message: "Invalid leader email (" + row[4] + ").",
            type: "error",
            duration: 5 * 1000
          });
          //  break;
          return true;
        } else {
          if (this.isLeader) {
            tdata.push({
              name: row[0],
              email: row[1],
              phoneNumber: row[2],
              icNumber: row[3],
              genderId: genderId
            });
          } else {
            tdata.push({
              name: row[0],
              email: row[1],
              phoneNumber: row[2],
              icNumber: row[3],
              promoterLeaderId: leaderId,
              genderId: genderId
            });
          }
        }
      });

      this.postPromoterData = tdata;
      if (this.postPromoterData.length > 0) {
        this.submitPromoterData();
      }
    },
    submitPromoterData() {
      let pdata = {};
      pdata.type = "promoters";
      pdata.data = this.postPromoterData;
      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getPromoterList();
          this.toggleUploadModal();
          this.$store.dispatch(NOTIFICATION_SUCCESS, {
            message: "Promoters Successfully Added",
            timeOut: true
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
    getPromoterTypes() {
      this.$store.dispatch(PROMOTER_TYPE_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.promoterTypes = res.content;
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
        if (elem.text.toLowerCase() == name.toLowerCase()) return elem;
      });
      if (gender[0]) {
        return gender[0].id;
      } else {
        return false;
      }
    },
    getLeaderIdByEmail(email) {
      if (this.isLeader) {
        return true;
      } else {
        let lrow = this.promoLeaders.filter(function(elem) {
          if (elem.email.toLowerCase() == email.toLowerCase()) return elem;
        });

        if (lrow[0]) {
          return lrow[0].id;
        } else {
          return false;
        }
      }
    },
    getLeaders() {
      this.$store
        .dispatch(GET_STAFF_LIST_REQUEST, { type: "leaders" })
        .then(res => {
          if (res.resultCode === 0) {
            this.promoLeaders = res.content;
          }
        });
    },
    loadOutlets(row) {
      this.promoter = row;
      this.toggleOutletModal();
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
      this.promoterListActive = [];
      this.promoterListDeactivated = [];

      this.promoterListActive = this.promoterList.filter(list => {
        if (list.status) {
          return list;
        }
      });
      this.promoterListDeactivated = this.promoterList.filter(list => {
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
    this.getCountries();
    this.getPromoterTypes();
    this.getGenders();

    this.userRole = this.$store.getters.getUserRole;
    this.isLeader = this.$store.getters.isPromoLeader;
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;

    if (this.isRegionAdmin) {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = false;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = true;
      this.assignedOutletTitle = "Assigned Outlets";
    } else {
      this.canAdd = true;
      this.canUpload = true;
      this.canDownload = true;
      this.canEdit = true;
      this.canDelete = true;
      this.canView = false;

      this.getPromoterList();
    }

    if (!this.isLeader) {
      this.getLeaders();
    }
  },
  created() {
    // this.getPromoterList();
  }
};
</script>
