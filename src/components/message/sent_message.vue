<template>
  <div class="chat-reciver">
    <div class="media single-message">
      <div class="media-body">
        <div>
          <p>
            <span>{{ msg.message }}</span>
          </p>
        </div>
        <div>
          <small class="time">{{ getDate(msg.createdDate) }}</small>
        </div>
      </div>
      <div class="media-img-container mr-3">
        <img
          class="img-fluid media-img"
          :src="msg.createdByImage ? msg.createdByImage : default_image"
          alt="User"
          @error="replaceImageByDefault"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { convertDateFormat } from "../../utils/helpers";
import default_image from "../../assets/default_image.jpg";
export default {
  props: {
    message: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      msg: this.message,
      default_image: default_image
    };
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = this.default_image;
    },
    getDate: function(date) {
      let today = new Date();
      // alert(date);
      let msgdate = convertDateFormat(date, "YYYY-MM-DD");
      let msgtime = convertDateFormat(date, "hh:mm A");
      let t = convertDateFormat(today, "YYYY-MM-DD");

      if (msgdate != "Invalid date") {
        if (msgdate === t) {
          return msgtime;
        } else {
          return msgdate + " " + msgtime;
        }
      } else {
        return "";
      }
    },
    getTime: function(date) {
      return convertDateFormat(String(date), "hh:mm A");
    }
  }
};
</script>

<style></style>
