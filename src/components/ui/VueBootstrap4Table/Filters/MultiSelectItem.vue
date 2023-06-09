<template>
  <div>
    <a class="dropdown-item" href="" @click.prevent="handleSelect()">
      <div v-if="isSingleMode" class="custom-control custom-radio">
        <input
          v-model="selected_value"
          type="radio"
          class="custom-control-input"
          :value="option.value"
        />
        <label class="custom-control-label">{{ option.name }}</label>
      </div>
      <div v-else class="custom-control custom-checkbox">
        <input
          v-model="option_selected"
          type="checkbox"
          class="custom-control-input vbt-checkbox"
        />
        <label class="custom-control-label">{{ option.name }}</label>
      </div>
    </a>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import includes from "lodash/includes";

export default {
  name: "MultiSelectItem",
  props: {
    column: {
      type: Object,
      default: function() {
        return {};
      }
    },
    option: {
      type: Object,
      default: function() {
        return {
          name: "option one",
          value: "option one"
        };
      }
    },
    index: {
      type: Number,
      default: 0
    },
    isSingleMode: {
      type: Boolean,
      default: true
    },
    isAllOptionsSelected: {
      type: Boolean,
      default: false
    },
    selectedOptionIndexes: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: function() {
    return {
      option_selected: false,
      selected_value: ""
    };
  },
  watch: {
    selectedOptionIndexes: {
      handler: function(newVal) {
        let new_selected_option_indices = cloneDeep(newVal);
        this.option_selected = includes(
          new_selected_option_indices,
          this.index
        );
      },
      deep: true
    },
    option_selected(newVal) {
      if (newVal) {
        this.selected_value = this.option.value;
      } else {
        this.selected_value = "";
      }
    }
  },
  methods: {
    handleSelect() {
      if (this.option_selected) {
        this.$emit("on-deselect-option", this.index);
      } else {
        this.$emit("on-select-option", this.index);
      }
    }
  }
};
</script>
