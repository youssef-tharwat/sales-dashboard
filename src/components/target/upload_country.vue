<template>
  <form @submit.prevent="handleSubmit">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-lg-12">
            <button type="submit" class="btn btn-secondary pull-right">
              Upload Data
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
</template>

<script>
import { Message } from "element-ui";
import { UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST } from "../../store/modules/target/actions";

export default {
  name: "LeaderForm",
  components: {},
  props: {
    closeModal: { type: Function, default: () => {} }
  },
  computed: {},
  data() {
    return {
      data: {},
      submitted: false,
      formErrors: []
    };
  },
  methods: {
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
        this.$store
          .dispatch(UPLOAD_PROMOTER_TARGET_DATA_LIST_REQUEST, this.data)
          .then(res => {
            if (res.resultCode === 0) {
              this.success();
              return Message({
                message: this.product.productId
                  ? "Country target Successfully Updated."
                  : "Country target Successfully Added.",
                type: "success",
                duration: 5 * 1000
              });
            }
          });
      }
    }
  },
  created() {},
  mounted() {
    this.closeModal();
  }
};
</script>
