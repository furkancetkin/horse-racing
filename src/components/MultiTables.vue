<template>
  <div class="tables">
    <h2 v-if="title" :style="{ backgroundColor: color }">{{ title }}</h2>
    <div class="table">
      <div v-for="(table, index) in tables" :key="index">
        <h5 v-if="table.subTitle">{{ table.subTitle }}</h5>
        <table>
          <thead>
            <tr>
              <th v-for="column in table.columns" :key="column.key">{{ column.title }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in table.data" :key="row.name">
              <td v-for="column in table.columns" :key="column.key">{{ row[column.key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MultiTables',
  props: {
    title: String,
    tables: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: 'yellow',
    },
  },
});
</script>

<style lang="scss" scoped>
.tables {
  width: 15%;
}

.table {
  max-height: 70vh;
  overflow: auto;
}

.table th {
  background-color: #c2c2c2;
}

.table td {
  background-color: #fff;
}

h2 {
  border: 1px solid black;
  margin-bottom: 0;
}

h5 {
  margin: 0;
  padding: 2px 0;
  background-color: salmon;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
