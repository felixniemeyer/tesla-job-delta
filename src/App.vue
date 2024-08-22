<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { Status } from './status'

import Delta from './components/Delta.vue'

const fromState = ref<Status>()
const toState = ref<Status>()

const fromTimestamp = ref<string>()
const toTimestamp = ref<string>()

onMounted(() => {
  loadDelta()
})

function loadDelta() {
  const stateJson = localStorage.getItem('state')
  const stateTimestamp = localStorage.getItem('stateTimestamp')
  const prevStateJson = localStorage.getItem('prevState')
  const prevStateTimestamp = localStorage.getItem('prevStateTimestamp')

  if(stateJson && stateTimestamp && prevStateJson && prevStateTimestamp) {

    fromTimestamp.value = new Date(parseInt(prevStateTimestamp)).toString()
    toTimestamp.value = new Date(parseInt(stateTimestamp)).toString()

    fromState.value = JSON.parse(prevStateJson)
    toState.value = JSON.parse(stateJson)

    console.log('done running loadDelta')
  }
}

const statusInput = ref<HTMLInputElement>()
const error = ref<string>()

function setNewStatus() {
  if(statusInput.value) {
    const json = statusInput.value.value
    if(json !== "") {
      try {
        JSON.parse(statusInput.value.value)
        const previousState = localStorage.getItem('state')
        const previousStateTimestamp = localStorage.getItem('stateTimestamp')
        const timestamp = Date.now()
        if(previousState && previousStateTimestamp) {
          localStorage.setItem('state', json)
          localStorage.setItem('stateTimestamp', timestamp.toString())
          localStorage.setItem('prevState', previousState)
          localStorage.setItem('prevStateTimestamp', previousStateTimestamp.toString())
        } else {
          localStorage.setItem('state', json)
          localStorage.setItem('stateTimestamp', timestamp.toString())
        }
        error.value = ""
        statusInput.value.value = ""
        loadDelta()
      } catch(e) {
        error.value = "failed to set new state: " + e
      }
    } else {
      error.value = "empty input"
    }
  }
}


</script>

<template>
  <h1>Tesla Job Delta</h1>
  
  <p> 
  Showing change of tesla job set from <br/> {{ fromTimestamp }} to <br/> {{ toTimestamp }}

  </p>
  <p>
    follow these manual steps: 
    <ol>
      <li>go to <a target="_blank" href="https://www.tesla.com/cua-api/apps/careers/state">https://www.tesla.com/cua-api/apps/careers/state</a></li>
      <li>copy the json response to your clipboard</li>
      <li>paste the json in the following input field and submit</li>
    </ol>
  </p>
  <p class=inputs>
    <input type="text" accept=".json" ref="statusInput" />
    <button @click="setNewStatus">set current state</button>
    <span class=error>{{ error }}</span>
  </p>
  <div v-if="fromState && toState" class=list>
    <Delta :from="fromState" :to="toState" />
  </div>
  <p>
    Browse jobs on the official site: <a href="https://www.tesla.com/careers/search">Tesla Careers</a>
  </p>
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
.error {
  color: #faa;
}
.inputs * {
  margin: 0.5em;
}


</style>
