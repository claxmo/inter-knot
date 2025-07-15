<template>
    <div class="query-selector" :class="{ open: isOpen }">
      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="clickHandle(index)"
        >
          {{ item.label }}
        </li>
      </ul>
      <div class="label" @click="isOpen = !isOpen">
        {{ label }}
        <span class="arrow"></span>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@/stores/config';
const store = useConfigStore();
const items = ref([
    { label: '全部', query: '' },
    { label: '我的', query: store.author?.login ? `author:${store.author.login}` : '' },
    { label: '公告', query: 'category:公告' },
    { label: '委托', query: 'category:委托' },
    { label: '灌水', query: 'category:灌水' },
    { label: 'R18', query: 'category:R18' },
    { label: '常规', query: 'category:常规' },
  ]);
const isOpen = ref(false);
const activeIndex = ref(0);
const label = ref(items.value[0].label);

const clickHandle = (index) => {
  store.searchQuery = items.value[index].query;
  activeIndex.value = index;
  label.value = items.value[index].label;
  isOpen.value = false;

}; 
</script>

<style scoped lang="less">

.query-selector {
  user-select: none;
  position: fixed;
  bottom: 24px;
  right: 48px;
  z-index: 10;
  width: 335px;
  height: 55px;
  .label {
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
    font-size: 1.25rem;
    .arrow {
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      border-top: 0.5rem solid @text-primary-color;
      border-bottom: none;
      border-radius: 15px;
    }
  }

  ul {
    list-style: none;
    width: 100%;
    background-color: @bg-secondary-color;
    padding: 5px;
    border-radius: 25px;
    position: absolute;
    bottom: 30px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    li {
      align-items: center;
      display: flex;
      width: 100%;
      border-radius: @max-radius;
      padding: 0 12px;
      height: 50px;
      cursor: pointer;
      font-size: 1.25rem;
      &.active{
        color: #000;
        animation: background-color 0.7s linear infinite alternate;
      }
      &:active {
        color: @text-secondary-color;
      }
    }
  }
  &.open {
    ul {
      opacity: 1;
      bottom: 60px;
      visibility: visible; 
    }
    .label {
      @keyframes scale-size {
        from {
          transform: scale(1.01);
        }
        to {
          transform: scaleX(1.06) scaleY(1.16);
        }
      }
      .arrow{
        border-left: 0.5rem solid transparent;
        border-right: 0.5rem solid transparent;
        border-bottom: 0.5rem solid @text-primary-color;
        border-top: none;
        border-radius: 15px;
      }
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -2;
        border-radius: @max-radius;
        animation: background-color 0.7s linear infinite alternate,
                    scale-size 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
      }
    }
  }
}


@media (max-width: 1200px){
  .query-selector {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}
</style>