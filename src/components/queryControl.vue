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
    <span class="label" @click="isOpen = !isOpen">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useToast } from 'vue-toastification';

const store = useConfigStore();
const isOpen = ref(false);
const activeIndex = ref(0);
const label = ref('全部');

const queryOptions = computed(() => {
 return [
    { label: '全部', query: '' },
    { label: '我的', query: store.author?.login ? `author:${store.author.login}` : '' },
    { label: '公告', query: 'category:公告' },
    { label: '委托', query: 'category:委托' },
    { label: '灌水', query: 'category:灌水' },
    { label: 'R18', query: 'category:R18' },
    { label: '常规', query: 'category:常规' },
  ];
});

const setQuery = (index, query) => {
    if (store.isLoading) return useToast().info("等待加载完成后再试!");
    activeIndex.value = index;
    label.value = queryOptions.value[index].label;
    store.searchQuery = query;
    isOpen.value = !isOpen.value;
};
</script>

<style scoped lang="less">
.query-contorl {
    width: 250px;
    font-size: 18px;
    &.open {
        .query-list {
            display: block;
        }
    }
    .label{
      width: 100%;
      height: 50px;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 3px solid @color-black;
      background: linear-gradient(#212121, #141414);
      box-shadow: inset 0 2px 2px #313431, inset 0 -2px 2px #181818;
      transition: all 0.3s;
      font-size: 1em;
      &:hover {
        animation: border-glow 0.5s linear infinite alternate;
      }
    }
    .query-list {
        list-style: none;
        display: none;
        width: 100%;
        margin-bottom: 4px;
        padding: 4px;
        border-radius: 25px;
        background-color: @color-gray;
        transition: all 0.5s;
        font-size: 1em;
        .query-item {
            cursor: pointer;
            width: 100%;
            height: 35px;
            padding: 4px 0;
            border-radius: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1em;
            &.active{
                animation: background-glow 1s linear infinite alternate;
                color: @font-color-active;

            }
        }
    }
}

</style>