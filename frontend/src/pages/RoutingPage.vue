<template>
  <div class="page-container">
    <div class="routing-layout">
      <!-- Routing Matrix Card -->
      <Card title="ROUTING MATRIX" :icon="GitFork">
        <div class="matrix-wrapper">
          <table class="routing-table">
            <thead>
              <tr>
                <th class="corner-header">FROM \ TO</th>
                <th
                  v-for="dest in outputs"
                  :key="dest"
                  class="col-header"
                >
                  {{ formatName(dest) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="src in inputs"
                :key="src"
              >
                <td class="row-header">{{ formatName(src) }}</td>
                <td
                  v-for="dest in outputs"
                  :key="dest"
                  class="cell"
                >
                  <button
                    class="routing-toggle"
                    :class="{ 'routing-toggle--active': isConnected(src, dest) }"
                    @click="toggleRoute(src, dest)"
                  >
                    <Check v-if="isConnected(src, dest)" :size="12" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GitFork, Check } from '@lucide/vue'
import Card from '../components/ui/Card.vue'

const props = defineProps<{
  routerMap: any
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
}>()

const inputs = ['Mic', 'Chat', 'Music', 'System', 'Game', 'Sample', 'LineIn']
const outputs = ['Headphones', 'BroadcastMix', 'LineOut', 'ChatMic', 'Sampler']

function formatName(str: string): string {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

function isConnected(src: string, dest: string): boolean {
  return props.routerMap?.[src]?.[dest] ?? false
}

function toggleRoute(src: string, dest: string) {
  const current = isConnected(src, dest)
  emit('command', ['SetRouter', [src, dest, !current]])
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.routing-layout {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.matrix-wrapper {
  overflow-x: auto;
}

.routing-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.routing-table th, .routing-table td {
  padding: 10px;
  border: 1px solid var(--border);
}

.corner-header {
  font-size: var(--font-size-small);
  color: var(--text-muted);
  text-align: left;
  background: var(--surface-secondary);
}

.col-header {
  font-size: var(--font-size-secondary);
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-secondary);
  white-space: nowrap;
}

.row-header {
  font-size: var(--font-size-secondary);
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
  background: var(--surface-secondary);
  white-space: nowrap;
}

.cell {
  background: var(--surface-primary);
}

.routing-toggle {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border-strong);
  background: var(--surface-raised);
  color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.routing-toggle:hover {
  border-color: var(--accent);
}

.routing-toggle--active {
  background: var(--accent-muted);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
