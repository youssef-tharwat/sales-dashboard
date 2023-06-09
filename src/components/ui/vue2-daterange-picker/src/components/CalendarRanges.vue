<template>
  <div class="ranges">
    <ul v-if="ranges">
      <li
        v-for="(value, key) in ranges"
        :key="key"
        :data-range-key="key"
        :class="range_class(value)"
        @click="$emit('clickRange', value)"
      >
        {{ key }}
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    ranges: {
      type: Object,
      default: () => {
        return {};
      }
    },
    selected: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    range_class(range) {
      return {
        active:
          moment(this.selected.startDate).isSame(range[0], "date") &&
          moment(this.selected.endDate).isSame(range[1], "date")
      };
    }
  }
};
</script>
