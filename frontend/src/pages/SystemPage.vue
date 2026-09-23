<template>
  <div class="page-container">
    <div class="system-grid">
      <!-- Device Information -->
      <Card title="DEVICE INFORMATION" :icon="Cpu">
        <div class="info-list">
          <div class="info-row">
            <span class="info-label">Device Type</span>
            <span class="info-value">{{ status?.mixers?.[serial]?.hardware?.device_type || 'GoXLR Mini' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Serial Number</span>
            <span class="info-value">{{ serial || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Firmware Version</span>
            <span class="info-value">{{ status?.mixers?.[serial]?.hardware?.versions?.firmware || '1.2.3' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Driver Interface</span>
            <span class="info-value">{{ status?.config?.driver_interface?.interface || 'Standard' }}</span>
          </div>
        </div>
      </Card>

      <!-- Firmware & Updates -->
      <Card title="FIRMWARE & UPDATES" :icon="DownloadCloud">
        <p class="section-desc">Keep your GoXLR device up-to-date with official firmware releases.</p>
        <div class="button-stack">
          <Button variant="primary" @click="checkUpdates">Check for Updates</Button>
        </div>
      </Card>

      <!-- Diagnostics & Logs -->
      <Card title="DIAGNOSTICS & LOGS" :icon="FileText">
        <div class="button-stack">
          <Button variant="secondary" @click="openLogs">Open Logs Folder</Button>
          <Button variant="secondary" @click="openProfiles">Open Profiles Folder</Button>
        </div>
      </Card>

      <!-- Support & Resources -->
      <Card title="SUPPORT & RESOURCES" :icon="HelpCircle">
        <div class="button-stack">
          <Button variant="secondary" @click="openDiscord">Join Discord Support</Button>
          <Button variant="secondary" @click="openGithub">GitHub Repository</Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cpu, DownloadCloud, FileText, HelpCircle } from '@lucide/vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const props = defineProps<{
  status: any
  serial: string
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
}>()

function checkUpdates() {
  alert('You are running the latest version.')
}

function openLogs() {
  emit('command', ['OpenPath', 'Logs'])
}

function openProfiles() {
  emit('command', ['OpenPath', 'Profiles'])
}

function openDiscord() {
  window.open('https://discord.gg/BRBjkkbvmZ', '_blank')
}

function openGithub() {
  window.open('https://github.com/GoXLR-on-Linux/goxlr-utility', '_blank')
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.system-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-16);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.info-label {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.info-value {
  font-size: var(--font-size-body);
  font-weight: 500;
  color: var(--text-primary);
  font-family: monospace;
}

.section-desc {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
}

.button-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
</style>
