<template>
  <div class="page-container">
    <div class="mic-grid">
      <!-- Mic Profiles Card -->
      <Card title="MIC PROFILES" :icon="Mic">
        <div class="profile-select-row">
          <Select
            v-model="selectedMicProfile"
            :options="micProfileOptions"
            @update:model-value="onMicProfileChange"
          />
        </div>
        <div class="button-group">
          <Button size="small" variant="secondary" :icon="Save" @click="$emit('save-mic-profile')">Save</Button>
          <Button size="small" variant="secondary" :icon="Copy" @click="$emit('duplicate-mic-profile')">Duplicate</Button>
          <Button size="small" variant="secondary" :icon="Download" @click="$emit('export-mic-profile')">Export</Button>
          <Button size="small" variant="danger" :icon="Trash2" @click="$emit('delete-mic-profile')">Delete</Button>
        </div>
      </Card>

      <!-- Mic Setup Card -->
      <Card title="MIC SETUP" :icon="Sliders">
        <div class="setting-item">
          <label class="setting-label">Microphone Type</label>
          <Select
            :model-value="micStatus?.mic_type || 'Dynamic'"
            :options="micTypeOptions"
            @update:model-value="val => $emit('command', ['SetMicrophoneType', val])"
          />
        </div>
        <div class="setting-item">
          <Slider
            label="Microphone Gain"
            :model-value="currentGain"
            :min="0"
            :max="72"
            unit=" dB"
            show-value
            @update:model-value="val => $emit('command', ['SetMicrophoneGain', [micStatus?.mic_type || 'Dynamic', val]])"
          />
        </div>
      </Card>

      <!-- Gate Card -->
      <Card title="GATE" :icon="Activity">
        <template #action>
          <Toggle
            :model-value="micStatus?.noise_gate?.enabled ?? true"
            @update:model-value="val => $emit('command', ['SetGateActive', val])"
          />
        </template>
        <Slider
          label="Threshold"
          :model-value="micStatus?.noise_gate?.threshold ?? -30"
          :min="-59"
          :max="0"
          unit=" dB"
          show-value
          @update:model-value="val => $emit('command', ['SetGateThreshold', val])"
        />
        <Slider
          label="Attenuation"
          :model-value="micStatus?.noise_gate?.attenuation ?? 100"
          :min="0"
          :max="100"
          unit="%"
          show-value
          @update:model-value="val => $emit('command', ['SetGateAttenuation', val])"
        />
        <div class="row-two-col">
          <div class="setting-item">
            <label class="setting-label">Attack</label>
            <Select
              :model-value="micStatus?.noise_gate?.attack || 'Ms10'"
              :options="gateTimeOptions"
              @update:model-value="val => $emit('command', ['SetGateAttack', val])"
            />
          </div>
          <div class="setting-item">
            <label class="setting-label">Release</label>
            <Select
              :model-value="micStatus?.noise_gate?.release || 'Ms100'"
              :options="gateTimeOptions"
              @update:model-value="val => $emit('command', ['SetGateRelease', val])"
            />
          </div>
        </div>
      </Card>

      <!-- Equalizer Card -->
      <Card title="EQUALIZER" :icon="BarChart2">
        <div v-if="isMini" class="eq-mini-grid">
          <Slider
            v-for="freq in miniEqFreqs"
            :key="freq"
            :label="freq.replace('Equalizer', '')"
            :model-value="getMiniEqGain(freq)"
            :min="-9"
            :max="9"
            unit=" dB"
            show-value
            @update:model-value="val => $emit('command', ['SetEqMiniGain', [freq, val]])"
          />
        </div>
        <div v-else class="eq-full-grid">
          <Slider
            v-for="freq in fullEqFreqs"
            :key="freq"
            :label="freq.replace('Equalizer', '')"
            :model-value="getFullEqGain(freq)"
            :min="-9"
            :max="9"
            unit=" dB"
            show-value
            @update:model-value="val => $emit('command', ['SetEqGain', [freq, val]])"
          />
        </div>
      </Card>

      <!-- Compressor Card -->
      <Card title="COMPRESSOR" :icon="Zap">
        <Slider
          label="Threshold"
          :model-value="micStatus?.compressor?.threshold ?? -12"
          :min="-24"
          :max="0"
          unit=" dB"
          show-value
          @update:model-value="val => $emit('command', ['SetCompressorThreshold', val])"
        />
        <div class="setting-item">
          <label class="setting-label">Ratio</label>
          <Select
            :model-value="micStatus?.compressor?.ratio || 'Ratio3_2'"
            :options="ratioOptions"
            @update:model-value="val => $emit('command', ['SetCompressorRatio', val])"
          />
        </div>
        <div class="row-two-col">
          <div class="setting-item">
            <label class="setting-label">Attack</label>
            <Select
              :model-value="micStatus?.compressor?.attack || 'Ms2'"
              :options="compressorAttackOptions"
              @update:model-value="val => $emit('command', ['SetCompressorAttack', val])"
            />
          </div>
          <div class="setting-item">
            <label class="setting-label">Release</label>
            <Select
              :model-value="micStatus?.compressor?.release || 'Ms140'"
              :options="compressorReleaseOptions"
              @update:model-value="val => $emit('command', ['SetCompressorReleaseTime', val])"
            />
          </div>
        </div>
        <Slider
          label="Makeup Gain"
          :model-value="micStatus?.compressor?.makeup_gain ?? 0"
          :min="0"
          :max="24"
          unit=" dB"
          show-value
          @update:model-value="val => $emit('command', ['SetCompressorMakeupGain', val])"
        />
      </Card>

      <!-- De-Esser & Noise Suppression -->
      <Card title="DE-ESSER & SUPPRESSION" :icon="VolumeX">
        <Slider
          label="De-Esser Amount"
          :model-value="deessValue ?? 0"
          :min="0"
          :max="100"
          unit="%"
          show-value
          @update:model-value="val => $emit('command', ['SetDeeser', val])"
        />
        <div class="meter-box">
          <span class="setting-label">LIVE MIC INPUT METER</span>
          <div class="meter-wrapper">
            <AudioMeter :level="micLevel ?? 0" direction="horizontal" :segments="24" />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Mic, Sliders, Activity, BarChart2, Zap, VolumeX, Save, Copy, Download, Trash2 } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Toggle from '../components/ui/Toggle.vue'
