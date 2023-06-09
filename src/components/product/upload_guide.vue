<template>
  <div class="btn btn-card btn-primary btn-margin" @click="$refs.guideFile.click()">
    <i class="fa fa-upload"></i> Product Guide
    <input
      id="guideFile"
      ref="guideFile"
      accept="application/pdf"
      type="file"
      class="form-control"
      name="guideFile"
      style="display: none"
      @change="handleFileUpload()"
    />
  </div>
</template>

<script>
import { PRODUCT_GUILD_UPLOAD_REQUEST } from "../../store/modules/product/actions";
import { Message } from "element-ui";

export default {
  name: "UploadProductGuide",
  components: {},
  props: {},
  computed: {},
  data() {
    return {
      file: "",
      submitted: false,
      formErrors: []
    };
  },
  methods: {
    checkFormValidity() {
      return true;
    },
    handleFileUpload(e) {
      this.file = this.$refs.guideFile.files[0];
      // console.log();
      this.submitted = true;
      if (!this.checkFormValidity(e)) {
        return;
      } else {
        this.$store.dispatch(PRODUCT_GUILD_UPLOAD_REQUEST, this.file).then(res => {
          if (res.resultCode === 0) {
            this.success();
            return Message({
              message: "Product Guide Successfully Uploaded.",
              type: "success",
              duration: 5 * 1000
            });
          }
        });
      }
    }
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
.btn-margin {
  margin-left: 2px;
}
</style>
