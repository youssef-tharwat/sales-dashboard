<template>
  <div id="regional-manager-list">
    <breadcrumb title="Dashboard" subtitle="Staff Management" sub-sub-title="Regional Manager" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12 add-employee-button d-flex align-items-center">
                  <b-field class="mr-auto" grouped group-multiline>
                    <div class="control clickable" @click="filterList('normal')">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Managers</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ managerList.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control clickable" @click="filterList('active')">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Active</b-tag>
                        <b-tag type="is-success" size="is-large">
                          <strong>{{ managerListActive.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control clickable" @click="filterList('deactivated')">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">Deactivated</b-tag>
                        <b-tag type="is-danger" size="is-large">
                          <strong>{{ managerListDeactivated.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                  </b-field>
                  <button v-if="canAdd" class="btn btn-sm btn-primary" @click="toggleModal(null)">
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_regional_manager_title')"></span>
                  </button>
                  <button v-if="canDownload" class="btn btn-sm btn-primary" @click="doExport">
                    <i class="fa fa-download"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
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
                    @refresh-data="getManagerList"
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
                        v-text="$ml.get('no_regional_managers_found')"
                      ></div>
                      <div v-if="isDataLoading" class="bold-text" v-text="$ml.get('data_loading')"></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>
                    <template slot="fullName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.fullName }}</span>
                        <br />
                        <span v-if="props.row.contactNumber">
                          <i class="fa fa-phone-square"></i>
                          {{ props.row.contactNumber }}
                          <br />
                        </span>
                        <span v-if="props.row.email">
                          <i class="fa fa-envelope-o"></i>
                          {{ props.row.email }}
                        </span>
                      </div>
                    </template>

                    <template slot="status" slot-scope="props">
                      <lnvStatusTextBox :active="props.row.status" />
                    </template>

                    <template slot="Action" slot-scope="props">
                      <div class="inner-buttons btn-group float-right" role="group">
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

                        <button class="btn btn-info btn-xs" @click="loadRegions(props.row)">
                          <i class="fa fa-users"></i>
                          REGIONS ({{ props.row.assignedRegion.length }})
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

    <BModal ref="region-manager-modal" size="lg" hide-footer :title="setFormTitle">
      <regionManagerForm
        :can-edit="canEdit"
        :can-view="canView"
        :close-modal="toggleModal"
        :manager-selected="manager"
        :load-data="getManagerList"
        :currect-action="currectAction"
      />
    </BModal>

    <BModal ref="regions-modal" size="lg" hide-footer title="Assigned Regions">
      <ManagerRegions
        :close-modal="toggleRegionsModal"
        :manager-selected="manager"
        :load-data="getManagerList"
        :can-edit="canEdit"
        :can-view="canView"
        :currect-action="currectAction"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import regionManagerForm from "../../components/staff/region_manager_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
import default_image from "../../assets/default_image.jpg";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import {
  GET_STAFF_LIST_REQUEST,
  POST_STAFF_REQUEST
} from "../../store/modules/staff/actions";
import { export_json_to_excel } from "../../utils/Export2Excel";
import ManagerRegions from "../../components/staff/manager_regions";

import {
  phoneValidate,
  emailValidate,
  nameValidate
} from "../../utils/helpers";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import "viewerjs/dist/viewer.css";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
import { NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "RegionalManagers",
  components: {
    breadcrumb: breadcrumb,
    regionManagerForm: regionManagerForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    ManagerRegions: ManagerRegions,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.managerList;
      } else if (this.activeList) {
        return this.managerListActive;
      } else if (this.deactivatedList) {
        return this.managerListDeactivated;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      defaultImage: default_image,
      sampleFile: "regionalManagerUpload.xlsx",
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
        card_title: "State Manager",
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
          name: "fullName",
          label: "Manager Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          width: "70%"
        },
        {
          name: "status",
          label: "Status",
          sort: true,
          width: "5%"
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
      managerList: [],
      managerListActive: [],
      managerListDeactivated: [],
      manager: {},
      postManagerData: [],
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
      setFormTitle: "Add Regional Manager",
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
      this.manager = {};
      this.$refs["region-manager-modal"].show();
    },
    hideModal() {
      this.manager = {};
      this.$refs["region-manager-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        if (view) {
          this.setFormTitle = "View Region Manager";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit Region Manager";
          this.currectAction = "edit";
        }
        this.manager = row;
      } else {
        this.setFormTitle = "Add Regional Manager";
        this.currectAction = "edit";
        this.manager = {};
      }

      this.$refs["region-manager-modal"].toggle("#toggle-btn");
    },
    toggleRegionsModal() {
      this.$refs["regions-modal"].toggle("#toggle-btn3");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getManagerList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getManagerList();
    },
    getManagerList() {
      let pdata = { type: "regionalManagers" };
      this.isDataLoading = true;
      this.managerList = [];
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
          this.managerList = res.content;
          this.total = this.managerList.length;
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
      this.manager = row;
      this.$refs["region-manager-modal"].toggle("#toggle-btn");
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
          pdata.type = "regionalManager";

          this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
            if (res.resultCode === 0) {
              this.getManagerList();
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: row.status
                  ? "Manager Deactivated."
                  : "Manager Activated.",
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
        "IC/ID Number",
        "Phone Number",
        "Regions",
        "Status"
      ];
      const filterVal = [
        "fullName",
        "email",
        "idNumber",
        "contactNumber",
        "assignedRegion",
        "status"
      ];
      const data = this.formatJson(filterVal, this.managerList);
      const fileName = "regionalManager";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "regionalManagers",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "status") {
            return v[j] ? "Active" : "Deactive";
          } else if (j === "assignedRegion") {
            return v[j].join();
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

      this.postManagerData = tdata;
      if (this.postManagerData.length > 0) {
        this.submitRegionManagerData();
      }
    },
    submitRegionManagerData() {
      let pdata = {};
      pdata.type = "regionManager";
      pdata.data = this.postManagerData;
      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getManagerList();
          this.toggleUploadModal();
          this.$store.dispatch(NOTIFICATION_SUCCESS, {
            message: "Region Manager Successfully Added",
            timeOut: true
          });
        }
      });
    },
    getUploadFile() {},
    loadRegions(row) {
      this.manager = row;
      this.toggleRegionsModal();
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
      this.managerListActive = [];
      this.managerListDeactivated = [];

      this.managerListActive = this.managerList.filter(list => {
        if (list.status) {
          return list;
        }
      });
      this.managerListDeactivated = this.managerList.filter(list => {
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

      this.getManagerList();
    }
  },
  created() {}
};
</script>
