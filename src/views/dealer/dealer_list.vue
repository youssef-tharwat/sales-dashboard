<template>
  <div id="dealer-list">
    <breadcrumb
      title="Dashboard"
      subtitle="Dealer Management"
      sub-sub-title="Dealer Details"
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
                        <b-tag type="is-dark" size="is-large">Dealers</b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ dealerList.length }}</strong>
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
                          <strong>{{ dealerListActive.length }}</strong>
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
                          <strong>{{ dealerListDeactivated.length }}</strong>
                        </b-tag>
                      </b-taglist>
                    </div>
                    <div class="control clickable" @click="filterList('bulk')">
                      <b-taglist attached>
                        <b-tag type="is-dark" size="is-large">
                          Bulk Submission ON
                        </b-tag>
                        <b-tag type="is-info" size="is-large">
                          <strong>{{ dealerListBulkSubmission.length }}</strong>
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
                    <span v-text="$ml.get('add_dealer_title')"></span>
                  </button>

                  <button
                    v-if="canDownload"
                    class="btn btn-sm btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-file-excel-o"></i>
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
                        :loading="isCountriesLoading"
                        :disabled="isCountriesLoading"
                        select-label
                        deselect-label
                        @input="
                          onChangeCountry();
                          doSearch();
                        "
                      ></Multiselect>
                      <!--  -->
                    </div>
                    <!-- <div class="col-lg-2">
                      <button class="btn btn-sm btn-primary pull-right" @click="doSearch">
                        <i class="fa fa-search"></i>
                        <span v-text="$ml.get('button_search_text')"></span>
                      </button>
                    </div> -->
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
                    @refresh-data="getDealerList"
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
                        v-text="$ml.get('no_dealers_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>

                    <template slot="dealerName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{
                          props.row.dealerName
                        }}</span>
                        <br />
                        <span>{{ props.row.prmLppName }}</span>
                        <br />
                        <i class="fa fa-suitcase" aria-hidden="true"></i>
                        <span>{{ " " }} {{ props.row.businessRegNo }}</span>
                      </div>
                    </template>

                    <template slot="ownerName" slot-scope="props">
                      <div class="inner-data">
                        <span class="bold-text">{{ props.row.ownerName }}</span>
                        <br />
                        <i class="fa fa-id-card-o"></i>
                        <span>{{ " " }} {{ props.row.ownerIcOrId }}</span>
                        <br />
                        <i class="fa fa-phone-square"></i>
                        <span>{{ " " }} {{ props.row.contactNum }}</span>
                        <br />
                        <i class="fa fa-envelope-o"></i>
                        <span>{{ " " }} {{ props.row.email }}</span>
                      </div>
                    </template>

                    <template slot="bankId" slot-scope="props">
                      <div class="inner-data">
                        <span>{{ props.row.bankAccNam }}</span>
                        <br />
                        <span>{{ props.row.bankAccNum }}</span>
                        <br />
                        <span>{{ props.row.bankAccHolderName }}</span>
                      </div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
                    </template>

                    <template slot="status" slot-scope="props">
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

                      <!-- <div class="dropdown">
                        <button
                          class="btn btn-primary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >Action</button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <a class="dropdown-item" href="#">Action</a>
                          <a class="dropdown-item" href="#">Another action</a>
                          <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                      </div>-->
                    </template>
                  </VueBootstrap4Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BModal ref="dealer-modal" size="lg" hide-footer :title="setFormTitle">
      <dealerForm
        :close-modal="toggleModal"
        :can-edit="canEdit"
        :can-view="canView"
        :dealer-selected="dealer"
        :load-data="getDealerList"
        :currect-action="currectAction"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import dealerForm from "../../components/dealer/dealer_form";
