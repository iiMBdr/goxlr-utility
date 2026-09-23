<template>
  <div class="page-container">
    <div class="mixer-layout">
      <!-- Channel Strips Area -->
      <div class="channels-grid">
        <div
          v-for="ch in channels"
          :key="ch.id"
          class="channel-strip"
        >
          <div class="channel-header">
            <component :is="ch.icon" class="channel-icon" :size="18" />
            <span class="channel-name">{{ ch.name }}</span>
          </div>

          <div class="fader-meter-row">
            <AudioMeter :level="getChannelLevel(ch.id)" :segments="22" />
            <VerticalSlider
              :model-value="getChannelVolume(ch.id)"
              @update:model-value="val => setChannelVolume(ch.id, val)"
            />
          </div>

          <div class="db-readout">
            {{ formatDb(getChannelVolume(ch.id)) }}
          </div>

          <div class="channel-controls">
            <Button
              size="small"
              :variant="isChannelMuted(ch.id) ? 'danger' : 'secondary'"
              :icon="VolumeX"
              @click="toggleChannelMute(ch.id)"
            >
              {{ isChannelMuted(ch.id) ? 'MUTED' : 'MUTE' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Submix / Mix To & Output Section -->
      <div class="mix-to-section">
        <Card title="MIX TO & OUTPUTS" :icon="Sliders">
          <div class="mix-outputs-grid">
            <div class="output-card">
              <span class="output-label">Headphones</span>
              <div class="output-meter-wrapper">
                <AudioMeter :level="70" direction="horizontal" :segments="20" />
              </div>
            </div>
            <div class="output-card">
              <span class="output-label">Stream Mix</span>
              <div class="output-meter-wrapper">
                <AudioMeter :level="65" direction="horizontal" :segments="20" />
              </div>
            </div>
            <div class="output-card">
              <span class="output-label">Line Out</span>
              <div class="output-meter-wrapper">
                <AudioMeter :level="40" direction="horizontal" :segments="20" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic, MessageSquare, Music, Monitor, Gamepad2, Disc, VolumeX, Sliders } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import VerticalSlider from '../components/ui/VerticalSlider.vue'
import AudioMeter from '../components/ui/AudioMeter.vue'

const props = defineProps<{
  mixerLevels: any
  faderStatus: any
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
}>()

const channels = [
  { id: 'Mic', name: 'Mic', icon: Mic },
  { id: 'Chat', name: 'Chat', icon: MessageSquare },
  { id: 'Music', name: 'Music', icon: Music },
  { id: 'System', name: 'System', icon: Monitor },
  { id: 'Game', name: 'Game', icon: Gamepad2 },
  { id: 'Sample', name: 'Sample', icon: Disc },
]

function getChannelVolume(channel: string): number {
  return props.mixerLevels?.volumes?.[channel] ?? 255
}

function setChannelVolume(channel: string, val: number) {
  emit('command', ['SetVolume', [channel, val]])
}

function getChannelLevel(channel: string): number {
  const vol = getChannelVolume(channel)
  return Math.round((vol / 255) * 80)
}

function formatDb(vol: number): string {
  if (vol === 0) return '-∞ dB'
  const db = Math.round((vol / 255) * 24 - 12)
  return `${db > 0 ? '+' : ''}${db} dB`
}

function isChannelMuted(channel: string): boolean {
  for (const faderName in props.faderStatus) {
    const fader = props.faderStatus[faderName]
    if (fader.channel === channel && fader.mute_state !== 'Unmuted') {
      return true
    }
  }
  return false
}

function toggleChannelMute(channel: string) {
  for (const faderName in props.faderStatus) {
    const fader = props.faderStatus[faderName]
    if (fader.channel === channel) {
      const newState = fader.mute_state === 'Unmuted' ? 'MutedToAll' : 'Unmuted'
      emit('command', ['SetFaderMuteState', [faderName, newState]])
      return
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.mixer-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-16);
}

.channel-strip {
  background: var(--surface-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: var(--space-16);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
  transition: border-color var(--transition-fast);
}

.channel-strip:hover {
  border-color: var(--border-strong);
}

.channel-header {
  display: flex;
  align-items: center;
  gap: var(--space-6, 6px);
}

.channel-icon {
  color: var(--accent);
}

.channel-name {
  font-weight: 600;
  font-size: var(--font-size-body);
  color: var(--text-primary);
}

.fader-meter-row {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  height: 220px;
}

.db-readout {
  font-family: monospace;
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
  background: var(--surface-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.channel-controls {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mix-to-section {
  width: 100%;
}

.mix-outputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-16);
}

.output-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 6px);
  background: var(--surface-secondary);
  padding: var(--space-12);
  border-radius: var(--radius-control);
  border: 1px solid var(--border);
}

.output-label {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
  font-weight: 500;
}

.output-meter-wrapper {
  padding: 4px;
  background: var(--surface-raised);
  border-radius: 4px;
}
</style>
