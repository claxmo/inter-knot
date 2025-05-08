<template>
    <header>
        <div style="display: flex; justify-content: center; align-items: center; gap: 5px;">
            <userInfo />  
            <!-- <span class="btn" title="登出" v-if="store.author?.login"><img src="./assets/svg/logout.svg"></span> -->
            <button class="btn" @click="togglePlay">
                <audio ref="bgm" autoplay loop>
                    <source src="@/assets/audio/三Z-STUDIO,HOYO-MiX - 夏日盛典.mp3" type="audio/mpeg">
                </audio>
                <img src="@/assets/svg/volume-2.svg" v-show="isPlaying">
                <img src="@/assets/svg/volume-x.svg" v-show="!isPlaying">
            </button>
        </div>
        <navBar />
    </header>
</template>

<script setup>
import userInfo from "@/components/userInfo.vue";
import navBar from "@/components/navBar.vue";
import { ref } from "vue";

const bgm = ref(null);
const isPlaying = ref(false);

const togglePlay = () => {
    if (isPlaying.value) {
        bgm.value.pause();
    } else {
        bgm.value.play();
    }
    isPlaying.value = !isPlaying.value;
};
</script>

<style scoped lang="less">
header{
position: fixed;
width: 100%;
height: 90px;
padding: 5px 50px;
display: flex;
justify-content: space-between;
align-items: center;
z-index: 10;
background-color: rgba(0, 0, 0, 0.7);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
}

@media (max-width: 1440px) {
    header{
        justify-content: center;
    }
}

</style>