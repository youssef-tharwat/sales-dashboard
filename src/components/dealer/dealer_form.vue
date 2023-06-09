<template>
  <div id="dealer-form">
    <p
      v-if="canEdit && currectAction === 'edit'"
      class="required-title"
      v-text="$ml.get('form_required_title')"
    ></p>
    <form v-if="canEdit && currectAction === 'edit'" @submit.prevent="handleSubmit">
      <div class="row">
        <div v-if="dealer.id > 0" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_reg_date')"></label>
            <input
              v-model="dealer.joinedDate"
              readonly
              type="text"
              class="form-control"
              placeholder
            />
          </div>
        </div>
        <div class="col-lg-6" style="display:none;">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_store_id')"></label>

            <input
              v-model="dealer.storeId"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.storeId = ''"
              @change="formErrors.storeId = ''"
            />
            <span v-if="formErrors.storeId" class="invalid-field">{{ formErrors.storeId }}</span>
          </div>
        </div>

        <div class="col-12">
          <hr />
          <h4
            class="text-primary"
            style="line-height: 1rem; font-size: 1.4rem;"
            v-text="$ml.get('form_dealer_dealer_info')"
          ></h4>
          <br />
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('dealer_name')"></label>
            <span class="required-star">*</span>
            <input
              id="dealerName"
              v-model="dealer.dealerName"
              name="dealerName"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.dealerName = ''"
            />
            <span v-if="formErrors.dealerName" class="invalid-field">{{
              formErrors.dealerName
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_reg_number')"></label>
            <span v-if="dealer.bulkUpload" class="required-star">*</span>
            <input
              v-model="dealer.businessRegNo"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.businessRegNo = ''"
            />
            <span v-if="formErrors.businessRegNo" class="invalid-field">{{
              formErrors.businessRegNo
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_lpp_code')"></label>
            <span class="required-star">*</span>
            <input
              v-model="dealer.prmLppName"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.prmLppName = ''"
            />
            <span v-if="formErrors.prmLppName" class="invalid-field">{{
              formErrors.prmLppName
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_account_manager')"></label>
            <span class="required-star">*</span>
            <input
              v-model="dealer.accountManager"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.accountManager = ''"
            />
            <span v-if="formErrors.accountManager" class="invalid-field">{{
              formErrors.accountManager
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_allow_bulk_upload')"></label>
            <div class="form-group mb-0">
              <label class="switch" for="bulkUpload">
                <input id="bulkUpload" v-model="dealer.bulkUpload" type="checkbox" />
                <div class="slider round"></div>
              </label>

              <span v-if="formErrors.bulkUpload" class="invalid-field">{{
                formErrors.bulkUpload
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="dealer.id > 0" class="col-12">
          <div class="row">
            <div class="col-4">
              <button class="btn btn-info btn-block" type="button" @click="togglePICModal">
                <i class="fa fa-user-o"></i>
                <span v-text="$ml.get('form_dealer_outlet_pic')"></span>
                ({{ picListCount }})
              </button>
            </div>
            <div class="col-4">
              <button class="btn btn-info btn-block" type="button" @click="toggleOutletModal">
                <i class="fa fa-building-o"></i>
                <span v-text="$ml.get('form_dealer_outlet_list')"></span>
                ({{ outletListCount }})
              </button>
            </div>
            <div class="col-4">
              <button class="btn btn-info btn-block" type="button" @click="toggleSalesPModal">
                <i class="fa fa-user-o"></i>
                <span v-text="$ml.get('form_dealer_salesperson')"></span>
                ({{ dealer.salesPersonListCount }})
              </button>
            </div>
          </div>
        </div>

        <div class="col-12">
          <hr />
          <h4
            class="text-primary"
            style="line-height: 1rem;    font-size: 1.4rem;"
            v-text="$ml.get('form_dealer_owner_info')"
          ></h4>

          <br />
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('dealer_name')"></label>
            <span class="required-star">*</span>
            <input
              id="ownerName"
              v-model="dealer.ownerName"
              name="ownerName"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.ownerName = ''"
            />
            <span v-if="formErrors.ownerName" class="invalid-field">{{
              formErrors.ownerName
            }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_owner_ic')"></label>
            <span class="required-star">*</span>
            <input
              v-model="dealer.ownerIcOrId"
              v-validate="'alpha_num'"
              type="text"
              class="form-control"
              :name="$ml.get('form_dealer_owner_ic')"
              placeholder
              @keyup="formErrors.ownerIcOrId = ''"
            />
            <span v-if="errors.first($ml.get('form_dealer_owner_ic'))" class="invalid-field">{{
              errors.first($ml.get("form_dealer_owner_ic"))
            }}</span>
            <span v-if="formErrors.ownerIcOrId" class="invalid-field">{{
              formErrors.ownerIcOrId
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_contact_number')"></label>
            <span class="required-star">*</span>
            <input
              v-model="dealer.contactNum"
              v-validate="{ regex: getPhoneRegex() }"
              name="form_dealer_phone"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.contactNum = ''"
            />
            <span v-if="formErrors.contactNum" class="invalid-field">{{
              formErrors.contactNum
            }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-if="errors.firstByRule('form_dealer_phone', 'regex') && !formErrors.contactNum"
              class="invalid-field"
              v-html="$ml.get('invalid_phone_number')"
            ></span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_email')"></label>
            <span class="required-star">*</span>
            <input
              v-model="dealer.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_dealer_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{ formErrors.email }}</span>
            <span
              v-if="errors.firstByRule('form_dealer_email', 'regex') && !formErrors.email"
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
      </div>

      <!-- <h4 class="text-primary">Bank Information</h4> -->
      <div class="row">
        <div class="col-12">
          <hr />
          <h4
            class="text-primary"
            style="line-height: 1rem;    font-size: 1.4rem;"
            v-text="$ml.get('form_dealer_bank_info')"
          ></h4>
          <br />
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_bank_holder_name')"></label>
            <span v-if="dealer.bulkUpload" class="required-star">*</span>
            <input
              v-model="dealer.bankAccNam"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.bankAccNam = ''"
            />
            <span v-if="formErrors.bankAccNam" class="invalid-field">{{
              formErrors.bankAccNam
            }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_bank_name')"></label>
            <span v-if="dealer.bulkUpload" class="required-star">*</span>
            <!-- <select v-model="dealer.bankId" id="bankId" class="form-control">
              <option disabled selected value>Please Select</option>
              <option v-for="bank of banks" :value="bank.id" :key="bank.id">{{bank.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect"
              v-model="dealer.bankId"
              placeholder="Select Bank"
              :searchable="true"
              :options="banks"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="getBanksIsLoading"
            ></Multiselect>

            <span v-if="formErrors.bankId" class="invalid-field">{{ formErrors.bankId }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_dealer_bank_acc_number')"></label>
            <span v-if="dealer.bulkUpload" class="required-star">*</span>
            <input
              v-model="dealer.bankAccNum"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.bankAccNum = ''"
            />
            <span v-if="formErrors.bankAccNum" class="invalid-field">{{
              formErrors.bankAccNum
            }}</span>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <button type="submit" class="btn btn-secondary pull-right">
            <span v-if="!dealer.id" v-text="$ml.get('form_dealer_add_dealer')"></span>
            <span v-if="dealer.id > 0" v-text="$ml.get('form_dealer_update_dealer')"></span>
          </button>
          <button
            type="button"
            class="btn btn-light pull-right"
            data-dismiss="modal"
            @click="close()"
            v-text="$ml.get('button_cancel_text')"
          ></button>
        </div>
      </div>
    </form>

    <!-- View -->
    <div v-if="canView && currectAction === 'view'">
      <table class="table">
        <tbody>
          <tr>
            <td>Registered Date</td>
            <td>{{ dealer.joinedDate }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_store_id')"></td>
            <td>{{ dealer.storeId }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_lpp_code')"></td>
            <td>{{ dealer.prmLppName }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_account_manager')"></td>
            <td>{{ dealer.accountManager }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <h4
                class="text-primary"
                style="line-height: 1rem; font-size: 1.4rem;"
                v-text="$ml.get('form_dealer_dealer_info')"
              ></h4>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('dealer_name')"></td>
            <td>{{ dealer.dealerName }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_reg_number')"></td>
            <td>{{ dealer.businessRegNo }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_allow_bulk_upload')"></td>
            <td>
              <span v-if="dealer.bulkUpload">Yes</span>
              <span v-if="!dealer.bulkUpload">No</span>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="row">
                <div class="col-4">
                  <button class="btn btn-info btn-block" type="button" @click="togglePICModal">
                    <i class="fa fa-user-o"></i>
                    &nbsp; PIC Outlet List ({{ picListCount }})
                  </button>
                </div>
                <div class="col-4">
                  <button class="btn btn-info btn-block" type="button" @click="toggleOutletModal">
                    <i class="fa fa-building-o"></i>
                    &nbsp; Outlet List ({{ outletListCount }})
                  </button>
                </div>
                <div class="col-4">
                  <button class="btn btn-info btn-block" type="button" @click="toggleSalesPModal">
                    <i class="fa fa-user-o"></i>
                    &nbsp; Salesperson ({{ dealer.salesPersonListCount }})
                  </button>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <h4
                class="text-primary"
                style="line-height: 1rem; font-size: 1.4rem;"
                v-text="$ml.get('form_dealer_owner_info')"
              ></h4>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_owner_name')"></td>
            <td>{{ dealer.ownerName }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_owner_ic')"></td>
            <td>{{ dealer.ownerIcOrId }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_contact_number')"></td>
            <td>{{ dealer.contactNum }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_email')"></td>
            <td>{{ dealer.email }}</td>
          </tr>
          <tr>
            <td colspan="2">
              <h4
                class="text-primary"
                style="line-height: 1rem; font-size: 1.4rem;"
                v-text="$ml.get('form_dealer_bank_info')"
              ></h4>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_bank_holder_name')"></td>
            <td>{{ dealer.bankAccNam }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_bank_name')"></td>
            <td>{{ dealer.bankId.text }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_dealer_bank_acc_number')"></td>
            <td>{{ dealer.bankAccNum }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Windows -->
    <BModal ref="dealer-pic-modal" size="lg" hide-footer title="PIC">
      <DealerPicList :pic-list="dealer.picList" />
    </BModal>

    <BModal ref="dealer-outlet-modal" size="lg" hide-footer title="Outlets">
      <DealerOutletList :outlet-list="dealer.outletList" />
    </BModal>

    <BModal ref="dealer-salesp-modal" size="lg" hide-footer title="Salesperson">
      <DealerSalesPList :salesp-list="dealer.salespersonList" />
    </BModal>
  </div>
</template>

<script>
import DealerPicList from "./dealer_pic_outlets";
import DealerOutletList from "./dealer_outlets";
import DealerSalesPList from "./dealer_salespersons";
import { DEALER_POST_REQUEST, DEALER_REQUEST } from "../../store/modules/dealer/actions";
import { BANK_LIST_REQUEST } from "../../store/modules/utility/actions";
import { BModal } from "bootstrap-vue";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";
import { nameValidate, emailValidate, phoneValidate, convertDateFormat } from "../../utils/helpers";
import Multiselect from "vue-multiselect";

export default {
  components: {
    DealerPicList: DealerPicList,
    DealerOutletList: DealerOutletList,
    DealerSalesPList: DealerSalesPList,
    BModal: BModal,
    Multiselect: Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    dealerSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canView: { type: Boolean },
    canEdit: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {
    outletListCount() {
      if (this.dealer.outletList) {
        return this.dealer.outletList.length;
      } else {
        return 0;
      }
    },
    picListCount() {
      if (this.dealer.picList) {
        return this.dealer.picList.length;
      } else {
        return 0;
      }
    },
    salespListCount() {
      if (this.dealer.salespList) {
        return this.dealer.salespersonList.length;
      } else {
        return 0;
      }
    }
  },
  data() {
    return {
      dealer: {
        joinedDate: this.changeDate(this.dealerSelected.joinedDate),
        dealerName: this.dealerSelected.dealerName,
        storeId: this.dealerSelected.storeId,
        prmLppName: this.dealerSelected.prmLppName,
        email: this.dealerSelected.email,
        ownerName: this.dealerSelected.ownerName,
        ownerIcOrId: this.dealerSelected.ownerIcOrId,
        contactNum: this.dealerSelected.contactNum,
        bulkUpload: this.dealerSelected.bulkUpload,
        businessRegNo: this.dealerSelected.businessRegNo,
        accountManager: this.dealerSelected.accountManager,
        bankId: this.dealerSelected.bankId ? this.dealerSelected.bankId : "",
        bankAccNum: this.dealerSelected.bankAccNum,
        bankAccNam: this.dealerSelected.bankAccHolderName,
        id: this.dealerSelected.id,
        status: this.dealerSelected.status,
        countryId: this.dealerSelected.countryId,
        outletList: [],
        picList: [],
        salespersonList: [],
        countries: [],
        isCountriesLoading: false
      },

      banks: [],
      submitted: false,
      formErrors: [],
      countryId: 0,
      getBanksIsLoading: false
    };
  },
  methods: {
    getPhoneRegex() {
      return phoneValidate(this.dealer.contactNum, 1);
    },
    getEmailRegex() {
      return emailValidate(this.dealer.email, 1);
    },
    togglePICModal() {
      this.$refs["dealer-pic-modal"].toggle("#toggle-btn");
    },
    toggleOutletModal() {
      this.$refs["dealer-outlet-modal"].toggle("#toggle-btn");
    },
    toggleSalesPModal() {
      this.$refs["dealer-salesp-modal"].toggle("#toggle-btn");
    },
    close() {
      this.closeModal();
    },
    success() {
      this.close();
      this.loadData();
    },
    checkFormValidity() {
      this.formErrors = {};
      let error = 0;

      if (!this.dealer.dealerName) {
        this.formErrors.dealerName = this.$ml.get("form_dealer_name_required");
        error++;
      } else {
        if (!nameValidate(this.dealer.dealerName)) {
          this.formErrors.dealerName = this.$ml.get("form_dealer_name_invalid");
          error++;
        }
      }

      // if (!this.dealer.storeId) {
      //   this.formErrors.storeId = "Store Id is required.";
      //   error++;
      // }

      if (!this.dealer.prmLppName) {
        this.formErrors.prmLppName = this.$ml.get("form_dealer_lpp_code_required");
        error++;
      }

      if (!this.dealer.email) {
        this.formErrors.email = this.$ml.get("form_dealer_email_required");
        error++;
      } else {
        if (!emailValidate(this.dealer.email)) {
          this.formErrors.email = this.$ml.get("form_dealer_email_invalid");
          error++;
        }
      }

      if (!this.dealer.ownerName) {
        this.formErrors.ownerName = this.$ml.get("form_dealer_owner_name_required");
        error++;
      }
      if (!this.dealer.ownerIcOrId) {
        this.formErrors.ownerIcOrId = this.$ml.get("form_dealer_owner_ic_required");
        error++;
      }

      if (!this.dealer.contactNum) {
        this.formErrors.contactNum = this.$ml.get("form_dealer_owner_contact_required");
        error++;
      } else {
        if (!phoneValidate(this.dealer.contactNum)) {
          this.formErrors.contactNum = this.$ml.get("invalid_phone_number");
          error++;
        }
      }

      if (!this.dealer.accountManager) {
        this.formErrors.accountManager = this.$ml.get("form_dealer_acc_manager_required");
        error++;
      }

      if (this.dealer.bulkUpload) {
        if (!this.dealer.businessRegNo) {
          this.formErrors.businessRegNo = this.$ml.get("form_dealer_reg_number_required");
          error++;
        }

        if (!this.dealer.bankAccNum) {
          this.formErrors.bankAccNum = this.$ml.get("form_dealer_acc_number_required");
          error++;
        }

        if (!this.dealer.bankAccNam) {
          this.formErrors.bankAccNam = this.$ml.get("form_dealer_acc_holder_name_required");
          error++;
        }

        if (!this.dealer.bankId) {
          this.formErrors.bankId = this.$ml.get("form_dealer_bank_name_required");
          error++;
        }
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
      if (this.checkFormValidity(e)) {
        this.$validator.validateAll().then(result => {
          if (result) {
            this.$store.dispatch(NOTIFICATION_REQUEST, {
              message: this.$ml.get("request_submitting")
            });
            // const { email, password } = this;
            // alert(JSON.stringify(this.dealer));
            this.dealer.countryId = this.countryId;
            // console.log(this.dealer);
            this.$store.dispatch(DEALER_POST_REQUEST, this.dealer).then(res => {
              if (res.resultCode === 0) {
                this.success();
                if (this.dealer.id) {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("dealer_updated")
                  });
                } else {
                  this.$store.dispatch(NOTIFICATION_SUCCESS, {
                    message: this.$ml.get("dealer_added")
                  });
                }

                // return Message({
                //   message: this.dealer.id
                //     ? "Dealer Successfully Updated."
                //     : "Dealer Successfully Added.",
                //   type: "success",
                //   duration: 5 * 1000
                // });

                // this.success();
                // this.$emit("success", 1);
              }
            });
          }
        });
      }
    },
    getBanks() {
      let pdata = { countryCode: this.$store.getters.getCountryCode };
      this.getBanksIsLoading = true;
      this.$store.dispatch(BANK_LIST_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.banks = res.content;

          if (this.dealer.bankId > 0) {
            this.dealer.bankId = this.getSelectedBank(this.dealer.bankId);
          }
        }
        this.getBanksIsLoading = false;
      });
    },
    getSelectedBank(id) {
      let c = this.banks.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    },
    getDealerById(id) {
      if (id > 0) {
        this.$store.dispatch(DEALER_REQUEST, { id: id }).then(res => {
          if (res.resultCode === 0) {
            const dealer = res.content;
            // this.dealer = res.content;

            this.dealer.dealerName = dealer.dealerName;
            this.dealer.storeId = dealer.storeId;
            this.dealer.prmLppName = dealer.prmLppName;
            this.dealer.email = dealer.email;
            this.dealer.ownerName = dealer.ownerName;
            this.dealer.ownerIcOrId = dealer.ownerIcOrId;
            this.dealer.contactNum = dealer.contactNum;
            this.dealer.bulkUpload = dealer.bulkUpload;
            this.dealer.businessRegNo = dealer.businessRegNo;
            this.dealer.accountManager = dealer.accountManager;
            this.dealer.bankId = dealer.bankId ? dealer.bankId : "";
            this.dealer.bankAccNum = dealer.bankAccNum;
            this.dealer.bankAccNam = dealer.bankAccHolderName;
            this.dealer.id = dealer.id;
            this.dealer.status = dealer.status;
            this.dealer.countryId = dealer.countryId;

            this.dealer.picList = dealer.picList;
            this.dealer.outletList = dealer.outletList;
            this.dealer.picListCount = dealer.picList.length;
            this.dealer.joinedDate = this.changeDate(dealer.joinedDate);
            this.dealer.salesPersonListCount = dealer.salespersonList.length;
            this.dealer.salespersonList = dealer.salespersonList;
            this.dealer.picList.forEach(row => {
              row.dealerOutlets.forEach(ol => {
                ol.picName = row.picName;
                // this.dealer.outletList.push(ol);

                // ol.userProfiles.forEach(user => {
                //   this.dealer.salespList.push(user);
                // });
              });
            });
            // alert(this.dealer.outletList.length);

            this.dealer.outletListCount = dealer.outletList.length;

            this.getBanks();
          }
        });
      } else {
        this.getBanks();
      }
    },
    changeDate(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
    }
  },
  created() {},
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    // this.closeModal();
    if (this.dealer.id) {
      this.getDealerById(this.dealer.id);
    } else {
      this.getBanks();
    }
  }
};
</script>
