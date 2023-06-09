<template>
  <div id="distributor-list">
    <breadcrumb title="Dashboard" subtitle="Distributor" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12 add-employee-button">
                  <button
                    v-if="canAdd"
                    class="btn btn-card btn-primary"
                    @click="toggleModal({})"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_distributor_title')"></span>
                  </button>

                  <button
                    v-if="canDownload"
                    class="btn btn-card btn-primary"
                    @click="doExport"
                  >
                    <i class="fa fa-file-excel-o"></i>
                    <span v-text="$ml.get('export_to_excel')"></span>
                  </button>
                </div>
                <div v-if="isRegionAdmin" class="col-lg-12">
                  <div class="row">
                    <div class="col-lg-10">
                      <Multiselect
                        ref="multiselect"
                        v-model="search.countryId"
                        placeholder="Select Country"
                        :searchable="true"
                        :options="countries"
                        label="text"
                        track-by="id"
                        :loading="isCountriesLoading"
                        select-label
                        deselect-label
                        @input="onChangeCountry"
                      ></Multiselect>
                    </div>
                    <!--  -->
                    <div class="col-lg-2">
                      <button
                        class="btn btn-card btn-primary pull-right"
                        @click="doSearch"
                      >
                        <i class="fa fa-search"></i>
                        <span v-text="$ml.get('button_search_text')"></span>
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
                    :rows="distributorList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getDistributorList"
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
                        v-text="$ml.get('no_distributors_found')"
                      ></div>
                    </template>

                    <template slot="id" slot-scope="props">
                      <span>{{ props.row.id }}</span>
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

    <BModal ref="distributor-modal" size="lg" hide-footer :title="setFormTitle">
      <distributorForm
        :close-modal="toggleModal"
        :distributor-selected="distributor"
        :load-data="getDistributorList"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import distributorForm from "../../components/distributor/distributor_form";
import { BModal } from "bootstrap-vue";
// import lnvTable from "../../components/ui/table";
import moment from "moment-timezone";
import {
  DISTRIBUTOR_LIST_REQUEST,
  DISTRIBUTOR_POST_REQUEST
} from "../../store/modules/distributor/actions";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { Message } from "element-ui";
import { export_json_to_excel } from "../../utils/Export2Excel";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import { convertDateFormat } from "../../utils/helpers";

export default {
  name: "DistributorPage",
  components: {
    breadcrumb: breadcrumb,
    distributorForm: distributorForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect: Multiselect
  },
  computed: {
    setFormTitle() {
      if (this.distributor.id) {
        return "Edit Distributor";
      } else {
        return "Add Distributor";
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
        card_title: "Distributors",
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
          initial_sort_order: "desc", // "asc" by default
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "code",
          label: "Distributor Code",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Distributor Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "countryName",
          label: "Country",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "Action",
          label: "Action",
          visibility: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      distributorList: [],
      distributor: {},
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
      isCountriesLoading: false,
      isIndonesia: 28
    };
  },
  methods: {
    showModal() {
      this.$refs["distributor-modal"].show();
    },
    hideModal() {
      this.$refs["distributor-modal"].hide();
    },
    toggleModal(row) {
      if (row) {
        this.distributor = row;
      } else {
        this.distributor = {};
      }
      this.$refs["distributor-modal"].toggle("#toggle-btn");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getDistributorList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getDistributorList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getDistributorList();
    },
    getDistributorList() {
      let pdata = {};
      this.distributorList = [];

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

      this.$store.dispatch(DISTRIBUTOR_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.distributorList = res.content;
          this.total = this.distributorList.length;
        }
      });
    },
    doEdit(row) {
      this.distributor = row;
      this.$refs["distributor-modal"].toggle("#toggle-btn");
    },
    doChangeStatus(row) {
      this.$buefy.dialog.confirm({
        message:
          row.status == "ACTIVE"
            ? "Do you want to deactivete " + row.dealerName
            : "Do you want to activate " + row.dealerName,
        onConfirm: () => {
          //  this.$buefy.toast.open("User confirmed")
          row.change_status = true;
          this.$store.dispatch(DISTRIBUTOR_POST_REQUEST, row).then(() => {
            this.getDistributorList();
            Message({
              message:
                row.status == "ACTIVE"
                  ? "Distributor Deactivated."
                  : "Distributor Activated.",
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
      const tHeader = ["ID", "Distributor Code", "Distributor Name", "Country"];
      const filterVal = ["id", "code", "name", "countryName"];
      const data = this.formatJson(filterVal, this.distributorList);
      const fileName = "distributors";
      export_json_to_excel({
        header: tHeader,
        data,
        filename: fileName,
        sheetName: "distributors",
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "invoiceDate") {
            return convertDateFormat(v[j], "YYYY-MM-DD");
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
    }
  },
  mounted() {
    this.getCountries();
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.isCountryAdmin = this.$store.getters.isCountryAdmin;

    if (this.isCountryAdmin && this.countryId === this.isIndonesia) {
      this.canAdd = true;
      this.canUpload = false;
      this.canDownload = true;
      this.canEdit = true;
      this.canDelete = false;
    } else {
      this.canAdd = false;
      this.canUpload = false;
      this.canDownload = false;
      this.canEdit = false;
      this.canDelete = false;
    }

    if (!this.isRegionAdmin) {
      this.getDistributorList();
    }
  },
  created() {}
};
</script>
