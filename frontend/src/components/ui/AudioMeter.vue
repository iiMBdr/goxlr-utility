<template>
  <div class="audio-meter" :class="{ 'audio-meter--horizontal': direction === 'horizontal' }">
    <div class="meter-segments">
      <div
        v-for="i in segments"
        :key="i"
        class="meter-segment"
        :class="getSegmentClass(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    level: number // 0 to 100
    segments?: number
    direction?: 'vertical' | 'horizontal'
  }>(),
  {
    segments: 18,
    direction: 'vertical',
  }
)

function getSegmentClass(index: number) {
  const pct = (index / props.segments) * 100
  const isActive = props.level >= pct

  if (!isActive) return 'segment--inactive'

  if (pct > 85) return 'segment--clipping'
  if (pct > 70) return 'segment--warning'
  return 'segment--normal'
}
</script>

<style scoped>
.audio-meter {
  display: flex;
  height: 100%;
  width: 12px;
}

.audio-meter--horizontal {
  width: 100%;
  height: 12px;
}

.meter-segments {
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  width: 100%;
  height: 100%;
}

.audio-meter--horizontal .meter-segments {
  flex-direction: row;
}

.meter-segment {
  flex: 1;
  border-radius: 1px;
  background: var(--surface-raised);
  transition: background-color 50ms linear;
}

.segment--normal {
  background: var(--accent);
}

.segment--warning {
  background: var(--warning);
}

.segment--clipping {
  background: var(--danger);
}

.segment--inactive {
  background: rgba(255, 255, 255, 0.05);
}
</style>
