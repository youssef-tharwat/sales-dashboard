<template>
  <div id="incentive-normal">
    <breadcrumb
      title="Dashboard"
      subtitle="Dealer Management"
      sub-sub-title="Dealer Incentive"
    />
    <div class="row lnv-main-card">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="contact-list-wrapper">
              <div class="row">
                <div class="col-md-12">
                  <dual-list id="vueduallist" :options="options"></dual-list>
                </div>
                <div class="col-md-12">
                  <!-- eslint-disable vue/this-in-template-->
                  <p v-if="this.errors.dealerSelection" class="invalid-field">
                    {{ this.errors.dealerSelection }}
                  </p>
                </div>
                <div class="col-md-12">
                  <!-- {{options.selectedItems}} -->
                  <button
                    type="button"
                    class="btn btn-primary btn-lg pull-right"
                    @click="handleSubmit()"
                  >
                    <span v-text="$ml.get('button_submit_text')"></span>
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
import dualList from "../../components/ui/select/dualList";
import { Message } from "element-ui";
import {
  DEALER_INCENTIVE_POST_REQUEST,
  DEALER_LIST_REQUEST
} from "../../store/modules/dealer/actions";
export default {
  name: "Dealer",
  components: {
    breadcrumb: breadcrumb,
    dualList: dualList
  },
  computed: {},
  data: function() {
    return {
      options: {
        label: "",
        reset: false,
        placeholder: "Search dealers",
        height: "300px",
        inputOptions: { uppercase: false, isRequired: false },
        buttonOption: { textLeft: "Select All", textRight: "Unselect All" },
        resizeBox: "",
        items: this.dealerList,
        colorItems: "#1E90FF",
        selectedItems: []
      },
      dealerList: [],
      formErrors: [],
      eligibleList: []
    };
  },
  methods: {
    checkFormValidity() {
      this.formErrors = {};
      let error = 0;

      if (this.options.selectedItems.length <= 0) {
        this.formErrors.dealerSelection =
          "Atlease one dealer must select to submit.";
        error++;

        Message({
          message: "Atlease one dealer must select to submit",
          type: "error",
          duration: 5 * 1000
        });
      }

      if (error) {
        return false;
      } else {
        return true;
      }
    },
    handleReset() {},
    handleCancel() {},
    handleSubmit(e) {
      this.submitted = true;
      if (!this.checkFormValidity(e)) {
        return;
      } else {
        this.setEligibleDealers();
        let eligibleList = this.eligibleList; // this.options.selectedItems;

        this.$store
          .dispatch(DEALER_INCENTIVE_POST_REQUEST, eligibleList)
          .then(res => {
            if (res.resultCode === 0) {
              this.options.reset = true;
              // EventBus.$emit("reset-data", this.options.reset);
              Message({
                message: "Dealer Incentive Successfully Submitted.",
                type: "success",
                duration: 5 * 1000
              });
              // this.success();
              // this.$emit("success", 1);
            }
          });
      }
    },
    setEligibleDealers() {
      let arr = [];
      this.dealerList.forEach(row => {
        let isEligible = this.isSelected(row.id);
        arr.push({ id: row.id, beligible: isEligible, name: row.dealerName });
      });

      this.eligibleList = arr;
      // beligible
      // console.log(this.options.selectedItems);
      // console.log(this.dealerList);
    },
    isSelected(id) {
      let d = this.options.selectedItems.filter(function(elem) {
        if (elem.id == id) return elem;
      });
      if (d[0]) {
        return true;
      } else {
        return false;
      }
    },
    async getDealerList() {
      const res = await this.$store.dispatch(DEALER_LIST_REQUEST, {
        type: "all"
      });

      if (res.resultCode === 0) {
        this.dealerList = res.content;
        this.dealerList.filter(dealer => {
          return dealer.status == "ACTIVE";
        });

        let items = [];
        let items2 = [];

        this.dealerList.forEach(dealer => {
          if (dealer.beligible) {
            items2.push({ id: dealer.id, name: dealer.dealerName });
          } else {
            items.push({ id: dealer.id, name: dealer.dealerName });
          }
        });

        this.options.items = items;
        this.options.selectedItems = items2;
        // alert(JSON.stringify(this.options));
      }
    }
  },
  mounted() {
    this.getDealerList();
  }
};
</script>
