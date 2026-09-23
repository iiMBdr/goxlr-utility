<template>
  <div class="device-header">
    <div class="device-info">
      <div class="title-row">
        <h2 class="device-title">{{ deviceName }}</h2>
        <div class="status-badge" :class="{ 'status-badge--connected': isConnected }">
          <span class="status-dot" />
          <span>{{ isConnected ? 'Connected via USB' : 'Disconnected' }}</span>
        </div>
      </div>
      <div class="meta-row">
        <span v-if="firmware">Firmware {{ firmware }}</span>
        <span v-if="firmware && serial">•</span>
        <span v-if="serial">Serial {{ serial }}</span>
      </div>
    </div>

    <div class="device-tagline">
      <span class="tagline-primary">Legendary Audio for Creators</span>
      <span class="tagline-secondary">Control your audio. Own your sound.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  deviceType?: string
  serialNumber?: string
  firmwareVersion?: string
  connected?: boolean
}>()

const deviceName = computed(() => {
  if (!props.deviceType) return 'GOXLR MINI'
  if (props.deviceType.toLowerCase().includes('full')) return 'GOXLR'
  return 'GOXLR MINI'
})

const isConnected = computed(() => props.connected ?? true)
const firmware = computed(() => props.firmwareVersion || '1.2.3')
const serial = computed(() => props.serialNumber || 'A1B2C3D4E5F6')
</script>

<style scoped>
.device-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) var(--space-24);
  background: var(--surface-primary);
  border-bottom: 1px solid var(--border);
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.title-row {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.device-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--text-primary);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-secondary);
  color: var(--text-muted);
}

.status-badge--connected {
  color: var(--success);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.device-tagline {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.tagline-primary {
  font-size: var(--font-size-secondary);
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}

.tagline-secondary {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}
</style>
