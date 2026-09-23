<template>
  <div class="app-layout">
    <TitleBar
      :current-profile="activeProfileName"
      @minimize="onMinimize"
      @maximize="onMaximize"
      @close="onClose"
    />

    <div class="main-body">
      <ProfileSidebar
        :profiles="profileList"
        :active-profile="activeProfileName"
        @select-profile="loadProfile"
        @new-profile="createNewProfile"
        @save-profile="saveProfile"
        @duplicate-profile="duplicateProfile"
        @export-profile="exportProfile"
        @delete-profile="deleteProfile"
        @open-settings="activeTab = 'system'"
      />

      <div class="content-area">
        <TopNav v-model="activeTab" />

        <DeviceHeader
          :device-type="hardwareStatus?.device_type"
          :serial-number="activeSerial"
          :firmware-version="hardwareStatus?.versions?.firmware"
          :connected="isConnected"
        />

        <main class="page-viewport">
          <MicPage
            v-if="activeTab === 'mic'"
            :mic-status="mixerStatus?.mic_status"
            :mic-profiles="status?.files?.mic_profiles || []"
            :current-mic-profile="mixerStatus?.mic_profile_name || ''"
            :deess-value="mixerStatus?.levels?.deess || 0"
            :mic-level="micLevel"
            :device-type="hardwareStatus?.device_type"
            @command="handleCommand"
            @load-mic-profile="loadMicProfile"
            @save-mic-profile="saveMicProfile"
            @duplicate-mic-profile="duplicateMicProfile"
            @export-mic-profile="exportMicProfile"
            @delete-mic-profile="deleteMicProfile"
          />

          <MixerPage
            v-else-if="activeTab === 'mixer'"
            :mixer-levels="mixerStatus?.levels"
            :fader-status="mixerStatus?.fader_status"
            @command="handleCommand"
          />

          <ConfigurePage
            v-else-if="activeTab === 'configure'"
            :settings="mixerStatus?.settings"
            :fader-status="mixerStatus?.fader_status"
            @command="handleCommand"
          />

          <LightingPage
            v-else-if="activeTab === 'lighting'"
            :lighting-status="mixerStatus?.lighting"
            @command="handleCommand"
          />

          <RoutingPage
            v-else-if="activeTab === 'routing'"
            :router-map="mixerStatus?.router"
            @command="handleCommand"
          />

          <SystemPage
            v-else-if="activeTab === 'system'"
            :status="status"
            :serial="activeSerial"
            @command="handleDaemonCommand"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TitleBar from './components/layout/TitleBar.vue'
import ProfileSidebar from './components/layout/ProfileSidebar.vue'
import TopNav from './components/layout/TopNav.vue'
import type { TabId } from './components/layout/TopNav.vue'
import DeviceHeader from './components/layout/DeviceHeader.vue'

import MicPage from './pages/MicPage.vue'
import MixerPage from './pages/MixerPage.vue'
import ConfigurePage from './pages/ConfigurePage.vue'
import LightingPage from './pages/LightingPage.vue'
import RoutingPage from './pages/RoutingPage.vue'
import SystemPage from './pages/SystemPage.vue'

import { wsClient } from './services/websocket'

const status = ref<any>(null)
const activeTab = ref<TabId>('mixer')
const isConnected = ref(true)
const micLevel = ref(0)

let unsubscribeStatus: (() => void) | null = null
let unsubscribeMicLevel: (() => void) | null = null

onMounted(async () => {
  unsubscribeStatus = wsClient.subscribe((newStatus) => {
    status.value = newStatus
  })

  unsubscribeMicLevel = wsClient.subscribeMicLevel((level) => {
    micLevel.value = Math.min(100, Math.round(level * 100))
  })

  try {
    await wsClient.connect()
  } catch (err) {
    console.error('Failed to connect to WS:', err)
    isConnected.value = false
  }
})

onUnmounted(() => {
  if (unsubscribeStatus) unsubscribeStatus()
  if (unsubscribeMicLevel) unsubscribeMicLevel()
})

const activeSerial = computed<string>(() => {
  if (!status.value?.mixers) return ''
  const serials = Object.keys(status.value.mixers)
  return serials.length > 0 ? serials[0] : ''
})

const mixerStatus = computed(() => {
  if (!activeSerial.value) return null
  return status.value?.mixers?.[activeSerial.value] ?? null
})

const hardwareStatus = computed(() => {
  return mixerStatus.value?.hardware ?? null
})

const profileList = computed<string[]>(() => {
  return status.value?.files?.profiles || []
})

const activeProfileName = computed<string>(() => {
  return mixerStatus.value?.profile_name || 'Default'
})

function handleCommand(cmdTuple: any) {
  if (!activeSerial.value) return
  const [cmdName, args] = cmdTuple
  let commandObj: any = {}

  if (args === undefined) {
    commandObj[cmdName] = null
  } else if (Array.isArray(args)) {
    commandObj[cmdName] = args
  } else {
    commandObj[cmdName] = args
  }

  wsClient.sendCommand(activeSerial.value, commandObj).catch(err => {
    console.error('Command failed:', err)
  })
}

function handleDaemonCommand(cmdTuple: any) {
  const [cmdName, args] = cmdTuple
  let daemonReq: any = {}
  daemonReq[cmdName] = args !== undefined ? args : null

  wsClient.sendRequest({ Daemon: daemonReq }).catch(err => {
    console.error('Daemon request failed:', err)
  })
}

// Profile Actions
function loadProfile(name: string) {
  handleCommand(['LoadProfile', [name, true]])
}

function createNewProfile() {
  const name = prompt('Enter new profile name:')
  if (name) {
    handleCommand(['NewProfile', name])
  }
}

function saveProfile() {
  handleCommand(['SaveProfile'])
}

function duplicateProfile() {
  const name = prompt('Enter new duplicate profile name:')
  if (name) {
    handleCommand(['SaveProfileAs', name])
  }
}

function exportProfile() {
  handleDaemonCommand(['OpenPath', 'Profiles'])
}

function deleteProfile() {
  if (confirm(`Are you sure you want to delete profile "${activeProfileName.value}"?`)) {
    handleCommand(['DeleteProfile', activeProfileName.value])
  }
}

// Mic Profile Actions
function loadMicProfile(name: string) {
  handleCommand(['LoadMicProfile', [name, true]])
}

function saveMicProfile() {
  handleCommand(['SaveMicProfile'])
}

function duplicateMicProfile() {
  const name = prompt('Enter new mic profile name:')
  if (name) {
    handleCommand(['SaveMicProfileAs', name])
  }
}

function exportMicProfile() {
  handleDaemonCommand(['OpenPath', 'MicProfiles'])
}

function deleteMicProfile() {
  const current = mixerStatus.value?.mic_profile_name
  if (current && confirm(`Delete mic profile "${current}"?`)) {
    handleCommand(['DeleteMicProfile', current])
  }
}

// Window Controls
function onMinimize() {
  console.log('Minimize clicked')
}
function onMaximize() {
  console.log('Maximize clicked')
}
function onClose() {
  console.log('Close clicked')
}
</script>

<style>
@import './assets/styles/tokens.css';

.app-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-app);
}

.main-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-app);
}
</style>
