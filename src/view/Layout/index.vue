<template>
    <div>
        <div>keep-alive includeList:{{indexNameList}}</div>
        <button @click="routerAdd()">新增(enter)</button> <button @click="routerDel()">删除(esc)</button> <button @click="gc()">强制垃圾回收(backspace)</button> <span  >内存已使用<b id="usedJSHeapSize"></b></span>
        <div class="keepaliveBox">
            <keep-alive :include="indexNameList">
                <router-view />
            </keep-alive>
        </div>
        <div class="barBox">
            <div class="box" v-for="(index) in indexList" :key="index">
                <span @click="routerClick(index)">a{{index}}</span>
                <button @click="routerDel(index)" title="删除(esc)">x</button>
            </div>
        </div>
    </div>
</template>
<script>


export default {
    name: "layout",
    data() {
        return {
            indexList: [],
            usedJSHeapSize: ''
        }
    },
    mounted() {
        const usedJSHeapSize = document.getElementById("usedJSHeapSize")
        window.setInterval(() => {
            usedJSHeapSize.innerHTML = (performance.memory.usedJSHeapSize / 1000 / 1000).toFixed(2) + "mb"
        }, 1000)
        // 新增快捷键模拟用户实际 快速打开关闭场景
        document.onkeydown = (event) => {
            event = event || window.event;
            if (event.keyCode == 13) {//新增 
                this.routerAdd()
            } else if (event.keyCode == 27) {  //删除  
                this.routerDel() 
            } else if (event.keyCode == 8) {  //垃圾回收  
                this.gc() 
            }
        };
    },
    computed: {
        indexNameList() {
            const res = ['index']//
            this.indexList.forEach(index => {
                res.push(`a${index}`)
            }) 
            return res
        }
    },
    methods: {
        routerAdd() {
            let index = 0
            this.indexList.length > 0 && (index = Math.max(...this.indexList)) 
            index++ 
            this.indexList.push(index)
            this.$router.$append(index)
            this.$router.$push(index)
        },
        routerDel(index) { 
            // setTimeout(() => {
                if (this.indexList.length == 0) return
                if(!index) {
                    index = Math.max(...this.indexList)
                }  
                //每次删除都先跳回到首页, 确保删除的view 不是正在显示的view
                if (this.$route.path !== '/sub/index') { 
                    this.$router.push('/sub/index') 
                }
                let delIndex = this.indexList.findIndex((item) => item == index)
                this.$delete(this.indexList, delIndex)
                //延迟执行，加到下一个宏任务
                setTimeout(() => {
                    this.gc() 
                }, 100);
            // }, 1000);//通过下一次宏任务来执行，先让当前组件的鼠标各种事件优先执行。
        },
        routerClick(index) {
            this.$router.$push(index)
        },
        gc(){
            //强制垃圾回收 需要在浏览器启动设置 --js-flags="--expose-gc",并且不打开控制台，没有效果
            window.gc && window.gc()
        }, 
    }
};
</script>

<style scoped>
.keepaliveBox {
    border: 1px solid red;
    padding: 3px;
}

.barBox {
    display: flex;
    flex-wrap: wrap;
}

.box {
    margin: 2px;
    min-width: 70px;
}

.box>span {
    padding: 0 2px;
    background: black;
    color: #fff;
}
</style>