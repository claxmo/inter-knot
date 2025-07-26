<template>
  <ul class="tab-container">
    <li
      v-for="(item, index) in props.items"
      :key="index"
      class="tab-item"
      :class="{ active: activeIndex === index }"
      @click="setIndex(index)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: Array,
});
const emit = defineEmits(["change"]);
const activeIndex = ref(0);

const setIndex = (index) => {
  activeIndex.value = index;
  emit("change", props.items[activeIndex.value]);
}

</script>
  
<style scoped lang="less">

.tab-container {
  margin-left: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  width: fit-content;
  border-radius: @max-radius;
  background: repeating-conic-gradient(#000 0deg, #000 90deg, #121212 90deg, #121212 180deg);
  background-image: repeating-conic-gradient(rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 90deg, rgb(18, 18, 18) 90deg, rgb(18, 18, 18) 180deg);
  background-size: 4px 4px;
  border: 3px solid #000;
  box-shadow:
    inset 1px 1px 1px lighten(@border-color, 20%),
    inset 0 0 0 4px @border-color; 
  overflow: visible;
  user-select: none;

  .tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    width: 220px;
    height: 100%;
    font-size: 24px;
    font-style: italic;
    cursor: pointer;
    overflow: visible;
    &:active {
      color: @text-secondary-color;
    }
    &.active {
      color: #000;
      position: relative;
      &::after {
        z-index: -1;
        content: '';
        position: absolute;
        inset: 0 0 0 27px;
        transform: skewX(-27deg);
        border-radius: 15px;
        animation: 
          background-color 0.7s linear infinite alternate,
          scale-size 0.3s cubic-bezier(0.25, 0.7, 0, 0.7) infinite alternate;
      }
      &::before {
        z-index: -1;
        content: '';
        position: absolute;
        inset: 0 27px 0 0;
        transform: skewX(-27deg);
        border-radius: 15px;
        animation: 
          background-color 0.7s linear infinite alternate,
          scale-size 0.3s cubic-bezier(0.25, 0.7, 0, 0.7) infinite alternate;
      }
      &:first-child::before {
        transform: none;
        border-radius: @max-radius;
      }
      &:last-child::after {
        transform: none;
        border-radius: @max-radius;
      }
    }
  }
  
}

@keyframes scale-size {
  to { 
    scale: 1.15;
  }
  
}

@media (max-width: 1200px) {
  .tab-container {
    display: none;
  }
}

</style>

