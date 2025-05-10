<template>
  <div class="query-contorl" :class="{ open: isOpen }">
    <ul class="query-list">
      <li
        v-for="(item, index) in queryOptions"
        :key="item.label"
        class="query-item"
        :class="{ active: activeIndex === index }"
        @click="setQuery(index, item.query)"
      >
        {{ item.label }}
      </li>
    </ul>
    <div class="btn" @click="isOpen = !isOpen">{{ curQuery }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';

const store = useConfigStore();
const isOpen = ref(false);
const activeIndex = ref(0);
const curQuery = ref('全部');
const queryOptions = [
    { label: '全部', query: '' },
    { label: '我的', query: store.author?.login ? `author:${store.author.login}` : '' },
    { label: '公告', query: 'category:公告' },
    { label: '委托', query: 'category:委托' },
    { label: '灌水', query: 'category:灌水' },
    { label: 'R18', query: 'category:R18' },
    { label: '常规', query: 'category:常规' },
  ];

const setQuery = (index, query) => {
    if (store.isLoading) return useToast().info("等待加载完成后再试!");
    activeIndex.value = index;
    curQuery.value = queryOptions[index].label;
    store.searchQuery = query;
    isOpen.value = !isOpen.value;
};
</script>


<style scoped lang="less">
.query-contorl {
    width: 250px;
    font-size: 16px;
    &.open {
        .query-list {
            display: block;
        }
    }
    .btn{
        width: 100%;
    }
    .query-list {
        list-style: none;
        display: none;
        width: 100%;
        margin-bottom: 4px;
        padding: 4px;
        border-radius: 25px;
        background-color: @color-gray;
        .query-item {
            cursor: pointer;
            width: 100%;
            height: 35px;
            padding: 4px 0;
            border-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active{
                animation: background-glow 1s linear infinite alternate;
                color: @font-color-active;

            }
        }
    }
}

</style>