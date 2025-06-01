<template>
  <div class="query-selector" :class="{ open: isOpen }">
    <ul class="query-options">
      <li
        v-for="(item, index) in props.items"
        :key="index"
        class="query-option"
        :class="{ active: activeIndex === index }"
        @click="setQuery(index, item.query)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="cur-label" @click="isOpen = !isOpen">{{ curLabel }}<span class="arrow"></span></div>
    <div class="back-glow"></div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  }
});
const store = useConfigStore();
const isOpen = ref(false);
const activeIndex = ref(0);
const curLabel = ref(props.items[0].label);

const setQuery = (index, query) => {
    if (store.isLoading) {
      useToast().info("请等待加载完成!");
      return;
    }
    activeIndex.value = index;
    curLabel.value = props.items[index].label;
    store.searchQuery = query;
    isOpen.value = !isOpen.value;
};
</script>

<style scoped lang="less">
@keyframes scale-grow {
  0% {
    transform: scale(1.05);
  }
  100% {
    transform: scaleX(1.1) scaleY(1.35);
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
    padding: 0 12px;
    width: 100%;
    height: 100%;
    border: 4px solid @border-color;
    border-radius: 50px;
    background: url('@/assets/svg/point.svg') center repeat;
    background-size: 6px;
    background-color: #000;
    cursor: pointer;
    box-shadow: 0 0 0 2px #000;
    font-size: 1.125rem;
    .arrow {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid @text-primary-color;
      border-bottom: none;
      border-radius: 8px;
    }
  }
  .query-options {
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
    .query-option {
      align-items: center;
      display: flex;
      width: 100%;
      border-radius: 50px;
      padding: 0 8px;
      height: 45px;
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
  .query-options {
    opacity: 1;
    bottom: 65px;
    visibility: visible;
    
  }
  .cur-label .arrow{
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid @text-primary-color;
    border-top: none;
  }
  .back-glow {
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    border-radius: 50px;
    animation: background-glow 1s linear infinite alternate,
                  scale-grow 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
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