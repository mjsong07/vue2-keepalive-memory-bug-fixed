<template>
    <div>
        <div>组件view<input v-model="myname"/> </div>
    </div>
</template>
<script>


export default {
    name: 'A',
    data() {
        return {
            a: new Array(20000000).fill(1),//大概80mb 
        }
    },
    mounted(){  
        this.myname = this.$route.query.name
    }
}
</script>
<style scoped>
h1{ font-size: 14px;}
h2{ font-size: 12px;}
</style>