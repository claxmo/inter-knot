import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const author = ref({});
    const posts = ref([]);
    const curPostIndex = ref(null);
    const endCursor = ref(null);
    const hasNextPage = ref(null);
    const isOpenPostDetail = ref(false);

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
        openPostDetail,
        closePostDetail,
        name,
        repo

    };
});


