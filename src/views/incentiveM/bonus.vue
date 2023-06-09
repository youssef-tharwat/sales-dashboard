<template>
  <div id="incentive-bonus">
    <breadcrumb title="Dashboard" subtitle="Bonus Incentive" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div v-if="!isRegionAdmin" class="row">
                <div class="col-lg-12 add-employee-button">
                  <router-link
                    to="/dashboard/incentive/bonus/add"
                    class="btn btn-primary"
                  >
                    <i class="fa fa-plus"></i> Add Bonus Incentive
                  </router-link>
                </div>
              </div>
              <br />
              <div class="row">
                <div class="col-12 mb-3">
                  <div class="w-100">
                    <div class="form-group flex-grow-1 w-100">
                      <Multiselect
                        v-if="isRegionAdmin"
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
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="incentiveBonusList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getIncentiveList"
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
                      <div class="bold-text">No Bonus Incentives Found!</div>
                    </template>

                    <template slot="bonusDate" slot-scope="props">
                      <span>{{
                        props.row.startDate + " - " + props.row.endDate
                      }}</span>
                    </template>

                    <template slot="type" slot-scope="props">
                      <span>{{ unitTierType(props.row.type) }}</span>
                    </template>

                    <template slot="rewardType" slot-scope="props">
                      <span>{{ props.row.rewardType.text }}</span>
                    </template>

                    <template slot="recurring" slot-scope="props">
                      <span class="text-center">{{ props.row.recurring }}</span>
                    </template>

                    <template slot="edit" slot-scope="props">
                      <button
                        v-if="!isRegionAdmin"
                        class="btn btn-warning btn-xs"
                        @click.prevent="openEditPage(props.row.id)"
                      >
                        <i class="fa fa-edit"></i>
                        Edit
                      </button>
                      <button
                        v-else
                        class="btn btn-primary btn-xs"
                        @click.prevent="openEditPage(props.row.id)"
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
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import Multiselect from "vue-multiselect";
import { INCENTIVE_BONUS_LIST_REQUEST } from "../../store/modules/incentive/action";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";

export default {
  name: "Incbonus",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect
  },
  data() {
    return {
      isRegionAdmin: false,
      incentiveBonusList: [],
      total: 0,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Incentives bonus",
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
          name: "name",
          label: "name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "bonusDate",
          label: "Bonus Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "type",
          label: "Bonus Type",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "rewardType",
          label: "Reward Type",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "recurring",
          label: "Recurring",
          sort: true,
          row_text_alignment: "text-center",
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
      search: {},
      countries: [],
      countryId: 0,
      isCountriesLoading: false
    };
  },
  methods: {
    getIncentiveList() {
      let pdata = {};
      if (this.isRegionAdmin) {
        pdata.countryId = this.search.countryId
          ? this.search.countryId.id
          : null;
      } else {
        pdata.countryId = this.countryId;
      }

      this.$store.dispatch(INCENTIVE_BONUS_LIST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.incentiveBonusList = res.content;
          this.total = this.incentiveBonusList.length;
          this.incentiveBonusList.forEach(item => {
            item.startDate = item.startDate.split(" ")[0];
            item.endDate = item.endDate.split(" ")[0];
          });
        }
      });
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getIncentiveList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        this.getIncentiveList();
      }
    },
    unitTierType(type) {
      if (type == "SINGLE_REWARD_ACC") {
        return "Single reward accumulative";
      }

      if (type == "SINGLE_REWARD_NON_ACC") {
        return "Single reward none accumulative";
      }

      if (type == "MULTI_REWARD_ACC") {
        return "Mutliple accumulative";
      }

      if (type == "MULTI_REWARD_NON_ACC") {
        return "Multiple none accumulative";
      }
    },
    openEditPage(id) {
      this.$router.push({
        name: "Edit Bonus Incentive",
        params: { id: id }
      });
    },
    regionAdminCheck() {
      this.isRegionAdmin = this.$store.getters.isRegionAdmin;
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
    this.countryId = this.$store.getters.getCountryId;
    this.regionAdminCheck();

    if (!this.isRegionAdmin) {
      this.getIncentiveList();
    } else {
      this.getCountries();
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/views/incentive/bonus";
</style>
