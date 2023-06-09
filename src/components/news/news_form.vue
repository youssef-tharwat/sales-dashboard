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
            <label class="text-label" v-text="$ml.get('form_news_header')"></label>
            <span class="required-star">*</span>
            <input
              id="header"
              v-model="news.header"
              name="header"
              type="text"
              class="form-control"
              placeholder
              @keyup="formErrors.header = ''"
            />
            <span v-if="formErrors.header" class="invalid-field">{{ formErrors.header }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_date')"></label>
            <span class="required-star">*</span>
            <!-- <input v-model="news.date" type="text" class="form-control" placeholder /> -->
            <Datepicker
              v-model="news.announcementDate"
              :disabled-dates="disabledDates"
              input-class="form-control"
              name="announcementDate"
            ></Datepicker>
            <span v-if="formErrors.announcementDate" class="invalid-field">{{
              formErrors.announcementDate
            }}</span>
          </div>
        </div>
        <div class="col-lg-12">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_content')"></label>
            <span class="required-star">*</span>
            <!--  :editorToolbar="customToolbar" -->
            <VueEditor v-model="news.content" :editor-toolbar="customToolbar"></VueEditor>

            <span v-if="formErrors.content" class="invalid-field">{{ formErrors.content }}</span>
          </div>
        </div>

        <!-- <div class="col-lg-6">
        <div class="form-group flex-grow-1">
          <label class="text-label">PDF Link</label>
          <input v-model="news.pdfLink" type="url" class="form-control" placeholder />
          <span v-if="formErrors.pdfLink" class="invalid-field">{{formErrors.pdfLink}}</span>
        </div>
        </div>-->
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_pdf_file')"></label>
            <input
              type="file"
              accept="application/pdf"
              class="form-control"
              @change="onNewsPdfChanged"
            />
            <span v-if="news.pdfUrl">
              <a
                class="lnv-link"
                target="_blank"
                :href="news.pdfUrl"
                v-text="$ml.get('form_news_view_pdf')"
              ></a>
            </span>
            <span v-if="formErrors.pdfFile" class="invalid-field">{{ formErrors.pdfFile }}</span>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_video_link')"></label>
            <input
              v-model="news.videoLink"
              type="url"
              class="form-control"
              placeholder
              @keyup="formErrors.videoLink = ''"
            />
            <span v-if="formErrors.videoLink" class="invalid-field">{{
              formErrors.videoLink
            }}</span>
          </div>
        </div>
        <!-- <div class="col-lg-12">
        <div class="form-group flex-grow-1">
          <label class="text-label">Image Link</label>
          <input v-model="news.imagelink" type="url" class="form-control" placeholder />
          <span v-if="errors.imagelink" class="invalid-field">{{errors.imagelink}}</span>
        </div>
        </div>-->
        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_target')"></label>
            <!-- <select v-model="news.target" id="target" class="form-control">
            <option disabled selected value>All</option>
            <option
              v-for="(target, index) of targets"
              :value="target.id"
              :key="index"
            >{{target.text}}</option>
            </select>-->
            <Multiselect
              ref="multiselect"
              v-model="news.target"
              placeholder="Select Target"
              :searchable="true"
              :options="targets"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isTargetsLoading"
            ></Multiselect>
            <span v-if="formErrors.target" class="invalid-field">{{ formErrors.target }}</span>
          </div>
        </div>
        <div class="col-lg-6" style="display:none">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_state')"></label>
            <!-- <select v-model="news.state" id="state" class="form-control">
            <option disabled selected value>Please Select State</option>
            <option v-for="(state, index) of states" :value="state.id" :key="index">{{state.text}}</option>
            </select>-->
            <!-- :multiple="true" -->
            <Multiselect
              ref="multiselect-state"
              v-model="news.state"
              placeholder="Select State"
              :searchable="true"
              :options="states"
              label="text"
              track-by="id"
              select-label
              deselect-label
              :loading="isStatesLoading"
            ></Multiselect>
            <span v-if="formErrors.state" class="invalid-field">{{ formErrors.state }}</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_image')"></label>
            <input type="file" accept="image/*" class="form-control" @change="onNewsImageChanged" />
            <span v-if="formErrors.image" class="invalid-field">{{ formErrors.image }}</span>
          </div>
        </div>

        <div v-if="selectedNews.id" class="col-lg-6">
          <div class="form-group flex-grow-1">
            <label class="text-label" v-text="$ml.get('form_news_status')"></label>
            <Multiselect
              ref="multiselect-status"
              v-model="news.status"
              placeholder="Select Status"
              :options="statuses"
              select-label
              deselect-label
            ></Multiselect>
            <span v-if="formErrors.status" class="invalid-field">{{ formErrors.status }}</span>
          </div>
        </div>
      </div>

      <div class="col-lg-12">
        <img style="width: 100%;" :src="news.imageUrl" />
      </div>

      <div class="row">
        <div class="col-lg-12">
          <button
            v-if="!news.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_news_add_button')"
          ></button>
          <button
            v-if="news.id"
            type="submit"
            class="btn btn-secondary pull-right"
            v-text="$ml.get('form_news_update_button')"
          ></button>
          <button type="button" class="btn btn-light pull-right" @click="close()">Cancel</button>
        </div>
      </div>
    </form>
    <!-- View -->
    <div v-if="canView && currectAction === 'view'">
      <table class="table">
        <tbody>
          <tr>
            <td v-text="$ml.get('form_news_header')"></td>
            <td>{{ news.header }}</td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_news_date')"></td>
            <td>{{ formatData(news.announcementDate, "YYYY-MM-DD") }}</td>
          </tr>
          <tr>
            <td colspan="2" v-text="$ml.get('form_news_content')"></td>
          </tr>
          <tr>
            <td colspan="2">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="news_form_content" style="width:100%" v-html="news.content"></div>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_news_pdf_file')"></td>
            <td>
              <a class="lnv-link" target="_blank" :href="news.pdfUrl">{{ news.pdfUrl }}</a>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_news_video_link')"></td>
            <td>
              <a class="lnv-link" target="_blank" :href="news.videoLink">{{ news.videoLink }}</a>
            </td>
          </tr>
          <tr>
            <td v-text="$ml.get('form_news_target')"></td>
            <td>
              <a target="_blank" :href="news.target">{{ news.target.text }}</a>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <img style="width: 100%;" :src="news.imageUrl" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { NEWS_POST_REQUEST, NEWS_IMAGE_UPLOAD_REQUEST } from "../../store/modules/news/actions";
import { VueEditor } from "vue2-editor";
import Datepicker from "vuejs-datepicker";
import { Message } from "element-ui";
import { NEWS_TARGET_LIST_REQUEST, STATE_LIST_REQUEST } from "../../store/modules/utility/actions";
import Multiselect from "vue-multiselect";
import { convertDateFormat } from "../../utils/helpers";
import { NOTIFICATION_REQUEST, NOTIFICATION_SUCCESS } from "../../store/modules/ui/actions";

export default {
  components: {
    VueEditor,
    Datepicker,
    Multiselect
  },
  props: {
    closeModal: { type: Function, default: () => {} },
    loadData: { type: Function, default: () => {} },
    selectedNews: { type: Object, default: () => {} },
    canView: { type: Boolean },
    canEdit: { type: Boolean },
    currectAction: { type: String, default: "" }
  },
  computed: {},
  data() {
    return {
      disabledDates: {
        to: new Date()
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }]
      ],
      news: {
        header: this.selectedNews.header,
        announcementDate: this.selectedNews.announcementDate,
        content: this.selectedNews.content,
        pdfLink: this.selectedNews.pdfLink,
        videoLink: this.selectedNews.videoLink,
        pdfFile: this.selectedNews.pdfFile,
        target: this.selectedNews.targetId,
        bActive: this.selectedNews.bActive,
        id: this.selectedNews.id,
        state: this.selectedNews.stateId,
        status: this.selectedNews.bActive ? "ACTIVE" : "DEACTIVE",
        imageUrl: this.selectedNews.imageUrl,
        pdfUrl: this.selectedNews.pdfUrl
        // bActive: this.selectedNews.bActive
      },
      submitted: false,
      formErrors: [],
      states: [],
      targets: [],
      imageFile: {},
      base64imageFile: null,
      pdfFile: {},
      base64PdfFile: null,
      countryId: 0,
      statuses: ["ACTIVE", "DEACTIVE"],
      isTargetsLoading: false,
      isStatesLoading: false
    };
  },
  methods: {
    formatData(date) {
      return convertDateFormat(date, "YYYY-MM-DD");
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
      let d = convertDateFormat(this.news.announcementDate, "YYYY-MM-DD");

      if (!this.news.header) {
        this.formErrors.header = this.$ml.get("form_news_header_required");
        error++;
      }
      // alert(d);
      if (d === "Invalid date") {
        this.formErrors.announcementDate = this.$ml.get("form_news_date_required");
        error++;
      }
      if (!this.news.content) {
        this.formErrors.content = this.$ml.get("form_news_content_required");
        error++;
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

        this.news.countryId = this.countryId;
        this.news.newsImage = this.base64imageFile;
        this.news.newsPdf = this.base64PdfFile;
        this.news.bActive = this.news.status === "ACTIVE" ? true : false;
        this.news.announcementDate = convertDateFormat(this.news.announcementDate, "YYYY-MM-DD");
        // alert(JSON.stringify(this.news.stateId));
        // alert(JSON.stringify(this.news.targetId));
        this.news.state = this.news.state ? this.news.state.id : null;
        this.news.target = this.news.target ? this.news.target.id : null;
        // alert(JSON.stringify(this.news.state));
        this.$store.dispatch(NEWS_POST_REQUEST, this.news).then(res => {
          if (res.resultCode === 0) {
            this.success();
            if (this.news.id) {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("news_updated")
              });
            } else {
              this.$store.dispatch(NOTIFICATION_SUCCESS, {
                message: this.$ml.get("news_added")
              });
            }
            // return Message({
            //   message: this.news.id
            //     ? "News Successfully Updated."
            //     : "News Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });

            // this.uploadImage(1);
            // this.success();
            // return Message({
            //   message: "News Successfully Added.",
            //   type: "success",
            //   duration: 5 * 1000
            // });
          }
        });
      }
    },
    onNewsImageChanged(event) {
      this.imageFile = event.target.files[0];
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          this.base64imageFile = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    onNewsPdfChanged(event) {
      this.pdfFile = event.target.files[0];
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          this.base64PdfFile = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    uploadImage(newsId) {
      if (this.imageFile && this.base64imageFile) {
        this.$store
          .dispatch(NEWS_IMAGE_UPLOAD_REQUEST, {
            id: newsId,
            image: this.base64imageFile
          })
          .then(res => {
            if (res.resultCode === 0) {
              this.success();
              return Message({
                message: this.news.id ? "News Successfully Updated." : "News Successfully Added.",
                type: "success",
                duration: 5 * 1000
              });
            }
          });
      } else {
        this.success();
        return Message({
          message: this.news.id ? "News Successfully Updated." : "News Successfully Added.",
          type: "success",
          duration: 5 * 1000
        });
      }
    },
    getNewsTargets() {
      this.isTargetsLoading = true;
      this.$store.dispatch(NEWS_TARGET_LIST_REQUEST, {}).then(res => {
        if (res.resultCode === 0) {
          this.targets = res.content;
          if (this.news.target) {
            this.news.target = this.getDataRowById(res.content, this.news.target);
          } else {
            this.news.target = this.getDataRowById(res.content, res.content[0].id);
          }
          this.isTargetsLoading = false;
        } else {
          this.isTargetsLoading = false;
        }
      });
    },
    getStates() {
      // alert(this.countryId);
      // const countryId = this.$store.getters.getCountryId;
      this.isStatesLoading = true;
      this.$store.dispatch(STATE_LIST_REQUEST, { countryId: this.countryId }).then(res => {
        if (res.resultCode === 0) {
          this.states = res.content;
          if (this.news.state) {
            // alert(this.news.stateId);
            this.news.state = this.getDataRowById(res.content, this.news.state);
          }
          this.isStatesLoading = false;
        } else {
          this.isStatesLoading = false;
        }
      });
    },
    getStatus() {
      // let statuses = [{ id: 1, text: "ACTIVE" }, { id: 2, text: "DEACTIVE" }];

      // this.statuses = statuses;
      // alert(this.news.status);
      // alert(this.selectedNews.bActive);
      if (this.selectedNews.id) {
        let status = this.selectedNews.bActive ? "ACTIVE" : "DEACTIVE";
        this.news.status = status; //this.getDataRowById(this.statuses, status); // { id: 1, text: "ACTIVE" };
        // alert(JSON.stringify(this.news.status));
      } else {
        this.news.status = "ACTIVE";
      }
    },
    onNewsStatusChange() {
      // alert(JSON.stringify(this.news.status));
      // let n = this.news.status;
      // this.news.status = {};
      // this.news.status = n;
    },
    getDataRowById(arr, id) {
      let c = arr.filter(function(elem) {
        if (elem.id === id) return elem;
      });
      if (c[0]) {
        return c[0];
      } else {
        return {};
      }
    }
  },
  created() {},
  mounted() {
    this.countryId = this.$store.getters.getCountryId;
    // this.closeModal();
    this.getNewsTargets();
    this.getStates();
    this.getStatus();
    // this.loadData();

    let d = new Date();
    d.setDate(d.getDate() - 1);

    this.disabledDates = {
      to: d
    };
  }
};
</script>
<style lang="scss">
.news_form_content {
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
