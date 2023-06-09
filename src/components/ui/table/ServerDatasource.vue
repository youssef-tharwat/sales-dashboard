<script>
import DatasourceUtils from "@/utils/DatasourceUtils";
import Pagination from "./Pagination";
import { EventBus } from "@/utils/EventBus";
import SvgIcon from "./SvgIcon";
export default {
  name: "ServerDatasource",
  components: { Pagination, SvgIcon },
  props: {
    /**
     * Table source data
     * @type {Array}
     */
    source: {
      type: Array,
      required: true
    },
    /**
     * Total of items
     * @type {Number}
     */
    total: {
      type: Number,
      required: true
    },
    /**
     * Limits to display
     * @type {Array}
     */
    limits: {
      type: Array,
      default() {
        return [10, 25, 50, 100, 200];
      }
    },
    /**
     * Translation to display
     * @type {Object}
     */
    translation: {
      type: Object,
      default() {
        return {
          limit: "Limit",
          search: "Search",
          placeholder_search: "Type to search..",
          records_not_found: "No records found",
          pagination: {
            show: "Showing",
            to: "to",
            of: "of",
            entries: "entries"
          }
        };
      }
    },
    /**
     * Columns to display
     * @type {Array}
     */
    columns: {
      type: Array,
      required: true
    },
    /**
     * Action buttons
     * @type {Array}
     */
    actions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    limitOptions() {
      return this.limits.map(limit => {
        return (
          <option
            value={limit}
            selected={parseInt(this.perpage) === parseInt(limit)}
          >
            {limit}
          </option>
        );
      });
    },
    columnItems() {
      let showArrows = key => {
        if (this.columnSortSelected.key) {
          return this.shouldShowUpArrow(key) ? (
            <span class="icon-asc">
              <SvgIcon />
            </span>
          ) : (
            <span class="icon-desc">
              <SvgIcon />
            </span>
          );
        } else {
          return (
            <span class="icon-desc">
              <SvgIcon />
            </span>
          );
        }
      };

      return this.columns.map(column => {
        if (column.order) {
          return (
            <th
              class="vue-server-ordering"
              on-click={e => this.sortColumn(e, column.key)}
            >
              {column.name}
              <span class="vue-server-arrows">{showArrows(column.key)}</span>
            </th>
          );
        } else {
          return <th>{column.name}</th>;
        }
      });
    },
    columnObjects() {
      if (this.source.length === 0) {
        return (
          <tr class="text-center">
            <td colspan={this.columns.length}>
              {this.translation.records_not_found}
            </td>
          </tr>
        );
      } else {
        return this.source.map((row, index) => {
          let columns = this.columns.map(column => {
            return (
              <td>{this.fetchFromObject(row, column.key, column.render)}</td>
            );
          });
          return (
            <tr
              class={{ success: index === this.indexSelected }}
              on-click={e => this.selectRow(e, row, index)}
            >
              {columns}
            </tr>
          );
        });
      }
    },
    actionsObject() {
      return this.actions.map(action => {
        try {
          if (action.show(this.selected)) {
            return (
              <button
                class={this.dynamicClass("btn", action.class)}
                type="button"
                on-click={e => action.event(e, this.selected)}
              >
                <i class={this.dynamicClass("pr1", action.icon)}></i>
                {action.text}
              </button>
            );
          }
        } catch (ex) {
          console.warn(
            `[VueDatasource] The callback show is not defined in action ${action.text}.`
          );
        }
      });
    }
  },
  data() {
    return {
      perpage: 10,
      current_page: 1,
      selected: null, // row and Object selected on click event
      indexSelected: -1, // index row selected on click event
      search: "", // word to search in the table,
      columnSortSelected: {
        // Object to set a column sort data
        key: null,
        order: true
      }
    };
  },
  watch: {
    /**
     * Handle show limit changed.
     * @return {void}
     */
    perpage() {
      this.selected = null;
      this.indexSelected = -1;
      this.current_page = 1;
      this.$emit("change", { perpage: this.perpage, page: 1 });
    },
    source() {
      this.selected = null;
      this.indexSelected = -1;
    }
  },
  methods: {
    fetchFromObject: DatasourceUtils.fetchFromObject,
    changePage: DatasourceUtils.changePage,
    selectRow: DatasourceUtils.selectRow,
    dynamicClass(defaultClass, customClass) {
      return `${defaultClass} ${customClass}`;
    },
    sync(prop, value) {
      this[prop] = value;
    },
    searching(e) {
      this.selected = null;
      this.indexSelected = -1;
      this.current_page = 1;
      this.$emit("searching", e.target.value);
    },
    sortColumn: DatasourceUtils.sortColumn,
    shouldShowUpArrow: DatasourceUtils.shouldShowUpArrow,
    shouldShowDownArrow: DatasourceUtils.shouldShowDownArrow
  },
  created() {
    EventBus.$on("pagination-change", this.changePage);
  },
  render() {
    return (
      <div class="vue-server-datasource">
        <div class="row filter-row">
          <div class="col-md-6">
            <select
              on-change={e => this.sync("perpage", parseInt(e.target.value))}
              class="form-control limit-box"
              number
            >
              {this.limitOptions}
            </select>
          </div>
          <div class="col-md-6">
            <input
              class="form-control mr1"
              type="text"
              on-input={e => this.searching(e)}
              placeholder={this.translation.placeholder_search}
            />
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>{this.columnItems}</tr>
            </thead>
            <tbody>{this.columnObjects}</tbody>
          </table>
        </div>
        <div class="panel-footer">
          <div class="pull-left btn-group btn-group-actions">
            {this.actionsObject}
          </div>
          <div class="pull-right">
            <pagination total={this.total} per-page={this.perpage}></pagination>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.vue-server-datasource {
  .panel-body {
    position: relative;
    padding: 0;
  }
  .vue-server-arrows {
    position: absolute;
    right: 5px;
    top: 6px;
  }

  .filter-row {
    margin-bottom: 5px;
  }
  .limit-box {
    width: 10%;
    height: 100%;
  }
  table {
    margin-bottom: 0;
    th {
      position: relative;

      &.vue-server-ordering {
        cursor: pointer;

        .vue-server-arrows {
          img {
            opacity: 0.3;
            &.arrow-active {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  .panel-footer {
    .btn-group-actions {
      margin: 10px 0;
    }
  }
  .vue-spinner-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(229, 229, 229, 0.5);

    .v-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -25px;
      margin-top: -50px;
    }
  }
  .icon-asc,
  .icon-desc {
    svg {
      fill: #a3a3a3;
      width: 1em;
    }
  }
  .icon-asc {
    svg {
      transform: rotate(180deg);
    }
  }
}

.pr1 {
  padding-right: 5px;
}
.pr2 {
  padding-right: 10px;
}
.mr1 {
  margin-right: 5px;
  width: 50%;
  float: right;
}
</style>
