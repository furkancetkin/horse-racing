<template>
  <div class="home">
    <Header></Header>
    <div class="center">
      <MultiTables
        :title="horseListTitle"
        color="yellow"
        :tables="horseTables"
      ></MultiTables>
      <Racing></Racing>
      <MultiTables title="Program" color="#548ede" :tables="programTables"></MultiTables>
      <MultiTables
        title="Results"
        color="#79c982"
        :tables="getProgramResult"
      ></MultiTables>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Racing from '@/components/Racing.vue';
import MultiTables from '@/components/MultiTables.vue';
import { mapGetters, mapActions } from 'vuex';
import { Horse, Lap } from '../store/index';

export default defineComponent({
  name: 'HomeView',
  components: {
    Header,
    Racing,
    MultiTables,
  },
  computed: {
    ...mapGetters(['getHorses', 'getProgram', 'getProgramResult']),
    horseColumns() {
      return [
        { title: 'Name', key: 'name' },
        { title: 'Condition', key: 'condition' },
        { title: 'Color', key: 'color' },
      ];
    },
    raceColumns() {
      return [
        { title: 'Position', key: 'position' },
        { title: 'Name', key: 'name' },
      ];
    },
    horses(): Horse[] {
      return this.getHorses as Horse[];
    },
    horseTables() {
      return [
        {
          columns: this.horseColumns,
          data: this.horses,
        },
      ];
    },
    programTables() {
      const program = this.getProgram as unknown as Lap[];
      return program.map((lap, i) => ({
        subTitle: `${i + 1}ST Lap - ${lap.lap}m`,
        columns: this.raceColumns,
        data: lap.horses.map((horse: Horse, index: number) => ({
          ...horse,
          position: index + 1,
        })),
      }));
    },
    horseListTitle() {
      const horseCount = this.horses.length;
      return `Horse List (1-${horseCount})`;
    },
  },
  created() {
    this.generateProgram();
  },
  methods: {
    ...mapActions(['generateProgram']),
  },
});
</script>

<style lang="scss" scoped>
.home {
  background-color: #c2c2c2;
  min-height: 100vh;
}

.center {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.multiTables {
  width: 15%;
}

.multiTables h2 {
  border: 1px solid black;
  margin-bottom: 0;
}
</style>
