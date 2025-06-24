<template>
  <div class="query-selector" :class="{ open: isOpen }">
    <ul class="query-list">
      <li
        v-for="(item, index) in props.items"
        :key="index"
        class="query-item"
        :class="{ active: activeIndex === index }"
        @click="clickHandle(index, item.query)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="cur-label" @click="isOpen = !isOpen">
      {{ curLabel }}
      <span class="arrow"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  }
});
const isOpen = ref(false);
const activeIndex = ref(0);
const curLabel = ref(props.items[0].label);
const emit = defineEmits(["change"]);

const clickHandle = (index, query) => {
  emit("change", query);
  activeIndex.value = index;
  curLabel.value = props.items[index].label;
  isOpen.value = false;

}; 
</script>

<style scoped lang="less">
@keyframes scale-grow {
  0% {
    transform: scale(1.01);
  }
  100% {
    transform: scaleX(1.06) scaleY(1.15);
  }
}

.query-selector {
  position: fixed;
  bottom: 28px;
  right: 56px;
  z-index: 10;
  width: 335px;
  height: 55px;
  .cur-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    width: 100%;
    height: 100%;
    border: 2px solid #000;
    box-shadow:
      inset 1px 1px 1px rgba(255, 255, 255, 0.3),
      inset 0 0 0 4px @border-color; 
    border-radius: 50px;
    background: url('@/assets/svg/point.svg') center repeat;
    background-size: 6px;
    background-color: #000;
    cursor: pointer;
    font-size: 1.125rem;
    .arrow {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid @text-primary-color;
      border-bottom: none;
      border-radius: 8px;
    }
  }
  .query-list {
    width: 100%;
    background-color: @bg-secondary-color;
    list-style: none;
    padding: 5px;
    border-radius: 20px;
    position: absolute;
    bottom: 30px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    .query-item {
      align-items: center;
      display: flex;
      width: 100%;
      border-radius: 50px;
      padding: 0 12px;
      height: 50px;
      cursor: pointer;
      font-size: 1.125rem;
      &.active{
          animation: background-glow 1s linear infinite alternate;
        }
      &:active {
        color: @text-secondary-color;
      }
    }
  }
}

.query-selector.open {
  .query-list {
    opacity: 1;
    bottom: 60px;
    visibility: visible;
    
  }
  .cur-label {
    .arrow{
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid @text-primary-color;
      border-top: none;
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -2;
      border-radius: 50px;
      animation: background-glow 1s linear infinite alternate,
                  scale-grow 0.6s cubic-bezier(0.35, 0.7, 0, 0.8) infinite alternate;
    }
  }
}

@media (max-width: 1080px){
  .query-selector {
    left: 50%;
    bottom: 24px;
    right: auto;
    transform: translateX(-50%);
  }
}
</style>