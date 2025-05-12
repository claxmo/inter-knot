<template>
    <ul class="navbar">
        <li
        class="nav-item"
        :class="{ active: activeIndex === 0 }"
        @click="setActive(0)"
        >
        推送
        </li>
        <li
        class="nav-item"
        :class="{ active: activeIndex === 1 }"
        @click="setActive(1)"
        >
        日程
        </li>
        <li
        class="nav-item"
        :class="{ active: activeIndex === 2 }"
        @click="setActive(2)"
        >
        历程
        </li>
        <li
        class="nav-item"
        :class="{ active: activeIndex === 3 }"
        @click="setActive(3)"
        >
        绳网等级
        </li>
    </ul>
</template>
  
<script setup>
  import { ref } from 'vue'

  const activeIndex = ref(0)

  const setActive = (index) => {
      activeIndex.value = index
  }
</script>
  
  
<style scoped lang="less">
.navbar {
  width: auto;
  height: 50px;
  border: 4px solid @color-gray;
  padding: 0 10px;
  border-radius: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: visible;
  background: url('@/assets/svg/point.svg') center repeat;
  background-size: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  .nav-item {
    width: 220px;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-style: italic;
    cursor: pointer;
    overflow: visible;
    z-index: 1;
    &.active {
      color: @font-color-active;
      transition: transform 0.3s;
      &::after {
        content: '';
        position: absolute;
        z-index: -1;
        width: 75%;
        height: 100%;
        border-radius: 16px;
        transform: skewX(-27deg);
        animation: background-glow 1s linear infinite alternate,
                   scale-grow 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
      }
      &:first-child::before,
      &:last-child::before {
        content: '';
        position: absolute;
        z-index: -1;
        width: 50%;
        height: 100%;
        border-radius: 50px;
        animation: background-glow 1s linear infinite alternate,
                   scale-grow 0.3s cubic-bezier(0.35, 0.7, 0, 0.7) infinite alternate;
      }
      &:first-child::before {
        left: 0;
      }
      &:last-child::before {
        right: 0;
      }
    }
  }
}


@media (max-width: 1440px) {
  .navbar {
    display: none;
  }
}
</style>
