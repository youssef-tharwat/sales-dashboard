<template>
  <div id="incentive-promoter-add">
    <breadcrumb
      title="Dashboard"
      subtitle="Promoter Incentive"
      sub-sub-title="Add Promoter Incentive"
    ></breadcrumb>
    <div class="row lnv-main-card">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <form>
                <div class="row form-group">
                  <div class="col-12 mb-4">
                    <label class="text-label">Promoter Incentive Name*</label>
                    <input
                      v-model="incentive.name"
                      v-validate="'required'"
                      type="text"
                      name="Promoter Incentive Name"
                      class="form-control"
                    />
                    <span class="invalid-field mt-2">{{
                      errors.first("Promoter Incentive Name")
                    }}</span>
                  </div>

                  <div class="col-6 mb-4">
                    <label class="text-label">Start Month*</label>
                    <Datepicker
                      v-model="incentive.startMonth"
                      v-validate="'required'"
                      :minimum-view="'month'"
                      :open-date="today"
                      :maximum-view="'year'"
                      :initial-view="'month'"
                      name="Start Month"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select Start Month"
                      :disabled-dates="disabledDates"
                      :format="format"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("Start Month")
                    }}</span>
                    <span
                      v-if="incentiveErrors.startMonth"
                      class="invalid-field mt-2"
                    >{{ incentiveErrors.startMonth }}</span>
                  </div>
                  <div class="col-6 mb-4">
                    <label class="text-label">End Month*</label>

                    <Datepicker
                      v-model="incentive.endMonth"
                      v-validate="'required'"
                      :minimum-view="'month'"
                      :open-date="today"
                      :maximum-view="'year'"
                      :initial-view="'month'"
                      name="End Month"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select End Month"
                      :disabled-dates="disabledDates"
                      :format="format"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("End Month")
                    }}</span>
                    <span
                      v-if="incentiveErrors.endMonth"
                      class="invalid-field mt-2"
                    >{{ incentiveErrors.endMonth }}</span>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <h4>Objective 1</h4>
                  </div>
                </div>
                <div class="col-12 mb-4 d-flex align-items-center p-0">
                  <div class="d-flex flex-column mr-5 mt-4">
                    <div class="d-flex mb-3">
                      <h5 class="black-text">Tiers</h5>
                      <div class="ml-3">
                        <i
                          v-if="tiersCount < 5"
                          class="fa fa-plus-circle"
                          @click="addRule('tiersCount')"
                        ></i>
                        <i
                          v-if="tiersCount > 3"
                          class="fa fa-minus-circle ml-2"
                          @click="removeRule('tiersCount')"
                        ></i>
                      </div>
                    </div>

                    <div class="mt-4 mr-4">
                      <div class="d-flex flex-column">
                        <label for>Target(% of Achievement)</label>
                        <div class="d-flex align-items-center">
                          <div
                            v-for="(tierItem, tierIndex) in tiersArray"
                            :key="'A' + tierIndex"
                            scope="col"
                            class="mr-4"
                          >
                            {{
                              tierIndex >= 0
                                ? "Tier " + tierCounter(tierIndex)
                                : ""
                            }}
                            <div>
                              <input
                                v-model.number="tierItem.tierAchievement"
                                v-validate="
                                  'required|integer|max_value:200|min_value:' +
                                    minValue(tierIndex, 'tierAchievement')
                                "
                                class="form-control"
                                :name="'Target Tier ' + tierCounter(tierIndex)"
                                type="number"
                              />
                              <span class="invalid-field mt-2">{{
                                errors.first(
                                  "Target Tier " + tierCounter(tierIndex)
                                )
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt mr-4">
                      <div class="d-flex flex-column mt-4">
                        <label for>Reward(% from Total Submission SRP)</label>
                        <div class="d-flex align-items-center">
                          <div
                            v-for="(tierItem2, index2) in tiersArray"
                            :key="'B' + index2"
                            scope="col"
                            class="mr-4"
                          >
                            {{
                              index2 >= 0 ? "Tier " + tierCounter(index2) : ""
                            }}
                            <div>
                              <input
                                v-model.number="tierItem2.tierReward"
                                v-validate="
                                  'required|decimal:2|max_value:100|min_value:' +
                                    minValue(index2, 'tierReward')
                                "
                                class="form-control"
                                type="number"
                                :name="'Reward Tier ' + tierCounter(index2)"
                              />
                              <span class="invalid-field mt-2">{{
                                errors.first(
                                  "Reward Tier " + tierCounter(index2)
                                )
                              }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <h4>Objective 2</h4>
                  </div>
                </div>
                <div class="col-12 mb-4 d-flex align-items-center p-0">
                  <div class="d-flex flex-fill flex-column mt-4">
                    <div class="d-flex mb-3">
                      <h5 class="black-text">Tiers</h5>
                      <div class="ml-3">
                        <i
                          v-if="tiersCount2 < 5"
                          class="fa fa-plus-circle"
                          @click="addRule('tiersCount2')"
                        ></i>
                        <i
                          v-if="tiersCount2 > 3"
                          class="fa fa-minus-circle ml-2"
                          @click="removeRule('tiersCount2')"
                        ></i>
                      </div>
                    </div>

                    <div class="mt-4">
                      <div class="d-flex flex-column">
                        <div class="d-flex align-items-center">
                          <table class="fixed table table-bordered">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Product Family</th>
                                <th>% of Incentive Entitlement</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(tierItem, tierIndex) in tiersArray2"
                                :key="'C' + tierIndex"
                                scope="col"
                                class="mr-4"
                              >
                                <td>
                                  {{
                                    tierIndex >= 0 ? tierCounter(tierIndex) : ""
                                  }}
                                </td>

                                <td class="w-75">
                                  <div class="float-left">
                                    <span
                                      v-for="(product,
                                              idx) in tierItem.productFamily"
                                      :key="'C' + idx"
                                      scope="col"
                                      class="mr-1"
                                    >
                                      {{
                                        idx != tierItem.productFamily.length - 1
                                          ? product.name + ","
                                          : product.name
                                      }}
                                    </span>
                                    <span
                                      v-if="productErrorMsg(tierIndex)"
                                      class="invalid-field mt-2"
                                    >
                                      The Product Family field is required</span>
                                  </div>
                                  <div class="float-right">
                                    <button
                                      type="button"
                                      :disabled="productFamilyIsLoading"
                                      class="btn btn-sm btn-primary"
                                      @click="modalToggle(tierIndex)"
                                    >
                                      Select
                                    </button>
                                  </div>
                                </td>

                                <td>
                                  <input
                                    v-model.number="tierItem.tierReward"
                                    v-validate="
                                      'required|decimal:2|max_value:100|min_value:0'
                                    "
                                    class="form-control"
                                    type="number"
                                    :name="'Tier ' + tierCounter(tierIndex)"
                                  />
                                  <span class="invalid-field mt-2">{{
                                    errors.first(
                                      "Tier " + tierCounter(tierIndex)
                                    )
                                  }}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mt-5">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-primary pull-right ml-3"
                      @click.prevent="handleData"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BModal ref="selection-modal" size="lg" hide-footer title="Product Family">
      <div>
        <VueBootstrap4Table
          :classes="classes"
          :rows="formatTableRowData(availProductFamilyList)"
          :columns="columns"
          :config="config"
          :total-rows="total"
          :selected_items="selectedProductFamily"
          :show-loader="true"
          @on-change-query="onChangeQuery"
          @refresh-data="getProductFamilyList"
          @on-select-row="productInput"
          @on-all-select-rows="productInput"
          @on-unselect-row="productInput"
          @on-all-unselect-rows="productInput"
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
            <div class="bold-text">No Product Family Found!</div>
          </template>
        </VueBootstrap4Table>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <button
          type="btn"
          class="btn btn-primary btn-sm"
          @click="modalToggle(null)"
        >
          Close
        </button>
      </div>
    </BModal>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb/breadcrumb";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal } from "bootstrap-vue";
import {
  INCENTIVE_PROMOTER_ADD,
  INCENTIVE_PROMOTER_PRODUCT_FAMILY_REQUEST
} from "../../store/modules/incentive/action";

export default {
  name: "IncpromoterAdd",
  components: { Datepicker, breadcrumb, VueBootstrap4Table, BModal },
  computed: {},
  data() {
    return {
      config: {
        checkbox_rows: true,
        rows_selectable: true,
        server_mode: false,
        card_title: "Product Family",
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
          label: "Product Family",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          column_classes: "w-75"
        }
      ],
      total: 0,
      incentive: {},
      incentiveErrors: {},
      today: new Date(),
      disabledDates: {
        to: "", // Disable all dates up to specific date
        from: "" // Disable all dates after specific date
      },
      tempStartMonth: "",
      tempEndMonth: "",
      format: "MMMM yyyy",
      tiersArray: [],
      tiersArray2: [],
      tiersCount: 0,
      tiersCount2: 0,
      submitted: false,
      productFamilyList: [],
      availProductFamilyList: [],
      selectedProductFamily: [],
      productFamilyIsLoading: false,
      currentIndex: 0
    };
  },
  watch: {
    currentIndex: function() {
      // console.log("currentIndex changed", val);
      this.selectedProductFamily = [];
    }
  },
  methods: {
    validateObj2() {
      const data = JSON.parse(JSON.stringify(this.tiersArray2));
      data.forEach((obj, idx) => {
        let temp = "productFamily" + idx;
        if (obj.productFamily.length <= 0) {
          this.incentiveErrors[temp] = "The Product Family field is required";
        } else {
          delete this.incentiveErrors[temp];
        }
      });
    },
    updateTierProduct(idx) {
      this.tiersArray2[idx].productFamily = [...this.selectedProductFamily];
    },
    async productInput(products) {
      // console.log(products);
      const localProducts = await products.selected_items;
      this.selectedProductFamily = [...localProducts];
      this.updateTierProduct(this.currentIndex);
    },
    formatTableRowData(data) {
      let reformattedArray = data.map(obj => {
        let rObj = { name: obj };
        return rObj;
      });
      return reformattedArray;
    },
    unformatTableRowData(data) {
      let finalData = data.map(item => {
        item.productFamily = item.productFamily.map(product => {
          return product.name;
        });
        return item;
      });
      // console.log(finalData);
      return finalData;
    },
    async getProductFamilyList() {
      this.productFamilyIsLoading = true;
      const res = await this.$store.dispatch(
        INCENTIVE_PROMOTER_PRODUCT_FAMILY_REQUEST
      );
      this.productFamilyList = await res.content;
      this.availProductFamilyList = await JSON.parse(
        JSON.stringify(this.productFamilyList)
      );
      this.productFamilyIsLoading = false;
    },
    async handleData() {
      try {
        await this.validateObj2();
        let result = await this.$validator.validateAll();
        if (result && Object.keys(this.incentiveErrors).length === 0) {
          await this.dataAdjustment();
          this.handleSubmit();
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    handleSubmit() {
      this.$store.dispatch(INCENTIVE_PROMOTER_ADD, this.incentive).then(res => {
        this.submitted = true;
        if (res.resultCode === 0) {
          this.$router.push("/dashboard/incentive/promoter");
        } else {
          this.incentive.startMonth = this.tempStartMonth;
          this.incentive.endMonth = this.tempEndMonth;
        }
      });
    },
    async modalToggle(idx) {
      if (idx != null) {
        this.currentIndex = idx;
        this.selectedProductFamily = await [];
        this.selectedProductFamily = [...this.tiersArray2[idx].productFamily];
        this.availProductFamilyList = [...this.checkAvailProductFamily(idx)];
      }
      this.$refs["selection-modal"].toggle();
    },
    checkAvailProductFamily(selectedIdx) {
      this.availProductFamilyList = [...this.productFamilyList];
      const data = JSON.parse(JSON.stringify(this.availProductFamilyList));
      const otherSelected = [];
      this.tiersArray2.forEach((tier, index) => {
        if (index != selectedIdx) {
          tier.productFamily.map(product => {
            otherSelected.push(product.name);
          });
        }
      });
      const finalArray = data.filter(val => !otherSelected.includes(val));

      return finalArray;
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      // this.getProductFamilyList();
    },
    dataAdjustment() {
      const adjustedObj2Array = JSON.parse(JSON.stringify(this.tiersArray2));
      this.incentive.objective2List = [
        ...this.unformatTableRowData(adjustedObj2Array)
      ];

      this.tempStartMonth = JSON.parse(
        JSON.stringify(this.incentive.startMonth)
      );
      this.tempEndMonth = JSON.parse(JSON.stringify(this.incentive.endMonth));

      const adjustedArray = JSON.parse(JSON.stringify(this.tiersArray));
      this.incentive.tierList = adjustedArray;

      let startMonth = JSON.parse(JSON.stringify(this.incentive.startMonth));
      this.incentive.startMonth = Number(moment(startMonth).format("MM"));
      this.incentive.startYear = Number(moment(startMonth).format("YYYY"));

      let endMonth = JSON.parse(JSON.stringify(this.incentive.endMonth));
      this.incentive.endMonth = Number(moment(endMonth).format("MM"));
      this.incentive.endYear = Number(moment(endMonth).format("YYYY"));
    },
    disablingDates() {
      const date = moment(this.today);
      const month = date.month();
      const year = date.year();

      this.disabledDates.to = new Date(year, month, 1);
    },
    checkDates() {
      if (this.incentive.startMonth && this.incentive.endMonth) {
        const startDate = moment(this.incentive.startMonth).format(
          "YYYY-MM-DD"
        );
        const endDate = moment(this.incentive.endMonth).format("YYYY-MM-DD");

        if (
          !moment(startDate).isSame(endDate) &&
          !moment(startDate).isBefore(endDate)
        ) {
          this.incentiveErrors.startMonth =
            "Start month must be before end month";
        } else {
          delete this.incentiveErrors.startMonth;
        }

        if (
          !moment(endDate).isSame(startDate) &&
          !moment(endDate).isAfter(startDate)
        ) {
          this.incentiveErrors.endMonth =
            "End month must be after or equal to start month";
        } else {
          delete this.incentiveErrors.endMonth;
        }
      }
    },
    addRule(type) {
      if (this[type] < 5) {
        if (type == "tiersCount") {
          let tier = {
            tierLevel: this.tiersArray.length,
            tierAchievement: null,
            tierReward: null
          };
          this.tiersArray.push(tier);
        } else {
          let tier = {
            productFamily: [],
            tierReward: null
          };
          this.tiersArray2.push(tier);
        }

        this[type]++;
      }
    },
    removeRule(type) {
      if (type == "tiersCount") {
        this.tiersArray.pop();
      } else {
        this.tiersArray2.pop();
      }

      this[type]--;
    },
    tierCounter(index) {
      return index + 1;
    },
    minValue(index, type) {
      let tempIdx = index;
      if (index != 0) {
        if (type == "tierAchievement") {
          if (this.tiersArray[tempIdx - 1].tierAchievement != null) {
            return this.tiersArray[tempIdx - 1].tierAchievement;
          } else {
            return 0;
          }
        } else {
          if (this.tiersArray[tempIdx - 1].tierReward != null) {
            return this.tiersArray[tempIdx - 1].tierReward;
          } else {
            return 0;
          }
        }
      } else {
        return 0;
      }
    },
    productErrorMsg(idx) {
      let temp = "productFamily" + idx;
      return this.incentiveErrors[temp];
    }
  },
  mounted() {
    for (let i = 0; i < 3; i++) {
      this.addRule("tiersCount");
      this.addRule("tiersCount2");
    }
    this.getProductFamilyList();
  }
};
</script>
