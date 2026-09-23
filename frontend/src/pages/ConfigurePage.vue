<template>
  <div class="page-container">
    <div class="config-grid">
      <!-- Device Setup -->
      <Card title="DEVICE SETUP" :icon="Settings">
        <div class="setting-row">
          <span class="setting-label">Mute Hold Duration</span>
          <Slider
            :model-value="settings.mute_hold_duration || 500"
            :min="100"
            :max="2000"
            :step="50"
            unit=" ms"
            show-value
            @update:model-value="val => $emit('command', ['SetMuteHoldDuration', val])"
          />
        </div>
        <div class="setting-row">
          <Toggle
            label="Lock Faders in Place"
            :model-value="settings.lock_faders || false"
            @update:model-value="val => $emit('command', ['SetLockFaders', val])"
          />
        </div>
      </Card>

      <!-- Stream Mix Behavior -->
      <Card title="STREAM MIX BEHAVIOR" :icon="Sliders">
        <div class="setting-row">
          <Toggle
            label="VC Mute Also Mutes CM"
            :model-value="settings.vc_mute_also_mute_cm || false"
            @update:model-value="val => $emit('command', ['SetVCMuteAlsoMuteCM', val])"
          />
        </div>
        <div class="setting-row">
          <Toggle
            label="Monitor with FX Enabled"
            :model-value="settings.enable_monitor_with_fx || false"
            @update:model-value="val => $emit('command', ['SetMonitorWithFx', val])"
          />
        </div>
      </Card>

      <!-- Fader Assignments -->
      <Card title="FADER ASSIGNMENTS" :icon="Sliders">
        <div v-for="(fader, name) in faderStatus" :key="name" class="fader-assign-row">
          <span class="fader-name">{{ name }}</span>
          <Select
            :model-value="fader.channel"
            :options="channelOptions"
            @update:model-value="val => $emit('command', ['SetFader', [name, val]])"
          />
        </div>
      </Card>

      <!-- Setup & Help -->
      <Card title="SETUP & HELP" :icon="HelpCircle">
        <div class="button-stack">
          <Button variant="secondary" @click="openDocs">Open User Manual & Docs</Button>
          <Button variant="danger" @click="$emit('command', ['ReloadSettings'])">Reload Settings</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, Sliders, HelpCircle } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Toggle from '../components/ui/Toggle.vue'
import Slider from '../components/ui/Slider.vue'
import Select from '../components/ui/Select.vue'
import Button from '../components/ui/Button.vue'

const props = defineProps<{
  settings: any
  faderStatus: any
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
}>()

const channelOptions = [
  { label: 'Mic', value: 'Mic' },
  { label: 'Chat', value: 'Chat' },
  { label: 'Music', value: 'Music' },
  { label: 'System', value: 'System' },
  { label: 'Game', value: 'Game' },
  { label: 'Sample', value: 'Sample' },
  { label: 'Headphones', value: 'Headphones' },
  { label: 'Line In', value: 'LineIn' },
  { label: 'Line Out', value: 'LineOut' },
]

function openDocs() {
  window.open('https://github.com/GoXLR-on-Linux/goxlr-utility/wiki', '_blank')
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-16);
}

.setting-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.fader-assign-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-12);

  .fader-name {
    font-weight: 600;
    font-size: var(--font-size-body);
    text-transform: uppercase;
    color: var(--text-secondary);
    width: 60px;
  }
}

.button-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
</style>
