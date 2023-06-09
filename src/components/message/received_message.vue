<template>
  <div class="chat-sender">
    <div class="media single-message">
      <div class="media-img-container">
        <img
          class="img-fluid media-img"
          :src="msg.createdByImage ? msg.createdByImage : default_image"
          alt="User"
          @error="replaceImageByDefault"
        />
      </div>
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

      if (msgdate != "Invalid date") {
        if (msgdate === today) {
          return "Today";
        } else {
          return msgdate + " " + msgtime;
        }
      } else {
        return "";
      }
    },
    getTime: function(date) {
      return convertDateFormat(date, "hh:mm A");
    }
  }
};
</script>

<style></style>
