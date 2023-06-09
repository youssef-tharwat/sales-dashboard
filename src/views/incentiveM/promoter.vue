<template>
  <div id="incentive-promoter">
    <breadcrumb
      title="Dashboard"
      subtitle="Incentive Management"
      sub-sub-title="Promoter Incentive"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div v-if="!isCountryAdmin" class="row">
                <div class="col-lg-12 add-employee-button">
                  <router-link to="/dashboard/incentive/promoter/add" class="btn btn-primary">
                    <i class="fa fa-plus"></i> Add Promoter Incentive
                  </router-link>
                </div>
              </div>
              <div v-else></div>
              <br />
              <div class="row">
                <div class="col-lg-12">
                  <VueBootstrap4Table
                    :classes="classes"
                    :rows="incentivePromoterList"
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
                      <div class="bold-text">No Promoter Incentives Found!</div>
                    </template>

                    <template slot="objective1" slot-scope="props">
                      <span>{{ props.row.objective1 ? "Yes" : "No" }}</span>
                    </template>

                    <template slot="objective2" slot-scope="props">
                      <span>{{ props.row.objective2 ? "Yes" : "No" }}</span>
                    </template>

                    <template slot="edit" slot-scope="props">
                      <button
                        class="btn btn-info btn-xs"
                        @click.prevent="openEditPage(props.row.id)"
                      >
                        <i class="fa fa-eye"></i>
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
import { INCENTIVE_PROMOTER_LIST_REQUEST } from "../../store/modules/incentive/action";

export default {
  name: "Incpromoter",
  components: {
    breadcrumb: breadcrumb,
    VueBootstrap4Table: VueBootstrap4Table
  },
  computed: {
    isCountryAdmin() {
      return this.$store.getters.isCountryAdmin ? true : false;
    }
  },
  data() {
    return {
      incentivePromoterList: [],
      total: 0,
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Incentives Promoter",
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
          name: "startMonthString",
          label: "Start Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "endMonthString",
          label: "End Date",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "objective1",
          label: "Objective 1",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "objective2",
          label: "Objective 2",
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
      search: {},
      countries: [],
      isCountriesLoading: false
    };
  },
  methods: {
    async getIncentiveList() {
      const res = await this.$store.dispatch(INCENTIVE_PROMOTER_LIST_REQUEST);
      if (res.resultCode === 0) {
        this.incentivePromoterList = await res.content;
        this.total = this.incentivePromoterList.length;
      }
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getIncentiveList();
    },
    openEditPage(id) {
      this.$router.push("/dashboard/incentive/promoter/edit/" + id);
    }
  },
  mounted() {
    this.getIncentiveList();
  }
};
</script>
<style lang="scss"></style>
