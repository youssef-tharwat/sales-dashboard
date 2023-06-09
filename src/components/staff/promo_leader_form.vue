<template>
  <div>
    <p
      v-if="canEdit && currectAction === 'edit'"
      class="required-title"
      v-text="$ml.get('form_required_title')"
    ></p>
    <form v-if="canEdit && currectAction === 'edit'" @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_leader_name')"></label>
            <span class="required-star">*</span>
            <input
              id="name"
              v-model="leader.name"
              name="name"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.name = ''"
            />
            <span v-if="formErrors.name" class="invalid-field">{{ formErrors.name }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_leader_email')"></label>
            <span class="required-star">*</span>
            <input
              v-model="leader.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_leader_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{ formErrors.email }}</span>
            <!-- eslint-disable vue/no-v-html  -->
            <span
              v-if="errors.firstByRule('form_leader_email', 'regex') && !formErrors.email"
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_leader_contact_number')"></label>
            <span class="required-star">*</span>
            <input
              v-model="leader.phoneNumber"
              v-validate="{ regex: getPhoneRegex() }"
              name="form_leader_phone"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.phoneNumber = ''"
            />
            <span v-if="formErrors.phoneNumber" class="invalid-field">{{
              formErrors.phoneNumber
            }}</span>
            <span
              v-if="errors.firstByRule('form_leader_phone', 'regex') && !formErrors.phoneNumber"
              class="invalid-field"
              v-html="$ml.get('invalid_phone_number')"
            ></span>
          </div>
        </div>

        <div class="col-12">
          <div class="row">
            <div class="col-lg-12">
              <button type="submit" class="btn btn-secondary pull-right">
                <span v-if="!leader.staffId" v-text="$ml.get('form_leader_add_button')"></span>
                <span v-if="leader.staffId" v-text="$ml.get('form_leader_update_button')"></span>
              </button>
              <button
                type="button"
                class="btn btn-light pull-right"
                data-dismiss="modal"
                @click="close()"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- View -->
    <div v-if="canView && currectAction === 'view'">
      <table class="table">
        <tbody>
          <tr>
            <td v-text="$ml.get('form_leader_name')"></td>
            <td>{{ leader.name }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_leader_email')"></td>
            <td>{{ leader.email }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_leader_contact_number')"></td>
            <td>{{ leader.phoneNumber }}</td>
          </tr>
        </tbody>
      </table>

      <!-- <div class="row">
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Name : {{leader.name}}</label>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label">Email ID : {{leader.email}}</label>
          </div>
        </div>
        <label class="col-lg-6">
          <label class="form-group flex-grow-1">
            <label class="text-label">Phone Number : {{leader.phoneNumber}}</label>
          </label>
        </label>
      </div>-->
    </div>
  </div>
</template>

<script>
import { POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import { nameValidate, emailValidate, phoneValidate } from "../../utils/helpers";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  name: "LeaderForm",
  components: {},
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    leaderSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    canEdit: { type: Boolean },
    canView: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      leader: {
        name: this.leaderSelected.name,
        email: this.leaderSelected.email,
        phoneNumber: this.leaderSelected.phoneNumber,
        staffId: this.leaderSelected.id,
        type: "leaders"
      },
      submitted: false,
      formErrors: []
    };
  },
  methods: {
    getPhoneRegex() {
      return phoneValidate(this.leader.phoneNumber, 1);
    },
    getEmailRegex() {
      return emailValidate(this.leader.email, 1);
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

      if (!this.leader.name) {
        this.formErrors.name = this.$ml.get("form_leader_name_required");
        error++;
      } else {
        if (!nameValidate(this.leader.name)) {
          this.formErrors.name = this.$ml.get("form_leader_name_invalid");
          error++;
        }
      }

      if (!this.leader.email) {
        this.formErrors.email = this.$ml.get("form_leader_email_required");
        error++;
      } else {
        if (!emailValidate(this.leader.email)) {
          this.formErrors.email = this.$ml.get("form_leader_email_invalid");
          error++;
        }
      }

      if (!this.leader.phoneNumber) {
        this.formErrors.phoneNumber = this.$ml.get("form_leader_contact_number_required");
        error++;
      } else {
        if (!phoneValidate(this.leader.phoneNumber)) {
          this.formErrors.phoneNumber = this.$ml.get("invalid_phone_number");
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
      if (!this.checkFormValidity(e)) {
        return;
      } else {
        this.$store.dispatch(NOTIFICATION_REQUEST, {
          message: this.$ml.get("request_submitting")
        });
        let pdata = {};
        if (this.leader.staffId > 0) {
          pdata.data = this.leader;
          pdata.staffId = this.leader.staffId;
          pdata.data.id = this.leader.staffId;
        } else {
          pdata.data = [this.leader];
        }
        pdata.type = this.leader.type;

        this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.leader.staffId) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_leader_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_leader_added")
              });
            }
          }
        });
      }
    }
  },
  created() {},
  mounted() {
    // this.closeModal();
  }
};
</script>
