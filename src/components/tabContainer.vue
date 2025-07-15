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
  height: 55px;
  border-radius: @max-radius;
  background: url('@/assets/svg/point.svg') center repeat;
  background-color: #000;
  background-size: 6px;
  overflow: visible;
  border: 3px solid #000;
  user-select: none;
  box-shadow:
    inset 1px 1px 1px rgba(255,255,255,0.38),
    inset 0 0 0 4px @border-color; 
  .tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    width: 220px;
    height: 100%;
    font-size: 1.5rem;
    font-style: italic;
    cursor: pointer;
    overflow: visible;
    user-select: none;
    &:active {
      color: @text-secondary-color;
    }
    &.active {
      color: #000;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        z-index: -1;
        inset: 0;
        left: 10%;
        right: 10%;
        border-radius: 15px;
        transform: skewX(-27deg);
      }
      &:first-child:before,
      &:last-child:before {
        content: '';
        position: absolute;
        z-index: -1;
        width: 50%;
        height: 100%;
        border-radius: @max-radius;    
      }
      &:first-child:before {
        left: -7px;
      }
      &:last-child:before {
        right: -7px;
      }
      &::after,
      &::before {
        animation: 
          background-color 0.7s linear infinite alternate,
          scale-size 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
      } 
    }
  }
}

@media (max-width: 1200px) {
  .tab-container {
    display: none;
  }
}

</style>

