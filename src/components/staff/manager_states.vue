<template>
  <div id="manager-state-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="
            isRegionAdmin
              ? managerSelected.assignedState
              : managerStateList
          "
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getManagerStateList"
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
          <template v-if="!isLoadingStates" slot="empty-results">
            No States found
          </template>
          <div
            v-if="isLoadingStates"
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
              @click="addOrRemoveState(props.row, 1)"
            >
              <i class="fa fa-plus"></i> ASSIGN
            </button>
            <button
              v-if="props.row.assignedToUser"
              class="btn btn-danger btn-xs"
              @click="addOrRemoveState(props.row, 0)"
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
import { STATE_LIST_REQUEST } from "../../store/modules/utility/actions";

import { POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "ManagerStates",
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
        card_title: "States",
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
          label: "State Info",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      total: 0,
      managerStateList: [],
      manager: this.managerSelected,
      assignedState: this.managerSelected.assignedState,
      assignedStateTotal: this.managerSelected.assignedState.length,
      isRegionAdmin: false,
      isLoadingStates: false,
      countryId: null
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getManagerStateList();
    },
    getManagerStateList() {
      let lst = [];
      this.isLoadingStates = true;
      this.$store
        .dispatch(STATE_LIST_REQUEST, { countryId: this.countryId })
        .then(res => {
          if (res.resultCode === 0) {
            res.content.forEach(item => {
              item.assignedToUser = this.checkStateAssigned(item.code);
              if (!item.assigned || item.assignedToUser) {
                lst.push(item);
              }
            });

            lst.sort(function(a, b) {
              return b.assignedToUser - a.assignedToUser;
            });

            this.managerStateList = lst;
            this.total = this.managerStateList.length;
            this.isLoadingStates = false;
          } else {
            this.isLoadingStates = false;
          }
        });
    },
    checkStateAssigned(code) {
      const hvPic = this.assignedState.filter(function(elem) {
        if (elem == code) return elem;
      });
      if (hvPic[0]) {
        return true;
      } else {
        return false;
      }
    },
    addOrRemoveState(row, type) {
      let pdata = {};
      let states = this.manager.assignedState;

      if (type === 0) {
        let index = states.indexOf(row.code);
        if (index > -1) {
          states.splice(index, 1);
        }
      } else {
        states.push(row.code);
      }

      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Submitting..."
      });

      pdata.stateId = row.id;
      pdata.staffId = this.manager.id;
      pdata.data = this.manager;
      pdata.data.assignedState = states;
      pdata.type = "stateManager";

      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.success();
          if (type === 1) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "State Assigned."
            });
          } else {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "State Removed."
            });
          }
        } else {
          let index = states.indexOf(row.code);
          if (index > -1) {
            states.splice(index, 1);
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
    this.getManagerStateList();
  },
  created() {}
};
</script>
