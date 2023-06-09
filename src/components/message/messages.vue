<template>
  <div>
    <!-- <ul class="d-flex flex-column pl-0 mb-0"> -->
    <ul class="list-group no-overflow">
      <li class="list-group-item chat-heading">
        <div class="row">
          <div class="col-9">
            <div class="media single-message">
              <div class="media-img-container mr-3">
                <img
                  v-if="tread.id"
                  class="mr-3 img-fluid media-img"
                  :src="tread.accIdImageUrl ? tread.accIdImageUrl : default_image"
                  alt="User"
                  @error="replaceImageByDefault"
                />
              </div>
              <div class="media-body align-self-center">
                <h4 v-if="tread.id" class="mb-0">{{ tread.subject }}</h4>
                <h4 v-if="!tread.id" class="mb-0">No messages found!</h4>
              </div>
            </div>
          </div>
          <div class="col-3">
            <i
              :class="{ refreshing: isRefreshing }"
              class="fa fa-refresh refreshBtn pull-right"
              @click="reloadMessages"
            ></i>
          </div>
        </div>
      </li>
    </ul>

    <ul
      v-chat-scroll="{ always: false, smooth: true, scrollonremoved: true }"
      class="list-group message-group"
    >
      <li class="list-group-item">
        <div id="chat-area" class="chat-area">
          <div v-for="(msg, index) in messageList" :key="index">
            <sentMessage v-if="msg.own" :message="msg" />
            <receivedMessage v-if="!msg.own" :message="msg" />
          </div>
          <div class="endOfMessages"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import receivedMessage from "./received_message";
import sentMessage from "./sent_message";
import {
  USER_MESSAGE_LIST_REQUEST,
  SET_READ_MESSAGE_REQUEST
} from "../../store/modules/message/actions";
import default_image from "../../assets/default_image.jpg";
export default {
  name: "ChatMessages",
  components: {
    sentMessage: sentMessage,
    receivedMessage: receivedMessage
  },
  props: {
    treadSelected: {
      type: Object,
      default: () => {
        return {};
      }
    },
    newMessageReceived: {
      type: Object,
      default: () => {
        return {};
      }
    },
    recountMessages: { type: Function, default: () => {} }
  },
  data() {
    return {
      tread: this.treadSelected,
      messageList: [],
      isRefreshing: false,
      default_image: default_image
    };
  },
  watch: {
    treadSelected() {
      this.tread = this.treadSelected;
      this.getMessageList();
    },
    newMessageReceived() {
      this.creteNewMessage(this.newMessageReceived);
    }
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = default_image;
    },
    scrollToEnd: function() {},
    getMessageList() {
      this.messageList = [];
      this.isRefreshing = true;
      // alert(this.isRefreshing);
      if (this.tread.id > 0) {
        this.$store
          .dispatch(USER_MESSAGE_LIST_REQUEST, {
            threadId: this.tread.id
          })
          .then(res => {
            if (res.resultCode === 0) {
              this.messageList = res.content;
              // console.log(this.messageList);
              this.setMessageAsRead(this.tread.id);
              setTimeout(
                function() {
                  this.scrollToEnd();
                  this.isRefreshing = false;
                }.bind(this),
                1000
              );
            }
          });
      } else {
        this.messageList = [];
        setTimeout(
          function() {
            this.scrollToEnd();
            this.isRefreshing = false;
          }.bind(this),
          1000
        );
      }
    },
    creteNewMessage() {
      // this.messageList.push(this.newMessageReceived);
      // this.scrollToEnd();
      this.getMessageList();
    },
    reloadMessages() {
      this.getMessageList();
    },
    setMessageAsRead(treadId) {
      let pdata = {};
      pdata.privateMessageThreadId = treadId;
      this.$store.dispatch(SET_READ_MESSAGE_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.recountMessages();
        }
      });
    }
  },
  mounted() {
    this.getMessageList();
  }
};
</script>

<style scoped lang="scss">
.refreshBtn {
  font-size: 2em;
  cursor: pointer;
  margin-right: 5px;
}

.refreshing {
  -webkit-animation: spin 4s linear infinite;
  -moz-animation: spin 4s linear infinite;
  animation: spin 4s linear infinite;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.message-group {
  height: 600px;
}
.media-img-container {
  width: 4em;
  height: 4em;
  .media-img {
    width: 100%;
    height: 100%;
    display: inline;
    margin: 0 auto;
    vertical-align: middle;
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: 50%;
  }
}
.no-overflow {
  overflow: hidden;
}
</style>
