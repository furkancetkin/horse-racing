<template>
  <div class="hippodrome">
    <div class="line"
         v-for="(horse, index) in currentHorses"
         :key="index"
         :class="{ 'last-line': index === 9 }">
      <div class="lineBox"><span>{{ index + 1 }}</span></div>
      <div class="lineField">
        <img src="../assets/horse.gif"
        alt="horse"
        :style="{ left: horse.traveledDistancePercentage + '%' }"
        />
      </div>
    </div>
    <div class="bottom" v-if="currentLapDistance">
      <p>{{ (getCurrentLapIndex + 1) + '.st Lap ' + currentLapDistance }}m</p>
      <span>FINISH</span>
    </div>
    <div v-else>
    <p>Race has been finished</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Racing',
  setup() {
    const store = useStore();
    const getProgram = computed(() => store.getters.getProgram);
    const getCurrentLapIndex = computed(() => store.getters.getCurrentLapIndex);

    const currentLap = computed(() => getProgram.value[getCurrentLapIndex.value]);
    const currentHorses = computed(() => {
      if (!currentLap.value) return [];
      const lapDistance = currentLap.value.lap;
      return currentLap.value.horses.map((horse: any) => ({
        ...horse,
        traveledDistancePercentage: ((horse.traveledDistance || 0) / lapDistance) * 100,
      }));
    });
    const currentLapDistance = computed(() => currentLap.value?.lap || 0);

    return {
      currentHorses,
      currentLapDistance,
      getCurrentLapIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.hippodrome {
  width: 100%;
  margin: 30px 80px 0 80px;
}

.line {
  display: flex;
  border-right: 4px solid red;
}

.lineField {
  border-top: 2px dashed black;
  width: 100%;
  position: relative;
}

.last-line .lineField {
  border-bottom: 2px dashed black;
}

img {
  width: 100px;
  position: absolute;
  left: 0;
  transition: all 1s linear;
}

.lineBox {
  border: 1px solid #fff;
  color: #fff;
  background-color: green;
  width: 50px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lineBox span {
  transform: rotate(-90deg);
  font-weight: bold;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  position: relative;
  margin-top: 14px;
}

.bottom p,
span {
  font-weight: bold;
  font-size: 17px;
}

.bottom span {
  position: absolute;
  right: -30px;
  top: 0;
}
</style>
