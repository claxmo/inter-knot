<template>
  <div class="selector-box" :class="{show: isShow}">
    <div class="option-list">
      <div 
      class="option-item"
      v-for="(item, index) in props.items"
      :key="index"
      :class="{ active: activeIndex === index }"
      @click="setIndex(index, item)"
      >
      {{ item.label }}
      </div>
    </div>
    <div class="label" @click="isShow = !isShow">
      {{ label }}
      <img class="arrow" src="@/assets/img/IconArrow.png" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  items: Array,
});
const emit = defineEmits(['change']);
const isShow = ref(false);
const activeIndex = ref(0);
const label = ref(props.items[0].label);

const setIndex = (index, item) => {
  activeIndex.value = index;
  label.value = item.label;
  isShow.value = false;
  emit('change', item.value);
};

</script>

<style scoped lang="less">
.selector-box {
  position: fixed;
  bottom: 24px;
  right: 48px;
  width: 335px;
  height: 56px;
  user-select: none;
  z-index: 10;
  .label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    width: 100%;
    height: 100%;
    border: 2px solid #000;
    box-shadow:
      inset 1px 1px 1px lighten(@border-color, 20%),
      inset 0 0 0 4px @border-color; 
    border-radius: 50px;
    background: repeating-conic-gradient(#000 0deg, #000 90deg, #121212 90deg, #121212 180deg);
    background-image: repeating-conic-gradient(rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 90deg, rgb(18, 18, 18) 90deg, rgb(18, 18, 18) 180deg);
    background-size: 4px 4px;
    cursor: pointer;
    font-size: 20px;
    .arrow {
      width: 12px;
      height: 12px;    
    }
  }
  .option-list {
    width: 100%;
    background-color: @bg-secondary-color;
    padding: 4px;
    border-radius: 25px;
    position: absolute;
    bottom: 32px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
    .option-item {
      align-items: center;
      display: flex;
      width: 100%;
      border-radius: @max-radius;
      padding: 0 12px;
      height: 48px;
      cursor: pointer;
      font-size: 20px;
      &.active{
        color: #000;
        animation: background-color 0.7s linear infinite alternate;
      }
      &:active {
        color: @text-secondary-color;
      }
    }
  }
  &.show {
    .option-list {
      opacity: 1;
      bottom: 64px;
      visibility: visible; 
    }
    .label {
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -2;
        border-radius: @max-radius;
        animation: background-color 0.7s linear infinite alternate,
                    scale-size 0.3s cubic-bezier(0.25, 0.7, 0, 0.7) infinite alternate;
      }
      .arrow {
        transform: rotate(180deg);
      }
      @keyframes scale-size {
        to {
          transform: scaleX(1.05) scaleY(1.15);
        }
      }
    }
  }
}

@media (max-width: 1200px){
  .selector-box {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}
</style>