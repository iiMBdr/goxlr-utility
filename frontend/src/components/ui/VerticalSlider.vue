<template>
  <div class="vertical-fader">
    <div class="fader-scale">
      <span>+12</span>
      <span>0</span>
      <span>-12</span>
      <span>-24</span>
      <span>-48</span>
      <span>-∞</span>
    </div>

    <div class="fader-track-container">
      <input
        type="range"
        class="fader-input"
        min="0"
        max="255"
        :value="modelValue"
        @input="onInput"
      />
      <div class="fader-track">
        <div class="fader-fill" :style="{ height: fillPercent + '%' }" />
        <div class="fader-thumb" :style="{ bottom: fillPercent + '%' }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number // 0 to 255
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

const fillPercent = computed(() => {
  return Math.max(0, Math.min(100, (props.modelValue / 255) * 100))
})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', parseInt(target.value, 10))
}
</script>

<style scoped>
.vertical-fader {
  display: flex;
  gap: var(--space-8);
  height: 220px;
  align-items: center;
}

.fader-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  font-size: 10px;
  color: var(--text-muted);
  font-family: monospace;
  user-select: none;
}

.fader-track-container {
  position: relative;
  width: 28px;
  height: 100%;
  display: flex;
  justify-content: center;
}

.fader-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
  writing-mode: bt-lr; /* Vertical range input support */
  -webkit-appearance: slider-vertical;
}

.fader-track {
  position: relative;
  width: 6px;
  height: 100%;
  background: var(--surface-raised);
  border-radius: 3px;
  overflow: visible;
}

.fader-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: height 30ms linear;
}

.fader-thumb {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 22px;
  height: 12px;
  background: var(--text-primary);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: bottom 30ms linear;
}
</style>
