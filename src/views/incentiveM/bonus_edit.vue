<template>
  <div id="incentive-bonus-edit">
    <breadcrumb
      title="Dashboard"
      subtitle="Bonus Incentive"
      sub-sub-title="Edit Bonus Incentive"
    ></breadcrumb>
    <div class="row lnv-main-card">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <form>
                <div class="row mb-4 mt-2">
                  <div class="col-12">
                    <div class="mt-5">
                      <h4 class="text-center">
                        {{
                          isSingleAccu
                            ? "Bonus Incentive Single Accumulative"
                            : isSingleNoneAccu
                              ? "Bonus Incentive Single Non - Accumulative"
                              : isMultipleAccu
                                ? "Bonus Incentive Multiple Accumulative"
                                : isMultipleNoneAccu
                                  ? "Bonus Incentive Multiple Non - Accumulative"
                                  : "Bonus Incentive"
                        }}
                      </h4>
                    </div>
                  </div>
                </div>

                <div class="row form-group">
                  <div class="col-12 mb-4">
                    <label class="text-label">Incentive Bonus Name*</label>
                    <input
                      v-model="incentiveBonus.name"
                      v-validate="'required'"
                      type="text"
                      name="Incentive Bonus Name"
                      class="form-control"
                      :disabled="!incentiveBonus"
                    />
                    <span class="invalid-field mt-2">{{
                      errors.first("Incentive Bonus Name")
                    }}</span>
                  </div>

                  <div class="col-12 mb-4">
                    <div class>
                      <label class="text-label">Bonus Type*</label>
                      <multiselect
                        v-model="incentiveBonus.type"
                        v-validate="'required'"
                        placeholder="Select Bonus Type"
                        name="Bonus Type"
                        :searchable="false"
                        :options="bonusTypes"
                        :open-direction="'bottom'"
                        :disabled="true"
                        :loading="!incentiveBonus.type || !bonusTypes"
                        select-label
                        deselect-label
                      ></multiselect>
                    </div>
                    <span class="invalid-field mt-2 mb-2">{{
                      errors.first("Bonus Type")
                    }}</span>
                  </div>
                  <div class="col-12 mb-4">
                    <div class>
                      <label class="text-label">Reward Type*</label>
                      <multiselect
                        v-model="incentiveBonus.rewardType"
                        v-validate="'required'"
                        placeholder="Select Reward Type"
                        name="Reward Type"
                        :searchable="false"
                        :options="rewardTypes"
                        :open-direction="'bottom'"
                        track-by="id"
                        label="text"
                        :disabled="!incentiveBonus.rewardType || !rewardTypes"
                        :loading="!incentiveBonus.rewardType || !rewardTypes"
                        select-label
                        deselect-label
                      ></multiselect>
                    </div>
                    <span class="invalid-field mt-2 mb-2">{{
                      errors.first("Reward Type")
                    }}</span>
                  </div>
                  <div class="col-6 mb-4">
                    <label class="text-label">Start Date*</label>
                    <Datepicker
                      v-model="incentiveBonus.startDate"
                      v-validate="'required'"
                      :minimum-view="'day'"
                      :open-date="today"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      name="Start Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select Start Date"
                      :disabled-dates="disabledDates"
                      :disabled="!incentiveBonus.startDate"
                      class="top"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("Start Date")
                    }}</span>
                    <span
                      v-if="incentiveBonusErrors.startDate"
                      class="invalid-field mt-2"
                    >{{ incentiveBonusErrors.startDate }}</span>
                  </div>
                  <div class="col-6 mb-4">
                    <label class="text-label">End Date*</label>

                    <Datepicker
                      v-model="incentiveBonus.endDate"
                      v-validate="'required'"
                      name="End Date"
                      :bootstrap-styling="true"
                      :required="true"
                      placeholder="Select End Date"
                      :minimum-view="'day'"
                      :open-date="new Date(incentiveBonus.startDate)"
                      :maximum-view="'year'"
                      :initial-view="'day'"
                      :disabled-dates="disabledDates"
                      :disabled="!incentiveBonus.endDate"
                      class="top"
                      @closed="checkDates"
                    ></Datepicker>

                    <span class="invalid-field mt-2">{{
                      errors.first("End Date")
                    }}</span>
                    <span
                      v-if="incentiveBonusErrors.endDate"
                      class="invalid-field mt-2"
                    >{{ incentiveBonusErrors.endDate }}</span>
                  </div>
                  <div
                    v-if="incentiveBonus.type ? !isSingleBonusType : false"
                    class="col-12 mb-4"
                  >
                    <div>
                      <label class="text-label">Number of tiers*</label>
                      <multiselect
                        v-validate="'required'"
                        :value="tiersCount"
                        :options="[1, 2, 3, 4, 5]"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Select number of tiers"
                        name="Number of tiers"
                        :disabled="true"
                        :loading="!tiersCount"
                        @input="handleTiersInput"
                      ></multiselect>
                    </div>
                    <span class="invalid-field mt-2 mb-2">{{
                      errors.first("Number of tiers")
                    }}</span>
                  </div>
                </div>
                <div>
                  <div class="row form-group d-flex align-items-center">
                    <div class="col-lg-12 mb-sm-3">
                      <label class="text-label">Region*</label>
                      <div class="d-flex align-items-center">
                        <div class="w-100">
                          <div>
                            <multiselect
                              v-model="regionsSelected"
                              v-validate="'required'"
                              placeholder
                              name="region"
                              :searchable="true"
                              :options="dealerOutlets"
                              :close-on-select="false"
                              :multiple="true"
                              track-by="region"
                              label="region"
                              :open-direction="'bottom'"
                              :loading="dealerOutletsIsLoading"
                              :disabled="dealerOutletsIsLoading"
                              class="mb-3"
                              select-label
                              deselect-label
                              @input="filterStates"
                              @remove="regionRemoved"
                            ></multiselect>
                          </div>
                          <div>
                            <span class="invalid-field mt-2">{{
                              errors.first("region")
                            }}</span>
                          </div>
                        </div>
                        <div class="ml-5">
                          <button
                            type="button"
                            :disabled="dealerOutletsIsLoading"
                            class="btn btn-sm btn-primary"
                            @click="
                              selectAll('region');
                              filterStates();
                            "
                          >
                            Select All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12 mb-sm-3">
                      <label class="text-label">State*</label>
                      <div class="d-flex align-items-center">
                        <div class="w-100">
                          <div>
                            <multiselect
                              v-model="statesSelected"
                              v-validate="'required'"
                              placeholder="Select State"
                              name="state"
                              :searchable="true"
                              :options="statesList"
                              :close-on-select="false"
                              :multiple="true"
                              track-by="state"
                              label="state"
                              :open-direction="'bottom'"
                              :loading="dealerOutletsIsLoading"
                              :disabled="
                                dealerOutletsIsLoading || regionsSelected <= 0
                              "
                              class="mb-3"
                              select-label
                              deselect-label
                              @input="filterOutlet"
                              @remove="stateRemoved"
                            ></multiselect>
                          </div>
                          <div>
                            <span class="invalid-field mt-2">{{
                              errors.first("state")
                            }}</span>
                          </div>
                        </div>
                        <div class="ml-5">
                          <button
                            type="button"
                            :disabled="
                              dealerOutletsIsLoading || regionsSelected <= 0
                            "
                            class="btn btn-sm btn-primary"
                            @click="
                              selectAll('state');
                              filterOutlet();
                            "
                          >
                            Select All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12 mb-sm-3">
                      <label class="text-label">Outlets*</label>
                      <div class="d-flex align-items-center">
                        <div
                          class="w-100"
                          @click="
                            statesSelected.length > 0 ? outletModalToggle() : ''
                          "
                        >
                          <div>
                            <multiselect
                              v-model="outletsSelected"
                              v-validate="'required'"
                              placeholder="Select Outlet"
                              name="outlets"
                              :searchable="false"
                              :options="outletList"
                              :close-on-select="false"
                              :multiple="true"
                              track-by="state"
                              label="state"
                              :open-direction="'bottom'"
                              :loading="dealerOutletsIsLoading"
                              :disabled="true"
                              class="mb-3"
                              select-label
                              deselect-label
                            >
                              <template
                                slot="selection"
                                slot-scope="{ values, search, isOpen }"
                              >
                                <span
                                  v-if="values.length &amp;&amp; !isOpen"
                                  class="multiselect__single"
                                >{{ values.length }} options selected</span>
                              </template>
                            </multiselect>
                          </div>
                          <div>
                            <span class="invalid-field mt-2">{{
                              errors.first("outlets")
                            }}</span>
                          </div>
                        </div>
                        <div class="ml-5">
                          <button
                            type="button"
                            :disabled="
                              dealerOutletsIsLoading ||
                                statesSelected.length <= 0
                            "
                            class="btn btn-sm btn-primary"
                            @click="selectAll('outlet')"
                          >
                            Select All
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-12 d-flex flex-column">
                      <div>
                        <label class="text-label">Incentive List Upload*</label>
                      </div>
                      <div class="d-flex">
                        <div class="d-flex flex-column w-100">
                          <div class="d-flex align-items-center">
                            <div class="w-100">
                              <div class="w-100 d-flex align-items-center">
                                <div class="w-100">
                                  <BFormFile
                                    id="file"
                                    ref="file"
                                    v-model="fileUpload"
                                    name="file"
                                    accept=".xlsx"
                                    size="lg"
                                    class="mb-3 cursor-pointer"
                                    @change="handleFileUpload($event)"
                                  ></BFormFile>
                                </div>
                                <div class="ml-4">
                                  <button
                                    type="button"
                                    class="btn btn-primary btn-xs"
                                    @click="resetUploadedFile()"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                              <div class="mt-3">
                                <span class="invalid-field">{{
                                  errors.first("file")
                                }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 d-flex flex-column">
                      <div>
                        <label class="text-label mb-0">Incentive List Actions</label>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="mr-4">
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="doExport()"
                          >
                            Incentive list Download
                            <i
                              class="fa fa-download fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                        <div class="mr-4">
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="incentivePreviewModalToggle"
                          >
                            Incentive list Preview
                            <i
                              class="fa fa-search fa-lg"
                              aria-hidden="true"
                            ></i>
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="ml-0 p-0 mt-1 btn-link btn text-info width-fit-content"
                            @click="rulesModalToggle"
                          >
                            Incentive List Edit Rules
                            <i class="fa fa-edit fa-lg" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <BModal
                    id="outlet-editing-modal"
                    ref="outlet-editing-modal"
                    size="lg"
                    hide-footer
                    title="Edit Outlets"
                  >
                    <div>
                      <VueBootstrap4Table
                        :classes="classes"
                        :rows="outletList"
                        :columns="columns"
                        :config="config"
                        :total-rows="outletList.length"
                        :selected_items="outletsSelected"
                        :show-loader="true"
                        @on-change-query="onChangeQuery"
                        @refresh-data="filterOutlet"
                        @on-select-row="outletInput"
                        @on-all-select-rows="outletInput"
                        @on-unselect-row="outletInput"
                        @on-all-unselect-rows="outletInput"
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
                          <div class="bold-text">No Outlets Found!</div>
                        </template>
                      </VueBootstrap4Table>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        type="btn"
                        class="btn btn-primary btn-sm"
                        @click="outletModalToggle"
                      >
                        Close
                      </button>
                    </div>
                  </BModal>
                  <BModal
                    ref="rules-editing-modal"
                    size="lg"
                    hide-footer
                    title="Edit Incentive List Rules"
                  >
                    <div class="row mt-3">
                      <div class="col-12 text-center">
                        <h4>Bonus Incentive Rules</h4>
                      </div>
                      <div class="col-12 mb-4 d-flex align-items-center">
                        <div class="d-flex flex-column mr-5 mt-4">
                          <div v-if="isAccu" class="mr-4">
                            <div v-if="isSingleAccu" class="d-flex flex-column">
                              <label for>Target in unit</label>
                              <input
                                v-model="tiersArray[0].targetUnit"
                                v-validate="'required|integer'"
                                type="text"
                                name="Target"
                                class="form-control mb-3"
                              />
                              <div>
                                <span class="invalid-field mt-2">{{
                                  errors.first("Target")
                                }}</span>
                              </div>
                            </div>
                            <div
                              v-else-if="!isSingleBonusType && isMultipleAccu"
                              class="d-flex flex-column"
                            >
                              <label for>Target in unit</label>
                              <div class="d-flex align-items-center">
                                <div
                                  v-for="(tierItem2, index2) in tiersArray"
                                  :key="'B' + index2"
                                  scope="col"
                                  class="mr-4"
                                >
                                  {{
                                    index2 >= 0
                                      ? "Tier " + tierCounter(index2)
                                      : ""
                                  }}
                                  <div class="mb-3">
                                    <input
                                      v-model="tierItem2.targetUnit"
                                      v-validate="'required|integer'"
                                      class="form-control"
                                      :name="
                                        'Target Tier ' + tierCounter(index2)
                                      "
                                      type="text"
                                    />
                                    <div>
                                      <span class="invalid-field mt-2">{{
                                        errors.first(
                                          "Target Tier " + tierCounter(index2)
                                        )
                                      }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="mr-4">
                            <div
                              v-if="isSingleBonusType"
                              class="d-flex flex-column mt-4"
                            >
                              <label for>
                                Reward
                                {{
                                  monetaryCheck
                                    ? " in Monetary"
                                    : giftCheck
                                      ? " in Gift"
                                      : ""
                                }}
                              </label>
                              <input
                                v-if="monetaryCheck"
                                v-model="tiersArray[0].rewardAmount"
                                v-validate="'required'"
                                :type="inputType"
                                name="Reward"
                                class="form-control mb-3"
                              />
                              <input
                                v-else-if="giftCheck"
                                v-model="tiersArray[0].rewardGift"
                                v-validate="'required'"
                                :type="inputType"
                                name="Reward"
                                class="form-control mb-3"
                              />
                              <div>
                                <span class="invalid-field mt-2">{{
                                  errors.first("Reward")
                                }}</span>
                              </div>
                            </div>
                            <div
                              v-else-if="!isSingleBonusType"
                              class="d-flex flex-column mt-4"
                            >
                              <label for>
                                Rewards
                                {{
                                  monetaryCheck
                                    ? " in Monetary"
                                    : giftCheck
                                      ? " in Gift"
                                      : ""
                                }}
                              </label>
                              <div class="d-flex align-items-center">
                                <div
                                  v-for="(tierItem2, index2) in tiersArray"
                                  :key="'B' + index2"
                                  scope="col"
                                  class="mr-4"
                                >
                                  {{
                                    index2 >= 0
                                      ? "Tier " + tierCounter(index2)
                                      : ""
                                  }}
                                  <div>
                                    <input
                                      v-if="monetaryCheck"
                                      v-model="tierItem2.rewardAmount"
                                      v-validate="'required'"
                                      class="form-control mb-3"
                                      :type="inputType"
                                      :name="
                                        'Reward Tier ' + tierCounter(index2)
                                      "
                                    />
                                    <input
                                      v-else-if="giftCheck"
                                      v-model="tierItem2.rewardGift"
                                      v-validate="'required'"
                                      class="form-control mb-3"
                                      :type="inputType"
                                      :name="
                                        'Reward Tier ' + tierCounter(index2)
                                      "
                                    />
                                    <div>
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
                          <div class="mt-4">
                            <div class="d-flex align-items-center">
                              <label class="text-label mr-4">Recurring</label>
                              <input
                                v-model="incentiveBonus.recurring"
                                name="Recurring"
                                type="checkbox"
                              />
                            </div>
                            <span class="invalid-field mt-2 mb-2">{{
                              errors.first("Recurring")
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        type="btn"
                        class="btn btn-primary btn-sm"
                        @click="rulesModalToggle"
                      >
                        Close
                      </button>
                    </div>
                  </BModal>
                  <BModal
                    ref="incentive-preview-modal"
                    size="lg"
                    hide-footer
                    title="Preview Incentive List"
                  >
                    <div>
                      <VueBootstrap4Table
                        :classes="classes"
                        :rows="filterVal"
                        :columns="columnsIncentiveList"
                        :config="incentivePreviewConfig"
                        :total-rows="filterVal.length"
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
                          <div class="bold-text">No incentives Found!</div>
                        </template>
                      </VueBootstrap4Table>
                    </div>
                    <div class="d-flex align-items-center justify-content-end">
                      <button
                        type="btn"
                        class="btn btn-primary btn-sm"
                        @click="incentivePreviewModalToggle"
                      >
                        Close
                      </button>
                    </div>
                  </BModal>
                </div>
                <div class="row mt-3">
                  <div class="col-12">
                    <button
                      type="button"
                      class="btn btn-primary pull-right ml-3"
                      @click.prevent="handleSubmit"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueBootstrap4Table from "../../components/ui/VueBootstrap4Table";
import { BModal, BFormFile } from "bootstrap-vue";

import breadcrumb from "../../components/breadcrumb/breadcrumb";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import multiselect from "vue-multiselect";

import XLSX from "xlsx";
import { export_json_to_excel } from "../../utils/Export2Excel";

import {
  INCENTIVE_BONUS_UTILITY_REQUEST,
  INCENTIVE_BONUS_UPDATE,
  INCENTIVE_BONUS_GET_BY_ID
} from "../../store/modules/incentive/action";
import { DEALER_OUTLET_LIST_REQUEST } from "../../store/modules/outlet/actions";

import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR
} from "../../store/modules/ui/actions";

export default {
  name: "IncbonusEdit",
  components: {
    Datepicker,
    breadcrumb,
    multiselect,
    VueBootstrap4Table,
    BModal,
    BFormFile
  },
  computed: {
    monetaryCheck() {
      if (this.incentiveBonus.rewardType.id == 181) {
        return true;
      } else {
        return false;
      }
    },
    giftCheck() {
      if (this.incentiveBonus.rewardType.id == 182) {
        return true;
      } else {
        return false;
      }
    },
    inputType() {
      if (this.incentiveBonus.rewardType == "Monetary") {
        return "number";
      } else {
        return "text";
      }
    },
    isAccu() {
      if (
        this.incentiveBonus.type == "SINGLE_REWARD_ACC" ||
        this.incentiveBonus.type == "MULTI_REWARD_ACC"
      ) {
        return true;
      } else {
        return false;
      }
    },
    isSingleAccu() {
      if (this.incentiveBonus.type == "SINGLE_REWARD_ACC") {
        return true;
      } else {
        return false;
      }
    },
    isSingleNoneAccu() {
      if (this.incentiveBonus.type == "SINGLE_REWARD_NON_ACC") {
        return true;
      } else {
        return false;
      }
    },
    isMultipleAccu() {
      if (this.incentiveBonus.type == "MULTI_REWARD_ACC") {
        return true;
      } else {
        return false;
      }
    },
    isMultipleNoneAccu() {
      if (this.incentiveBonus.type == "MULTI_REWARD_NON_ACC") {
        return true;
      } else {
        return false;
      }
    },
    isSingleBonusType() {
      if (
        this.incentiveBonus.type == "SINGLE_REWARD_NON_ACC" ||
        this.incentiveBonus.type == "SINGLE_REWARD_ACC"
      ) {
        return true;
      } else {
        return false;
      }
    },
    tiersCount() {
      return this.incentiveBonus.tierList.length;
    },
    fileName(formatDate) {
      formatDate =
        "bonus-inc-" + moment(this.incentiveBonus.startDate).format("MM-YY");
      return formatDate;
    }
  },
  data() {
    return {
      config: {
        checkbox_rows: true,
        rows_selectable: true,
        server_mode: false,
        card_title: "Outlets",
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
      incentivePreviewConfig: {
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
          name: "id",
          label: "Id",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left",
          uniqueId: true,
          visibility: false
        },
        {
          name: "dealerName",
          label: "Dealer Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "lppCode",
          label: "Dealer LPP Code",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "dealerOutletCode",
          label: "Dealer Outlet Code",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "name",
          label: "Outlet Name",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        },
        {
          name: "address",
          label: "Outlet Address",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        }
      ],
      columnsIncentiveList: [],
      total: 0,
      step: 0,
      today: new Date(),
      bonusTypes: [],
      rewardTypes: [],
      dealerOutlets: [],
      dealerOutletsIsLoading: false,
      regionsSelected: [],
      statesList: [],
      statesSelected: [],
      outletList: [],
      outletsSelected: [],
      products: [],
      productsubGroups: [],
      mtmsArray: [],
      tiersArray: [],
      fileUpload: [],
      disabledDates: {
        to: "", // Disable all dates up to specific date
        from: "" // Disable all dates after specific date
      },
      submitted: false,
      incentiveBonusErrors: {},
      incentiveBonus: {
        countryId: 21,
        name: "",
        dealerOutletsId: [],
        type: "",
        roleId: 20,
        rewardType: "",
        startDate: new Date(),
        endDate: "",
        recurring: false,
        tierList: []
      },
      tHeader: [],
      filterVal: [],
      filterValNames: []
    };
  },
  methods: {
    getBonusIncentive() {
      const bonusId = this.$route.params.id;
      this.$store.dispatch(INCENTIVE_BONUS_GET_BY_ID, bonusId).then(res => {
        if (res.resultCode === 0) {
          this.incentiveBonus = res.content;
          this.dataTransfer();
        }
      });
    },
    async getBonusUtility() {
      const res = await this.$store.dispatch(INCENTIVE_BONUS_UTILITY_REQUEST);
      if (res.resultCode === 0) {
        this.bonusTypes = await res.content.bonusTypes;
        this.rewardTypes = await res.content.rewardTypes;
      }
    },
    async getDealerOutlets() {
      this.dealerOutletsIsLoading = true;
      const res = await this.$store.dispatch(DEALER_OUTLET_LIST_REQUEST);
      this.dealerOutlets = await res.content;
      this.dealerOutlets.forEach(region =>
        this.statesList.push(...region.stateList)
      );
      this.statesList.forEach(state =>
        this.outletList.push(
          ...state.dealerOutletList.filter(item => item.status === "ACTIVE")
        )
      );
      this.dealerOutletsIsLoading = false;
    },
    filterStates() {
      this.statesList = [];
      this.regionsSelected.map(region => {
        this.statesList.push(...region.stateList);
      });
    },
    filterOutlet() {
      this.outletList = [];
      this.statesSelected.map(state => {
        this.outletList.push(...state.dealerOutletList);
      });
    },
    async outletInput(outlets) {
      const localOutlets = await outlets.selected_items;
      this.outletsSelected = [];
      // Filtering out deactivated dealers
      this.outletsSelected = [
        ...localOutlets.filter(item => item.status === "ACTIVE")
      ];
    },
    incentivePreviewModalToggle() {
      this.$refs["incentive-preview-modal"].toggle();
    },
    rulesModalToggle() {
      this.$refs["rules-editing-modal"].toggle();
    },
    outletModalToggle() {
      this.$refs["outlet-editing-modal"].toggle();
    },
    regionRemoved(regionRemoved) {
      if (this.statesSelected.length > 0) {
        const result = this.statesSelected.filter(state => {
          return !regionRemoved.stateList.includes(state);
        });
        this.statesSelected = result;
      }
    },
    stateRemoved(stateRemoved) {
      if (this.outletsSelected.length > 0) {
        const result = this.outletsSelected.filter(outlet => {
          stateRemoved.dealerOutletList.forEach(item => {
            if (item.id !== outlet.id) {
              return true;
            } else {
              return false;
            }
          });
        });

        this.outletsSelected = result;
      }
    },
    selectAll(inputType) {
      if (inputType === "region") {
        this.regionsSelected = [];
        this.regionsSelected = this.dealerOutlets;
        this.filterStates();
      } else if (inputType === "state") {
        this.statesSelected = [];
        this.statesSelected = this.statesList;
      } else if (inputType === "outlet") {
        this.outletsSelected = [];
        this.outletsSelected = this.outletList.filter(
          item => item.status === "ACTIVE"
        );
      }
    },
    handleTiersInput(value) {
      this.tiersArray = [];
      for (let i = 0; i < value; i++) this.addRule();
    },
    addRule() {
      if (this.tiersCount < 5) {
        let tier = {
          tierLevel: this.tiersArray.length,
          targetUnit: "",
          rewardAmount: "",
          rewardGift: "",
          modelTargetUnitList: [...this.mtmsArray]
        };
        this.tiersArray.push(tier);
      }
    },
    tierCounter(index) {
      return index + 1;
    },
    dateAdjustmentsAndChecking() {
      if (
        !this.incentiveBonus.startDate ||
        this.incentiveBonus.startDate === "Invalid date"
      ) {
        this.incentiveBonusErrors.startDate = "Start date is required";
      } else {
        delete this.incentiveBonusErrors.startDate;
        this.incentiveBonus.startDate = moment(
          this.incentiveBonus.startDate
        ).format("YYYY-MM-DD 00:00:00");
      }

      if (
        !this.incentiveBonus.endDate ||
        this.incentiveBonus.endDate === "Invalid date"
      ) {
        this.incentiveBonusErrors.endDate = "End date is required";
      } else {
        delete this.incentiveBonusErrors.endDate;
        this.incentiveBonus.endDate = moment(
          this.incentiveBonus.endDate
        ).format("YYYY-MM-DD 23:59:59");
      }
    },
    disablingDates() {
      const date = moment(this.today);
      const month = date.month();
      const year = date.year();

      this.disabledDates.to = new Date(year, month, 1);
    },
    checkDates() {
      const startDate = moment(this.incentiveBonus.startDate).format(
        "YYYY-MM-DD"
      );
      const endDate = moment(this.incentiveBonus.endDate).format("YYYY-MM-DD");

      if (
        !moment(startDate).isSame(endDate) &&
        !moment(startDate).isBefore(endDate)
      ) {
        this.incentiveBonusErrors.startDate =
          "Start date must be before end date";
      } else {
        delete this.incentiveBonusErrors.startDate;
      }

      if (
        !moment(endDate).isSame(startDate) &&
        !moment(endDate).isAfter(startDate)
      ) {
        this.incentiveBonusErrors.endDate =
          "End date must be after or equal to start date";
      } else {
        delete this.incentiveBonusErrors.endDate;
      }
    },
    dataTransfer() {
      const adjustedArray = JSON.parse(
        JSON.stringify(this.incentiveBonus.tierList)
      );

      const mtms = JSON.parse(
        JSON.stringify(adjustedArray[0].modelTargetUnitList)
      );

      mtms.forEach(mtm => {
        mtm.targetUnit = [0, 0, 0, 0, 0];
      });

      adjustedArray.forEach(item => {
        if (item.modelTargetUnitList) {
          item.modelTargetUnitList.forEach((mtm, index) => {
            if (this.isSingleBonusType && !this.isAccu) {
              mtms[index].targetUnit[0] = mtm.targetUnit;
            } else if (this.isMultipleNoneAccu) {
              mtms[index].targetUnit[item.tierLevel] = mtm.targetUnit;
            }
          });
        }
      });
      this.tiersArray = adjustedArray;
      this.mtmsArray = mtms;
      this.regionsSelected = this.incentiveBonus.dealerOutletsByRegion;
      this.regionsSelected.map(region => {
        this.statesSelected.push(...region.stateList);
      });
      this.statesSelected.map(state => {
        this.outletsSelected.push(...state.dealerOutletList);
      });
      this.adJustFileHeaders();
    },
    dataAdjustmentAfterFileUpload(sheet) {
      if (!this.isAccu) {
        if (this.isSingleBonusType) {
          this.tiersArray.forEach(item => {
            item.modelTargetUnitList = sheet.map(item => {
              item["targetUnit"] = item["Target"];
              delete item["Target"];
              item["mtmNo"] = item["Mtm"];
              delete item["Mtm"];
              return item;
            });
          });
        } else {
          const headers = Object.keys(sheet[0]).slice(1);
          sheet.forEach(item => {
            this.tiersArray.forEach(item2 => {
              item2.modelTargetUnitList.push({
                mtmNo: item["Mtm"],
                targetUnit: item[headers[item2.tierLevel]]
              });
            });
          });
        }
      } else {
        this.tiersArray.forEach(item => {
          item.modelTargetUnitList = sheet.map(item => {
            item.mtmNo = item.Mtm;
            item["targetUnit"] = 0;
            return item;
          });
        });
      }
      this.adJustFileHeaders();
    },
    dataAdjustmentBeforeSubmission() {
      const adjustedArray = JSON.parse(JSON.stringify(this.tiersArray));
      this.incentiveBonus.tierList = adjustedArray;
      this.incentiveBonus.dealerOutletsId = this.outletsSelected.map(
        outlet => outlet.id
      );
    },
    handleSubmit() {
      this.$validator.validateAll().then(result => {
        this.dateAdjustmentsAndChecking();
        if (result && Object.keys(this.incentiveBonusErrors).length === 0) {
          this.dataAdjustmentBeforeSubmission();
          this.$store
            .dispatch(INCENTIVE_BONUS_UPDATE, this.incentiveBonus)
            .then(res => {
              this.submitted = true;
              if (res.resultCode === 0) {
                // this.stepIncrement();
                this.$store.dispatch(NOTIFICATION_SUCCESS, {
                  message: "Incentive List Successfully Added",
                  timeOut: true
                });
                this.$router.push("/dashboard/incentive/bonus");
              }
            });
        }
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(btoa(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      });
    },
    handleFileUpload(event) {
      this.$store.dispatch(NOTIFICATION_REQUEST, {
        message: "Validating file..."
      });

      const file = event.target.files[0];

      // Validating file upload extension
      if (this.checkUploadType(file.name)) {
        this.getBase64(file).then(data => {
          var workbook = XLSX.read(data, { type: "base64" });
          var first_sheet_name = workbook.SheetNames[0];

          // Get worksheet
          let worksheet = workbook.Sheets[first_sheet_name];
          const sheet = XLSX.utils.sheet_to_json(worksheet, { raw: true });

          //Validating file upload columns
          if (sheet.length > 0) {
            if (this.checkFileHeaders(Object.keys(sheet[0]))) {
              //  This if function uses checkFileContent function. Might be used in the future. Not required now.
              // if (!this.isAccu) {
              //   if(this.checkFileContent(sheet)){
              //     this.$store.dispatch(NOTIFICATION_SUCCESS, {
              //       message: "File validation completed successfully",
              //       timeOut: true
              //     });
              //   } else {
              //     this.$store.dispatch(NOTIFICATION_ERROR, {
              //       message: "File Content issue"
              //     });
              //   }
              // } else {
              //   this.$store.dispatch(NOTIFICATION_SUCCESS, {
              //     message: "File validation completed successfully",
              //     timeOut: true
              //   });
              // }
              this.dataAdjustmentAfterFileUpload(sheet);

              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: "File validation completed successfully",
                timeOut: true
              });
            } else {
              this.resetUploadedFile();
              this.$store.dispatch(NOTIFICATION_ERROR, {
                message:
                  "File format incorrect. Please use provided incentive list template"
              });
            }
          } else {
            this.resetUploadedFile();
            this.$store.dispatch(NOTIFICATION_ERROR, {
              message: "No data in file!"
            });
          }
        });
      }
    },
    adJustFileHeaders() {
      this.filterValNames = [];
      this.columnsIncentiveList = [];
      if (this.isAccu) {
        this.tHeader = ["Mtm"];
        this.filterVal = this.mtmsArray;
        this.filterValNames.push("mtmNo");
        this.columnsIncentiveList.push({
          name: "mtmNo",
          label: "Mtm Number",
          sort: true,
          row_text_alignment: "text-left",
          column_text_alignment: "text-left"
        });
      } else {
        if (!this.isSingleBonusType) {
          this.tHeader = ["Mtm"];
          this.tiersArray.forEach((tier, index) => {
            this.tHeader.push("Target Tier " + (index + 1));
            this.filterVal.push(tier.modelTargetUnitList);
            this.filterValNames.push("mtmNo", "targetUnit");
            this.columnsIncentiveList.push(
              {
                name: "mtmNo",
                label: "Mtm Number",
                sort: true,
                row_text_alignment: "text-left",
                column_text_alignment: "text-left"
              },
              {
                name: "targetUnit",
                label: "Target Unit",
                sort: true,
                row_text_alignment: "text-left",
                column_text_alignment: "text-left"
              }
            );
          });
        } else {
          this.tHeader = ["Mtm", "Target"];
          this.filterVal = this.tiersArray[0].modelTargetUnitList;
          this.filterValNames.push("mtmNo", "targetUnit");
          this.columnsIncentiveList.push(
            {
              name: "mtmNo",
              label: "Mtm Number",
              sort: true,
              row_text_alignment: "text-left",
              column_text_alignment: "text-left"
            },
            {
              name: "targetUnit",
              label: "Target Unit",
              sort: true,
              row_text_alignment: "text-left",
              column_text_alignment: "text-left"
            }
          );
        }
      }
    },
    adjustTiersArray() {
      if (this.isSingleBonusType) {
        this.tiersArray = [];
        this.addRule();
      }
    },
    // This function checks the Target column for any letters. Can be considered later.
    // checkFileContent(file){
    //   if (this.isSingleBonusType) {
    //     file.forEach(item => {
    //       item.Target.length === 1 && !item.Target.match(/[a-z]/i);
    //     });
    //   } else {
    //
    //   }
    // },
    checkFileHeaders(headers) {
      // Normalizing column heads for comparision
      const formattedHeaders = JSON.stringify(headers);
      const formattedTheader = JSON.stringify(this.tHeader);

      return formattedHeaders === formattedTheader;
    },
    checkUploadType(fileName) {
      if (fileName) {
        let filename = fileName.split(".").pop();
        if (filename === "xlsx") {
          delete this.incentiveBonusErrors.file;
          return true;
        } else {
          this.incentiveBonusErrors.file = "File type must be .xlsx";
          return false;
        }
      }
    },
    resetUploadedFile() {
      this.$refs["file"].reset();
    },
    onChangeQuery(queryParams) {
      this.queryParams = queryParams;
      this.filterOutlet();
    },
    doExport() {
      let data = this.formatJson(this.filterValNames, this.filterVal);
      export_json_to_excel({
        header: this.tHeader,
        data,
        filename: this.fileName,
        sheetName: this.fileName,
        autoWidth: true,
        bookType: "xlsx"
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    }
  },
  mounted() {
    this.getBonusIncentive();
    this.disablingDates();
    this.getBonusUtility();
    this.getDealerOutlets();
    // this.addRule();
    // this.adjustTiersArray();
  }
};
</script>
<style lang="scss">
#outlet-editing-modal {
  .custom-control-label {
    display: none;
  }
}
</style>
