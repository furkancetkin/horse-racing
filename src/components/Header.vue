<template>
  <div class="header">
    <h3>Horse Racing</h3>
    <div class="buttons">
      <button @click="generateProgram">Generate Program</button>
      <button @click="startRace">Start</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'Header',
  methods: {
    ...mapActions(['generateProgram', 'startRace']),
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid black;
  background-color: salmon;
  padding: 0 30px;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.buttons button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid gray;
  cursor: pointer;
}
</style>
