<template>
  <div id="manager-region-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="
            isRegionAdmin
              ? managerSelected.assignedRegion
              : managerRegionList
          "
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="managerRegionList"
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
          <template v-if="!isLoadingRegions" slot="empty-results">
            No Regions found
          </template>
          <div
            v-if="isLoadingRegions"
            class="bold-text"
            v-text="$ml.get('data_loading')"
          ></div>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.id }}</span>
          </template>

          <template slot="text" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.text }}</span>
              <br />
              <span>{{ props.row.code }}</span>
            </div>
          </template>

          <template slot="Action" slot-scope="props">
            <button
              v-if="!props.row.assignedToUser"
              class="btn btn-success btn-xs"
              @click="addOrRemoveRegion(props.row, 1)"
            >
              <i class="fa fa-plus"></i> ASSIGN
            </button>
            <button
              v-if="props.row.assignedToUser"
              class="btn btn-danger btn-xs"
              @click="addOrRemoveRegion(props.row, 0)"
            >
              <i class="fa fa-close"></i> REMOVE
            </button>
          </template>
        </VueBootstrap4Table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { COUNTRY_LIST_REQUEST } from "../../store/modules/utility/actions";

import { POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "ManagerRegions",
  components: {
    VueBootstrap4Table: VueBootstrap4Table
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    managerSelected: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {},
  data() {
    return {
      config: {
        checkbox_rows: false,
        rows_selectable: false,
        server_mode: false,
        card_title: "Regions",
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
          name: "text",
          label: "Region Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          width: "80%"
        }
      ],
      total: 0,
      managerRegionList: [],
      manager: this.managerSelected,
      assignedRegions: this.managerSelected.assignedRegion,
      assignedRegionsTotal: this.managerSelected.assignedRegion.length,
      isRegionAdmin: false,
      isLoadingRegions: false,
      countryId: null
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getManagerRegionList();
    },
    getManagerRegionList() {
      let lst = [];
      this.isLoadingRegions = true;
      this.$store
        .dispatch(COUNTRY_LIST_REQUEST, {
          withRegion: true,
          countryId: this.countryId
        })
        .then(res => {
          if (res.resultCode === 0) {
            res.content.children.forEach(item => {
              item.assignedToUser = this.checkRegionAssigned(item.code);
              if (!item.assigned || item.assignedToUser) {
                lst.push(item);
              }
            });

            lst.sort(function(a, b) {
              return b.assignedToUser - a.assignedToUser;
            });

            this.managerRegionList = lst;
            this.total = this.managerRegionList.length;
            this.isLoadingRegions = false;
          } else {
            this.isLoadingRegions = false;
          }
        });
    },
    checkRegionAssigned(code) {
      const hvAsssigned = this.assignedRegions.filter(function(elem) {
        if (elem == code) return elem;
      });
      if (hvAsssigned[0]) {
        return true;
      } else {
        return false;
      }
    },
    addOrRemoveRegion(row, type) {
      let pdata = {};
      let regions = this.manager.assignedRegion;
      if (type === 0) {
        const index = regions.indexOf(row.code);
        if (index > -1) {
          regions.splice(index, 1);
        }
      } else {
        regions.push(row.code);
      }

      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Submitting..."
      });
      pdata.data = {};
      pdata.staffId = this.manager.id;
      pdata.data = this.manager;
      pdata.data.assignedRegion = regions;
      pdata.type = "regionalManager";

      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.success();
          if (type === 1) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Region Assigned."
            });
          } else {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Region Removed."
            });
          }
        } else {
          const index = regions.indexOf(row.code);
          if (index > -1) {
            regions.splice(index, 1);
          }
        }
      });
    },
    formatDate: function(date) {
      return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    },
    close() {
      this.closeModal();
    },
    success() {
      this.close();
      this.loadData();
    }
  },
  mounted() {
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.countryId = this.$store.getters.getCountryId;

    if (!this.isRegionAdmin) {
      this.columns.push({
        name: "Action",
        label: "Action",
        row_text_alignment: "text-left",
        column_text_alignment: "text-left"
      });
    }
    this.getManagerRegionList();
  },
  created() {}
};
</script>
