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
@keyframes scale-grow {
  0% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1.45);
  }
}

.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 50px;
  border-radius: 50px;
  background: url('@/assets/svg/point.svg') center repeat;
  background-color: #000;
  background-size: 6px;
  overflow: visible;
  border: 2px solid #000;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.3),
    inset 0 0 0 4px @border-color; 
  .nav-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
    &.active::after {
      content: '';
      position: absolute;
      z-index: -1;
      width: 75%;
      height: 100%;
      border-radius: 125px 25px 125px 25px;
      animation:
        background-glow 1s linear infinite alternate,
        scale-grow 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
    }

    &:first-child::after {
      border-radius: 75px 25px 125px 75px;
    }

    &:last-child::after {
      border-radius: 125px 75px 75px 25px;
    }
  }
}

</style>

