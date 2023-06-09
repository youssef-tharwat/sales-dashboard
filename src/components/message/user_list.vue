<template>
  <div>
    <div class="event-sideber-search">
      <form method="post" class="chat-search-form">
        <input v-model="search" type="text" class="form-control" placeholder="Search" />
        <i class="fa fa-search"></i>
      </form>
    </div>

    <div class="event-msg-left">
      <ul class="list-group">
        <li class="message-inbox-unread-count">
          <p>{{ unreadCount }}/{{ filteredTreads.length }} Messages</p>
        </li>
        <!-- active -->
        <li
          v-for="(tread, index) in filteredTreads"
          :key="index"
          class="list-group-item msg-single"
          @click="setTread(tread)"
        >
          <div class="media">
            <!-- webRead -->
            <span
              v-if="!tread.webRead && treadSelected.id != tread.id"
              class="unread-signal"
            ></span>
            <div class="media-img-container mr-3">
              <img
                class="img-fluid media-img"
                :src="tread.accIdImageUrl ? tread.accIdImageUrl : default_image"
                alt="User"
                @error="replaceImageByDefault"
              />
            </div>
            <div class="media-body align-self-center chat-user-list">
              <h4 class="mt-0">{{ tread.accIdName }}</h4>
              <p>{{ tread.subject }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  MESSAGE_USER_LIST_REQUEST,
  GET_UNREAD_MESSAGE_COUNT_REQUEST
} from "../../store/modules/message/actions";
import default_image from "../../assets/default_image.jpg";
export default {
  name: "MessageTreadListCmp",
  components: {},
  props: {
    activeMessageTread: { type: Function, default: () => {} },
    selectedCountryId: { type: String, default: "" },
    treadSelected: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    filteredTreads: function() {
      if (this.search) {
        return this.treadList.filter(item => {
          let a = item.subject.toLowerCase().indexOf(this.search) !== -1;
          return a ? a : item.accIdName.toLowerCase().indexOf(this.search) !== -1;
        });
      }
      return this.treadList;
    }
  },
  data: function() {
    return {
      treadList: [],
      search: "",
      selectedTread: {},
      selectedCountry: this.selectedCountryId,
      isRegionAdmin: false,
      default_image: default_image,
      unreadCount: 0,
      countryId: null
    };
  },
  watch: {
    activeMessageTread() {
      this.selectedTread = this.activeMessageTread;
    },
    selectedCountryId() {
      // alert(this.selectedCountryId);
      this.getTreadList();
    }
  },
  methods: {
    replaceImageByDefault: function(e) {
      e.target.src = this.default_image;
    },
    getTreadList() {
      let countryId = this.countryId;

      if (this.isRegionAdmin) {
        countryId = this.selectedCountryId;
      }

      if (countryId > 0) {
        this.$store
          .dispatch(MESSAGE_USER_LIST_REQUEST, {
            type: "country",
            countryId: countryId
          })
          .then(res => {
            if (res.resultCode === 0) {
              this.treadList = res.content;

              if (this.treadList.length > 0) {
                if (!this.selectedTread.id) {
                  this.setTread(this.treadList[0]);
                }
              } else {
                this.setTread({});
              }
            }
          });
      } else {
        this.treadList = [];
        this.setTread({});
      }
    },
    setTread(tread) {
      this.selectedTread = tread;
      this.activeMessageTread(tread);
      this.setTreadAsRead(tread);
    },
    setTreadAsRead(tread) {
      this.filteredTreads.forEach(item => {
        // console.log(item);
        // console.log(tread);
        if (item.id === tread.id) {
          item.webRead = true;
        }
      });
      // let gender = this.genders.filter(function(elem) {
      //   if (elem.id == id) return elem;
      // });
    },
    getUnreadCount() {
      let pdata = {
        countryId: this.countryId
      };
      this.$store.dispatch(GET_UNREAD_MESSAGE_COUNT_REQUEST, pdata).then(res => {
        if (res.resultCode === 0) {
          this.unreadCount = res.content.privateMessageCount;
        }
      });
    }
  },
  mounted() {
    this.isRegionAdmin = this.$store.getters.isRegionAdmin;
    this.countryId = this.$store.getters.getCountryId;
    if (this.isRegionAdmin) {
      if (this.selectedCountryId > 0) {
        this.getTreadList();
      } else {
        this.treadList = [];
      }
    } else {
      this.getTreadList();
    }
  }
};
</script>

<style scoped>
.list-group {
  height: 650px;
}
</style>
