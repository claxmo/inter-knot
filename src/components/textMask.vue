<template>
  <div class="background-marquee">
    <p v-for="i in 8" :key="i" :class="i % 2 === 0 ? 'right' : 'left'">
      ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO ZELESS ZONE ZERO
    </p>
  </div>
</template>

<script setup>
</script>

<style scoped lang="less">
.background-marquee {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%) rotate(-30deg);
  transform-origin: center;
  z-index: -1;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  pointer-events: none; // 防止点击干扰

  p {
    line-height: 1;
    font-size: 150px;
    white-space: nowrap;
    color: rgba(255, 255, 255, 0.2);
    animation-duration: 60s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .left {
    animation-name: marquee-left;
  }

  .right {
    animation-name: marquee-right;
  }

  @keyframes marquee-left {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes marquee-right {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0%);
    }
  }
}
</style>
