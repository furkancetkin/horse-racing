import { createStore } from 'vuex';
import { horses } from '../data';
import { RaceStatus } from '../enums';

export interface Horse {
  name: string;
  condition: number;
  color: string;
  speed?: number;
  traveledDistance?: number;
  run?: boolean;
  finish?: boolean;
  score?: number;
}

export interface Lap {
  lap: number;
  horses: Horse[];
}

interface State {
  horses: Horse[];
  laps: number[];
  program: Lap[];
  currentLapIndex: number;
  programResult: Lap[];
  raceStatus: RaceStatus;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateSpeed(condition: number): number {
  const baseSpeed = getRandomInt(20, 40);
  const speedFactor = condition / 10;
  return baseSpeed * speedFactor;
}

export default createStore<State>({
  state: {
    horses,
    laps: [1200, 1400, 1600, 1800, 2000, 2200],
    program: [],
    currentLapIndex: 0,
    programResult: [],
    raceStatus: RaceStatus.Ready,
  },
  getters: {
    getHorses: (state): Horse[] => state.horses,
    getProgram: (state): Lap[] => state.program,
    getProgramResult: (state): any[] => state.programResult,
    getCurrentLapIndex: (state): number => state.currentLapIndex,
    getRaceStatus: (state): RaceStatus => state.raceStatus,
  },
  mutations: {
    generateProgram(state) {
      function getRandomHorses(horsesArray: Horse[], num: number): Horse[] {
        const shuffled = horsesArray.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
      }

      state.program = state.laps.map((lap) => ({
        lap,
        horses: getRandomHorses(state.horses, 10),
      }));
    },
    updateProgramResult(state, result) {
      state.programResult.push(result);
    },
    updateHorsePosition(state, { horseIndex, distance }) {
      state.program[state.currentLapIndex].horses[horseIndex].traveledDistance = distance;
    },
    incrementLap(state) {
      state.currentLapIndex += 1;
    },
  },
  actions: {
    generateProgram({ commit }) {
      commit('generateProgram');
    },
    async startRace({ state, commit }) {
      state.raceStatus = RaceStatus.Running;
      for (let lapIndex = 0; lapIndex < state.program.length; lapIndex += 1) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        state.currentLapIndex = lapIndex;
        const currentLap = state.program[lapIndex];
        const lapDistance = currentLap.lap;
        const { horses: lapHorses } = currentLap;

        for (let i = 0; i < lapHorses.length; i += 1) {
          lapHorses[i].traveledDistance = 0;
          lapHorses[i].finish = false;
        }

        const results: Horse[] = [];
        while (lapHorses.some((horse) => !horse.finish)) {
          lapHorses.forEach((horse, horseIndex) => {
            if (!horse.finish) {
              const newHorse = { ...horse };
              const speed = calculateSpeed(horse.condition);
              newHorse.traveledDistance = (newHorse.traveledDistance || 0) + speed;

              if (newHorse.traveledDistance >= lapDistance) {
                newHorse.finish = true;
                newHorse.traveledDistance = lapDistance;
                results.push(horse);
              }

              lapHorses[horseIndex] = newHorse;

              commit('updateHorsePosition', {
                horseIndex,
                distance: newHorse.traveledDistance,
              });
            }
          });
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }

        const lapResult = results.map((horse, index) => ({
          name: horse.name,
          position: index + 1,
        }));

        commit('updateProgramResult', {
          subTitle: `${lapIndex + 1}ST Lap - ${lapDistance}m`,
          columns: [
            { title: 'Position', key: 'position' },
            { title: 'Name', key: 'name' },
          ],
          data: lapResult,
        });

        commit('incrementLap');
      }
      state.raceStatus = RaceStatus.Finished;
    },
  },
  modules: {},
});
