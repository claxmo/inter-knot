<template>
    <teleport to="body" v-if="show">
        <div class="dialog-box-mask">    
            <div class="dialog-box">
                <div class="background-scroll">
                    <section>
                        <img src="@/assets/img/InterKnotPageBG2.png" v-for="i in 9" :key="i"/>
                    </section>
                    <section>
                        <img src="@/assets/img/InterKnotPageBG1.png" v-for="i in 9" :key="i"/>             
                    </section>
                    <section>
                        <img src="@/assets/img/InterKnotPageBG2.png" v-for="i in 9" :key="i"/>
                    </section>
                </div>
                <div class="content">{{ content }}</div>
                <div class="control">
                    <span class="cancel" @click="cancelHandle">
                        <svg t="1750770048527" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26623" width="200" height="200">
                            <path d="M512 30.117647a481.882353 481.882353 0 1 0 481.882353 481.882353A481.882353 481.882353 0 0 0 512 30.117647z m210.823529 628.555294A45.176471 45.176471 0 0 1 658.672941 722.823529L512 575.849412 365.327059 722.823529A45.176471 45.176471 0 0 1 301.176471 658.672941L448.150588 512 301.176471 365.327059A45.176471 45.176471 0 0 1 365.327059 301.176471L512 448.150588 658.672941 301.176471A45.176471 45.176471 0 0 1 722.823529 365.327059L575.849412 512z" fill="#E52C2C" p-id="26624"></path>
                        </svg>
                        取消
                    </span>
                    <span class="confirm" @click="confirmHandle">
                        <svg t="1750769973082" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22969" width="200" height="200">
                            <path d="M511.618 0C229.04 0 0 228.996 0 511.617c0 282.542 229.04 511.62 511.618 511.62 282.541 0 511.617-229.078 511.617-511.62C1023.234 228.998 794.158 0 511.618 0m318.803 386.003L472.398 731.245a58.269 58.269 0 0 1-15.863 11.286c-22.483 15.983-53.961 13.987-74.111-6.166L228.665 582.566c-22.486-22.482-22.486-58.917 0-81.359 22.481-22.564 58.912-22.564 81.394 0l115.413 115.374 323.552-311.934c22.442-22.525 58.915-22.525 81.397 0 22.482 22.444 22.482 58.914 0 81.356m0 0z" fill="#1afa29" p-id="22970"></path>
                        </svg>
                        确认
                    </span>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const content = ref("");
const show = ref(false);
let callback = null;

const close = () => {
    content.value = '';
    show.value = false;
};

const cancelHandle = () => {
   close();
    callback = null;
};

const confirmHandle = async () => {
    close();
    console.log(callback);
    await callback?.();
    callback = null;

};

onMounted(() => {
    window.$showDialog = (text, handler) => {
        content.value = text;
        show.value = true;
        callback = handler;
    };
});

</script>

<style scoped lang="less">


.background-scroll {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  gap: 80px;
  user-select: none;
  section {
    display: flex;
    transform-origin: center;
    animation: scroll 60s linear infinite;
    img {
        height: 100%;
        width: auto;
        flex-shrink: 0;
    }
    &:nth-child(odd) {
        height: 75vh;
    }
    &:nth-child(even) {
        height: 25vh;
    }
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0,0,0,0.9);
    background-image: url("@/assets/svg/point.svg");
    background-size: 6px;
  }
  @keyframes scroll {
    from {
      transform: rotate(-15deg) translateX(0);
    }
    to {
      transform: rotate(-15deg) translateX(-100%);
    }
  }
}

.dialog-box-mask {
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0,0.58);
    backdrop-filter: blur(5px);
    z-index: 999;
    .dialog-box {
        width: 100%;
        height: 200px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border: 4px solid #000;
        box-shadow: 0 0 0 5px rgba(49,49,49,0.78);
        .content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
        }
        .control {
            position: absolute;
            width: 100%;
            top: 100%;
            display: flex;
            gap: 32px;
            justify-content: center;
            align-items: center;
            transform: translateY(-40%);
            span {
                width: 285px;
                height: 55px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 14px;
                border: 2px solid #000;
                box-shadow:
                    inset 1px 1px 1px rgba(255, 255, 255, 0.38),
                    inset 0 0 0 4px @border-color; 
                border-radius: 50px;
                background: repeating-conic-gradient(#000 0deg, #000 90deg, #121212 90deg, #121212 180deg);
                background-image: repeating-conic-gradient(rgb(0, 0, 0) 0deg, rgb(0, 0, 0) 90deg, rgb(18, 18, 18) 90deg, rgb(18, 18, 18) 180deg);
                background-size: 4px 4px;
                cursor: pointer;
                font-style: italic;
                font-size: 1.5rem;
                position: relative;
                padding-left: 40px;
                .icon {
                    width: 50px;
                    height: 50px;
                    position: absolute;
                    left: 0;
                    border-radius: 50%;
                    padding: 8px;
                    box-shadow:
                        inset 1px 1px 1px rgba(255, 255, 255, 0.38),
                        inset 0 0 0 4px @border-color; 
                }            
            }
        }
    }
}

</style>