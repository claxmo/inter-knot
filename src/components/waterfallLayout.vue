<template>
    <div class="waterfall-container" ref="waterfall" >
        <div 
        class="waterfall-item" 
        v-for="(item) in props.items" 
        :key="item.id" 
        >
        <slot :item="item"></slot>
        </div>
    </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core';
import { defineProps, ref, onMounted, watch, nextTick , onUnmounted,  defineExpose, toRefs } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    gap: {
        type: Number,
        required: true,
    },
    breakpoints: {
        type: Array,
        required: true,
    }
});
const waterfall = ref(null);
const {width, gap} = toRefs(props);

const layout = useDebounceFn(() => {
    const getColumn = () => {
        const containerWidth = waterfall.value.clientWidth;
        let column = 0;
        props.breakpoints.forEach(item => {
            if (containerWidth >= item.width) column = item.cols
        });
        return column;
    };
    const getMinTop = (nextTop) => {
        let min = nextTop[0], index = 0;
        for (let i = 1; i < nextTop.length; i++) {
            if (nextTop[i] < min) {
                min = nextTop[i];
                index = i;
            }
        }
        return { min, index };
    };

    if (waterfall.value) {
        const column = getColumn();
        const columnWidth = width.value + gap.value;
        const containerWidth = waterfall.value.clientWidth;
        const contentWidth = column * columnWidth - gap.value;
        const offsetLeft = (containerWidth - contentWidth) / 2;
        let nextTop = new Array(column).fill(0);
        for (let i = 0; i < waterfall.value.children.length; i++) {
            const item = waterfall.value.children[i];
            let minTop = getMinTop(nextTop);
            item.style.left = `${offsetLeft + minTop.index * columnWidth}px`;
            item.style.top = `${minTop.min + gap.value}px`;
            item.style.width = `${width.value}px`; 
            item.style.opacity = "1";
            nextTop[minTop.index] += item.offsetHeight + gap.value;
        }
        waterfall.value.style.paddingBottom = `${Math.max(...nextTop)}px`;
    }
}, 300);

onMounted(() => {
    window.addEventListener('resize', layout);
});

onUnmounted(() => {
  window.removeEventListener('resize', layout);
});

watch(() => props.items, () => {
    nextTick(() => {
        layout();
    });    
});

defineExpose({ layout });

</script>

<style scoped lang="less">
.waterfall-container {
    width: 100%;
    position: relative;
    overflow: visible;
    .waterfall-item {
        position: absolute;
        transition: all 0.3s;
        opacity: 0;
    }
}
</style>
