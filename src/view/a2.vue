<template>
    <div>
        <h1>组件view-{{myname}}</h1>
        <section>
            <h2>原生(原生可以正常释放)</h2>
            <div>
                <input value="xxx" />
                <button id="btn1">测试点击</button>
                <select>
                    <option value="a">韩梅梅</option>
                    <option value="b">李雷</option>
                </select>
            </div>
        </section>
        <section>
            <h2>
                vue指令(使用v-model，和@click 页面操作后，内存无法释放，其他指令正常)
            </h2>
            <div>
                <!-- <input v-model="inputVal" />
                <button @click="btn2Click">测试点击</button>  -->
                
                <select>
                    <option :value="item.key" :key="item.key" v-for="(item) in options">{{item.name}}</option>
                </select>
                <span v-text="myname"></span> 
                <input :value="inputVal" />
                <button id="btn3">isShow和isIf 点击测试</button>
                <div v-show="isShow">isShow</div>
                <div v-if="isIf">isIf</div> 
            </div>
        </section>
    </div>
</template>
<script>


export default {
    name: 'A',
    data() {
        return {
            a: new Array(20000000).fill(1),//大概80mb
            myname: "",
            isShow: true, 
            isIf: true, 
            inputVal : "xxxx",
            options: [{ key: 'a', name: '韩梅梅' }, { key: 'b', name: '李雷' }]
        }
    },
    mounted() {
        this.myname = this.$route.query.name
        document.getElementById("btn1").onclick = (e) => {
            console.log('btn1被点击')
        }
        document.getElementById("btn3").onclick = (e) => {
            this.isShow = !this.isShow
            this.isIf  = !this.isIf
        }
    },
    methods: {
        btn2Click() {
            console.log('btn2被点击')
        },
    }
}
</script>
<style scoped>
h1{ font-size: 14px;}
h2{ font-size: 12px;}
</style>