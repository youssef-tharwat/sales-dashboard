<template>
  <div id="leader-promoter-list">
    <div class="row">
      <div class="col-lg-12">
        <VueBootstrap4Table
          :classes="classes"
          :rows="leaderPromoterList"
          :columns="columns"
          :config="config"
          :total-rows="total"
          @on-change-query="onChangeQuery"
          @refresh-data="getLeaderPromotersList"
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
          <template slot="empty-results">No Promoters found</template>

          <template slot="id" slot-scope="props">
            <span>{{ props.row.id }}</span>
          </template>

          <template slot="genderId" slot-scope="props">
            <span>{{ getGenderName(props.row.genderId) }}</span>
          </template>

          <template slot="name" slot-scope="props">
            <div class="inner-data">
              <span class="bold-text">{{ props.row.name }}</span>
              <!-- <br />
              <i class="fa fa-venus-mars"></i>
              {{(getGenderName(props.row.genderId))}}
              <br />
              <span v-if="props.row.icNumber">
                <i class="fa fa-id-card-o"></i>
                {{(props.row.icNumber)}}
                <br />
              </span>
              <span v-if="props.row.phoneNumber">
                <i class="fa fa-phone-square"></i>
                {{(props.row.phoneNumber)}}
                <br />
              </span>
              <span v-if="props.row.email">
                <i class="fa fa-envelope-o"></i>
                {{(props.row.email)}}
              </span>-->
            </div>
          </template>

          <template slot="Action" slot-scope="props">
            <button
              v-if="!checkPromoterAssigned(props.row.id)"
              class="btn btn-success btn-xs"
              @click="addOrRemovePromoter(props.row, 1)"
            >
              <i class="fa fa-plus"></i> ADD
            </button>
            <button
              v-if="checkPromoterAssigned(props.row.id)"
              class="btn btn-danger btn-xs"
              @click="addOrRemovePromoter(props.row, 0)"
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
import { GET_STAFF_LIST_REQUEST, POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import { GENDER_LIST_REQUEST } from "../../store/modules/utility/actions";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "LeaderPromoters",
  components: {
    VueBootstrap4Table: VueBootstrap4Table
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    leaderSelected: {
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
        card_title: "Leader Promoters",
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
          label: "Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "icNumber",
          label: "IC Number",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "email",
          label: "Email",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }

        // {
        //   name: "promoterLeaderEmail",
        //   label: "Leader",
        //   sort: true,
        //   row_text_alignment: "text-left",
        //   column_text_alignment: "text-left"
        // }
      ],
      total: 0,
      leaderPromoterList: [],
      genders: [],
      leader: this.leaderSelected,
      assignedPromoters: this.leaderSelected.promoterList ? this.leaderSelected.promoterList : [],
      assignedPromotersTotal: 0
    };
  },
  methods: {
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.getLeaderPromotersList();
    },
    getLeaderPromotersList() {
      this.leaderPromoterList = [];
      this.$store.dispatch(GET_STAFF_LIST_REQUEST, { type: "promoters" }).then(res => {
        if (res.content && res.resultCode === 0) {
          res.content.forEach(item => {
            if (item.promoterLeaderId === this.leader.id || item.promoterLeaderId === null) {
              this.leaderPromoterList.push(item);
            }
          });

          this.total = this.leaderPromoterList.length;
        }
      });
    },
    getGenders() {
      this.$store.dispatch(GENDER_LIST_REQUEST).then(res => {
        if (res.content && res.resultCode === 0) {
          this.genders = res.content;
        }
      });
    },
    getGenderName(id) {
      let gender = this.genders.filter(function(elem) {
        if (elem.id == id) return elem;
      });
      if (gender[0]) {
        return gender[0].text;
      } else {
        return "";
      }
    },
    formatDate: function(date) {
      return moment(String(date)).format("YYYY-MM-DD HH:MM A");
    },
    checkPromoterAssigned(id) {
      const hvPic = this.assignedPromoters.filter(function(elem) {
        if (elem.id == id) return elem;
      });
      if (hvPic[0]) {
        return true;
      } else {
        return false;
      }
    },
    addOrRemovePromoter(row, state) {
      let pdata = {};
      pdata.data = row;
      pdata.staffId = row.id;
      pdata.data.id = row.id;
      pdata.type = "promoters";
      // alert(state);
      if (state === 1) {
        pdata.data.promoterLeaderId = this.leader.id;
        pdata.data.promoterLeaderEmail = this.leader.email;
      } else {
        pdata.data.promoterLeaderId = null;
        pdata.data.promoterLeaderEmail = null;
      }

      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Submitting..."
      });
      // alert(JSON.stringify(pdata));
      this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.getLeaderPromotersList();
          if (state) {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Promoter Successfully Added."
            });
          } else {
            this.$store.dispatch(NOTIFICATION_SUCCESS, {
              message: "Promoter Successfully Removed."
            });
          }
        }
      });
      //outletPicId
    }
  },
  mounted() {
    this.getGenders();
    this.getLeaderPromotersList();
  },
  created() {
    // this.getLeaderPromotersList();
  }
};
</script>
