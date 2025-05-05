<template>
    <div class="waterfall-container" ref="waterfall" >
        <div class="waterfall-item" v-for="(item, index) in props.items" :key="item.id" >
            <Card 
            :data="item" 
            :class="{ viewed: viewedIds.has(item.id) }"
            @click="clickHandle(item.id, index)" 
            @imageLoaded="layout"/>
        </div>
    </div>
</template>

<script setup>
import Card from '@/components/postCard.vue';
import { defineProps, ref, onMounted, watch,nextTick , onUnmounted, reactive} from 'vue';
import { useConfigStore } from '@/stores/config';

const store = useConfigStore();
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    itemWidth: {
        type: Number,
        required: true,
    },
    itemGap: {
        type: Number,
        required: true,
    },

});

const viewedIds = reactive(new Set());
const clickHandle = (_id, index) => {
    viewedIds.add(_id);
    store.openPostDetail(index);
}; 

const waterfall = ref(null);

const layout = () => {
    const getColumn = () => {
        if (!waterfall.value) return 0;
        let innerWidth = window.innerWidth;
        let column = Math.floor(innerWidth / props.itemWidth);
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
        waterfall.value.style.width = props.itemWidth * column + props.itemGap * (column - 1) + "px";
        let nextTop = new Array(column).fill(0);
        for (let i = 0; i < waterfall.value.children.length; i++) {
            const item = waterfall.value.children[i];
            let minTop = getMinTop(nextTop);
            item.style.left = `${minTop.index * (props.itemWidth + props.itemGap)}px`;
            item.style.top = `${minTop.min + props.itemGap}px`;
            item.style.width = props.itemWidth + "px"; 
            item.style.display = "block";
            nextTop[minTop.index] += item.offsetHeight + props.itemGap;
        }
        waterfall.value.style.paddingBottom = `${Math.max(...nextTop)}px`;

    }
};

let resizeTimeout = null;

onMounted(() => {
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => layout(), 200); // 防抖,延时200ms执行布局
    });
    // window.addEventListener('resize',layout);
    layout();
});

onUnmounted(() => {
    window.removeEventListener('resize',layout);
});

watch(() => props.items, () => {
    nextTick(() => {
        layout();
    });    
});
</script>

<style lang="css" scoped>
.waterfall-container {
    position: relative;
    overflow: visible;
}

.waterfall-item {
    height: auto;
    position: absolute;
    transition: all 0.3s;
    display: none;
}
</style>
