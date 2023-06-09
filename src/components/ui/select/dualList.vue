<template lang="html">
  <div class="dual-list">
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div
            class="col-md-5 dual-box"
            :style="{ height: options.height + 20 || '' }"
          >
            <div class="card dual-card">
              <div class="card-body">
                <div
                  v-if="options.inputOptions.isRequired"
                  style="margin-bottom: 0px"
                >
                  <input
                    v-model="search"
                    :placeholder="options.placeholder"
                    class="form-control"
                    required
                    :style="{
                      'text-transform': options.inputOptions.uppercase
                        ? 'uppercase'
                        : ''
                    }"
                  />
                </div>

                <div
                  v-if="!options.inputOptions.isRequired"
                  style="margin-bottom: 0px"
                >
                  <input
                    v-model="search"
                    :placeholder="options.placeholder"
                    class="form-control"
                    :style="{
                      'text-transform': options.inputOptions.uppercase
                        ? 'uppercase'
                        : ''
                    }"
                  />
                </div>

                <div class="basic-list-group" :class="options.resizeBox">
                  <ul
                    class="list-group"
                    :style="{ height: options.height || '' }"
                  >
                    <li
                      v-for="f in filtering"
                      :key="f.id"
                      class="list-group-item"
                      @click="transferToRight(options.items.indexOf(f))"
                    >
                      <a :style="{ color: options.colorItems || '#1E90FF' }">
                        {{ f.name }}&nbsp;&rArr;</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-md-2 dual-box"
            :style="{ height: options.height + 20 || '' }"
          >
            <div class="control-buttons">
              <div class="mb-3">
                <button
                  class="btn btn-rounded btn-block"
                  @click="transferToRight(options.items.indexOf(item))"
                >
                  {{ options.buttonOption.textLeft }}
                  <i class="ml-auto mdi mdi-arrow-right-bold-circle"></i>
                </button>
              </div>
              <div>
                <button
                  class="btn btn-rounded btn-block"
                  @click="transferToLeft(-1)"
                >
                  <i class="mr-auto mdi mdi-arrow-left-bold-circle"></i>
                  {{ options.buttonOption.textRight }}
                </button>
              </div>
            </div>
          </div>
          <div
            class="col-md-5 dual-box"
            :style="{ height: options.height + 20 || '' }"
          >
            <div class="card dual-card">
              <div class="card-body">
                <div
                  v-if="options.inputOptions.isRequired"
                  style="margin-bottom: 0px"
                >
                  <input
                    v-model="search2"
                    :placeholder="options.placeholder"
                    class="form-control"
                    required
                    :style="{
                      'text-transform': options.inputOptions.uppercase
                        ? 'uppercase'
                        : ''
                    }"
                  />
                </div>

                <div
                  v-if="!options.inputOptions.isRequired"
                  style="margin-bottom: 0px"
                >
                  <label for="filter">{{ options.label }}</label>
                  <input
                    v-model="search2"
                    :placeholder="options.placeholder"
                    class="form-control"
                    :style="{
                      'text-transform': options.inputOptions.uppercase
                        ? 'uppercase'
                        : ''
                    }"
                  />
                </div>

                <div class="basic-list-group" :class="options.resizeBox">
                  <ul
                    class="list-group"
                    :style="{ height: options.height || '' }"
                  >
                    <li
                      v-for="item2 in filtering2"
                      :key="item2.name"
                      class="list-group-item"
                      @click="
                        transferToLeft(options.selectedItems.indexOf(item2))
                      "
                    >
                      <a :style="{ color: options.colorItems || '#1E90FF' }">
                        &lArr;&nbsp;{{ item2.name }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css">
.dual-list {
  width: 100%;
}

.list-group {
  overflow: auto;
}

.btn-full-width {
  /* width: 100%; */
  margin: 5px;
}

.list-group-item {
  cursor: pointer;
}
.control-buttons {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.dual-card {
  -webkit-box-shadow: 2px 2px 2px 4px #ccc; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 2px 2px 2px 4px #ccc; /* Firefox 3.5 - 3.6 */
  box-shadow: 2px 2px 2px 4px #ccc; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
</style>

<script>
import { EventBus } from "@/utils/EventBus";
export default {
  name: "LnvDualList",
  props: {
    options: {
      type: Object,
      required: true,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    filtering: function() {
      if (this.search) {
        return this.options.items.filter(item => {
          return item.name.toLowerCase().indexOf(this.search) !== -1;
        });
      }
      return this.options.items;
    },
    filtering2: function() {
      if (this.search2) {
        return this.options.selectedItems.filter(item2 => {
          return item2.name.toLowerCase().indexOf(this.search2) !== -1;
        });
      }
      return this.options.selectedItems;
    }
  },
  data: function() {
    return {
      search: "",
      search2: "",
      item: {}
    };
  },
  methods: {
    transferToRight: function(index) {
      this.search = "";
      this.search2 = "";
      if (index >= 0) {
        this.options.selectedItems.push(this.options.items[index]);
        this.options.items.splice(index, 1);
      } else {
        for (var cont = 0; cont < this.options.items.length; cont++) {
          this.options.selectedItems.push(this.options.items[cont]);
        }
        this.options.items.splice(0, this.options.items.length);
      }
    },
    transferToLeft: function(index) {
      this.search = "";
      this.search2 = "";
      if (index >= 0) {
        this.options.items.push(this.options.selectedItems[index]);
        this.options.selectedItems.splice(index, 1);
        return;
      }
      for (var cont = 0; cont < this.options.selectedItems.length; cont++) {
        this.options.items.push(this.options.selectedItems[cont]);
      }
      this.options.selectedItems.splice(0, this.options.selectedItems.length);
    },
    resetData: function() {
      // this.options.selectedItems = [];
      this.transferToLeft(-1);
    },
    loadMethods: function() {
      // console.log(this.options);
      // if (this.options.reset) {
      //   this.options.selectedItems = [];
      // }
    }
  },
  mounted() {
    this.loadMethods();
  },
  created() {
    EventBus.$on("reset-data", this.resetData);
  }
};
</script>
