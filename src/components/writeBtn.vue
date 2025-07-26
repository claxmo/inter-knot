<template>
    <a :href="`https://github.com/${store.owner}/${store.repo}/discussions/new/choose`" target="_blank" class="write-btn" title="写帖子">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" class="icon">
            <path fill="currentColor" d="M9.243 18.997H21v2H3v-4.243l9.9-9.9l4.242 4.243zm5.07-13.557l2.122-2.121a1 1 0 0 1 1.414 0l2.829 2.828a1 1 0 0 1 0 1.415l-2.122 2.121z"></path>
        </svg>
        <div class="background-shadow"></div>
    </a>
</template>

<script setup>
import { useConfigStore } from '@/stores/config';
const store = useConfigStore();

</script>

<style scoped lang="less">

.write-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background: linear-gradient(#222222, #141414);
    box-shadow: inset 0 2px 2px #323232, inset 0 -2px 2px #181818;
    border: 3px solid #000;
    cursor: pointer;
    color: inherit;
    position: relative;
    .icon {
        position: relative;
        z-index: 1;
    }
    &:active {
        color: #222222;
        .background-shadow{
            z-index: 0;
            position: absolute;
            inset: 0;
            border-radius: @max-radius;
            animation: 
                background-color 0.7s linear infinite alternate,
                scale-size 0.3s cubic-bezier(0.25, 0.7, 0, 0.7) infinite alternate;     
        }
    }
}

@keyframes scale-size {
    to { 
        scale: 1.15; 
    }
}

</style>