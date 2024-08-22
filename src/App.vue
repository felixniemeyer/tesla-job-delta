<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { Status } from './status'

interface Snapshot {
  id: number
  timestamp: number
}

const history = ref<Snapshot[]>([])

const fromState = ref<Status>()
const toState = ref<Status>()

onMounted(() => {
  fetch('states/meta.json')
    .then(response => response.text())
    .then(async text => {
      // parse line by line (id, timestamp)
      const meta = text.split('\n').filter(line => line).map(line => {
        const [id, timestamp] = line.split(',')
        return { id: parseInt(id), timestamp: parseInt(timestamp) }
      }) as Snapshot[]

      if(meta.length > 1) {
        // try to load previous state from local storage
        let snapshotFrom  
        const prev = localStorage.getItem('lastConsumedSnapshotId')
        if (prev) {
          snapshotFrom = parseInt(prev)
        } else {
          snapshotFrom = meta[0].id
        }
        console.log(snapshotFrom)

        const snapshotTo: number = meta[meta.length - 1].id; 

        [fromState.value, toState.value] = await Promise.all([
          fetch(`states/${snapshotFrom}.json`)
            .then(response => response.json())
            .then(data => {
              return data
            }),
          fetch(`states/${snapshotTo}.json`)
            .then(response => response.json())
            .then(data => {
              return data
            })
        ])
      }
    })
})

</script>

<template>
  <p> 
    comparing { toTimestamp } to { fromTimestamp }
  </p>
  <p> {{ history }} </p>
  <div v-if="fromState && toState">
    delta
  </div>
  <button>thanks, I'm up to date</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
