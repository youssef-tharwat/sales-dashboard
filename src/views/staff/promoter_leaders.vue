<template>
  <div id="promo-leader-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Staff Management"
      sub-sub-title="Promoter Leader"
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
                          Promoter Leaders
                        </b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ leaderList.length }}</strong>
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
                          <strong>{{ leaderListActive.length }}</strong>
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
                          <strong>{{ leaderListDeactivated.length }}</strong>
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
                    <span v-text="$ml.get('add_promoter_leader_title')"></span>
                  </button>
                  <button
                    v-if="canDownload"
                    class="btn btn-sm btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-download"></i>
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
                    @refresh-data="getLeaderList"
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
                        v-text="$ml.get('no_leaders_found')"
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
                          alt="Leader"
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
                          class="btn btn-info btn-xs"
                          @click="loadPromoters(props.row)"
                        >
                          <i class="fa fa-users"></i>
                          PROMOTERS ({{ props.row.promoterList.length }})
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

    <BModal ref="leader-modal" size="lg" hide-footer :title="setFormTitle">
      <leaderForm
        :can-edit="canEdit"
        :can-view="canView"
        :close-modal="toggleModal"
        :leader-selected="leader"
        :load-data="getLeaderList"
        :currect-action="currectAction"
      />
    </BModal>

    <BModal
      ref="promoter-modal"
      size="lg"
      hide-footer
      title="Assigned Promoters"
    >
      <LeaderPromoters
        :close-modal="togglePromotersModal"
        :leader-selected="leader"
        :load-data="getLeaderList"
        :can-edit="canEdit"
        :can-view="canView"
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
import leaderForm from "../../components/staff/promo_leader_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import default_image from "../../assets/default_image.jpg";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import {
  GET_STAFF_LIST_REQUEST,
  POST_STAFF_REQUEST
} from "../../store/modules/staff/actions";
import excelUploadForm from "../../components/excel_upload/index";
import { export_json_to_excel } from "../../utils/Export2Excel";
import LeaderPromoters from "../../components/staff/leader_promoters";

import {
  phoneValidate,
  emailValidate,
  nameValidate
} from "../../utils/helpers";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import "viewerjs/dist/viewer.css";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import { convertDateFormat } from "../../utils/helpers";
import { NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "PromoterLeaders",
  components: {
    breadcrumb: breadcrumb,
    leaderForm: leaderForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    excelUploadForm: excelUploadForm,
    LeaderPromoters: LeaderPromoters,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.leaderList;
      } else if (this.activeList) {
        return this.leaderListActive;
      } else if (this.deactivatedList) {
        return this.leaderListDeactivated;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      defaultImage: default_image,
      sampleFile: "promoterLeaderUpload.xlsx",
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
        card_title: "Promoter Leader",
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
        },
        {
          name: "imageUrl",
          label: "Photo",
          width: "10%"
        },
        {
          name: "name",
          label: "Staff Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          width: "55%"
        },
        {
          name: "status",
          label: "Status",
          sort: true,
          width: "5%"
          // initial_sort: true, // "false" by default
          // initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "Action",
          label: "Action",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          width: "10%"
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          visibility: false
        },
        {
          name: "email",
          label: "Email",
          visibility: false
        }
      ],
      fileColumnStructure: ["Name", "Email", "Phone Number"],
      total: 0,
      leaderList: [],
      leaderListActive: [],
      leaderListDeactivated: [],
      leader: {},
      postLeaderData: [],
      isRegionAdmin: false,
      countries: [],
      search: {},
      countryId: null,
      canAdd: false,
      canUpload: false,
      canDownload: false,
      canDelete: false,
      canEdit: false,
      canView: false,
      setFormTitle: "Add Promoter Leader",
      currectAction: false,
      isCountriesLoading: false,
      isDataLoading: false,
      normal: true,
      activeList: false,
      deactivatedList: false
    };
  },
  methods: {
    showModal() {
      this.leader = {};
      this.$refs["leader-modal"].show();
    },
    hideModal() {
      this.leader = {};
      this.$refs["leader-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        if (view) {
          this.setFormTitle = "View Promoter Leader";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit Promoter Leader";
          this.currectAction = "edit";
        }
        this.leader = row;
      } else {
        this.setFormTitle = "Add Promoter Leader";
        this.currectAction = "edit";
        this.leader = {};
      }

      this.$refs["leader-modal"].toggle("#toggle-btn");
    },
    togglePromotersModal() {
      this.$refs["promoter-modal"].toggle("#toggle-btn3");
    },
    toggleUploadModal() {
      this.$refs["upload-modal"].toggle("#toggle-btn2");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getLeaderList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getLeaderList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getLeaderList();
    },
    getLeaderList() {
      let pdata = { type: "leaders" };
      this.isDataLoading = true;
      this.leaderList = [];
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
          this.leaderList = res.content;
          this.total = this.leaderList.length;
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
      this.leader = row;
      this.$refs["leader-modal"].toggle("#toggle-btn");
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
          pdata.type = "leaders";

          this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
            if (res.resultCode === 0) {
              this.getLeaderList();
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: row.status
                  ? "Leader Deactivated."
                  : "Leader Activated.",
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
      const tHeader = ["Name", "Email", "Phone Number", "Status"];
      const filterVal = ["name", "email", "phoneNumber", "status"];
      const data = this.formatJson(filterVal, this.leaderList);
      const fileName = "promoterLeader";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "promoterLeaders",
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

      pdata.forEach(function(row) {
        tdata.push({
          name: row[0],
          email: row[1],
          phoneNumber: row[2]
        });
      });

      this.postLeaderData = tdata;
      if (this.postLeaderData.length > 0) {
        this.submitPromoLeaderData();
      }
    },
    submitPromoLeaderData() {
      let pdata = {};
      pdata.type = "leaders";
      pdata.data = this.postLeaderData;
      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getLeaderList();
          this.toggleUploadModal();
          this.$store.dispatch(NOTIFICATION_SUCCESS, {
            message: "Promoter Leaders Successfully Added",
            timeOut: true
          });
        }
      });
    },
    getUploadFile() {},
    loadPromoters(row) {
      this.leader = row;
      this.togglePromotersModal();
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
      this.leaderListActive = [];
      this.leaderListDeactivated = [];

      this.leaderListActive = this.leaderList.filter(list => {
        if (list.status) {
          return list;
        }
      });
      this.leaderListDeactivated = this.leaderList.filter(list => {
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
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;

    if (this.isRegionAdmin) {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = false;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = true;
    } else {
      this.canAdd = true;
      this.canUpload = true;
      this.canDownload = true;
      this.canEdit = true;
      this.canDelete = true;
      this.canView = false;

      this.getLeaderList();
    }
  },
  created() {
    // this.getLeaderList();
  }
};
</script>