import Slider from '../components/ui/Slider.vue'
import Select from '../components/ui/Select.vue'
import AudioMeter from '../components/ui/AudioMeter.vue'

const props = defineProps<{
  micStatus?: any
  micProfiles?: string[]
  currentMicProfile?: string
  deessValue?: number
  micLevel?: number
  deviceType?: string
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
  (e: 'save-mic-profile'): void
  (e: 'duplicate-mic-profile'): void
  (e: 'export-mic-profile'): void
  (e: 'delete-mic-profile'): void
  (e: 'load-mic-profile', name: string): void
}>()

const selectedMicProfile = ref(props.currentMicProfile || '')

const micProfileOptions = computed(() => {
  return (props.micProfiles || []).map(p => ({ label: p, value: p }))
})

function onMicProfileChange(name: string | number) {
  emit('load-mic-profile', String(name))
}

const isMini = computed(() => {
  return props.deviceType ? props.deviceType.toLowerCase().includes('mini') : true
})

const currentGain = computed(() => {
  const type = props.micStatus?.mic_type || 'Dynamic'
  return props.micStatus?.mic_gains?.[type] ?? 36
})

const micTypeOptions = [
  { label: 'Dynamic (XLR)', value: 'Dynamic' },
  { label: 'Condenser (+48V)', value: 'Condenser' },
  { label: '3.5mm Jack', value: 'Jack' },
]

const gateTimeOptions = [
  { label: '10 ms', value: 'Ms10' },
  { label: '20 ms', value: 'Ms20' },
  { label: '50 ms', value: 'Ms50' },
  { label: '100 ms', value: 'Ms100' },
  { label: '200 ms', value: 'Ms200' },
  { label: '300 ms', value: 'Ms300' },
  { label: '400 ms', value: 'Ms400' },
]

const ratioOptions = [
  { label: '1:1', value: 'Ratio1_0' },
  { label: '1.2:1', value: 'Ratio1_2' },
  { label: '1.4:1', value: 'Ratio1_4' },
  { label: '1.6:1', value: 'Ratio1_6' },
  { label: '1.8:1', value: 'Ratio1_8' },
  { label: '2:1', value: 'Ratio2_0' },
  { label: '2.5:1', value: 'Ratio2_5' },
  { label: '3.2:1', value: 'Ratio3_2' },
  { label: '4:1', value: 'Ratio4_0' },
  { label: '5.6:1', value: 'Ratio5_6' },
  { label: '8:1', value: 'Ratio8_0' },
  { label: '16:1', value: 'Ratio16_0' },
  { label: '32:1', value: 'Ratio32_0' },
]

const compressorAttackOptions = [
  { label: '0 ms', value: 'Ms0' },
  { label: '2 ms', value: 'Ms2' },
  { label: '6 ms', value: 'Ms6' },
  { label: '14 ms', value: 'Ms14' },
  { label: '27 ms', value: 'Ms27' },
  { label: '45 ms', value: 'Ms45' },
  { label: '68 ms', value: 'Ms68' },
]

const compressorReleaseOptions = [
  { label: '15 ms', value: 'Ms15' },
  { label: '45 ms', value: 'Ms45' },
  { label: '70 ms', value: 'Ms70' },
  { label: '140 ms', value: 'Ms140' },
  { label: '240 ms', value: 'Ms240' },
  { label: '360 ms', value: 'Ms360' },
]

const miniEqFreqs = ['Equalizer90Hz', 'Equalizer250Hz', 'Equalizer500Hz', 'Equalizer1KHz', 'Equalizer3KHz', 'Equalizer8KHz']
const fullEqFreqs = ['Equalizer31Hz', 'Equalizer63Hz', 'Equalizer125Hz', 'Equalizer250Hz', 'Equalizer500Hz', 'Equalizer1KHz', 'Equalizer2KHz', 'Equalizer4KHz', 'Equalizer8KHz', 'Equalizer16KHz']

function getMiniEqGain(freq: string) {
  return props.micStatus?.equaliser_mini?.gain?.[freq] ?? 0
}

function getFullEqGain(freq: string) {
  return props.micStatus?.equaliser?.gain?.[freq] ?? 0
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.mic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-16);
}

.profile-select-row {
  margin-bottom: var(--space-8);
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.setting-label {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.row-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
}

.eq-mini-grid, .eq-full-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.meter-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  margin-top: var(--space-8);
}

.meter-wrapper {
  background: var(--surface-secondary);
  padding: 8px;
  border-radius: var(--radius-control);
  border: 1px solid var(--border);
}
</style>
