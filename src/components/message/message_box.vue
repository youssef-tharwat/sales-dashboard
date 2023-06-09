<template>
  <div class="char-type">
    <form class="d-flex justify-content-center message-form" @submit.prevent>
      <input
        v-model="message"
        type="text"
        class="form-control"
        placeholder="Type your message here"
        @change="messageChanged"
      />

      <!-- <label class="c-pointer" for="fileupload1">
        <i class="fa fa-paperclip" aria-hidden="true"></i>
      </label>-->
      <!-- <input type="file" name="fileupload1" class="d-none" id="fileupload1" /> -->
      <button type="button" class="btn btn-primary btn-send" @click="sendMessage()">
        <i class="fa fa-paper-plane" aria-hidden="true"></i>
      </button>
    </form>
    <span class="invalid-field">{{ messageError }}</span>
  </div>
</template>

<script>
import { MESSAGE_POST_REQUEST } from "../../store/modules/message/actions";
export default {
  props: {
    loadMessages: { type: Function, default: () => {} },
    treadSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    addMessage: { type: Function, default: () => {} }
  },
  data() {
    return {
      message: "",
      tread: this.treadSelected,
      messageError: ""
    };
  },
  watch: {
    treadSelected() {
      this.tread = this.treadSelected;
      // alert(JSON.stringify(this.tread));
    }
  },
  methods: {
    messageChanged() {
      if (this.message) {
        this.messageError = "";
      } else {
        this.messageError = "Type something to send.";
      }
    },
    scrollToEnd: function() {},
    sendMessage() {
      if (this.tread.id) {
        if (this.message) {
          this.$store
            .dispatch(MESSAGE_POST_REQUEST, {
              threadId: this.tread.id,
              message: this.message
            })
            .then(res => {
              if (res.resultCode === 0) {
                const instMsg = {
                  id: 0,
                  toAccId: null,
                  header: null,
                  content: null,
                  uploadId: "",
                  createdBy: this.tread.createdBy,
                  createdDate: new Date().getTime(),
                  replyToId: null,
                  message: this.message,
                  threadId: this.tread.id,
                  threadByThreadId: null,
                  appAccountsByToAccId: null,
                  privateMessagesByReplyToId: null,
                  appAccountsByCreatedBy: null,
                  privateMessagesById: null,
                  salesPmsById: null,
                  uploadsById: null,
                  attachment: null,
                  own: true
                };

                this.message = "";
                this.tread = this.treadSelected;
                this.addMessage(instMsg);
                this.scrollToEnd();
                // this.loadMessages(this.tread);
              }
            });
        } else {
          this.messageError = "Type something to send.";
        }
      }
    }
  },
  mounted() {}
};
</script>

<style>
.event-chat-ryt .char-type {
  border-top: 1px solid #dddfe1;
  padding-top: 1.5rem;
  position: sticky;
  bottom: 115px;
  width: 100%;
  /* padding-bottom: 1.5rem; */
  background-color: #f3f6f9;
  z-index: 90;
}
</style>
