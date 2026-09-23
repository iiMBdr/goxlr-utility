<template>
  <div class="slider-container" :class="{ 'slider--disabled': disabled }">
    <div v-if="label || showValue" class="slider-header">
      <span v-if="label" class="slider-label">{{ label }}</span>
      <span v-if="showValue" class="slider-value">{{ formatValue(modelValue) }}</span>
    </div>
    <div class="slider-track-wrapper">
      <input
        type="range"
        class="slider-input"
        :min="min ?? 0"
        :max="max ?? 100"
        :step="step ?? 1"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput"
      />
      <div class="slider-track">
        <div class="slider-fill" :style="{ width: fillPercent + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  showValue?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const minVal = computed(() => props.min ?? 0)
const maxVal = computed(() => props.max ?? 100)

const fillPercent = computed(() => {
  const range = maxVal.value - minVal.value
  if (range <= 0) return 0
  const pct = ((props.modelValue - minVal.value) / range) * 100
  return Math.max(0, Math.min(100, pct))
})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', parseFloat(target.value))
}

function formatValue(val: number): string {
  if (props.unit) return `${val}${props.unit}`
  return `${val}`
}
</script>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6, 6px);
  width: 100%;
}

.slider--disabled {
  opacity: 0.4;
  pointer-events: none;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-secondary);
}

.slider-label {
  color: var(--text-secondary);
}

.slider-value {
  color: var(--text-primary);
  font-weight: 500;
  font-family: monospace;
}

.slider-track-wrapper {
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.slider-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  margin: 0;
}

.slider-track {
  width: 100%;
  height: 4px;
  background: var(--surface-raised);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.slider-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 50ms linear;
}
</style>
