<template>
    <section class="flex flex-col items-center justify-center h-full p-8 m-auto">
        <img alt="Vue logo" src="./assets/logo.png">
        <hello-world msg="Welcome to Your Vue.js App"/>
    </section>
</template>

<script>
import helloWorld from './components/hello-world.vue';

export default {
    name: 'App',
    components: {
        helloWorld,
    },
};
</script>

<style lang="scss">
@import './assets/sass/app.scss';

#app {
    height: theme('height.screen');
    color: color('gray.200');
    background-color: color('gray.900');
}
</style>
