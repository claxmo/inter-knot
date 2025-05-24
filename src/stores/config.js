import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const author = ref({});
    const posts = ref([]);
    const curPost = ref({});
    const endCursor = ref(null);
    const hasNextPage = ref(null);
    const showPopup = ref(false);
    const isLoading = ref(false);
    const searchQuery = ref("");
   
    const owner = "claxmo";
    const repo = "inter-knot";


    return {
        author,
        posts,
        curPost,
        endCursor,
        hasNextPage,
        showPopup,
        isLoading,
        searchQuery,
        owner,
        repo,

    };
});


