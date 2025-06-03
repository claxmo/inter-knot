<template>
    <div class="image-viewer">
        <img 
        v-for="(url, index) in props.urls"
        v-show="index === curIndex"
        :src="url" 
        :key="index" />
        <div class="control" v-show="isMulti">
            <span class="prev" @click="prevImage" title="上一张"></span>
            <span class="next" @click="nextImage" title="下一张"></span>
        </div>
        <span class="cur-page" v-show="isMulti">{{ curIndex + 1 }}/{{ props.urls.length }}</span>
    </div>
</template>

<script setup>
import { defineProps, ref, watch, computed } from 'vue';

const props = defineProps({
    urls: {
        type: Array,
        required: true,
    }
});

const curIndex = ref(0);
const isMulti = computed(() => props.urls.length > 1);


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
    .cur-page{
        position: absolute;
        right: 8px;
        bottom: 4px;
    }
    .control {
        position: absolute;
        inset: 0;
        .prev,
        .next {
            position: absolute;
            width: 50%;
            height: 100%;
            cursor: pointer;
            &:active {
                background-color: rgba(0,0,0,0.3);
            }
        }
        .prev {
            left: 0;
        }
        .next {
            right: 0;
        }
    }
}
</style>