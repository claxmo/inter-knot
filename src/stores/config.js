import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const author = ref({});
    const posts = ref([]);
    const curPostIndex = ref(null);
    const endCursor = ref(null);
    const hasNextPage = ref(null);
    const isOpenPostDetail = ref(false);
    const isLoading = ref(false);
    const message = computed(() => {
        if (isLoading.value) {
            return '正在努力加载···'
        } else if (hasNextPage.value === false) {
            return '已经到底了···\\[ O_X ]/'
        } else {
            return ''
        }
    });
      

    const openPostDetail = (index) => {
        curPostIndex.value = index;
        isOpenPostDetail.value = true;
    };

    const closePostDetail = () => {
        isOpenPostDetail.value = false;
    };

    const name = "claxmo";
    const repo = "inter-knot";

    return {
        author,
        posts,
        curPostIndex,
        endCursor,
        hasNextPage,
        isOpenPostDetail,
        isLoading,
        message,
        openPostDetail,
        closePostDetail,
        name,
        repo

    };
});


