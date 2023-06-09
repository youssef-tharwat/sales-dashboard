<template>
  <div id="generate-incentive-payable">
    <breadcrumb title="Dashboard" subtitle="Generate Incentive Payable" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="form-group flex-grow-1">
                  <label class="text-label">Incentive Type</label>
                  <select
                    id="incentiveType"
                    v-model="form.incentiveType"
                    class="form-control"
                  >
                    <option
                      v-for="(it, index) of incentiveTypes"
                      :key="index"
                      :value="it.id"
                    >
                      {{ it.text }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="form-group flex-grow-1">
                  <label class="text-label">Select Month</label>
                  <Datepicker
                    v-model="form.month"
                    input-class="form-control"
                    name="incentivemonth"
                    :minimum-view="'month'"
                    :maximum-view="'year'"
                    :initial-view="'month'"
                    format="yyyy MMMM"
                  ></Datepicker>

                  <!-- <br />
                  <date-range-picker
                    ref="picker"
                    :opens="datePicker.opens"
                    :locale-data="{ firstDay: 1, format: 'YYYY-MM-DD' }"
                    :minDate="datePicker.minDate"
                    :maxDate="datePicker.maxDate"
                    :singleDatePicker="datePicker.singleDatePicker"
                    :timePicker="datePicker.timePicker"
                    :timePicker24Hour="datePicker.timePicker24Hour"
                    :showWeekNumbers="datePicker.showWeekNumbers"
                    :showDropdowns="datePicker.showDropdowns"
                    :autoApply="datePicker.autoApply"
                    v-model="dateRange"
                    @update="updateDateValues"
                    :linkedCalendars="datePicker.linkedCalendars"
                    :dateFormat="datePicker.dateFormat"
                  >
                    <div
                      slot="input"
                      slot-scope="picker"
                      style="min-width: 100%; width: 100%; float: left;"
                    >
                      <span
                        v-if="picker.startDate && picker.endDate"
                      >{{ formatDate(picker.startDate) }} To {{ formatDate(picker.endDate) }}</span>
                    </div>
                  </date-range-picker>-->
                </div>
              </div>
              <div class="row">
                <div class="form-group flex-grow-1">
                  <button
                    type="button"
                    class="btn btn-primary btn-lg"
                    @click="generateIncentive()"
                  >
                    <i class="fa fa-download"></i> Generate
                  </button>
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
import Datepicker from "vuejs-datepicker";

import "../../components/ui/vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { convertDateFormat } from "../../utils/helpers";
import { Message } from "element-ui";
import { INCENTIVE_PAYABLE_GENERATE_REQUEST } from "../../store/modules/incentive/action";
import { INC_TARGET_TYPE_REQUEST } from "../../store/modules/utility/actions";

const today = new Date();

export default {
  name: "GenerateIncentivePayable",
  components: {
    breadcrumb: breadcrumb,
    Datepicker: Datepicker
  },
  data() {
    return {
      form: {},
      dateRange: {
        startDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth(), 1),
          "YYYY-MM"
        ),
        endDate: convertDateFormat(
          new Date(today.getFullYear(), today.getMonth() + 1, 0),
          "YYYY-MM"
        )
      },
      incentiveType: null,
      datePicker: {
        opens: "center",
        // minDate: "2019-08-01",
        // maxDate: "2019-12-31",
        singleDatePicker: true,
        timePicker24Hour: false,
        showWeekNumbers: false,
        showDropdowns: true,
        timePicker: false,
        autoApply: false
      },
      incentiveTypes: [],
      incentiveData: []
    };
  },
  methods: {
    setDefaultValues() {
      if (!this.form.month) {
        this.form.month = convertDateFormat(
          new Date(today.getFullYear(), today.getMonth(), 1),
          "YYYY-MM"
        );
      }
    },
    updateDateValues() {},
    getIncentiveTypes() {
      this.$store.dispatch(INC_TARGET_TYPE_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.incentiveTypes = res.content;

          if (!this.form.incentiveType) {
            this.form.incentiveType = this.incentiveTypes[0].id;
          }
        }
      });
      // this.incentiveTypes = [
      //   { id: 1, text: "Normal Incentive" },
      //   { id: 1, text: "Bonus Incentive" },
      //   { id: 1, text: "Target Incentive" }
      // ];
    },
    formatDate: function(date) {
      return convertDateFormat(date, "YYYY-MM");
    },
    generateIncentive() {
      let d = new Date(this.form.month);
      let incYear = d.getFullYear();
      let incMonth = d.getMonth() + 1;
      let pData = {
        typeId: this.form.incentiveType,
        month: incMonth,
        year: incYear
      };

      this.$store
        .dispatch(INCENTIVE_PAYABLE_GENERATE_REQUEST, pData)
        .then(res => {
          if (res.resultCode === 0) {
            this.incentiveData = res.content;

            if (res.content.status === "success") {
              Message({
                message: "File created.",
                type: "success",
                duration: 5 * 1000
              });
            } else {
              Message({
                message: "File creation failed..",
                type: "error",
                duration: 5 * 1000
              });
            }
          }
        });
    }
  },
  mounted() {
    this.getIncentiveTypes();
    this.setDefaultValues();
  }
};
</script>
