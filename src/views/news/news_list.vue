<template>
  <div id="incentive-normal">
    <breadcrumb title="Dashboard" subtitle="News" />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-lg-12 add-employee-button">
                  <button
                    v-if="canAdd"
                    class="btn btn-sm btn-primary"
                    @click="toggleModal(null)"
                  >
                    <i class="fa fa-plus"></i>
                    <span v-text="$ml.get('add_news_title')"></span>
                  </button>
                </div>
                <div v-if="isRegionAdmin" class="col-lg-12">
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
                        select-label
                        deselect-label
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
                    :rows="newsList"
                    :columns="columns"
                    :config="config"
                    :total-rows="total"
                    @on-change-query="onChangeQuery"
                    @refresh-data="getNewsList"
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
                        v-text="$ml.get('no_news_found')"
                      ></div>
                      <div
                        v-if="isDataLoading"
                        class="bold-text"
                        v-text="$ml.get('data_loading')"
                      ></div>
                    </template>
                    <template slot="bActive" slot-scope="props">
                      <!-- <span v-if="props.cell_value">ACTIVE</span>
                      <span v-if="!props.cell_value">DEACTIVE</span>-->
                      <lnvStatusTextBox :active="props.row.bActive" />
                      <!-- <span
                        class="label label-rounded label-success"
                        v-if="props.cell_value"
                        v-text="$ml.get('active_status_text')"
                      ></span>
                      <span
                        class="label label-rounded label-danger"
                        v-if="!props.cell_value"
                        v-text="$ml.get('deactive_status_text')"
                      ></span>-->
                    </template>

                    <template slot="announcementDate" slot-scope="props">
                      <span>{{ formatDate(props.cell_value) }}</span>
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
                          v-if="canDelete"
                          type="button"
                          class="btn btn-xs btn-danger"
                          @click="doDelete(props.row)"
                        >
                          <i class="fa fa-times color-danger"></i>
                          <span v-text="$ml.get('button_delete_text')"></span>
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

    <BModal ref="news-modal" size="lg" hide-footer :title="setFormTitle">
      <newsForm
        :can-view="canView"
        :can-edit="canEdit"
        :close-modal="toggleModal"
        :selected-news="news"
        :load-data="getNewsList"
        :currect-action="currectAction"
      />
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import newsForm from "../../components/news/news_form";
import { BModal } from "bootstrap-vue";
import { Message } from "element-ui";
// import lnvTable from "../../components/ui/table";
// import moment from "moment-timezone";
import { convertDateFormat } from "../../utils/helpers";
import {
  NEWS_LIST_REQUEST,
  NEWS_DELETE_REQUEST
} from "../../store/modules/news/actions";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import lnvStatusTextBox from "../../components/ui/statusTextBox";

export default {
  name: "News",
  components: {
    breadcrumb: breadcrumb,
    newsForm: newsForm,
    BModal: BModal,
    VueBootstrap4Table: VueBootstrap4Table,
    Multiselect: Multiselect,
    lnvStatusTextBox: lnvStatusTextBox
  },
  computed: {
    // setFormTitle() {
    //   if (this.news.id) {
    //     return "Edit News";
    //   } else {
    //     return "Add News";
    //   }
    // }
  },
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "News",
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
          name: "header",
          label: "News Header",
          sort: true,
          width: "33%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "targetName",
          label: "Target",
          sort: true,
          width: "12%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "announcementDate",
          label: "Date of Announcement",
          sort: true,
          width: "16%",
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          initial_sort: true, // "false" by default
          initial_sort_order: "desc" // "asc" by default
        },
        {
          name: "bActive",
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
      total: 0,
      newsList: [],
      news: {},
      isRegionAdmin: false,
      countries: [],
      search: {},
      countryId: {},
      canAdd: false,
      canDelete: false,
      canEdit: false,
      canView: false,
      setFormTitle: "Add News",
      currectAction: false,
      isCountriesLoading: false,
      isDataLoading: false
    };
  },
  methods: {
    showModal() {
      this.$refs["news-modal"].show();
    },
    hideModal() {
      this.$refs["news-modal"].hide();
    },
    toggleModal(row, view) {
      if (row) {
        if (view) {
          this.setFormTitle = "View News";
          this.currectAction = "view";
        } else {
          this.setFormTitle = "Edit News";
          this.currectAction = "edit";
        }
        this.news = row;
      } else {
        this.setFormTitle = "Add News";
        this.currectAction = "edit";
        this.news = {};
      }
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs["news-modal"].toggle("#toggle-btn");
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getNewsList();
    },
    onChangeCountry(value) {
      if (value) {
        this.countryId = value.id;
        // this.getNewsList();
      }
    },
    doSearch() {
      this.countryId = this.search.countryId ? this.search.countryId.id : null;
      this.getNewsList();
    },
    getNewsList() {
      this.newsList = [];
      this.isDataLoading = true;
      let pdata = { countryId: this.$store.getters.getCountryId };
      // const countryId =

      if (this.isRegionAdmin) {
        if (!this.countryId) {
          return Message({
            message: "Select a country",
            type: "error",
            duration: 5 * 1000
          });
        } else {
          pdata.countryId = this.search.countryId
            ? this.search.countryId.id
              ? this.search.countryId.id
              : null
            : null;
        }
      }
      // alert(pdata.countryId);
      this.$store.dispatch(NEWS_LIST_REQUEST, pdata).then(res => {
        if (res.content && res.resultCode === 0) {
          this.newsList = res.content;
          this.total = this.newsList.length;
          this.isDataLoading = false;
        } else {
          this.isDataLoading = false;
        }
      });
    },
    doDelete(row) {
      // window.alert(`deleting item ID` + JSON.stringify(row));
      this.$buefy.dialog.confirm({
        message: "Do you want to delete " + row.header,
        onConfirm: () => {
          this.$store.dispatch(NEWS_DELETE_REQUEST, row).then(res => {
            if (res.resultCode === 0) {
              Message({
                message: "News Deleted",
                type: "success",
                duration: 5 * 1000
              });

              this.getNewsList();
            }
          });
          //  this.$buefy.toast.open("User confirmed")
        }
      });
    },
    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
      // return moment(String(date)).format("YYYY-MM-DD HH:MM A");
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
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;

    if (this.isRegionAdmin) {
      this.canAdd = false;
      this.canEdit = false;
      this.canDelete = false;
      this.canView = true;
      this.countryId = {};
    } else {
      this.canAdd = true;
      this.canEdit = true;
      this.canDelete = true;
      this.canView = false;
    }

    this.getCountries();
    if (!this.isRegionAdmin) {
      this.getNewsList();
    }
  },
  created() {
    // this.getNewsList();
  }
};
</script>
