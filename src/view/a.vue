<template>
    <div>
        1111
    </div>
</template>
<script>


export default {
    name: 'A',
    data() {
        return {
            a: new Array(20000000).fill(1),//大概80mb 
        }
    }
}
</script>
<style scoped>
h1{ font-size: 14px;}
h2{ font-size: 12px;}
</style>