import { BModal } from "bootstrap-vue";
import lnvStatusTextBox from "../../components/ui/statusTextBox";
// import lnvTable from "../../components/ui/table";
import moment from "moment-timezone";
import {
  DEALER_LIST_REQUEST,
  DEALER_POST_REQUEST
} from "../../store/modules/dealer/actions";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { Message } from "element-ui";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import { convertDateFormat } from "../../utils/helpers";

export default {
  name: "Dealers",
  components: {
    breadcrumb: breadcrumb,
    dealerForm: dealerForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    filterState() {
      if (this.normal) {
        return this.dealerList;
      } else if (this.activeList) {
        return this.dealerListActive;
      } else if (this.deactivatedList) {
        return this.dealerListDeactivated;
      } else if (this.bulkSubmissionList) {
        return this.dealerListBulkSubmission;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      excel_fields: {
        No: "id",
        Dealer_Name: "dealerName",
        Business_Reg_No: "businessRegNo",
        Owner_Name: "ownerName",
        Owner_IC_ID: "ownerIcOrId",
        Contact_Number: "contactNum",
        Email: "email",
        Account_Manager: "accountManager",
        Bank_Name: "bankId",
        Account_Number: "bankAccNum",
        LPP_Name: "prmLppName",
        Store_ID: "storeId"
      },
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Dealers",
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
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerName",
          label: "Dealer Info",
          sort: true,
          width: "17%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "ownerName",
          label: "Owner Info",
          sort: true,
          width: "17%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "accountManager",
          label: "Account Manager",
          sort: true,
          width: "15%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "bankId",
          label: "Bank Info",
          sort: true,
          width: "10%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "businessRegNo",
          label: "Business Reg No",
          visibility: false
        },
        {
          name: "ownerIcOrId",
          label: "Owner IcOrId",
          visibility: false
        },
        {
          name: "storeId",
          label: "Store Id",
          visibility: false
        },
        {
          name: "contactNum",
          label: "Contact Num.",
          visibility: false
        },
        {
          name: "email",
          label: "Email",
          visibility: false
        },
        {
          name: "bankAccNum",
          label: "Bank Acc. Num.",
          visibility: false
        }
      ],
      total: 0,
      dealerList: [],
      dealerListActive: [],
      dealerListDeactivated: [],
      dealerListBulkSubmission: [],
      dealer: {},
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
      setFormTitle: "Add Dealer",
      currectAction: false,
      isCountriesLoading: false,
      isDataLoading: false,
      normal: true,
      activeList: false,
      deactivatedList: false,
      bulkSubmissionList: false
    };
  },
  methods: {
    showModal() {
      this.$refs["dealer-modal"].show();
    },
    hideModal() {
      this.$refs["dealer-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        this.dealer = row;
        if (view) {
          this.setFormTitle = "View Dealer";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit Dealer";
          this.currectAction = "edit";
        }
      } else {
        this.dealer = {};
        this.setFormTitle = "Add Dealer";
        this.currectAction = "edit";
      }
      this.$refs["dealer-modal"].toggle("#toggle-btn");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDealerList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getDealerList();
    },
    getDealerList() {
      let pdata = {};
      this.isDataLoading = true;
      this.dealerList = [];
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

      this.$store.dispatch(DEALER_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.dealerList = res.content;
          this.dealerList = this.dealerList.filter(list => {
            return (list.joinedDateMod = moment(
              new Date(list.joinedDate)
            ).format("YYYY-MM-DD"));
          });
          this.total = this.dealerList.length;
          this.getStats();
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doEdit(row) {
      this.dealer = row;
      this.$refs["dealer-modal"].toggle("#toggle-btn");
    },
    doChangeStatus(row) {
      this.$buefy.dialog.confirm({
        message:
          row.status == "ACTIVE"
            ? "Do you want to <b class='red-heighlighted'>deactivete</b> " +
              row.dealerName
            : "Do you want to <b class='red-heighlighted'>activate</b> " +
              row.dealerName,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
          row.change_status = true;
          this.$store.dispatch(DEALER_POST_REQUEST, row).then(() => {
            this.getDealerList();
            Message({
              message:
                row.status == "ACTIVE"
                  ? "Dealer Deactivated."
                  : "Dealer Activated.",
              type: "success",
              duration: 5 * 1000
            });
          });
        }
      });
    },
    doDelete() {
      // window.alert(`deleting item ID` + JSON.stringify(row));
      // row.remove() doesn't work when serverside is enabled
      // so we fake it with dom remove
      // tr.remove();
      // const table = this.$refs.table;
      // setTimeout(() => {
      //   // simulate extra long running ajax
      //   // table.reload();
      // }, 1500);
    },
    formatDate: function(date) {
      return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    },
    doExport() {
      const tHeader = [
        "LPP Code",
        "Account Manager",
        "Register Date",
        "Dealer Name",
        "Business Reg No",
        "Owner Name",
        "Owner IC",
        "Contact Number",
        "Email",
        "Bank Name",
        "Bank Account Holder Number",
        "Bank Account Number",
        "Status"
      ];
      const filterVal = [
        "prmLppName",
        "accountManager",
        "joinedDateMod",
        "dealerName",
        "businessRegNo",
        "ownerName",
        "ownerIcOrId",
        "contactNum",
        "email",
        "bankAccNam",
        "bankAccHolderName",
        "bankAccNum",
        "status"
      ];
      const data = this.formatJson(filterVal, this.dealerList);
      const fileName = "dealers";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "dealers",
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
    getCountries() {
      this.isCountriesLoading = true;
      this.$store
        .dispatch(COUNTRY_LIST_REQUEST, { withRegion: false })
        .then(res => {
          if (res.resultCode === 0) {
            this.countries = res.content;
            this.isCountriesLoading = false;
          } else {
            this.isCountriesLoading = false;
          }
        });
    },
    getStats() {
      this.dealerListActive = [];
      this.dealerListDeactivated = [];
      this.dealerListBulkSubmission = [];

      this.dealerListActive = this.dealerList.filter(list => {
        if (list.status == "ACTIVE") {
          return list;
        }
      });

      this.dealerListDeactivated = this.dealerList.filter(list => {
        if (list.status == "DEACTIVATED") {
          return list;
        }
      });

      this.dealerListBulkSubmission = this.dealerList.filter(list => {
        if (list.bulkUpload) {
          return list;
        }
      });
    },
    filterList(list) {
      if (list == "normal") {
        this.normal = true;
        this.activeList = false;
        this.deactivatedList = false;
        this.bulkSubmissionList = false;
      } else if (list == "active") {
        this.normal = false;
        this.activeList = true;
        this.deactivatedList = false;
        this.bulkSubmissionList = false;
      } else if (list == "deactivated") {
        this.normal = false;
        this.activeList = false;
        this.deactivatedList = true;
        this.bulkSubmissionList = false;
      } else if (list == "bulk") {
        this.normal = false;
        this.activeList = false;
        this.deactivatedList = false;
        this.bulkSubmissionList = true;
      }
    }
  },
  mounted() {
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;

    if (this.isRegionAdmin) {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = true;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = true;
      this.columns.push({
        name: "countryName",
        label: "Country",
        width: "10%",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
      this.columns.push({
        name: "status",
        label: "Status",
        sort: true,
        width: "5%",
        initial_sort: true,
        initial_sort_order: "asc", // "asc" by default
        sortCaseSensitive: true,
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
    } else {
      this.canAdd = true;
      this.canUpload = true;
      this.canDownload = true;
      this.canEdit = true;
      this.canDelete = true;
      this.canView = false;
      this.columns.push({
        name: "status",
        label: "Status",
        width: "5%",
        sort: true,
        initial_sort: true,
        initial_sort_order: "asc", // "asc" by default
        sortCaseSensitive: true,
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

      this.getDealerList();
    }
  },
  created() {
    // this.getDealerList();
  }
};
</script>
