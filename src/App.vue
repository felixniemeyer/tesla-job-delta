<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { Status } from './status'

import Delta from './components/Delta.vue'

interface Snapshot {
  id: number
  timestamp: number
}

const fromState = ref<Status>()
const toState = ref<Status>()

const fromSnapshot = ref<Snapshot>()
const toSnapshot = ref<Snapshot>()

const fromTimestamp = ref<string>()
const toTimestamp = ref<string>()

onMounted(() => {
  loadDelta()
})

function loadDelta() {
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
        const prev = localStorage.getItem('lastConsumedSnapshotId')
        let snapshotFrom
        if(prev) {
          snapshotFrom = meta.find(snapshot => snapshot.id === parseInt(prev))
        }
        if(!snapshotFrom) {
          snapshotFrom = meta[meta.length - 2]
        } 

        const snapshotTo: Snapshot = meta[meta.length - 1]

        fromSnapshot.value = snapshotFrom
        toSnapshot.value = snapshotTo

        fromTimestamp.value = new Date(snapshotFrom.timestamp).toString()
        toTimestamp.value = new Date(snapshotTo.timestamp).toString()

        ;[fromState.value, toState.value] = await Promise.all([
          fetch(`states/${snapshotFrom.id}.json`)
            .then(response => response.json())
            .then(data => {
              return data
            }),
          fetch(`states/${snapshotTo.id}.json`)
            .then(response => response.json())
            .then(data => {
              return data
            })
        ])
      }
    })
}

function clearDelta() {
  if(toSnapshot.value) {
    localStorage.setItem('lastConsumedSnapshotId', toSnapshot.value.id.toString())
  }
  loadDelta()
}

</script>

<template>
  <h1>Tesla Job Delta</h1>
  
  <p> 
  Showing change of tesla job set from <br/> {{ fromTimestamp }} to <br/> {{ toTimestamp }}

  </p>
  <p>
    Browse jobs on the official site: <a href="https://www.tesla.com/careers/search">Tesla Careers</a>
  </p>
  <div v-if="fromState && toState" class=list>
    <Delta :from="fromState" :to="toState" />
  </div>
  <button class=reset @click=clearDelta >clear delta</button>
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
.list {
  margin-bottom: 2em;
}

</style>
