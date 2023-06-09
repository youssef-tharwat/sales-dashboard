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
            <label class="text-label" v-text="$ml.get('form_manager_name')"></label>
            <span class="required-star">*</span>
            <input
              id="name"
              v-model="manager.fullName"
              name="name"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.fullName = ''"
            />
            <span v-if="formErrors.fullName" class="invalid-field">{{ formErrors.fullName }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_manager_email')"></label>
            <span class="required-star">*</span>
            <input
              v-model="manager.email"
              v-validate="{ regex: getEmailRegex() }"
              name="form_manager_email"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.email = ''"
            />
            <span v-if="formErrors.email" class="invalid-field">{{ formErrors.email }}</span>
            <!-- eslint-disable vue/no-v-html  -->
            <span
              v-if="errors.firstByRule('form_manager_email', 'regex') && !formErrors.email"
              class="invalid-field"
              v-html="$ml.get('invalid_email_address')"
            ></span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_manager_ic_number')"></label>
            <span class="required-star">*</span>
            <input
              id="icNumber"
              v-model="manager.idNumber"
              v-validate="'alpha_num'"
              name="form_manager_ic_number"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.idNumber = ''"
            />
            <span v-if="errors.first('form_manager_ic_number')" class="invalid-field">
              {{
                errors.first("form_manager_ic_number")
              }}
            </span>
            <span v-if="formErrors.idNumber" class="invalid-field">
              {{
                formErrors.idNumber
              }}
            </span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_manager_contact_number')"></label>
            <span class="required-star">*</span>
            <input
              v-model="manager.contactNumber"
              v-validate="{ regex: getPhoneRegex() }"
              name="form_manager_phone"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.contactNumber = ''"
            />
            <span v-if="formErrors.contactNumber" class="invalid-field">
              {{
                formErrors.contactNumber
              }}
            </span>
            <span
              v-if="errors.firstByRule('form_manager_phone', 'regex') && !formErrors.contactNumber"
              class="invalid-field"
              v-html="$ml.get('invalid_phone_number')"
            ></span>
          </div>
        </div>

        <div class="col-12">
          <div class="row">
            <div class="col-lg-12">
              <button type="submit" class="btn btn-secondary pull-right">
                <span v-if="!manager.staffId" v-text="$ml.get('form_manager_add_button')"></span>
                <span v-if="manager.staffId" v-text="$ml.get('form_manager_update_button')"></span>
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
            <td v-text="$ml.get('form_manager_name')"></td>
            <td>{{ manager.fullName }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_manager_email')"></td>
            <td>{{ manager.email }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_manager_ic_number')"></td>
            <td>{{ manager.idNumber }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_manager_contact_number')"></td>
            <td>{{ manager.contactNumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { POST_STAFF_REQUEST } from "../../store/modules/staff/actions";
import {
  nameValidate,
  emailValidate,
  phoneValidate
} from "../../utils/helpers";
import {
  NOTIFICATION_REQUEST,
  NOTIFICATION_SUCCESS
} from "../../store/modules/ui/actions";

export default {
  name: "ManagerForm",
  components: {},
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    managerSelected: {
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
      manager: {
        fullName: this.managerSelected.fullName,
        email: this.managerSelected.email,
        contactNumber: this.managerSelected.contactNumber,
        idNumber: this.managerSelected.idNumber,
        staffId: this.managerSelected.id,
        type: "regionalManager"
      },
      submitted: false,
      formErrors: []
    };
  },
  methods: {
    getPhoneRegex() {
      return phoneValidate(this.manager.contactNumber, 1);
    },
    getEmailRegex() {
      return emailValidate(this.manager.email, 1);
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

      if (!this.manager.fullName) {
        this.formErrors.fullName = this.$ml.get("form_manager_name_required");
        error++;
      } else {
        if (!nameValidate(this.manager.fullName)) {
          this.formErrors.fullName = this.$ml.get("form_manager_name_invalid");
          error++;
        }
      }

      if (!this.manager.email) {
        this.formErrors.email = this.$ml.get("form_manager_email_required");
        error++;
      } else {
        if (!emailValidate(this.manager.email)) {
          this.formErrors.email = this.$ml.get("form_manager_email_invalid");
          error++;
        }
      }

      if (!this.manager.idNumber) {
        this.formErrors.idNumber = this.$ml.get("form_manager_ic_required");
        error++;
      }

      if (!this.manager.contactNumber) {
        this.formErrors.contactNumber = this.$ml.get(
          "form_manager_contact_number_required"
        );
        error++;
      } else {
        if (!phoneValidate(this.manager.contactNumber)) {
          this.formErrors.contactNumber = this.$ml.get("invalid_phone_number");
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
        if (this.manager.staffId > 0) {
          pdata.data = this.manager;
          pdata.staffId = this.manager.staffId;
          pdata.data.id = this.manager.staffId;
        } else {
          pdata.data = this.manager;
        }
        pdata.type = this.manager.type;

        this.$store.dispatch(POST_STAFF_REQUEST, pdata).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.manager.staffId) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_manager_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("form_manager_added")
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
