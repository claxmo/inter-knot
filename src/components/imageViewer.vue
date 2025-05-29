<template>
    <div class="image-viewer">
        <span class="prev-btn" @click="prevImage" title="上一张" v-show="props.urls.length > 1"></span>
        <img 
        v-for="(url, index) in props.urls"
        v-show="index === curIndex"
        :src="url" 
        :key="index" />
        <span class="next-btn" @click="nextImage" title="下一张" v-show="props.urls.length > 1"></span>
        <span class="cur-page" v-show="props.urls.length > 1">{{ curIndex + 1 }}/{{ props.urls.length }}</span>
    </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
    urls: {
        type: Array,
        required: true,
    }
});

const curIndex = ref(0);

const prevImage = () => {
 curIndex.value = (curIndex.value - 1 + props.urls.length) % props.urls.length;
};

const nextImage = () => {
 curIndex.value = (curIndex.value + 1) % props.urls.length;
};

watch(() => props.urls, () => {
    curIndex.value = 0;
});

</script>

<style scoped lang="less">
.image-viewer {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .prev-btn,
    .next-btn {
        position: absolute;
        width: 50%;
        height: 100%;
        cursor: pointer;
        &:active {
            background-color: rgba(0,0,0,0.3);
        }
    }
    .prev-btn {
        left: 0;
    }
    .next-btn {
        right: 0;
    }
    .cur-page{
        position: absolute;
        right: 8px;
        bottom: 4px;
        text-align: center;
        color: rgba(255,255,255,0.3);
    }
}

</style>