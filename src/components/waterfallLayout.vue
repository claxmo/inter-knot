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
import { debounce } from 'lodash-es';
import { defineProps, ref, onMounted, watch, nextTick , onUnmounted,  defineExpose } from 'vue';

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
});
const waterfall = ref(null);

const layout = debounce(() => {
    const getColumn = () => {
        const containerWidth = waterfall.value.clientWidth;
        const column = Math.floor(containerWidth / (props.width + props.gap));
        return Math.max(column, 1);
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
        const columnWidth = props.width + props.gap;
        const containerWidth = waterfall.value.clientWidth;
        const contentWidth = column * columnWidth - props.gap;
        const offsetLeft = (containerWidth - contentWidth) / 2;
        // waterfall.value.style.width = props.width * column + props.gap * (column - 1) + "px";
        let nextTop = new Array(column).fill(0);
        for (let i = 0; i < waterfall.value.children.length; i++) {
            const item = waterfall.value.children[i];
            let minTop = getMinTop(nextTop);
            item.style.left = `${offsetLeft + minTop.index * columnWidth}px`;
            item.style.top = `${minTop.min + props.gap}px`;
            item.style.width = props.width + "px"; 
            item.style.opacity = "1";
            nextTop[minTop.index] += item.offsetHeight + props.gap;
        }
        waterfall.value.style.paddingBottom = `${Math.max(...nextTop)}px`;
    }
}, 100);

onMounted(() => {
    layout()
    window.addEventListener('resize', layout);
});

onUnmounted(() => {
  window.removeEventListener('resize', layout);
});

watch(() => props.items, () => {
    nextTick(() => {
        layout();
    });    
}, {deep: true});

defineExpose({ layout });

</script>

<style lang="css" scoped>
.waterfall-container {
    width: 100%;
    position: relative;
    overflow: visible;
}

.waterfall-item {
    position: absolute;
    transition: all 0.3s;
    opacity: 0;
}
</style>
