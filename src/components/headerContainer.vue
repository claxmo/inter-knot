<template>
    <header>
        <userInfo />  
        <navBar />
    </header>
</template>

<script setup>
import userInfo from "@/components/userInfo.vue";
import navBar from "@/components/navBar.vue";

</script>

<style scoped lang="less">
header{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    padding: 5px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.9);
    z-index: 10;
    .backdrop-blur(10px);
}

@media (max-width: 1440px) {
    header{
        justify-content: center;
    }
}

</style>