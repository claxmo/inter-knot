<template>
  <ul class="navbar">
    <li
      v-for="(item, index) in props.items"
      :key="index"
      class="nav-item"
      :class="{ active: activeIndex === index }"
      @click="setActive(index, item)"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['change']);

const activeIndex = ref(0)

const setActive = (index, item) => {
  activeIndex.value = index;
  emit('change', item);
}
</script>
  
<style scoped lang="less">

@keyframes nav-color {
  0% { background-color: #fbfe00; }
  100% { background-color: #aefe00; }
}

@keyframes nav-size {
   0% { scale: 1.05; }
  100% { scale: 1.15; }
  
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-radius: 50px;
  background: url('@/assets/svg/point.svg') center repeat;
  background-color: #000;
  background-size: 6px;
  overflow: visible;
  border: 2px solid #000;
  box-shadow:
    inset 1px 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 0 0 4px @border-color; 
  .nav-item {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    width: 200px;
    height: 100%;
    font-size: 24px;
    font-style: italic;
    cursor: pointer;
    overflow: visible;
     &:active {
      color: @text-secondary-color;
    }
    &.active {
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
        border-radius: 50px;    
      }
      &:first-child:before {
        left: -5px;
      }
      &:last-child:before {
        right: -5px;
      }
      &::after,
      &::before {
        animation: nav-color 1s linear infinite alternate,
            nav-size 0.6s cubic-bezier(0.35, 0.7, 0, 0.8) infinite alternate;
      } 
    }
  }
}

</style>

