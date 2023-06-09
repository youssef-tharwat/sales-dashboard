<template>
  <div id="incentive-normal">
    <breadcrumb title="Dashboard" subtitle="Normal Incentive" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div
                  class="col-lg-12 add-employee-button d-flex align-items-center mb-4 flex-row-reverse"
                >
                  <button
                    v-if="!isRegionAdmin"
                    class="btn btn-primary mr-3 d-flex align-items-center"
                    :disabled="incentiveListIsLoading"
                    @click="openAddPage()"
                  >
                    <i class="fa fa-upload mr-2"></i>
                    Add Incentive List
                    <SpringSpinner
                      v-if="incentiveListIsLoading"
                      class="ml-3"
                      :size="17"
                      color="#fff"
                    />
                  </button>
                </div>
              </div>
              <div v-if="isRegionAdmin" class="row align-items-center">
                <div class="w-100 mb-3">
                  <div class="form-group flex-grow-1 w-100">
                    <Multiselect
                      ref="multiselect"
                      v-model="search.countryId"
                      placeholder="Select Country"
                      :searchable="true"
                      :options="countries"
                      label="text"
                      track-by="id"
                      :open-direction="'bottom'"
                      :loading="isCountriesLoading"
                      select-label
                      deselect-label
                      @input="onChangeCountry"
                    ></Multiselect>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="incentiveLists"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    :show-loader="true"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getIncentive"
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
                      <div class="bold-text">No Normal Incentives Found!</div>
                    </template>

                    <template slot="edit" slot-scope="props">
                      <button
                        v-if="!isRegionAdmin"
                        class="btn btn-warning btn-xs"
                        @click.prevent="openEditPage(props.row, 'edit')"
                      >
                        <i class="fa fa-edit"></i>
                        Edit
                      </button>
                      <button
                        v-else
                        class="btn btn-primary btn-xs"
                        @click.prevent="openEditPage(props.row, 'view')"
                      >
                        View
                      </button>
                    </template>
                  </VueBootstrap4Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BModal
      ref="incentive-normal-modal-upload"
      size="lg"
      hide-footer
      title="Add Incentive List"
    >
      <incentive_normal_upload_form
        :all-mtm="allMtm"
        :close-modal="toggleModalUpload"
        @get-normal-incentives="getIncentiveLists"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import { SpringSpinner } from "epic-spinners";
import Multiselect from "vue-multiselect";
import { export_json_to_excel } from "../../utils/Export2Excel";
import {
  INCENTIVE_NORMAL_GET_BY_ID,
  INCENTIVE_NORMAL_LIST_REQUEST
} from "../../store/modules/incentive/action";

import { Message } from "element-ui";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";

export default {
  name: "Incnor",
  components: {
    VueBootstrap4Table: VueBootstrap4Table,
    BModal,
    Multiselect,
    breadcrumb,
    SpringSpinner
  },
  data() {
    return {
      countries: [],
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Incentives",
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
          name: "name",
          label: "Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "startDate",
          label: "Start Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "endDate",
          label: "End Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "edit",
          label: "Action",
          sort: true,
          row_text_alignment: "text-center",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      allMtm: [],
      incentiveLists: [],
      incentiveListSelected: "",
      incentiveList: [],
      allIncentiveList: [],
      search: {},
      countryId: null,
      isRegionAdmin: false,
      tHeader: ["Product Family", "Mtm", "Sales Persons", "Promoters"],
      filterVal: ["mtmName", "mtmNo", "salesPerson", "promoter"],
      isCountriesLoading: false,
      incentiveListIsLoading: false
    };
  },
  methods: {
    openEditPage(incentive, type) {
      this.$router.push({
        name: "Edit Normal Incentive",
        params: { type: type, id: incentive.id }
      });
    },
    openAddPage() {
      this.$router.push({
        name: "Add Normal Incentive"
      });
    },
    getIncentiveLists() {
      this.incentiveListIsLoading = true;
      let pdata = {};

      if (this.isRegionAdmin) {
        pdata.countryId = this.search.countryId
          ? this.search.countryId.id
          : null;
      } else {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(INCENTIVE_NORMAL_LIST_REQUEST, pdata).then(res => {
        this.incentiveLists = res.content;
        this.incentiveLists.forEach(item => {
          item.nameDate =
            item.name +
            " - " +
            item.startDate.split(" ")[0] +
            " - " +
            item.endDate.split(" ")[0];
        });
      });
      this.incentiveListIsLoading = false;
    },
    getIncentive() {
      if (!this.incentiveListSelected) {
        Message({
          message: "No incentive selected.",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        this.$store
          .dispatch(INCENTIVE_NORMAL_GET_BY_ID, this.incentiveListSelected.id)
          .then(res => {
            this.incentiveList = res.content;
            this.total = this.incentiveList.length;
          });
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getIncentiveLists();
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    donwloadIncentive() {
      if (this.incentiveListSelected) {
        this.$store
          .dispatch(INCENTIVE_NORMAL_GET_BY_ID, this.incentiveListSelected.id)
          .then(res => {
            this.incentiveList = res.content;
            this.total = this.incentiveList.length;

            const data = this.formatJson(this.filterVal, this.incentiveList);
            const fileName =
              "normalIncentive-" + this.incentiveListSelected.name;

            if (this.incentiveList.length <= 0) {
              Message({
                message: "No records found",
                type: "error",
                duration: 5 * 1000
              });
            } else {
              export_json_to_excel({
                header: this.tHeader,
                data,
                filename: fileName,
                sheetName: "Sheet 1",
                autoWidth: true,
                bookType: "xlsx"
              });
            }
          });
      } else {
        Message({
          message: "Select a incentive to download.",
          type: "error",
          duration: 5 * 1000
        });
      }
    },
    downloadAllIncentive() {
      const data = this.formatJson(this.filterVal, this.allIncentiveList);
      const fileName = "normalIncentiveAll";
      if (this.allIncentiveList.length <= 0) {
        Message({
          message: "No records found",
          type: "error",
          duration: 5 * 1000
        });
      } else {
        export_json_to_excel({
          header: this.tHeader,
          data,
          filename: fileName,
          sheetName: "Sheet 1",
          autoWidth: true,
          bookType: "xlsx"
        });
      }
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        this.getIncentiveLists();
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
    regionAdminCheck() {
      this.isRegionAdmin = this.$store.getters.isRegionAdmin;

      // Region admin check is currently disabled to the updating to the incentive module. Will be restored in the future.

      // if (!this.isRegionAdmin && this.$store.getters.getCountryCode == "MY") {
      //   this.columns.push({
      //     name: "dealer",
      //     label: "Dealers",
      //     sort: true,
      //     row_text_alignment: "text-left",
      //     column_text_alignment: "text-left"
      //   });
      //
      //   this.tHeader.push("Dealers");
      //   this.filterVal.push("dealer");
      // }
    },
    toggleModalUpdate() {
      this.$refs["incentive-normal-modal-update"].toggle();
    },
    toggleModalUpload() {
      this.$refs["incentive-normal-modal-upload"].toggle();
    }
  },
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    this.regionAdminCheck();
    this.getCountries();

    if (!this.isRegionAdmin) {
      this.getIncentiveLists();
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/styles/views/incentive/normal";
</style>
