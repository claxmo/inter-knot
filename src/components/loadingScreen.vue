<template>
  <div class="loading-screen" v-if="show">
    <div class="loading-sprite"></div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
    duration: {
        type: Number,
        required: true,
    }
});
const show = ref(true);

onMounted(() => {
    setTimeout(() =>{
        show.value = false;
    }, props.duration);
});

</script>

<style scoped lang="less">
.loading-screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: #fff;
  z-index: 1000;
  .loading-sprite {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 530px;
    height: 150px;
    background-image: url('@/assets/img/loading.png');
    background-repeat: no-repeat;
    background-position: 0 0;
    animation: sprite 1s steps(30) infinite;
  }
}

@keyframes sprite {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 -4500px;
  }
}

</style>
