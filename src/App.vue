<template>
  <LoadingScreen :duration="2000"/>
  <HeaderContainer />
  <MainContainer />
</template>

<script setup>
import HeaderContainer from "@/components/headerContainer.vue";
import MainContainer from "@/components/mainContainer.vue";
import LoadingScreen from "./components/loadingScreen.vue";

</script>


