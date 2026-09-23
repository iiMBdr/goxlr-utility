<template>
  <div class="page-container">
    <div class="lighting-grid">
      <!-- Global / Preset Color -->
      <Card title="GLOBAL LIGHTING" :icon="Sun">
        <div class="color-picker-row">
          <label class="setting-label">Global Base Color</label>
          <div class="swatches">
            <button
              v-for="color in presetSwatches"
              :key="color"
              class="swatch-btn"
              :style="{ backgroundColor: color }"
              @click="$emit('command', ['SetGlobalColour', color.replace('#', '')])"
            />
          </div>
        </div>
      </Card>

      <!-- Fader Colors -->
      <Card title="FADER COLOURS" :icon="Sliders">
        <div v-for="(fader, name) in lightingStatus.faders" :key="name" class="fader-color-item">
          <span class="fader-title">{{ name }}</span>
          <div class="color-pair">
            <div class="color-input-box">
              <span class="color-label">Top</span>
              <input
                type="color"
                class="color-picker"
                :value="'#' + fader.colours.colour_one"
                @change="e => updateFaderColor(String(name), (e.target as HTMLInputElement).value, fader.colours.colour_two)"
              />
            </div>
            <div class="color-input-box">
              <span class="color-label">Bottom</span>
              <input
                type="color"
                class="color-picker"
                :value="'#' + fader.colours.colour_two"
                @change="e => updateFaderColor(String(name), fader.colours.colour_one, (e.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>
      </Card>

      <!-- Button Colors -->
      <Card title="BUTTON COLOURS" :icon="Palette">
        <div class="color-picker-row">
          <span class="setting-label">Quick Color Presets</span>
          <div class="swatches">
            <button
              v-for="c in presetSwatches"
              :key="c"
              class="swatch-btn"
              :style="{ backgroundColor: c }"
              @click="applyQuickButtonColor(c)"
            />
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sun, Sliders, Palette } from '@lucide/vue'
import Card from '../components/ui/Card.vue'

const props = defineProps<{
  lightingStatus: any
}>()

const emit = defineEmits<{
  (e: 'command', cmd: any): void
}>()

const presetSwatches = [
  '#52D6CC', '#62D7A5', '#E4B967', '#E26D72',
  '#3A86FF', '#8338EC', '#FF006E', '#FB5607',
  '#FFFFFF', '#1B2023'
]

function updateFaderColor(faderName: string, col1: string, col2: string) {
  const c1 = col1.replace('#', '')
  const c2 = col2.replace('#', '')
  emit('command', ['SetFaderColours', [faderName, c1, c2]])
}

function applyQuickButtonColor(hex: string) {
  const c = hex.replace('#', '')
  emit('command', ['SetButtonGroupColours', ['FaderMute', c, c]])
}
</script>

<style scoped>
.page-container {
  padding: var(--space-24);
  overflow-y: auto;
  height: 100%;
}

.lighting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-16);
}

.color-picker-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.setting-label {
  font-size: var(--font-size-secondary);
  color: var(--text-secondary);
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-8);
}

.swatch-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.swatch-btn:hover {
  transform: scale(1.15);
}

.fader-color-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.fader-title {
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-primary);
}

.color-pair {
  display: flex;
  gap: var(--space-12);
}

.color-input-box {
  display: flex;
  align-items: center;
  gap: 6px;
}

.color-label {
  font-size: var(--font-size-small);
  color: var(--text-muted);
}

.color-picker {
  -webkit-appearance: none;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}
.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}
.color-picker::-webkit-color-swatch {
  border: 1px solid var(--border-strong);
  border-radius: 4px;
}
</style>
